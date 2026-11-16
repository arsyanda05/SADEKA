import express from "express";
import { spawn, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(
  __dirname,
  "../../../"
);

const ASSISTEN_DATA_SCRIPT = path.join(
  PROJECT_ROOT,
  "asistendata",
  "src",
  "assistant.py"
);

let selectedPythonExecutable;

const pythonExecutable = () => {
  if (selectedPythonExecutable) {
    return selectedPythonExecutable;
  }

  const projectPython = path.join(
    PROJECT_ROOT,
    ".venv",
    process.platform === "win32" ? "Scripts" : "bin",
    process.platform === "win32" ? "python.exe" : "python"
  );
  const candidates = [
    process.env.ASISTENDATA_PYTHON,
    projectPython,
    "python",
  ].filter((candidate, index, all) =>
    candidate && all.indexOf(candidate) === index
  );
  const failures = [];

  for (const candidate of candidates) {
    if (candidate !== "python" && !fs.existsSync(candidate)) {
      failures.push(`${candidate}: file tidak ditemukan`);
      continue;
    }

    const check = spawnSync(
      candidate,
      [
        "-c",
        "import importlib.util, sys; modules = ('joblib', 'psycopg2', 'sklearn', 'Sastrawi.Stemmer.StemmerFactory'); missing = [module for module in modules if importlib.util.find_spec(module) is None]; print('Modul Python tidak ditemukan: ' + ', '.join(missing), file=sys.stderr) if missing else None; sys.exit(bool(missing))",
      ],
      {
        encoding: "utf8",
        windowsHide: true,
        timeout: 10_000,
      }
    );

    if (!check.error && check.status === 0) {
      selectedPythonExecutable = candidate;
      console.info(`Asisten Data menggunakan Python: ${candidate}`);
      return selectedPythonExecutable;
    }

    failures.push(
      `${candidate}: ${
        check.error
          ? check.error.message
          : (check.stderr || `pemeriksaan dependensi keluar dengan kode ${check.status}`).trim()
      }`
    );
  }

  throw new Error(
    "Dependensi Asisten Data tidak ditemukan. " +
    "Jalankan `python -m pip install -r asistendata/requirements.txt` " +
    "menggunakan Python yang akan menjalankan backend, atau atur ASISTENDATA_PYTHON. " +
    `Kandidat yang diperiksa: ${failures.join("; ")}`
  );
};

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (
      typeof question !== "string" ||
      question.trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Pertanyaan tidak boleh kosong.",
      });
    }

    const cleanQuestion =
      question.trim();

    const pythonProcess = spawn(
      pythonExecutable(),
      [
        ASSISTEN_DATA_SCRIPT,
        "--api",
      ],
      {
        cwd: PROJECT_ROOT,
      }
    );

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on(
      "data",
      (data) => {
        stdout += data.toString();
      }
    );

    pythonProcess.stderr.on(
      "data",
      (data) => {
        stderr += data.toString();
      }
    );

    pythonProcess.on(
      "error",
      (error) => {
        console.error(
          "Gagal menjalankan Python:",
          error
        );

        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message:
              "Gagal menjalankan Asisten Data Python.",
            error: error.message,
          });
        }
      }
    );




    const input = JSON.stringify({
      question: cleanQuestion,
    });

    pythonProcess.stdin.write(
      input
    );

    pythonProcess.stdin.end();

    pythonProcess.on(
      "close",
      (code) => {
        if (code !== 0) {
          console.error(
            "Python process error:",
            stderr
          );

          return res.status(500).json({
            success: false,
            message:
              "Asisten Data gagal memproses pertanyaan.",
            error:
              stderr ||
              `Python process berhenti dengan kode ${code}.`,
          });
        }

        try {
          const result =
            JSON.parse(
              stdout.trim()
            );

          return res.status(
            result.success
              ? 200
              : 500
          ).json(result);

        } catch (error) {
          console.error(
            "Output Python bukan JSON:",
            stdout
          );

          return res.status(500).json({
            success: false,
            message:
              "Output dari Asisten Data tidak valid.",
            error:
              error.message,
            raw_output: stdout,
          });
        }
      }
    );
  } catch (error) {
    console.error(
      "Error endpoint Asisten Data:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Terjadi kesalahan pada Asisten Data.",
      error: error.message,
    });
  }
});

export default router;