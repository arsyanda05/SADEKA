import crypto from "crypto";
import { spawn, spawnSync } from "child_process";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { performance } from "perf_hooks";
import { fileURLToPath } from "url";

import { db } from "../prisma/db.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../../");
const SMARTDOC_ROOT = path.join(PROJECT_ROOT, "smartdoc");
const PYTHON_SCRIPTS = path.join(SMARTDOC_ROOT, "scripts");
const UPLOAD_DIR = path.join(PROJECT_ROOT, "backend", "src", "uploads", "smart-document");
const SCAN_DIR = path.join(SMARTDOC_ROOT, "runs", "scanned_documents");
const OCR_DIR = path.join(SMARTDOC_ROOT, "runs", "ocr_results");
const MAX_TEXT_LENGTH = 200_000;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (
      ![".jpg", ".jpeg", ".png"].includes(extension) ||
      !["image/jpeg", "image/png"].includes(file.mimetype)
    ) {
      return callback(new Error("Unggah foto JPG, JPEG, atau PNG."));
    }
    callback(null, true);
  },
});

let selectedPythonExecutable;

const pythonExecutable = () => {
  if (selectedPythonExecutable) {
    return selectedPythonExecutable;
  }

  const smartdocPython = path.join(
    SMARTDOC_ROOT,
    ".venv",
    "Scripts",
    "python.exe"
  );
  const projectPython = path.join(
    PROJECT_ROOT,
    ".venv",
    "Scripts",
    "python.exe"
  );
  const candidates = process.env.SMARTDOC_PYTHON
    ? [process.env.SMARTDOC_PYTHON]
    : [smartdocPython, projectPython, "python"];
  const dependencyCheck = [
    "-c",
    "import importlib.util,sys; modules=('cv2','paddleocr','ultralytics','reportlab'); missing=[name for name in modules if importlib.util.find_spec(name) is None]; sys.exit(1 if missing else 0)",
  ];

  for (const candidate of candidates) {
    if (candidate !== "python" && !fs.existsSync(candidate)) {
      continue;
    }

    const check = spawnSync(candidate, dependencyCheck, {
      encoding: "utf8",
      windowsHide: true,
      timeout: 10_000,
    });

    if (!check.error && check.status === 0) {
      selectedPythonExecutable = candidate;
      console.info(`SmartDocument menggunakan Python: ${candidate}`);
      return selectedPythonExecutable;
    }
  }

  throw new Error(
    "Dependensi SmartDocument (OpenCV, PaddleOCR, Ultralytics, ReportLab) tidak ditemukan. " +
    "Jalankan `python -m pip install -r requirements.txt` dari folder smartdoc " +
    "dengan virtual environment yang aktif, lalu restart backend."
  );
};

const runPython = (scriptName, args, input) =>
  new Promise((resolve, reject) => {
    const startedAt = performance.now();
    const scriptPath = path.join(PYTHON_SCRIPTS, scriptName);
    const child = spawn(pythonExecutable(), [scriptPath, ...args], {
      cwd: PROJECT_ROOT,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    const timeout = setTimeout(() => {
      child.kill();
      if (!settled) {
        settled = true;
        reject(new Error("Proses SmartDocument melewati batas waktu 5 menit."));
      }
    }, 5 * 60 * 1000);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => {
      clearTimeout(timeout);
      if (!settled) {
        settled = true;
        reject(new Error(`Python tidak dapat dijalankan: ${error.message}`));
      }
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (settled) return;
      settled = true;
      if (code !== 0) {
        const details = stderr.trim() || stdout.trim() || `Python keluar dengan kode ${code}.`;
        console.error(`SmartDocument ${scriptName} gagal:`, details);
        reject(new Error(details));
        return;
      }
      console.info(
        `SmartDocument ${scriptName} selesai dalam ${Math.round(performance.now() - startedAt)} ms.`
      );
      resolve(stdout.trim());
    });

    if (input) child.stdin.end(input);
    else child.stdin.end();
  });

const getJobPaths = (id) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return null;
  }

  return {
    scan: path.join(SCAN_DIR, `${id}_scan.jpg`),
    scannedCopy: path.join(UPLOAD_DIR, `${id}_scan.jpg`),
    text: path.join(OCR_DIR, `${id}_scan_ocr.txt`),
    layout: path.join(OCR_DIR, `${id}_scan_layout.json`),
    draft: path.join(UPLOAD_DIR, `${id}.txt`),
    exportManifest: path.join(OCR_DIR, `${id}_exports.json`),
    pdf: path.join(UPLOAD_DIR, `${id}.pdf`),
    docx: path.join(UPLOAD_DIR, `${id}.docx`),
  };
};

