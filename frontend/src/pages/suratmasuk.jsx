import { useState } from "react";
import { useNavigate } from "react-router-dom";
import smartDocIcon from "../assets/smartdoc.png";
import SideBar from "./sidebarmenu";
import Header from "./header";

function SuratMasuk() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jenis, setJenis] = useState("");

  const [tanggalOpen, setTanggalOpen] = useState(false);
  const [jenisOpen, setJenisOpen] = useState(false);

  const [openAction, setOpenAction] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const itemsPerPage = 5;

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /* =========================================================
     DATA SURAT MASUK
  ========================================================= */

  const dataSurat = [
    {
      no: "001",
      nomorSurat: "005/145/Kec.Sby/2026",
      tanggal: "10/09/2026",
      asalSurat: "Kecamatan Sukolilo",
      asalDetail: "Sekretariat Camat",
      tujuan: "Lurah Manukan Kulon",
      jenis: "Undangan Dinas",
      keterangan:
        "Rakor Pemantapan diskusi dan evaluasi bersama lintas kelurahan",
    },

    {
      no: "002",
      nomorSurat: "470/098/DKPS/2025",
      tanggal: "02/01/2025",
      asalSurat: "Dinas Kependudukan",
      asalDetail: "Bid. Pelayanan & Pendaftaran",
      tujuan: "Sekretaris Kelurahan",
      jenis: "Undangan Dinas",
      keterangan: "Alokasi KTP elektronik",
    },

    {
      no: "003",
      nomorSurat: "021/RT04/RW06/2025",
      tanggal: "20/05/2025",
      asalSurat: "Ketua RW 05",
      asalDetail: "Lingkungan Kebonsari",
      tujuan: "Sekretaris Kelurahan",
      jenis: "Permohonan",
      keterangan:
        "Permohonan Bantuan Perbaikan surau lapangan",
    },

    {
      no: "004",
      nomorSurat: "800/12/PUSKES/2023",
      tanggal: "11/08/2023",
      asalSurat: "Puskesmas Manukan",
      asalDetail: "Unit Kesehatan",
      tujuan: "Kepala Posyandu",
      jenis: "Laporan",
      keterangan:
        "Laporan Kasus Demam Berdarah penting: segera menjadwalkan fogging",
    },

    {
      no: "005",
      nomorSurat: "025/RT15/RW16/2022",
      tanggal: "09/09/2022",
      asalSurat: "Ketua RW 16",
      asalDetail: "Komp. Sari Asih",
      tujuan: "Sekretaris Kelurahan",
      jenis: "Laporan",
      keterangan: "Laporan Pengolahan Bank Sampah",
    },
  ];

  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  const tanggalOptions = Array.from(
    { length: 31 },
    (_, index) =>
      String(index + 1).padStart(2, "0")
  );

  const jenisOptions = [
    "Undangan Dinas",
    "Permohonan",
    "Pemberitahuan",
    "Laporan",
    "Undangan Rapat",
    "Rekomendasi",
    "Pengantar",
    "Surat Keterangan Usaha",
  ];

  /* =========================================================
     FILTER DATA
  ========================================================= */

  const filteredData = dataSurat.filter((item) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      item.no.toLowerCase().includes(keyword) ||
      item.nomorSurat.toLowerCase().includes(keyword) ||
      item.tanggal.toLowerCase().includes(keyword) ||
      item.asalSurat.toLowerCase().includes(keyword) ||
      item.asalDetail.toLowerCase().includes(keyword) ||
      item.tujuan.toLowerCase().includes(keyword) ||
      item.jenis.toLowerCase().includes(keyword) ||
      item.keterangan.toLowerCase().includes(keyword);

    const tanggalItem = item.tanggal.split("/")[0];

    const matchesTanggal =
      tanggal === "" ||
      tanggalItem === tanggal;

    const matchesJenis =
      jenis === "" ||
      item.jenis === jenis;

    return (
      matchesSearch &&
      matchesTanggal &&
      matchesJenis
    );
  });

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length / itemsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    itemsPerPage;

  const currentData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* =========================================================
     FILTER TANGGAL
  ========================================================= */

  const changeTanggal = (value) => {
    setTanggal(value);
    setTanggalOpen(false);
    setJenisOpen(false);
    setCurrentPage(1);
  };

  /* =========================================================
     FILTER JENIS
  ========================================================= */

  const changeJenis = (value) => {
    setJenis(value);
    setJenisOpen(false);
    setTanggalOpen(false);
    setCurrentPage(1);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (item) => {
    setOpenAction(null);

    navigate(
      `/surat-masuk/${item.no}/edit`,
      {
        state: {
          surat: item,
        },
      }
    );
  };

  /* =========================================================
     HAPUS
  ========================================================= */

  const handleDelete = (item) => {
    setOpenAction(null);

    const yakin = window.confirm(
      `Apakah Anda yakin ingin menghapus surat masuk berikut?

No Urut : ${item.no}
Nomor Surat : ${item.nomorSurat}
Tanggal : ${item.tanggal}
Asal Surat : ${item.asalSurat}
Tujuan : ${item.tujuan}
Jenis : ${item.jenis}
Keterangan : ${item.keterangan}`
    );

    if (!yakin) {
      return;
    }

    const index = dataSurat.findIndex(
      (surat) => surat.no === item.no
    );

    if (index !== -1) {
      dataSurat.splice(index, 1);
    }

    const newTotalPages = Math.max(
      1,
      Math.ceil(
        dataSurat.length / itemsPerPage
      )
    );

    setCurrentPage((page) =>
      Math.min(page, newTotalPages)
    );
  };

  /* =========================================================
     TOGGLE ACTION
  ========================================================= */

  const toggleAction = (no) => {
    setOpenAction((prev) =>
      prev === no ? null : no
    );

    setTanggalOpen(false);
    setJenisOpen(false);
  };

  return (
    <div className="surat-masuk-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="surat-masuk-main">

        {/* HEADER */}

        <Header
          title="Surat Masuk"
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

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="surat-masuk-content">

          {/* =================================================
              TOP ACTION
          ================================================= */}

          <div className="surat-masuk-top-action">

            <div className="surat-masuk-top-buttons">

              {/* SMART DOCUMENT */}

              <button
                type="button"
                className="saw-smart-button"
                onClick={() => navigate("/smart-document")}
              >
                <img className="saw-button-icon-img" src={smartDocIcon} alt="" />
                Smart Document
              </button>

              {/* TAMBAH SURAT */}

              <button
                type="button"
                className="add-surat-button"
                onClick={() =>
                  navigate(
                    "/surat-masuk/tambah"
                  )
                }
              >
                <span className="add-surat-icon">
                  +
                </span>

                <span>
                  Tambah Surat
                </span>
              </button>

            </div>

          </div>

          {/* =================================================
              TABLE CARD
          ================================================= */}

          <div className="surat-masuk-table-card">

            {/* =================================================
                TABLE TOP
            ================================================= */}

            <div className="table-top">

              <h2>
                Daftar Surat Masuk
              </h2>

              {/* =================================================
                  FILTER
              ================================================= */}

              <div className="filter-wrapper">

                <span className="filter-label">
                  Filter
                </span>

                {/* TANGGAL */}

                <div className="simple-dropdown">

                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => {
                      setTanggalOpen(
                        (prev) => !prev
                      );

                      setJenisOpen(false);
                    }}
                  >
                    {tanggal
                      ? `Tanggal ${tanggal}`
                      : "Semua Tanggal"}

                    <span className="dropdown-arrow">
                      ▼
                    </span>
                  </button>

                  {tanggalOpen && (
                    <div className="simple-menu surat-masuk-tanggal-menu">

                      <button
                        type="button"
                        className="simple-item"
                        onClick={() =>
                          changeTanggal("")
                        }
                      >
                        Semua Tanggal
                      </button>

                      {tanggalOptions.map(
                        (item) => (
                          <button
                            type="button"
                            className="simple-item"
                            key={item}
                            onClick={() =>
                              changeTanggal(item)
                            }
                          >
                            Tanggal {item}
                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>

                {/* JENIS */}

                <div className="simple-dropdown">

                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => {
                      setJenisOpen(
                        (prev) => !prev
                      );

                      setTanggalOpen(false);
                    }}
                  >
                    {jenis || "Semua Jenis"}

                    <span className="dropdown-arrow">
                      ▼
                    </span>
                  </button>

                  {jenisOpen && (
                    <div className="simple-menu surat-masuk-jenis-menu">

                      <button
                        type="button"
                        className="simple-item"
                        onClick={() =>
                          changeJenis("")
                        }
                      >
                        Semua Jenis
                      </button>

                      {jenisOptions.map(
                        (item) => (
                          <button
                            type="button"
                            className="simple-item"
                            key={item}
                            onClick={() =>
                              changeJenis(item)
                            }
                          >
                            {item}
                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="table-scroll">

              <table className="surat-masuk-table">

                <thead>

                  <tr>
                    <th>No Urut</th>
                    <th>Nomor Surat</th>
                    <th>Tanggal</th>
                    <th>Asal Surat</th>
                    <th>Tujuan</th>
                    <th>Jenis</th>
                    <th>Keterangan</th>
                    <th>Aksi</th>
                  </tr>

                </thead>

                <tbody>

                  {currentData.length > 0 ? (

                    currentData.map((item) => (

                      <tr key={item.no}>

                        {/* NO */}

                        <td className="surat-masuk-no">
                          {item.no}
                        </td>

                        {/* NOMOR SURAT */}

                        <td className="surat-masuk-nomor">
                          {item.nomorSurat}
                        </td>

                        {/* TANGGAL */}

                        <td className="surat-masuk-tanggal">

                          <div className="surat-masuk-date">
                            {item.tanggal}
                          </div>

                        </td>

                        {/* ASAL */}

                        <td className="surat-masuk-asal">

                          <div className="surat-masuk-main-text">
                            {item.asalSurat}
                          </div>

                          <div className="surat-masuk-secondary-text">
                            {item.asalDetail}
                          </div>

                        </td>

                        {/* TUJUAN */}

                        <td className="surat-masuk-tujuan">
                          {item.tujuan}
                        </td>

                        {/* JENIS */}

                        <td className="surat-masuk-jenis">

                          <span
                            className={`surat-masuk-jenis-badge ${
                              item.jenis ===
                              "Undangan Dinas"
                                ? "jenis-undangan-dinas"
                                : item.jenis ===
                                  "Permohonan"
                                ? "jenis-permohonan"
                                : item.jenis ===
                                  "Pemberitahuan"
                                ? "jenis-pemberitahuan"
                                : item.jenis ===
                                  "Laporan"
                                ? "jenis-laporan"
                                : item.jenis ===
                                  "Undangan Rapat"
                                ? "jenis-undangan-rapat"
                                : item.jenis ===
                                  "Rekomendasi"
                                ? "jenis-rekomendasi"
                                : item.jenis ===
                                  "Pengantar"
                                ? "jenis-pengantar"
                                : "jenis-surat-keterangan-usaha"
                            }`}
                          >
                            {item.jenis}
                          </span>

                        </td>

                        {/* KETERANGAN */}

                        <td className="surat-masuk-keterangan">

                          <div className="surat-masuk-main-text">
                            {item.keterangan}
                          </div>

                        </td>

                        {/* AKSI */}

                        <td className="surat-masuk-aksi">

                          <div className="surat-masuk-action-wrapper">

                            <button
                              type="button"
                              className="surat-masuk-action-button"
                              onClick={() =>
                                toggleAction(
                                  item.no
                                )
                              }
                              aria-label={`Aksi surat ${item.no}`}
                            >
                              ⋮
                            </button>

                            {openAction ===
                              item.no && (

                              <div className="surat-masuk-action-menu">

                                <button
                                  type="button"
                                  className="surat-masuk-edit-action"
                                  onClick={() =>
                                    handleEdit(item)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="surat-masuk-delete-action"
                                  onClick={() =>
                                    handleDelete(
                                      item
                                    )
                                  }
                                >
                                  Hapus
                                </button>

                              </div>

                            )}

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="8"
                        className="surat-masuk-empty"
                      >
                        Data surat masuk tidak ditemukan.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="table-footer">

              <p>

                Menampilkan{" "}

                <strong>
                  {filteredData.length === 0
                    ? "0"
                    : `${startIndex + 1}-${Math.min(
                        startIndex +
                          itemsPerPage,
                        filteredData.length
                      )}`}
                </strong>{" "}

                dari{" "}

                <strong>
                  {filteredData.length}
                </strong>{" "}

                Surat Masuk

              </p>

              {/* PAGINATION */}

              <div className="pagination">

                <button
                  type="button"
                  className="page-prev"
                  disabled={
                    safeCurrentPage === 1
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
                  <span>←</span>

                  <span>
                    Sebelumnya
                  </span>
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                )
                  .slice(0, 3)
                  .map((page) => (

                    <button
                      type="button"
                      key={page}
                      className={
                        safeCurrentPage ===
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

                  ))}

                <button
                  type="button"
                  className="page-next"
                  disabled={
                    safeCurrentPage ===
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
                  </span>

                  <span>→</span>
                </button>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default SuratMasuk;