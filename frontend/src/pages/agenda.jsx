import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./sidebarmenu";
import Header from "./header";
import {
  getAgenda,
  deleteAgenda,
  updateAgendaReminderSnooze,
  confirmAgendaReminder,
} from "../services/api.js";

function Agenda() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");

  const [kategoriOpen, setKategoriOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [openAction, setOpenAction] = useState(null);

  const [dataAgenda, setDataAgenda] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ================================
  // STATE UNTUK REMINDER
  // ================================
  const [showReminder, setShowReminder] = useState(false);

  const [dismissedReminderIds, setDismissedReminderIds] =
    useState([]);

  // Digunakan untuk mengecek waktu reminder secara berkala
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  // ================================
  // SIDEBAR
  // ================================
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // ================================
  // FORMAT TANGGAL
  // ================================
  const formatTanggal = (tanggal) => {
    if (!tanggal) {
      return "";
    }

    const date = new Date(tanggal);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // ================================
  // FORMAT JAM
  // ================================
  const formatJam = (jam) => {
    if (!jam) {
      return "";
    }

    return String(jam)
      .replace(/:/g, ".")
      .trim();
  };

  // ================================
  // STATUS AGENDA
  // ================================
  const getStatusAgenda = (tanggal) => {
    if (!tanggal) {
      return "";
    }

    const sekarang = new Date();
    const tanggalAgenda = new Date(tanggal);

    sekarang.setHours(0, 0, 0, 0);
    tanggalAgenda.setHours(0, 0, 0, 0);

    if (tanggalAgenda < sekarang) {
      return "Selesai";
    }

    return "Akan Datang";
  };

  // ================================
  // FORMAT DATA AGENDA
  // ================================
  const formatAgenda = (agenda) => {
    const tanggalFormatted = formatTanggal(
      agenda.tanggal
    );

    const status = getStatusAgenda(
      agenda.tanggal
    );

    const pengingatMenit =
      agenda.pengingat_menit ?? 1440;

    let pengingat =
      "Notifikasi Pop up (H-1)";

    let pengingatStatus =
      "Notifikasi akan muncul";

    if (status === "Selesai") {
      pengingat = "Sudah Berbunyi";

      const tanggal = new Date(
        agenda.tanggal
      );

      const day = String(
        tanggal.getDate()
      ).padStart(2, "0");

      const month = String(
        tanggal.getMonth() + 1
      ).padStart(2, "0");

      const jam = agenda.jam
        ? String(agenda.jam)
            .replace(/:/g, ".")
            .substring(0, 5)
        : "";

      pengingatStatus =
        `${day} ${tanggal.toLocaleString(
          "id-ID",
          {
            month: "short",
          }
        )}, ${jam} WIB`;
    } else if (pengingatMenit === 1440) {
      pengingat =
        "Notifikasi Pop up (H-1)";

      pengingatStatus =
        "Notifikasi akan muncul";
    }

    return {
      id_agenda: agenda.id_agenda,

      no: String(
        agenda.id_agenda
      ).padStart(3, "0"),

      kegiatan: agenda.kegiatan || "",

      kategori: agenda.kategori || "",

      tanggal: tanggalFormatted,

      jam: formatJam(agenda.jam),

      pengingat,

      pengingatStatus,

      pic: agenda.PIC || "",

      status,

      // ================================
      // DATA REMINDER DARI DATABASE
      // ================================
      status_pengingat:
        agenda.status_pengingat ||
        "MENUNGGU",

      waktu_pengingat_berikutnya:
        agenda.waktu_pengingat_berikutnya ||
        null,

      waktu_pengingat:
        agenda.waktu_pengingat ||
        null,
    };
  };

  // ================================
  // LOAD DATA AGENDA
  // ================================
  const loadAgenda = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAgenda();

      const formattedData = result.map(
        formatAgenda
      );

      setDataAgenda(formattedData);
    } catch (error) {
      console.error(
        "Error mengambil agenda:",
        error
      );

      setError(
        error.message ||
          "Gagal mengambil data agenda"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load agenda pertama kali
  useEffect(() => {
    loadAgenda();
  }, []);

  // ================================
  // CEK WAKTU SETIAP 30 DETIK
  // ================================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ================================
  // PARSE TANGGAL
  // ================================
  const parseTanggal = (tanggal) => {
    if (!tanggal) {
      return null;
    }

    const [day, month, year] =
      tanggal.split("/");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
  };

  // ================================
  // CEK H-1
  // ================================
  const isHMinusOne = (tanggalAgenda) => {
    if (!tanggalAgenda) {
      return false;
    }

    const hariIni = new Date();

    const tanggalAgendaDate =
      parseTanggal(tanggalAgenda);

    if (!tanggalAgendaDate) {
      return false;
    }

    hariIni.setHours(0, 0, 0, 0);

    tanggalAgendaDate.setHours(
      0,
      0,
      0,
      0
    );

    const selisihWaktu =
      tanggalAgendaDate.getTime() -
      hariIni.getTime();

    const satuHari =
      24 * 60 * 60 * 1000;

    const selisihHari = Math.round(
      selisihWaktu / satuHari
    );

    return selisihHari === 1;
  };

  // ================================
  // CEK APAKAH WAKTU TUNDA SUDAH TIBA
  // ================================
  const isWaktuPengingatBerikutnyaTiba = (
    item
  ) => {
    if (
      item.status_pengingat !==
      "DITUNDA"
    ) {
      return false;
    }

    if (
      !item.waktu_pengingat_berikutnya
    ) {
      return false;
    }

    const waktuBerikutnya =
      new Date(
        item.waktu_pengingat_berikutnya
      );

    if (
      Number.isNaN(
        waktuBerikutnya.getTime()
      )
    ) {
      return false;
    }

    return currentTime >= waktuBerikutnya;
  };

  // ================================
  // TENTUKAN AGENDA YANG HARUS MUNCUL
  // ================================
  const reminderAgenda = dataAgenda.find(
    (item) => {
      // Kalau sudah dikonfirmasi,
      // jangan pernah tampilkan lagi.
      if (
        item.status_pengingat ===
        "DIKONFIRMASI"
      ) {
        return false;
      }

      // ================================
      // REMINDER NORMAL H-1
      // ================================
      const reminderHMinusOne =
        item.status_pengingat ===
          "MENUNGGU" &&
        item.pengingat ===
          "Notifikasi Pop up (H-1)" &&
        isHMinusOne(item.tanggal);

      // ================================
      // REMINDER SETELAH DITUNDA
      // ================================
      const reminderDitunda =
        item.status_pengingat ===
          "DITUNDA" &&
        isWaktuPengingatBerikutnyaTiba(
          item
        );

      // ================================
      // CEK DISMISS
      // ================================
      if (
        dismissedReminderIds.includes(
          item.id_agenda
        )
      ) {
        // Jika waktu tunda sudah tiba,
        // tetap boleh muncul lagi.
        if (reminderDitunda) {
          return true;
        }

        return false;
      }

      return (
        reminderHMinusOne ||
        reminderDitunda
      );
    }
  );

  // ================================
  // TAMPILKAN POPUP REMINDER
  // ================================
  useEffect(() => {
    if (!reminderAgenda) {
      return;
    }

    setShowReminder(true);
  }, [
    reminderAgenda?.id_agenda,
    reminderAgenda?.status_pengingat,
    reminderAgenda?.waktu_pengingat_berikutnya,
    currentTime,
  ]);

  // ================================
  // FILTER DATA
  // ================================
  const filteredData = dataAgenda.filter(
    (item) => {
      const keyword =
        search.toLowerCase();

      const matchesSearch =
        item.no
          .toLowerCase()
          .includes(keyword) ||
        item.kegiatan
          .toLowerCase()
          .includes(keyword) ||
        item.kategori
          .toLowerCase()
          .includes(keyword) ||
        item.tanggal
          .toLowerCase()
          .includes(keyword) ||
        item.jam
          .toLowerCase()
          .includes(keyword) ||
        item.pic
          .toLowerCase()
          .includes(keyword) ||
        item.status
          .toLowerCase()
          .includes(keyword);

      const matchesKategori =
        kategori === "" ||
        item.kategori === kategori;

      return (
        matchesSearch &&
        matchesKategori
      );
    }
  );

  // ================================
  // PAGINATION
  // ================================
  const itemsPerPage = 5;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length /
        itemsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    itemsPerPage;

  const currentData =
    filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // ================================
  // FILTER KATEGORI
  // ================================
  const changeKategori = (value) => {
    setKategori(value);
    setKategoriOpen(false);
    setCurrentPage(1);
  };

  // ================================
  // EDIT
  // ================================
  const handleEdit = (item) => {
    setOpenAction(null);

    navigate(
      `/agenda/${item.id_agenda}/edit`,
      {
        state: {
          agenda: item,
        },
      }
    );
  };

  // ================================
  // DELETE
  // ================================
  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Hapus agenda "${item.kegiatan}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAgenda(
        item.id_agenda
      );

      setDataAgenda(
        (previous) =>
          previous.filter(
            (agenda) =>
              agenda.id_agenda !==
              item.id_agenda
          )
      );

      setOpenAction(null);

      alert(
        "Agenda berhasil dihapus"
      );
    } catch (error) {
      console.error(
        "Error menghapus agenda:",
        error
      );

      alert(
        error.message ||
          "Gagal menghapus agenda"
      );
    }
  };

  // ================================
  // TUTUP POPUP DENGAN X
  // ================================
  const closeReminder = () => {
    if (reminderAgenda) {
      setDismissedReminderIds(
        (previous) => {
          if (
            previous.includes(
              reminderAgenda.id_agenda
            )
          ) {
            return previous;
          }

          return [
            ...previous,
            reminderAgenda.id_agenda,
          ];
        }
      );
    }

    setShowReminder(false);
  };

  // ================================
  // TUNDA REMINDER
  // ================================
  const handleReminderLater =
    async () => {
      if (!reminderAgenda) {
        return;
      }

      const reminderId =
        reminderAgenda.id_agenda;

      try {
        // Simpan status DITUNDA
        // dan waktu berikutnya ke database.
        await updateAgendaReminderSnooze(
          reminderId
        );

        // Ambil kembali data dari database
        // agar waktu_pengingat_berikutnya
        // ikut diperbarui di frontend.
        await loadAgenda();

        // Tutup popup.
        setShowReminder(false);

        // Hapus dari dismissed.
        // Karena reminder harus bisa muncul
        // lagi ketika waktu tunda tercapai.
        setDismissedReminderIds(
          (previous) =>
            previous.filter(
              (id) =>
                id !== reminderId
            )
        );
      } catch (error) {
        console.error(
          "Error menunda pengingat:",
          error
        );

        alert(
          error.message ||
            "Gagal menunda pengingat"
        );
      }
    };

  // ================================
  // KONFIRMASI REMINDER
  // ================================
  const handleReminderConfirm =
    async () => {
      if (!reminderAgenda) {
        return;
      }

      const reminderId =
        reminderAgenda.id_agenda;

      try {
        // Ubah status reminder
        // menjadi DIKONFIRMASI di database.
        await confirmAgendaReminder(
          reminderId
        );

        // Ambil kembali data terbaru.
        await loadAgenda();

        // Tutup popup.
        setShowReminder(false);

        // Masukkan ID ke dismissed
        // supaya tidak muncul kembali.
        setDismissedReminderIds(
          (previous) => {
            if (
              previous.includes(
                reminderId
              )
            ) {
              return previous;
            }

            return [
              ...previous,
              reminderId,
            ];
          }
        );
      } catch (error) {
        console.error(
          "Error mengonfirmasi agenda:",
          error
        );

        alert(
          error.message ||
            "Gagal mengonfirmasi agenda"
        );
      }
    };

  return (
    <div className="agenda-page">

      {/* ================================
          SIDEBAR
      ================================= */}

      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* ================================
          MAIN
      ================================= */}

      <main className="agenda-main">

        <Header
          title="Agenda"
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

        <section className="agenda-content">

          {/* ================================
              TOMBOL TAMBAH
          ================================= */}

          <div className="agenda-top-action">

            <button
              type="button"
              className="add-agenda-button"
              onClick={() =>
                navigate(
                  "/agenda/tambah"
                )
              }
            >
              <span>+</span>
              Tambah Agenda
            </button>

          </div>

          {/* ================================
              TABLE CARD
          ================================= */}

          <div className="agenda-table-card">

            <div className="table-top">

              <h2>
                Daftar Agenda
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
                      setKategoriOpen(
                        (prev) =>
                          !prev
                      )
                    }
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
                        onClick={() =>
                          changeKategori(
                            ""
                          )
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
                          changeKategori(
                            "PKK"
                          )
                        }
                      >
                        PKK
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* ================================
                TABLE
            ================================= */}

            <div className="table-scroll">

              <table className="agenda-table">

                <thead>

                  <tr>
                    <th>No</th>
                    <th>Kegiatan</th>
                    <th>Kategori</th>
                    <th>Tanggal</th>
                    <th>Jam</th>
                    <th>
                      Pengingat Agenda
                    </th>
                    <th>PIC</th>
                    <th>Status</th>
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
                        Memuat data agenda...
                      </td>
                    </tr>

                  ) : error ? (

                    <tr>
                      <td
                        colSpan="9"
                        className="empty-table"
                      >
                        {error}
                      </td>
                    </tr>

                  ) : currentData.length >
                    0 ? (

                    currentData.map(
                      (item) => (

                        <tr
                          key={
                            item.id_agenda
                          }
                        >

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

                              {
                                item.pengingatStatus
                              }

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
                                {
                                  item.status
                                }
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
                                    openAction ===
                                      item.id_agenda
                                      ? null
                                      : item.id_agenda
                                  )
                                }
                                aria-label={`Aksi agenda ${item.no}`}
                              >
                                ⋮
                              </button>

                              {openAction ===
                                item.id_agenda && (

                                <div className="agenda-action-menu">

                                  <button
                                    type="button"
                                    className="agenda-edit-action"
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
                                    className="agenda-delete-action"
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
                        colSpan="9"
                        className="empty-table"
                      >
                        Data agenda tidak
                        ditemukan.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* ================================
                FOOTER
            ================================= */}

            <div className="table-footer">

              <p>

                Menampilkan{" "}

                <strong>
                  {filteredData.length ===
                  0
                    ? "0"
                    : `${startIndex + 1}-${Math.min(
                        startIndex +
                          itemsPerPage,
                        filteredData.length
                      )}`}
                </strong>{" "}

                dari{" "}

                <strong>
                  {
                    filteredData.length
                  }
                </strong>{" "}

                agenda

              </p>

              <div className="pagination">

                <button
                  type="button"
                  className="page-prev"
                  disabled={
                    safeCurrentPage ===
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
                  <span>←</span>
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
                )
                  .slice(0, 3)
                  .map(
                    (page) => (

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

                    )
                  )}

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

      {/* ==================================================
          POPUP REMINDER
      ================================================== */}

      {showReminder &&
        reminderAgenda && (

          <div className="agenda-reminder-overlay">

            <div className="agenda-reminder-popup">

              <div className="agenda-reminder-header">

                <span className="agenda-reminder-label">
                  {reminderAgenda.status_pengingat ===
                  "DITUNDA"
                    ? "Pengingat Agenda"
                    : "Pengingat Agenda (H-1)"}
                </span>

                <button
                  type="button"
                  className="agenda-reminder-close"
                  onClick={
                    closeReminder
                  }
                  aria-label="Tutup pengingat"
                >
                  ×
                </button>

              </div>

              <div className="agenda-reminder-title">

                <h3>
                  {reminderAgenda.status_pengingat ===
                  "DITUNDA"
                    ? "Pengingat agenda kembali :"
                    : "Agenda mendatang besok :"}
                </h3>

                <strong>
                  {
                    reminderAgenda.kegiatan
                  }
                </strong>

              </div>

              <div className="agenda-reminder-scheduled">

                <div className="scheduled-date">

                  <span>
                    Telah terjadwalkan
                    di Agenda
                  </span>

                </div>

              </div>

              <div className="agenda-reminder-detail">

                <div className="agenda-reminder-row">

                  <strong>
                    {
                      reminderAgenda.tanggal
                    }
                  </strong>

                  <span className="agenda-reminder-clock">
                    ◷
                  </span>

                  <strong>
                    {
                      reminderAgenda.jam
                    }
                  </strong>

                </div>

                <div className="agenda-reminder-pic">

                  <span>
                    PIC :
                  </span>

                  <strong>
                    {
                      reminderAgenda.pic
                    }
                  </strong>

                </div>

              </div>

              <div className="agenda-reminder-info">

                <span className="agenda-reminder-info-icon">
                  ⓘ
                </span>

                <span>
                  {reminderAgenda.status_pengingat ===
                  "DITUNDA"
                    ? (
                      <>
                        Pengingat agenda
                        sebelumnya ditunda.
                        Pengingat akan muncul
                        kembali setelah waktu
                        tunda tercapai.
                      </>
                    )
                    : (
                      <>
                        Pengingat ini akan
                        otomatis muncul
                        sesuai konfigurasi
                        pada menu pengingat
                        agenda.{" "}

                        <strong>
                          Alarm pop up sistem
                          akan diperoleh H-1
                        </strong>
                      </>
                    )}
                </span>

              </div>

              <div className="agenda-reminder-actions">

                {/* ================================
                    TUNDA
                ================================= */}

                <button
                  type="button"
                  className="agenda-reminder-later"
                  onClick={
                    handleReminderLater
                  }
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

                {/* ================================
                    KONFIRMASI
                ================================= */}

                <button
                  type="button"
                  className="agenda-reminder-confirm"
                  onClick={
                    handleReminderConfirm
                  }
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