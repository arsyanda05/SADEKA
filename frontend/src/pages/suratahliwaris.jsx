import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./sidebarmenu";
import Header from "./header";
import smartDocIcon from "../assets/smartdoc.png";
import saw1Icon from "../assets/saw1.png";
import saw2Icon from "../assets/saw2.png";
import saw3Icon from "../assets/saw3.png";
import saw4Icon from "../assets/saw4.png";
import saw5Icon from "../assets/saw5.png";

function SuratAhliWaris() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [urutanOpen, setUrutanOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [urutan, setUrutan] = useState("Urutan Pengajuan");
  const [status, setStatus] = useState("Status");

  const [currentPage, setCurrentPage] = useState(1);

  const dataSurat = [
    {
      no: 200,
      nomorSurat: "474.3/012/IX/2026",
      ahliWaris: "Hariadi",
      nik: "3530110702060001",
      tanggalPengajuan: "09/09/2026",
      tanggalSelesai: "-",
      tahap: "Diterima oleh kelurahan",
      berkas: "SAW Hariadi.pdf",
    },
    {
      no: 199,
      nomorSurat: "474.3/012/IX/2026",
      ahliWaris: "Bambang",
      nik: "3530111502060003",
      tanggalPengajuan: "07/09/2026",
      tanggalSelesai: "-",
      tahap: "Tanda Tangan Sekretaris",
      berkas: "SAW Bambang.pdf",
    },
    {
      no: 198,
      nomorSurat: "474.3/012/IX/2026",
      ahliWaris: "Rini",
      nik: "3210113502060003",
      tanggalPengajuan: "05/09/2026",
      tanggalSelesai: "-",
      tahap: "Diproses Kecamatan",
      berkas: "SAW Rini.pdf",
    },
    {
      no: 197,
      nomorSurat: "474.3/012/IX/2026",
      ahliWaris: "Hadi",
      nik: "3210113505790003",
      tanggalPengajuan: "01/09/2026",
      tanggalSelesai: "08/09/2026",
      tahap: "Selesai",
      berkas: "SAW Hadi.pdf",
    },
    {
      no: 196,
      nomorSurat: "474.3/012/IX/2026",
      ahliWaris: "Julia",
      nik: "3110113502060009",
      tanggalPengajuan: "30/08/2026",
      tanggalSelesai: "06/09/2026",
      tahap: "Selesai",
      berkas: "SAW Julia.pdf",
    },
  ];

  const filteredData = dataSurat.filter((item) => {
    const keyword = search.toLowerCase();

    const cocokSearch =
      item.nomorSurat.toLowerCase().includes(keyword) ||
      item.ahliWaris.toLowerCase().includes(keyword) ||
      item.nik.includes(keyword);

    const cocokStatus =
      status === "Status" ||
      (status === "Diterima oleh Kelurahan" &&
        item.tahap === "Diterima oleh kelurahan") ||
      (status === "Tanda Tangan Sekretaris" &&
        item.tahap === "Tanda Tangan Sekretaris") ||
      (status === "Diproses Kecamatan" &&
        item.tahap === "Diproses Kecamatan") ||
      (status === "Selesai" && item.tahap === "Selesai");

    return cocokSearch && cocokStatus;
  });

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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="surat-ahli-waris-page">
      <SideBar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="saw-main">
        <Header
          title="Surat Ahli Waris"
          showSearch={true}
          searchValue={search}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

      {/* ================= CONTENT ================= */}
      <main className="saw-content">

        {/* TOP BUTTON */}
        <div className="saw-top-actions">

          <button
            type="button"
            className="saw-smart-button"
            onClick={() => navigate("/smart-document")}
          >
            <img className="saw-button-icon-img" src={smartDocIcon} alt="" />
            Smart Document
          </button>

          <button
            type="button"
            className="saw-add-button"
            onClick={() => navigate("/surat-ahli-waris/tambah")}
          >
            <span>＋</span>
            Tambah Surat Ahli Waris
          </button>

        </div>

        {/* ================= STATISTIK ================= */}
        <section className="saw-statistics">

          {/* Pengajuan */}
          <div className="saw-stat-card">
            <div className="saw-stat-icon">
              <img src={saw1Icon} alt="" />
            </div>

            <div className="saw-stat-content">
              <h3>Pengajuan</h3>
              <strong>200</strong>
              <span>Total Berkas<br />Pengajuan</span>
            </div>
          </div>

          {/* Diterima */}
          <div className="saw-stat-card">
            <div className="saw-stat-icon">
              <img src={saw2Icon} alt="" />
            </div>

            <div className="saw-stat-content">
              <h3>Diterima</h3>
              <strong>1</strong>
              <span>Total Berkas<br />Diterima</span>
            </div>
          </div>

          {/* TTD */}
          <div className="saw-stat-card">
            <div className="saw-stat-icon">
              <img src={saw3Icon} alt="" />
            </div>

            <div className="saw-stat-content">
              <h3>TTD</h3>
              <strong>1</strong>
              <span>Total Tanda Tangan</span>
            </div>
          </div>

          {/* Diproses */}
          <div className="saw-stat-card">
            <div className="saw-stat-icon">
              <img src={saw4Icon} alt="" />
            </div>

            <div className="saw-stat-content">
              <h3>Diproses</h3>
              <strong>1</strong>
              <span>Total Berkas<br />Diproses</span>
            </div>
          </div>

          {/* Selesai */}
          <div className="saw-stat-card">
            <div className="saw-stat-icon">
              <img src={saw5Icon} alt="" />
            </div>

            <div className="saw-stat-content">
              <h3>Selesai</h3>
              <strong>197</strong>
              <span>Total Berkas Selesai</span>
            </div>
          </div>

        </section>

        {/* ================= TABLE CARD ================= */}
        <section className="saw-table-card">

          {/* TABLE HEADER */}
          <div className="saw-table-top">

            <h2>Daftar Surat Ahli Waris</h2>

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
                    setUrutanOpen(!urutanOpen);
                    setStatusOpen(false);
                  }}
                >
                  {urutan}
                  <span>▼</span>
                </button>

                {urutanOpen && (
                  <div className="saw-dropdown-menu">

                    <div
                      className="saw-dropdown-item"
                      onClick={() =>
                        handleUrutan("Semua Urutan")
                      }
                    >
                      Semua Urutan
                    </div>
                    
                    <div
                      className="saw-dropdown-item"
                      onClick={() =>
                        handleUrutan("Terbaru")
                      }
                    >
                      Terbaru
                    </div>

                    <div
                      className="saw-dropdown-item"
                      onClick={() =>
                        handleUrutan("Terlama")
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
                    setStatusOpen(!statusOpen);
                    setUrutanOpen(false);
                  }}
                >
                  {status}
                  <span>▼</span>
                </button>

                {statusOpen && (
                  <div className="saw-dropdown-menu">

                    <div
                      className="saw-dropdown-item"
                      onClick={() =>
                        handleStatus("Status")
                      }
                    >
                      Semua Status
                    </div>

                    <div
                      className="saw-dropdown-item"
                      onClick={() =>
                        handleStatus("Diterima oleh Kelurahan")
                      }
                    >
                      Diterima oleh Kelurahan
                    </div>

                    <div
                      className="saw-dropdown-item"
                      onClick={() =>
                        handleStatus("Tanda Tangan Sekretaris")
                      }
                    >
                      Tanda Tangan Sekretaris
                    </div>

                    <div
                      className="saw-dropdown-item"
                      onClick={() =>
                        handleStatus("Diproses Kecamatan")
                      }
                    >
                      Diproses Kecamatan
                    </div>

                    <div
                      className="saw-dropdown-item"
                      onClick={() =>
                        handleStatus("Selesai")
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
                  <th>Nomor Surat</th>
                  <th>Ahli Waris</th>
                  <th>NIK</th>
                  <th>Tanggal<br />Pengajuan</th>
                  <th>Tanggal<br />Selesai</th>
                  <th>Tahap</th>
                  <th>Berkas</th>
                </tr>
              </thead>

              <tbody>

                {filteredData.map((item) => (
                  <tr
                    key={item.no}
                    className="saw-table-row-clickable"
                    onClick={() => navigate(`/surat-ahli-waris/${item.no}`)}
                  >

                    <td>{item.no}</td>

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
                      {item.tanggalPengajuan}
                    </td>

                    <td>
                      {item.tanggalSelesai}
                    </td>

                    <td className="saw-stage-cell">
                      {item.tahap}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="saw-file-button"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <span className="saw-file-icon">
                          ♧
                        </span>

                        <span>
                          SAW<br />
                          {item.ahliWaris}.pdf
                        </span>
                      </button>
                    </td>

                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="saw-empty"
                    >
                      Data surat ahli waris tidak ditemukan.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}
          <div className="saw-table-footer">

            <p>
              Menampilkan <strong>196-200</strong> dari{" "}
              <strong>200</strong> Surat Ahli Waris
            </p>

            <div className="saw-pagination">

              <button
                type="button"
                className="saw-page-prev"
                onClick={() =>
                  setCurrentPage(
                    Math.max(1, currentPage - 1)
                  )
                }
              >
                ← &nbsp; Sebelumnya
              </button>

              <button
                type="button"
                className={
                  currentPage === 1
                    ? "saw-page-active"
                    : ""
                }
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(2)}
              >
                2
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(3)}
              >
                3
              </button>

              <button
                type="button"
                className="saw-page-next"
                onClick={() =>
                  setCurrentPage(currentPage + 1)
                }
              >
                Selanjutnya &nbsp; →
              </button>

            </div>

          </div>

        </section>

      </main>
      </div>
    </div>
  );
}

export default SuratAhliWaris;