const hasDocumentSession = (paths) =>
  fs.existsSync(paths.scannedCopy) || fs.existsSync(paths.draft);

const validateText = (text) =>
  typeof text === "string" &&
  text.trim().length > 0 &&
  text.length <= MAX_TEXT_LENGTH;

const cleanText = (value) =>
  typeof value === "string" ? value.trim() : "";

const getDateInstant = (value) => {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : Temporal.Instant.from(`${value}T00:00:00Z`);
};

const getSuratMetadata = (metadata) => {
  const tanggal = getDateInstant(metadata?.tanggal);
  const jenis = cleanText(metadata?.jenis);
  const asal = cleanText(metadata?.asal);
  const tujuan = cleanText(metadata?.tujuan);
  const keterangan = cleanText(metadata?.keterangan);
  const nomorSurat = cleanText(metadata?.nomor_surat);

  if (!tanggal || !jenis || !asal || !tujuan || !keterangan || !nomorSurat) {
    return null;
  }

  return {
    tanggal,
    jenis,
    asal,
    tujuan,
    keterangan,
    nomor_surat: nomorSurat,
  };
};

const createExport = async (id, text, format) => {
  const paths = getJobPaths(id);
  if (!paths) {
    throw new Error("ID dokumen tidak valid.");
  }
  const outputPath = format === "pdf" ? paths.pdf : paths.docx;
  const textHash = crypto.createHash("sha256").update(text, "utf8").digest("hex");
  let exportManifest = {};
  if (fs.existsSync(paths.exportManifest)) {
    try {
      const parsedManifest = JSON.parse(fs.readFileSync(paths.exportManifest, "utf8"));
      if (parsedManifest && typeof parsedManifest === "object" && !Array.isArray(parsedManifest)) {
        exportManifest = parsedManifest;
      } else {
        console.warn(`SmartDocument export cache tidak valid (${id}); membuat ulang file.`);
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      console.warn(`SmartDocument export cache tidak valid (${id}); membuat ulang file.`);
    }
  }
  const requestedFormats = format === "both" ? ["pdf", "docx"] : [format];
  const missingFormats = requestedFormats.filter(
    (requestedFormat) =>
      exportManifest[requestedFormat] !== textHash ||
      !fs.existsSync(paths[requestedFormat]) ||
      fs.statSync(paths[requestedFormat]).size === 0
  );
  if (missingFormats.length === 0) {
    return outputPath;
  }

  const generationFormat = missingFormats.length === 2 ? "both" : missingFormats[0];
  const generationOutputPath = generationFormat === "pdf" ? paths.pdf : paths.docx;
  const generatedPaths = missingFormats.map((missingFormat) => paths[missingFormat]);
  const formatTextPath = path.join(
    UPLOAD_DIR,
    `${id}_${crypto.randomUUID()}_format.txt`
  );
  fs.writeFileSync(formatTextPath, text, "utf8");
  const args = [
    formatTextPath,
    "--format",
    generationFormat,
    "--output",
    generationOutputPath,
  ];
  if (fs.existsSync(paths.layout)) {
    args.push("--layout-json", paths.layout);
  } else if (fs.existsSync(paths.scannedCopy)) {
    args.push("--scan-image", paths.scannedCopy);
  }

  try {
    await runPython("format_ocr_document.py", args);
    for (const generatedFormat of missingFormats) {
      exportManifest[generatedFormat] = textHash;
    }
    fs.mkdirSync(OCR_DIR, { recursive: true });
    const manifestTempPath = `${paths.exportManifest}.${crypto.randomUUID()}.tmp`;
    fs.writeFileSync(manifestTempPath, JSON.stringify(exportManifest), "utf8");
    fs.renameSync(manifestTempPath, paths.exportManifest);
  } catch (error) {
    for (const generatedPath of generatedPaths) {
      if (fs.existsSync(generatedPath)) fs.unlinkSync(generatedPath);
    }
    throw error;
  } finally {
    if (fs.existsSync(formatTextPath)) fs.unlinkSync(formatTextPath);
  }
  return outputPath;
};

router.get("/options", async (req, res) => {
  try {
    const [surat, suratAhliWaris, penduduk] = await Promise.all([
      db.orm.public.Surat.all(),
      db.orm.public.SuratAhliWaris.all(),
      db.orm.public.Penduduk.all(),
    ]);

    const [suratDocuments, ahliWarisDocuments] = await Promise.all([
      Promise.all(surat.map(async (item) => ({
        ...item,
        dokumen: await db.orm.public.Dokumen
          .where({ id_surat: item.id_surat })
          .all(),
      }))),
      Promise.all(suratAhliWaris.map(async (item) => {
        const [pewarisRows, ahliWarisRows, documents] = await Promise.all([
          db.orm.public.Penduduk
            .where({ id_penduduk: item.id_penduduk })
            .all(),
          db.orm.public.AhliWaris
            .where({ id_surat_ahli_waris: item.id_surat_ahli_waris })
            .all(),
          db.orm.public.Dokumen
            .where({ id_surat_ahli_waris: item.id_surat_ahli_waris })
            .all(),
        ]);
        const ahliWaris = ahliWarisRows[0];
        const ahliWarisPenduduk = ahliWaris
          ? penduduk.find((person) => person.id_penduduk === ahliWaris.id_penduduk)
          : null;

        return {
          ...item,
          pewaris: pewarisRows[0] || null,
          ahliWaris: ahliWarisPenduduk
            ? { ...ahliWarisPenduduk, hubungan: ahliWaris.hubungan }
            : null,
          dokumen: documents,
        };
      })),
    ]);

    return res.json({
      surat: suratDocuments,
      suratAhliWaris: ahliWarisDocuments,
      penduduk,
    });
  } catch (error) {
    console.error("SmartDocument options error:", error);
    return res.status(500).json({ message: "Gagal memuat data surat dari sistem." });
  }
});

router.post("/draft", async (req, res) => {
  const { target, metadata } = req.body || {};
  let text = "";

  if (target === "surat-keluar") {
    const surat = getSuratMetadata(metadata);
    if (!surat) {
      return res.status(400).json({
        message: "Lengkapi nomor, tanggal, jenis, asal, tujuan, dan isi surat.",
      });
    }

    const dateLabel = new Date(surat.tanggal.epochMilliseconds)
      .toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
    text = [
      "DRAF SURAT KELUAR",
      `Nomor: ${surat.nomor_surat}`,
      `Perihal: ${surat.jenis}`,
      "",
      `${surat.asal}, ${dateLabel}`,
      "",
      `Kepada Yth. ${surat.tujuan}`,
      "di tempat",
      "",
      "Dengan hormat,",
      "",
      surat.keterangan,
      "",
      "Demikian disampaikan. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.",
      "",
      "Lurah Manukan Kulon",
      "",
      "",
      "(________________________)",
      "DRAF - periksa dan lengkapi sebelum ditandatangani.",
    ].join("\n");
  } else if (target === "surat-ahli-waris") {
    const idPewaris = Number(metadata?.id_penduduk);
    const idAhliWaris = Number(metadata?.id_penduduk_ahli_waris);
    const tanggal = getDateInstant(metadata?.tanggal_pengajuan);
    const nomorSurat = cleanText(metadata?.nomor_surat);
    const hubungan = cleanText(metadata?.hubungan);

    if (
      !Number.isSafeInteger(idPewaris) ||
      idPewaris <= 0 ||
      !Number.isSafeInteger(idAhliWaris) ||
      idAhliWaris <= 0 ||
      idPewaris === idAhliWaris ||
      !tanggal ||
      !nomorSurat ||
      !hubungan
    ) {
      return res.status(400).json({
        message: "Lengkapi nomor surat, tanggal, data pewaris, ahli waris, dan hubungan keluarga.",
      });
    }

    const [pewarisRows, ahliWarisRows] = await Promise.all([
      db.orm.public.Penduduk.where({ id_penduduk: idPewaris }).all(),
      db.orm.public.Penduduk.where({ id_penduduk: idAhliWaris }).all(),
    ]);
    const pewaris = pewarisRows[0];
    const ahliWaris = ahliWarisRows[0];
    if (!pewaris || !ahliWaris) {
      return res.status(404).json({ message: "Data pewaris atau ahli waris tidak ditemukan." });
    }

    const dateLabel = new Date(tanggal.epochMilliseconds)
      .toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
    text = [
      "DRAF SURAT KETERANGAN AHLI WARIS",
      `Nomor: ${nomorSurat}`,
      "",
      "Yang bertanda tangan di bawah ini, Lurah Manukan Kulon, menerangkan bahwa:",
      "",
      `Nama: ${pewaris.nama}`,
      `NIK: ${pewaris.nik}`,
      `Tempat, tanggal lahir: ${pewaris.tempat_lahir}, ${new Date(pewaris.tanggal_lahir.epochMilliseconds).toLocaleDateString("id-ID", { timeZone: "UTC" })}`,
      `Alamat: ${pewaris.alamat}, RT ${pewaris.rt}/RW ${pewaris.rw}`,
      "",
      "Berdasarkan data yang diajukan, yang bersangkutan tercatat sebagai pewaris dengan ahli waris:",
      "",
      `Nama: ${ahliWaris.nama}`,
      `NIK: ${ahliWaris.nik}`,
      `Hubungan: ${hubungan}`,
      "",
      `Surat ini dibuat pada ${dateLabel} untuk diperiksa dan digunakan sesuai keperluan.`,
      "",
      "Lurah Manukan Kulon",
      "",
      "",
      "(________________________)",
      "DRAF - verifikasi data, kelengkapan persyaratan, dan kewenangan sebelum ditandatangani.",
    ].join("\n");
  } else {
    return res.status(400).json({ message: "Surat draf hanya tersedia untuk surat keluar dan surat ahli waris." });
  }

  const id = crypto.randomUUID();
  const paths = getJobPaths(id);
  try {
    fs.writeFileSync(paths.draft, text, "utf8");
    await createExport(id, text, "both");
    return res.status(201).json({
      id,
      text,
      originalName: `${target}-draft`,
      scannedImageUrl: null,
      pdfUrl: `/uploads/smart-document/${id}.pdf`,
      docxUrl: `/uploads/smart-document/${id}.docx`,
    });
  } catch (error) {
    for (const generatedPath of [paths.draft, paths.pdf, paths.docx]) {
      if (fs.existsSync(generatedPath)) fs.unlinkSync(generatedPath);
    }
    console.error("SmartDocument draft error:", error);
    return res.status(500).json({ message: "Gagal membuat draf surat.", error: error.message });
  }
});

router.post("/process", (req, res) => {
  upload.single("document")(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Foto dokumen wajib dipilih." });
    }

    const id = path.parse(req.file.filename).name;
    const paths = getJobPaths(id);
    const sourcePath = req.file.path;
    const processStartedAt = performance.now();

    try {
      await runPython("scan_document.py", [sourcePath]);
      await runPython("ocr_document.py", [
        paths.scan,
        "--layout-output",
        paths.layout,
      ]);

      if (!fs.existsSync(paths.text)) {
        throw new Error("File hasil OCR tidak ditemukan.");
      }

      fs.copyFileSync(paths.scan, paths.scannedCopy);
      const text = fs.readFileSync(paths.text, "utf8").trim();
      if (!text) {
        for (const generatedPath of [
          sourcePath,
          paths.scan,
          paths.scannedCopy,
          paths.text,
          paths.layout,
          paths.pdf,
          paths.docx,
        ]) {
          if (fs.existsSync(generatedPath)) fs.unlinkSync(generatedPath);
        }
        return res.status(422).json({
          message: "Teks tidak berhasil dikenali. Coba foto dokumen lebih jelas dan terang.",
        });
      }

      console.info(
        `SmartDocument crop dan OCR ${id} selesai dalam ${Math.round(performance.now() - processStartedAt)} ms.`
      );
      return res.json({
        id,
        originalName: req.file.originalname,
        text,
        scannedImageUrl: `/uploads/smart-document/${id}_scan.jpg`,
      });
    } catch (error) {
      console.error("SmartDocument processing error:", error);
      for (const generatedPath of [
        sourcePath,
        paths.scan,
        paths.scannedCopy,
        paths.text,
        paths.layout,
        paths.pdf,
        paths.docx,
      ]) {
        if (fs.existsSync(generatedPath)) fs.unlinkSync(generatedPath);
      }
      return res.status(500).json({
        message: "Gagal mendeteksi tepi atau membaca teks dokumen.",
        error: error.message,
      });
    }
  });
});

