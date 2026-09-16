import { useNavigate } from "react-router-dom";
import logoSadeka from "../assets/logo_sadeka.png";

function Login() {
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

      <div className="login-card">
        <h2>Login</h2>

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
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <div className="forgot-password">
            <a href="#">Lupa Password?</a>
          </div>

          <button type="submit" className="btn-login">
            Login
          </button>

          <div className="register">
            <p>Belum punya akun?</p>

            <a href="#">Daftar di sini</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;