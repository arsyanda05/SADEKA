import express from "express";
import { db } from "../prisma/db.js";

const router = express.Router();

// ============================================================
// HELPER
// ============================================================

// Validasi ID
function getValidId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

// Konversi ke angka
function getNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

// Konversi tanggal menjadi Temporal.Instant
//
// Prisma 8 pada project ini menggunakan codec:
// pg/timestamptz-temporal
//
// Jadi jangan menggunakan:
// new Date()
//
// Gunakan:
// Temporal.Instant
function getTanggalPengadaan(value) {
  if (!value) {
    return null;
  }

  try {
    // Jika frontend mengirim:
    // 2026-09-25
    //
    // kita ubah menjadi:
    // 2026-09-25T00:00:00Z

    const tanggal = String(value).trim();

    return Temporal.Instant.from(
      `${tanggal}T00:00:00Z`
    );
  } catch (error) {
    return null;
  }
}

// Validasi data infrastruktur
function validateInfrastruktur(data) {
  const {
    jenis,
    alamat,
    latitude,
    longitude,
    kondisi_status,
    rt,
    rw,
    penanggung_jawab,
    no_telp,
    panjang,
    lebar,
    tanggal_pengadaan,
  } = data;

  // Field wajib
  if (
    !jenis ||
    !alamat ||
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null ||
    !kondisi_status ||
    !rt ||
    !rw ||
    !penanggung_jawab ||
    !no_telp ||
    panjang === undefined ||
    panjang === null ||
    lebar === undefined ||
    lebar === null ||
    !tanggal_pengadaan
  ) {
    return "Data infrastruktur wajib diisi lengkap";
  }

  // Validasi latitude
  const latitudeNumber = getNumber(latitude);

  if (latitudeNumber === null) {
    return "Latitude harus berupa angka";
  }

  if (latitudeNumber < -90 || latitudeNumber > 90) {
    return "Latitude harus berada di antara -90 sampai 90";
  }

  // Validasi longitude
  const longitudeNumber = getNumber(longitude);

  if (longitudeNumber === null) {
    return "Longitude harus berupa angka";
  }

  if (longitudeNumber < -180 || longitudeNumber > 180) {
    return "Longitude harus berada di antara -180 sampai 180";
  }

  // Validasi panjang
  const panjangNumber = getNumber(panjang);

  if (panjangNumber === null) {
    return "Panjang harus berupa angka";
  }

  if (panjangNumber < 0) {
    return "Panjang tidak boleh bernilai negatif";
  }

  // Validasi lebar
  const lebarNumber = getNumber(lebar);

  if (lebarNumber === null) {
    return "Lebar harus berupa angka";
  }

  if (lebarNumber < 0) {
    return "Lebar tidak boleh bernilai negatif";
  }

  // Validasi tanggal
  const tanggal = getTanggalPengadaan(
    tanggal_pengadaan
  );

  if (!tanggal) {
    return "Tanggal pengadaan tidak valid";
  }

  return null;
}

// ============================================================
// GET SEMUA DATA INFRASTRUKTUR
// ============================================================

router.get("/", async (req, res) => {
  try {
    const data =
      await db.orm.public.Infrastruktur.all();

    res.json(data);
  } catch (error) {
    console.error(
      "Error mengambil data infrastruktur:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data infrastruktur",
    });
  }
});

// ============================================================
// GET DETAIL INFRASTRUKTUR
// ============================================================

router.get("/:id", async (req, res) => {
  try {
    const id = getValidId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message:
          "ID infrastruktur tidak valid",
      });
    }

    const data =
      await db.orm.public.Infrastruktur
        .where({
          id_infrastruktur: id,
        })
        .all();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message:
          "Data infrastruktur tidak ditemukan",
      });
    }

    res.json(data[0]);
  } catch (error) {
    console.error(
      "Error mengambil detail infrastruktur:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil detail infrastruktur",
    });
  }
});

// ============================================================
// TAMBAH DATA INFRASTRUKTUR
// ============================================================

