import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SideBar from "./sidebarmenu";
import DetailInfrastruktur from "./detailinfrastruktur";
import Header from "./header";

import inf1Icon from "../assets/inf1.png";
import inf2Icon from "../assets/inf2.png";
import inf3Icon from "../assets/inf3.png";
import inf4Icon from "../assets/inf4.png";

import {
  getInfrastruktur,
  deleteInfrastruktur,
} from "../services/api";

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

const kategoriOptions = [
  "PJU",
  "CCTV",
  "Saluran",
];

const statusOptions = [
  "Baik",
  "Rusak Ringan",
  "Rusak Berat",
];

function Infrastruktur() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // DATA
  // =========================
  const [dataInfrastruktur, setDataInfrastruktur] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  // =========================
  // SEARCH & FILTER
  // =========================
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [kategori, setKategori] =
    useState("");

  const [wilayah, setWilayah] =
    useState("");

  const [selectedRT, setSelectedRT] =
    useState("");

  const [wilayahOpen, setWilayahOpen] =
    useState(false);

  const [statusOpen, setStatusOpen] =
    useState(false);

  const [kategoriOpen, setKategoriOpen] =
    useState(false);

  const [hoveredRW, setHoveredRW] =
    useState(null);

  // =========================
  // PAGINATION
  // =========================
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  // =========================
  // DETAIL
  // =========================
  const [
    selectedInfrastructure,
    setSelectedInfrastructure,
  ] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

  // ============================================================
  // AMBIL DATA INFRASTRUKTUR
  // ============================================================

  const loadInfrastruktur = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const result =
        await getInfrastruktur();

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : [];

      setDataInfrastruktur(data);
    } catch (error) {
      console.error(
        "Error mengambil data infrastruktur:",
        error
      );

      setErrorMessage(
        error.message ||
          "Gagal mengambil data infrastruktur"
      );

      setDataInfrastruktur([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfrastruktur();
  }, []);

  // ============================================================
  // DETAIL BERDASARKAN URL
  // ============================================================

  useEffect(() => {
    if (!params.id) {
      return;
    }

    const selected =
      dataInfrastruktur.find(
        (item) =>
          String(
            item.id_infrastruktur
          ) === String(params.id)
      );

    setSelectedInfrastructure(
      selected ?? null
    );
  }, [
    params.id,
    dataInfrastruktur,
  ]);

  // ============================================================
  // SIDEBAR
  // ============================================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // ============================================================
  // DATA RW DAN RT
  // ============================================================

  // ============================================================
  // FILTER DATA
  // ============================================================

  const filteredData = useMemo(() => {
    const keyword =
      search.toLowerCase().trim();

    return dataInfrastruktur.filter(
      (item) => {
        const id = String(
          item.id_infrastruktur ?? ""
        );

        const jenis = String(
          item.jenis ?? ""
        );

        const kondisi = String(
          item.kondisi_status ?? ""
        );

        const pic = String(
          item.penanggung_jawab ?? ""
        );

        const telepon = String(
          item.no_telp ?? ""
        );

        const rt = String(
          item.rt ?? ""
        );

        const rw = String(
          item.rw ?? ""
        );

        const alamat = String(
          item.alamat ?? ""
        );

        const matchesSearch =
          keyword === "" ||
          id
            .toLowerCase()
            .includes(keyword) ||
          jenis
            .toLowerCase()
            .includes(keyword) ||
          kondisi
            .toLowerCase()
            .includes(keyword) ||
          pic
            .toLowerCase()
            .includes(keyword) ||
          telepon
            .toLowerCase()
            .includes(keyword) ||
          rt
            .toLowerCase()
            .includes(keyword) ||
          rw
            .toLowerCase()
            .includes(keyword) ||
          alamat
            .toLowerCase()
            .includes(keyword);

        const matchesWilayah =
          wilayah === "" ||
          rw === wilayah ||
          rw ===
            String(wilayah).padStart(
              2,
              "0"
            );

        const matchesRT =
          selectedRT === "" ||
          rt === selectedRT ||
          rt ===
            String(
              selectedRT
            ).padStart(2, "0");

        const matchesKategori =
          kategori === "" ||
          jenis === kategori;

        const matchesStatus =
          status === "" ||
          kondisi === status;

        return (
          matchesSearch &&
          matchesWilayah &&
          matchesRT &&
          matchesKategori &&
          matchesStatus
        );
      }
    );
  }, [
    dataInfrastruktur,
    search,
    wilayah,
    selectedRT,
    kategori,
    status,
  ]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length /
        itemsPerPage
    )
  );

  const paginatedData = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      itemsPerPage;

    return filteredData.slice(
      startIndex,
      startIndex +
        itemsPerPage
    );
  }, [
    filteredData,
    currentPage,
  ]);

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  // ============================================================
  // STATISTIK
  // ============================================================

  const totalInfrastruktur =
    dataInfrastruktur.length;

  const totalSaluran =
    dataInfrastruktur.filter(
      (item) =>
        item.jenis === "Saluran"
    ).length;

  const totalPJU =
    dataInfrastruktur.filter(
      (item) =>
        item.jenis === "PJU"
    ).length;

  const totalCCTV =
    dataInfrastruktur.filter(
      (item) =>
        item.jenis === "CCTV"
    ).length;

  // ============================================================
  // DELETE
  // ============================================================

  const handleDeleteInfrastruktur =
    async (data) => {
      const id =
        data?.id_infrastruktur;

      // Pastikan ID tersedia
      if (!id) {
        alert(
          "ID infrastruktur tidak ditemukan."
        );
        return;
      }

      // Konfirmasi sebelum hapus
      const confirmed =
        window.confirm(
          `Apakah Anda yakin ingin menghapus data ${data.jenis || "infrastruktur"}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        // Hapus dari database
        await deleteInfrastruktur(id);

        // Tutup detail
        setSelectedInfrastructure(
          null
        );

        // Reload data
        await loadInfrastruktur();

        // Jika data yang dihapus membuat
        // halaman sekarang kosong,
        // kembali ke halaman pertama
        setCurrentPage(1);

        alert(
          "Data infrastruktur berhasil dihapus."
        );
      } catch (error) {
        console.error(
          "Error menghapus infrastruktur:",
          error
        );

        setErrorMessage(
          error.message ||
            "Gagal menghapus data infrastruktur."
        );

        alert(
          error.message ||
            "Gagal menghapus data infrastruktur."
        );
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // FORMAT NOMOR URUT
  // ============================================================

  const getNomorUrut =
    (index) => {
      return (
        (currentPage - 1) *
          itemsPerPage +
        index +
        1
      );
    };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="infrastruktur-page">

      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* MAIN */}

      <main className="infrastruktur-main">

        <Header
          title="Infrastruktur"
          showSearch={true}
          searchValue={search}
          onSearchChange={(e) => {
            setSearch(
              e.target.value
            );
            setCurrentPage(1);
          }}
          onMenuClick={() =>
            setSidebarOpen(
              (prev) => !prev
            )
          }
        />

        <section className="infrastruktur-content">

          {/* ================================================== */}
          {/* TOMBOL TAMBAH */}
          {/* ================================================== */}

          <div className="top-action">

            <button
              type="button"
              className="add-infrastructure-button"
              onClick={() =>
                navigate(
                  "/infrastruktur/tambah"
                )
              }
            >
              <span>+</span>
              Tambah Infrastruktur
            </button>

          </div>

          {/* ================================================== */}
          {/* STATISTICS */}
          {/* ================================================== */}

          <div className="infrastructure-stats">

            <StatCard
              icon={
                <img
                  src={inf1Icon}
                  alt=""
                />
              }
              title="Infrastruktur"
              value={
                totalInfrastruktur
              }
              label="Total Infrastruktur"
            />

            <StatCard
              icon={
                <img
                  src={inf2Icon}
                  alt=""
                />
              }
              title="Saluran"
              value={totalSaluran}
              label="Total Saluran"
            />

            <StatCard
              icon={
                <img
                  src={inf3Icon}
                  alt=""
                />
              }
              title="PJU"
              value={totalPJU}
              label="Total PJU"
            />

            <StatCard
              icon={
                <img
                  src={inf4Icon}
                  alt=""
                />
              }
              title="CCTV"
              value={totalCCTV}
              label="Total CCTV"
            />

          </div>

          {/* ================================================== */}
          {/* TABLE CARD */}
          {/* ================================================== */}

          <div className="infrastructure-table-card">

            <div className="table-top">

              <h2>
                Daftar Infrastruktur
              </h2>

              <div className="filter-wrapper">

                <span className="filter-label">
                  Filter
                </span>

                {/* ================================================== */}
                {/* WILAYAH */}
                {/* ================================================== */}

                <div className="wilayah-dropdown">

                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => {
                      setWilayahOpen(
                        (prev) =>
                          !prev
                      );

                      setStatusOpen(
                        false
                      );

                      setKategoriOpen(
                        false
                      );
                    }}
                  >
                    {wilayah
                      ? `RW ${wilayah}`
                      : "Wilayah"}

                    <span className="dropdown-arrow">
                      ▼
                    </span>
                  </button>

                  {wilayahOpen && (
                    <div className="wilayah-menu">

                      <div
                        className="wilayah-item"
                        onMouseEnter={() =>
                          setHoveredRW(
                            null
                          )
                        }
                        onClick={() => {
                          setWilayah(
                            ""
                          );

                          setSelectedRT(
                            ""
                          );

                          setWilayahOpen(
                            false
                          );

                          setCurrentPage(
                            1
                          );
                        }}
                      >
                        <span>
                          Semua Wilayah
                        </span>
                      </div>

                      {Object.keys(
                        wilayahOptions
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

                            {hoveredRW ===
                              rw && (
                              <div className="rt-menu">

                                {wilayahOptions[
                                  rw
                                ].map(
                                  (rt) => (
                                    <div
                                      key={
                                        rt
                                      }
                                      className="rt-item"
                                      onClick={(
                                        e
                                      ) => {
                                        e.stopPropagation();

                                        setWilayah(
                                          rw
                                        );

                                        setSelectedRT(
                                          rt
                                        );

                                        setWilayahOpen(
                                          false
                                        );

                                        setCurrentPage(
                                          1
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

                {/* ================================================== */}
                {/* STATUS */}
                {/* ================================================== */}

                <div className="simple-dropdown">

                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => {
                      setStatusOpen(
                        (prev) =>
                          !prev
                      );

                      setWilayahOpen(
                        false
                      );

                      setKategoriOpen(
                        false
                      );
                    }}
                  >
                    {status ||
                      "Status"}

                    <span className="dropdown-arrow">
                      ▼
                    </span>
                  </button>

                  {statusOpen && (
                    <div className="simple-menu">

                      <div
                        className="simple-item"
                        onClick={() => {
                          setStatus(
                            ""
                          );

                          setStatusOpen(
                            false
                          );

                          setCurrentPage(
                            1
                          );
                        }}
                      >
                        Semua Status
                      </div>

                      {statusOptions.map(
                        (
                          statusItem
                        ) => (
                          <div
                            key={
                              statusItem
                            }
                            className="simple-item"
                            onClick={() => {
                              setStatus(
                                statusItem
                              );

                              setStatusOpen(
                                false
                              );

                              setCurrentPage(
                                1
                              );
                            }}
                          >
                            {
                              statusItem
                            }
                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>

                {/* ================================================== */}
                {/* KATEGORI */}
                {/* ================================================== */}

                <div className="simple-dropdown">

                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => {
                      setKategoriOpen(
                        (prev) =>
                          !prev
                      );

                      setWilayahOpen(
                        false
                      );

                      setStatusOpen(
                        false
                      );
                    }}
                  >
                    {kategori ||
                      "Kategori"}

                    <span className="dropdown-arrow">
                      ▼
                    </span>
                  </button>

                  {kategoriOpen && (
                    <div className="simple-menu">

                      <div
                        className="simple-item"
                        onClick={() => {
                          setKategori(
                            ""
                          );

                          setKategoriOpen(
                            false
                          );

                          setCurrentPage(
                            1
                          );
                        }}
                      >
                        Semua Kategori
                      </div>

                      {kategoriOptions.map(
                        (
                          kategoriItem
                        ) => (
                          <div
                            key={
                              kategoriItem
                            }
                            className="simple-item"
                            onClick={() => {
                              setKategori(
                                kategoriItem
                              );

                              setKategoriOpen(
                                false
                              );

                              setCurrentPage(
                                1
                              );
                            }}
                          >
                            {
                              kategoriItem
                            }
                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* ================================================== */}
            {/* TABLE */}
            {/* ================================================== */}

            <div className="table-scroll">

              <table className="infrastructure-table">

                <thead>
                  <tr>
                    <th>No</th>
                    <th>Jenis</th>
                    <th>Kondisi</th>
                    <th>PIC</th>
                    <th>
                      Nomor
                      <br />
                      Telepon
                    </th>
                    <th>RT</th>
                    <th>RW</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="empty-table"
                      >
                        Memuat data
                        infrastruktur...
                      </td>
                    </tr>
                  ) : errorMessage ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="empty-table"
                      >
                        {errorMessage}
                      </td>
                    </tr>
                  ) : paginatedData.length >
                    0 ? (
                    paginatedData.map(
                      (
                        item,
                        index
                      ) => {

                        const kondisi =
                          String(
                            item.kondisi_status ??
                              ""
                          );

                        const kondisiClass =
                          kondisi
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            );

                        return (
                          <tr
                            key={
                              item.id_infrastruktur
                            }
                          >

                            <td>
                              {getNomorUrut(
                                index
                              )}
                            </td>

                            <td>
                              {
                                item.jenis
                              }
                            </td>

                            <td>
                              <span
                                className={`condition condition-${kondisiClass}`}
                              >
                                {
                                  kondisi
                                }
                              </span>
                            </td>

                            <td>
                              {
                                item.penanggung_jawab
                              }
                            </td>

                            <td>
                              {
                                item.no_telp
                              }
                            </td>

                            <td>
                              {item.rt}
                            </td>

                            <td>
                              {item.rw}
                            </td>

                            <td className="address-cell">
                              {
                                item.alamat
                              }
                            </td>

                            <td>

                              <button
                                type="button"
                                className="action-button"
                                aria-label={`Aksi ${item.id_infrastruktur}`}
                                onClick={() =>
                                  setSelectedInfrastructure(
                                    item
                                  )
                                }
                              >
                                ⋮
                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="empty-table"
                      >
                        Data
                        infrastruktur
                        tidak
                        ditemukan.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

            {/* ================================================== */}
            {/* FOOTER */}
            {/* ================================================== */}

            <div className="table-footer">

              <p>
                Menampilkan{" "}
                <strong>
                  {filteredData.length ===
                  0
                    ? "0"
                    : `${
                        (currentPage -
                          1) *
                          itemsPerPage +
                        1
                      }-${
                        Math.min(
                          currentPage *
                            itemsPerPage,
                          filteredData.length
                        )
                      }`}
                </strong>{" "}
                dari{" "}
                <strong>
                  {
                    filteredData.length
                  }
                </strong>{" "}
                Infrastruktur
              </p>

              <div className="pagination">

                <button
                  type="button"
                  className="page-prev"
                  disabled={
                    currentPage ===
                    1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                >
                  ←{" "}
                  <span>
                    Sebelumnya
                  </span>
                </button>

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      className={
                        currentPage ===
                        page
                          ? "page-active"
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
                  )
                )}

                <button
                  type="button"
                  className="page-next"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                >
                  <span>
                    Selanjutnya
                  </span>{" "}
                  →
                </button>

              </div>

            </div>

          </div>
        </section>
      </main>

      {/* ================================================== */}
      {/* DETAIL INFRASTRUKTUR */}
      {/* ================================================== */}

      {selectedInfrastructure && (
        <DetailInfrastruktur
          data={
            selectedInfrastructure
          }
          onClose={() =>
            setSelectedInfrastructure(
              null
            )
          }
          onDelete={
            handleDeleteInfrastruktur
          }
        />
      )}

    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  icon,
  title,
  value,
  label,
}) {
  return (
    <div className="infrastructure-stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">

        <h3>{title}</h3>

        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

      </div>

    </div>
  );
}

export default Infrastruktur;