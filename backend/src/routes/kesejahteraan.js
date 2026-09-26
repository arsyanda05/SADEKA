import express from "express";
import { db } from "../prisma/db.js";

const router = express.Router();

/**
 * Menghitung usia berdasarkan tanggal lahir
 *
 * tanggal_lahir dari Prisma 8 berupa Temporal.Instant,
 * sehingga harus diubah ke string terlebih dahulu
 * sebelum digunakan oleh JavaScript Date.
 */
function hitungUsia(tanggalLahir) {
  if (!tanggalLahir) {
    return "";
  }

  try {
    const lahir = new Date(
      tanggalLahir.toString()
    );

    const sekarang = new Date();

    let usia =
      sekarang.getFullYear() -
      lahir.getFullYear();

    const belumUlangTahun =
      sekarang.getMonth() < lahir.getMonth() ||
      (
        sekarang.getMonth() === lahir.getMonth() &&
        sekarang.getDate() < lahir.getDate()
      );

    if (belumUlangTahun) {
      usia--;
    }

    return `${usia} tahun`;
  } catch (error) {
    console.error(
      "Error menghitung usia:",
      error
    );

    return "";
  }
}

/**
 * Format tempat dan tanggal lahir
 */
function formatTempatTanggalLahir(dataPenduduk) {
  if (
    !dataPenduduk?.tempat_lahir ||
    !dataPenduduk?.tanggal_lahir
  ) {
    return "";
  }

  try {
    const tanggalLahir = new Date(
      dataPenduduk.tanggal_lahir.toString()
    );

    const tanggal =
      tanggalLahir.toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );

    return `${dataPenduduk.tempat_lahir}, ${tanggal}`;
  } catch (error) {
    console.error(
      "Error memformat tanggal lahir:",
      error
    );

    return dataPenduduk.tempat_lahir || "";
  }
}

/**
 * GET semua data kesejahteraan
 */
router.get("/", async (req, res) => {
  try {
    const dataKesejahteraan =
      await db.orm.public.Kesejahteraan.all();

    const hasil = await Promise.all(
      dataKesejahteraan.map(async (item) => {
        const penduduk =
          await db.orm.public.Penduduk
            .where({
              id_penduduk: item.id_penduduk,
            })
            .all();

        const dataPenduduk = penduduk[0];

        return {
          id_kesejahteraan:
            item.id_kesejahteraan,

          id_penduduk:
            item.id_penduduk,

          // =========================
          // DATA PENDUDUK
          // =========================

          nama: dataPenduduk?.nama || "",

          nik: dataPenduduk?.nik || "",

          tempatTanggalLahir:
            formatTempatTanggalLahir(
              dataPenduduk
            ),

          usia: hitungUsia(
            dataPenduduk?.tanggal_lahir
          ),

          jenisKelamin:
            dataPenduduk?.jenis_kelamin || "",

          alamat:
            dataPenduduk?.alamat || "",

          rt:
            dataPenduduk?.rt || "",

          rw:
            dataPenduduk?.rw || "",

          // =========================
          // DATA KESEJAHTERAAN
          // =========================

          kategori:
            item.kategori,

          status:
            item.status,

          keterangan:
            item.keterangan,
        };
      })
    );

    res.json(hasil);
  } catch (error) {
    console.error(
      "Error mengambil data kesejahteraan:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data kesejahteraan",
    });
  }
});

