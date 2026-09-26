import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { db } from "../prisma/db.js";

const router = express.Router();

// ========================================
// FOLDER PENYIMPANAN DOKUMEN PEGAWAI
// ========================================

const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "dokumen-pegawai"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ========================================
// KONFIGURASI MULTER
// ========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const baseName = path
      .basename(
        file.originalname,
        extension
      )
      .replace(/\s+/g, "-");

    const fileName = `${Date.now()}-${baseName}${extension}`;

    cb(null, fileName);
  },
});

const upload = multer({
  storage,
});

// ========================================
// GET SEMUA DOKUMEN PEGAWAI
// ========================================

router.get("/", async (req, res) => {
  try {
    const dokumen =
      await db.orm.public.DokumenPegawai.all();

    res.json(dokumen);
  } catch (error) {
    console.error(
      "Error GET dokumen pegawai:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil dokumen pegawai",
    });
  }
});

// ========================================
// GET DOKUMEN BERDASARKAN PEGAWAI
// ========================================

router.get(
  "/pegawai/:id_pegawai",
  async (req, res) => {
    try {
      const id_pegawai = Number(
        req.params.id_pegawai
      );

      if (!Number.isInteger(id_pegawai)) {
        return res.status(400).json({
          message: "ID pegawai tidak valid",
        });
      }

      const dokumen =
        await db.orm.public.DokumenPegawai
          .where({
            id_pegawai,
          })
          .all();

      res.json(dokumen);
    } catch (error) {
      console.error(
        "Error GET dokumen berdasarkan pegawai:",
        error
      );

      res.status(500).json({
        message:
          "Gagal mengambil dokumen pegawai",
      });
    }
  }
);

// ========================================
// POST UPLOAD DOKUMEN PEGAWAI
// ========================================

router.post(
  "/",
  upload.single("dokumen"),
  async (req, res) => {
    try {
      const {
        id_pegawai,
        jenis_dokumen,
        tanggal_upload,
      } = req.body;

      // Validasi ID pegawai
      if (!id_pegawai) {
        return res.status(400).json({
          message:
            "ID pegawai wajib diisi",
        });
      }

      const idPegawai = Number(id_pegawai);

      if (!Number.isInteger(idPegawai)) {
        return res.status(400).json({
          message:
            "ID pegawai tidak valid",
        });
      }

      // Validasi jenis dokumen
      if (!jenis_dokumen?.trim()) {
        return res.status(400).json({
          message:
            "Jenis dokumen wajib diisi",
        });
      }

      // Validasi tanggal upload
      if (!tanggal_upload) {
        return res.status(400).json({
          message:
            "Tanggal upload wajib diisi",
        });
      }

      // Validasi file
      if (!req.file) {
        return res.status(400).json({
          message:
            "File dokumen wajib diupload",
        });
      }

      // Pastikan pegawai ada
      const pegawai =
        await db.orm.public.Pegawai
          .where({
            id_pegawai: idPegawai,
          })
          .all();

      if (pegawai.length === 0) {
        return res.status(404).json({
          message:
            "Data pegawai tidak ditemukan",
        });
      }

      // Simpan metadata dokumen
      const dokumen =
        await db.orm.public.DokumenPegawai.create({
          id_pegawai: idPegawai,

          jenis_dokumen:
            jenis_dokumen.trim(),

          nama_file:
            req.file.originalname,

          path_file:
            req.file.path,

          tanggal_upload:
            Temporal.Instant.from(
              `${tanggal_upload}T00:00:00Z`
            ),
        });

      res.status(201).json(dokumen);
    } catch (error) {
      console.error(
        "Error POST dokumen pegawai:",
        error
      );

      res.status(500).json({
        message:
          "Gagal mengupload dokumen pegawai",
      });
    }
  }
);

// ========================================
// DELETE DOKUMEN PEGAWAI
// ========================================

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const id = Number(
        req.params.id
      );

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          message:
            "ID dokumen tidak valid",
        });
      }

      const dokumen =
        await db.orm.public.DokumenPegawai
          .where({
            id_dokumen_pegawai: id,
          })
          .delete();

      res.json({
        message:
          "Dokumen pegawai berhasil dihapus",
        data: dokumen,
      });
    } catch (error) {
      console.error(
        "Error DELETE dokumen pegawai:",
        error
      );

      res.status(500).json({
        message:
          "Gagal menghapus dokumen pegawai",
      });
    }
  }
);

export default router;