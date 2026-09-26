import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SideBar from "./sidebarmenu";
import DetailKesejahteraan from "./detailkesejahteraan";
import Header from "./header";

import ksj1Icon from "../assets/ksj1.png";
import ksj2Icon from "../assets/ksj2.png";
import ksj3Icon from "../assets/ksj3.png";
import ksj4Icon from "../assets/ksj4.png";
import ksj5Icon from "../assets/ksj5.png";

import {
  getKesejahteraan,
  deleteKesejahteraan,
} from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* =========================================================
   WARNA PIE CHART
   ========================================================= */

const pieColors = [
  "#8674f5",
  "#236bcf",
  "#3db8d3",
  "#0c3c73",
];

/* =========================================================
   WARNA BAR CHART
   ========================================================= */

const rwColors = [
  ...pieColors,
];

/* =========================================================
   COMPONENT
   ========================================================= */

function Kesejahteraan() {
  const navigate = useNavigate();

  /* =======================================================
     SIDEBAR
     ======================================================= */

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =======================================================
     DATA KESEJAHTERAAN
     ======================================================= */

  const [dataKesejahteraan, setDataKesejahteraan] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =======================================================
     FILTER
     ======================================================= */

  const [search, setSearch] = useState("");
  const [wilayah, setWilayah] = useState("");
  const [status, setStatus] = useState("");
  const [kategori, setKategori] = useState("");

  /* =======================================================
     DETAIL
     ======================================================= */

  const [
    selectedKesejahteraan,
    setSelectedKesejahteraan,
  ] = useState(null);

  /* =======================================================
     DROPDOWN
     ======================================================= */

  const [wilayahOpen, setWilayahOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [kategoriOpen, setKategoriOpen] = useState(false);

  /* =======================================================
     PAGINATION
     ======================================================= */

  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
     ERROR
     ======================================================= */

  const [errorMessage, setErrorMessage] = useState("");

  /* =======================================================
     AMBIL DATA KESEJAHTERAAN DARI API
     ======================================================= */

  const loadKesejahteraan = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getKesejahteraan();

      setDataKesejahteraan(data);
    } catch (error) {
      console.error(
        "Gagal mengambil data kesejahteraan:",
        error
      );

      setErrorMessage(
        error.message ||
          "Gagal mengambil data kesejahteraan"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD DATA SAAT HALAMAN DIBUKA
     ======================================================= */

  useEffect(() => {
    loadKesejahteraan();
  }, []);

  /* =======================================================
     STATISTIK KESEJAHTERAAN DINAMIS
     ======================================================= */

  const statistikKesejahteraan = useMemo(() => {
    const total = dataKesejahteraan.length;

    const stunting = dataKesejahteraan.filter(
      (item) => item.kategori === "Stunting"
    ).length;

    const ibuHamil = dataKesejahteraan.filter(
      (item) => item.kategori === "Ibu Hamil"
    ).length;

    const rutilahu = dataKesejahteraan.filter(
      (item) => item.kategori === "Rutilahu"
    ).length;

    const putusSekolah = dataKesejahteraan.filter(
      (item) => item.kategori === "Putus Sekolah"
    ).length;

    return {
      total,
      stunting,
      ibuHamil,
      rutilahu,
      putusSekolah,
    };
  }, [dataKesejahteraan]);

  /* =======================================================
     DATA PIE CHART DINAMIS
     ======================================================= */

  const kategoriData = useMemo(() => {
    return [
      {
        name: "Stunting",
        value: statistikKesejahteraan.stunting,
      },
      {
        name: "Ibu Hamil",
        value: statistikKesejahteraan.ibuHamil,
      },
      {
        name: "Rutilahu",
        value: statistikKesejahteraan.rutilahu,
      },
      {
        name: "Putus Sekolah",
        value: statistikKesejahteraan.putusSekolah,
      },
    ];
  }, [statistikKesejahteraan]);

  /* =======================================================
     DATA BAR CHART WILAYAH DINAMIS
     ======================================================= */

  const wilayahChartData = useMemo(() => {
    return Array.from(
      { length: 15 },
      (_, index) => {
        const rw = `RW ${String(index + 1).padStart(
          2,
          "0"
        )}`;

        const dataRW = dataKesejahteraan.filter(
          (item) =>
            `RW ${String(item.rw).padStart(
              2,
              "0"
            )}` === rw
        );

        return {
          rw,

          Stunting: dataRW.filter(
            (item) =>
              item.kategori === "Stunting"
          ).length,

          "Ibu Hamil": dataRW.filter(
            (item) =>
              item.kategori === "Ibu Hamil"
          ).length,

          Rutilahu: dataRW.filter(
            (item) =>
              item.kategori === "Rutilahu"
          ).length,

          "Putus Sekolah": dataRW.filter(
            (item) =>
              item.kategori === "Putus Sekolah"
          ).length,
        };
      }
    );
  }, [dataKesejahteraan]);

  /* =======================================================
     FILTER DATA
     ======================================================= */

  const filteredData = useMemo(() => {
    return dataKesejahteraan.filter((item) => {
      const keyword = search
        .toLowerCase()
        .trim();

      const nama = String(
        item.nama || ""
      ).toLowerCase();

      const nik = String(
        item.nik || ""
      ).toLowerCase();

      const itemKategori = String(
        item.kategori || ""
      ).toLowerCase();

      const keterangan = String(
        item.keterangan || ""
      ).toLowerCase();

      const cocokSearch =
        nama.includes(keyword) ||
        nik.includes(keyword) ||
        itemKategori.includes(keyword) ||
        keterangan.includes(keyword);

      const cocokWilayah =
        !wilayah ||
        String(item.rw).padStart(2, "0") ===
          wilayah;

      const cocokStatus =
        !status ||
        item.status === status;

      const cocokKategori =
        !kategori ||
        item.kategori === kategori;

      return (
        cocokSearch &&
        cocokWilayah &&
        cocokStatus &&
        cocokKategori
      );
    });
  }, [
    dataKesejahteraan,
    search,
    wilayah,
    status,
    kategori,
  ]);

  /* =======================================================
     PAGINATION
     ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / 5)
  );

  const currentData = filteredData.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  /* =======================================================
     JAGA CURRENT PAGE
     ======================================================= */

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* =======================================================
     FILTER HANDLER
     ======================================================= */

  const selectWilayah = (value) => {
    setWilayah(value);
    setWilayahOpen(false);
    setCurrentPage(1);
  };

  const selectStatus = (value) => {
    setStatus(value);
    setStatusOpen(false);
    setCurrentPage(1);
  };

  const selectKategori = (value) => {
    setKategori(value);
    setKategoriOpen(false);
    setCurrentPage(1);
  };

  /* =======================================================
     HAPUS DATA KESEJAHTERAAN
     ======================================================= */

  const handleDeleteKesejahteraan = async (data) => {
    const id = data?.id_kesejahteraan;

    if (!id) {
      console.error(
        "ID kesejahteraan tidak ditemukan:",
        data
      );

      return;
    }

    const yakin = window.confirm(
      `Apakah Anda yakin ingin menghapus data kesejahteraan milik ${data.nama}?`
    );

    if (!yakin) {
      return;
    }

    try {
      setLoading(true);

      await deleteKesejahteraan(id);

      setSelectedKesejahteraan(null);

      await loadKesejahteraan();
    } catch (error) {
      console.error(
        "Gagal menghapus data kesejahteraan:",
        error
      );

      window.alert(
        error.message ||
          "Gagal menghapus data kesejahteraan"
      );

      setLoading(false);
    }
  };

  /* =======================================================
     LABEL PIE CHART
     ======================================================= */

  const renderPieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const angle =
      -midAngle * (Math.PI / 180);

    const radius =
      innerRadius +
      (outerRadius - innerRadius) * 0.5;

    const x =
      cx +
      radius * Math.cos(angle);

    const y =
      cy +
      radius * Math.sin(angle);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontWeight="700"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  /* =======================================================
     RETURN
     ======================================================= */

  return (
    <div className="kesejahteraan-page">

      {/* ===================================================
          SIDEBAR
          =================================================== */}

      <SideBar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* ===================================================
          HEADER
          =================================================== */}

      <Header
        title="Kesejahteraan"
        showSearch={true}
        searchValue={search}
        onSearchChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        onMenuClick={() =>
          setSidebarOpen((prev) => !prev)
        }
      />

      {/* ===================================================
          MAIN
          =================================================== */}

      <main className="kesejahteraan-main">

        {/* =================================================
            TAMBAH
            ================================================= */}

        <div className="kesejahteraan-add-wrapper">

          <button
            type="button"
            className="kesejahteraan-add-button"
            onClick={() =>
              navigate(
                "/kesejahteraan/tambah"
              )
            }
          >
            + Tambah Kesejahteraan
          </button>

        </div>

        {/* =================================================
            ERROR
            ================================================= */}

        {errorMessage && (
          <div
            style={{
              marginBottom: "15px",
              padding: "12px 15px",
              borderRadius: "8px",
              background: "#ffecec",
              color: "#c62828",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* =================================================
            STATISTIK
            ================================================= */}

        <section className="kesejahteraan-stats">

          {/* TOTAL */}

          <div className="kesejahteraan-stat-card">

            <div className="stat-icon kesejahteraan-icon">
              <img
                src={ksj1Icon}
                alt=""
              />
            </div>

            <div>
              <h3>Kesejahteraan</h3>

              <strong>
                {statistikKesejahteraan.total}
              </strong>

              <p>Total Kesejahteraan</p>
            </div>

          </div>

          {/* STUNTING */}

          <div className="kesejahteraan-stat-card">

            <div className="stat-icon">
              <img
                src={ksj2Icon}
                alt=""
              />
            </div>

            <div>
              <h3>Stunting</h3>

              <strong>
                {statistikKesejahteraan.stunting}
              </strong>

              <p>Total Stunting</p>
            </div>

          </div>

          {/* IBU HAMIL */}

          <div className="kesejahteraan-stat-card">

            <div className="stat-icon">
              <img
                src={ksj3Icon}
                alt=""
              />
            </div>

            <div>
              <h3>Ibu Hamil</h3>

              <strong>
                {statistikKesejahteraan.ibuHamil}
              </strong>

              <p>Total Ibu Hamil</p>
            </div>

          </div>

          {/* RUTILAHU */}

          <div className="kesejahteraan-stat-card">

            <div className="stat-icon">
              <img
                src={ksj4Icon}
                alt=""
              />
            </div>

            <div>
              <h3>Rutilahu</h3>

              <strong>
                {statistikKesejahteraan.rutilahu}
              </strong>

              <p>Total Rutilahu</p>
            </div>

          </div>

          {/* PUTUS SEKOLAH */}

          <div className="kesejahteraan-stat-card">

            <div className="stat-icon">
              <img
                src={ksj5Icon}
                alt=""
              />
            </div>

            <div>
              <h3>
                Putus
                <br />
                Sekolah
              </h3>

              <strong>
                {statistikKesejahteraan.putusSekolah}
              </strong>

              <p>Total Putus Sekolah</p>
            </div>

          </div>

        </section>

        {/* =================================================
            REKAP
            ================================================= */}

        <section className="kesejahteraan-rekap">

          <div className="kesejahteraan-rekap-title">
            <h2>
              Rekap Kesejahteraan
            </h2>
          </div>

          <div className="kesejahteraan-chart-wrapper">

            {/* =============================================
                PIE CHART
                ============================================= */}

            <div className="kesejahteraan-pie-section">

              <h3>Kategori</h3>

              <div className="pie-chart-container">

                <PieChart
                  width={420}
                  height={390}
                >

                  <Pie
                    data={kategoriData}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={158}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={1}
                    label={renderPieLabel}
                    labelLine={false}
                  >

                    {kategoriData.map(
                      (_, index) => (
                        <Cell
                          key={index}
                          fill={
                            pieColors[index]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

                <div className="pie-total">

                  <strong>
                    {statistikKesejahteraan.total}
                  </strong>

                </div>

              </div>

              <div className="pie-legend">

                {kategoriData.map(
                  (item, index) => (
                    <div
                      className="pie-legend-item"
                      key={item.name}
                    >

                      <span
                        style={{
                          background:
                            pieColors[index],
                        }}
                      />

                      {item.name}

                    </div>
                  )
                )}

              </div>

            </div>

            {/* =============================================
                BAR CHART
                ============================================= */}

            <div className="kesejahteraan-bar-section">

              <h3>Wilayah</h3>

              <ResponsiveContainer
                width="100%"
                height={430}
              >

                <BarChart
                  data={wilayahChartData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: 5,
                    bottom: 45,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="2 2"
                  />

                  <XAxis
                    dataKey="rw"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={65}
                    tick={{
                      fontSize: 10,
                    }}
                  />

                  <YAxis
                    type="number"
                    domain={[0, 20]}
                  />

                  <Tooltip
                    position={{
                      y: 0,
                    }}
                    allowEscapeViewBox={{
                      x: true,
                      y: true,
                    }}
                    wrapperStyle={{
                      zIndex: 10,
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: "10px",
                    }}
                  />

                  <Bar
                    dataKey="Stunting"
                    fill={rwColors[0]}
                    barSize={10}
                  />

                  <Bar
                    dataKey="Ibu Hamil"
                    fill={rwColors[1]}
                    barSize={10}
                  />

                  <Bar
                    dataKey="Rutilahu"
                    fill={rwColors[2]}
                    barSize={10}
                  />

                  <Bar
                    dataKey="Putus Sekolah"
                    fill={rwColors[3]}
                    barSize={10}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </section>

        {/* =================================================
            DAFTAR
            ================================================= */}

        <section className="kesejahteraan-list-card">

          {/* ===============================================
              HEADER DAFTAR
              =============================================== */}

          <div className="kesejahteraan-list-header">

            <h2>
              Daftar Kesejahteraan
            </h2>

            <div className="kesejahteraan-filter">

              <span>Filter</span>

              {/* =========================================
                  WILAYAH
                  ========================================= */}

              <div className="kesejahteraan-filter-dropdown">

                <button
                  type="button"
                  className="kesejahteraan-filter-button"
                  onClick={() => {

                    setWilayahOpen(
                      !wilayahOpen
                    );

                    setStatusOpen(false);

                    setKategoriOpen(false);

                  }}
                >

                  {wilayah
                    ? `RW ${wilayah}`
                    : "Wilayah"}

                  <b>▼</b>

                </button>

                {wilayahOpen && (
                  <div className="kesejahteraan-dropdown-menu">

                    <button
                      type="button"
                      onClick={() =>
                        selectWilayah("")
                      }
                    >
                      Semua Wilayah
                    </button>

                    {Array.from(
                      { length: 15 },
                      (_, index) => {

                        const rw =
                          String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          );

                        return (
                          <button
                            type="button"
                            key={rw}
                            onClick={() =>
                              selectWilayah(
                                rw
                              )
                            }
                          >
                            RW {rw}
                          </button>
                        );

                      }
                    )}

                  </div>
                )}

              </div>

              {/* =========================================
                  STATUS
                  ========================================= */}

              <div className="kesejahteraan-filter-dropdown">

                <button
                  type="button"
                  className="kesejahteraan-filter-button"
                  onClick={() => {

                    setStatusOpen(
                      !statusOpen
                    );

                    setWilayahOpen(false);

                    setKategoriOpen(false);

                  }}
                >

                  {status || "Status"}

                  <b>▼</b>

                </button>

                {statusOpen && (
                  <div className="kesejahteraan-dropdown-menu">

                    <button
                      type="button"
                      onClick={() =>
                        selectStatus("")
                      }
                    >
                      Semua Status
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectStatus(
                          "Selesai"
                        )
                      }
                    >
                      Selesai
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectStatus(
                          "Dalam Penanganan"
                        )
                      }
                    >
                      Dalam Penanganan
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectStatus(
                          "Belum Ditangani"
                        )
                      }
                    >
                      Belum Ditangani
                    </button>

                  </div>
                )}

              </div>

              {/* =========================================
                  KATEGORI
                  ========================================= */}

              <div className="kesejahteraan-filter-dropdown">

                <button
                  type="button"
                  className="kesejahteraan-filter-button"
                  onClick={() => {

                    setKategoriOpen(
                      !kategoriOpen
                    );

                    setWilayahOpen(false);

                    setStatusOpen(false);

                  }}
                >

                  {kategori || "Kategori"}

                  <b>▼</b>

                </button>

                {kategoriOpen && (
                  <div className="kesejahteraan-dropdown-menu">

                    <button
                      type="button"
                      onClick={() =>
                        selectKategori("")
                      }
                    >
                      Semua Kategori
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectKategori(
                          "Stunting"
                        )
                      }
                    >
                      Stunting
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectKategori(
                          "Ibu Hamil"
                        )
                      }
                    >
                      Ibu Hamil
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectKategori(
                          "Rutilahu"
                        )
                      }
                    >
                      Rutilahu
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectKategori(
                          "Putus Sekolah"
                        )
                      }
                    >
                      Putus Sekolah
                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* ===============================================
              TABLE
              =============================================== */}

          <div className="kesejahteraan-table-wrapper">

            <table className="kesejahteraan-table">

              <thead>

                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIK</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>RT</th>
                  <th>RW</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="9"
                      style={{
                        textAlign:
                          "center",
                      }}
                    >
                      Memuat data
                      kesejahteraan...
                    </td>

                  </tr>

                ) : currentData.length === 0 ? (

                  <tr>

                    <td
                      colSpan="9"
                      style={{
                        textAlign:
                          "center",
                      }}
                    >
                      Tidak ada data
                      kesejahteraan
                    </td>

                  </tr>

                ) : (

                  currentData.map(
                    (item, index) => (

                      <tr
                        key={
                          item.id_kesejahteraan
                        }
                      >

                        {/* NO */}

                        <td>
                          {
                            (currentPage -
                              1) *
                              5 +
                              index +
                              1
                          }
                        </td>

                        {/* NAMA */}

                        <td>
                          {item.nama}
                        </td>

                        {/* NIK */}

                        <td>
                          {item.nik}
                        </td>

                        {/* KATEGORI */}

                        <td>
                          {item.kategori}
                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              item.status ===
                              "Selesai"
                                ? "status-selesai"
                                : item.status ===
                                  "Dalam Penanganan"
                                ? "status-penanganan"
                                : "status-belum"
                            }
                          >
                            {item.status}
                          </span>

                        </td>

                        {/* RT */}

                        <td>
                          {item.rt}
                        </td>

                        {/* RW */}

                        <td>
                          {item.rw}
                        </td>

                        {/* KETERANGAN */}

                        <td className="keterangan-cell">
                          {item.keterangan}
                        </td>

                        {/* AKSI */}

                        <td>

                          <button
                            type="button"
                            className="kesejahteraan-action-button"
                            onClick={() =>
                              setSelectedKesejahteraan(
                                item
                              )
                            }
                          >
                            ⋮
                          </button>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

          {/* ===============================================
              FOOTER
              =============================================== */}

          <div className="kesejahteraan-list-footer">

            <div>

              Menampilkan{" "}

              <strong>

                {filteredData.length ===
                0
                  ? "0"
                  : `${(currentPage - 1) * 5 + 1}-${Math.min(
                      currentPage * 5,
                      filteredData.length
                    )}`}

              </strong>

              {" "}dari{" "}

              <strong>
                {filteredData.length}
              </strong>

              {" "}Kesejahteraan

            </div>

            <div className="pagination">

              {/* SEBELUMNYA */}

              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                ← Sebelumnya
              </button>

              {/* NOMOR HALAMAN */}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => {

                  const page =
                    index + 1;

                  return (
                    <button
                      type="button"
                      key={page}
                      className={
                        currentPage ===
                        page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                    >
                      {page}
                    </button>
                  );

                }
              )}

              {/* SELANJUTNYA */}

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >
                Selanjutnya →
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* ===================================================
          DETAIL KESEJAHTERAAN
          =================================================== */}

      {selectedKesejahteraan && (

        <DetailKesejahteraan
          data={
            selectedKesejahteraan
          }

          onClose={() =>
            setSelectedKesejahteraan(
              null
            )
          }

          onDelete={
            handleDeleteKesejahteraan
          }
        />

      )}

    </div>
  );
}

export default Kesejahteraan;