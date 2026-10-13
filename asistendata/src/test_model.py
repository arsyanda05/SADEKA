from pathlib import Path

import joblib

from preprocess import preprocess_text


PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "model_intent_sadeka.pkl"

model = joblib.load(MODEL_PATH)

print("=== TEST ASISTEN DATA ===")
print("Ketik 'exit' untuk keluar.\n")

while True:
    pertanyaan = input("Pertanyaan: ")

    if pertanyaan.lower() == "exit":
        break

    pertanyaan_proses = preprocess_text(pertanyaan)

    intent = model.predict([pertanyaan_proses])[0]

    print("Intent     :", intent)
    print()