router.post("/export", async (req, res) => {
  const { documentId, format, text } = req.body;
  if (!getJobPaths(String(documentId)) || !["pdf", "docx"].includes(format)) {
    return res.status(400).json({ message: "ID dokumen atau format ekspor tidak valid." });
  }
  if (!validateText(text)) {
    return res.status(400).json({ message: "Teks hasil OCR kosong atau terlalu panjang." });
  }
  if (!hasDocumentSession(getJobPaths(documentId))) {
    return res.status(404).json({ message: "Sesi dokumen tidak ditemukan. Unggah dan proses foto terlebih dahulu." });
  }

  try {
    const outputPath = await createExport(documentId, text, format);
    const downloadName = `smart-document-${documentId}.${format}`;
    return res.download(outputPath, downloadName);
  } catch (error) {
    console.error("SmartDocument export error:", error);
    return res.status(500).json({ message: "Gagal membuat dokumen ekspor.", error: error.message });
  }
});

router.post("/:id/archive", async (req, res) => {
  const paths = getJobPaths(req.params.id);
  const { text, target = "umum", recordId, metadata } = req.body;
  if (!paths || !hasDocumentSession(paths)) {
    return res.status(404).json({
      message: "Sesi dokumen tidak ditemukan. Unggah ulang dokumen.",
    });
  }
  if (!validateText(text)) {
    return res.status(400).json({ message: "Teks hasil OCR kosong atau terlalu panjang." });
  }

  try {
    await createExport(req.params.id, text, "both");

    const filePath = `/uploads/smart-document/${req.params.id}.pdf`;
    const existingDocuments = await db.orm.public.Dokumen
      .where({ path_file: filePath })
      .all();
    if (existingDocuments.length > 0) {
      return res.json({
        message: "Dokumen ini sudah tersimpan di arsip.",
        document: existingDocuments[0],
      });
    }

    let idSurat = null;
    let idSuratAhliWaris = null;
    let createdRecord = null;
    let jenisDokumen = "SmartDocument";
    let categoryLabel = "arsip SmartDocument";

    if (target === "surat-masuk" || target === "surat-keluar") {
      jenisDokumen = target === "surat-masuk" ? "Surat Masuk" : "Surat Keluar";
      categoryLabel = target === "surat-masuk" ? "Surat Masuk" : "Surat Keluar";

      if (recordId) {
        idSurat = Number(recordId);
        if (!Number.isSafeInteger(idSurat) || idSurat <= 0) {
          return res.status(400).json({ message: "ID surat yang dipilih tidak valid." });
        }
        const records = await db.orm.public.Surat.where({ id_surat: idSurat }).all();
        if (!records[0] || records[0].arah_surat !== (target === "surat-masuk" ? "Masuk" : "Keluar")) {
          return res.status(404).json({ message: "Surat yang dipilih tidak ditemukan di kategori ini." });
        }
      } else {
        const surat = getSuratMetadata(metadata);
        if (!surat) {
          return res.status(400).json({
            message: "Lengkapi nomor, tanggal, jenis, asal, tujuan, dan keterangan surat.",
          });
        }
        const created = await db.orm.public.Surat.create({
          ...surat,
          arah_surat: target === "surat-masuk" ? "Masuk" : "Keluar",
        });
        idSurat = created.id_surat;
        createdRecord = { type: "surat", id: idSurat };
      }
    } else if (target === "surat-ahli-waris") {
      jenisDokumen = "Surat Ahli Waris";
      categoryLabel = "Surat Ahli Waris";

      if (recordId) {
        idSuratAhliWaris = Number(recordId);
        if (!Number.isSafeInteger(idSuratAhliWaris) || idSuratAhliWaris <= 0) {
          return res.status(400).json({ message: "ID surat ahli waris yang dipilih tidak valid." });
        }
        const records = await db.orm.public.SuratAhliWaris
          .where({ id_surat_ahli_waris: idSuratAhliWaris })
          .all();
        if (!records[0]) {
          return res.status(404).json({ message: "Surat ahli waris yang dipilih tidak ditemukan." });
        }
      } else {
        const idPewaris = Number(metadata?.id_penduduk);
        const idAhliWaris = Number(metadata?.id_penduduk_ahli_waris);
        const tanggal = getDateInstant(metadata?.tanggal_pengajuan);
        const nomorSurat = cleanText(metadata?.nomor_surat);
        const hubungan = cleanText(metadata?.hubungan);
        if (
          !Number.isSafeInteger(idPewaris) || idPewaris <= 0 ||
          !Number.isSafeInteger(idAhliWaris) || idAhliWaris <= 0 ||
          idPewaris === idAhliWaris || !tanggal || !nomorSurat || !hubungan
        ) {
          return res.status(400).json({
            message: "Lengkapi nomor surat, tanggal, pewaris, ahli waris, dan hubungan keluarga.",
          });
        }

        const [pewaris, ahliWaris] = await Promise.all([
          db.orm.public.Penduduk.where({ id_penduduk: idPewaris }).all(),
          db.orm.public.Penduduk.where({ id_penduduk: idAhliWaris }).all(),
        ]);
        if (!pewaris[0] || !ahliWaris[0]) {
          return res.status(404).json({ message: "Data pewaris atau ahli waris tidak ditemukan." });
        }

        const created = await db.orm.public.SuratAhliWaris.create({
          id_penduduk: idPewaris,
          nomor_surat: nomorSurat,
          tanggal_pengajuan: tanggal,
          tahap: cleanText(metadata?.tahap) || "Diajukan",
          tanggal_selesai: getDateInstant(metadata?.tanggal_selesai),
        });
        idSuratAhliWaris = created.id_surat_ahli_waris;
        createdRecord = { type: "surat-ahli-waris", id: idSuratAhliWaris };
        try {
          await db.orm.public.AhliWaris.create({
            id_surat_ahli_waris: idSuratAhliWaris,
            id_penduduk: idAhliWaris,
            hubungan,
          });
        } catch (error) {
          await db.orm.public.SuratAhliWaris
            .where({ id_surat_ahli_waris: idSuratAhliWaris })
            .delete()
            .catch((cleanupError) => console.error("Gagal membersihkan surat ahli waris:", cleanupError));
          throw error;
        }
      }
    } else if (target !== "umum") {
      return res.status(400).json({ message: "Kategori tujuan tidak valid." });
    }

    try {
      const document = await db.orm.public.Dokumen.create({
        id_surat: idSurat,
        id_surat_ahli_waris: idSuratAhliWaris,
        nama_dokumen_file: `${req.params.id}.pdf`,
        jenis_dokumen: jenisDokumen,
        path_file: filePath,
        hasil_OCR: text,
        tanggal_upload: Temporal.Now.instant(),
      });

      return res.status(201).json({
        message: `Dokumen berhasil disimpan ke ${categoryLabel}.`,
        document,
      });
    } catch (error) {
      if (createdRecord?.type === "surat") {
        await db.orm.public.Surat
          .where({ id_surat: createdRecord.id })
          .delete()
          .catch((cleanupError) => console.error("Gagal membersihkan surat baru:", cleanupError));
      } else if (createdRecord?.type === "surat-ahli-waris") {
        await db.orm.public.AhliWaris
          .where({ id_surat_ahli_waris: createdRecord.id })
          .delete()
          .catch((cleanupError) => console.error("Gagal membersihkan relasi ahli waris:", cleanupError));
        await db.orm.public.SuratAhliWaris
          .where({ id_surat_ahli_waris: createdRecord.id })
          .delete()
          .catch((cleanupError) => console.error("Gagal membersihkan surat ahli waris:", cleanupError));
      }
      throw error;
    }
  } catch (error) {
    console.error("SmartDocument archive error:", error);
    return res.status(500).json({ message: "Gagal menyimpan dokumen ke arsip.", error: error.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const allDocuments = await db.orm.public.Dokumen.all();
    const documents = allDocuments.filter((document) =>
      String(document.path_file).startsWith("/uploads/smart-document/")
    );

    return res.json(documents.sort((left, right) =>
      String(right.tanggal_upload).localeCompare(String(left.tanggal_upload))
    ));
  } catch (error) {
    console.error("SmartDocument history error:", error);
    return res.status(500).json({ message: "Gagal mengambil riwayat dokumen." });
  }
});

export default router;
