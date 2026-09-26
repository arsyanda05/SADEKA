import express from "express";
import crypto from "crypto";
import { db } from "../prisma/db.ts";

const router = express.Router();

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedPassword) => {
  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(storedHash, "hex")
  );
};

// =========================
// REGISTER
// =========================
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      no_telepon
    } = req.body;

    if (!username || !email || !password || !no_telepon) {
      return res.status(400).json({
        message: "Semua data wajib diisi"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter"
      });
    }

    // Cek username
    const existingUsername = await db.orm.public.User
      .where({ username })
      .all();

    if (existingUsername.length > 0) {
      return res.status(409).json({
        message: "Username sudah digunakan"
      });
    }

    // Cek email
    const existingEmail = await db.orm.public.User
      .where({ email })
      .all();

    if (existingEmail.length > 0) {
      return res.status(409).json({
        message: "Email sudah terdaftar"
      });
    }

    const hashedPassword = hashPassword(password);

    const user = await db.orm.public.User.create({
      username,
      email,
      password: hashedPassword,
      nama: username,
      no_telepon
    });

    res.status(201).json({
      message: "Pendaftaran berhasil",
      user: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        nama: user.nama,
        no_telepon: user.no_telepon
      }
    });

  } catch (error) {
    console.error("Error register:", error);

    res.status(500).json({
      message: "Gagal melakukan pendaftaran"
    });
  }
});

// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi"
      });
    }

    const users = await db.orm.public.User
      .where({ username })
      .all();

    if (users.length === 0) {
      return res.status(401).json({
        message: "Username atau password salah"
      });
    }

    const user = users[0];

    const passwordValid = verifyPassword(
      password,
      user.password
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "Username atau password salah"
      });
    }

    res.json({
      message: "Login berhasil",
      user: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        nama: user.nama,
        no_telepon: user.no_telepon
      }
    });

  } catch (error) {
    console.error("Error login:", error);

    res.status(500).json({
      message: "Gagal melakukan login"
    });
  }
});

// =========================
// LUPA PASSWORD
// =========================
router.post("/forgot-password", async (req, res) => {
  try {
    const {
      email,
      newPassword
    } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email dan password baru wajib diisi"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter"
      });
    }

    const users = await db.orm.public.User
      .where({ email })
      .all();

    if (users.length === 0) {
      return res.status(404).json({
        message: "Email tidak ditemukan"
      });
    }

    const hashedPassword = hashPassword(newPassword);

    await db.orm.public.User
      .where({
        id_user: users[0].id_user
      })
      .update({
        password: hashedPassword
      });

    res.json({
      message: "Password berhasil diubah"
    });

  } catch (error) {
    console.error("Error reset password:", error);

    res.status(500).json({
      message: "Gagal mengubah password"
    });
  }
});

export default router;