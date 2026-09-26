import express from "express";
import { db } from "../prisma/db.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const agenda = await db.orm.public.Agenda.all();

    res.json(agenda);
  } catch (error) {
    console.error("Error mengambil data agenda:", error);

    res.status(500).json({
      message: "Gagal mengambil data agenda",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const agenda = await db.orm.public.Agenda
      .where({
        id_agenda: id,
      })
      .all();

    if (agenda.length === 0) {
      return res.status(404).json({
        message: "Data agenda tidak ditemukan",
      });
    }

    res.json(agenda[0]);
  } catch (error) {
    console.error("Error mengambil detail agenda:", error);

    res.status(500).json({
      message: "Gagal mengambil detail agenda",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      tanggal,
      jam,
      kegiatan,
      PIC,
      kategori,
      pengingat_menit,
    } = req.body;

    if (
      !tanggal ||
      !jam ||
      !kegiatan ||
      !PIC ||
      !kategori
    ) {
      return res.status(400).json({
        message: "Data agenda wajib diisi",
      });
    }

    const pengingatMenit =
      pengingat_menit ?? 1440;

    const tanggalAgenda =
      Temporal.Instant.from(
        `${tanggal}T00:00:00Z`
      );

    const jamMulai =
      String(jam).split("-")[0];

    const waktuMulai =
      new Date(
        `${tanggal}T${jamMulai}:00Z`
      );

    const waktuPengingat =
      new Date(
        waktuMulai.getTime() -
          pengingatMenit * 60 * 1000
      );

    const agenda =
      await db.orm.public.Agenda.create({
        tanggal: tanggalAgenda,
        jam,
        kegiatan,
        PIC,
        kategori,
        pengingat_menit:
          pengingatMenit,

        waktu_pengingat:
          Temporal.Instant.from(
            waktuPengingat.toISOString()
          ),

        // STATUS AWAL
        status_pengingat: "MENUNGGU",

        // Belum pernah ditunda
        waktu_pengingat_berikutnya: null,
      });

    res.status(201).json(agenda);
  } catch (error) {
    console.error(
      "Error menambahkan agenda:",
      error
    );

    res.status(500).json({
      message: "Gagal menambahkan agenda",
    });
  }
});

router.put("/:id/tunda", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const waktuBerikutnya = new Date(
      Date.now() + 60 * 1000
    );

    const agenda =
      await db.orm.public.Agenda
        .where({
          id_agenda: id,
        })
        .update({
          status_pengingat: "DITUNDA",

          waktu_pengingat_berikutnya:
            Temporal.Instant.from(
              waktuBerikutnya.toISOString()
            ),
        });

    res.json({
      message:
        "Pengingat agenda berhasil ditunda",
      data: agenda,
    });
  } catch (error) {
    console.error(
      "Error menunda pengingat:",
      error
    );

    res.status(500).json({
      message:
        "Gagal menunda pengingat agenda",
    });
  }
});

router.put(
  "/:id/konfirmasi",
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const agenda =
        await db.orm.public.Agenda
          .where({
            id_agenda: id,
          })
          .update({
            status_pengingat:
              "DIKONFIRMASI",

            waktu_pengingat_berikutnya:
              null,
          });

      res.json({
        message:
          "Agenda berhasil dikonfirmasi",
        data: agenda,
      });
    } catch (error) {
      console.error(
        "Error mengonfirmasi agenda:",
        error
      );

      res.status(500).json({
        message:
          "Gagal mengonfirmasi agenda",
      });
    }
  }
);

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      tanggal,
      jam,
      kegiatan,
      PIC,
      kategori,
      pengingat_menit,
    } = req.body;

    if (
      !tanggal ||
      !jam ||
      !kegiatan ||
      !PIC ||
      !kategori
    ) {
      return res.status(400).json({
        message: "Data agenda wajib diisi",
      });
    }

    const pengingatMenit =
      pengingat_menit ?? 1440;

    const jamMulai =
      String(jam).split("-")[0];

    const waktuMulai =
      new Date(
        `${tanggal}T${jamMulai}:00Z`
      );

    const waktuPengingat =
      new Date(
        waktuMulai.getTime() -
          pengingatMenit * 60 * 1000
      );

    const agenda =
      await db.orm.public.Agenda
        .where({
          id_agenda: id,
        })
        .update({
          tanggal:
            Temporal.Instant.from(
              `${tanggal}T00:00:00Z`
            ),

          jam,
          kegiatan,
          PIC,
          kategori,

          pengingat_menit:
            pengingatMenit,

          waktu_pengingat:
            Temporal.Instant.from(
              waktuPengingat.toISOString()
            ),

          // Jika agenda diubah,
          // pengingat kembali menunggu
          status_pengingat:
            "MENUNGGU",

          waktu_pengingat_berikutnya:
            null,
        });

    res.json(agenda);
  } catch (error) {
    console.error(
      "Error mengubah agenda:",
      error
    );

    res.status(500).json({
      message: "Gagal mengubah agenda",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const agenda =
      await db.orm.public.Agenda
        .where({
          id_agenda: id,
        })
        .delete();

    res.json({
      message: "Agenda berhasil dihapus",
      data: agenda,
    });
  } catch (error) {
    console.error(
      "Error menghapus agenda:",
      error
    );

    res.status(500).json({
      message: "Gagal menghapus agenda",
    });
  }
});

export default router;