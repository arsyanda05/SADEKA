import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { db } from "../prisma/db.ts";

const router = express.Router();
const suratUploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "surat"
);

fs.mkdirSync(suratUploadDir, { recursive: true });

const uploadSurat = multer({
  storage: multer.diskStorage({
    destination: suratUploadDir,
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const basename = path
        .basename(file.originalname, path.extname(file.originalname))
        .replace(/[^a-zA-Z0-9_-]/g, "-");

      callback(null, `${Date.now()}-${basename}${extension}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    callback(null, path.extname(file.originalname).toLowerCase() === ".pdf");
  },
});

const removeUploadedFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ========================================
// GET SEMUA SURAT
// ========================================
router.get("/", async (req, res) => {
  try {
    const suratList = await db.orm.public.Surat.all();
    const surat = await Promise.all(
      suratList.map(async (item) => ({
        ...item,
        dokumen: await db.orm.public.Dokumen
          .where({ id_surat: item.id_surat })
          .all(),
      }))
    );

    res.json(surat);
  } catch (error) {
    console.error("Error mengambil data surat:", error);

    res.status(500).json({
      message: "Gagal mengambil data surat"
    });
  }
});


// ========================================
// GET SURAT BERDASARKAN ID
// ========================================
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const surat = await db.orm.public.Surat
      .where({
        id_surat: id
      })
      .all();

    if (!surat || surat.length === 0) {
      return res.status(404).json({
        message: "Data surat tidak ditemukan"
      });
    }

    const dokumen = await db.orm.public.Dokumen
      .where({ id_surat: id })
      .all();

    res.json({
      ...surat[0],
      dokumen,
    });
  } catch (error) {
    console.error("Error mengambil detail surat:", error);

    res.status(500).json({
      message: "Gagal mengambil detail surat"
    });
  }
});


// ========================================
// POST TAMBAH SURAT
// ========================================
router.post("/", uploadSurat.single("dokumen"), async (req, res) => {
  let surat;

  try {
    const body = req.body ?? {};
    const {
      tanggal,
      jenis,
      arah_surat,
      asal,
      tujuan,
      keterangan,
      nomor_surat
    } = body;

    if (!req.file) {
      return res.status(400).json({
        message: "Berkas surat PDF wajib diunggah.",
      });
    }

    if (
      !tanggal ||
      !jenis ||
      !arah_surat ||
      !asal ||
      !tujuan ||
      !keterangan ||
      !nomor_surat
    ) {
      removeUploadedFile(req.file.path);
      return res.status(400).json({
        message: "Semua informasi surat wajib diisi.",
      });
    }

    surat = await db.orm.public.Surat.create({
      tanggal: Temporal.Instant.from(`${tanggal}T00:00:00Z`),
      jenis,
      arah_surat,
      asal,
      tujuan,
      keterangan,
      nomor_surat
    });

    const dokumen = await db.orm.public.Dokumen.create({
      id_surat: surat.id_surat,
      id_surat_ahli_waris: null,
      nama_dokumen_file: req.file.originalname,
      jenis_dokumen: `Surat ${arah_surat}`,
      path_file: `/uploads/surat/${req.file.filename}`,
      hasil_OCR: "",
      tanggal_upload: Temporal.Now.instant(),
    });

    res.status(201).json({
      ...surat,
      dokumen: [dokumen],
    });
  } catch (error) {
    console.error("Error menambahkan surat:", error);

    if (surat?.id_surat) {
      await db.orm.public.Dokumen
        .where({ id_surat: surat.id_surat })
        .delete()
        .catch((cleanupError) => {
          console.error("Gagal membersihkan dokumen surat:", cleanupError);
        });
      await db.orm.public.Surat
        .where({ id_surat: surat.id_surat })
        .delete()
        .catch((cleanupError) => {
          console.error("Gagal membersihkan surat:", cleanupError);
        });
    }

    removeUploadedFile(req.file?.path);

    res.status(500).json({
      message: error.message || "Gagal menambahkan surat",
    });
  }
});


// ========================================
// PUT UBAH SURAT
// ========================================
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      tanggal,
      jenis,
      arah_surat,
      asal,
      tujuan,
      keterangan,
      nomor_surat
    } = req.body;

    const surat = await db.orm.public.Surat
      .where({
        id_surat: id
      })
      .update({
        tanggal: Temporal.Instant.from(`${tanggal}T00:00:00Z`),
        jenis,
        arah_surat,
        asal,
        tujuan,
        keterangan,
        nomor_surat
      });

    res.json(surat);
  } catch (error) {
    console.error("Error mengubah surat:", error);

    res.status(500).json({
      message: "Gagal mengubah surat"
    });
  }
});


// ========================================
// DELETE SURAT
// ========================================
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const dokumenList = await db.orm.public.Dokumen
      .where({ id_surat: id })
      .all();

    await db.orm.public.Dokumen
      .where({ id_surat: id })
      .delete();

    const surat = await db.orm.public.Surat
      .where({
        id_surat: id
      })
      .delete();

    for (const dokumen of dokumenList) {
      const filename = path.basename(
        String(dokumen.path_file || "").replace(/\\/g, "/")
      );
      const filePath = path.join(suratUploadDir, filename);

      if (filename && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      message: "Surat berhasil dihapus",
      data: surat
    });
  } catch (error) {
    console.error("Error menghapus surat:", error);

    res.status(500).json({
      message: "Gagal menghapus surat"
    });
  }
});


export default router;