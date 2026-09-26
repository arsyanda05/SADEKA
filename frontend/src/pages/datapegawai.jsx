import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SideBar from "./sidebarmenu";
import DetailPegawai from "./detailpegawai";
import Header from "./header";

import pegawaiIcon from "../assets/pegawai.png";
import asnIcon from "../assets/asn.png";
import pppkIcon from "../assets/p3k.png";

import {
  getPegawai,
  deletePegawai,
} from "../services/api";

function DataPegawai() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [dataPegawai, setDataPegawai] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [statusOpen, setStatusOpen] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  const [selectedPegawai, setSelectedPegawai] =
    useState(null);

  const navigate = useNavigate();

  // ============================================================
  // AMBIL DATA PEGAWAI
  // ============================================================

  const loadPegawai = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const result =
        await getPegawai();

      const data =
        Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : [];

      setDataPegawai(data);
    } catch (error) {
      console.error(
        "Error mengambil data pegawai:",
        error
      );

      setErrorMessage(
        error.message ||
          "Gagal mengambil data pegawai"
      );

      setDataPegawai([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPegawai();
  }, []);

  // ============================================================
  // SIDEBAR
  // ============================================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // ============================================================
  // FILTER DATA
  // ============================================================

  const filteredData = useMemo(() => {
    const keyword =
      search.toLowerCase().trim();

    return dataPegawai.filter((item) => {
      const id = String(
        item.id_pegawai ?? ""
      );

      const nama = String(
        item.nama ?? ""
      );

      const nip = String(
        item.NIP ?? ""
      );

      const jabatan = String(
        item.jabatan ?? ""
      );

      const statusPegawai = String(
        item.status ?? ""
      );

      const telepon = String(
        item.no_telepon ?? ""
      );

      const emailDinas = String(
        item.email_pemerintahan ?? ""
      );

      const emailPribadi = String(
        item.email_pribadi ?? ""
      );

      const alamat = String(
        item.alamat_domisili ?? ""
      );

      const matchesSearch =
        keyword === "" ||
        id.toLowerCase().includes(keyword) ||
        nama.toLowerCase().includes(keyword) ||
        nip.toLowerCase().includes(keyword) ||
        jabatan.toLowerCase().includes(keyword) ||
        statusPegawai.toLowerCase().includes(keyword) ||
        telepon.toLowerCase().includes(keyword) ||
        emailDinas.toLowerCase().includes(keyword) ||
        emailPribadi.toLowerCase().includes(keyword) ||
        alamat.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "" ||
        statusPegawai === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    dataPegawai,
    search,
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
      startIndex + itemsPerPage
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

  const totalPegawai =
    dataPegawai.length;

  const totalASN =
    dataPegawai.filter(
      (item) =>
        item.status === "ASN"
    ).length;

  const totalPPPK =
    dataPegawai.filter(
      (item) =>
        item.status === "PPPK"
    ).length;

  // ============================================================
  // NOMOR URUT
  // ============================================================

  const getNomorUrut = (index) => {
    return (
      (currentPage - 1) *
        itemsPerPage +
      index +
      1
    );
  };

  // ============================================================
  // DELETE PEGAWAI
  // ============================================================

  const handleDeletePegawai =
    async (pegawai) => {
      const id =
        pegawai?.id_pegawai;

      if (!id) {
        alert(
          "ID pegawai tidak ditemukan."
        );
        return;
      }

      const confirmed =
        window.confirm(
          `Apakah Anda yakin ingin menghapus data pegawai ${
            pegawai.nama || ""
          }?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        await deletePegawai(id);

        setSelectedPegawai(null);

        await loadPegawai();

        setCurrentPage(1);

        alert(
          "Data pegawai berhasil dihapus."
        );
      } catch (error) {
        console.error(
          "Error menghapus data pegawai:",
          error
        );

        setErrorMessage(
          error.message ||
            "Gagal menghapus data pegawai."
        );

        alert(
          error.message ||
            "Gagal menghapus data pegawai."
        );
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="infrastruktur-page data-pegawai-page">

      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <main className="infrastruktur-main">

        <Header
          title="Data Pegawai"
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
              (previous) =>
                !previous
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
                  "/data-pegawai/tambah"
                )
              }
            >
              <span>+</span>
              Tambah Pegawai
            </button>

          </div>

          {/* ================================================== */}
          {/* STATISTIK */}
          {/* ================================================== */}

          <div className="infrastructure-stats pegawai-stats">

            <StatCard
              icon={
                <img
                  src={pegawaiIcon}
                  alt=""
                />
              }
              title="Pegawai"
              value={totalPegawai}
              label="Total Pegawai"
            />

            <StatCard
              icon={
                <img
                  src={asnIcon}
                  alt=""
                />
              }
              title="ASN"
              value={totalASN}
              label="Total ASN"
            />

            <StatCard
              icon={
                <img
                  src={pppkIcon}
                  alt=""
                />
              }
              title="PPPK"
              value={totalPPPK}
              label="Total PPPK"
            />

          </div>

          {/* ================================================== */}
          {/* TABLE CARD */}
          {/* ================================================== */}

          <div className="infrastructure-table-card pegawai-table-card">

            <div className="table-top">

              <h2>
                Daftar Pegawai
              </h2>

              <div className="filter-wrapper">

                <span className="filter-label">
                  Filter
                </span>

                <div className="simple-dropdown">

                  <button
                    type="button"
                    className="filter-button"
                    onClick={() =>
                      setStatusOpen(
                        (previous) =>
                          !previous
                      )
                    }
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
                          setStatus("");
                          setStatusOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        Semua Status
                      </div>

                      <div
                        className="simple-item"
                        onClick={() => {
                          setStatus("ASN");
                          setStatusOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        ASN
                      </div>

                      <div
                        className="simple-item"
                        onClick={() => {
                          setStatus("PPPK");
                          setStatusOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        PPPK
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* ================================================== */}
            {/* TABLE */}
            {/* ================================================== */}

            <div className="table-scroll">

              <table className="infrastructure-table pegawai-table">

                <thead>

                  <tr>

                    <th>
                      No
                    </th>

                    <th>
                      Pegawai
                      <br />
                      & NIP
                    </th>

                    <th>
                      Jabatan
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Nomor
                      <br />
                      Telepon
                    </th>

                    <th>
                      Email Dinas
                    </th>

                    <th>
                      Domisili
                    </th>

                    <th>
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (
                    <tr>

                      <td
                        colSpan="8"
                        className="empty-table"
                      >
                        Memuat data
                        pegawai...
                      </td>

                    </tr>

                  ) : errorMessage ? (
                    <tr>

                      <td
                        colSpan="8"
                        className="empty-table"
                      >
                        {errorMessage}
                      </td>

                    </tr>

                  ) : paginatedData.length > 0 ? (
                    paginatedData.map(
                      (
                        item,
                        index
                      ) => (

                        <tr
                          key={
                            item.id_pegawai
                          }
                        >

                          <td>
                            {getNomorUrut(
                              index
                            )}
                          </td>

                          <td>

                            <div className="pegawai-identity">

                              <div className="pegawai-name">
                                {item.nama}
                              </div>

                              <div className="pegawai-nip">
                                NIP:{" "}
                                {item.NIP}
                              </div>

                            </div>

                          </td>

                          <td>
                            {item.jabatan}
                          </td>

                          <td>

                            <span
                              className={`condition condition-${String(
                                item.status ?? ""
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {item.status}
                            </span>

                          </td>

                          <td>
                            {item.no_telepon}
                          </td>

                          <td className="address-cell">
                            {
                              item.email_pemerintahan
                            }
                          </td>

                          <td className="address-cell">
                            {
                              item.alamat_domisili
                            }
                          </td>

                          <td>

                            <button
                              type="button"
                              className="action-button"
                              aria-label={`Aksi ${item.id_pegawai}`}
                              onClick={() =>
                                setSelectedPegawai(
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

                  ) : (
                    <tr>

                      <td
                        colSpan="8"
                        className="empty-table"
                      >
                        Data pegawai
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
                  {filteredData.length === 0
                    ? "0"
                    : `${
                        (currentPage - 1) *
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

                Pegawai

              </p>

              <div className="pagination">

                <button
                  type="button"
                  className="page-prev"
                  disabled={
                    currentPage === 1
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
      {/* DETAIL PEGAWAI */}
      {/* ================================================== */}

      {selectedPegawai && (
        <DetailPegawai
          data={selectedPegawai}
          onClose={() =>
            setSelectedPegawai(null)
          }
          onEdit={() => {
            setSelectedPegawai(null);

            navigate(
              `/data-pegawai/${selectedPegawai.id_pegawai}/edit`,
              {
                state: {
                  pegawai:
                    selectedPegawai,
                },
              }
            );
          }}
          onDelete={
            handleDeletePegawai
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
    <div className="infrastructure-stat-card pegawai-stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">

        <h3>
          {title}
        </h3>

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

export default DataPegawai;