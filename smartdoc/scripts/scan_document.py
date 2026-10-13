from pathlib import Path
import argparse

import cv2
import numpy as np
from ultralytics import YOLO


PROJECT_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = (
    PROJECT_DIR
    / "runs"
    / "document_segmentation_perspective"
    / "weights"
    / "best.pt"
)

OUTPUT_DIR = PROJECT_DIR / "runs" / "scanned_documents"
DEBUG_DIR = PROJECT_DIR / "runs" / "scan_debug"


def preprocess(image):
    """Menyamakan kualitas gambar inferensi dengan proses training."""
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
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


def order_points(points):
    """Urutkan empat sudut: kiri atas, kanan atas,
    kanan bawah, kiri bawah."""
    points = np.asarray(points, dtype=np.float32).reshape(4, 2)
    center = points.mean(axis=0)
    angles = np.arctan2(
        points[:, 1] - center[1],
        points[:, 0] - center[0],
    )
    ordered = points[np.argsort(angles)]

    if cv2.contourArea(ordered.reshape(-1, 1, 2), oriented=True) < 0:
        ordered = ordered[::-1]

    start = int(np.argmin(ordered.sum(axis=1)))
    return np.roll(ordered, -start, axis=0).astype(np.float32)


def find_page_corners(image):
    """Cari batas kertas dari kontras warna jika mask model kurang tepat."""
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lightness = lab[:, :, 0]
    saturation = hsv[:, :, 1]

    min_dimension = min(image.shape[:2])
    kernel_size = max(5, int(round(min_dimension * 0.016)) | 1)
    kernel = cv2.getStructuringElement(
        cv2.MORPH_ELLIPSE,
        (kernel_size, kernel_size),
    )
    image_area = image.shape[0] * image.shape[1]
    best_corners = None
    best_score = 0.0

    threshold_passes = (
        (145, 155, 165, 175, 185),
        (130, 120, 110, 100, 90, 80),
    )
    threshold_corners = None

    for thresholds in threshold_passes:
        best_corners = None
        best_score = 0.0

        for threshold in thresholds:
            mask = cv2.bitwise_and(
                cv2.inRange(lightness, threshold, 255),
                cv2.inRange(saturation, 0, 130),
            )
            mask = cv2.morphologyEx(
                mask,
                cv2.MORPH_CLOSE,
                kernel,
                iterations=2,
            )
            contours, _ = cv2.findContours(
                mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
            )

            for contour in contours:
                area = cv2.contourArea(contour)
                area_ratio = area / image_area
                if not 0.12 <= area_ratio <= 0.90:
                    continue

                hull = cv2.convexHull(contour)
                hull_area = cv2.contourArea(hull)
                if hull_area == 0 or area / hull_area < 0.92:
                    continue

                perimeter = cv2.arcLength(contour, True)
                for factor in (0.01, 0.015, 0.02, 0.03):
                    approx = cv2.approxPolyDP(
                        contour,
                        factor * perimeter,
                        True,
                    )
                    if len(approx) != 4 or not cv2.isContourConvex(approx):
                        continue

                    corners = order_points(approx.reshape(4, 2))
                    top_left, top_right, bottom_right, bottom_left = corners
                    width = (
                        np.linalg.norm(top_right - top_left)
                        + np.linalg.norm(bottom_right - bottom_left)
                    ) / 2
                    height = (
                        np.linalg.norm(bottom_left - top_left)
                        + np.linalg.norm(bottom_right - top_right)
                    ) / 2
                    if min(width, height) < min_dimension * 0.2:
                        continue

                    aspect_ratio = max(width, height) / min(width, height)
                    if not 1.1 <= aspect_ratio <= 3.0:
                        continue

                    score = area_ratio * (area / hull_area)
                    if score > best_score:
                        best_score = score
                        best_corners = corners

        if best_corners is not None:
            threshold_corners = refine_bottom_left_corner(image, best_corners)
            break

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 30, 90)
    edge_kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (5, 5),
    )
    edges = cv2.morphologyEx(
        edges,
        cv2.MORPH_CLOSE,
        edge_kernel,
        iterations=2,
    )
    contours, _ = cv2.findContours(
        edges,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE,
    )

    best_corners = None
    best_score = 0.0
    for contour in contours:
        area = cv2.contourArea(contour)
        area_ratio = area / image_area
        if not 0.12 <= area_ratio <= 0.90:
            continue

        hull = cv2.convexHull(contour)
        hull_area = cv2.contourArea(hull)
        if hull_area == 0 or area / hull_area < 0.90:
            continue

        perimeter = cv2.arcLength(contour, True)
        for factor in (0.01, 0.015, 0.02, 0.03):
            approx = cv2.approxPolyDP(
                contour,
                factor * perimeter,
                True,
            )
            if len(approx) != 4 or not cv2.isContourConvex(approx):
                continue

            corners = order_points(approx.reshape(4, 2))
            top_left, top_right, bottom_right, bottom_left = corners
            width = (
                np.linalg.norm(top_right - top_left)
                + np.linalg.norm(bottom_right - bottom_left)
            ) / 2
            height = (
                np.linalg.norm(bottom_left - top_left)
                + np.linalg.norm(bottom_right - top_right)
            ) / 2
            if min(width, height) < min_dimension * 0.2:
                continue

            aspect_ratio = max(width, height) / min(width, height)
            if not 1.1 <= aspect_ratio <= 3.0:
                continue

            score = area_ratio * (area / hull_area)
            if score > best_score:
                best_score = score
                best_corners = corners

    edge_corners = best_corners
    if threshold_corners is not None:
        margin = min_dimension * 0.03
        threshold_touches_frame = np.any(
            (threshold_corners[:, 0] < margin)
            | (threshold_corners[:, 0] > image.shape[1] - margin)
            | (threshold_corners[:, 1] < margin)
            | (threshold_corners[:, 1] > image.shape[0] - margin)
        )
        edge_is_interior = (
            edge_corners is not None
            and np.all(edge_corners[:, 0] >= margin)
            and np.all(edge_corners[:, 0] <= image.shape[1] - margin)
            and np.all(edge_corners[:, 1] >= margin)
            and np.all(edge_corners[:, 1] <= image.shape[0] - margin)
        )
        if threshold_touches_frame and edge_is_interior:
            return edge_corners
        return threshold_corners

    if edge_corners is not None:
        return refine_bottom_left_corner(image, edge_corners)

    return None


