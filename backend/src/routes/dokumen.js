import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { db } from "../prisma/db.js";

const router = express.Router();

/* =====================================================
   FOLDER UPLOAD
===================================================== */

const uploadDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "surat-ahli-waris"
);

/* =====================================================
   PASTIKAN FOLDER ADA
===================================================== */

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/* =====================================================
   MULTER STORAGE
===================================================== */

const storage =
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const extension =
        path.extname(file.originalname);

      const basename =
        path
          .basename(
            file.originalname,
            extension
          )
          .replace(
            /[^a-zA-Z0-9-_]/g,
            "-"
          );

      const filename = `${Date.now()}-${basename}${extension}`;

      cb(null, filename);
    },
  });

/* =====================================================
   VALIDASI FILE
===================================================== */

const fileFilter = (
  req,
  file,
  cb
) => {
  const extension =
    path
      .extname(file.originalname)
      .toLowerCase();

  if (
    extension !== ".pdf" &&
    file.mimetype !==
      "application/pdf"
  ) {
    return cb(
      new Error(
        "File yang diizinkan hanya PDF."
      )
    );
  }

  cb(null, true);
};

/* =====================================================
   MULTER
===================================================== */

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize:
      10 * 1024 * 1024,
  },
});

/* =====================================================
   HELPER ID
===================================================== */

const getValidId = (value) => {
  const id = Number(value);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return null;
  }

  return id;
};

/* =====================================================
   GET SEMUA DOKUMEN
===================================================== */

router.get("/", async (req, res) => {
  try {
    const data =
      await db.orm.public.Dokumen.all();

    res.json(data);
  } catch (error) {
    console.error(
      "GET /dokumen error:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data dokumen.",
    });
  }
});

/* =====================================================
   GET DOKUMEN BERDASARKAN SURAT AHLI WARIS
===================================================== */

router.get(
  "/surat-ahli-waris/:id",
  async (req, res) => {
    try {
      const id = getValidId(
        req.params.id
      );

      if (!id) {
        return res.status(400).json({
          message:
            "ID surat ahli waris tidak valid.",
        });
      }

      const data =
        await db.orm.public.Dokumen
          .where({
            id_surat_ahli_waris:
              id,
          })
          .all();

      res.json(data);
    } catch (error) {
      console.error(
        "GET /dokumen/surat-ahli-waris/:id error:",
        error
      );

      res.status(500).json({
        message:
          "Gagal mengambil dokumen surat ahli waris.",
      });
    }
  }
);

/* =====================================================
   GET DETAIL DOKUMEN
===================================================== */

router.get("/:id", async (req, res) => {
  try {
    const id = getValidId(
      req.params.id
    );

    if (!id) {
      return res.status(400).json({
        message:
          "ID dokumen tidak valid.",
      });
    }

    const result =
      await db.orm.public.Dokumen
        .where({
          id_dokumen: id,
        })
        .all();

    if (
      !result ||
      result.length === 0
    ) {
      return res.status(404).json({
        message:
          "Dokumen tidak ditemukan.",
      });
    }

    res.json(result[0]);
  } catch (error) {
    console.error(
      "GET /dokumen/:id error:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil detail dokumen.",
    });
  }
});

/* =====================================================
   POST UPLOAD DOKUMEN
===================================================== */

