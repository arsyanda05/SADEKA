import express from "express";
import { spawn } from "child_process";
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
      "python",
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

    /*
     * Kirim JSON ke Python melalui stdin.
     */
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