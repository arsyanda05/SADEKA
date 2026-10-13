from pathlib import Path
import argparse
import json
import math
import os
import re
import sys
from statistics import median
import traceback
import zipfile
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape as xml_escape

os.environ["FLAGS_use_mkldnn"] = "0"

from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


WORD_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
CONTENT_TYPES_NS = "http://schemas.openxmlformats.org/package/2006/content-types"
IMAGE_SUFFIXES = {".bmp", ".jpeg", ".jpg", ".png", ".tif", ".tiff", ".webp"}
BODY_FONT_SIZE = 11.0
TITLE_FONT_SIZE = 16.0
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "output"
PAGE_MARGIN = 42

ET.register_namespace("w", WORD_NS)
ET.register_namespace("", PKG_REL_NS)


def word_tag(name):
    return f"{{{WORD_NS}}}{name}"


def is_heading(text):
    letters = [character for character in text if character.isalpha()]
    return (
        bool(letters)
        and len(text) <= 70
        and text.upper() == text
        and not re.match(r"^(?:[-*]|\d+[.)])\s", text)
    )


def is_chapter_heading(text):
    return bool(
        re.match(r"^BAB\s+(?:[IVXLCDM]+|\d+)\b", text, re.IGNORECASE)
    )


def is_section_heading(text):
    return bool(re.match(r"^\d+(?:\.\d+)+\.?\s+\S", text))


def is_list_item(text):
    return bool(re.match(r"^(?:[-*]|\d+[.)])\s*", text))


def is_form_field(text):
    return bool(
        re.match(
            r"^(?:nama lengkap|alamat domisili|universitas|email|nomor whatsapp)\b",
            text,
            re.IGNORECASE,
        )
    )


def is_centered_title(text, box, image_width, image_height):
    x1, y1, x2, _ = box
    center_x = (x1 + x2) / 2
    return (
        y1 < image_height * 0.25
        and len(text) <= 70
        and abs(center_x - image_width / 2) < image_width * 0.10
    )


def is_title_line_candidate(text):
    return bool(
        text
        and not is_section_heading(text)
        and not is_form_field(text)
        and not is_list_item(text)
        and len(text) <= 70
        and not re.search(r"[.!?;:]$", text)
    )


def get_title_indexes(paragraphs, image_width, image_height):
    title_indexes = {
        index
        for index, paragraph in enumerate(paragraphs)
        if is_centered_title(
            paragraph["text"], paragraph["box"], image_width, image_height
        )
    }

    for index, paragraph in enumerate(paragraphs[:3]):
        text = paragraph["text"].strip()
        if not is_title_line_candidate(text):
            break
        title_indexes.add(index)

    return title_indexes


def get_text_title_count(lines):
    count = 0
    for text in lines[:3]:
        text = text.strip()
        if not is_title_line_candidate(text):
            break
        count += 1
    return count


def group_paragraph_rows(lines, rows, image_width, image_height):
    if len(lines) != len(rows):
        raise ValueError(
            f"Jumlah baris OCR ({len(lines)}) tidak sama dengan baris tata letak "
            f"gambar ({len(rows)}). Pastikan file .txt dan --scan-image berasal "
            "dari gambar scan yang sama."
        )

    row_heights = [
        max(0, row["box"][3] - row["box"][1])
        for row in rows
        if row["box"][3] > row["box"][1]
    ]
    line_gap_threshold = max(6, median(row_heights) * 0.75) if row_heights else 6
    groups = []
    for text, row in zip(lines, rows):
        text = text.strip()
        if not text:
            continue

        box = row["box"]
        if groups:
            previous = groups[-1]
            previous_text = previous["text"]
            previous_box = previous["box"]
            previous_is_title = is_centered_title(
                previous_text, previous_box, image_width, image_height
            )
            current_is_title = is_centered_title(
                text, box, image_width, image_height
            )
            previous_is_list = is_list_item(previous_text)
            current_is_list = is_list_item(text)
            previous_is_heading = is_heading(previous_text)
            current_is_heading = is_heading(text)
            previous_is_section = is_section_heading(previous_text)
            current_is_section = is_section_heading(text)
            previous_is_field = is_form_field(previous_text)
            current_is_field = is_form_field(text)
            vertical_gap = box[1] - previous_box[3]

            can_join = (
                not previous_is_title
                and not current_is_title
                and not previous_is_heading
                and not current_is_heading
                and not previous_is_section
                and not current_is_section
                and not previous_is_field
                and not current_is_field
                and vertical_gap <= line_gap_threshold
                and (
                    previous_is_list
                    or not re.search(r"[.!?]$", previous_text)
                )
                and (
                    (previous_is_list and not current_is_list)
                    or (not previous_is_list and not current_is_list)
                )
            )
            if can_join:
                previous["text"] = f"{previous_text} {text}"
                previous["box"] = [
                    min(previous_box[0], box[0]),
                    min(previous_box[1], box[1]),
                    max(previous_box[2], box[2]),
                    max(previous_box[3], box[3]),
                ]
                continue

        groups.append({"text": text, "box": list(box)})

    return groups


