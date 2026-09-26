import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoSadeka from "../assets/logo_sadeka.png";
import { registerUser } from "../services/api";

function Daftar() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Cek password
    if (password !== konfirmasiPassword) {
      alert("Password dan konfirmasi password tidak sama.");
      return;
    }

    // Cek panjang password
    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        username,
        email,
        password,
        no_telepon: noTelepon,
      });

      alert("Pendaftaran berhasil! Silakan login.");

      navigate("/login");
    } catch (error) {
      console.error("Error pendaftaran:", error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <img
          src={logoSadeka}
          alt="Logo SADEKA"
          className="login-logo"
        />

        <h1>SADEKA</h1>

        <p>
          Satu Data Kelurahan
          <br />
          Manukan Kulon
        </p>
      </div>

      <div className="login-card daftar-card">
        <h2>Daftar</h2>

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div className="form-group">
            <input
              type="password"
              placeholder="Konfirmasi Password"
              value={konfirmasiPassword}
              onChange={(event) =>
                setKonfirmasiPassword(event.target.value)
              }
              required
            />
          </div>

          {/* NOMOR TELEPON */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Nomor Telepon"
              value={noTelepon}
              onChange={(event) => setNoTelepon(event.target.value)}
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>

          <div className="register">
            <p>Sudah punya akun?</p>

            <Link to="/login">Login di sini</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Daftar;