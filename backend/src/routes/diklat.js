import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { db } from "../prisma/db.js";

const router = express.Router();

// ========================================
// FOLDER PENYIMPANAN SERTIFIKAT
// ========================================

const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "sertifikat-diklat"
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
// GET SEMUA DATA DIKLAT
// ========================================

router.get("/", async (req, res) => {
  try {
    const diklat =
      await db.orm.public.Diklat.all();

    res.json(diklat);
  } catch (error) {
    console.error(
      "Error GET diklat:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data diklat",
    });
  }
});

// ========================================
// GET DIKLAT BERDASARKAN PEGAWAI
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
          message:
            "ID pegawai tidak valid",
        });
      }

      const diklat =
        await db.orm.public.Diklat
          .where({
            id_pegawai,
          })
          .all();

      res.json(diklat);
    } catch (error) {
      console.error(
        "Error GET diklat berdasarkan pegawai:",
        error
      );

      res.status(500).json({
        message:
          "Gagal mengambil riwayat diklat",
      });
    }
  }
);

// ========================================
// POST DATA DIKLAT
// ========================================

router.post(
  "/",
  upload.single("sertifikat"),
  async (req, res) => {
    try {
      const {
        id_pegawai,
        nama_diklat,
        tanggal_diklat,
        keterangan,
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

      // Validasi nama diklat
      if (!nama_diklat?.trim()) {
        return res.status(400).json({
          message:
            "Nama diklat wajib diisi",
        });
      }

      // Validasi tanggal
      if (!tanggal_diklat) {
        return res.status(400).json({
          message:
            "Tanggal diklat wajib diisi",
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

      // Simpan data diklat
      const diklat =
        await db.orm.public.Diklat.create({
          id_pegawai: idPegawai,

          nama_diklat:
            nama_diklat.trim(),

          tanggal_diklat:
            Temporal.Instant.from(
              `${tanggal_diklat}T00:00:00Z`
            ),

          keterangan:
            keterangan?.trim() || "",

          sertifikat:
            req.file
              ? req.file.path
              : "",
        });

      res.status(201).json(diklat);
    } catch (error) {
      console.error(
        "Error POST diklat:",
        error
      );

      res.status(500).json({
        message:
          "Gagal menambahkan riwayat diklat",
      });
    }
  }
);

// ========================================
// DELETE DATA DIKLAT
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
            "ID diklat tidak valid",
        });
      }

      const diklat =
        await db.orm.public.Diklat
          .where({
            id_diklat: id,
          })
          .delete();

      res.json({
        message:
          "Riwayat diklat berhasil dihapus",
        data: diklat,
      });
    } catch (error) {
      console.error(
        "Error DELETE diklat:",
        error
      );

      res.status(500).json({
        message:
          "Gagal menghapus riwayat diklat",
      });
    }
  }
);

export default router;