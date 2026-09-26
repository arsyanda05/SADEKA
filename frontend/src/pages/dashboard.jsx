import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getInfrastruktur,
  getKesejahteraan,
  getPegawai,
  getPenduduk,
  getSurat,
  getSuratAhliWaris,
  getUMKM,
} from "../services/api";
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

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return null;
};

const formatCount = (items, loading) => {
  if (loading) {
    return "...";
  }

  return items
    ? new Intl.NumberFormat("id-ID").format(items.length)
    : "—";
};

const countByField = (items, field) => {
  if (!items) {
    return [];
  }

  const counts = items.reduce((result, item) => {
    const label = String(item[field] || "Lainnya").trim();
    result[label] = (result[label] || 0) + 1;
    return result;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((first, second) => second.count - first.count);
};

const normalizeRW = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits ? digits.padStart(2, "0") : "";
};

const rwOptions = Array.from(
  { length: 15 },
  (_, index) => String(index + 1).padStart(2, "0")
);

const welfareCategories = [
  "Stunting",
  "Ibu Hamil",
  "Rutilahu",
  "Putus Sekolah",
];

const buildUMKMRegionData = (items = []) =>
  rwOptions.map((rw) => ({
    rw: `RW ${rw}`,
    value: items.filter((item) => normalizeRW(item.rw) === rw).length,
  }));

const buildWelfareRegionData = (items = []) =>
  rwOptions.map((rw) => {
    const residentsInRW = items.filter(
      (item) => normalizeRW(item.rw) === rw
    );

    return {
      rw: `RW ${rw}`,
      ...Object.fromEntries(
        welfareCategories.map((category) => [
          category,
          residentsInRW.filter((item) => item.kategori === category).length,
        ])
      ),
    };
  });

const formatDashboardDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [administrasiOpen, setAdministrasiOpen] = useState(false);
  const [dataKelurahanOpen, setDataKelurahanOpen] = useState(false);
  const [ahliWarisOpen, setAhliWarisOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const loadDashboardData = async () => {
      const results = await Promise.allSettled([
        getPenduduk(),
        getUMKM(),
        getKesejahteraan(),
        getPegawai(),
        getInfrastruktur(),
        getSurat(),
        getSuratAhliWaris(),
      ]);

      if (!isActive) {
        return;
      }

      const fields = [
        "penduduk",
        "umkm",
        "kesejahteraan",
        "pegawai",
        "infrastruktur",
        "surat",
        "suratAhliWaris",
      ];
      const loadedData = {};

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          loadedData[fields[index]] = toArray(result.value);
        } else {
          loadedData[fields[index]] = null;
          console.error(
            `Gagal mengambil data ${fields[index]} untuk dashboard:`,
            result.reason
          );
        }
      });

      setDashboardData(loadedData);
      setDashboardLoading(false);
    };

    loadDashboardData();

    return () => {
      isActive = false;
    };
  }, []);

  const umkmTypeCounts = countByField(
    dashboardData?.umkm,
    "jenis_usaha"
  );
  const umkmPieData = umkmTypeCounts.map(({ label, count }) => ({
    label,
    value: count,
  }));
  const umkmRegionData = buildUMKMRegionData(
    dashboardData?.umkm || []
  );
  const kesejahteraanCategoryCounts = countByField(
    dashboardData?.kesejahteraan,
    "kategori"
  );
  const kesejahteraanPieData = welfareCategories.map((category) => ({
    label: category,
    value:
      kesejahteraanCategoryCounts.find(
        (item) => item.label === category
      )?.count || 0,
  }));
  const kesejahteraanRegionData = buildWelfareRegionData(
    dashboardData?.kesejahteraan || []
  );
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    const savedUser = localStorage.getItem("sadeka_user");

    if (savedUser) {
      const user = JSON.parse(savedUser);
      const profileKey = `sadeka_profile_${
        user.username || user.id_user
      }`;

      localStorage.setItem(
        profileKey,
        JSON.stringify({
          nama: user.nama,
          name: user.name || user.nama,
          nip: user.nip,
          jabatan: user.jabatan,
          emailDinas: user.emailDinas || user.email,
          emailPribadi: user.emailPribadi,
        })
      );
    }

    localStorage.removeItem("sadeka_user");

    navigate("/login", { replace: true });
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
              value={formatCount(dashboardData?.penduduk, dashboardLoading)}
              label="Total Penduduk"
            />

            <StatCard
              icon={umkmIcon}
              title="UMKM"
              value={formatCount(dashboardData?.umkm, dashboardLoading)}
              label="Total UMKM"
            />

            <StatCard
              icon={kesIcon}
              title="Kesejahteraan"
              value={formatCount(dashboardData?.kesejahteraan, dashboardLoading)}
              label="Total Kesejahteraan"
            />

            <StatCard
              icon={pegawaiIcon}
              title="Pegawai"
              value={formatCount(dashboardData?.pegawai, dashboardLoading)}
              label="Total Pegawai"
            />

            <StatCard
              icon={infraIcon}
              title="Infrastruktur"
              value={formatCount(dashboardData?.infrastruktur, dashboardLoading)}
              label="Total Infrastruktur"
            />

            <StatCard
              icon={suratMasukIcon}
              title="Surat Masuk"
              value={
                dashboardLoading
                  ? "..."
                  : formatCount(
                      dashboardData?.surat?.filter(
                        (item) => item.arah_surat === "Masuk"
                      ) ?? null,
                      false
                    )
              }
              label="Total Surat"
            />

            <StatCard
              icon={suratIcon}
              title="Surat Keluar"
              value={
                dashboardLoading
                  ? "..."
                  : formatCount(
                      dashboardData?.surat?.filter(
                        (item) => item.arah_surat === "Keluar"
                      ) ?? null,
                      false
                    )
              }
              label="Total Surat"
            />

            <StatCard
              icon={dokumenIcon}
              title="Surat Ahli Waris"
              value={formatCount(
                dashboardData?.suratAhliWaris,
                dashboardLoading
              )}
              label="Total Surat"
            />

          </div>

          <div className="dashboard-recap-grid">
            <DashboardRecapCard
              icon={umkmIcon}
              title="Rekap UMKM"
              loading={dashboardLoading}
              dataAvailable={dashboardData?.umkm != null}
              pieData={umkmPieData}
              regionData={umkmRegionData}
              regionSeries={[
                { key: "value", label: "Jumlah UMKM", color: "#236bcf" },
              ]}
              hasRegionData={Boolean(
                dashboardData?.umkm?.some((item) => normalizeRW(item.rw))
              )}
              emptyMessage="Belum ada data UMKM."
              onViewAll={() => navigate("/umkm")}
            />
            <DashboardRecapCard
              icon={kesIcon}
              title="Rekap Kesejahteraan"
              loading={dashboardLoading}
              dataAvailable={dashboardData?.kesejahteraan != null}
              pieData={kesejahteraanPieData}
              regionData={kesejahteraanRegionData}
              regionSeries={welfareCategories.map((category, index) => ({
                key: category,
                label: category,
                color: ["#236bcf", "#3db8d3", "#0c3c73", "#6c8cd5"][index],
              }))}
              hasRegionData={Boolean(
                dashboardData?.kesejahteraan?.some((item) =>
                  normalizeRW(item.rw)
                )
              )}
              emptyMessage="Belum ada data kesejahteraan."
              onViewAll={() => navigate("/kesejahteraan")}
            />
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



