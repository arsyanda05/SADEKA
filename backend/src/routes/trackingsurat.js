import express from "express";
import { Temporal } from "temporal-polyfill";

import { db } from "../prisma/db.js";

const router = express.Router();

/* =========================
   HELPER ID
========================= */
const getValidId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

/* =========================
   HELPER TANGGAL
========================= */
const getTanggal = (tanggal) => {
  if (!tanggal) {
    return null;
  }

  try {
    // Jika format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
      return Temporal.Instant.from(
        `${tanggal}T00:00:00Z`
      );
    }

    // Jika sudah ISO datetime
    return Temporal.Instant.from(tanggal);
  } catch (error) {
    return null;
  }
};

/* =========================
   VALIDASI
========================= */
const validateTracking = (body) => {
  const {
    id_surat_ahli_waris,
    waktu,
    keterangan,
  } = body;

  const idSurat = getValidId(
    id_surat_ahli_waris
  );

  if (!idSurat) {
    return "ID surat ahli waris tidak valid.";
  }

  if (!waktu) {
    return "Waktu tracking wajib diisi.";
  }

  const waktuTracking = getTanggal(waktu);

  if (!waktuTracking) {
    return "Format waktu tidak valid.";
  }

  if (
    !keterangan ||
    typeof keterangan !== "string" ||
    !keterangan.trim()
  ) {
    return "Keterangan tracking wajib diisi.";
  }

  return null;
};

/* =========================
   TENTUKAN TAHAP DARI KETERANGAN
========================= */
const getTahapDariKeterangan = (
  keterangan
) => {
  const text = keterangan
    .toLowerCase()
    .trim();

  if (
    text.includes("diterima oleh kelurahan")
  ) {
    return "Diterima oleh Kelurahan";
  }

  if (
    text.includes("tanda tangan sekretaris")
  ) {
    return "Tanda Tangan Sekretaris";
  }

  if (
    text.includes("diproses kecamatan")
  ) {
    return "Diproses Kecamatan";
  }

  if (text.includes("selesai")) {
    return "Selesai";
  }

  return null;
};

/* =========================
   GET SEMUA TRACKING
========================= */
router.get("/", async (req, res) => {
  try {
    const data =
      await db.orm.public.TrackingSurat.all();

    return res.json(data);
  } catch (error) {
    console.error(
      "GET tracking surat error:",
      error
    );

    return res.status(500).json({
      message:
        "Gagal mengambil data tracking surat.",
    });
  }
});

/* =========================
   GET TRACKING BERDASARKAN SURAT
   HARUS DITARUH SEBELUM /:id
========================= */
router.get(
  "/surat/:id",
  async (req, res) => {
    try {
      const idSurat = getValidId(
        req.params.id
      );

      if (!idSurat) {
        return res.status(400).json({
          message:
            "ID surat ahli waris tidak valid.",
        });
      }

      const data =
        await db.orm.public.TrackingSurat
          .where({
            id_surat_ahli_waris: idSurat,
          })
          .all();

      return res.json(data);
    } catch (error) {
      console.error(
        "GET tracking berdasarkan surat error:",
        error
      );

      return res.status(500).json({
        message:
          "Gagal mengambil tracking surat.",
      });
    }
  }
);

/* =========================
   GET DETAIL TRACKING
========================= */
router.get(
  "/:id",
  async (req, res) => {
    try {
      const idTracking = getValidId(
        req.params.id
      );

      if (!idTracking) {
        return res.status(400).json({
          message:
            "ID tracking tidak valid.",
        });
      }

      const data =
        await db.orm.public.TrackingSurat
          .where({
            id_tracking: idTracking,
          })
          .all();

      if (!data.length) {
        return res.status(404).json({
          message:
            "Data tracking tidak ditemukan.",
        });
      }

      return res.json(data[0]);
    } catch (error) {
      console.error(
        "GET detail tracking error:",
        error
      );

      return res.status(500).json({
        message:
          "Gagal mengambil detail tracking.",
      });
    }
  }
);

