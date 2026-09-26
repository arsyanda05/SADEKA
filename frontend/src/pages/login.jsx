import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoSadeka from "../assets/logo_sadeka.png";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const result = await loginUser({
        username,
        password,
      });

      const user = result.user;
      const profileKey = `sadeka_profile_${user.username || user.id_user}`;
      const savedProfile = localStorage.getItem(profileKey);

      // Simpan data user yang berhasil login
      localStorage.setItem(
        "sadeka_user",
        JSON.stringify(
          savedProfile
            ? { ...user, ...JSON.parse(savedProfile) }
            : user
        )
      );

      alert("Login berhasil!");

      navigate("/dashboard");
    } catch (error) {
      console.error("Error login:", error);

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

      <div className="login-card">

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <div className="forgot-password">
            <Link to="/lupa-password">
              Lupa Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>

          <div className="register">
            <p>Belum punya akun?</p>

            <Link to="/daftar">
              Daftar di sini
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}

export default Login;