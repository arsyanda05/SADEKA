import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSadeka from "../assets/logo_sadeka.png";

function LupaPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Silakan masukkan email terlebih dahulu.");
      return;
    }

    alert("Permintaan reset password berhasil dikirim.");
  };

  return (
    <div className="lupa-password-page">
      <div className="lupa-password-container">

        {/* BAGIAN KIRI */}
        <div className="lupa-password-brand">
          <img
            src={logoSadeka}
            alt="Logo SADEKA"
            className="lupa-password-logo"
          />

          <h1>SADEKA</h1>

          <h2>
            Satu Data Kelurahan
            <br />
            Manukan Kulon
          </h2>
        </div>

        {/* BAGIAN KANAN */}
        <div className="lupa-password-card">
          <h1>Lupa Password</h1>

          <p className="lupa-password-description">
            Masukkan email Anda yang terdaftar
            <br />
            pada sistem SADEKA
          </p>

          <form onSubmit={handleSubmit}>
            <div className="lupa-password-form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="lupa-password-submit"
            >
              Kirim Permintaan
            </button>
          </form>

          <button
            type="button"
            className="lupa-password-back"
            onClick={() => navigate("/login")}
          >
            ← Kembali ke Login
          </button>

          <p className="lupa-password-note">
            Tautan reset akan kadaluarsa dalam 15 menit
          </p>
        </div>

      </div>
    </div>
  );
}

export default LupaPassword;