import express from "express";
import { db } from "../prisma/db.js";

const router = express.Router();

// ============================================================
// VALIDASI ID
// ============================================================

function getValidId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

// ============================================================
// VALIDASI DATA PEGAWAI
// ============================================================

function validatePegawai(data) {
  const {
    nama,
    NIP,
    jabatan,
    status,
    email_pribadi,
    email_pemerintahan,
    no_telepon,
    alamat_domisili,
  } = data;

  if (
    !nama ||
    !NIP ||
    !jabatan ||
    !status ||
    !email_pribadi ||
    !email_pemerintahan ||
    !no_telepon ||
    !alamat_domisili
  ) {
    return "Data pegawai wajib diisi lengkap";
  }

  return null;
}

// ============================================================
// GET SEMUA PEGAWAI
// ============================================================

router.get("/", async (req, res) => {
  try {
    const pegawai =
      await db.orm.public.Pegawai.all();

    res.json(pegawai);
  } catch (error) {
    console.error(
      "Error mengambil data pegawai:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data pegawai",
    });
  }
});

// ============================================================
// GET DETAIL PEGAWAI
// ============================================================

router.get("/:id", async (req, res) => {
  try {
    const id = getValidId(
      req.params.id
    );

    if (!id) {
      return res.status(400).json({
        message:
          "ID pegawai tidak valid",
      });
    }

    const pegawai =
      await db.orm.public.Pegawai
        .where({
          id_pegawai: id,
        })
        .all();

    if (
      !pegawai ||
      pegawai.length === 0
    ) {
      return res.status(404).json({
        message:
          "Data pegawai tidak ditemukan",
      });
    }

    res.json(pegawai[0]);
  } catch (error) {
    console.error(
      "Error mengambil detail pegawai:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil detail pegawai",
    });
  }
});

// ============================================================
// TAMBAH PEGAWAI
// ============================================================

router.post("/", async (req, res) => {
  try {
    const {
      nama,
      NIP,
      jabatan,
      status,
      email_pribadi,
      email_pemerintahan,
      no_telepon,
      alamat_domisili,
    } = req.body;

    const validationError =
      validatePegawai({
        nama,
        NIP,
        jabatan,
        status,
        email_pribadi,
        email_pemerintahan,
        no_telepon,
        alamat_domisili,
      });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const pegawai =
      await db.orm.public.Pegawai.create({
        nama: String(nama).trim(),
        NIP: String(NIP).trim(),
        jabatan: String(jabatan).trim(),
        status: String(status).trim(),
        email_pribadi:
          String(email_pribadi).trim(),
        email_pemerintahan:
          String(
            email_pemerintahan
          ).trim(),
        no_telepon:
          String(no_telepon).trim(),
        alamat_domisili:
          String(
            alamat_domisili
          ).trim(),
      });

    res.status(201).json({
      message:
        "Data pegawai berhasil ditambahkan",
      data: pegawai,
    });
  } catch (error) {
    console.error(
      "Error menambahkan data pegawai:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menambahkan data pegawai",
      error: error.message,
    });
  }
});

// ============================================================
// EDIT PEGAWAI
// ============================================================

router.put("/:id", async (req, res) => {
  try {
    const id = getValidId(
      req.params.id
    );

    if (!id) {
      return res.status(400).json({
        message:
          "ID pegawai tidak valid",
      });
    }

    const {
      nama,
      NIP,
      jabatan,
      status,
      email_pribadi,
      email_pemerintahan,
      no_telepon,
      alamat_domisili,
    } = req.body;

    const validationError =
      validatePegawai({
        nama,
        NIP,
        jabatan,
        status,
        email_pribadi,
        email_pemerintahan,
        no_telepon,
        alamat_domisili,
      });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const existingData =
      await db.orm.public.Pegawai
        .where({
          id_pegawai: id,
        })
        .all();

    if (
      !existingData ||
      existingData.length === 0
    ) {
      return res.status(404).json({
        message:
          "Data pegawai tidak ditemukan",
      });
    }

    const pegawai =
      await db.orm.public.Pegawai
        .where({
          id_pegawai: id,
        })
        .update({
          nama: String(nama).trim(),
          NIP: String(NIP).trim(),
          jabatan:
            String(jabatan).trim(),
          status:
            String(status).trim(),
          email_pribadi:
            String(
              email_pribadi
            ).trim(),
          email_pemerintahan:
            String(
              email_pemerintahan
            ).trim(),
          no_telepon:
            String(
              no_telepon
            ).trim(),
          alamat_domisili:
            String(
              alamat_domisili
            ).trim(),
        });

    res.json({
      message:
        "Data pegawai berhasil diperbarui",
      data: pegawai,
    });
  } catch (error) {
    console.error(
      "Error mengubah data pegawai:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengubah data pegawai",
      error: error.message,
    });
  }
});

// ============================================================
// HAPUS PEGAWAI
// ============================================================

router.delete("/:id", async (req, res) => {
  try {
    const id = getValidId(
      req.params.id
    );

    if (!id) {
      return res.status(400).json({
        message:
          "ID pegawai tidak valid",
      });
    }

    const existingData =
      await db.orm.public.Pegawai
        .where({
          id_pegawai: id,
        })
        .all();

    if (
      !existingData ||
      existingData.length === 0
    ) {
      return res.status(404).json({
        message:
          "Data pegawai tidak ditemukan",
      });
    }

    const pegawai =
      await db.orm.public.Pegawai
        .where({
          id_pegawai: id,
        })
        .delete();

    res.json({
      message:
        "Data pegawai berhasil dihapus",
      data: pegawai,
    });
  } catch (error) {
    console.error(
      "Error menghapus data pegawai:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menghapus data pegawai",
    });
  }
});

export default router;