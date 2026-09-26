import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSadeka from "../assets/logo_sadeka.png";
import { resetPassword } from "../services/api";

function LupaPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Silakan masukkan email terlebih dahulu.");
      return;
    }

    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !konfirmasiPassword) {
      alert("Silakan isi password baru dan konfirmasi password.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    if (newPassword !== konfirmasiPassword) {
      alert("Password dan konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email,
        newPassword,
      });

      alert("Password berhasil diubah. Silakan login.");

      navigate("/login");
    } catch (error) {
      console.error("Error reset password:", error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
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

          {step === 1 && (
            <>
              <h1>Lupa Password</h1>

              <p className="lupa-password-description">
                Masukkan email Anda yang terdaftar
                <br />
                pada sistem SADEKA
              </p>

              <form onSubmit={handleEmailSubmit}>
                <div className="lupa-password-form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="lupa-password-submit"
                >
                  Lanjutkan
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h1>Reset Password</h1>

              <p className="lupa-password-description">
                Masukkan password baru untuk akun
                <br />
                dengan email <strong>{email}</strong>
              </p>

              <form onSubmit={handleResetPassword}>
                <div className="lupa-password-form-group">
                  <input
                    type="password"
                    placeholder="Password Baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="lupa-password-form-group">
                  <input
                    type="password"
                    placeholder="Konfirmasi Password Baru"
                    value={konfirmasiPassword}
                    onChange={(e) =>
                      setKonfirmasiPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="lupa-password-submit"
                  disabled={loading}
                >
                  {loading ? "Mengubah Password..." : "Ubah Password"}
                </button>
              </form>
            </>
          )}

          <button
            type="button"
            className="lupa-password-back"
            onClick={() => navigate("/login")}
          >
            ← Kembali ke Login
          </button>

          <p className="lupa-password-note">
            Password minimal 6 karakter
          </p>

        </div>

      </div>
    </div>
  );
}

export default LupaPassword;