/* =========================
   POST TRACKING
========================= */
router.post("/", async (req, res) => {
  try {
    const validationError =
      validateTracking(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const {
      id_surat_ahli_waris,
      waktu,
      keterangan,
    } = req.body;

    const idSurat = getValidId(
      id_surat_ahli_waris
    );

    const waktuTracking =
      getTanggal(waktu);

    /* =========================
       CEK SURAT
    ========================= */
    const surat =
      await db.orm.public.SuratAhliWaris
        .where({
          id_surat_ahli_waris: idSurat,
        })
        .all();

    if (!surat.length) {
      return res.status(404).json({
        message:
          "Surat ahli waris tidak ditemukan.",
      });
    }

    /* =========================
       BUAT TRACKING
    ========================= */
    const tracking =
      await db.orm.public.TrackingSurat.create(
        {
          id_surat_ahli_waris: idSurat,
          waktu: waktuTracking,
          keterangan:
            keterangan.trim(),
        }
      );

    /* =========================
       UPDATE TAHAP SURAT
    ========================= */
    const tahap =
      getTahapDariKeterangan(
        keterangan
      );

    if (tahap) {
      const updateData = {
        tahap,
      };

      /* =========================
         JIKA SELESAI
         ISI TANGGAL SELESAI
      ========================= */
      if (tahap === "Selesai") {
        updateData.tanggal_selesai =
          waktuTracking;
      }

      await db.orm.public.SuratAhliWaris
        .where({
          id_surat_ahli_waris: idSurat,
        })
        .update(updateData);
    }

    return res.status(201).json({
      message:
        "Tracking surat berhasil ditambahkan.",
      data: tracking,
    });
  } catch (error) {
    console.error(
      "POST tracking surat error:",
      error
    );

    return res.status(500).json({
      message:
        "Gagal menambahkan tracking surat.",
      error: error.message,
    });
  }
});

/* =========================
   PUT TRACKING
========================= */
router.put(
  "/:id",
  async (req, res) => {
    try {
      const idTracking = getValidId(
        req.params.id
      );

      if (!idTracking) {
        return res.status(400).json({
          message:
            "ID tracking tidak valid.",
        });
      }

      const validationError =
        validateTracking(req.body);

      if (validationError) {
        return res.status(400).json({
          message: validationError,
        });
      }

      const {
        id_surat_ahli_waris,
        waktu,
        keterangan,
      } = req.body;

      const idSurat = getValidId(
        id_surat_ahli_waris
      );

      const waktuTracking =
        getTanggal(waktu);

      /* =========================
         CEK TRACKING
      ========================= */
      const existing =
        await db.orm.public.TrackingSurat
          .where({
            id_tracking: idTracking,
          })
          .all();

      if (!existing.length) {
        return res.status(404).json({
          message:
            "Data tracking tidak ditemukan.",
        });
      }

      /* =========================
         CEK SURAT
      ========================= */
      const surat =
        await db.orm.public.SuratAhliWaris
          .where({
            id_surat_ahli_waris: idSurat,
          })
          .all();

      if (!surat.length) {
        return res.status(404).json({
          message:
            "Surat ahli waris tidak ditemukan.",
        });
      }

      /* =========================
         UPDATE TRACKING
      ========================= */
      const tracking =
        await db.orm.public.TrackingSurat
          .where({
            id_tracking: idTracking,
          })
          .update({
            id_surat_ahli_waris: idSurat,
            waktu: waktuTracking,
            keterangan:
              keterangan.trim(),
          });

      /* =========================
         UPDATE TAHAP SURAT
      ========================= */
      const tahap =
        getTahapDariKeterangan(
          keterangan
        );

      if (tahap) {
        const updateData = {
          tahap,
        };

        if (tahap === "Selesai") {
          updateData.tanggal_selesai =
            waktuTracking;
        }

        await db.orm.public.SuratAhliWaris
          .where({
            id_surat_ahli_waris: idSurat,
          })
          .update(updateData);
      }

      return res.json({
        message:
          "Tracking surat berhasil diperbarui.",
        data: tracking,
      });
    } catch (error) {
      console.error(
        "PUT tracking surat error:",
        error
      );

      return res.status(500).json({
        message:
          "Gagal memperbarui tracking surat.",
        error: error.message,
      });
    }
  }
);

/* =========================
   DELETE TRACKING
========================= */
router.delete(
  "/:id",
  async (req, res) => {
    try {
      const idTracking = getValidId(
        req.params.id
      );

      if (!idTracking) {
        return res.status(400).json({
          message:
            "ID tracking tidak valid.",
        });
      }

      const existing =
        await db.orm.public.TrackingSurat
          .where({
            id_tracking: idTracking,
          })
          .all();

      if (!existing.length) {
        return res.status(404).json({
          message:
            "Data tracking tidak ditemukan.",
        });
      }

      await db.orm.public.TrackingSurat
        .where({
          id_tracking: idTracking,
        })
        .delete();

      return res.json({
        message:
          "Tracking surat berhasil dihapus.",
      });
    } catch (error) {
      console.error(
        "DELETE tracking surat error:",
        error
      );

      return res.status(500).json({
        message:
          "Gagal menghapus tracking surat.",
        error: error.message,
      });
    }
  }
);

export default router;