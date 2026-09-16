import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoSadeka from "../assets/logo_sadeka.png";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State untuk dropdown
  const [administrasiOpen, setAdministrasiOpen] = useState(false);
  const [dataKelurahanOpen, setDataKelurahanOpen] = useState(false);
  const [ahliWarisOpen, setAhliWarisOpen] = useState(false);

  const navigate = useNavigate();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="dashboard-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >

        {/* ================= LOGO ================= */}
        <div className="sidebar-logo">
          <img
            src={logoSadeka}
            alt="Logo SADEKA"
          />

          <div>
            <h2>SADEKA</h2>
            <p>Satu Data Kelurahan</p>
            <p>Manukan Kulon</p>
          </div>
        </div>


        {/* =====================================================
            MENU SIDEBAR
        ===================================================== */}
        <nav className="sidebar-menu">

          {/* ================= DASHBOARD ================= */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Dashboard
          </NavLink>


          {/* ================= AGENDA ================= */}
          <NavLink
            to="/agenda"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Agenda
          </NavLink>


          {/* =================================================
              ADMINISTRASI & ARSIP
              DROPDOWN
          ================================================= */}
          <button
            type="button"
            className="menu-title menu-title-toggle"
            onClick={() =>
              setAdministrasiOpen((prev) => !prev)
            }
            aria-expanded={administrasiOpen}
          >
            <span>Administrasi &amp; Arsip</span>

            <span className="chevron">
              {administrasiOpen ? "^" : "⌄"}
            </span>
          </button>

          {administrasiOpen && (
            <div className="menu-group">

              {/* Surat Masuk */}
              <NavLink
                to="/surat-masuk"
                className={({ isActive }) =>
                  `submenu-item ${isActive ? "active" : ""}`
                }
                onClick={closeSidebar}
              >
                Surat Masuk
              </NavLink>

              {/* Surat Keluar */}
              <NavLink
                to="/surat-keluar"
                className={({ isActive }) =>
                  `submenu-item ${isActive ? "active" : ""}`
                }
                onClick={closeSidebar}
              >
                Surat Keluar
              </NavLink>

            </div>
          )}


          {/* =================================================
              DATA KELURAHAN
              DROPDOWN
          ================================================= */}
          <button
            type="button"
            className="menu-title menu-title-toggle"
            onClick={() =>
              setDataKelurahanOpen((prev) => !prev)
            }
            aria-expanded={dataKelurahanOpen}
          >
            <span>Data Kelurahan</span>

            <span className="chevron">
              {dataKelurahanOpen ? "^" : "⌄"}
            </span>
          </button>

          {dataKelurahanOpen && (
            <div className="menu-group">

              {/* Data Penduduk */}
              <NavLink
                to="/data-penduduk"
                className={({ isActive }) =>
                  `submenu-item ${isActive ? "active" : ""}`
                }
                onClick={closeSidebar}
              >
                Data Penduduk
              </NavLink>

              {/* Data Pegawai */}
              <NavLink
                to="/data-pegawai"
                className={({ isActive }) =>
                  `submenu-item ${isActive ? "active" : ""}`
                }
                onClick={closeSidebar}
              >
                Data Pegawai
              </NavLink>

            </div>
          )}


          {/* =================================================
              MENU BIASA
              KESEJAHTERAAN
          ================================================= */}
          <NavLink
            to="/kesejahteraan"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Kesejahteraan
          </NavLink>


          {/* =================================================
              MENU BIASA
              UMKM
          ================================================= */}
          <NavLink
            to="/umkm"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            UMKM
          </NavLink>


          {/* =================================================
              MENU BIASA
              INFRASTRUKTUR
          ================================================= */}
          <NavLink
            to="/infrastruktur"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Infrastruktur
          </NavLink>


          {/* =================================================
              SURAT AHLI WARIS
              DROPDOWN
          ================================================= */}
          <button
            type="button"
            className="menu-title menu-title-toggle"
            onClick={() =>
              setAhliWarisOpen((prev) => !prev)
            }
            aria-expanded={ahliWarisOpen}
          >
            <span>Surat Ahli Waris</span>

            <span className="chevron">
              {ahliWarisOpen ? "^" : "⌄"}
            </span>
          </button>

          {ahliWarisOpen && (
            <div className="menu-group">

              {/* Tracking Surat */}
              <NavLink
                to="/tracking-surat"
                className={({ isActive }) =>
                  `submenu-item ${isActive ? "active" : ""}`
                }
                onClick={closeSidebar}
              >
                Tracking Surat
              </NavLink>

            </div>
          )}


          {/* =================================================
              MENU BIASA
              SMART DOCUMENT
          ================================================= */}
          <NavLink
            to="/smart-document"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Smart Document
          </NavLink>


          {/* =================================================
              MENU BIASA
              ASISTEN DATA
          ================================================= */}
          <NavLink
            to="/asisten-data"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Asisten Data
          </NavLink>

        </nav>


        {/* =====================================================
            BOTTOM MENU
        ===================================================== */}
        <div className="sidebar-bottom">

          {/* Pengaturan */}
          <NavLink
            to="/pengaturan"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Pengaturan
          </NavLink>


          {/* Logout */}
          <button
            type="button"
            className="menu-item"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          OVERLAY
      ===================================================== */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="dashboard-main">

        {/* ================= HEADER ================= */}
        <header className="dashboard-header">

          <div className="header-left">

            <button
              type="button"
              className="hamburger"
              onClick={() =>
                setSidebarOpen((prev) => !prev)
              }
              aria-label="Buka menu"
              aria-expanded={sidebarOpen}
            >
              ☰
            </button>

            <h1>Dashboard</h1>

          </div>


          {/* ================= USER ================= */}
          <div className="user-info">

            <div className="user-text">
              <strong>Nadia S</strong>
              <span>Sekretaris</span>
            </div>

            <div className="user-avatar">
              N
            </div>

          </div>

        </header>


        {/* =====================================================
            CONTENT
        ===================================================== */}
        <section className="dashboard-content">

          {/* ================= STATISTIK ================= */}
          <div className="stats-grid">

            <StatCard
              icon="♙"
              title="Penduduk"
              value="35.349"
              label="Total Penduduk"
            />

            <StatCard
              icon="▢"
              title="UMKM"
              value="425"
              label="Total UMKM"
            />

            <StatCard
              icon="♡"
              title="Kesejahteraan"
              value="200"
              label="Total Kesejahteraan"
            />

            <StatCard
              icon="♙"
              title="Pegawai"
              value="1.250"
              label="Total Pegawai"
            />

            <StatCard
              icon="⚓"
              title="Infrastruktur"
              value="140"
              label="Total Infrastruktur"
            />

            <StatCard
              icon="▧"
              title="Surat Masuk"
              value="140"
              label="Total Surat"
            />

            <StatCard
              icon="▤"
              title="Surat Keluar"
              value="100"
              label="Total Surat"
            />

            <StatCard
              icon="▤"
              title="Surat Ahli Waris"
              value="25"
              label="Total Surat"
            />

          </div>


          {/* ================= LOWER CONTENT ================= */}
          <div className="dashboard-columns">

            {/* ================= KIRI ================= */}
            <div className="left-column">

              {/* Pengajuan Surat */}
              <div className="dashboard-card">

                <div className="card-header">

                  <h2>
                    Pengajuan Surat Ahli Waris Terbaru
                  </h2>

                  <button
                    type="button"
                    className="card-link"
                  >
                    Lihat Semua
                  </button>

                </div>


                <div className="table-wrapper">

                  <table>

                    <thead>
                      <tr>
                        <th>NO PENGAJUAN</th>
                        <th>NAMA PEMOHON</th>
                        <th>TANGGAL</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>

                    <tbody>

                      <tr>
                        <td>003</td>
                        <td>Aminah</td>
                        <td>30 Agt 2026</td>
                        <td className="status-process">
                          Proses
                        </td>
                      </tr>

                      <tr>
                        <td>002</td>
                        <td>Budi Susanto</td>
                        <td>20 Agt 2026</td>
                        <td className="status-success">
                          Diterima
                        </td>
                      </tr>

                      <tr>
                        <td>001</td>
                        <td>Ahmad</td>
                        <td>9 Agt 2026</td>
                        <td className="status-danger">
                          Ditolak
                        </td>
                      </tr>

                    </tbody>

                  </table>

                </div>

              </div>


              {/* ================= AGENDA ================= */}
              <div className="dashboard-card agenda-card">

                <div className="card-header">

                  <h2>Agenda Terdekat</h2>

                  <button
                    type="button"
                    className="add-button"
                    aria-label="Tambah agenda"
                  >
                    +
                  </button>

                </div>


                <AgendaItem
                  day="09"
                  title="Rapat RT/RW"
                  category="Kelurahan"
                  person="Nadia S"
                />

                <AgendaItem
                  day="11"
                  title="Pertemuan Kader PKK"
                  category="PKK"
                  person="Ahmad"
                />

              </div>

            </div>


            {/* ================= KANAN ================= */}
            <div className="dashboard-card document-card">

              <div className="card-header">

                <h2>Dokumen Terbaru</h2>

                <button
                  type="button"
                  className="card-link"
                >
                  Lihat Semua
                </button>

              </div>


              <DocumentItem
                title="Surat Masuk Pemkot"
                time="Diunggah 6 hari yang lalu"
              />

              <DocumentItem
                title="Data UMKM"
                time="Diunggah 7 hari yang lalu"
              />

              <DocumentItem
                title="Surat Ahli Waris"
                time="Diunggah sebelum yang lalu"
              />

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  title,
  value,
  label,
}) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">

        <h3>{title}</h3>

        <strong>{value}</strong>

        <span>{label}</span>

      </div>

    </div>
  );
}


/* =====================================================
   AGENDA ITEM
===================================================== */

function AgendaItem({
  day,
  title,
  category,
  person,
}) {
  return (
    <div className="agenda-item">

      <div className="agenda-date">
        <span>SEP</span>
        <strong>{day}</strong>
      </div>

      <div className="agenda-info">

        <h3>{title}</h3>

        <p>◷ 07.00–09.00</p>

      </div>

      <div className="agenda-category">

        <strong>{category}</strong>

        <span>
          PIC : {person}
        </span>

      </div>

    </div>
  );
}


/* =====================================================
   DOCUMENT ITEM
===================================================== */

function DocumentItem({
  title,
  time,
}) {
  return (
    <div className="document-item">

      <div className="document-icon">
        ▤
      </div>

      <div className="document-info">

        <strong>{title}</strong>

        <span>{time}</span>

      </div>

      <button
        type="button"
       className="download-button"
       aria-label={`Download ${title}`}
      >
    <span>Download</span>
    </button>

    </div>
  );
}


export default Dashboard;