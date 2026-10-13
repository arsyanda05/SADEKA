import os

os.environ["FLAGS_use_mkldnn"] = "0"

import argparse
import json
from pathlib import Path
import sys
import traceback

import cv2
from paddleocr import PaddleOCR


PROJECT_DIR = Path(__file__).resolve().parent.parent
INPUT_DIR = PROJECT_DIR / "runs" / "ocr_preprocessing"
OUTPUT_DIR = PROJECT_DIR / "runs" / "ocr_results"

INPUT_PATTERN = "*_B_shadow_corrected.png"


def find_input_image():
    """Ambil gambar Versi B terbaru."""
    if not INPUT_DIR.is_dir():
        raise FileNotFoundError(
            f"Folder input tidak ditemukan: {INPUT_DIR}"
        )

    files = sorted(
        INPUT_DIR.glob(INPUT_PATTERN),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )

    if not files:
        raise FileNotFoundError(
            f"Gambar dengan pola {INPUT_PATTERN} "
            f"tidak ditemukan di {INPUT_DIR}"
        )

    return files[0]


def extract_lines(result):
    """Return recognized text lines and their boxes from PaddleOCR 3.x."""
    data = getattr(result, "json", result)

    if callable(data):
        data = data()

    if not isinstance(data, dict):
        return [], []

    data = data.get("res", data)

    if not isinstance(data, dict):
        return [], []

    texts = data.get("rec_texts", [])
    boxes = data.get("rec_boxes", [])

    if not isinstance(texts, list):
        return [], []

    normalized_texts = [str(text).strip() for text in texts]
    cleaned_texts = [text for text in normalized_texts if text]
    if not isinstance(boxes, list) or len(boxes) != len(texts):
        return cleaned_texts, []

    lines = []
    for text, box in zip(normalized_texts, boxes):
        if not text:
            continue
        if not isinstance(box, (list, tuple)) or len(box) < 4:
            return cleaned_texts, []
        lines.append((text, [float(value) for value in box[:4]]))
    lines.sort(key=lambda line: (line[1][1], line[1][0]))
    return [line[0] for line in lines], [line[1] for line in lines]


def main():
    parser = argparse.ArgumentParser(
        description="Baca teks dari hasil scan dokumen dengan PaddleOCR."
    )
    parser.add_argument(
        "image",
        nargs="?",
        type=Path,
        help=(
            "Path gambar yang ingin dibaca. Jika tidak diisi, gunakan "
            "gambar koreksi bayangan terbaru di runs/ocr_preprocessing."
        ),
    )
    parser.add_argument(
        "--layout-output",
        type=Path,
        help="Simpan posisi baris OCR agar ekspor dokumen tidak perlu menjalankan OCR ulang.",
    )
    args = parser.parse_args()

    image_path = args.image or find_input_image()
    if not image_path.is_file():
        raise FileNotFoundError(f"Gambar tidak ditemukan: {image_path}")

    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError(
            f"Gambar tidak dapat dibaca: {image_path}"
        )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    output_text_path = (
        OUTPUT_DIR / f"{image_path.stem}_ocr.txt"
    )

    print(f"Gambar input : {image_path}")
    print(f"File teks    : {output_text_path}")
    print("Memuat model OCR bahasa Indonesia di CPU...")

    ocr = PaddleOCR(
        lang="id",
        device="cpu",
        enable_mkldnn=False,
        use_doc_orientation_classify=False,
        use_doc_unwarping=False,
        use_textline_orientation=False,
    )

    print("Menjalankan OCR...")
    results = ocr.predict(input=str(image_path))

    lines = []
    boxes = []
    for result in results:
        result_lines, result_boxes = extract_lines(result)
        lines.extend(result_lines)
        boxes.extend(result_boxes)

    text = "\n".join(lines)
    output_text_path.write_text(
        text,
        encoding="utf-8",
    )
    if args.layout_output is not None:
        args.layout_output.parent.mkdir(parents=True, exist_ok=True)
        args.layout_output.write_text(
            json.dumps(
                {
                    "image_shape": list(image.shape),
                    "rows": [
                        {"text": line, "box": box}
                        for line, box in zip(lines, boxes)
                    ],
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )

    print("\n========== HASIL OCR ==========")
    if text:
        print(text)
    else:
        print("Tidak ada teks yang berhasil dikenali.")

    print("\n========== RINGKASAN ==========")
    print(f"Jumlah baris : {len(lines)}")
    print(f"Gambar input : {image_path}")
    print(f"Teks hasil   : {output_text_path}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"\nOCR gagal: {error}", file=sys.stderr)
        traceback.print_exc()
        sys.exit(1)
