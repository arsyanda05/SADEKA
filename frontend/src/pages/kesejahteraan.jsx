import { useMemo, useState } from "react";
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

const dataKesejahteraan = [
  {
    no: "001",
    nama: "Haryadi",
    nik: "3530110702060001",
    kategori: "Rutilahu",
    status: "Selesai",
    rt: "02",
    rw: "01",
    keterangan:
      "Kondisi atap dan dinding rumah yang mengalami kerusakan sudah diperbaiki",
  },
  {
    no: "002",
    nama: "Sri Rejeki",
    nik: "3530115702060001",
    kategori: "Ibu Hamil",
    status: "Dalam Penanganan",
    rt: "16",
    rw: "03",
    keterangan:
      "Kehamilan 7 bulan, rutin melakukan pemeriksaan",
  },
  {
    no: "003",
    nama: "Nadira",
    nik: "3520116704090001",
    kategori: "Stunting",
    status: "Belum Ditangani",
    rt: "19",
    rw: "04",
    keterangan:
      "Memerlukan pemantauan pertumbuhan dan asupan gizi secara berkala",
  },
  {
    no: "004",
    nama: "Kayla",
    nik: "3540121702090001",
    kategori: "Putus Sekolah",
    status: "Selesai",
    rt: "23",
    rw: "05",
    keterangan:
      "Telah kembali melanjutkan pendidikan",
  },
  {
    no: "005",
    nama: "Utami",
    nik: "3550118702980001",
    kategori: "Ibu Hamil",
    status: "Dalam Penanganan",
    rt: "06",
    rw: "02",
    keterangan:
      "Rutin melakukan pemeriksaan kehamilan di fasilitas kesehatan",
  },
];

const kategoriData = [
  {
    name: "Stunting",
    value: 113,
  },
  {
    name: "Ibu Hamil",
    value: 102,
  },
  {
    name: "Rutilahu",
    value: 172,
  },
  {
    name: "Putus Sekolah",
    value: 72,
  },
];

const pieColors = [
  "#8674f5",
  "#236bcf",
  "#3db8d3",
  "#0c3c73",
];

const wilayahData = [
  {
    name: "Stunting",
    "RW 01": 8,
    "RW 02": 5,
    "RW 03": 11,
    "RW 04": 7,
    "RW 05": 9,
    "RW 06": 4,
    "RW 07": 10,
    "RW 08": 12,
    "RW 09": 6,
    "RW 10": 5,
    "RW 11": 8,
    "RW 12": 6,
    "RW 13": 4,
    "RW 14": 7,
    "RW 15": 5,
  },
  {
    name: "Ibu Hamil",
    "RW 01": 6,
    "RW 02": 9,
    "RW 03": 7,
    "RW 04": 8,
    "RW 05": 5,
    "RW 06": 7,
    "RW 07": 9,
    "RW 08": 8,
    "RW 09": 6,
    "RW 10": 5,
    "RW 11": 8,
    "RW 12": 6,
    "RW 13": 7,
    "RW 14": 5,
    "RW 15": 4,
  },
  {
    name: "Rutilahu",
    "RW 01": 12,
    "RW 02": 9,
    "RW 03": 14,
    "RW 04": 16,
    "RW 05": 10,
    "RW 06": 8,
    "RW 07": 13,
    "RW 08": 11,
    "RW 09": 15,
    "RW 10": 12,
    "RW 11": 10,
    "RW 12": 13,
    "RW 13": 9,
    "RW 14": 13,
    "RW 15": 9,
  },
  {
    name: "Putus Sekolah",
    "RW 01": 5,
    "RW 02": 3,
    "RW 03": 6,
    "RW 04": 7,
    "RW 05": 3,
    "RW 06": 4,
    "RW 07": 6,
    "RW 08": 5,
    "RW 09": 8,
    "RW 10": 4,
    "RW 11": 5,
    "RW 12": 4,
    "RW 13": 6,
    "RW 14": 5,
    "RW 15": 4,
  },
];

