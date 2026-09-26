import express from "express";
import { db } from "../prisma/db.js";

const router = express.Router();

/* =====================================================
   HELPER
===================================================== */

const getValidId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

const getTanggal = (value) => {
  if (!value) {
    return null;
  }

  return Temporal.Instant.from(`${value}T00:00:00Z`);
};

const getPendudukById = async (id) => {
  if (!id) {
    return null;
  }

  const data = await db.orm.public.Penduduk
    .where({
      id_penduduk: id,
    })
    .all();

  return data[0] || null;
};

const formatPewaris = async (idPenduduk) => {
  const penduduk = await getPendudukById(idPenduduk);

  if (!penduduk) {
    return null;
  }

  return {
    id_penduduk: penduduk.id_penduduk,
    nama: penduduk.nama,
    nik: penduduk.nik,
    tempat_lahir: penduduk.tempat_lahir,
    tanggal_lahir: penduduk.tanggal_lahir,
    jenis_kelamin: penduduk.jenis_kelamin,
    alamat: penduduk.alamat,
    rt: penduduk.rt,
    rw: penduduk.rw,
    status_penduduk: penduduk.status_penduduk,
  };
};

const formatAhliWaris = async (idAhliWaris) => {
  if (!idAhliWaris) {
    return null;
  }

  const dataAhliWaris = await db.orm.public.AhliWaris
    .where({
      id_surat_ahli_waris: idAhliWaris,
    })
    .all();

  const ahliWaris = dataAhliWaris[0];

  if (!ahliWaris) {
    return null;
  }

  const penduduk = await getPendudukById(
    ahliWaris.id_penduduk
  );

  if (!penduduk) {
    return null;
  }

  return {
    id_ahli_waris: ahliWaris.id_ahli_waris,
    id_penduduk: ahliWaris.id_penduduk,
    hubungan: ahliWaris.hubungan,

    nama: penduduk.nama,
    nik: penduduk.nik,
    tempat_lahir: penduduk.tempat_lahir,
    tanggal_lahir: penduduk.tanggal_lahir,
    jenis_kelamin: penduduk.jenis_kelamin,
    alamat: penduduk.alamat,
    rt: penduduk.rt,
    rw: penduduk.rw,
    status_penduduk: penduduk.status_penduduk,
  };
};

/* =====================================================
   GET SEMUA SURAT AHLI WARIS
===================================================== */

router.get("/", async (req, res) => {
  try {
    const data = await db.orm.public.SuratAhliWaris.all();

    const hasil = [];

    for (const surat of data) {
      const pewaris = await formatPewaris(
        surat.id_penduduk
      );

      const ahliWaris = await formatAhliWaris(
        surat.id_surat_ahli_waris
      );

      hasil.push({
        ...surat,
        penduduk: pewaris,
        ahliWaris,
      });
    }

    res.json(hasil);
  } catch (error) {
    console.error(
      "Gagal mengambil data Surat Ahli Waris:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil data Surat Ahli Waris",
    });
  }
});

/* =====================================================
   GET DETAIL SURAT AHLI WARIS
===================================================== */

router.get("/:id", async (req, res) => {
  try {
    const id = getValidId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "ID surat tidak valid",
      });
    }

    const data = await db.orm.public.SuratAhliWaris
      .where({
        id_surat_ahli_waris: id,
      })
      .all();

    const surat = data[0];

    if (!surat) {
      return res.status(404).json({
        message: "Surat Ahli Waris tidak ditemukan",
      });
    }

    const pewaris = await formatPewaris(
      surat.id_penduduk
    );

    const ahliWaris = await formatAhliWaris(id);

    res.json({
      ...surat,
      penduduk: pewaris,
      ahliWaris,
    });
  } catch (error) {
    console.error(
      "Gagal mengambil detail Surat Ahli Waris:",
      error
    );

    res.status(500).json({
      message:
        "Gagal mengambil detail Surat Ahli Waris",
    });
  }
});

