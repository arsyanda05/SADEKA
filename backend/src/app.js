import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import pendudukRouter from "./routes/penduduk.js";
import pegawaiRouter from "./routes/pegawai.js";
import dokumenPegawaiRouter from "./routes/dokumenPegawai.js";
import diklatRouter from "./routes/diklat.js";
import suratRouter from "./routes/surat.js";
import agendaRouter from "./routes/agenda.js";
import kesejahteraanRouter from "./routes/kesejahteraan.js";
import umkmRouter from "./routes/umkm.js";
import infrastrukturRouter from "./routes/infrastruktur.js";
import suratAhliWarisRouter from "./routes/suratahliwaris.js";
import trackingSuratRouter from "./routes/trackingsurat.js";
import dokumenRouter from "./routes/dokumen.js";
import asistendataRouter from "./routes/asistendata.js";
import authRouter from "./routes/auth.js";
import smartDocumentRouter from "./routes/smartDocument.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadsPath = path.join(
  __dirname,
  "uploads"
);

app.use(cors());

app.use(express.json({ limit: "1mb" }));

app.use(
  "/uploads",
  express.static(uploadsPath)
);

app.get("/", (req, res) => {
  res.json({
    message: "API SADEKA berhasil berjalan",
  });
});

app.use(
  "/api/penduduk",
  pendudukRouter
);

app.use(
  "/api/pegawai",
  pegawaiRouter
);

app.use(
  "/api/dokumen-pegawai",
  dokumenPegawaiRouter
);

app.use(
  "/api/diklat",
  diklatRouter
);

app.use(
  "/api/surat",
  suratRouter
);

app.use(
  "/api/agenda",
  agendaRouter
);

app.use(
  "/api/kesejahteraan",
  kesejahteraanRouter
);

app.use(
  "/api/umkm",
  umkmRouter
);

app.use(
  "/api/infrastruktur",
  infrastrukturRouter
);

app.use(
  "/api/surat-ahli-waris",
  suratAhliWarisRouter
);

app.use(
  "/api/tracking-surat",
  trackingSuratRouter
);

app.use("/api/dokumen", dokumenRouter);

app.use(
  "/api/asisten-data",
  asistendataRouter
);

app.use(
  "/api/auth",
  authRouter
);

app.use(
  "/api/smart-document",
  smartDocumentRouter
);


app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint API tidak ditemukan",
    path: req.originalUrl,
    method: req.method,
  });
});

app.use(
  (err, req, res, next) => {
    console.error(
      "Error server:",
      err
    );

    res.status(500).json({
      message:
        "Terjadi kesalahan pada server",
    });
  }
);

export default app;