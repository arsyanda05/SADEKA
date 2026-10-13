import express from "express";
import { db } from "../prisma/db.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const penduduk = await db.orm.public.Penduduk.all();

    res.json(penduduk);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengambil data penduduk"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      rt,
      rw,
      status_penduduk
    } = req.body;

    const penduduk = await db.orm.public.Penduduk.create({
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir: Temporal.Instant.from(
        `${tanggal_lahir}T00:00:00Z`
      ),
      jenis_kelamin,
      alamat,
      rt,
      rw,
      status_penduduk
    });

    res.status(201).json(penduduk);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menambahkan data penduduk"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      rt,
      rw,
      status_penduduk
    } = req.body;

    const penduduk = await db.orm.public.Penduduk
      .where({
        id_penduduk: id
      })
      .update({
        nik,
        nama,
        tempat_lahir,
        tanggal_lahir: Temporal.Instant.from(
          `${tanggal_lahir}T00:00:00Z`
        ),
        jenis_kelamin,
        alamat,
        rt,
        rw,
        status_penduduk
      });

    res.json(penduduk);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal mengubah data penduduk"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID penduduk tidak valid"
      });
    }

    const dataPenduduk = await db.orm.public.Penduduk
      .where({
        id_penduduk: id
      })
      .all();

    if (dataPenduduk.length === 0) {
      return res.status(404).json({
        message: "Data penduduk tidak ditemukan"
      });
    }

    const suratAhliWaris = await db.orm.public.SuratAhliWaris
      .where({
        id_penduduk: id
      })
      .all();

    for (const surat of suratAhliWaris) {
      const dokumen = await db.orm.public.Dokumen
        .where({
          id_surat_ahli_waris: surat.id_surat_ahli_waris
        })
        .all();

      for (const item of dokumen) {
        await db.orm.public.Dokumen
          .where({
            id_dokumen: item.id_dokumen
          })
          .delete();
      }

      const tracking = await db.orm.public.TrackingSurat
        .where({
          id_surat_ahli_waris: surat.id_surat_ahli_waris
        })
        .all();

      for (const item of tracking) {
        await db.orm.public.TrackingSurat
          .where({
            id_tracking: item.id_tracking
          })
          .delete();
      }

      const ahliWaris = await db.orm.public.AhliWaris
        .where({
          id_surat_ahli_waris: surat.id_surat_ahli_waris
        })
        .all();

      for (const item of ahliWaris) {
        await db.orm.public.AhliWaris
          .where({
            id_ahli_waris: item.id_ahli_waris
          })
          .delete();
      }

      await db.orm.public.SuratAhliWaris
        .where({
          id_surat_ahli_waris: surat.id_surat_ahli_waris
        })
        .delete();
    }

    const hubunganAhliWaris = await db.orm.public.AhliWaris
      .where({
        id_penduduk: id
      })
      .all();

    for (const item of hubunganAhliWaris) {
      await db.orm.public.AhliWaris
        .where({
          id_ahli_waris: item.id_ahli_waris
        })
        .delete();
    }

    const dataKesejahteraan = await db.orm.public.Kesejahteraan
      .where({
        id_penduduk: id
      })
      .all();

    for (const item of dataKesejahteraan) {
      await db.orm.public.Kesejahteraan
        .where({
          id_kesejahteraan: item.id_kesejahteraan
        })
        .delete();
    }

    await db.orm.public.Penduduk
      .where({
        id_penduduk: id
      })
      .delete();

    res.json({
      message: "Data penduduk berhasil dihapus",
      data: dataPenduduk[0]
    });
  } catch (error) {
    console.error("Gagal menghapus data penduduk:", error);

    res.status(500).json({
      message: "Gagal menghapus data penduduk",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;