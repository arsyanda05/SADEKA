import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./sidebarmenu";
import Header from "./header";
import {
  getPenduduk,
  deletePenduduk
} from "../services/api";

function DataPenduduk() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [status, setStatus] = useState("");

  const [rtOpen, setRtOpen] = useState(false);
  const [rwOpen, setRwOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [openAction, setOpenAction] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const [dataPenduduk, setDataPenduduk] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // =========================================================
  // MENGAMBIL DATA PENDUDUK DARI BACKEND
  // =========================================================

  useEffect(() => {
    const loadPenduduk = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const data = await getPenduduk();

        const formattedData = data.map((item, index) => ({
          id: item.id_penduduk,

          no: String(index + 1).padStart(3, "0"),

          nama: item.nama,

          nik: item.nik,

          tempatLahir: item.tempat_lahir,

          tanggalLahir: new Date(
            item.tanggal_lahir
          ).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          }),

          alamat: item.alamat,

          rt: item.rt,

          rw: item.rw,

          jk:
            item.jenis_kelamin === "Laki-laki"
              ? "L"
              : "P",

          status: item.status_penduduk
        }));

        setDataPenduduk(formattedData);

      } catch (error) {
        console.error(
          "Gagal mengambil data penduduk:",
          error
        );
        setLoadError("Data penduduk belum dapat dimuat. Pastikan backend berjalan di http://localhost:5000.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPenduduk();
  }, []);

  // =========================================================
  // OPTIONS FILTER
  // =========================================================

  const rtOptions = Array.from(
    { length: 124 },
    (_, index) =>
      String(index + 1).padStart(2, "0")
  );

  const rwOptions = Array.from(
    { length: 15 },
    (_, index) =>
      String(index + 1).padStart(2, "0")
  );

  const statusOptions = [
    "Tetap",
    "Sementara",
    "Meninggal",
    "Pindah"
  ];

  // =========================================================
  // FILTER DATA
  // =========================================================

  const filteredData = dataPenduduk.filter((item) => {
    const keyword = search.toLowerCase().trim();

    const matchesSearch =
      item.no.toLowerCase().includes(keyword) ||
      item.nama.toLowerCase().includes(keyword) ||
      item.nik.toLowerCase().includes(keyword) ||
      item.tempatLahir
        .toLowerCase()
        .includes(keyword) ||
      item.tanggalLahir
        .toLowerCase()
        .includes(keyword) ||
      item.alamat
        .toLowerCase()
        .includes(keyword) ||
      item.rt.toLowerCase().includes(keyword) ||
      item.rw.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword);

    const matchesRt =
      rt === "" || item.rt === rt;

    const matchesRw =
      rw === "" || item.rw === rw;

    const matchesStatus =
      status === "" || item.status === status;

    return (
      matchesSearch &&
      matchesRt &&
      matchesRw &&
      matchesStatus
    );
  });

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length / itemsPerPage
    )
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const firstItem =
    filteredData.length === 0
      ? 0
      : startIndex + 1;

  const lastItem =
    filteredData.length === 0
      ? 0
      : Math.min(
          startIndex + itemsPerPage,
          filteredData.length
        );

  // =========================================================
  // SIDEBAR
  // =========================================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =========================================================
  // DROPDOWN
  // =========================================================

  const closeAllDropdown = () => {
    setRtOpen(false);
    setRwOpen(false);
    setStatusOpen(false);
  };

  // =========================================================
  // EDIT DATA
  // =========================================================

  const handleEdit = (item) => {
    setOpenAction(null);

    navigate(
      `/data-penduduk/${item.id}/edit`,
      {
        state: {
          penduduk: item
        }
      }
    );
  };

  // =========================================================
  // HAPUS DATA
  // =========================================================

  const handleDelete = async (item) => {
    const jenisKelamin =
      item.jk === "L"
        ? "Laki-laki"
        : "Perempuan";

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus data penduduk berikut?\n\n` +
        `No: ${item.no}\n` +
        `Nama: ${item.nama}\n` +
        `NIK: ${item.nik}\n` +
        `Tempat, Tanggal Lahir: ${item.tempatLahir}, ${item.tanggalLahir}\n` +
        `Alamat: ${item.alamat}\n` +
        `RT/RW: ${item.rt}/${item.rw}\n` +
        `Jenis Kelamin: ${jenisKelamin}\n` +
        `Status: ${item.status}\n\n` +
        `Data yang dihapus tidak dapat dikembalikan.`
    );

    // Jika user memilih Cancel
    if (!confirmed) {
      return;
    }

    try {
      // Hapus data dari database
      await deletePenduduk(item.id);

      // Hapus juga dari state frontend
      setDataPenduduk((prev) =>
        prev.filter(
          (data) => data.id !== item.id
        )
      );

      setOpenAction(null);

      // Jika item terakhir pada halaman dihapus,
      // kembali ke halaman sebelumnya
      if (
        currentData.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage(
          (page) => page - 1
        );
      }

      alert(
        "Data penduduk berhasil dihapus."
      );

    } catch (error) {
      console.error(
        "Gagal menghapus data penduduk:",
        error
      );

      alert(
        "Gagal menghapus data penduduk."
      );
    }
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
    setOpenAction(null);
  };

  // =========================================================
  // TAMPILAN
  // =========================================================

  return (
    <div className="penduduk-page">

      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <main className="penduduk-main">

        <Header
          title="Data Penduduk"
          showSearch={true}
          searchValue={search}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
            setOpenAction(null);
          }}
          onMenuClick={() =>
            setSidebarOpen(
              (prev) => !prev
            )
          }
        />

        <section className="penduduk-content">

          {/* =================================================
              TOMBOL TAMBAH
          ================================================= */}

          <div className="penduduk-top-action">

            <button
              type="button"
              className="penduduk-add-button"
              onClick={() =>
                navigate(
                  "/data-penduduk/tambah"
                )
              }
            >
              <span className="penduduk-add-icon">
                +
              </span>

              <span>
                Tambah Penduduk
              </span>
            </button>

          </div>

          {/* =================================================
              CARD TABEL
          ================================================= */}

          <div className="penduduk-table-card">

            {/* HEADER TABEL + FILTER */}

            <div className="penduduk-table-top">

              <h2>
                Daftar Penduduk
              </h2>

              <div className="penduduk-filter-wrapper">

                <span className="penduduk-filter-label">
                  Filter
                </span>

                {/* ================= RT ================= */}

                <div className="penduduk-filter-dropdown">

                  <button
                    type="button"
                    className="penduduk-filter-select"
                    onClick={() => {
                      setRtOpen(
                        (prev) => !prev
                      );

                      setRwOpen(false);
                      setStatusOpen(false);
                    }}
                  >
                    <span>
                      {rt
                        ? `RT ${rt}`
                        : "RT"}
                    </span>

                    <span className="penduduk-filter-arrow">
                      ▼
                    </span>
                  </button>

                  {rtOpen && (
                    <div className="penduduk-filter-menu">

                      <button
                        type="button"
                        className="penduduk-filter-item"
                        onClick={() => {
                          setRt("");
                          setRtOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        Semua RT
                      </button>

                      {rtOptions.map(
                        (option) => (
                          <button
                            type="button"
                            key={option}
                            className="penduduk-filter-item"
                            onClick={() => {
                              setRt(option);
                              setRtOpen(false);
                              setCurrentPage(1);
                            }}
                          >
                            RT {option}
                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>

                {/* ================= RW ================= */}

                <div className="penduduk-filter-dropdown">

                  <button
                    type="button"
                    className="penduduk-filter-select"
                    onClick={() => {
                      setRwOpen(
                        (prev) => !prev
                      );

                      setRtOpen(false);
                      setStatusOpen(false);
                    }}
                  >
                    <span>
                      {rw
                        ? `RW ${rw}`
                        : "RW"}
                    </span>

                    <span className="penduduk-filter-arrow">
                      ▼
                    </span>
                  </button>

                  {rwOpen && (
                    <div className="penduduk-filter-menu">

                      <button
                        type="button"
                        className="penduduk-filter-item"
                        onClick={() => {
                          setRw("");
                          setRwOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        Semua RW
                      </button>

                      {rwOptions.map(
                        (option) => (
                          <button
                            type="button"
                            key={option}
                            className="penduduk-filter-item"
                            onClick={() => {
                              setRw(option);
                              setRwOpen(false);
                              setCurrentPage(1);
                            }}
                          >
                            RW {option}
                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>

                {/* ================= STATUS ================= */}

                <div className="penduduk-filter-dropdown">

                  <button
                    type="button"
                    className="penduduk-filter-select"
                    onClick={() => {
                      setStatusOpen(
                        (prev) => !prev
                      );

                      setRtOpen(false);
                      setRwOpen(false);
                    }}
                  >
                    <span>
                      {status || "Status"}
                    </span>

                    <span className="penduduk-filter-arrow">
                      ▼
                    </span>
                  </button>

                  {statusOpen && (
                    <div className="penduduk-filter-menu">

                      <button
                        type="button"
                        className="penduduk-filter-item"
                        onClick={() => {
                          setStatus("");
                          setStatusOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        Semua Status
                      </button>

                      {statusOptions.map(
                        (option) => (
                          <button
                            type="button"
                            key={option}
                            className="penduduk-filter-item"
                            onClick={() => {
                              setStatus(option);
                              setStatusOpen(false);
                              setCurrentPage(1);
                            }}
                          >
                            {option}
                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                TABEL
            ================================================= */}

            <div className="penduduk-table-scroll">

              <table className="penduduk-table">

                <thead>

                  <tr>

                    <th className="penduduk-col-no">
                      No
                    </th>

                    <th className="penduduk-col-nama">
                      Nama
                    </th>

                    <th className="penduduk-col-nik">
                      NIK
                    </th>

                    <th className="penduduk-col-ttl">
                      Tempat,
                      <br />
                      Tanggal Lahir
                    </th>

                    <th className="penduduk-col-alamat">
                      Alamat
                    </th>

                    <th className="penduduk-col-jk">
                      JK
                    </th>

                    <th className="penduduk-col-status">
                      Status
                    </th>

                    <th className="penduduk-col-aksi">
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="penduduk-empty">
                        Memuat data penduduk...
                      </td>
                    </tr>
                  ) : loadError ? (
                    <tr>
                      <td colSpan="8" className="penduduk-empty penduduk-load-error">
                        {loadError}
                      </td>
                    </tr>
                  ) : currentData.length > 0 ? (

                    currentData.map(
                      (item) => (

                        <tr key={item.id}>

                          <td className="penduduk-col-no">

                            <span className="penduduk-number">
                              {item.no}
                            </span>

                          </td>

                          <td className="penduduk-col-nama">

                            <div className="penduduk-name">
                              {item.nama}
                            </div>

                          </td>

                          <td className="penduduk-col-nik">

                            <div className="penduduk-nik">
                              {item.nik}
                            </div>

                          </td>

                          <td className="penduduk-col-ttl">

                            <div className="penduduk-ttl">

                              <span className="penduduk-birth-place">
                                {item.tempatLahir}
                              </span>

                              <span className="penduduk-birth-date">
                                {item.tanggalLahir}
                              </span>

                            </div>

                          </td>

                          <td className="penduduk-col-alamat">

                            <div className="penduduk-address">

                              <span className="penduduk-address-main">
                                {item.alamat}
                              </span>

                              <span className="penduduk-address-detail">
                                RT {item.rt} / RW{" "}
                                {item.rw}
                              </span>

                            </div>

                          </td>

                          <td className="penduduk-col-jk">

                            <span
                              className={`penduduk-jk ${
                                item.jk === "L"
                                  ? "jk-laki"
                                  : "jk-perempuan"
                              }`}
                              title={
                                item.jk === "L"
                                  ? "Laki-laki"
                                  : "Perempuan"
                              }
                            >
                              {item.jk}
                            </span>

                          </td>

                          <td className="penduduk-col-status">

                            <span
                              className={`penduduk-status status-${item.status
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {item.status}
                            </span>

                          </td>

                          {/* =================================================
                              AKSI TITIK TIGA
                          ================================================= */}

                          <td className="penduduk-col-aksi">

                            <div className="penduduk-actions">

                              <button
                                type="button"
                                className="penduduk-action-button"
                                onClick={() =>
                                  setOpenAction(
                                    openAction ===
                                      item.id
                                      ? null
                                      : item.id
                                  )
                                }
                                aria-label={`Aksi untuk ${item.nama}`}
                                title="Aksi"
                              >
                                <span className="penduduk-action-dots" aria-hidden="true">
                                  <span />
                                  <span />
                                  <span />
                                </span>
                              </button>

                              {openAction ===
                                item.id && (

                                <div className="penduduk-action-menu">

                                  {/* EDIT */}

                                  <button
                                    type="button"
                                    className="penduduk-edit-action"
                                    onClick={() =>
                                      handleEdit(
                                        item
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  {/* HAPUS */}

                                  <button
                                    type="button"
                                    className="delete-action"
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

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="8"
                        className="penduduk-empty"
                      >
                        Data penduduk tidak
                        ditemukan.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* =================================================
                FOOTER + PAGINATION
            ================================================= */}

            <div className="penduduk-table-footer">

              <div className="penduduk-table-info">

                Menampilkan{" "}

                <strong>
                  {firstItem}-{lastItem}
                </strong>{" "}

                dari{" "}

                <strong>
                  {filteredData.length}
                </strong>{" "}

                Penduduk

              </div>

              <div className="penduduk-pagination">

                <button
                  type="button"
                  className="penduduk-page-prev"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    goToPage(
                      currentPage - 1
                    )
                  }
                >
                  Sebelumnya
                </button>

                {Array.from(
                  {
                    length: totalPages
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (

                  <button
                    type="button"
                    key={page}
                    className={
                      currentPage === page
                        ? "penduduk-page-active"
                        : ""
                    }
                    onClick={() =>
                      goToPage(page)
                    }
                  >
                    {page}
                  </button>

                ))}

                <button
                  type="button"
                  className="penduduk-page-next"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    goToPage(
                      currentPage + 1
                    )
                  }
                >
                  Selanjutnya
                </button>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* OVERLAY FILTER */}

      {(rtOpen ||
        rwOpen ||
        statusOpen) && (

        <div
          className="penduduk-filter-overlay"
          onClick={closeAllDropdown}
        />

      )}

    </div>
  );
}

export default DataPenduduk;