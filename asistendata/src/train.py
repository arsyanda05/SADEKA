from pathlib import Path
import sys

import pandas as pd
import joblib
import numpy as np

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_ROOT = Path(__file__).resolve().parent
for path in [str(PROJECT_ROOT), str(SRC_ROOT)]:
    if path not in sys.path:
        sys.path.insert(0, path)

try:
    from preprocess import preprocess_text
except ModuleNotFoundError:
    from src.preprocess import preprocess_text


# ==========================================
# 1. Membaca dataset
# ==========================================

DATASET_PATH = PROJECT_ROOT / "dataset" / "dataset_intent_sadeka.csv"
MODEL_PATH = PROJECT_ROOT / "models" / "model_intent_sadeka.pkl"

MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(DATASET_PATH)

print("=== DATASET ===")
print(f"Jumlah data : {len(df)}")
print(f"Jumlah intent : {df['intent'].nunique()}")

print("\nDistribusi data:")
print(df["intent"].value_counts())


# ==========================================
# 2. Preprocessing
# ==========================================

df["pertanyaan_proses"] = df["pertanyaan"].apply(
    preprocess_text
)

X = df["pertanyaan_proses"]
y = df["intent"]


# ==========================================
# 3. Membuat pipeline model
# ==========================================

model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
            sublinear_tf=True
        )
    ),

    (
        "classifier",
        LogisticRegression(
            max_iter=1000,
            random_state=42
        )
    )
])


# ==========================================
# 4. Evaluasi dengan Stratified K-Fold Cross Validation
# ==========================================
# Dataset ini masih tergolong kecil per kelas (puluhan contoh),
# sehingga satu kali train/test split saja tidak cukup meyakinkan
# (hasil bisa berubah drastis hanya karena kebetulan split tertentu).
# Cross-validation memberi gambaran performa yang lebih stabil karena
# setiap baris data ikut diuji secara bergantian.

min_class_count = y.value_counts().min()
n_splits = min(5, min_class_count)

print(f"\n=== CROSS VALIDATION ({n_splits}-fold) ===")

if n_splits >= 2:
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X, y, cv=skf, scoring="accuracy")

    print(f"Akurasi tiap fold : {np.round(cv_scores, 4)}")
    print(f"Rata-rata akurasi : {cv_scores.mean():.4f}")
    print(f"Standar deviasi   : {cv_scores.std():.4f}")
else:
    print("Dilewati: ada kelas dengan jumlah contoh < 2, cross-validation "
          "tidak bisa dilakukan dengan stratifikasi. Tambah data untuk "
          "kelas tersebut.")


# ==========================================
# 5. Train/test split untuk laporan detail per kelas
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# ==========================================
# Menyimpan data latih dan data uji
# ==========================================

TRAIN_DATA_PATH = PROJECT_ROOT / "dataset" / "data_latih.csv"
TEST_DATA_PATH = PROJECT_ROOT / "dataset" / "data_uji.csv"

# Ambil index data hasil pembagian
train_indices = X_train.index
test_indices = X_test.index

# Ambil data asli berdasarkan index
data_latih = df.loc[train_indices, ["pertanyaan", "intent"]].copy()
data_uji = df.loc[test_indices, ["pertanyaan", "intent"]].copy()

# Simpan ke CSV
data_latih.to_csv(TRAIN_DATA_PATH, index=False)
data_uji.to_csv(TEST_DATA_PATH, index=False)

print("\n=== DATA LATIH & DATA UJI ===")
print(f"Data latih disimpan : {TRAIN_DATA_PATH}")
print(f"Jumlah data latih   : {len(data_latih)}")

print(f"Data uji disimpan   : {TEST_DATA_PATH}")
print(f"Jumlah data uji     : {len(data_uji)}")

print("\n=== PEMBAGIAN DATA (untuk classification report) ===")
print(f"Data training : {len(X_train)}")
print(f"Data testing  : {len(X_test)}")

model.fit(X_train, y_train)
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\n=== HASIL EVALUASI (holdout test set) ===")
print(f"Accuracy : {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, zero_division=0))


# ==========================================
# 6. Cek distribusi confidence (untuk menentukan threshold fallback)
# ==========================================
# Ini dipakai assistant.py untuk memutuskan kapan sistem sebaiknya
# menjawab "tidak paham" alih-alih memaksa memilih salah satu intent.

proba = model.predict_proba(X_test)
max_proba = proba.max(axis=1)
benar = (y_pred == y_test.values)

print("\n=== DISTRIBUSI CONFIDENCE (holdout test set) ===")
print(f"Confidence rata-rata saat BENAR : {max_proba[benar].mean():.3f}")
if (~benar).sum() > 0:
    print(f"Confidence rata-rata saat SALAH : {max_proba[~benar].mean():.3f}")
print("Gunakan nilai di antara keduanya sebagai CONFIDENCE_THRESHOLD di assistant.py.")


# ==========================================
# 7. Melatih ulang model final dengan SELURUH data
# ==========================================
# Model yang disimpan untuk dipakai di aplikasi dilatih dari seluruh
# data (bukan hanya X_train) supaya tidak membuang informasi -- evaluasi
# di atas sudah cukup untuk mengukur performanya.

print("\n=== TRAINING MODEL FINAL (seluruh data) ===")
model.fit(X, y)
print("Training selesai.")

joblib.dump(model, MODEL_PATH)

print("\n=== MODEL ===")
print("Model berhasil disimpan di:")
print(MODEL_PATH)
