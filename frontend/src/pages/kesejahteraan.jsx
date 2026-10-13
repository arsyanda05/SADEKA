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

const wilayahOptions = {
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





const pieColors = [
  "#8674f5",
  "#236bcf",
  "#3db8d3",
  "#0c3c73",
];





const rwColors = [
  ...pieColors,
];





function Kesejahteraan() {
  const navigate = useNavigate();





  const [sidebarOpen, setSidebarOpen] = useState(false);





  const [dataKesejahteraan, setDataKesejahteraan] = useState([]);

  const [loading, setLoading] = useState(true);





  const [search, setSearch] = useState("");
  const [wilayah, setWilayah] = useState("");
  const [selectedRT, setSelectedRT] = useState("");
  const [status, setStatus] = useState("");
  const [kategori, setKategori] = useState("");





  const [
    selectedKesejahteraan,
    setSelectedKesejahteraan,
  ] = useState(null);





  const [wilayahOpen, setWilayahOpen] = useState(false);
  const [hoveredRW, setHoveredRW] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [kategoriOpen, setKategoriOpen] = useState(false);





  const [currentPage, setCurrentPage] = useState(1);





  const [errorMessage, setErrorMessage] = useState("");





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





  useEffect(() => {
    loadKesejahteraan();
  }, []);





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

      const cocokRT =
        !selectedRT ||
        String(item.rt).padStart(2, "0") === selectedRT;

      const cocokStatus =
        !status ||
        item.status === status;

      const cocokKategori =
        !kategori ||
        item.kategori === kategori;

      return (
        cocokSearch &&
        cocokWilayah &&
        cocokRT &&
        cocokStatus &&
        cocokKategori
      );
    });
  }, [
    dataKesejahteraan,
    search,
    wilayah,
    selectedRT,
    status,
    kategori,
  ]);





  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / 5)
  );

  const currentData = filteredData.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );





  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);





  const selectWilayah = (value, rt = "") => {
    setWilayah(value);
    setSelectedRT(rt);
    setWilayahOpen(false);
    setHoveredRW(null);
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





  return (
    <div className="kesejahteraan-page">





      <SideBar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />





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





      <main className="kesejahteraan-main">





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





        <section className="kesejahteraan-stats">



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





        <section className="kesejahteraan-rekap">

          <div className="kesejahteraan-rekap-title">
            <h2>
              Rekap Kesejahteraan
            </h2>
          </div>

          <div className="kesejahteraan-chart-wrapper">





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





        <section className="kesejahteraan-list-card">





          <div className="kesejahteraan-list-header">

            <h2>
              Daftar Kesejahteraan
            </h2>

            <div className="kesejahteraan-filter">

              <span>Filter</span>





              <div className="wilayah-dropdown">

                <button
                  type="button"
                  className="filter-button"
                  onClick={() => {

                    setWilayahOpen((previous) => !previous);

                    setStatusOpen(false);

                    setKategoriOpen(false);

                  }}
                >

                  {wilayah
                    ? `RW ${wilayah}`
                    : "Wilayah"}

                  <span className="dropdown-arrow">▼</span>

                </button>

                {wilayahOpen && (
                  <div className="wilayah-menu">

                    <div
                      className="wilayah-item"
                      onMouseEnter={() => setHoveredRW(null)}
                      onClick={() => selectWilayah("")}
                    >
                      <span>Semua Wilayah</span>
                    </div>

                    {Object.keys(wilayahOptions)
                      .sort((left, right) => Number(left) - Number(right))
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
                              {wilayahOptions[rw].map((rt) => (
                                <div
                                  key={rt}
                                  className="rt-item"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    selectWilayah(rw, rt);
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



                        <td>
                          {
                            (currentPage -
                              1) *
                              5 +
                              index +
                              1
                          }
                        </td>



                        <td>
                          {item.nama}
                        </td>



                        <td>
                          {item.nik}
                        </td>



                        <td>
                          {item.kategori}
                        </td>



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



                        <td>
                          {item.rt}
                        </td>



                        <td>
                          {item.rw}
                        </td>



                        <td className="keterangan-cell">
                          {item.keterangan}
                        </td>



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