/* =====================================================
   TAMBAH SURAT AHLI WARIS
===================================================== */

router.post("/", async (req, res) => {
  try {
    const {
      id_penduduk,
      id_penduduk_ahli_waris,
      hubungan,
      nomor_surat,
      tanggal_pengajuan,
      tahap,
      tanggal_selesai,
    } = req.body;

    const idPenduduk = getValidId(id_penduduk);
    const idPendudukAhliWaris = getValidId(
      id_penduduk_ahli_waris
    );

    if (!idPenduduk) {
      return res.status(400).json({
        message: "ID pewaris tidak valid",
      });
    }

    if (!idPendudukAhliWaris) {
      return res.status(400).json({
        message: "ID ahli waris tidak valid",
      });
    }

    if (idPenduduk === idPendudukAhliWaris) {
      return res.status(400).json({
        message:
          "Pewaris dan ahli waris tidak boleh sama",
      });
    }

    const pewaris = await getPendudukById(idPenduduk);
    const ahliWarisPenduduk =
      await getPendudukById(idPendudukAhliWaris);

    if (!pewaris) {
      return res.status(404).json({
        message: "Data pewaris tidak ditemukan",
      });
    }

    if (!ahliWarisPenduduk) {
      return res.status(404).json({
        message:
          "Data penduduk ahli waris tidak ditemukan",
      });
    }

    const surat = await db.orm.public.SuratAhliWaris.create(
      {
        id_penduduk: idPenduduk,
        nomor_surat: nomor_surat || "",
        tanggal_pengajuan:
          getTanggal(tanggal_pengajuan),
        tahap: tahap || "Diajukan",
        tanggal_selesai:
          getTanggal(tanggal_selesai),
      }
    );

    await db.orm.public.AhliWaris.create({
      id_surat_ahli_waris:
        surat.id_surat_ahli_waris,
      id_penduduk: idPendudukAhliWaris,
      hubungan: hubungan || "",
    });

    const hasil = {
      ...surat,
      penduduk: {
        id_penduduk: pewaris.id_penduduk,
        nama: pewaris.nama,
        nik: pewaris.nik,
      },
      ahliWaris: {
        id_penduduk:
          ahliWarisPenduduk.id_penduduk,
        nama: ahliWarisPenduduk.nama,
        nik: ahliWarisPenduduk.nik,
        hubungan: hubungan || "",
      },
    };

    res.status(201).json({
      message:
        "Surat Ahli Waris berhasil ditambahkan",
      data: hasil,
    });
  } catch (error) {
    console.error(
      "Gagal menambahkan Surat Ahli Waris:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menambahkan Surat Ahli Waris",
      error: error.message,
    });
  }
});

/* =====================================================
   EDIT SURAT AHLI WARIS
===================================================== */