def get_layout_rows(scan_path):
    import cv2
    from paddleocr import PaddleOCR

    image = cv2.imread(str(scan_path))
    if image is None:
        raise ValueError(f"Gambar scan tidak dapat dibaca: {scan_path}")

    ocr = PaddleOCR(
        lang="id",
        device="cpu",
        enable_mkldnn=False,
        use_doc_orientation_classify=False,
        use_doc_unwarping=False,
        use_textline_orientation=False,
    )
    results = ocr.predict(input=str(scan_path))
    items = []

    for result in results:
        data = getattr(result, "json", result)
        if callable(data):
            data = data()
        if not isinstance(data, dict):
            continue
        data = data.get("res", data)
        if not isinstance(data, dict):
            continue

        texts = data.get("rec_texts", [])
        boxes = data.get("rec_boxes", [])
        if not isinstance(texts, list) or not isinstance(boxes, list):
            continue
        for text, box in zip(texts, boxes):
            if str(text).strip() and isinstance(box, (list, tuple)) and len(box) >= 4:
                items.append(
                    {
                        "text": str(text).strip(),
                        "box": [float(value) for value in box[:4]],
                    }
                )

    ordered = sorted(items, key=lambda item: (item["box"][1], item["box"][0]))
    rows = []
    for item in ordered:
        _, y1, _, y2 = item["box"]
        matched = None
        for row in reversed(rows):
            row_y1 = min(box[1] for box in row["boxes"])
            row_y2 = max(box[3] for box in row["boxes"])
            overlap = min(y2, row_y2) - max(y1, row_y1)
            shorter_height = min(y2 - y1, row_y2 - row_y1)
            if shorter_height > 0 and overlap / shorter_height >= 0.45:
                matched = row
                break
            if y1 - row_y2 > max(12, (y2 - y1) * 1.5):
                break

        if matched is None:
            rows.append({"items": [item], "boxes": [item["box"]]})
        else:
            matched["items"].append(item)
            matched["boxes"].append(item["box"])

    for row in rows:
        row["items"].sort(key=lambda item: item["box"][0])
        row["box"] = [
            min(box[0] for box in row["boxes"]),
            min(box[1] for box in row["boxes"]),
            max(box[2] for box in row["boxes"]),
            max(box[3] for box in row["boxes"]),
        ]

    return image.shape, rows


def load_layout_rows(layout_path):
    layout = json.loads(layout_path.read_text(encoding="utf-8"))
    image_shape = layout.get("image_shape")
    layout_rows = layout.get("rows")
    if (
        not isinstance(image_shape, list)
        or len(image_shape) < 2
        or not all(isinstance(value, int) and value > 0 for value in image_shape[:2])
        or not isinstance(layout_rows, list)
    ):
        raise ValueError(f"Data tata letak OCR tidak valid: {layout_path}")

    rows = []
    for item in layout_rows:
        box = item.get("box") if isinstance(item, dict) else None
        text = item.get("text") if isinstance(item, dict) else None
        if (
            not isinstance(text, str)
            or not isinstance(box, list)
            or len(box) != 4
            or not all(isinstance(value, (int, float)) and math.isfinite(value) for value in box)
        ):
            raise ValueError(f"Baris tata letak OCR tidak valid: {layout_path}")
        rows.append({"text": text, "box": [float(value) for value in box]})

    return tuple(image_shape), rows