function DashboardRecapCard({
  icon,
  title,
  loading,
  dataAvailable,
  pieData,
  regionData,
  regionSeries,
  hasRegionData,
  emptyMessage,
  onViewAll,
}) {
  const chartColors = [
    "#236bcf",
    "#3db8d3",
    "#0c3c73",
    "#6c8cd5",
    "#70ad24",
    "#d5ad00",
  ];

  return (
    <section className="dashboard-card dashboard-recap-card">
      <div className="card-header">
        <div className="dashboard-recap-title">
          <img src={icon} alt="" />
          <h2>{title}</h2>
        </div>
        <button type="button" className="card-link" onClick={onViewAll}>
          Lihat Semua
        </button>
      </div>

      <div className="dashboard-recap-charts">
        <section className="dashboard-recap-chart dashboard-recap-pie">
          <h3>Kategori</h3>
          {loading ? (
            <p className="dashboard-recap-empty">Memuat grafik...</p>
          ) : !dataAvailable ? (
            <p className="dashboard-recap-empty">Data tidak dapat dimuat.</p>
          ) : pieData.every((item) => item.value === 0) ? (
            <p className="dashboard-recap-empty">{emptyMessage}</p>
          ) : (
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={45}
                  outerRadius={76}
                  paddingAngle={2}
                >
                  {pieData.map((item, index) => (
                    <Cell
                      key={item.label}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="dashboard-recap-chart dashboard-recap-region">
          <h3>Wilayah</h3>
          {loading ? (
            <p className="dashboard-recap-empty">Memuat grafik...</p>
          ) : !dataAvailable ? (
            <p className="dashboard-recap-empty">Data tidak dapat dimuat.</p>
          ) : !hasRegionData ? (
            <p className="dashboard-recap-empty">Belum ada data wilayah.</p>
          ) : (
            <ResponsiveContainer width="100%" height={270}>
              <BarChart
                data={regionData}
                margin={{ top: 8, right: 6, left: -20, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="rw" interval={2} tick={{ fontSize: 9 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 9 }} />
                <Tooltip />
                {regionSeries.length > 1 && (
                  <Legend wrapperStyle={{ fontSize: "9px" }} />
                )}
                {regionSeries.map((series) => (
                  <Bar
                    key={series.key}
                    dataKey={series.key}
                    name={series.label}
                    fill={series.color}
                    barSize={regionSeries.length > 1 ? 7 : 12}
                    stackId={regionSeries.length > 1 ? "welfare" : undefined}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>
    </section>
  );
}


export default Dashboard;