const wilayahChartData = Array.from(
  { length: 15 },
  (_, index) => {
    const rw = `RW ${String(index + 1).padStart(2, "0")}`;

    return {
      rw,
      Stunting: wilayahData[0][rw],
      "Ibu Hamil": wilayahData[1][rw],
      Rutilahu: wilayahData[2][rw],
      "Putus Sekolah": wilayahData[3][rw],
    };
  }
);

const rwColors = [
  ...pieColors,
];

function Kesejahteraan() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [wilayah, setWilayah] = useState("");
  const [status, setStatus] = useState("");
  const [kategori, setKategori] = useState("");
  const [selectedKesejahteraan, setSelectedKesejahteraan] = useState(null);

  const [wilayahOpen, setWilayahOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [kategoriOpen, setKategoriOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return dataKesejahteraan.filter((item) => {
      const keyword = search.toLowerCase();

      const cocokSearch =
        item.nama.toLowerCase().includes(keyword) ||
        item.nik.includes(keyword) ||
        item.kategori.toLowerCase().includes(keyword) ||
        item.keterangan.toLowerCase().includes(keyword);

      const cocokWilayah =
        !wilayah || item.rw === wilayah;

      const cocokStatus =
        !status || item.status === status;

      const cocokKategori =
        !kategori || item.kategori === kategori;

      return (
        cocokSearch &&
        cocokWilayah &&
        cocokStatus &&
        cocokKategori
      );
    });
  }, [search, wilayah, status, kategori]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / 5)
  );

  const currentData = filteredData.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

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

  const renderPieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const angle = -midAngle * (Math.PI / 180);
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

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

  return (
    <div className="kesejahteraan-page">
      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Header
        title="Kesejahteraan"
        showSearch={true}
        searchValue={search}
        onSearchChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />

      {/* MAIN */}
      <main className="kesejahteraan-main">

        {/* TAMBAH */}
        <div className="kesejahteraan-add-wrapper">

          <button
            type="button"
            className="kesejahteraan-add-button"
            onClick={() =>
              navigate("/kesejahteraan/tambah")
            }
          >
            + Tambah Kesejahteraan
          </button>

        </div>

        {/* STATISTIK */}
        <section className="kesejahteraan-stats">

          <div className="kesejahteraan-stat-card">
            <div className="stat-icon kesejahteraan-icon">
              <img src={ksj1Icon} alt="" />
            </div>

            <div>
              <h3>Kesejahteraan</h3>
              <strong>459</strong>
              <p>Total Kesejahteraan</p>
            </div>
          </div>

          <div className="kesejahteraan-stat-card">
            <div className="stat-icon">
              <img src={ksj2Icon} alt="" />
            </div>

            <div>
              <h3>Stunting</h3>
              <strong>113</strong>
              <p>Total Stunting</p>
            </div>
          </div>

          <div className="kesejahteraan-stat-card">
            <div className="stat-icon">
              <img src={ksj3Icon} alt="" />
            </div>

            <div>
              <h3>Ibu Hamil</h3>
              <strong>102</strong>
              <p>Total Ibu Hamil</p>
            </div>
          </div>

          <div className="kesejahteraan-stat-card">
            <div className="stat-icon">
              <img src={ksj4Icon} alt="" />
            </div>

            <div>
              <h3>Rutilahu</h3>
              <strong>172</strong>
              <p>Total Rutilahu</p>
            </div>
          </div>

          <div className="kesejahteraan-stat-card">
            <div className="stat-icon">
              <img src={ksj5Icon} alt="" />
            </div>

            <div>
              <h3>Putus<br />Sekolah</h3>
              <strong>72</strong>
              <p>Total Putus Sekolah</p>
            </div>
          </div>

        </section>

        {/* REKAP */}
        <section className="kesejahteraan-rekap">

          <div className="kesejahteraan-rekap-title">
            <h2>Rekap Kesejahteraan</h2>
          </div>

          <div className="kesejahteraan-chart-wrapper">

            {/* PIE */}
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
                          fill={pieColors[index]}
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                </PieChart>

                <div className="pie-total">
                  <strong>459</strong>
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

            {/* BAR */}
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
                    tick={{ fontSize: 10 }}
                  />

                  <YAxis
                    type="number"
                    domain={[0, 20]}
                  />

                  <Tooltip
                    position={{ y: 0 }}
                    allowEscapeViewBox={{ x: true, y: true }}
                    wrapperStyle={{ zIndex: 10 }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: "10px",
                    }}
                  />

                  <Bar dataKey="Stunting" fill={rwColors[0]} barSize={10} />
                  <Bar dataKey="Ibu Hamil" fill={rwColors[1]} barSize={10} />
                  <Bar dataKey="Rutilahu" fill={rwColors[2]} barSize={10} />
                  <Bar dataKey="Putus Sekolah" fill={rwColors[3]} barSize={10} />

                </BarChart>
              </ResponsiveContainer>

            </div>

          </div>

        </section>

        {/* DAFTAR */}
        <section className="kesejahteraan-list-card">

          <div className="kesejahteraan-list-header">

            <h2>Daftar Kesejahteraan</h2>

            <div className="kesejahteraan-filter">

              <span>Filter</span>

              {/* WILAYAH */}
              <div className="kesejahteraan-filter-dropdown">

                <button
                  type="button"
                  className="kesejahteraan-filter-button"
                  onClick={() => {
                    setWilayahOpen(!wilayahOpen);
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
                          String(index + 1).padStart(
                            2,
                            "0"
                          );

                        return (
                          <button
                            type="button"
                            key={rw}
                            onClick={() =>
                              selectWilayah(rw)
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

              {/* STATUS */}
              <div className="kesejahteraan-filter-dropdown">

                <button
                  type="button"
                  className="kesejahteraan-filter-button"
                  onClick={() => {
                    setStatusOpen(!statusOpen);
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
                        selectStatus("Selesai")
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

              {/* KATEGORI */}
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
                        selectKategori("Stunting")
                      }
                    >
                      Stunting
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectKategori("Ibu Hamil")
                      }
                    >
                      Ibu Hamil
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectKategori("Rutilahu")
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

          {/* TABLE */}
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

                {currentData.map((item) => (

                  <tr key={item.no}>

                    <td>{item.no}</td>

                    <td>{item.nama}</td>

                    <td>{item.nik}</td>

                    <td>{item.kategori}</td>

                    <td>
                      <span
                        className={
                          item.status === "Selesai"
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

                    <td>{item.rt}</td>

                    <td>{item.rw}</td>

                    <td className="keterangan-cell">
                      {item.keterangan}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="kesejahteraan-action-button"
                        onClick={() => setSelectedKesejahteraan(item)}
                      >
                        ⋮
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}
          <div className="kesejahteraan-list-footer">

            <div>
              Menampilkan{" "}
              <strong>
                {filteredData.length === 0
                  ? "0"
                  : `${(currentPage - 1) * 5 + 1}-${Math.min(
                      currentPage * 5,
                      filteredData.length
                    )}`}
              </strong>{" "}
              dari{" "}
              <strong>{filteredData.length}</strong>{" "}
              Kesejahteraan
            </div>

            <div className="pagination">

              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                ← Sebelumnya
              </button>

              {[1, 2, 3].map((page) => (
                <button
                  type="button"
                  key={page}
                  className={
                    currentPage === page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={
                  currentPage === totalPages
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

      {selectedKesejahteraan && (
        <DetailKesejahteraan
          data={selectedKesejahteraan}
          onClose={() => setSelectedKesejahteraan(null)}
          onDelete={(data) => {
            console.log("Hapus data:", data);
            setSelectedKesejahteraan(null);
          }}
        />
      )}

    </div>
  );
}

export default Kesejahteraan;