def create_text_layout(lines):
    image_width = 794
    row_height = 24
    image_height = max(1123, 100 + len(lines) * row_height)
    title_count = get_text_title_count(lines)
    rows = []

    for index, text in enumerate(lines):
        width = min(image_width - 100, max(40, len(text) * 8))
        x1 = (
            (image_width - width) / 2
            if index < title_count
            else 50
        )
        x2 = x1 + width
        y1 = 50 + index * row_height
        rows.append({"box": [x1, y1, x2, y1 + 18]})

    return (image_height, image_width, 3), rows


def get_paragraph_kind(text, box, image_width, image_height, title_override=False):
    title = title_override or is_centered_title(
        text, box, image_width, image_height
    ) or is_chapter_heading(text)
    heading = not title and (is_heading(text) or is_section_heading(text))
    list_item = is_list_item(text)
    right_aligned = (
        not title
        and not heading
        and not list_item
        and box[0] > image_width * 0.55
        and len(text) <= 70
    )
    alignment = (
        "center"
        if title
        else "right"
        if right_aligned
        else "left"
        if heading or is_form_field(text)
        else "both"
    )
    return title, heading, list_item, alignment


def add_paragraph(
    body,
    text,
    box,
    image_width,
    image_height,
    scale,
    previous_bottom,
    title_override=False,
):
    _, y1, _, y2 = box
    title, heading, list_item, alignment = get_paragraph_kind(
        text, box, image_width, image_height, title_override
    )
    font_size = TITLE_FONT_SIZE if title else BODY_FONT_SIZE
    before = (
        max(0, y1 * scale - 42)
        if previous_bottom == 0
        else max(0, (y1 - previous_bottom) * scale)
    )

    paragraph = ET.SubElement(body, word_tag("p"))
    properties = ET.SubElement(paragraph, word_tag("pPr"))
    ET.SubElement(properties, word_tag("jc"), {word_tag("val"): alignment})
    ET.SubElement(
        properties,
        word_tag("spacing"),
        {
            word_tag("before"): str(round(before * 20)),
            word_tag("after"): "0",
            word_tag("line"): str(round(font_size * 1.15 * 20)),
            word_tag("lineRule"): "auto",
        },
    )
    if list_item:
        ET.SubElement(
            properties,
            word_tag("ind"),
            {word_tag("left"): "360", word_tag("hanging"): "240"},
        )
    if title:
        ET.SubElement(properties, word_tag("keepNext"))

    run = ET.SubElement(paragraph, word_tag("r"))
    run_properties = ET.SubElement(run, word_tag("rPr"))
    ET.SubElement(
        run_properties,
        word_tag("rFonts"),
        {
            word_tag("ascii"): "Arial",
            word_tag("hAnsi"): "Arial",
            word_tag("eastAsia"): "Arial",
        },
    )

    font_twips = str(round(font_size * 2))
    ET.SubElement(run_properties, word_tag("sz"), {word_tag("val"): font_twips})
    ET.SubElement(run_properties, word_tag("szCs"), {word_tag("val"): font_twips})
    if title or heading:
        ET.SubElement(run_properties, word_tag("b"))

    text_element = ET.SubElement(run, word_tag("t"))
    text_element.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    text_element.text = text
    return y2


