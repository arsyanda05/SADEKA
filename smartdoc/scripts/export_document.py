import argparse
import json
import re
import sys
import xml.sax.saxutils as xml_escape
import zipfile
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def is_heading(line):
    text = line.strip()
    if not text or len(text) > 100:
        return False

    if re.match(r"^\d+(?:\.\d+)+\s+\S.{0,70}$", text):
        return True

    letters = [character for character in text if character.isalpha()]
    return bool(letters) and all(character.isupper() for character in letters)


def get_document_blocks(text):
    blocks = []
    body_lines = []

    def flush_body():
        if body_lines:
            blocks.append(("body", " ".join(line.strip() for line in body_lines)))
            body_lines.clear()

    for line in text.splitlines():
        stripped = line.strip()
        if not stripped:
            flush_body()
        elif is_heading(stripped):
            flush_body()
            blocks.append(("heading", stripped))
        else:
            body_lines.append(stripped)

    flush_body()
    return blocks


def export_pdf(text, output_path):
    base_styles = getSampleStyleSheet()
    body_style = ParagraphStyle(
        "SmartDocumentBody",
        parent=base_styles["BodyText"],
        alignment=TA_JUSTIFY,
        fontName="Helvetica",
        fontSize=11,
        leading=16,
        spaceAfter=9,
        firstLineIndent=12 * mm,
    )
    heading_style = ParagraphStyle(
        "SmartDocumentHeading",
        parent=body_style,
        alignment=TA_CENTER,
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        spaceBefore=8,
        spaceAfter=10,
        firstLineIndent=0,
        keepWithNext=True,
    )
    story = []
    for kind, content in get_document_blocks(text):
        style = heading_style if kind == "heading" else body_style
        story.append(Paragraph(xml_escape.escape(content), style))
        if kind == "heading":
            story.append(Spacer(1, 1 * mm))
    if not story:
        story.append(Paragraph("", body_style))
    SimpleDocTemplate(str(output_path), pagesize=A4).build(story)


def export_docx(text, output_path):
    paragraphs = []
    for kind, content in get_document_blocks(text):
        escaped = xml_escape.escape(content)
        is_title = kind == "heading"
        alignment = "center" if is_title else "both"
        paragraph_spacing = (
            '<w:spacing w:before="160" w:after="120"/>'
            if is_title
            else '<w:spacing w:after="160" w:line="300" w:lineRule="auto"/>'
        )
        run_properties = '<w:rPr><w:b/><w:sz w:val="28"/></w:rPr>' if is_title else ""
        paragraphs.append(
            f'<w:p><w:pPr><w:jc w:val="{alignment}"/>'
            f"{paragraph_spacing}</w:pPr>"
            f"<w:r>{run_properties}<w:t xml:space=\"preserve\">"
            f"{escaped}</w:t></w:r></w:p>"
        )

    document_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/'
        'wordprocessingml/2006/main"><w:body>'
        + "".join(paragraphs)
        + "<w:sectPr><w:pgSz w:w=\"11906\" w:h=\"16838\"/>"
        "<w:pgMar w:top=\"1440\" w:right=\"1440\" w:bottom=\"1440\" "
        "w:left=\"1440\"/></w:sectPr></w:body></w:document>"
    )
    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
        "</Types>"
    )
    relationships = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
        "</Relationships>"
    )

    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", content_types)
        archive.writestr("_rels/.rels", relationships)
        archive.writestr("word/document.xml", document_xml)


def main():
    parser = argparse.ArgumentParser(description="Ekspor hasil OCR SmartDocument.")
    parser.add_argument("--format", choices=("pdf", "docx"), required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    payload = json.load(sys.stdin)
    text = payload.get("text")
    if not isinstance(text, str) or not text.strip():
        raise ValueError("Teks dokumen wajib diisi.")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    if args.format == "pdf":
        export_pdf(text, args.output)
    else:
        export_docx(text, args.output)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Ekspor gagal: {error}", file=sys.stderr)
        sys.exit(1)
