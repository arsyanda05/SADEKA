import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./sidebarmenu";
import Header from "./header";
import smartDocIcon from "../assets/smartdoc.png";
import saw1Icon from "../assets/saw1.png";
import saw2Icon from "../assets/saw2.png";
import saw3Icon from "../assets/saw3.png";
import saw4Icon from "../assets/saw4.png";
import saw5Icon from "../assets/saw5.png";
import docIcon from "../assets/doc.png";

function SuratAhliWaris() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [urutanOpen, setUrutanOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [urutan, setUrutan] = useState("Urutan Pengajuan");
  const [status, setStatus] = useState("Status");

  const [currentPage, setCurrentPage] = useState(1);
  const [dataSurat, setDataSurat] = useState([]);
  const [dataPenduduk, setDataPenduduk] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const itemsPerPage = 5;

  // ==============================
  // LOAD DATA SURAT AHLI WARIS
  // ==============================
  const loadSuratAhliWaris = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        "http://localhost:5000/api/surat-ahli-waris"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal mengambil data surat ahli waris"
        );
      }

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : [];

      const dataWithDocuments = await Promise.all(
        data.map(async (surat) => {
          let dokumen = Array.isArray(surat.dokumen)
            ? surat.dokumen
            : [];

          if (
            dokumen.length === 0 &&
            surat.id_surat_ahli_waris
          ) {
            try {
              const dokumenResponse = await fetch(
                `http://localhost:5000/api/dokumen/surat-ahli-waris/${surat.id_surat_ahli_waris}`
              );

              if (dokumenResponse.ok) {
                const dokumenResult =
                  await dokumenResponse.json();
                dokumen = Array.isArray(dokumenResult)
                  ? dokumenResult
                  : Array.isArray(dokumenResult.data)
                  ? dokumenResult.data
                  : [];
              }
            } catch (error) {
              console.error(
                "Gagal mengambil berkas surat ahli waris:",
                error
              );
            }
          }

          return {
            ...surat,
            dokumen,
          };
        })
      );

      setDataSurat(dataWithDocuments);
    } catch (error) {
      console.error(
        "Gagal mengambil data surat ahli waris:",
        error
      );

      setErrorMessage(
        error.message ||
          "Gagal mengambil data surat ahli waris."
      );

      setDataSurat([]);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD DATA PENDUDUK
  // ==============================
  const loadPenduduk = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/penduduk"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal mengambil data penduduk"
        );
      }

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : [];

      setDataPenduduk(data);
    } catch (error) {
      console.error(
        "Gagal mengambil data penduduk:",
        error
      );

      setDataPenduduk([]);
    }
  };

  // ==============================
  // LOAD SAAT HALAMAN DIBUKA
  // ==============================
  useEffect(() => {
    loadSuratAhliWaris();
    loadPenduduk();
  }, []);

  // ==============================
  // FORMAT TANGGAL
  // ==============================
  const formatTanggal = (tanggal) => {
    if (!tanggal) {
      return "-";
    }

    const date = new Date(tanggal);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ==============================
  // NORMALISASI DATA
  // ==============================
  const normalizedData = useMemo(() => {
    return dataSurat.map((item) => {
      // ======================================
      // PEWARIS
      // ======================================
      const pewaris =
        item.penduduk ||
        dataPenduduk.find(
          (p) =>
            Number(p.id_penduduk) ===
            Number(item.id_penduduk)
        );

      // ======================================
      // AHLI WARIS
      // ======================================
      const ahliWaris = item.ahliWaris;

      return {
        id: item.id_surat_ahli_waris,

        nomorSurat:
          item.nomor_surat || "-",

        // Nama ahli waris yang sebenarnya
        ahliWaris:
          ahliWaris?.nama ||
          item.nama_ahli_waris ||
          item.ahli_waris ||
          "-",

        // NIK ahli waris
        nik:
          ahliWaris?.nik ||
          item.nik_ahli_waris ||
          "-",

        // Data pewaris juga disimpan jika
        // nanti diperlukan
        pewaris:
          pewaris?.nama ||
          "-",

        nikPewaris:
          pewaris?.nik ||
          "-",

        tanggalPengajuan:
          formatTanggal(
            item.tanggal_pengajuan
          ),

        tanggalSelesai:
          formatTanggal(
            item.tanggal_selesai
          ),

        tahap:
          item.tahap || "-",

        idPenduduk:
          item.id_penduduk,

        idPendudukAhliWaris:
          ahliWaris?.id_penduduk ||
          null,

        namaDokumen:
          item.dokumen?.[0]?.nama_dokumen_file ||
          "",

        pathDokumen:
          item.dokumen?.[0]?.path_file ||
          "",
      };
    });
  }, [dataSurat, dataPenduduk]);

  // ==============================
  // FILTER + SORTING
  // ==============================
  const filteredData = useMemo(() => {
    const keyword =
      search.toLowerCase().trim();

    let result =
      normalizedData.filter((item) => {
        const cocokSearch =
          item.nomorSurat
            .toLowerCase()
            .includes(keyword) ||
          item.ahliWaris
            .toLowerCase()
            .includes(keyword) ||
          item.nik
            .toLowerCase()
            .includes(keyword) ||
          item.pewaris
            .toLowerCase()
            .includes(keyword);

        const tahap =
          item.tahap.toLowerCase();

        let cocokStatus = true;

        if (status !== "Status") {
          if (
            status ===
            "Diterima oleh Kelurahan"
          ) {
            cocokStatus =
              tahap ===
              "diterima oleh kelurahan";
          } else if (
            status ===
            "Tanda Tangan Sekretaris"
          ) {
            cocokStatus =
              tahap ===
              "tanda tangan sekretaris";
          } else if (
            status ===
            "Diproses Kecamatan"
          ) {
            cocokStatus =
              tahap ===
              "diproses kecamatan";
          } else if (
            status === "Selesai"
          ) {
            cocokStatus =
              tahap === "selesai";
          }
        }

        return (
          cocokSearch &&
          cocokStatus
        );
      });

    // ==============================
    // URUTAN
    // ==============================
    if (urutan === "Terbaru") {
      result = [...result].sort(
        (a, b) => {
          const dateA = new Date(
            dataSurat.find(
              (item) =>
                item.id_surat_ahli_waris ===
                a.id
            )?.tanggal_pengajuan || 0
          );

          const dateB = new Date(
            dataSurat.find(
              (item) =>
                item.id_surat_ahli_waris ===
                b.id
            )?.tanggal_pengajuan || 0
          );

          return dateB - dateA;
        }
      );
    }

    if (urutan === "Terlama") {
      result = [...result].sort(
        (a, b) => {
          const dateA = new Date(
            dataSurat.find(
              (item) =>
                item.id_surat_ahli_waris ===
                a.id
            )?.tanggal_pengajuan || 0
          );

          const dateB = new Date(
            dataSurat.find(
              (item) =>
                item.id_surat_ahli_waris ===
                b.id
            )?.tanggal_pengajuan || 0
          );

          return dateA - dateB;
        }
      );
    }

    if (
      urutan === "Semua Urutan" ||
      urutan === "Urutan Pengajuan"
    ) {
      result = [...result].sort(
        (a, b) => b.id - a.id
      );
    }

    return result;
  }, [
    normalizedData,
    dataSurat,
    search,
    status,
    urutan,
  ]);

  // ==============================
  // PAGINATION
  // ==============================
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length /
        itemsPerPage
    )
  );

  const paginatedData =
    filteredData.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage *
        itemsPerPage
    );

  // ==============================
  // STATISTIK
  // ==============================
  const totalPengajuan =
    normalizedData.length;

  const totalDiterima =
    normalizedData.filter(
      (item) =>
        item.tahap.toLowerCase() ===
        "diterima oleh kelurahan"
    ).length;

  const totalTTD =
    normalizedData.filter(
      (item) =>
        item.tahap.toLowerCase() ===
        "tanda tangan sekretaris"
    ).length;

  const totalDiproses =
    normalizedData.filter(
      (item) =>
        item.tahap.toLowerCase() ===
        "diproses kecamatan"
    ).length;

  const totalSelesai =
    normalizedData.filter(
      (item) =>
        item.tahap.toLowerCase() ===
        "selesai"
    ).length;

  // ==============================
  // FILTER HANDLER
  // ==============================
  const handleUrutan = (value) => {
    setUrutan(value);
    setUrutanOpen(false);
    setCurrentPage(1);
  };

  const handleStatus = (value) => {
    setStatus(value);
    setStatusOpen(false);
    setCurrentPage(1);
  };

  const closeSidebar = () =>
    setSidebarOpen(false);

  const toggleActionMenu = (event, id) => {
    event.stopPropagation();

    if (actionMenu?.id === id) {
      setActionMenu(null);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const menuWidth = 136;
    const menuHeight = 88;
    const top =
      bounds.bottom + menuHeight + 4 > window.innerHeight
        ? Math.max(8, bounds.top - menuHeight - 4)
        : bounds.bottom + 4;

    setActionMenu({
      id,
      top,
      left: Math.max(
        8,
        Math.min(bounds.right - menuWidth, window.innerWidth - menuWidth - 8)
      ),
    });
  };

  const handleDelete = async (event, item) => {
    event.stopPropagation();

    if (
      !window.confirm(
        `Hapus surat ahli waris ${item.ahliWaris}?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(item.id);

      const response = await fetch(
        `http://localhost:5000/api/surat-ahli-waris/${item.id}`,
        { method: "DELETE" }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menghapus surat ahli waris."
        );
      }

      setDataSurat((previous) =>
        previous.filter(
          (surat) =>
            Number(surat.id_surat_ahli_waris) !== Number(item.id)
        )
      );
      setCurrentPage((page) =>
        Math.min(
          page,
          Math.max(
            1,
            Math.ceil(
              (filteredData.length - 1) / itemsPerPage
            )
          )
        )
      );
      setActionMenu(null);
    } catch (error) {
      alert(error.message || "Gagal menghapus surat ahli waris.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenDocument = (event, item) => {
    event.stopPropagation();

    if (!item.pathDokumen) {
      alert("Berkas surat belum tersedia.");
      return;
    }

    let fileUrl;

    if (/^https?:\/\//i.test(item.pathDokumen)) {
      fileUrl = item.pathDokumen;
    } else if (item.pathDokumen.startsWith("/uploads/")) {
      fileUrl = `http://localhost:5000${item.pathDokumen}`;
    } else {
      const filename = item.pathDokumen
        .split("\\")
        .pop()
        .split("/")
        .pop();

      if (!filename) {
        alert("Berkas surat belum tersedia.");
        return;
      }

      fileUrl =
        `http://localhost:5000/uploads/surat-ahli-waris/${encodeURIComponent(filename)}`;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  // ==============================
  // HALAMAN SAAT INI
  // ==============================
  const startItem =
    filteredData.length === 0
      ? 0
      : (currentPage - 1) *
          itemsPerPage +
        1;

  const endItem = Math.min(
    currentPage *
      itemsPerPage,
    filteredData.length
  );

  return (
    <div className="surat-ahli-waris-page">

      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="saw-main">

        <Header
          title="Surat Ahli Waris"
          showSearch={true}
          searchValue={search}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          onMenuClick={() =>
            setSidebarOpen(
              (prev) => !prev
            )
          }
        />

        {/* ================= CONTENT ================= */}

        <main className="saw-content">

          {/* TOP BUTTON */}

          <div className="saw-top-actions">

            <button
              type="button"
              className="saw-smart-button"
              onClick={() =>
                navigate(
                  "/smart-document"
                )
              }
            >
              <img
                className="saw-button-icon-img"
                src={smartDocIcon}
                alt=""
              />

              Smart Document
            </button>

            <button
              type="button"
              className="saw-add-button"
              onClick={() =>
                navigate(
                  "/surat-ahli-waris/tambah"
                )
              }
            >
              <span>＋</span>

              Tambah Surat Ahli Waris
            </button>

          </div>

          {/* ================= STATISTIK ================= */}

          <section className="saw-statistics">

            <div className="saw-stat-card">

              <div className="saw-stat-icon">
                <img
                  src={saw1Icon}
                  alt=""
                />
              </div>

              <div className="saw-stat-content">

                <h3>
                  Pengajuan
                </h3>

                <strong>
                  {totalPengajuan}
                </strong>

                <span>
                  Total Berkas
                  <br />
                  Pengajuan
                </span>

              </div>

            </div>

            <div className="saw-stat-card">

              <div className="saw-stat-icon">
                <img
                  src={saw2Icon}
                  alt=""
                />
              </div>

              <div className="saw-stat-content">

                <h3>
                  Diterima
                </h3>

                <strong>
                  {totalDiterima}
                </strong>

                <span>
                  Total Berkas
                  <br />
                  Diterima
                </span>

              </div>

            </div>

            <div className="saw-stat-card">

              <div className="saw-stat-icon">
                <img
                  src={saw3Icon}
                  alt=""
                />
              </div>

              <div className="saw-stat-content">

                <h3>
                  TTD
                </h3>

                <strong>
                  {totalTTD}
                </strong>

                <span>
                  Total Tanda Tangan
                </span>

              </div>

            </div>

            <div className="saw-stat-card">

              <div className="saw-stat-icon">
                <img
                  src={saw4Icon}
                  alt=""
                />
              </div>

              <div className="saw-stat-content">

                <h3>
                  Diproses
                </h3>

                <strong>
                  {totalDiproses}
                </strong>

                <span>
                  Total Berkas
                  <br />
                  Diproses
                </span>

              </div>

            </div>

            <div className="saw-stat-card">

              <div className="saw-stat-icon">
                <img
                  src={saw5Icon}
                  alt=""
                />
              </div>

              <div className="saw-stat-content">

                <h3>
                  Selesai
                </h3>

                <strong>
                  {totalSelesai}
                </strong>

                <span>
                  Total Berkas Selesai
                </span>

              </div>

            </div>

          </section>

          {/* ================= TABLE CARD ================= */}

          <section className="saw-table-card">

            {/* TABLE HEADER */}

            <div className="saw-table-top">

              <h2>
                Daftar Surat Ahli Waris
              </h2>

              <div className="saw-filter-wrapper">

                <span className="saw-filter-label">
                  Filter
                </span>

                {/* URUTAN */}

                <div className="saw-dropdown">

                  <button
                    type="button"
                    className="saw-filter-button"
                    onClick={() => {
                      setUrutanOpen(
                        !urutanOpen
                      );

                      setStatusOpen(false);
                    }}
                  >
                    {urutan}

                    <span>
                      ▼
                    </span>
                  </button>

                  {urutanOpen && (
                    <div className="saw-dropdown-menu">

                      <div
                        className="saw-dropdown-item"
                        onClick={() =>
                          handleUrutan(
                            "Semua Urutan"
                          )
                        }
                      >
                        Semua Urutan
                      </div>

                      <div
                        className="saw-dropdown-item"
                        onClick={() =>
                          handleUrutan(
                            "Terbaru"
                          )
                        }
                      >
                        Terbaru
                      </div>

                      <div
                        className="saw-dropdown-item"
                        onClick={() =>
                          handleUrutan(
                            "Terlama"
                          )
                        }
                      >
                        Terlama
                      </div>

                    </div>
                  )}

                </div>

                {/* STATUS */}

                <div className="saw-dropdown">

                  <button
                    type="button"
                    className="saw-filter-button saw-status-button"
                    onClick={() => {
                      setStatusOpen(
                        !statusOpen
                      );

                      setUrutanOpen(false);
                    }}
                  >
                    {status}

                    <span>
                      ▼
                    </span>
                  </button>

                  {statusOpen && (
                    <div className="saw-dropdown-menu">

                      <div
                        className="saw-dropdown-item"
                        onClick={() =>
                          handleStatus(
                            "Status"
                          )
                        }
                      >
                        Semua Status
                      </div>

                      <div
                        className="saw-dropdown-item"
                        onClick={() =>
                          handleStatus(
                            "Diterima oleh Kelurahan"
                          )
                        }
                      >
                        Diterima oleh Kelurahan
                      </div>

                      <div
                        className="saw-dropdown-item"
                        onClick={() =>
                          handleStatus(
                            "Tanda Tangan Sekretaris"
                          )
                        }
                      >
                        Tanda Tangan Sekretaris
                      </div>

                      <div
                        className="saw-dropdown-item"
                        onClick={() =>
                          handleStatus(
                            "Diproses Kecamatan"
                          )
                        }
                      >
                        Diproses Kecamatan
                      </div>

                      <div
                        className="saw-dropdown-item"
                        onClick={() =>
                          handleStatus(
                            "Selesai"
                          )
                        }
                      >
                        Selesai
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* TABLE */}

            <div className="saw-table-scroll">

              <table className="saw-table">

                <thead>

                  <tr>

                    <th>No</th>

                    <th>
                      Nomor Surat
                    </th>

                    <th>
                      Ahli Waris
                    </th>

                    <th>
                      NIK
                    </th>

                    <th>
                      Tanggal
                      <br />
                      Pengajuan
                    </th>

                    <th>
                      Tanggal
                      <br />
                      Selesai
                    </th>

                    <th>
                      Tahap
                    </th>

                    <th>
                      Berkas
                    </th>

                    <th>
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading && (
                    <tr>

                      <td
                        colSpan="9"
                        className="saw-empty"
                      >
                        Memuat data surat ahli waris...
                      </td>

                    </tr>
                  )}

                  {!loading &&
                    errorMessage && (
                      <tr>

                        <td
                          colSpan="9"
                          className="saw-empty"
                        >
                          {errorMessage}
                        </td>

                      </tr>
                    )}

                  {!loading &&
                    !errorMessage &&
                    paginatedData.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={item.id}
                          className="saw-table-row-clickable"
                          onClick={() =>
                            navigate(
                              `/surat-ahli-waris/${item.id}`
                            )
                          }
                        >

                          <td>
                            {filteredData.length -
                              ((currentPage -
                                1) *
                                itemsPerPage +
                                index)}
                          </td>

                          <td>
                            {item.nomorSurat}
                          </td>

                          <td>
                            {item.ahliWaris}
                          </td>

                          <td>
                            {item.nik}
                          </td>

                          <td>
                            {
                              item.tanggalPengajuan
                            }
                          </td>

                          <td>
                            {
                              item.tanggalSelesai
                            }
                          </td>

                          <td className="saw-stage-cell">
                            {item.tahap}
                          </td>

                          <td>

                            <button
                              type="button"
                              className="saw-file-button"
                              onClick={(event) =>
                                handleOpenDocument(event, item)
                              }
                              disabled={!item.pathDokumen}
                              title={item.namaDokumen || "Berkas belum tersedia"}
                            >

                              <span className="saw-file-icon">

                                <img
                                  src={docIcon}
                                  alt=""
                                />

                              </span>

                              <span className="saw-file-name">
                                {item.namaDokumen || "Berkas belum tersedia"}
                              </span>

                            </button>

                          </td>

                          {/* ================= ACTION ================= */}

                          <td className="saw-action-cell">
                            <button
                              type="button"
                              className="saw-action-button"
                              aria-label={`Aksi untuk surat ahli waris ${item.ahliWaris}`}
                              aria-haspopup="menu"
                              aria-expanded={actionMenu?.id === item.id}
                              onClick={(event) =>
                                toggleActionMenu(event, item.id)
                              }
                            >
                              <span aria-hidden="true">
                                <i />
                                <i />
                                <i />
                              </span>
                            </button>
                          </td>

                        </tr>
                      )
                    )}

                  {!loading &&
                    !errorMessage &&
                    paginatedData.length ===
                      0 && (
                      <tr>

                        <td
                          colSpan="9"
                          className="saw-empty"
                        >
                          Data surat ahli waris tidak
                          ditemukan.
                        </td>

                      </tr>
                    )}

                </tbody>

              </table>

            </div>

            {/* FOOTER */}

            <div className="saw-table-footer">

              <p>

                Menampilkan{" "}

                <strong>
                  {startItem}-{endItem}
                </strong>{" "}

                dari{" "}

                <strong>
                  {filteredData.length}
                </strong>{" "}

                Surat Ahli Waris

              </p>

              <div className="saw-pagination">

                <button
                  type="button"
                  className="saw-page-prev"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      Math.max(
                        1,
                        currentPage - 1
                      )
                    )
                  }
                >
                  ← &nbsp; Sebelumnya
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={
                      currentPage === page
                        ? "saw-page-active"
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
                  className="saw-page-next"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      Math.min(
                        totalPages,
                        currentPage + 1
                      )
                    )
                  }
                >
                  Selanjutnya &nbsp; →
                </button>

              </div>

            </div>

          </section>

        </main>

      </div>

      {actionMenu && (
        <>
          <button
            type="button"
            className="saw-action-dismiss"
            aria-label="Tutup menu aksi"
            onClick={() => setActionMenu(null)}
          />
          <div
            className="saw-action-menu"
            role="menu"
            style={{
              top: actionMenu.top,
              left: actionMenu.left,
            }}
          >
            <button
              type="button"
              role="menuitem"
              className="saw-action-edit"
              onClick={(event) => {
                event.stopPropagation();
                const selectedId = actionMenu.id;
                setActionMenu(null);
                navigate(`/surat-ahli-waris/${selectedId}/edit`);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              role="menuitem"
              className="saw-action-delete"
              disabled={deletingId === actionMenu.id}
              onClick={(event) => {
                const selected = normalizedData.find(
                  (item) => item.id === actionMenu.id
                );
                if (selected) {
                  handleDelete(event, selected);
                }
              }}
            >
              {deletingId === actionMenu.id ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </>
      )}

    </div>
  );
}

export default SuratAhliWaris;