def save_pdf(lines, rows, image_shape, output_path):
    image_height, image_width = image_shape[:2]
    paragraphs = group_paragraph_rows(
        lines, rows, image_width, image_height
    )
    title_indexes = get_title_indexes(paragraphs, image_width, image_height)
    page_width, page_height = A4
    scale = min(
        (page_width - 2 * PAGE_MARGIN) / image_width,
        (page_height - 2 * PAGE_MARGIN) / image_height,
    )
    styles = {
        "center": ParagraphStyle(
            "SmartDocumentTitle",
            fontName="Helvetica-Bold",
            fontSize=TITLE_FONT_SIZE,
            leading=TITLE_FONT_SIZE * 1.2,
            alignment=TA_CENTER,
        ),
        "left": ParagraphStyle(
            "SmartDocumentHeading",
            fontName="Helvetica-Bold",
            fontSize=BODY_FONT_SIZE,
            leading=BODY_FONT_SIZE * 1.2,
            alignment=TA_LEFT,
        ),
        "right": ParagraphStyle(
            "SmartDocumentRight",
            fontName="Helvetica",
            fontSize=BODY_FONT_SIZE,
            leading=BODY_FONT_SIZE * 1.2,
            alignment=TA_RIGHT,
        ),
        "both": ParagraphStyle(
            "SmartDocumentBody",
            fontName="Helvetica",
            fontSize=BODY_FONT_SIZE,
            leading=BODY_FONT_SIZE * 1.2,
            alignment=TA_JUSTIFY,
        ),
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(output_path), pagesize=A4)
    previous_bottom = PAGE_MARGIN

    for index, paragraph_data in enumerate(paragraphs):
        text = paragraph_data["text"]
        box = paragraph_data["box"]
        title, heading, list_item, alignment = get_paragraph_kind(
            text, box, image_width, image_height, index in title_indexes
        )
        style = styles[alignment]
        if list_item:
            style = ParagraphStyle(
                "SmartDocumentList",
                parent=styles["both"],
                leftIndent=18,
                firstLineIndent=-12,
            )

        paragraph = Paragraph(xml_escape(text), style)
        _, paragraph_height = paragraph.wrap(
            page_width - 2 * PAGE_MARGIN,
            page_height - 2 * PAGE_MARGIN,
        )
        top = PAGE_MARGIN + box[1] * scale
        if title or heading:
            top = max(top, previous_bottom + 8)
        else:
            top = max(top, previous_bottom + 2)

        if top + paragraph_height > page_height - PAGE_MARGIN:
            pdf.showPage()
            previous_bottom = PAGE_MARGIN
            top = PAGE_MARGIN

        paragraph.drawOn(
            pdf,
            PAGE_MARGIN,
            page_height - top - paragraph_height,
        )
        previous_bottom = top + paragraph_height

    pdf.save()


