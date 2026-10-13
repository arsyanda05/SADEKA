
from pathlib import Path

import cv2
import numpy as np


PROJECT_DIR = Path(r"C:\Users\ARSYANDA\SEM 5\SmartDoc")

INPUT_DIR = PROJECT_DIR / "runs" / "scanned_documents"
OUTPUT_DIR = PROJECT_DIR / "runs" / "ocr_preprocessing"


def make_grayscale_contrast(image):
    """Versi A: grayscale dengan peningkatan kontras ringan."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    clahe = cv2.createCLAHE(
        clipLimit=1.3,
        tileGridSize=(8, 8),
    )

    return clahe.apply(gray)


def make_shadow_corrected(image):
    """Versi B: koreksi pencahayaan latar dokumen."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


    background = cv2.GaussianBlur(
        gray,
        (0, 0),
        sigmaX=25,
        sigmaY=25,
    )


    corrected = cv2.divide(
        gray,
        np.maximum(background, 1),
        scale=220,
    )


    corrected = np.clip(corrected, 0, 255).astype(np.uint8)

    return corrected


def make_adaptive_threshold(gray):
    """Versi C: hitam-putih sebagai pembanding OCR."""
    denoised = cv2.GaussianBlur(gray, (3, 3), 0)

    return cv2.adaptiveThreshold(
        denoised,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        41,
        5,
    )


def main():
    if not INPUT_DIR.is_dir():
        raise FileNotFoundError(
            f"Folder scan tidak ditemukan: {INPUT_DIR}"
        )

    files = sorted(
        INPUT_DIR.glob("*_scan.jpg"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )

    if not files:
        raise FileNotFoundError(
            f"Tidak ada file *_scan.jpg di {INPUT_DIR}"
        )


    input_path = files[0]
    image = cv2.imread(str(input_path))

    if image is None:
        raise ValueError(f"Gagal membaca gambar: {input_path}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


    version_a = make_grayscale_contrast(image)


    version_b = make_shadow_corrected(image)


    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    version_c = make_adaptive_threshold(gray)

    outputs = {
        "A_grayscale_contrast.png": version_a,
        "B_shadow_corrected.png": version_b,
        "C_adaptive_threshold.png": version_c,
    }

    for filename, result in outputs.items():
        output_path = OUTPUT_DIR / (
            f"{input_path.stem}_{filename}"
        )

        if not cv2.imwrite(str(output_path), result):
            raise OSError(
                f"Gagal menyimpan gambar: {output_path}"
            )

        print(f"Tersimpan: {output_path}")

    print("\nSemua versi berhasil dibuat.")
    print(f"Sumber: {input_path}")


if __name__ == "__main__":
    main()
