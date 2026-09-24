import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./sidebarmenu";
import Header from "./header";

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


  const [dataPenduduk, setDataPenduduk] = useState([
    {
      no: "001",
      nama: "Budiono Suhari",
      nik: "35782750000202",
      tempatLahir: "Surabaya",
      tanggalLahir: "10 Agustus 1975",
      alamat: "Jl Cendrawasih No 9",
      rt: "02",
      rw: "02",
      jk: "L",
      status: "Tetap",
    },
    {
      no: "002",
      nama: "Rizky Ramadhan",
      nik: "35782750602001",
      tempatLahir: "Tasikmalaya",
      tanggalLahir: "20 November 2001",
      alamat: "Jl Sari Asri Block B",
      rt: "07",
      rw: "08",
      jk: "L",
      status: "Sementara",
    },
    {
      no: "003",
      nama: "Aisyah Salsabil",
      nik: "35782760150003",
      tempatLahir: "Bekasi",
      tanggalLahir: "05 Desember 1998",
      alamat: "Jl Komp. Candi Block AE",
      rt: "06",
      rw: "08",
      jk: "P",
      status: "Meninggal",
    },
    {
      no: "004",
      nama: "Siti Nuraini",
      nik: "35782725045000",
      tempatLahir: "Solo",
      tanggalLahir: "12 Mei 1988",
      alamat: "Jl Cendana Block C No 8",
      rt: "05",
      rw: "08",
      jk: "P",
      status: "Tetap",
    },
    {
      no: "005",
      nama: "Reza Saputra",
      nik: "35782767200012",
      tempatLahir: "Sumatra",
      tanggalLahir: "22 Juli 2000",
      alamat: "Jl Keputusan No 11",
      rt: "09",
      rw: "10",
      jk: "L",
      status: "Pindah",
    },
  ]);


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
    "Pindah",
  ];

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


  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  const closeAllDropdown = () => {
    setRtOpen(false);
    setRwOpen(false);
    setStatusOpen(false);
  };


  const handleEdit = (item) => {
    setOpenAction(null);

    navigate(
      `/data-penduduk/${item.no}/edit`,
      {
        state: {
          penduduk: item,
        },
      }
    );
  };


  const handleDelete = (item) => {
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

    if (!confirmed) {
      return;
    }

    setDataPenduduk((prev) =>
      prev.filter(
        (data) => data.no !== item.no
      )
    );

    setOpenAction(null);

    if (
      currentData.length === 1 &&
      currentPage > 1
    ) {
      setCurrentPage(
        (page) => page - 1
      );
    }
  };

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


          <div className="penduduk-table-card">


            <div className="penduduk-table-top">

              <h2>
                Daftar Penduduk
              </h2>

              <div className="penduduk-filter-wrapper">

                <span className="penduduk-filter-label">
                  Filter
                </span>

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


                {/* =============================================
                    FILTER STATUS
                ============================================= */}

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
                TABLE
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

                  {currentData.length > 0 ? (

                    currentData.map(
                      (item) => (

                        <tr key={item.no}>

                          {/* =================================
                              NO
                          ================================= */}

                          <td className="penduduk-col-no">

                            <span className="penduduk-number">
                              {item.no}
                            </span>

                          </td>


                          {/* =================================
                              NAMA
                          ================================= */}

                          <td className="penduduk-col-nama">

                            <div className="penduduk-name">
                              {item.nama}
                            </div>

                          </td>


                          {/* =================================
                              NIK
                          ================================= */}

                          <td className="penduduk-col-nik">

                            <div className="penduduk-nik">
                              {item.nik}
                            </div>

                          </td>


                          {/* =================================
                              TTL
                          ================================= */}

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


                          {/* =================================
                              ALAMAT
                          ================================= */}

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


                          {/* =================================
                              JENIS KELAMIN
                          ================================= */}

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


                          {/* =================================
                              STATUS
                          ================================= */}

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


                          {/* =================================
                              AKSI
                          ================================= */}

                          <td className="penduduk-col-aksi">

                            <div className="penduduk-actions">

                              <button
                                type="button"
                                className="penduduk-action-button"
                                onClick={() =>
                                  setOpenAction(
                                    openAction ===
                                      item.no
                                      ? null
                                      : item.no
                                  )
                                }
                                aria-label={`Aksi untuk ${item.nama}`}
                                title="Aksi"
                              >
                                ⋮
                              </button>


                              {openAction ===
                                item.no && (

                                <div className="penduduk-action-menu">

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
                FOOTER
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


              {/* =============================================
                  PAGINATION
              ============================================= */}

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
                    length: totalPages,
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


      {/* =================================================
          OVERLAY DROPDOWN
      ================================================= */}

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