import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoSadeka from "../assets/logo_sadeka.png";
import dokumenIcon from "../assets/dokumen.png";
import infraIcon from "../assets/infra.png";
import kesIcon from "../assets/kes.png";
import pegawaiIcon from "../assets/pegawai.png";
import pendudukIcon from "../assets/penduduk.png";
import suratIcon from "../assets/surat.png";
import suratMasukIcon from "../assets/suratmasuk.png";
import umkmIcon from "../assets/umkm.png";
import SideBar from "./sidebarmenu";
import Header from "./header";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      <SideBar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div style={{ display: "none" }}>
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >

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

        <nav className="sidebar-menu">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/agenda"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Agenda
          </NavLink>

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

          <NavLink
            to="/kesejahteraan"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Kesejahteraan
          </NavLink>

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

          <button
            type="button"
            className="menu-title menu-title-toggle"
            onClick={() => {
              setAhliWarisOpen((prev) => !prev);
              navigate("/surat-ahli-waris");
            }}
            aria-expanded={ahliWarisOpen}
          >
            <span>Surat Ahli Waris</span>

            <span className="chevron">
              {ahliWarisOpen ? "^" : "⌄"}
            </span>
          </button>

          {ahliWarisOpen && (
            <div className="menu-group">

              <NavLink
                to="/surat-ahli-waris"
                className={({ isActive }) =>
                  `submenu-item ${isActive ? "active" : ""}`
                }
                onClick={closeSidebar}
              >
                Surat Ahli Waris
              </NavLink>

            </div>
          )}

          <NavLink
            to="/smart-document"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Smart Document
          </NavLink>

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

        <div className="sidebar-bottom">

          <NavLink
            to="/pengaturan"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Pengaturan
          </NavLink>

          <button
            type="button"
            className="menu-item"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>


      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      </div>


      <main className="dashboard-main">

        <Header
          title="Dashboard"
          showSearch={false}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />


        <section className="dashboard-content">

          <div className="stats-grid">

            <StatCard
              icon={pendudukIcon}
              title="Penduduk"
              value="35.349"
              label="Total Penduduk"
            />

            <StatCard
              icon={umkmIcon}
              title="UMKM"
              value="425"
              label="Total UMKM"
            />

            <StatCard
              icon={kesIcon}
              title="Kesejahteraan"
              value="200"
              label="Total Kesejahteraan"
            />

            <StatCard
              icon={pegawaiIcon}
              title="Pegawai"
              value="1.250"
              label="Total Pegawai"
            />

            <StatCard
              icon={infraIcon}
              title="Infrastruktur"
              value="140"
              label="Total Infrastruktur"
            />

            <StatCard
              icon={suratMasukIcon}
              title="Surat Masuk"
              value="140"
              label="Total Surat"
            />

            <StatCard
              icon={suratIcon}
              title="Surat Keluar"
              value="100"
              label="Total Surat"
            />

            <StatCard
              icon={dokumenIcon}
              title="Surat Ahli Waris"
              value="25"
              label="Total Surat"
            />

          </div>

          <div className="dashboard-columns">

            <div className="left-column">

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


function StatCard({
  icon,
  title,
  value,
  label,
}) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        <img src={icon} alt="" />
      </div>

      <div className="stat-content">

        <h3>{title}</h3>

        <strong>{value}</strong>

        <span>{label}</span>

      </div>

    </div>
  );
}



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



function DocumentItem({
  title,
  time,
}) {
  return (
    <div className="document-item">

      <div className="document-icon">
        <img src={dokumenIcon} alt="" />
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