def save_docx(lines, rows, image_shape, output_path):
    image_height, image_width = image_shape[:2]
    paragraphs = group_paragraph_rows(
        lines, rows, image_width, image_height
    )
    title_indexes = get_title_indexes(paragraphs, image_width, image_height)
    page_width = 595
    page_height = 842
    margin = 42
    scale = min(
        (page_width - 2 * margin) / image_width,
        (page_height - 2 * margin) / image_height,
    )

    document = ET.Element(word_tag("document"))
    body = ET.SubElement(document, word_tag("body"))
    previous_bottom = 0.0
    for index, paragraph_data in enumerate(paragraphs):
        previous_bottom = add_paragraph(
            body,
            paragraph_data["text"],
            paragraph_data["box"],
            image_width,
            image_height,
            scale,
            previous_bottom,
            index in title_indexes,
        )

    section = ET.SubElement(body, word_tag("sectPr"))
    ET.SubElement(
        section,
        word_tag("pgSz"),
        {word_tag("w"): "11906", word_tag("h"): "16838"},
    )
    ET.SubElement(
        section,
        word_tag("pgMar"),
        {
            word_tag("top"): "840",
            word_tag("right"): "840",
            word_tag("bottom"): "840",
            word_tag("left"): "840",
            word_tag("header"): "567",
            word_tag("footer"): "567",
            word_tag("gutter"): "0",
        },
    )

    content_types = ET.Element(f"{{{CONTENT_TYPES_NS}}}Types")
    ET.SubElement(
        content_types,
        f"{{{CONTENT_TYPES_NS}}}Default",
        {
            "Extension": "rels",
            "ContentType": "application/vnd.openxmlformats-package.relationships+xml",
        },
    )
    ET.SubElement(
        content_types,
        f"{{{CONTENT_TYPES_NS}}}Default",
        {"Extension": "xml", "ContentType": "application/xml"},
    )
    ET.SubElement(
        content_types,
        f"{{{CONTENT_TYPES_NS}}}Override",
        {
            "PartName": "/word/document.xml",
            "ContentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml",
        },
    )

    relationships = ET.Element(f"{{{PKG_REL_NS}}}Relationships")
    ET.SubElement(
        relationships,
        f"{{{PKG_REL_NS}}}Relationship",
        {
            "Id": "rId1",
            "Type": "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
            "Target": "word/document.xml",
        },
    )

    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr(
            "[Content_Types].xml",
            ET.tostring(content_types, encoding="utf-8", xml_declaration=True),
        )
        archive.writestr(
            "_rels/.rels",
            ET.tostring(relationships, encoding="utf-8", xml_declaration=True),
        )
        archive.writestr(
            "word/document.xml",
            ET.tostring(document, encoding="utf-8", xml_declaration=True),
        )


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Format an OCR document as DOCX or PDF using the scan image layout."
        )
    )
    parser.add_argument(
        "source_file",
        type=Path,
        help="Path to a document image or OCR .txt file",
    )
    parser.add_argument(
        "--scan-image",
        type=Path,
        help="Optional layout reference for an OCR .txt file",
    )
    parser.add_argument(
        "--layout-json",
        type=Path,
        help="Reuse OCR text boxes produced during document processing",
    )
    parser.add_argument(
        "--format",
        choices=("docx", "pdf", "both"),
        default="docx",
        help="Output format (both writes the PDF beside the DOCX)",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Output file path; for both, provide the .docx path",
    )
    args = parser.parse_args()
    layout_reference = None

    if not args.source_file.is_file():
        raise FileNotFoundError(f"File input tidak ditemukan: {args.source_file}")

    suffix = args.source_file.suffix.lower()
    if suffix in IMAGE_SUFFIXES:
        if args.scan_image is not None:
            parser.error("--scan-image hanya digunakan bersama input file .txt")
        scan_path = args.source_file
        layout_reference = scan_path
        image_shape, rows = get_layout_rows(scan_path)
        lines = [
            " ".join(item["text"] for item in row["items"]).strip()
            for row in rows
        ]
        lines = [line for line in lines if line]
    elif suffix == ".txt":
        if args.scan_image is not None and not args.scan_image.is_file():
            raise FileNotFoundError(f"Gambar scan tidak ditemukan: {args.scan_image}")
        if args.layout_json is not None and not args.layout_json.is_file():
            raise FileNotFoundError(f"Data tata letak OCR tidak ditemukan: {args.layout_json}")
        if args.scan_image is not None and args.layout_json is not None:
            parser.error("--scan-image dan --layout-json tidak dapat digunakan bersamaan")
        text = args.source_file.read_text(encoding="utf-8-sig")
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        if args.layout_json is not None:
            image_shape, rows = load_layout_rows(args.layout_json)
            layout_reference = args.layout_json
        elif args.scan_image is None:
            image_shape, rows = create_text_layout(lines)
        else:
            image_shape, rows = get_layout_rows(args.scan_image)
            layout_reference = args.scan_image
    else:
        parser.error("Input harus berupa gambar (.jpg, .jpeg, .png, .tif, .bmp, .webp) atau file .txt")

    if not lines:
        raise ValueError(f"Tidak ada teks yang berhasil dikenali atau diformat: {args.source_file}")

    if len(lines) != len(rows) or (
        args.layout_json is not None
        and lines != [row["text"] for row in rows]
    ):
        print(
            "Teks OCR berubah dari tata letak tersimpan; "
            "menggunakan tata letak teks agar hasil edit tetap sesuai."
        )
        image_shape, rows = create_text_layout(lines)
        layout_reference = None

    default_suffix = ".pdf" if args.format == "pdf" else ".docx"
    output_path = args.output or OUTPUT_DIR / (
        f"{args.source_file.stem}_formatted{default_suffix}"
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if args.format in ("docx", "both"):
        docx_path = output_path.with_suffix(".docx")
        save_docx(lines, rows, image_shape, docx_path)
    if args.format in ("pdf", "both"):
        pdf_path = (
            output_path.with_suffix(".pdf")
            if args.format == "both"
            else output_path
        )
        save_pdf(lines, rows, image_shape, pdf_path)

    print(f"File input: {args.source_file}")
    if layout_reference is not None:
        print(f"Referensi : {layout_reference}")
    print(f"Dokumen  : {output_path}")
    if layout_reference is None:
        print("Tata letak dokumen dibuat berdasarkan struktur teks.")
    else:
        print("Tata letak dan ukuran teks disesuaikan dari posisi pada gambar scan.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"\nPemformatan gagal: {error}", file=sys.stderr)
        traceback.print_exc()
        sys.exit(1)
