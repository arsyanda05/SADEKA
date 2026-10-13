from pathlib import Path

PROJECT_DIR = Path(r"C:\Users\ARSYANDA\SEM 5\SmartDoc")
DATASET_DIR = PROJECT_DIR / "dataset"

SPLITS = ("train", "val", "test")


def convert_label(src: Path, dst: Path) -> bool:
    """Convert four normalized corner points to YOLO segmentation format."""
    try:
        lines = [
            line.strip()
            for line in src.read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]

        points = []
        for line in lines:
            values = line.split()
            if len(values) != 2:
                raise ValueError("Setiap baris harus berisi x dan y.")

            x, y = map(float, values)
            if not (0.0 <= x <= 1.0 and 0.0 <= y <= 1.0):
                raise ValueError("Koordinat harus berada di rentang 0 sampai 1.")

            points.extend((x, y))

        if len(points) != 8:
            raise ValueError(
                f"Harus ada 4 titik (8 angka), ditemukan {len(points)} angka."
            )

        dst.write_text(
            "0 " + " ".join(f"{value:.6f}" for value in points) + "\n",
            encoding="utf-8",
        )
        return True

    except (ValueError, OSError) as exc:
        print(f"[GAGAL] {src.name}: {exc}")
        return False


def main():
    total_ok = 0
    total_failed = 0

    for split in SPLITS:
        source_dir = DATASET_DIR / "labels" / split
        output_dir = DATASET_DIR / "labels_yolo" / split
        output_dir.mkdir(parents=True, exist_ok=True)

        files = sorted(source_dir.glob("*.txt"))
        if not files:
            print(f"[PERINGATAN] Tidak ada file label: {source_dir}")
            continue

        ok = 0
        failed = 0

        for src in files:
            dst = output_dir / src.name
            if convert_label(src, dst):
                ok += 1
            else:
                failed += 1

        total_ok += ok
        total_failed += failed
        print(f"{split}: berhasil {ok}, gagal {failed}")

    print("\n=== RINGKASAN ===")
    print(f"Berhasil: {total_ok}")
    print(f"Gagal   : {total_failed}")
    print("Label asli tetap tersimpan di dataset/labels.")


if __name__ == "__main__":
    main()