def refine_bottom_left_corner(image, corners):
    """Snap a frame-clipped lower-left corner to intersecting paper edges."""
    height, width = image.shape[:2]
    corners = order_points(corners)
    bottom_left = corners[3]
    if bottom_left[0] > width * 0.01 or bottom_left[1] < height * 0.97:
        return corners

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 30, 90)
    lines = cv2.HoughLinesP(
        edges,
        1,
        np.pi / 180,
        threshold=30,
        minLineLength=max(30, int(min(height, width) * 0.06)),
        maxLineGap=max(15, int(min(height, width) * 0.025)),
    )
    if lines is None:
        return corners

    horizontal_lines = []
    vertical_lines = []
    for line in lines[:, 0]:
        x1, y1, x2, y2 = map(float, line)
        dx, dy = x2 - x1, y2 - y1
        angle = abs(np.degrees(np.arctan2(dy, dx)))
        length = np.hypot(dx, dy)

        if (
            angle < 12
            and min(y1, y2) > height * 0.75
            and max(y1, y2) < height * 0.98
        ):
            horizontal_lines.append((x1, y1, x2, y2, length))
        elif angle > 78 and max(x1, x2) < width * 0.15:
            vertical_lines.append((x1, y1, x2, y2, length))

    best_point = None
    best_score = float("-inf")
    top_left_x = float(corners[0, 0])
    for horizontal in horizontal_lines:
        hx1, hy1, hx2, hy2, h_length = horizontal
        h_slope = (hy2 - hy1) / (hx2 - hx1) if hx2 != hx1 else 0.0
        for vertical in vertical_lines:
            vx1, vy1, vx2, vy2, v_length = vertical
            v_slope = (vx2 - vx1) / (vy2 - vy1) if vy2 != vy1 else 0.0
            denominator = 1.0 - h_slope * v_slope
            if abs(denominator) < 1e-6:
                continue

            point_y = (
                hy1 + h_slope * (vx1 - hx1)
            ) / denominator
            point_x = vx1 + v_slope * (point_y - vy1)
            point = np.array([point_x, point_y], dtype=np.float32)
            if not (
                0 <= point_x <= width * 0.15
                and height * 0.75 <= point_y < height
                and np.linalg.norm(point - bottom_left) < min(height, width) * 0.15
            ):
                continue

            horizontal_span = sorted((hx1, hx2))
            vertical_span = sorted((vy1, vy2))
            if not (
                horizontal_span[0] - 20 <= point_x <= horizontal_span[1] + 20
                and vertical_span[0] - 30 <= point_y <= vertical_span[1] + 30
            ):
                continue

            score = (
                h_length
                + v_length
                - 2 * abs(point_x - top_left_x)
                - 0.25 * np.linalg.norm(point - bottom_left)
            )
            if score > best_score:
                best_score = score
                best_point = point

    if best_point is not None:
        corners[3] = best_point
    return corners


