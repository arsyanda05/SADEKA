import { useState } from "react";
import { useNavigate } from "react-router-dom";
import smartDocIcon from "../assets/smartdoc.png";
import SideBar from "./sidebarmenu";
import Header from "./header";

function SuratKeluar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jenis, setJenis] = useState("");

  const [tanggalOpen, setTanggalOpen] = useState(false);
  const [jenisOpen, setJenisOpen] = useState(false);

  const [openAction, setOpenAction] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [dataSurat, setDataSurat] = useState([
    {
      no: "001",
      nomorSurat: "005/105/Kel.Sby/XI/2026",
      tanggal: "10/09/2026",
      asalSurat: "Sekretaris Lurah",
      asalDetail: "Tata Kelola Usaha",
      tujuan: "Bpk. Hendra Gunawan",
      tujuanDetail: "Ketua RW 02",
      jenis: "Surat Keterangan Usaha",
      keterangan: "Legalisasi UMKM",
      keteranganDetail: "TTE BSRE Terverifikasi",
    },

    {
      no: "002",
      nomorSurat: "005/207/Kel.Sby/XI/2025",
      tanggal: "02/01/2025",
      asalSurat: "Seksi Keamanan",
      asalDetail: "Satlintas Kota Surabaya",
      tujuan: "Lurah Sukolilo",
      tujuanDetail: "Pemerintah Kec.Sukolilo",
      jenis: "Undangan Rapat",
      keterangan: "Musrenbangkel",
      keteranganDetail: "TTE BSRE Terverifikasi",
    },

    {
      no: "003",
      nomorSurat: "031/023/Kel.Sby/XI/2025",
      tanggal: "20/05/2025",
      asalSurat: "Seksi Pelayanan Publik",
      asalDetail: "Loket 2 adm",
      tujuan: "DispendukCapil Surabaya",
      tujuanDetail: "Instansi Dinas Kota",
      jenis: "Pengantar",
      keterangan: "Pengantar Kependudukan Warga",
      keteranganDetail: "TTE BSRE Terverifikasi",
    },

    {
      no: "004",
      nomorSurat: "800/006/Kel.Sby/XI/2023",
      tanggal: "11/08/2023",
      asalSurat: "Seksi Pelayanan Publik",
      asalDetail: "Loket 3 adm",
      tujuan: "Danramil Rungkut",
      tujuanDetail: "Komando Rayon Militer",
      jenis: "Rekomendasi",
      keterangan: "Rekomendasi Izin",
      keteranganDetail: "Cap Basah Kelurahan",
    },

    {
      no: "005",
      nomorSurat: "093/109/Kel.Sby/XI/2022",
      tanggal: "09/09/2022",
      asalSurat: "Sekretaris Lurah",
      asalDetail: "Tata Usaha Kelurahan",
      tujuan: "Ibu Asiyah",
      tujuanDetail: "Warga Pemohon (RT 15)",
      jenis: "Surat Keterangan Usaha",
      keterangan: "Legalisir Surat UMKM",
      keteranganDetail: "TTE BSRE Terverifikasi",
    },
  ]);

  const navigate = useNavigate();

  const itemsPerPage = 5;

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

  const handleSmartDocument = () => {
    navigate("/surat-keluar/smart-document");
  };

  const handleEdit = (item) => {
    setOpenAction(null);

    navigate(
      `/surat-keluar/${item.no}/edit`,
      {
        state: {
          surat: item,
        },
      }
    );
  };

  const handleDelete = (item) => {
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

    setDataSurat((prevData) =>
      prevData.filter(
        (surat) => surat.no !== item.no
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
  };

  const toggleAction = (no) => {
    setOpenAction((prev) =>
      prev === no ? null : no
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

      {/* SIDEBAR */}

      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* MAIN */}

      <main className="surat-keluar-main">

        {/* HEADER */}

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

        {/* CONTENT */}

        <section className="surat-keluar-content">

          {/* TOP ACTION */}

          <div className="surat-keluar-top-action">

            <div className="surat-keluar-top-buttons">

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

          {/* TABLE CARD */}

          <div className="surat-keluar-table-card">

            {/* TABLE TOP */}

            <div className="table-top">

              <h2>
                Daftar Surat Keluar
              </h2>

              {/* FILTER */}

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

            {/* TABLE */}

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
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>

                  {currentData.length > 0 ? (

                    currentData.map((item) => (

                      <tr key={item.no}>

                        {/* NO */}

                        <td className="surat-keluar-no">
                          {item.no}
                        </td>

                        {/* NOMOR SURAT */}

                        <td className="surat-keluar-nomor">
                          {item.nomorSurat}
                        </td>

                        {/* TANGGAL */}

                        <td className="surat-keluar-tanggal">

                          <div className="surat-keluar-date">
                            {item.tanggal}
                          </div>

                        </td>

                        {/* ASAL SURAT */}

                        <td className="surat-keluar-asal">

                          <div className="surat-keluar-main-text">
                            {item.asalSurat}
                          </div>

                          <div className="surat-keluar-secondary-text">
                            {item.asalDetail}
                          </div>

                        </td>

                        {/* TUJUAN */}

                        <td className="surat-keluar-tujuan">

                          <div className="surat-keluar-main-text">
                            {item.tujuan}
                          </div>

                          <div className="surat-keluar-secondary-text">
                            {item.tujuanDetail}
                          </div>

                        </td>

                        {/* JENIS */}

                        <td className="surat-keluar-jenis">

                          <span
                            className={`surat-keluar-jenis-badge ${getJenisClass(
                              item.jenis
                            )}`}
                          >
                            {item.jenis}
                          </span>

                        </td>

                        {/* KETERANGAN */}

                        <td className="surat-keluar-keterangan">

                          <div className="surat-keluar-main-text">
                            {item.keterangan}
                          </div>

                          <div className="surat-keluar-keterangan-detail">
                            {item.keteranganDetail}
                          </div>

                        </td>

                        {/* AKSI */}

                        <td className="surat-keluar-aksi">

                          <div className="surat-keluar-action-wrapper">

                            <button
                              type="button"
                              className="surat-keluar-action-button"
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

                              <div className="surat-keluar-action-menu">

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
                        colSpan="8"
                        className="surat-keluar-empty"
                      >
                        Data surat keluar tidak ditemukan.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* FOOTER */}

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