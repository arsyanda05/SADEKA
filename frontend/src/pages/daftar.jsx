import { useNavigate } from "react-router-dom";
import logoSadeka from "../assets/logo_sadeka.png";
import { Link } from "react-router-dom";

function Daftar() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/dashboard");
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
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Konfirmasi Password"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Nomor Telepon"
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Daftar
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