def bbox_iou(corners, box):
    """Hitung IoU antara batas kandidat sudut dan kotak deteksi model."""
    candidate_x1 = float(corners[:, 0].min())
    candidate_y1 = float(corners[:, 1].min())
    candidate_x2 = float(corners[:, 0].max())
    candidate_y2 = float(corners[:, 1].max())
    box_x1, box_y1, box_x2, box_y2 = map(float, box)

    intersection_width = max(
        0.0, min(candidate_x2, box_x2) - max(candidate_x1, box_x1)
    )
    intersection_height = max(
        0.0, min(candidate_y2, box_y2) - max(candidate_y1, box_y1)
    )
    intersection = intersection_width * intersection_height
    candidate_area = (candidate_x2 - candidate_x1) * (
        candidate_y2 - candidate_y1
    )
    box_area = (box_x2 - box_x1) * (box_y2 - box_y1)
    union = candidate_area + box_area - intersection
    return intersection / union if union > 0 else 0.0


def get_document_corners(mask):
    """Cari empat sudut dokumen dari mask segmentasi."""
    mask = (mask > 0.5).astype(np.uint8) * 255

    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(
        mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    if not contours:
        raise ValueError("Kontur dokumen tidak ditemukan.")

    contour = max(contours, key=cv2.contourArea)
    contour_area = cv2.contourArea(contour)

    if contour_area < 100:
        raise ValueError("Area mask dokumen terlalu kecil.")

    hull = cv2.convexHull(contour)
    perimeter = cv2.arcLength(hull, True)



    for factor in (0.01, 0.015, 0.02, 0.03, 0.04, 0.05, 0.07, 0.10):
        approx = cv2.approxPolyDP(hull, factor * perimeter, True)
        if len(approx) == 4:
            corners = approx.reshape(4, 2).astype(np.float32)
            return order_points(corners)




    rect = cv2.minAreaRect(hull)
    corners = cv2.boxPoints(rect)
    return order_points(corners.astype(np.float32))


def straighten_document(image, corners):
    """Luruskan perspektif dokumen menggunakan empat sudut gambar asli."""
    corners = order_points(corners)
    top_left, top_right, bottom_right, bottom_left = corners

    width_top = np.linalg.norm(top_right - top_left)
    width_bottom = np.linalg.norm(bottom_right - bottom_left)
    height_left = np.linalg.norm(bottom_left - top_left)
    height_right = np.linalg.norm(bottom_right - top_right)

    output_width = max(1, int(round(max(width_top, width_bottom))))
    output_height = max(1, int(round(max(height_left, height_right))))

    destination = np.array(
        [
            [0, 0],
            [output_width - 1, 0],
            [output_width - 1, output_height - 1],
            [0, output_height - 1],
        ],
        dtype=np.float32,
    )

    matrix = cv2.getPerspectiveTransform(corners, destination)

    return cv2.warpPerspective(
        image,
        matrix,
        (output_width, output_height),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE,
    )


def save_corner_debug(image, corners, image_path):
    """Simpan sudut yang dipakai untuk warp agar hasilnya mudah diperiksa."""
    annotated = image.copy()
    points = np.round(corners).astype(np.int32)
    cv2.polylines(annotated, [points], True, (0, 0, 255), 3)

    for index, point in enumerate(points):
        cv2.circle(annotated, tuple(point), 8, (0, 255, 0), -1)
        cv2.putText(
            annotated,
            str(index + 1),
            tuple(point + np.array([8, -8])),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2,
        )

    debug_path = DEBUG_DIR / f"{image_path.stem}_corners.jpg"
    if not cv2.imwrite(str(debug_path), annotated):
        raise OSError(f"Gagal menyimpan visualisasi sudut: {debug_path}")
    print(f"Visualisasi sudut: {debug_path}")


def save_debug_image(image, result, image_path):
    """Simpan visualisasi deteksi untuk membantu diagnosis."""
    DEBUG_DIR.mkdir(parents=True, exist_ok=True)

    annotated = result.plot()

    debug_path = DEBUG_DIR / f"{image_path.stem}_detection.jpg"
    cv2.imwrite(str(debug_path), annotated)

    if result.masks is not None and len(result.masks.data) > 0:
        masks = result.masks.data.cpu().numpy()
        best_index = int(result.boxes.conf.argmax())

        mask = (masks[best_index] > 0.5).astype(np.uint8) * 255
        mask_path = DEBUG_DIR / f"{image_path.stem}_mask.png"
        cv2.imwrite(str(mask_path), mask)

        print(f"Mask debug      : {mask_path}")

    print(f"Gambar deteksi  : {debug_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Deteksi dan luruskan dokumen dengan SmartDoc."
    )

    parser.add_argument("image", help="Path gambar dokumen")

    parser.add_argument(
        "--imgsz",
        type=int,
        default=960,
        help="Ukuran inferensi YOLO (default: 960)",
    )

    parser.add_argument(
        "--conf",
        type=float,
        default=0.01,
        help="Confidence minimum deteksi (default: 0.01)",
    )

    parser.add_argument(
        "--model",
        type=Path,
        default=MODEL_PATH,
        help="Path checkpoint YOLO",
    )

    args = parser.parse_args()

    image_path = Path(args.image)

    if not image_path.is_file():
        raise FileNotFoundError(
            f"Gambar tidak ditemukan: {image_path}"
        )

    if not args.model.is_file():
        raise FileNotFoundError(
            f"Model tidak ditemukan: {args.model}"
        )

    image = cv2.imread(str(image_path))

    if image is None:
        raise ValueError(
            f"Gambar tidak dapat dibaca: {image_path}"
        )

    processed = preprocess(image)

    DEBUG_DIR.mkdir(parents=True, exist_ok=True)
    preprocessed_path = DEBUG_DIR / f"{image_path.stem}_preprocessed.jpg"
    cv2.imwrite(str(preprocessed_path), processed)

    print(f"Gambar input : {image_path}")
    print(f"Ukuran       : {image.shape[1]} x {image.shape[0]}")
    print(f"Ukuran preproc: {processed.shape[1]} x {processed.shape[0]}")
    print(f"Model        : {args.model}")
    print(f"imgsz        : {args.imgsz}")
    print(f"conf         : {args.conf}")

    model = YOLO(str(args.model))

    results = model.predict(
        source=processed,
        imgsz=args.imgsz,
        conf=args.conf,
        retina_masks=True,
        device="cpu",
        verbose=False,
    )

    result = results[0]


    if result.boxes is not None and len(result.boxes) > 0:
        confidences = result.boxes.conf.cpu().numpy()
        print(f"Jumlah deteksi: {len(confidences)}")
        print(f"Confidence    : {confidences.round(3).tolist()}")
    else:
        print("Model tidak menghasilkan kotak deteksi.")

    save_debug_image(image, result, image_path)

    corners = find_page_corners(image)
    has_detection = (
        result.boxes is not None
        and len(result.boxes) > 0
    )
    if corners is not None and has_detection:
        best_index = int(result.boxes.conf.argmax())
        box = result.boxes.xyxy[best_index].cpu().numpy()
        box[0::2] *= image.shape[1] / processed.shape[1]
        box[1::2] *= image.shape[0] / processed.shape[0]
        overlap = bbox_iou(corners, box)
        confidence = float(result.boxes.conf[best_index])
        if confidence < 0.60:
            corner_source = f"kontur kertas (IoU {overlap:.2f})"
        else:
            print(
                f"Kontur kertas diabaikan; menggunakan mask model "
                f"(confidence {confidence:.2f}, IoU {overlap:.2f})."
            )
            corners = None
    elif corners is not None:
        corner_source = "kontur kertas"
    if corners is None and (
        result.masks is not None
        and result.boxes is not None
        and len(result.masks.data) > 0
        and len(result.boxes) > 0
    ):
        best_index = int(result.boxes.conf.argmax())
        mask = result.masks.data[best_index].cpu().numpy()
        corners = get_document_corners(mask)
        corners[:, 0] *= image.shape[1] / mask.shape[1]
        corners[:, 1] *= image.shape[0] / mask.shape[0]
        corner_source = "mask segmentasi"
    elif corners is None:
        raise ValueError(
            "Sudut dokumen tidak berhasil ditemukan dari kontur maupun mask. "
            "Periksa gambar deteksi di folder runs/scan_debug."
        )

    print(f"Sumber sudut  : {corner_source}")
    save_corner_debug(image, corners, image_path)
    straightened = straighten_document(image, corners)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"{image_path.stem}_scan.jpg"

    if not cv2.imwrite(str(output_path), straightened):
        raise OSError(f"Gagal menyimpan hasil scan: {output_path}")

    print(f"\nHasil scan tersimpan di: {output_path}")


if __name__ == "__main__":
    main()