router.put("/:id", async (req, res) => {
  try {
    const id = getValidId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "ID surat tidak valid",
      });
    }

    const {
      id_penduduk,
      id_penduduk_ahli_waris,
      hubungan,
      nomor_surat,
      tanggal_pengajuan,
      tahap,
      tanggal_selesai,
    } = req.body;

    const idPenduduk = getValidId(id_penduduk);
    const idPendudukAhliWaris = getValidId(
      id_penduduk_ahli_waris
    );

    if (!idPenduduk || !idPendudukAhliWaris) {
      return res.status(400).json({
        message:
          "Data pewaris atau ahli waris tidak valid",
      });
    }

    if (idPenduduk === idPendudukAhliWaris) {
      return res.status(400).json({
        message:
          "Pewaris dan ahli waris tidak boleh sama",
      });
    }

    const suratData =
      await db.orm.public.SuratAhliWaris
        .where({
          id_surat_ahli_waris: id,
        })
        .all();

    const surat = suratData[0];

    if (!surat) {
      return res.status(404).json({
        message:
          "Surat Ahli Waris tidak ditemukan",
      });
    }

    await db.orm.public.SuratAhliWaris
      .where({
        id_surat_ahli_waris: id,
      })
      .update({
        id_penduduk: idPenduduk,
        nomor_surat: nomor_surat || "",
        tanggal_pengajuan:
          getTanggal(tanggal_pengajuan),
        tahap: tahap || "Diajukan",
        tanggal_selesai:
          getTanggal(tanggal_selesai),
      });

    const ahliWarisData =
      await db.orm.public.AhliWaris
        .where({
          id_surat_ahli_waris: id,
        })
        .all();

    if (ahliWarisData.length > 0) {
      await db.orm.public.AhliWaris
        .where({
          id_ahli_waris:
            ahliWarisData[0].id_ahli_waris,
        })
        .update({
          id_penduduk: idPendudukAhliWaris,
          hubungan: hubungan || "",
        });
    } else {
      await db.orm.public.AhliWaris.create({
        id_surat_ahli_waris: id,
        id_penduduk: idPendudukAhliWaris,
        hubungan: hubungan || "",
      });
    }

    const hasilData =
      await db.orm.public.SuratAhliWaris
        .where({
          id_surat_ahli_waris: id,
        })
        .all();

    res.json({
      message:
        "Surat Ahli Waris berhasil diperbarui",
      data: hasilData[0],
    });
  } catch (error) {
    console.error(
      "Gagal memperbarui Surat Ahli Waris:",
      error
    );

    res.status(500).json({
      message:
        "Gagal memperbarui Surat Ahli Waris",
      error: error.message,
    });
  }
});

/* =====================================================
   HAPUS SURAT AHLI WARIS
===================================================== */

router.delete("/:id", async (req, res) => {
  try {
    const id = getValidId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "ID surat tidak valid",
      });
    }

    /* ---------------------------------------------
       CEK SURAT
    --------------------------------------------- */

    const suratData =
      await db.orm.public.SuratAhliWaris
        .where({
          id_surat_ahli_waris: id,
        })
        .all();

    const surat = suratData[0];

    if (!surat) {
      return res.status(404).json({
        message:
          "Surat Ahli Waris tidak ditemukan",
      });
    }

    /* ---------------------------------------------
       1. HAPUS DOKUMEN
       Dokumen memiliki FK ke SuratAhliWaris
    --------------------------------------------- */

    const dokumenData =
      await db.orm.public.Dokumen
        .where({
          id_surat_ahli_waris: id,
        })
        .all();

    for (const dokumen of dokumenData) {
      await db.orm.public.Dokumen
        .where({
          id_dokumen: dokumen.id_dokumen,
        })
        .delete();
    }

    /* ---------------------------------------------
       2. HAPUS TRACKING
       TrackingSurat memiliki FK ke SuratAhliWaris
    --------------------------------------------- */

    const trackingData =
      await db.orm.public.TrackingSurat
        .where({
          id_surat_ahli_waris: id,
        })
        .all();

    for (const tracking of trackingData) {
      await db.orm.public.TrackingSurat
        .where({
          id_tracking: tracking.id_tracking,
        })
        .delete();
    }

    /* ---------------------------------------------
       3. HAPUS AHLI WARIS
    --------------------------------------------- */

    const ahliWarisData =
      await db.orm.public.AhliWaris
        .where({
          id_surat_ahli_waris: id,
        })
        .all();

    for (const ahliWaris of ahliWarisData) {
      await db.orm.public.AhliWaris
        .where({
          id_ahli_waris:
            ahliWaris.id_ahli_waris,
        })
        .delete();
    }

    /* ---------------------------------------------
       4. BARU HAPUS SURAT
    --------------------------------------------- */

    await db.orm.public.SuratAhliWaris
      .where({
        id_surat_ahli_waris: id,
      })
      .delete();

    res.json({
      message:
        "Surat Ahli Waris berhasil dihapus",
    });
  } catch (error) {
    console.error(
      "Gagal menghapus Surat Ahli Waris:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menghapus Surat Ahli Waris",
      error: error.message,
    });
  }
});

export default router;