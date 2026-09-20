import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoSadeka from "../assets/logo_sadeka.png";

function SideBar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [administrasiOpen, setAdministrasiOpen] = useState(false);
  const [dataKelurahanOpen, setDataKelurahanOpen] = useState(false);

  const closeSidebar = () => onClose?.();

  const handleLogout = () => {
    closeSidebar();
    navigate("/");
  };

  const menuClass = ({ isActive }) =>
    `menu-item ${isActive ? "active" : ""}`;
  const submenuClass = ({ isActive }) =>
    `submenu-item ${isActive ? "active" : ""}`;

  return (
    <>
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <img src={logoSadeka} alt="Logo SADEKA" />
          <div>
            <h2>SADEKA</h2>
            <p>Satu Data Kelurahan</p>
            <p>Manukan Kulon</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/dashboard" className={menuClass} onClick={closeSidebar}>
            Dashboard
          </NavLink>
          <NavLink to="/agenda" className={menuClass} onClick={closeSidebar}>
            Agenda
          </NavLink>

          <button
            type="button"
            className="menu-title menu-title-toggle"
            onClick={() => setAdministrasiOpen((prev) => !prev)}
            aria-expanded={administrasiOpen}
          >
            <span>Administrasi &amp; Arsip</span>
            <span className="chevron">{administrasiOpen ? "^" : "⌄"}</span>
          </button>
          {administrasiOpen && (
            <div className="menu-group">
              <NavLink to="/surat-masuk" className={submenuClass} onClick={closeSidebar}>
                Surat Masuk
              </NavLink>
              <NavLink to="/surat-keluar" className={submenuClass} onClick={closeSidebar}>
                Surat Keluar
              </NavLink>
            </div>
          )}

          <button
            type="button"
            className="menu-title menu-title-toggle"
            onClick={() => setDataKelurahanOpen((prev) => !prev)}
            aria-expanded={dataKelurahanOpen}
          >
            <span>Data Kelurahan</span>
            <span className="chevron">{dataKelurahanOpen ? "^" : "⌄"}</span>
          </button>
          {dataKelurahanOpen && (
            <div className="menu-group">
              <NavLink to="/data-penduduk" className={submenuClass} onClick={closeSidebar}>
                Data Penduduk
              </NavLink>
              <NavLink to="/data-pegawai" className={submenuClass} onClick={closeSidebar}>
                Data Pegawai
              </NavLink>
            </div>
          )}

          <NavLink to="/kesejahteraan" className={menuClass} onClick={closeSidebar}>
            Kesejahteraan
          </NavLink>
          <NavLink to="/umkm" className={menuClass} onClick={closeSidebar}>
            UMKM
          </NavLink>
          <NavLink to="/infrastruktur" className={menuClass} onClick={closeSidebar}>
            Infrastruktur
          </NavLink>

          <NavLink to="/surat-ahli-waris" className={menuClass} onClick={closeSidebar}>
            Surat Ahli Waris
          </NavLink>

          <NavLink to="/smart-document" className={menuClass} onClick={closeSidebar}>
            Smart Document
          </NavLink>
          <NavLink to="/asisten-data" className={menuClass} onClick={closeSidebar}>
            Asisten Data
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <NavLink to="/pengaturan" className={menuClass} onClick={closeSidebar}>
            Pengaturan
          </NavLink>
          <button type="button" className="menu-item" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />
      )}
    </>
  );
}

export default SideBar;
