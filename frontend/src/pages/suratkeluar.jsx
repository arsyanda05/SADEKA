import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import smartDocIcon from "../assets/smartdoc.png";
import SideBar from "./sidebarmenu";
import Header from "./header";
import docIcon from "../assets/doc.png";
import { getBackendFileUrl, getSurat, deleteSurat } from "../services/api";

function SuratKeluar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jenis, setJenis] = useState("");

  const [tanggalOpen, setTanggalOpen] = useState(false);
  const [jenisOpen, setJenisOpen] = useState(false);

  const [openAction, setOpenAction] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);


  const [dataSurat, setDataSurat] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const itemsPerPage = 5;





  useEffect(() => {
    const loadSuratKeluar = async () => {
      try {
        setLoading(true);

        const data = await getSurat();

        const suratKeluar = data
          .filter((item) => item.arah_surat === "Keluar")
          .map((item, index) => ({

            id: item.id_surat,


            no: String(index + 1).padStart(3, "0"),

            nomorSurat: item.nomor_surat,

            tanggal: new Date(item.tanggal).toLocaleDateString(
              "id-ID",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            ),

            asalSurat: item.asal,


            asalDetail: "",

            tujuan: item.tujuan,


            tujuanDetail: "",

            jenis: item.jenis,

            keterangan: item.keterangan,


            keteranganDetail: "",
            namaDokumen: item.dokumen?.[0]?.nama_dokumen_file || "",
            pathDokumen: item.dokumen?.[0]?.path_file || "",
          }));

        setDataSurat(suratKeluar);
      } catch (error) {
        console.error(
          "Error mengambil data surat keluar:",
          error
        );

        alert("Gagal mengambil data surat keluar.");
      } finally {
        setLoading(false);
      }
    };

    loadSuratKeluar();
  }, []);





  const closeSidebar = () => {
    setSidebarOpen(false);
  };





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

  const filteredData = dataSurat.filter((item) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      item.no.toLowerCase().includes(keyword) ||
      item.nomorSurat.toLowerCase().includes(keyword) ||
      item.tanggal.toLowerCase().includes(keyword) ||
      item.asalSurat.toLowerCase().includes(keyword) ||
      item.asalDetail.toLowerCase().includes(keyword) ||
      item.tujuan.toLowerCase().includes(keyword) ||
      item.tujuanDetail.toLowerCase().includes(keyword) ||
      item.jenis.toLowerCase().includes(keyword) ||
      item.keterangan.toLowerCase().includes(keyword) ||
      item.keteranganDetail.toLowerCase().includes(keyword);

    const tanggalItem =
      item.tanggal.split("/")[0];

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





  const changeTanggal = (value) => {
    setTanggal(value);
    setTanggalOpen(false);
    setJenisOpen(false);
    setCurrentPage(1);
  };

  const changeJenis = (value) => {
    setJenis(value);
    setJenisOpen(false);
    setTanggalOpen(false);
    setCurrentPage(1);
  };





  const handleTambahSurat = () => {
    navigate("/surat-keluar/tambah");
  };





  const handleEdit = (item) => {
    setOpenAction(null);

    navigate(
      `/surat-keluar/${item.id}/edit`,
      {
        state: {
          surat: item,
        },
      }
    );
  };





  const handleDelete = async (item) => {
    setOpenAction(null);

    const yakin = window.confirm(
      `Apakah Anda yakin ingin menghapus surat keluar berikut?

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
      await deleteSurat(item.id);

      setDataSurat((prevData) =>
        prevData.filter(
          (surat) => surat.id !== item.id
        )
      );

      setCurrentPage((page) =>
        Math.min(
          page,
          Math.max(
            1,
            Math.ceil(
              (filteredData.length - 1) /
                itemsPerPage
            )
          )
        )
      );

      alert("Surat keluar berhasil dihapus!");
    } catch (error) {
      console.error(
        "Error menghapus surat keluar:",
        error
      );

      alert("Gagal menghapus surat keluar.");
    }
  };

  const handleOpenDocument = (item) => {
    if (!item.pathDokumen) {
      alert("Berkas surat belum tersedia.");
      return;
    }

    const fileUrl = getBackendFileUrl(item.pathDokumen);
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };





  const toggleAction = (id) => {
    setOpenAction((prev) =>
      prev === id ? null : id
    );

    setTanggalOpen(false);
    setJenisOpen(false);
  };





  const getJenisClass = (jenisSurat) => {
    switch (jenisSurat) {
      case "Undangan Dinas":
        return "jenis-undangan-dinas";

      case "Permohonan":
        return "jenis-permohonan";

      case "Pemberitahuan":
        return "jenis-pemberitahuan";

      case "Laporan":
        return "jenis-laporan";

      case "Undangan Rapat":
        return "jenis-undangan-rapat";

      case "Rekomendasi":
        return "jenis-rekomendasi";

      case "Pengantar":
        return "jenis-pengantar";

      case "Surat Keterangan Usaha":
        return "jenis-surat-keterangan-usaha";

      default:
        return "";
    }
  };





  return (
    <div className="surat-keluar-page">



      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />



      <main className="surat-keluar-main">



        <Header
          title="Surat Keluar"
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



        <section className="surat-keluar-content">



          <div className="surat-keluar-top-action">

            <div className="surat-keluar-top-buttons">



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



              <button
                type="button"
                className="add-surat-button"
                onClick={handleTambahSurat}
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



          <div className="surat-keluar-table-card">



            <div className="table-top">

              <h2>
                Daftar Surat Keluar
              </h2>



              <div className="filter-wrapper">

                <span className="filter-label">
                  Filter
                </span>



                <div className="simple-dropdown">

                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => {
                      setTanggalOpen(
                        (prev) => !prev
                      );
                      setJenisOpen(false);
                      setOpenAction(null);
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
                    <div className="simple-menu surat-keluar-tanggal-menu">

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



                <div className="simple-dropdown">

                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => {
                      setJenisOpen(
                        (prev) => !prev
                      );
                      setTanggalOpen(false);
                      setOpenAction(null);
                    }}
                  >
                    {jenis || "Semua Jenis"}

                    <span className="dropdown-arrow">
                      ▼
                    </span>
                  </button>

                  {jenisOpen && (
                    <div className="simple-menu surat-keluar-jenis-menu">

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



            <div className="table-scroll">

              <table className="surat-keluar-table">

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

                  {loading ? (

                    <tr>
                      <td
                        colSpan="9"
                        className="surat-keluar-empty"
                      >
                        Memuat data surat keluar...
                      </td>
                    </tr>

                  ) : currentData.length > 0 ? (

                    currentData.map((item) => (

                      <tr key={item.id}>



                        <td className="surat-keluar-no">
                          {item.no}
                        </td>



                        <td className="surat-keluar-nomor">
                          {item.nomorSurat}
                        </td>



                        <td className="surat-keluar-tanggal">

                          <div className="surat-keluar-date">
                            {item.tanggal}
                          </div>

                        </td>



                        <td className="surat-keluar-asal">

                          <div className="surat-keluar-main-text">
                            {item.asalSurat}
                          </div>

                          {item.asalDetail && (
                            <div className="surat-keluar-secondary-text">
                              {item.asalDetail}
                            </div>
                          )}

                        </td>



                        <td className="surat-keluar-tujuan">

                          <div className="surat-keluar-main-text">
                            {item.tujuan}
                          </div>

                          {item.tujuanDetail && (
                            <div className="surat-keluar-secondary-text">
                              {item.tujuanDetail}
                            </div>
                          )}

                        </td>



                        <td className="surat-keluar-jenis">

                          <span
                            className={`surat-keluar-jenis-badge ${getJenisClass(
                              item.jenis
                            )}`}
                          >
                            {item.jenis}
                          </span>

                        </td>



                        <td className="surat-keluar-keterangan">

                          <div className="surat-keluar-main-text">
                            {item.keterangan}
                          </div>

                          {item.keteranganDetail && (
                            <div className="surat-keluar-keterangan-detail">
                              {item.keteranganDetail}
                            </div>
                          )}

                        </td>

                        <td className="surat-keluar-berkas">
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



                        <td className="surat-keluar-aksi">

                          <div className="surat-keluar-action-wrapper">

                            <button
                              type="button"
                              className="surat-keluar-action-button"
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

                              <div className="surat-keluar-action-menu">

                                <button
                                  type="button"
                                  className="surat-keluar-edit-action"
                                  onClick={() => {
                                    setOpenAction(null);
                                    navigate(`/surat-keluar/${item.id}`);
                                  }}
                                >
                                  Detail
                                </button>

                                <button
                                  type="button"
                                  className="surat-keluar-edit-action"
                                  onClick={() =>
                                    handleEdit(
                                      item
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="surat-keluar-delete-action"
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
                        colSpan="9"
                        className="surat-keluar-empty"
                      >
                        Data surat keluar tidak ditemukan.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>



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

                Surat Keluar

              </p>



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
                        setCurrentPage(page)
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

export default SuratKeluar;