/**
 * GET satu data kesejahteraan berdasarkan ID
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data =
      await db.orm.public.Kesejahteraan
        .where({
          id_kesejahteraan: id,
        })
        .all();

    if (!data.length) {
      return res.status(404).json({
        message:
          "Data kesejahteraan tidak ditemukan",
      });
    }

    const item = data[0];

    const penduduk =
      await db.orm.public.Penduduk
        .where({
          id_penduduk: item.id_penduduk,
        })
        .all();

    const dataPenduduk = penduduk[0];

    res.json({
      id_kesejahteraan:
        item.id_kesejahteraan,

      id_penduduk:
        item.id_penduduk,

      // =========================
      // DATA PENDUDUK
      // =========================

      nama:
        dataPenduduk?.nama || "",

      nik:
        dataPenduduk?.nik || "",

      tempatTanggalLahir:
        formatTempatTanggalLahir(
          dataPenduduk
        ),

      usia:
        hitungUsia(
          dataPenduduk?.tanggal_lahir
        ),

      jenisKelamin:
        dataPenduduk?.jenis_kelamin || "",

      alamat:
        dataPenduduk?.alamat || "",

      rt:
        dataPenduduk?.rt || "",

      rw:
        dataPenduduk?.rw || "",

      // =========================
      // DATA KESEJAHTERAAN
      // =========================

      kategori:
        item.kategori,

      status:
        item.status,

      keterangan:
        item.keterangan,
    });
  } catch (error) {
    console.error(
      "Error mengambil detail kesejahteraan:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil detail kesejahteraan",
    });
  }
});

/**
 * POST tambah data kesejahteraan
 */
router.post("/", async (req, res) => {
  try {
    const {
      id_penduduk,
      kategori,
      status,
      keterangan,
    } = req.body;

    if (
      !id_penduduk ||
      !kategori ||
      !status ||
      !keterangan
    ) {
      return res.status(400).json({
        message:
          "Data kesejahteraan wajib diisi",
      });
    }

    // Cek apakah penduduk tersedia
    const penduduk =
      await db.orm.public.Penduduk
        .where({
          id_penduduk:
            Number(id_penduduk),
        })
        .all();

    if (!penduduk.length) {
      return res.status(404).json({
        message:
          "Data penduduk tidak ditemukan",
      });
    }

    const data =
      await db.orm.public.Kesejahteraan.create({
        id_penduduk:
          Number(id_penduduk),

        kategori,

        status,

        keterangan,
      });

    res.status(201).json({
      message:
        "Data kesejahteraan berhasil ditambahkan",

      data,
    });
  } catch (error) {
    console.error(
      "Error menambahkan kesejahteraan:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menambahkan data kesejahteraan",
    });
  }
});

/**
 * PUT ubah data kesejahteraan
 */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      id_penduduk,
      kategori,
      status,
      keterangan,
    } = req.body;

    if (
      !id_penduduk ||
      !kategori ||
      !status ||
      !keterangan
    ) {
      return res.status(400).json({
        message:
          "Data kesejahteraan wajib diisi",
      });
    }

    // Cek data kesejahteraan
    const dataLama =
      await db.orm.public.Kesejahteraan
        .where({
          id_kesejahteraan: id,
        })
        .all();

    if (!dataLama.length) {
      return res.status(404).json({
        message:
          "Data kesejahteraan tidak ditemukan",
      });
    }

    // Cek penduduk
    const penduduk =
      await db.orm.public.Penduduk
        .where({
          id_penduduk:
            Number(id_penduduk),
        })
        .all();

    if (!penduduk.length) {
      return res.status(404).json({
        message:
          "Data penduduk tidak ditemukan",
      });
    }

    const data =
      await db.orm.public.Kesejahteraan
        .where({
          id_kesejahteraan: id,
        })
        .update({
          id_penduduk:
            Number(id_penduduk),

          kategori,

          status,

          keterangan,
        });

    res.json({
      message:
        "Data kesejahteraan berhasil diubah",

      data,
    });
  } catch (error) {
    console.error(
      "Error mengubah kesejahteraan:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengubah data kesejahteraan",
    });
  }
});

/**
 * DELETE data kesejahteraan
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const dataLama =
      await db.orm.public.Kesejahteraan
        .where({
          id_kesejahteraan: id,
        })
        .all();

    if (!dataLama.length) {
      return res.status(404).json({
        message:
          "Data kesejahteraan tidak ditemukan",
      });
    }

    await db.orm.public.Kesejahteraan
      .where({
        id_kesejahteraan: id,
      })
      .delete();

    res.json({
      message:
        "Data kesejahteraan berhasil dihapus",
    });
  } catch (error) {
    console.error(
      "Error menghapus kesejahteraan:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menghapus data kesejahteraan",
    });
  }
});

export default router;