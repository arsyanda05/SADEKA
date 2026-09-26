import { useEffect, useMemo, useState } from "react";
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

import {
  getUMKM,
  deleteUMKM,
} from "../services/api";


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
   DONUT CHART
========================================================= */

function DonutChart({ data }) {
  const colors = [
    "#8674f5",
    "#236bcf",
    "#3db8d3",
    "#0c3c73",
    "#6c8cd5",
    "#4a9eaf",
    "#8b6fc7",
    "#5c7fb8",
  ];

  const total = data.reduce(
    (totalData, item) =>
      totalData + item.value,
    0
  );

  const renderInsideLabel = ({
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
      (outerRadius - innerRadius) *
        0.5;

    const x =
      cx + radius * Math.cos(angle);

    const y =
      cy + radius * Math.sin(angle);

    /*
     * Jangan tampilkan persentase
     * jika bagian grafik terlalu kecil.
     */
    if (percent < 0.05) {
      return null;
    }

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

        {data.length === 0 ? (
          <div className="umkm-empty-chart">
            Belum ada data UMKM
          </div>
        ) : (
          <>
            <ResponsiveContainer
              width="100%"
              height={370}
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={92}
                  outerRadius={158}
                  paddingAngle={1}
                  label={renderInsideLabel}
                  labelLine={false}
                >
                  {data.map(
                    (segment, index) => (
                      <Cell
                        key={segment.label}
                        fill={
                          colors[
                            index %
                              colors.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  formatter={(
                    value,
                    name
                  ) => [value, name]}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "10px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="umkm-donut-total">
              {total}
            </div>
          </>
        )}

      </div>
    </div>
  );
}


/* =========================================================
   BAR CHART
========================================================= */

function WilayahChart({ data }) {
  return (
    <div className="wilayah-chart">

      {data.length === 0 ? (
        <div className="umkm-empty-chart">
          Belum ada data UMKM
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={420}
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 15,
              left: 5,
              bottom: 45,
            }}
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
              allowDecimals={false}
            />

            <Tooltip
              formatter={(value) => [
                value,
                "Jumlah UMKM",
              ]}
            />

            <Legend
              wrapperStyle={{
                fontSize: "10px",
              }}
            />

            <Bar
              dataKey="value"
              name="Jumlah UMKM"
              fill="#236bcf"
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}


/* =========================================================
   MAIN
========================================================= */

function UMKM() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  /*
   * DATA DARI DATABASE
   */
  const [dataUMKM, setDataUMKM] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  /*
   * FILTER
   */
  const [search, setSearch] =
    useState("");

  const [jenisUsaha, setJenisUsaha] =
    useState("");

  const [wilayah, setWilayah] =
    useState("");

  const [selectedRT, setSelectedRT] =
    useState("");

  /*
   * DETAIL
   */
  const [selectedUMKM, setSelectedUMKM] =
    useState(null);

  /*
   * DROPDOWN
   */
  const [jenisOpen, setJenisOpen] =
    useState(false);

  const [wilayahOpen, setWilayahOpen] =
    useState(false);

  const [hoveredRW, setHoveredRW] =
    useState(null);


  /* =======================================================
     DATA WILAYAH
  ======================================================= */

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


  /* =======================================================
     LOAD DATA UMKM
  ======================================================= */

  const loadUMKM = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getUMKM();

      setDataUMKM(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Gagal mengambil data UMKM:",
        error
      );

      setErrorMessage(
        error.message ||
          "Gagal mengambil data UMKM"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadUMKM();
  }, []);


  /* =======================================================
     DATA JENIS USAHA
  ======================================================= */

  const jenisUsahaOptions =
    useMemo(() => {
      const jenis = dataUMKM
        .map(
          (item) =>
            item.jenis_usaha
        )
        .filter(Boolean);

      return [
        ...new Set(jenis),
      ].sort();
    }, [dataUMKM]);


  /* =======================================================
     FILTER DATA
  ======================================================= */

  const filteredData = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return dataUMKM.filter((item) => {
      const namaUsaha =
        String(
          item.nama_usaha || ""
        ).toLowerCase();

      const pemilik =
        String(
          item.pemilik || ""
        ).toLowerCase();

      const jenis =
        String(
          item.jenis_usaha || ""
        ).toLowerCase();

      const nib =
        String(
          item.nib || ""
        ).toLowerCase();

      const matchSearch =
        !keyword ||
        namaUsaha.includes(keyword) ||
        pemilik.includes(keyword) ||
        jenis.includes(keyword) ||
        nib.includes(keyword);

      const matchJenis =
        !jenisUsaha ||
        item.jenis_usaha ===
          jenisUsaha;

      const matchWilayah =
        !wilayah ||
        String(item.rw || "") ===
          wilayah;

      const matchRT =
        !selectedRT ||
        String(item.rt || "") ===
          selectedRT;

      return (
        matchSearch &&
        matchJenis &&
        matchWilayah &&
        matchRT
      );
    });
  }, [
    dataUMKM,
    search,
    jenisUsaha,
    wilayah,
    selectedRT,
  ]);


  /* =======================================================
     STATISTIK
  ======================================================= */

  const totalUMKM =
    dataUMKM.length;

  const totalNIB =
    dataUMKM.filter(
      (item) =>
        String(item.nib || "").trim()
          .length > 0
    ).length;

  const totalJenisUsaha =
    new Set(
      dataUMKM
        .map(
          (item) =>
            item.jenis_usaha
        )
        .filter(Boolean)
    ).size;


  /* =======================================================
     DATA DONUT
  ======================================================= */

  const jenisUsahaChart =
    useMemo(() => {
      const counter = {};

      dataUMKM.forEach((item) => {
        const jenis =
          item.jenis_usaha ||
          "Tidak diketahui";

        counter[jenis] =
          (counter[jenis] || 0) + 1;
      });

      return Object.entries(
        counter
      ).map(
        ([label, value]) => ({
          label,
          value,
        })
      );
    }, [dataUMKM]);


  /* =======================================================
     DATA BAR CHART WILAYAH
  ======================================================= */

  const wilayahChart =
    useMemo(() => {
      const counter = {};

      dataUMKM.forEach((item) => {
        const rw = String(
          item.rw || ""
        ).padStart(2, "0");

        if (!rw) {
          return;
        }

        counter[rw] =
          (counter[rw] || 0) + 1;
      });

      return Object.keys(wilayahData)
        .sort(
          (a, b) =>
            Number(a) - Number(b)
        )
        .map((rw) => ({
          rw: `RW ${rw}`,
          value: counter[rw] || 0,
        }));
    }, [dataUMKM]);


  /* =======================================================
     DELETE
  ======================================================= */

  const handleDeleteUMKM = async (data) => {
    const id = data?.id_umkm;

    if (!id) {
      console.error(
        "ID UMKM tidak ditemukan:",
        data
      );

      return;
    }

    const yakin = window.confirm(
      `Apakah Anda yakin ingin menghapus data UMKM ${data.nama_usaha}?`
    );

    if (!yakin) {
      return;
    }

    try {
      setLoading(true);

      await deleteUMKM(id);

      setSelectedUMKM(null);

      await loadUMKM();
    } catch (error) {
      console.error(
        "Gagal menghapus data UMKM:",
        error
      );

      window.alert(
        error.message ||
          "Gagal menghapus data UMKM"
      );

      setLoading(false);
    }
  };


  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="umkm-page">

      <SideBar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <Header
        title="UMKM"
        showSearch={true}
        searchValue={search}
        onSearchChange={(e) =>
          setSearch(e.target.value)
        }
        onMenuClick={() =>
          setSidebarOpen(
            (prev) => !prev
          )
        }
      />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="umkm-main">


        {/* =================================================
            TAMBAH UMKM
        ================================================= */}

        <div className="umkm-add-wrapper">

          <button
            type="button"
            className="umkm-add-button"
            onClick={() =>
              navigate(
                "/umkm/tambah"
              )
            }
          >
            <span>+</span>
            Tambah UMKM
          </button>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="umkm-statistics">


          {/* TOTAL UMKM */}

          <div className="umkm-stat-card">

            <div className="umkm-stat-icon">
              <img
                src={umkm1Icon}
                alt=""
              />
            </div>

            <div className="umkm-stat-content">

              <h2>UMKM</h2>

              <strong>
                {loading
                  ? "..."
                  : totalUMKM}
              </strong>

              <span>
                Total UMKM
              </span>

            </div>

          </div>


          {/* TOTAL NIB */}

          <div className="umkm-stat-card">

            <div className="umkm-stat-icon">
              <img
                src={umkm2Icon}
                alt=""
              />
            </div>

            <div className="umkm-stat-content">

              <h2>NIB</h2>

              <strong>
                {loading
                  ? "..."
                  : totalNIB}
              </strong>

              <span>
                Total Usaha yang
                <br />
                Memiliki NIB
              </span>

            </div>

          </div>


          {/* TOTAL JENIS */}

          <div className="umkm-stat-card">

            <div className="umkm-stat-icon">
              <img
                src={umkm3Icon}
                alt=""
              />
            </div>

            <div className="umkm-stat-content">

              <h2>Jenis</h2>

              <strong>
                {loading
                  ? "..."
                  : totalJenisUsaha}
              </strong>

              <span>
                Total Jenis Usaha
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            REKAP UMKM
        ================================================= */}

        <section className="umkm-rekap">

          <div className="umkm-section-title">
            <h2>
              Rekap UMKM
            </h2>
          </div>


          <div className="umkm-rekap-content">


            {/* JENIS USAHA */}

            <div className="umkm-chart-column">

              <h3>
                Jenis Usaha
              </h3>

              <DonutChart
                data={
                  jenisUsahaChart
                }
              />

            </div>


            {/* WILAYAH */}

            <div className="umkm-chart-column">

              <h3>
                Wilayah
              </h3>

              <WilayahChart
                data={
                  wilayahChart
                }
              />

            </div>

          </div>

        </section>


        {/* =================================================
            DAFTAR UMKM
        ================================================= */}

        <section className="umkm-list-card">


          <div className="umkm-list-header">

            <h2>
              Daftar UMKM
            </h2>


            <div className="umkm-filter-box">

              <span className="filter-label">
                Filter
              </span>


              {/* =================================================
                  JENIS USAHA
              ================================================= */}

              <div className="umkm-filter-dropdown">

                <button
                  type="button"
                  className="umkm-filter-button"
                  onClick={() => {
                    setJenisOpen(
                      !jenisOpen
                    );

                    setWilayahOpen(
                      false
                    );
                  }}
                >
                  {jenisUsaha ||
                    "Jenis Usaha"}

                  <ChevronDown />
                </button>


                {jenisOpen && (
                  <div className="umkm-dropdown-menu">

                    <button
                      type="button"
                      onClick={() => {
                        setJenisUsaha(
                          ""
                        );

                        setJenisOpen(
                          false
                        );
                      }}
                    >
                      Semua Jenis
                    </button>


                    {jenisUsahaOptions.map(
                      (jenis) => (
                        <button
                          key={jenis}
                          type="button"
                          onClick={() => {
                            setJenisUsaha(
                              jenis
                            );

                            setJenisOpen(
                              false
                            );
                          }}
                        >
                          {jenis}
                        </button>
                      )
                    )}

                  </div>
                )}

              </div>


              {/* =================================================
                  WILAYAH
              ================================================= */}

              <div className="umkm-filter-dropdown">

                <button
                  type="button"
                  className="umkm-filter-button"
                  onClick={() => {
                    setWilayahOpen(
                      !wilayahOpen
                    );

                    setJenisOpen(
                      false
                    );
                  }}
                >
                  {wilayah
                    ? `RW ${wilayah}`
                    : "Wilayah"}

                  <ChevronDown />
                </button>


                {wilayahOpen && (
                  <div className="umkm-dropdown-menu">

                    {/* SEMUA WILAYAH */}

                    <div
                      className="wilayah-item"
                      onMouseEnter={() =>
                        setHoveredRW(
                          null
                        )
                      }
                      onClick={() => {
                        setWilayah("");
                        setSelectedRT("");
                        setWilayahOpen(
                          false
                        );
                      }}
                    >
                      <span>
                        Semua Wilayah
                      </span>
                    </div>


                    {/* RW */}

                    {Object.keys(
                      wilayahData
                    )
                      .sort(
                        (a, b) =>
                          Number(a) -
                          Number(b)
                      )
                      .map((rw) => (
                        <div
                          key={rw}
                          className="wilayah-item"
                          onMouseEnter={() =>
                            setHoveredRW(
                              rw
                            )
                          }
                        >

                          <span>
                            RW {rw}
                          </span>

                          <span className="rw-arrow">
                            ›
                          </span>


                          {/* RT */}

                          {hoveredRW ===
                            rw && (
                            <div className="rt-menu">

                              {wilayahData[
                                rw
                              ].map(
                                (rt) => (
                                  <div
                                    key={rt}
                                    className="rt-item"
                                    onClick={(
                                      event
                                    ) => {
                                      event.stopPropagation();

                                      setWilayah(
                                        rw
                                      );

                                      setSelectedRT(
                                        rt
                                      );

                                      setWilayahOpen(
                                        false
                                      );
                                    }}
                                  >
                                    RT{" "}
                                    {rt}
                                  </div>
                                )
                              )}

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
              ERROR
          ================================================= */}

          {errorMessage && (
            <div className="umkm-error-message">
              {errorMessage}
            </div>
          )}


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

                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "30px",
                      }}
                    >
                      Memuat data UMKM...
                    </td>
                  </tr>
                ) : filteredData.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "30px",
                      }}
                    >
                      Tidak ada data UMKM
                    </td>
                  </tr>
                ) : (
                  filteredData.map(
                    (item, index) => (
                      <tr
                        key={
                          item.id_umkm
                        }
                        className="umkm-table-row-clickable"
                        onClick={() =>
                          setSelectedUMKM(
                            item
                          )
                        }
                      >

                        <td>
                          {String(
                            index + 1
                          ).padStart(
                            3,
                            "0"
                          )}
                        </td>

                        <td className="umkm-business-name">
                          {item.nama_usaha ||
                            "-"}
                        </td>

                        <td>
                          {item.pemilik ||
                            "-"}
                        </td>

                        <td>
                          {item.jenis_usaha ||
                            "-"}
                        </td>

                        <td>
                          {item.nib ||
                            "-"}
                        </td>

                        <td>
                          {item.rt ||
                            "-"}
                        </td>

                        <td>
                          {item.rw ||
                            "-"}
                        </td>

                        <td className="umkm-address">
                          {item.alamat ||
                            "-"}
                        </td>

                      </tr>
                    )
                  )
                )}

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
                {filteredData.length}
              </strong>{" "}

              dari{" "}

              <strong>
                {dataUMKM.length}
              </strong>{" "}

              UMKM

            </div>


            <div className="umkm-pagination">

              <button
                type="button"
                className="pagination-prev"
                disabled
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
                disabled
              >
                2
              </button>

              <button
                type="button"
                className="pagination-number"
                disabled
              >
                3
              </button>

              <button
                type="button"
                className="pagination-next"
                disabled
              >
                Selanjutnya →
              </button>

            </div>

          </div>

        </section>

      </main>


      {/* =================================================
          DETAIL UMKM
      ================================================= */}

      {selectedUMKM && (
        <DetailUMKM
          data={selectedUMKM}
          onClose={() =>
            setSelectedUMKM(null)
          }
          onDelete={
            handleDeleteUMKM
          }
        />
      )}

    </div>
  );
}

export default UMKM;