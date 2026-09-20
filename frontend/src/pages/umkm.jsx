import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SideBar from "./sidebarmenu";
import Header from "./header";
import DetailUMKM from "./detailumkm";
import umkm1Icon from "../assets/umkm1.png";
import umkm2Icon from "../assets/umkm2.png";
import umkm3Icon from "../assets/umkm3.png";

function ChevronDown() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* =========================================================
   DATA
========================================================= */

const dataUMKM = [
  {
    no: "001",
    namaUsaha: "Bakso Berkah",
    pemilik: "Ahmad Fauzi",
    jenisUsaha: "Kuliner",
    nib: "9120003540844",
    rt: "02",
    rw: "01",
    alamat:
      "Jl. Manukan Asri No.I-A, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "002",
    namaUsaha: "Dapur Ibu",
    pemilik: "Siti Aminah",
    jenisUsaha: "Kuliner",
    nib: "9120003540943",
    rt: "16",
    rw: "03",
    alamat:
      "Jl. Manukan Asri No. 16, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "003",
    namaUsaha: "Pangkas Rambut Andi",
    pemilik: "Andi Hirawan",
    jenisUsaha: "Jasa",
    nib: "9120003520123",
    rt: "19",
    rw: "04",
    alamat:
      "Jl. Manukan Asri No. 19, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "004",
    namaUsaha: "Toko Sembako Lina",
    pemilik: "Lina Wati",
    jenisUsaha: "Retail",
    nib: "9120009910125",
    rt: "23",
    rw: "05",
    alamat:
      "Jl. Manukan Subur No. 08, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "005",
    namaUsaha: "Laundry Murah",
    pemilik: "Setyo",
    jenisUsaha: "Jasa",
    nib: "9120009913007",
    rt: "06",
    rw: "02",
    alamat:
      "Jl. Manukan Krajan No. 02, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
];

/* =========================================================
   DATA GRAFIK WILAYAH
========================================================= */

const wilayahChart = [
  { rw: "RW 15", value: 36 },
  { rw: "RW 14", value: 47 },
  { rw: "RW 13", value: 44 },
  { rw: "RW 12", value: 51 },
  { rw: "RW 11", value: 39 },
  { rw: "RW 10", value: 56 },
  { rw: "RW 09", value: 42 },
  { rw: "RW 08", value: 48 },
  { rw: "RW 07", value: 34 },
  { rw: "RW 06", value: 45 },
  { rw: "RW 05", value: 61 },
  { rw: "RW 04", value: 61 },
  { rw: "RW 03", value: 52 },
  { rw: "RW 02", value: 38 },
  { rw: "RW 01", value: 45 },
];

/* =========================================================
   DONUT CHART
========================================================= */

function DonutChart() {
  const segments = [
    {
      label: "Kuliner",
      value: 120,
      color: "#8674f5",
    },
    {
      label: "Fashion",
      value: 75,
      color: "#236bcf",
    },
    {
      label: "Jasa",
      value: 63,
      color: "#3db8d3",
    },
    {
      label: "Retail",
      value: 98,
      color: "#0c3c73",
    },
  ];

  const renderInsideLabel = ({
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
    <div className="umkm-donut-wrapper">
      <div className="umkm-donut">
        <ResponsiveContainer width="100%" height={370}>
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              innerRadius={92}
              outerRadius={158}
              paddingAngle={1}
              label={renderInsideLabel}
              labelLine={false}
            >
              {segments.map((segment) => (
                <Cell key={segment.label} fill={segment.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, name]} />
            <Legend wrapperStyle={{ fontSize: "10px" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="umkm-donut-total">356</div>
      </div>
    </div>
  );
}

/* =========================================================
   BAR CHART
========================================================= */

function WilayahChart() {
  return (
    <div className="wilayah-chart">
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={wilayahChart}
          margin={{ top: 10, right: 15, left: 5, bottom: 45 }}
        >
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
            domain={[0, 100]}
          />
          <Tooltip formatter={(value) => [value, "Jumlah UMKM"]} />
          <Legend wrapperStyle={{ fontSize: "10px" }} />
          <Bar dataKey="value" name="Jumlah UMKM" fill="#236bcf" barSize={14} />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

function UMKM() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [jenisUsaha, setJenisUsaha] = useState("");
  const [wilayah, setWilayah] = useState("");
  const [selectedRT, setSelectedRT] = useState("");
  const [selectedUMKM, setSelectedUMKM] = useState(null);

  const [jenisOpen, setJenisOpen] = useState(false);
  const [wilayahOpen, setWilayahOpen] = useState(false);
  const [hoveredRW, setHoveredRW] = useState(null);

  const wilayahData = {
    "01": ["01", "02", "03", "04", "05"],
    "02": ["06", "07", "08", "09", "10"],
    "03": ["11", "12", "13", "14", "15"],
    "04": ["16", "17", "18", "19", "20"],
    "05": ["21", "22", "23", "24", "25"],
    "06": ["26", "27", "28", "29", "30"],
    "07": ["31", "32", "33", "34", "35"],
    "08": ["36", "37", "38", "39", "40"],
    "09": ["41", "42", "43", "44", "45"],
    "10": ["46", "47", "48", "49", "50"],
    "11": ["51", "52", "53", "54", "55"],
    "12": ["56", "57", "58", "59", "60"],
    "13": ["61", "62", "63", "64", "65"],
    "14": ["66", "67", "68", "69", "70"],
    "15": ["71", "72", "73", "74", "75"],
  };

  const filteredData = useMemo(() => {
    return dataUMKM.filter((item) => {

      const keyword = search.toLowerCase();

      const matchSearch =
        item.namaUsaha.toLowerCase().includes(keyword) ||
        item.pemilik.toLowerCase().includes(keyword) ||
        item.jenisUsaha.toLowerCase().includes(keyword) ||
        item.nib.includes(keyword);

      const matchJenis =
        !jenisUsaha ||
        item.jenisUsaha === jenisUsaha;

      const matchWilayah =
        !wilayah ||
        item.rw === wilayah;

      const matchRT =
        !selectedRT ||
        item.rt === selectedRT;

      return (
        matchSearch &&
        matchJenis &&
        matchWilayah &&
        matchRT
      );
    });
  }, [search, jenisUsaha, wilayah, selectedRT]);

  return (
    <div className="umkm-page">
      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Header
        title="UMKM"
        showSearch={true}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="umkm-main">

        {/* TAMBAH UMKM */}

        <div className="umkm-add-wrapper">

          <button
            type="button"
            className="umkm-add-button"
            onClick={() => navigate("/umkm/tambah")}
          >
            <span>+</span>
            Tambah UMKM
          </button>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="umkm-statistics">

          <div className="umkm-stat-card">

            <div className="umkm-stat-icon">
              <img src={umkm1Icon} alt="" />
            </div>

            <div className="umkm-stat-content">

              <h2>UMKM</h2>

              <strong>150</strong>

              <span>Total UMKM</span>

            </div>

          </div>

          <div className="umkm-stat-card">

            <div className="umkm-stat-icon">
              <img src={umkm2Icon} alt="" />
            </div>

            <div className="umkm-stat-content">

              <h2>NIB</h2>

              <strong>120</strong>

              <span>
                Total Usaha yang
                <br />
                Memiliki NIB
              </span>

            </div>

          </div>

          <div className="umkm-stat-card">

            <div className="umkm-stat-icon">
              <img src={umkm3Icon} alt="" />
            </div>

            <div className="umkm-stat-content">

              <h2>Jenis</h2>

              <strong>5</strong>

              <span>Total Jenis Usaha</span>

            </div>

          </div>

        </section>

        {/* =================================================
            REKAP UMKM
        ================================================= */}

        <section className="umkm-rekap">

          <div className="umkm-section-title">
            <h2>Rekap UMKM</h2>
          </div>

          <div className="umkm-rekap-content">

            <div className="umkm-chart-column">

              <h3>Jenis Usaha</h3>

              <DonutChart />

            </div>

            <div className="umkm-chart-column">

              <h3>Wilayah</h3>

              <WilayahChart />

            </div>

          </div>

        </section>

        {/* =================================================
            DAFTAR UMKM
        ================================================= */}

        <section className="umkm-list-card">

          <div className="umkm-list-header">

            <h2>Daftar UMKM</h2>

            <div className="umkm-filter-box">

              <span className="filter-label">
                Filter
              </span>

              {/* JENIS USAHA */}

              <div className="umkm-filter-dropdown">

                <button
                  type="button"
                  className="umkm-filter-button"
                  onClick={() => {
                    setJenisOpen(!jenisOpen);
                    setWilayahOpen(false);
                  }}
                >
                  {jenisUsaha || "Jenis Usaha"}
                  <ChevronDown />
                </button>

                {jenisOpen && (
                  <div className="umkm-dropdown-menu">

                    <button
                      type="button"
                      onClick={() => {
                        setJenisUsaha("");
                        setJenisOpen(false);
                      }}
                    >
                      Semua Jenis
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setJenisUsaha("Kuliner");
                        setJenisOpen(false);
                      }}
                    >
                      Kuliner
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setJenisUsaha("Fashion");
                        setJenisOpen(false);
                      }}
                    >
                      Fashion
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setJenisUsaha("Jasa");
                        setJenisOpen(false);
                      }}
                    >
                      Jasa
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setJenisUsaha("Retail");
                        setJenisOpen(false);
                      }}
                    >
                      Retail
                    </button>

                  </div>
                )}

              </div>

              {/* WILAYAH */}

              <div className="umkm-filter-dropdown">

                <button
                  type="button"
                  className="umkm-filter-button"
                  onClick={() => {
                    setWilayahOpen(!wilayahOpen);
                    setJenisOpen(false);
                  }}
                >
                  {wilayah
                    ? `RW ${wilayah}`
                    : "Wilayah"}

                  <ChevronDown />
                </button>

                {wilayahOpen && (
                  <div className="umkm-dropdown-menu">

                    <div
                      className="wilayah-item"
                      onMouseEnter={() => setHoveredRW(null)}
                      onClick={() => {
                        setWilayah("");
                        setSelectedRT("");
                        setWilayahOpen(false);
                      }}
                    >
                      <span>Semua Wilayah</span>
                    </div>

                    {Object.keys(wilayahData)
                      .sort((a, b) => Number(a) - Number(b))
                      .map((rw) => (
                        <div
                          key={rw}
                          className="wilayah-item"
                          onMouseEnter={() => setHoveredRW(rw)}
                        >
                          <span>RW {rw}</span>
                          <span className="rw-arrow">›</span>

                          {hoveredRW === rw && (
                            <div className="rt-menu">
                              {wilayahData[rw].map((rt) => (
                                <div
                                  key={rt}
                                  className="rt-item"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setWilayah(rw);
                                    setSelectedRT(rt);
                                    setWilayahOpen(false);
                                  }}
                                >
                                  RT {rt}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="umkm-table-wrapper">

            <table className="umkm-table">

              <thead>

                <tr>
                  <th>No</th>
                  <th>Nama Usaha</th>
                  <th>Pemilik</th>
                  <th>Jenis Usaha</th>
                  <th>NIB</th>
                  <th>RT</th>
                  <th>RW</th>
                  <th>Alamat</th>
                </tr>

              </thead>

              <tbody>

                {filteredData.map((item) => (
                  <tr
                    key={item.no}
                    className="umkm-table-row-clickable"
                    onClick={() => setSelectedUMKM(item)}
                  >

                    <td>{item.no}</td>

                    <td className="umkm-business-name">
                      {item.namaUsaha}
                    </td>

                    <td>{item.pemilik}</td>

                    <td>{item.jenisUsaha}</td>

                    <td>{item.nib}</td>

                    <td>{item.rt}</td>

                    <td>{item.rw}</td>

                    <td className="umkm-address">
                      {item.alamat}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* =================================================
              FOOTER TABLE
          ================================================= */}

          <div className="umkm-table-footer">

            <div className="umkm-showing">

              Menampilkan{" "}
              <strong>
                1-{filteredData.length}
              </strong>{" "}
              dari <strong>150</strong> UMKM

            </div>

            <div className="umkm-pagination">

              <button
                type="button"
                className="pagination-prev"
              >
                ← Sebelumnya
              </button>

              <button
                type="button"
                className="pagination-number active"
              >
                1
              </button>

              <button
                type="button"
                className="pagination-number"
              >
                2
              </button>

              <button
                type="button"
                className="pagination-number"
              >
                3
              </button>

              <button
                type="button"
                className="pagination-next"
              >
                Selanjutnya →
              </button>

            </div>

          </div>

        </section>

      </main>

      {selectedUMKM && (
        <DetailUMKM
          data={selectedUMKM}
          onClose={() => setSelectedUMKM(null)}
          onDelete={(data) => {
            console.log("Hapus data:", data);
            setSelectedUMKM(null);
          }}
        />
      )}

    </div>
  );
}

export default UMKM;