router.post("/", async (req, res) => {
  try {
    const {
      jenis,
      foto,
      alamat,
      latitude,
      longitude,
      kondisi_status,
      rt,
      rw,
      penanggung_jawab,
      no_telp,
      panjang,
      lebar,
      tanggal_pengadaan,
    } = req.body;

    // --------------------------------------------------------
    // VALIDASI
    // --------------------------------------------------------

    const validationError =
      validateInfrastruktur({
        jenis,
        alamat,
        latitude,
        longitude,
        kondisi_status,
        rt,
        rw,
        penanggung_jawab,
        no_telp,
        panjang,
        lebar,
        tanggal_pengadaan,
      });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // --------------------------------------------------------
    // KONVERSI DATA
    // --------------------------------------------------------

    const latitudeNumber =
      getNumber(latitude);

    const longitudeNumber =
      getNumber(longitude);

    const panjangNumber =
      getNumber(panjang);

    const lebarNumber =
      getNumber(lebar);

    const tanggalPengadaan =
      getTanggalPengadaan(
        tanggal_pengadaan
      );

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const data =
      await db.orm.public.Infrastruktur.create({
        jenis: String(jenis).trim(),

        foto: foto
          ? String(foto).trim()
          : "",

        alamat:
          String(alamat).trim(),

        latitude:
          latitudeNumber,

        longitude:
          longitudeNumber,

        kondisi_status:
          String(
            kondisi_status
          ).trim(),

        rt:
          String(rt).trim(),

        rw:
          String(rw).trim(),

        penanggung_jawab:
          String(
            penanggung_jawab
          ).trim(),

        no_telp:
          String(no_telp).trim(),

        panjang:
          panjangNumber,

        lebar:
          lebarNumber,

        // PENTING:
        // menggunakan Temporal.Instant
        // bukan new Date()
        tanggal_pengadaan:
          tanggalPengadaan,
      });

    res.status(201).json({
      message:
        "Data infrastruktur berhasil ditambahkan",

      data,
    });
  } catch (error) {
    console.error(
      "Error menambahkan infrastruktur:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menambahkan data infrastruktur",

      error: error.message,
    });
  }
});

// ============================================================
// UPDATE DATA INFRASTRUKTUR
// ============================================================

router.put("/:id", async (req, res) => {
  try {
    const id = getValidId(
      req.params.id
    );

    if (!id) {
      return res.status(400).json({
        message:
          "ID infrastruktur tidak valid",
      });
    }

    const {
      jenis,
      foto,
      alamat,
      latitude,
      longitude,
      kondisi_status,
      rt,
      rw,
      penanggung_jawab,
      no_telp,
      panjang,
      lebar,
      tanggal_pengadaan,
    } = req.body;

    // --------------------------------------------------------
    // VALIDASI
    // --------------------------------------------------------

    const validationError =
      validateInfrastruktur({
        jenis,
        alamat,
        latitude,
        longitude,
        kondisi_status,
        rt,
        rw,
        penanggung_jawab,
        no_telp,
        panjang,
        lebar,
        tanggal_pengadaan,
      });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // --------------------------------------------------------
    // KONVERSI DATA
    // --------------------------------------------------------

    const latitudeNumber =
      getNumber(latitude);

    const longitudeNumber =
      getNumber(longitude);

    const panjangNumber =
      getNumber(panjang);

    const lebarNumber =
      getNumber(lebar);

    const tanggalPengadaan =
      getTanggalPengadaan(
        tanggal_pengadaan
      );

    // --------------------------------------------------------
    // CEK DATA
    // --------------------------------------------------------

    const existingData =
      await db.orm.public.Infrastruktur
        .where({
          id_infrastruktur: id,
        })
        .all();

    if (
      !existingData ||
      existingData.length === 0
    ) {
      return res.status(404).json({
        message:
          "Data infrastruktur tidak ditemukan",
      });
    }

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    const data =
      await db.orm.public.Infrastruktur
        .where({
          id_infrastruktur: id,
        })
        .update({
          jenis:
            String(jenis).trim(),

          foto: foto
            ? String(foto).trim()
            : "",

          alamat:
            String(alamat).trim(),

          latitude:
            latitudeNumber,

          longitude:
            longitudeNumber,

          kondisi_status:
            String(
              kondisi_status
            ).trim(),

          rt:
            String(rt).trim(),

          rw:
            String(rw).trim(),

          penanggung_jawab:
            String(
              penanggung_jawab
            ).trim(),

          no_telp:
            String(no_telp).trim(),

          panjang:
            panjangNumber,

          lebar:
            lebarNumber,

          // PENTING:
          // menggunakan Temporal.Instant
          // bukan new Date()
          tanggal_pengadaan:
            tanggalPengadaan,
        });

    res.json({
      message:
        "Data infrastruktur berhasil diperbarui",

      data,
    });
  } catch (error) {
    console.error(
      "Error mengubah infrastruktur:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengubah data infrastruktur",

      error: error.message,
    });
  }
});

// ============================================================
// DELETE DATA INFRASTRUKTUR
// ============================================================

router.delete("/:id", async (req, res) => {
  try {
    const id = getValidId(
      req.params.id
    );

    if (!id) {
      return res.status(400).json({
        message:
          "ID infrastruktur tidak valid",
      });
    }

    // --------------------------------------------------------
    // CEK DATA
    // --------------------------------------------------------

    const existingData =
      await db.orm.public.Infrastruktur
        .where({
          id_infrastruktur: id,
        })
        .all();

    if (
      !existingData ||
      existingData.length === 0
    ) {
      return res.status(404).json({
        message:
          "Data infrastruktur tidak ditemukan",
      });
    }

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    const data =
      await db.orm.public.Infrastruktur
        .where({
          id_infrastruktur: id,
        })
        .delete();

    res.json({
      message:
        "Data infrastruktur berhasil dihapus",

      data,
    });
  } catch (error) {
    console.error(
      "Error menghapus infrastruktur:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menghapus data infrastruktur",

      error: error.message,
    });
  }
});

export default router;