router.post(
  "/",
  upload.single("dokumen"),
  async (req, res) => {
    try {
      console.log(
        "POST /dokumen menerima request"
      );

      console.log(
        "Body:",
        req.body
      );

      console.log(
        "File:",
        req.file
      );

      /* ================================================
         CEK FILE
      ================================================ */

      if (!req.file) {
        return res.status(400).json({
          message:
            "File dokumen wajib diunggah.",
        });
      }

      /* ================================================
         ID SURAT
      ================================================ */

      const idSuratAhliWaris =
        getValidId(
          req.body
            .id_surat_ahli_waris
        );

      if (!idSuratAhliWaris) {
        /*
         * Hapus file jika ID surat tidak valid
         * agar tidak meninggalkan file yatim.
         */
        try {
          fs.unlinkSync(
            req.file.path
          );
        } catch (deleteError) {
          console.error(
            "Gagal menghapus file:",
            deleteError
          );
        }

        return res.status(400).json({
          message:
            "ID surat ahli waris tidak valid.",
        });
      }

      /* ================================================
         CEK SURAT AHLI WARIS
      ================================================ */

      const suratResult =
        await db.orm.public.SuratAhliWaris
          .where({
            id_surat_ahli_waris:
              idSuratAhliWaris,
          })
          .all();

      if (
        !suratResult ||
        suratResult.length === 0
      ) {
        try {
          fs.unlinkSync(
            req.file.path
          );
        } catch (deleteError) {
          console.error(
            "Gagal menghapus file:",
            deleteError
          );
        }

        return res.status(404).json({
          message:
            "Data surat ahli waris tidak ditemukan.",
        });
      }

      /* ================================================
         JENIS DOKUMEN
      ================================================ */

      const jenisDokumen =
        String(
          req.body
            .jenis_dokumen ||
            "Dokumen Surat Ahli Waris"
        ).trim();

      /* ================================================
         PATH FILE
      ================================================ */

      const pathFile =
        `/uploads/surat-ahli-waris/${req.file.filename}`;

      /* ================================================
         TANGGAL UPLOAD
         
         PENTING:
         Prisma 8 menggunakan timestamptz
         dengan Temporal.Instant.
      ================================================ */

      const tanggalUpload =
        Temporal.Now.instant();

      /* ================================================
         SIMPAN KE DATABASE
      ================================================ */

      const dokumen =
        await db.orm.public.Dokumen.create({
          id_surat:
            null,

          id_surat_ahli_waris:
            idSuratAhliWaris,

          nama_dokumen_file:
            req.file.originalname,

          jenis_dokumen:
            jenisDokumen,

          path_file:
            pathFile,

          hasil_OCR:
            "",

          tanggal_upload:
            tanggalUpload,
        });

      /* ================================================
         RESPONSE
      ================================================ */

      res.status(201).json({
        message:
          "Dokumen berhasil diupload.",

        data: dokumen,
      });
    } catch (error) {
      console.error(
        "POST /dokumen error:",
        error
      );

      /*
       * Jika database gagal menyimpan,
       * hapus file yang sudah terlanjur
       * tersimpan di folder uploads.
       */
      if (
        req.file &&
        req.file.path
      ) {
        try {
          if (
            fs.existsSync(
              req.file.path
            )
          ) {
            fs.unlinkSync(
              req.file.path
            );
          }
        } catch (deleteError) {
          console.error(
            "Gagal menghapus file setelah error:",
            deleteError
          );
        }
      }

      res.status(500).json({
        message:
          "Gagal menyimpan dokumen.",
        error:
          error?.message || null,
      });
    }
  }
);

/* =====================================================
   DELETE DOKUMEN
===================================================== */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const id = getValidId(
        req.params.id
      );

      if (!id) {
        return res.status(400).json({
          message:
            "ID dokumen tidak valid.",
        });
      }

      /* ================================================
         CARI DOKUMEN
      ================================================ */

      const result =
        await db.orm.public.Dokumen
          .where({
            id_dokumen: id,
          })
          .all();

      if (
        !result ||
        result.length === 0
      ) {
        return res.status(404).json({
          message:
            "Dokumen tidak ditemukan.",
        });
      }

      const dokumen =
        result[0];

      /* ================================================
         HAPUS DATABASE
      ================================================ */

      await db.orm.public.Dokumen
        .where({
          id_dokumen: id,
        })
        .delete();

      /* ================================================
         HAPUS FILE FISIK
      ================================================ */

      if (dokumen.path_file) {
        const filename =
          path.basename(
            dokumen.path_file
          );

        const filePath =
          path.join(
            uploadDir,
            filename
          );

        try {
          if (
            fs.existsSync(
              filePath
            )
          ) {
            fs.unlinkSync(
              filePath
            );
          }
        } catch (fileError) {
          console.error(
            "Gagal menghapus file fisik:",
            fileError
          );
        }
      }

      res.json({
        message:
          "Dokumen berhasil dihapus.",
      });
    } catch (error) {
      console.error(
        "DELETE /dokumen/:id error:",
        error
      );

      res.status(500).json({
        message:
          "Gagal menghapus dokumen.",
      });
    }
  }
);

export default router;