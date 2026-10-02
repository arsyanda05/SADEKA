from pathlib import Path
import sys
import joblib

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_ROOT = Path(__file__).resolve().parent

for path in [str(PROJECT_ROOT), str(SRC_ROOT)]:
    if path not in sys.path:
        sys.path.insert(0, path)

from preprocess import preprocess_text

MODEL_PATH = PROJECT_ROOT / "models" / "model_intent_sadeka.pkl"

model = joblib.load(MODEL_PATH)

pertanyaan = [
    "Tampilkan penduduk perempuan di RW 05",
    "Mohon tampilkan data penduduk perempuan di wilayah RW 03",
    "Lihat data penduduk perempuan di RW 02",
    "Tampilkan data penduduk laki-laki di wilayah RW 03",
    "Tampilkan daftar warga di RW 05",
]

for text in pertanyaan:
    processed = preprocess_text(text)
    probabilities = model.predict_proba([processed])[0]

    hasil = sorted(
        zip(model.classes_, probabilities),
        key=lambda x: x[1],
        reverse=True
    )

    print("\nPertanyaan :", text)
    print("Preprocess :", processed)
    print("Probabilitas:")

    for intent, probability in hasil[:5]:
        print(f"  {intent:<25} {probability:.4f}")