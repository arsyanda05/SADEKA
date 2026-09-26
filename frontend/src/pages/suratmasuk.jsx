import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSurat, deleteSurat } from "../services/api";

import smartDocIcon from "../assets/smartdoc.png";
import docIcon from "../assets/doc.png";
import SideBar from "./sidebarmenu";
import Header from "./header";

function SuratMasuk() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================================
  // DATA SURAT
  // =====================================================

  const [dataSurat, setDataSurat] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FILTER
  // =====================================================

  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jenis, setJenis] = useState("");

  const [tanggalOpen, setTanggalOpen] = useState(false);
  const [jenisOpen, setJenisOpen] = useState(false);

  // =====================================================
  // ACTION
  // =====================================================

  const [openAction, setOpenAction] = useState(null);

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const itemsPerPage = 5;

  // =====================================================
  // SIDEBAR
  // =====================================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =====================================================
  // AMBIL DATA SURAT DARI BACKEND
  // =====================================================

  useEffect(() => {
    const loadSurat = async () => {
      try {
        setLoading(true);

        const data = await getSurat();

        // Hanya mengambil surat dengan arah_surat = Masuk
        const suratMasuk = data
          .filter((item) => item.arah_surat === "Masuk")
          .map((item, index) => ({
            id: item.id_surat,

            // Nomor urut untuk tampilan
            no: String(index + 1).padStart(3, "0"),

            nomorSurat: item.nomor_surat,

            // PostgreSQL -> format DD/MM/YYYY
            tanggal: new Date(item.tanggal).toLocaleDateString(
              "id-ID",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            ),

            asalSurat: item.asal,

            // Saat ini database belum memiliki asalDetail
            asalDetail: "",

            tujuan: item.tujuan,

            jenis: item.jenis,

            keterangan: item.keterangan,
            namaDokumen: item.dokumen?.[0]?.nama_dokumen_file || "",
            pathDokumen: item.dokumen?.[0]?.path_file || "",
          }));

        setDataSurat(suratMasuk);
      } catch (error) {
        console.error("Gagal mengambil data surat:", error);

        alert("Gagal mengambil data surat dari server.");
      } finally {
        setLoading(false);
      }
    };

    loadSurat();
  }, []);

  // =====================================================
  // FILTER OPTIONS
  // =====================================================

  const tanggalOptions = Array.from(
    { length: 31 },
    (_, index) => String(index + 1).padStart(2, "0")
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

  // =====================================================
  // FILTER DATA
  // =====================================================

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
      tanggal === "" || tanggalItem === tanggal;

    const matchesJenis =
      jenis === "" || item.jenis === jenis;

    return (
      matchesSearch &&
      matchesTanggal &&
      matchesJenis
    );
  });

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / itemsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * itemsPerPage;

  const currentData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // =====================================================
  // FILTER TANGGAL
  // =====================================================

  const changeTanggal = (value) => {
    setTanggal(value);
    setTanggalOpen(false);
    setJenisOpen(false);
    setCurrentPage(1);
  };

  // =====================================================
  // FILTER JENIS
  // =====================================================

  const changeJenis = (value) => {
    setJenis(value);
    setJenisOpen(false);
    setTanggalOpen(false);
    setCurrentPage(1);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (item) => {
    setOpenAction(null);

    navigate(`/surat-masuk/${item.id}/edit`, {
      state: {
        surat: item,
      },
    });
  };

  // =====================================================
  // HAPUS
  // =====================================================

  const handleDelete = async (item) => {
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

    try {
      // Hapus dari database
      await deleteSurat(item.id);

      // Hapus dari tampilan
      setDataSurat((dataLama) =>
        dataLama.filter(
          (surat) => surat.id !== item.id
        )
      );

      // Pastikan halaman pagination tetap valid
      setCurrentPage((page) => {
        const jumlahDataSetelahHapus =
          filteredData.length - 1;

        const halamanBaru = Math.max(
          1,
          Math.ceil(
            jumlahDataSetelahHapus /
              itemsPerPage
          )
        );

        return Math.min(page, halamanBaru);
      });
    } catch (error) {
      console.error(
        "Gagal menghapus surat:",
        error
      );

      alert("Gagal menghapus surat.");
    }
  };

  const handleOpenDocument = (item) => {
    if (!item.pathDokumen) {
      alert("Berkas surat belum tersedia.");
      return;
    }

    const fileUrl = /^https?:\/\//i.test(item.pathDokumen)
      ? item.pathDokumen
      : `http://localhost:5000${item.pathDokumen}`;

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  // =====================================================
  // TOGGLE ACTION
  // =====================================================

  const toggleAction = (id) => {
    setOpenAction((prev) =>
      prev === id ? null : id
    );

    setTanggalOpen(false);
    setJenisOpen(false);
  };

  // =====================================================
  // RENDER
  // =====================================================

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

        {/* =====================================================
            HEADER
        ===================================================== */}

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

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <section className="surat-masuk-content">

          {/* =====================================================
              TOP ACTION
          ===================================================== */}

          <div className="surat-masuk-top-action">

            <div className="surat-masuk-top-buttons">

              {/* SMART DOCUMENT */}

              <button
                type="button"
                className="saw-smart-button"
                onClick={() =>
                  navigate("/smart-document")
                }
              >
                <img
                  className="saw-button-icon-img"
                  src={smartDocIcon}
                  alt=""
                />

                Smart Document
              </button>

              {/* TAMBAH SURAT */}

              <button
                type="button"
                className="add-surat-button"
                onClick={() =>
                  navigate("/surat-masuk/tambah")
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

          {/* =====================================================
              TABLE CARD
          ===================================================== */}

          <div className="surat-masuk-table-card">

            {/* =====================================================
                TABLE TOP
            ===================================================== */}

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

                {/* =================================================
                    TANGGAL
                ================================================= */}

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

                {/* =================================================
                    JENIS
                ================================================= */}

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

            {/* =====================================================
                TABLE
            ===================================================== */}

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
                    <th>Berkas</th>
                    <th>Aksi</th>
                  </tr>

                </thead>

                <tbody>

                  {/* =================================================
                      LOADING
                  ================================================= */}

                  {loading ? (

                    <tr>
                      <td
                        colSpan="9"
                        className="surat-masuk-empty"
                      >
                        Memuat data surat...
                      </td>
                    </tr>

                  ) : currentData.length > 0 ? (

                    currentData.map((item) => (

                      <tr key={item.id}>

                        {/* =================================================
                            NO
                        ================================================= */}

                        <td className="surat-masuk-no">
                          {item.no}
                        </td>

                        {/* =================================================
                            NOMOR SURAT
                        ================================================= */}

                        <td className="surat-masuk-nomor">
                          {item.nomorSurat}
                        </td>

                        {/* =================================================
                            TANGGAL
                        ================================================= */}

                        <td className="surat-masuk-tanggal">

                          <div className="surat-masuk-date">
                            {item.tanggal}
                          </div>

                        </td>

                        {/* =================================================
                            ASAL
                        ================================================= */}

                        <td className="surat-masuk-asal">

                          <div className="surat-masuk-main-text">
                            {item.asalSurat}
                          </div>

                          {item.asalDetail && (
                            <div className="surat-masuk-secondary-text">
                              {item.asalDetail}
                            </div>
                          )}

                        </td>

                        {/* =================================================
                            TUJUAN
                        ================================================= */}

                        <td className="surat-masuk-tujuan">
                          {item.tujuan}
                        </td>

                        {/* =================================================
                            JENIS
                        ================================================= */}

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

                        {/* =================================================
                            KETERANGAN
                        ================================================= */}

                        <td className="surat-masuk-keterangan">

                          <div className="surat-masuk-main-text">
                            {item.keterangan}
                          </div>

                        </td>

                        <td className="surat-masuk-berkas">
                          {item.namaDokumen ? (
                            <button
                              type="button"
                              className="surat-file-button"
                              onClick={() => handleOpenDocument(item)}
                              title={item.namaDokumen}
                            >
                              <img src={docIcon} alt="" />
                              <span>{item.namaDokumen}</span>
                            </button>
                          ) : (
                            <span className="surat-file-empty">Belum ada berkas</span>
                          )}
                        </td>

                        {/* =================================================
                            AKSI
                        ================================================= */}

                        <td className="surat-masuk-aksi">

                          <div className="surat-masuk-action-wrapper">

                            <button
                              type="button"
                              className="surat-masuk-action-button"
                              onClick={() =>
                                toggleAction(
                                  item.id
                                )
                              }
                              aria-label={`Aksi surat ${item.no}`}
                            >
                              ⋮
                            </button>

                            {openAction ===
                              item.id && (

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
                                    handleDelete(item)
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
                        colSpan="9"
                        className="surat-masuk-empty"
                      >
                        Data surat masuk tidak ditemukan.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* =====================================================
                FOOTER
            ===================================================== */}

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

              {/* =================================================
                  PAGINATION
              ================================================= */}

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