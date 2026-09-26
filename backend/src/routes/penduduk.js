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

    const penduduk = await db.orm.public.Penduduk
      .where({
        id_penduduk: id
      })
      .delete();

    res.json({
      message: "Data penduduk berhasil dihapus",
      data: penduduk
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menghapus data penduduk"
    });
  }
});

export default router;