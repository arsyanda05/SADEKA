import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./sidebarmenu";
import Header from "./header";

import pegawaiIcon from "../assets/pegawai.png";
import asnIcon from "../assets/asn.png";
import pppkIcon from "../assets/p3k.png";
import pdfIcon from "../assets/pdf.png";

function DataPegawai() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [statusOpen, setStatusOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [expandedRow, setExpandedRow] = useState(null);
  const [openAction, setOpenAction] = useState(null);

  const navigate = useNavigate();

  const closeSidebar = () => setSidebarOpen(false);


  const [dataPegawai, setDataPegawai] = useState([
    {
      no: "001",
      nama: "Budi Santoso, S.E.",
      nip: "NIP:1975234908200123",
      jabatan: "Kepala Kelurahan (lurah)",
      status: "ASN",
      telepon: "0812239456788",
      email: "budiSantoso@kelurahan.go.id",
      domisili: "Jl. Cempaka Asri No 56, Surabaya",

      dokumen: 5,
      diklat: 3,

      dokumenList: [
        {
          nama: "Ijazah S1 Ekonomi Manajemen",
          detail: "Ijazah S1 Ekonomi Manajemen.pdf",
          tanggal: "Diunggah : 23 Januari 2024",
          type: "pdf",
        },
        {
          nama: "Kartu Pegawai / ID Card",
          detail: "Kartu Pegawai.PNG",
          tanggal: "Diunggah : 22 April 2023",
          type: "image",
        },
      ],

      diklatList: [
        {
          nama: "Diklat Transformasi Pelayanan Publik",
          detail: "KemenPAN - 24 sampai 30 Juli 2025",
        },
        {
          nama: "Pelatihan Kepemimpinan Administrator",
          detail: "Pudiklat Kemendagri - 21 sampai 26 April 2024",
        },
      ],
    },

    {
      no: "002",
      nama: "Reza Saputra, S.Kom.",
      nip: "NIP:19852349082008779",
      jabatan: "Pengelola IT & Data Kelurahan",
      status: "PPPK",
      telepon: "0815762485959",
      email: "Saputra.Rezaa@kelurahan.go.id",
      domisili: "Jl. Candi Lontar 20, Surabaya",

      dokumen: 4,
      diklat: 2,

      dokumenList: [],
      diklatList: [],
    },

    {
      no: "003",
      nama: "Aminah Asiyah, S.Sos.",
      nip: "NIP:19852349082005436",
      jabatan: "Staff Kelurahan",
      status: "PPPK",
      telepon: "0857689921389",
      email: "Aminah.Asiyah@kelurahan.go.id",
      domisili: "Jl Dahlia Block C, Surabaya",

      dokumen: 5,
      diklat: 2,

      dokumenList: [],
      diklatList: [],
    },

    {
      no: "004",
      nama: "Ahmad Suhartanto, S.Sos.",
      nip: "NIP:19652349082029901",
      jabatan: "Kepala Seksi Pemerintahan",
      status: "ASN",
      telepon: "0823300891250",
      email: "AhmadSuhartanto@kelurahan.go.id",
      domisili: "Komp. Kencana Indah Blok A, Surabaya",

      dokumen: 1,
      diklat: 1,

      dokumenList: [],
      diklatList: [],
    },

    {
      no: "005",
      nama: "Dewi Lestari, S.E.",
      nip: "NIP:19782349082003211",
      jabatan: "Bendahara Kelurahan",
      status: "ASN",
      telepon: "081234567890",
      email: "dewi.lestari@kelurahan.go.id",
      domisili: "Jl. Mawar No. 12, Surabaya",

      dokumen: 3,
      diklat: 2,

      dokumenList: [],
      diklatList: [],
    },
  ]);


  const filteredData = dataPegawai.filter((item) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      item.no.toLowerCase().includes(keyword) ||
      item.nama.toLowerCase().includes(keyword) ||
      item.nip.toLowerCase().includes(keyword) ||
      item.jabatan.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword) ||
      item.telepon.toLowerCase().includes(keyword) ||
      item.email.toLowerCase().includes(keyword) ||
      item.domisili.toLowerCase().includes(keyword);

    const matchesStatus =
      status === "" || item.status === status;

    return matchesSearch && matchesStatus;
  });


  const toggleDetail = (no) => {
    setExpandedRow((prev) =>
      prev === no ? null : no
    );
  };

  const handleEdit = (item) => {
    setOpenAction(null);
    navigate(`/data-pegawai/${item.no}/edit`, {
      state: { pegawai: item },
    });
  };

  const handleDelete = (item) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus data pegawai berikut?\n\n` +
        `No: ${item.no}\n` +
        `Nama: ${item.nama}\n` +
        `NIP: ${item.nip}\n` +
        `Jabatan: ${item.jabatan}\n` +
        `Status: ${item.status}\n` +
        `Telepon: ${item.telepon}\n` +
        `Email: ${item.email}\n` +
        `Domisili: ${item.domisili}\n\n` +
        `Data yang dihapus tidak dapat dikembalikan.`
    );

    if (confirmed) {
      setDataPegawai((previous) => previous.filter((data) => data.no !== item.no));
      setOpenAction(null);
      setExpandedRow(null);
    }
  };

  return (
    <div className="infrastruktur-page">

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
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          onMenuClick={() =>
            setSidebarOpen((prev) => !prev)
          }
        />

        <section className="infrastruktur-content">


          <div className="top-action">

            <button
              type="button"
              className="add-infrastructure-button"
              onClick={() =>
                navigate("/data-pegawai/tambah")
              }
            >
              <span>+</span>
              Tambah Pegawai
            </button>

          </div>


          <div className="pegawai-stats">

            <StatCard
              icon={
                <img
                  src={pegawaiIcon}
                  alt="Pegawai"
                />
              }
              title="Pegawai"
              value="450"
              label="Total pegawai"
            />

            <StatCard
              icon={
                <img
                  src={asnIcon}
                  alt="ASN"
                />
              }
              title="ASN"
              value="200"
              label="Total ASN"
            />

            <StatCard
              icon={
                <img
                  src={pppkIcon}
                  alt="PPPK"
                />
              }
              title="PPPK"
              value="250"
              label="Total PPPK"
            />

          </div>


          <div className="infrastructure-table-card pegawai-table-card">


            <div className="table-top">

              <h2>Daftar Pegawai</h2>

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
                        (prev) => !prev
                      )
                    }
                  >
                    {status || "Status"}

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


            <div className="table-scroll">

              <table className="infrastructure-table pegawai-table">

                <thead>

                  <tr>

                    <th>No</th>

                    <th>
                      Pegawai & NIP
                    </th>

                    <th>
                      Jabatan
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Kontak & Email
                    </th>

                    <th>
                      Domisili
                    </th>

                    <th>
                      Relasi Terlampir
                    </th>

                    <th>
                      Aksi
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredData.length > 0 ? (

                    filteredData.map((item) => (

                      <Fragment key={item.no}>


                        <tr
                          className={
                            expandedRow === item.no
                              ? "pegawai-row-active"
                              : ""
                          }
                        >

                          <td className="pegawai-no-cell">
                            {item.no}
                          </td>

                          <td className="pegawai-identity-cell">

                            <div className="pegawai-identity">

                              <div className="pegawai-name">
                                {item.nama}
                              </div>

                              <div className="pegawai-nip">
                                {item.nip}
                              </div>

                            </div>

                          </td>

                          <td className="pegawai-jabatan-cell">

                            <div className="pegawai-jabatan">
                              {item.jabatan}
                            </div>

                          </td>

                          <td className="pegawai-status-cell">
                            {item.status}
                          </td>

                          <td className="pegawai-contact-cell">

                            <div className="pegawai-contact">

                              <div className="contact-row">

                                <span className="contact-icon">
                                  ☎
                                </span>

                                <span>
                                  {item.telepon}
                                </span>

                              </div>

                              <div className="contact-row">

                                <span className="contact-icon">
                                  ✉
                                </span>

                                <span className="contact-email">
                                  {item.email}
                                </span>

                              </div>

                            </div>

                          </td>

                          <td className="pegawai-domisili-cell">

                            <div className="pegawai-domisili">
                              {item.domisili}
                            </div>

                          </td>

                          <td className="pegawai-relasi-cell">

                            <div className="pegawai-relasi">

                              <span>
                                {item.dokumen} Dokumen
                              </span>

                              <span>
                                {item.diklat} Diklat
                              </span>

                            </div>

                          </td>

                          <td className="pegawai-action-cell">

                            <div className="pegawai-actions">

                              <button
                                type="button"
                                className="pegawai-expand-button"
                                onClick={() =>
                                  toggleDetail(item.no)
                                }
                                aria-label={
                                  expandedRow === item.no
                                    ? "Tutup detail"
                                    : "Buka detail"
                                }
                              >
                                <span
                                  className={`pegawai-chevron ${
                                    expandedRow === item.no
                                      ? "pegawai-chevron-open"
                                      : ""
                                  }`}
                                  aria-hidden="true"
                                />
                              </button>

                              <button
                                type="button"
                                className="action-button"
                                aria-label={`Aksi ${item.no}`}
                                onClick={() => setOpenAction(openAction === item.no ? null : item.no)}
                              >
                                ⋮
                              </button>

                              {openAction === item.no && (
                                <div className="penduduk-action-menu">
                                  <button type="button" className="penduduk-edit-action" onClick={() => handleEdit(item)}>
                                    Edit
                                  </button>
                                  <button type="button" className="delete-action" onClick={() => handleDelete(item)}>
                                    Hapus
                                  </button>
                                </div>
                              )}

                            </div>

                          </td>

                        </tr>


                        {expandedRow === item.no && (

                          <tr className="pegawai-detail-row">

                            <td
                              colSpan="8"
                              className="pegawai-detail-cell"
                            >

                              <div className="pegawai-expanded-detail">

                                <div className="pegawai-detail-actions">

                                  <button
                                    type="button"
                                    className="pegawai-detail-button"
                                    onClick={() => navigate("/data-pegawai/unggah-dokumen", { state: { pegawai: item, tab: "dokumen" } })}
                                  >
                                    Unggah Dokumen
                                  </button>

                                  <button
                                    type="button"
                                    className="pegawai-detail-button"
                                    onClick={() => navigate("/data-pegawai/unggah-dokumen", { state: { pegawai: item, tab: "diklat" } })}
                                  >
                                    + Tambah Riwayat Diklat
                                  </button>

                                </div>

                                <div className="pegawai-detail-grid">

                                  <div className="pegawai-detail-box">

                                    <h3>
                                      Dokumen Pegawai
                                    </h3>

                                    {item.dokumenList.length > 0 ? (

                                      item.dokumenList.map(
                                        (dokumen, index) => (

                                          <div
                                            className="pegawai-document"
                                            key={index}
                                          >

                                            <div className="document-file-icon">
                                              <img
                                                src={pdfIcon}
                                                alt="PDF"
                                              />
                                            </div>

                                            <div className="document-info">

                                              <strong>
                                                {dokumen.nama}
                                              </strong>

                                              <span>
                                                {dokumen.detail}
                                              </span>

                                              <small>
                                                {dokumen.tanggal}
                                              </small>

                                            </div>

                                            <button
                                              type="button"
                                              className="document-download"
                                            >
                                              Download
                                            </button>

                                          </div>

                                        )
                                      )

                                    ) : (

                                      <div className="pegawai-empty-detail">
                                        Belum ada dokumen pegawai.
                                      </div>

                                    )}

                                  </div>


                                  <div className="pegawai-detail-box">

                                    <h3>
                                      Riwayat Diklat & Pelatihan
                                    </h3>

                                    {item.diklatList.length > 0 ? (

                                      item.diklatList.map(
                                        (diklat, index) => (

                                          <div
                                            className="pegawai-training"
                                            key={index}
                                          >

                                            <div className="training-info">

                                              <strong>
                                                {diklat.nama}
                                              </strong>

                                              <span>
                                                {diklat.detail}
                                              </span>

                                            </div>

                                            <span className="certificate">
                                              ✓ Sertifikat
                                            </span>

                                          </div>

                                        )
                                      )

                                    ) : (

                                      <div className="pegawai-empty-detail">
                                        Belum ada riwayat diklat.
                                      </div>

                                    )}

                                  </div>

                                </div>

                              </div>

                            </td>

                          </tr>

                        )}

                      </Fragment>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="8"
                        className="empty-table"
                      >
                        Data pegawai tidak ditemukan.
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
                  {filteredData.length > 0
                    ? `1-${filteredData.length}`
                    : "0"}
                </strong>{" "}

                dari{" "}

                <strong>
                  45
                </strong>{" "}

                data pegawai

              </p>


              <div className="pagination">

                <button
                  type="button"
                  className="page-prev"
                  disabled={currentPage === 1}
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
                  ← <span>Sebelumnya</span>
                </button>


                <button
                  type="button"
                  className={
                    currentPage === 1
                      ? "page-active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(1)
                  }
                >
                  1
                </button>


                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage(2)
                  }
                  className={
                    currentPage === 2
                      ? "page-active"
                      : ""
                  }
                >
                  2
                </button>


                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage(3)
                  }
                  className={
                    currentPage === 3
                      ? "page-active"
                      : ""
                  }
                >
                  3
                </button>


                <button
                  type="button"
                  className="page-next"
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          3,
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

    </div>
  );
}


function StatCard({
  icon,
  title,
  value,
  label,
}) {
  return (
    <div className="pegawai-stat-card">

      <div className="pegawai-stat-icon">
        {icon}
      </div>

      <div className="pegawai-stat-content">

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