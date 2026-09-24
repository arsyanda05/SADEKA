import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./sidebarmenu";
import Header from "./header";

function Agenda() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");

  const [kategoriOpen, setKategoriOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [openAction, setOpenAction] = useState(null);

  // STATE POPUP
  const [showReminder, setShowReminder] = useState(false);

  const navigate = useNavigate();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  const [dataAgenda, setDataAgenda] = useState([
    {
      no: "001",
      kegiatan: "Rapat RT dan RW",
      kategori: "Kelurahan",
      tanggal: "24/09/2026",
      jam: "07.00-09.00",
      pengingat: "Notifikasi Pop up (H-1)",
      pengingatStatus: "Notifikasi akan muncul",
      pic: "Ibu Siti Aminah",
      status: "Akan Datang",
    },

    {
      no: "002",
      kegiatan: "Pertemuan Kader PKK",
      kategori: "PKK",
      tanggal: "05/09/2026",
      jam: "11.00-12.30",
      pengingat: "Sudah Berbunyi",
      pengingatStatus: "05 Sept, 11.00 WIB",
      pic: "Bapak Budiono",
      status: "Selesai",
    },

    {
      no: "003",
      kegiatan: "Penyuluhan Gizi Balita & Posyandu",
      kategori: "PKK",
      tanggal: "01/09/2026",
      jam: "07.00-10.00",
      pengingat: "Sudah Berbunyi",
      pengingatStatus: "01 Sept, 07.00 WIB",
      pic: "Ibu Nabilla Indah",
      status: "Selesai",
    },

    {
      no: "004",
      kegiatan: "Pelatihan Kewirausahaan Ibu - Ibu PKK",
      kategori: "PKK",
      tanggal: "30/08/2026",
      jam: "09.00-11.30",
      pengingat: "Sudah Berbunyi",
      pengingatStatus: "30 Agst, 09.00 WIB",
      pic: "Ibu Ratna Wijaya",
      status: "Selesai",
    },

    {
      no: "005",
      kegiatan: "Rapat Koordinasi Musrenbang Desa",
      kategori: "Kelurahan",
      tanggal: "12/08/2026",
      jam: "10.00-12.00",
      pengingat: "Sudah Berbunyi",
      pengingatStatus: "12 Agst, 10.00 WIB",
      pic: "Bapak Hendra Wijaya",
      status: "Selesai",
    },

    {
      no: "006",
      kegiatan: "Rapat Koordinasi Kelurahan",
      kategori: "Kelurahan",
      tanggal: "15/08/2026",
      jam: "08.00-10.00",
      pengingat: "Sudah Berbunyi",
      pengingatStatus: "15 Agst, 08.00 WIB",
      pic: "Ibu Siti Aminah",
      status: "Selesai",
    },

    {
      no: "007",
      kegiatan: "Pertemuan Rutin Kader",
      kategori: "PKK",
      tanggal: "18/08/2026",
      jam: "09.00-11.00",
      pengingat: "Sudah Berbunyi",
      pengingatStatus: "18 Agst, 09.00 WIB",
      pic: "Ibu Nabilla Indah",
      status: "Selesai",
    },

    {
      no: "008",
      kegiatan: "Rapat Persiapan Kegiatan Kelurahan",
      kategori: "Kelurahan",
      tanggal: "20/08/2026",
      jam: "13.00-15.00",
      pengingat: "Sudah Berbunyi",
      pengingatStatus: "20 Agst, 13.00 WIB",
      pic: "Bapak Budiono",
      status: "Selesai",
    },

    {
      no: "009",
      kegiatan: "Pemeriksaan Kesehatan Balita",
      kategori: "PKK",
      tanggal: "22/08/2026",
      jam: "08.00-11.00",
      pengingat: "Sudah Berbunyi",
      pengingatStatus: "22 Agst, 08.00 WIB",
      pic: "Ibu Ratna Wijaya",
      status: "Selesai",
    },

    {
      no: "010",
      kegiatan: "Musyawarah Kelurahan",
      kategori: "Kelurahan",
      tanggal: "25/08/2026",
      jam: "10.00-12.00",
      pengingat: "Sudah Berbunyi",
      pengingatStatus: "25 Agst, 10.00 WIB",
      pic: "Bapak Hendra Wijaya",
      status: "Selesai",
    },
  ]);


  const parseTanggal = (tanggal) => {
    const [day, month, year] = tanggal.split("/");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
  };


  const isHMinusOne = (tanggalAgenda) => {
    const hariIni = new Date();
    const tanggalAgendaDate = parseTanggal(tanggalAgenda);

    hariIni.setHours(0, 0, 0, 0);
    tanggalAgendaDate.setHours(0, 0, 0, 0);

    const selisihWaktu =
      tanggalAgendaDate.getTime() -
      hariIni.getTime();

    const satuHari =
      24 * 60 * 60 * 1000;

    const selisihHari =
      Math.round(selisihWaktu / satuHari);

    console.log(
      "Hari ini:",
      hariIni.toLocaleDateString("id-ID")
    );

    console.log(
      "Tanggal agenda:",
      tanggalAgenda
    );

    console.log(
      "Selisih hari:",
      selisihHari
    );

    return selisihHari === 1;
  };


  const reminderAgenda = dataAgenda.find(
    (item) =>
      item.pengingat ===
      "Notifikasi Pop up (H-1)"
  );


  useEffect(() => {
    if (!reminderAgenda) {
      setShowReminder(false);
      return;
    }

    const cekHMinusOne = isHMinusOne(
      reminderAgenda.tanggal
    );

    setShowReminder(cekHMinusOne);
  }, [reminderAgenda.tanggal]);


  const filteredData = dataAgenda.filter((item) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      item.no.toLowerCase().includes(keyword) ||
      item.kegiatan.toLowerCase().includes(keyword) ||
      item.kategori.toLowerCase().includes(keyword) ||
      item.tanggal.toLowerCase().includes(keyword) ||
      item.jam.toLowerCase().includes(keyword) ||
      item.pic.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword);

    const matchesKategori =
      kategori === "" ||
      item.kategori === kategori;

    return matchesSearch && matchesKategori;
  });


  const itemsPerPage = 5;

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


  const changeKategori = (value) => {
    setKategori(value);
    setKategoriOpen(false);
    setCurrentPage(1);
  };

  const handleEdit = (item) => {
    setOpenAction(null);
    navigate(`/agenda/${item.no}/edit`, {
      state: { agenda: item },
    });
  };

  const handleDelete = (item) => {
    const confirmed = window.confirm(
      `Hapus agenda "${item.kegiatan}"?`
    );

    if (!confirmed) {
      return;
    }

    setDataAgenda((previous) =>
      previous.filter((agenda) => agenda.no !== item.no)
    );
    setOpenAction(null);
  };


  const closeReminder = () => {
    setShowReminder(false);
  };

  return (
    <div className="agenda-page">


      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />


      <main className="agenda-main">


        <Header
          title="Agenda"
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


        <section className="agenda-content">


          <div className="agenda-top-action">

            <button
              type="button"
              className="add-agenda-button"
              onClick={() =>
                navigate("/agenda/tambah")
              }
            >
              <span>+</span>
              Tambah Agenda
            </button>

          </div>


          <div className="agenda-table-card">


            <div className="table-top">

              <h2>Daftar Agenda</h2>


              <div className="filter-wrapper">

                <span className="filter-label">
                  Filter
                </span>

                <div className="simple-dropdown">

                  <button
                    type="button"
                    className="filter-button"
                    onClick={() =>
                      setKategoriOpen(
                        (prev) => !prev
                      )
                    }
                  >
                    {kategori || "Kategori"}

                    <span className="dropdown-arrow">
                      ▼
                    </span>
                  </button>

                  {kategoriOpen && (
                    <div className="simple-menu">

                      <div
                        className="simple-item"
                        onClick={() =>
                          changeKategori("")
                        }
                      >
                        Semua Kategori
                      </div>

                      <div
                        className="simple-item"
                        onClick={() =>
                          changeKategori(
                            "Kelurahan"
                          )
                        }
                      >
                        Kelurahan
                      </div>

                      <div
                        className="simple-item"
                        onClick={() =>
                          changeKategori("PKK")
                        }
                      >
                        PKK
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>


            <div className="table-scroll">

              <table className="agenda-table">

                <thead>

                  <tr>
                    <th>No</th>
                    <th>Kegiatan</th>
                    <th>Kategori</th>
                    <th>Tanggal</th>
                    <th>Jam</th>
                    <th>Pengingat Agenda</th>
                    <th>PIC</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>

                </thead>

                <tbody>

                  {currentData.length > 0 ? (

                    currentData.map((item) => (

                      <tr key={item.no}>

                        <td className="agenda-no">
                          {item.no}
                        </td>

                        <td className="agenda-kegiatan">
                          {item.kegiatan}
                        </td>

                        <td className="agenda-kategori">
                          {item.kategori}
                        </td>

                        <td className="agenda-tanggal">
                          {item.tanggal}
                        </td>

                        <td className="agenda-jam">
                          {item.jam}
                        </td>

                        <td className="agenda-pengingat">

                          {item.pengingat && (
                            <div
                              className={
                                item.pengingat ===
                                "Notifikasi Pop up (H-1)"
                                  ? "reminder-badge reminder-warning"
                                  : "reminder-badge reminder-success"
                              }
                            >

                              {item.pengingat ===
                              "Sudah Berbunyi" ? (
                                <>
                                  <span className="reminder-icon">
                                    ✓
                                  </span>

                                  <span>
                                    Sudah
                                    <br />
                                    Berbunyi
                                  </span>
                                </>
                              ) : (
                                <span>
                                  Notifikasi Pop
                                  <br />
                                  up (H-1)
                                </span>
                              )}

                            </div>
                          )}

                          <div className="reminder-time">

                            <span className="clock-icon">
                              ◷
                            </span>

                            {item.pengingatStatus}

                          </div>

                        </td>

                        <td className="agenda-pic">
                          {item.pic}
                        </td>

                        <td className="agenda-status">

                          {item.status && (
                            <span
                              className={
                                item.status ===
                                "Selesai"
                                  ? "agenda-status-selesai"
                                  : "agenda-status-datang"
                              }
                            >
                              {item.status}
                            </span>
                          )}

                        </td>

                        <td className="agenda-action-cell">
                          <div className="agenda-action-wrapper">
                            <button
                              type="button"
                              className="agenda-action-button"
                              onClick={() =>
                                setOpenAction(
                                  openAction === item.no
                                    ? null
                                    : item.no
                                )
                              }
                              aria-label={`Aksi agenda ${item.no}`}
                            >
                              ⋮
                            </button>

                            {openAction === item.no && (
                              <div className="agenda-action-menu">
                                <button
                                  type="button"
                                  className="agenda-edit-action"
                                  onClick={() => handleEdit(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="agenda-delete-action"
                                  onClick={() => handleDelete(item)}
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
                        className="empty-table"
                      >
                        Data agenda tidak ditemukan.
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

                agenda

              </p>


              <div className="pagination">

                <button
                  type="button"
                  className="page-prev"
                  disabled={
                    safeCurrentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                >
                  <span>←</span>
                  <span>Sebelumnya</span>
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                )
                  .slice(0, 3)
                  .map((page) => (

                    <button
                      type="button"
                      key={page}
                      className={
                        safeCurrentPage === page
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
                    setCurrentPage((page) =>
                      Math.min(
                        totalPages,
                        page + 1
                      )
                    )
                  }
                >
                  <span>Selanjutnya</span>
                  <span>→</span>
                </button>

              </div>

            </div>

          </div>

        </section>

      </main>


      {showReminder && reminderAgenda && (

        <div className="agenda-reminder-overlay">

          <div className="agenda-reminder-popup">


            <div className="agenda-reminder-header">

              <span className="agenda-reminder-label">
                Pengingat Agenda (H-1)
              </span>

              <button
                type="button"
                className="agenda-reminder-close"
                onClick={closeReminder}
                aria-label="Tutup pengingat"
              >
                ×
              </button>

            </div>


            <div className="agenda-reminder-title">

              <h3>
                Agenda mendatang besok :
              </h3>

              <strong>
                {reminderAgenda.kegiatan}
              </strong>

            </div>


            <div className="agenda-reminder-scheduled">

              <div className="scheduled-date">

                <span className="scheduled-icon">
                  ▣
                </span>

                <span>
                  Telah terjadwalkan di Agenda
                </span>

              </div>

            </div>


            <div className="agenda-reminder-detail">

              <div className="agenda-reminder-row">

                <span className="agenda-reminder-detail-icon">
                  ▣
                </span>

                <strong>
                  {reminderAgenda.tanggal}
                </strong>

                <span className="agenda-reminder-clock">
                  ◷
                </span>

                <strong>
                  {reminderAgenda.jam}
                </strong>

              </div>

              <div className="agenda-reminder-pic">

                <span>
                  PIC :
                </span>

                <strong>
                  {reminderAgenda.pic}
                </strong>

              </div>

            </div>

            {/* INFORMASI PENGINGAT */}

            <div className="agenda-reminder-info">

              <span className="agenda-reminder-info-icon">
                ⓘ
              </span>

              <span>
                Pengingat ini akan otomatis muncul
                sesuai konfigurasi pada menu
                pengingat agenda.{" "}

                <strong>
                  Alarm pop up sistem akan
                  diperoleh H-1
                </strong>
              </span>

            </div>


            <div className="agenda-reminder-actions">

              <button
                type="button"
                className="agenda-reminder-later"
                onClick={closeReminder}
              >

                <span>
                  ◷
                </span>

                <span>
                  Tutup & Ingatkan
                  <br />
                  Lagi Nanti
                </span>

              </button>

              <button
                type="button"
                className="agenda-reminder-confirm"
                onClick={closeReminder}
              >

                <span>
                  ✓
                </span>

                <span>
                  Tandai Sudah Siap
                  <br />
                  / Konfirmasi Hadir
                </span>

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Agenda;