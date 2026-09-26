import { Router } from "express";
import { db } from "../prisma/db.js";

const router = Router();

/*
 * ==========================================
 * GET SEMUA DATA UMKM
 * GET /api/umkm
 * ==========================================
 */
router.get("/", async (req, res) => {
  try {
    const data = await db.orm.public.UMKM.all();

    res.json(data);
  } catch (error) {
    console.error("Error mengambil data UMKM:", error);

    res.status(500).json({
      message: "Gagal mengambil data UMKM",
    });
  }
});


/*
 * ==========================================
 * GET DETAIL UMKM
 * GET /api/umkm/:id
 * ==========================================
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "ID UMKM tidak valid",
      });
    }

    const data = await db.orm.public.UMKM
      .where({
        id_umkm: id,
      })
      .all();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Data UMKM tidak ditemukan",
      });
    }

    res.json(data[0]);
  } catch (error) {
    console.error("Error mengambil detail UMKM:", error);

    res.status(500).json({
      message: "Gagal mengambil detail UMKM",
    });
  }
});


/*
 * ==========================================
 * TAMBAH DATA UMKM
 * POST /api/umkm
 * ==========================================
 */
router.post("/", async (req, res) => {
  try {
    const {
      nama_usaha,
      pemilik,
      jenis_usaha,
      nib,
      alamat,
      rt,
      rw,
    } = req.body;

    /*
     * Validasi data wajib
     */
    if (
      !nama_usaha ||
      !pemilik ||
      !jenis_usaha ||
      !nib ||
      !alamat ||
      !rt ||
      !rw
    ) {
      return res.status(400).json({
        message: "Semua data UMKM wajib diisi",
      });
    }

    const data = await db.orm.public.UMKM.create({
      nama_usaha: nama_usaha.trim(),
      pemilik: pemilik.trim(),
      jenis_usaha: jenis_usaha.trim(),
      nib: nib.trim(),
      alamat: alamat.trim(),
      rt: rt.trim(),
      rw: rw.trim(),
    });

    res.status(201).json(data);
  } catch (error) {
    console.error("Error menambahkan data UMKM:", error);

    res.status(500).json({
      message: "Gagal menambahkan data UMKM",
    });
  }
});


/*
 * ==========================================
 * UBAH DATA UMKM
 * PUT /api/umkm/:id
 * ==========================================
 */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "ID UMKM tidak valid",
      });
    }

    const {
      nama_usaha,
      pemilik,
      jenis_usaha,
      nib,
      alamat,
      rt,
      rw,
    } = req.body;

    /*
     * Validasi data wajib
     */
    if (
      !nama_usaha ||
      !pemilik ||
      !jenis_usaha ||
      !nib ||
      !alamat ||
      !rt ||
      !rw
    ) {
      return res.status(400).json({
        message: "Semua data UMKM wajib diisi",
      });
    }

    const data = await db.orm.public.UMKM
      .where({
        id_umkm: id,
      })
      .update({
        nama_usaha: nama_usaha.trim(),
        pemilik: pemilik.trim(),
        jenis_usaha: jenis_usaha.trim(),
        nib: nib.trim(),
        alamat: alamat.trim(),
        rt: rt.trim(),
        rw: rw.trim(),
      });

    res.json(data);
  } catch (error) {
    console.error("Error mengubah data UMKM:", error);

    res.status(500).json({
      message: "Gagal mengubah data UMKM",
    });
  }
});


/*
 * ==========================================
 * HAPUS DATA UMKM
 * DELETE /api/umkm/:id
 * ==========================================
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "ID UMKM tidak valid",
      });
    }

    const data = await db.orm.public.UMKM
      .where({
        id_umkm: id,
      })
      .delete();

    res.json({
      message: "Data UMKM berhasil dihapus",
      data,
    });
  } catch (error) {
    console.error("Error menghapus data UMKM:", error);

    res.status(500).json({
      message: "Gagal menghapus data UMKM",
    });
  }
});

export default router;