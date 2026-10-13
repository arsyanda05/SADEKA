from pathlib import Path
import argparse

import cv2
import numpy as np
from ultralytics import YOLO

PROJECT_DIR = Path(r"C:\Users\ARSYANDA\SEM 5\SmartDoc")
MODEL_PATH = (
    PROJECT_DIR / "runs" / "document_segmentation_perspective"
    / "weights" / "best.pt"
)
DEBUG_DIR = PROJECT_DIR / "runs" / "scan_debug"


def preprocess(image):

    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)

    clahe = cv2.createCLAHE(
        clipLimit=2.0, tileGridSize=(8, 8)
    )
    l_channel = clahe.apply(l_channel)

    enhanced = cv2.cvtColor(
        cv2.merge((l_channel, a_channel, b_channel)),
        cv2.COLOR_LAB2BGR,
    )


    enhanced = cv2.resize(
        enhanced,
        None,
        fx=1.5,
        fy=1.5,
        interpolation=cv2.INTER_CUBIC,
    )
    return enhanced


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("image")
    args = parser.parse_args()

    image_path = Path(args.image)
    image = cv2.imread(str(image_path))

    if image is None:
        raise ValueError(f"Gambar tidak dapat dibaca: {image_path}")

    processed = preprocess(image)

    DEBUG_DIR.mkdir(parents=True, exist_ok=True)
    preprocessed_path = DEBUG_DIR / f"{image_path.stem}_preprocessed.jpg"
    cv2.imwrite(str(preprocessed_path), processed)

    model = YOLO(str(MODEL_PATH))
    results = model.predict(
        source=processed,
        imgsz=960,
        conf=0.01,
        device="cpu",
        retina_masks=True,
        verbose=False,
    )

    result = results[0]
    annotated = result.plot()
    detection_path = DEBUG_DIR / f"{image_path.stem}_preprocessed_detection.jpg"
    cv2.imwrite(str(detection_path), annotated)

    if result.boxes is None or len(result.boxes) == 0:
        print("Belum ada deteksi pada gambar preprocessing.")
    else:
        print("Jumlah deteksi:", len(result.boxes))
        print("Confidence:", result.boxes.conf.cpu().numpy().round(3).tolist())

    print("Gambar preprocessing:", preprocessed_path)
    print("Visualisasi deteksi:", detection_path)


if __name__ == "__main__":
    main()
