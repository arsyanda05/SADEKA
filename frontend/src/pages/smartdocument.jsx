import { useRef, useState } from "react";
import SideBar from "./sidebarmenu";
import Header from "./header";

import histoImage from "../assets/histo.png";
import unduhImage from "../assets/unduh.png";
import uploadImage from "../assets/upload.png";
import smartImage from "../assets/smart.png";
import pdfIcon from "../assets/pdf.png";
import docIcon from "../assets/doc.png";
import backIcon from "../assets/back.png";

const SmartDocument = () => {
  const fileInputRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [jenisSurat, setJenisSurat] = useState("");
  const [jenisOpen, setJenisOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [ocrData, setOcrData] = useState({
    judul: "Surat Keterangan Ahli Waris",
    isi: [
      "Yang bertanda tangan dibawah ini,",
      "Nama : Bapak Lurah",
      "Jabatan : Lurah Kecamatan Manukan Kulon",
      "Dengan ini menerangkan bahwa,",
      "Nama : Novian",
      "Tempat, Tanggal Lahir : 20 Mei 1990",
      "Alamat : Jl. Manukan Tengah, Surabaya, Jawa Timur",
      "Merupakan ahli waris dari,",
      "Nama : H. Abdul (Alm)",
      "Demikian surat keterangan ini dibuat",
      "Untuk dipergunakan bagaimana semestinya",
    ],
  });


  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Format file harus JPG, PNG, atau PDF.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    setTimeout(() => {
      setOcrData({
        judul: "Surat Keterangan Ahli Waris",
        isi: [
          "Yang bertanda tangan dibawah ini,",
          "Nama : Bapak Lurah",
          "Jabatan : Lurah Kecamatan Manukan Kulon",
          "Dengan ini menerangkan bahwa,",
          "Nama : Novian",
          "Tempat, Tanggal Lahir : 20 Mei 1990",
          "Alamat : Jl. Manukan Tengah, Surabaya, Jawa Timur",
          "Merupakan ahli waris dari,",
          "Nama : H. Abdul (Alm)",
          "Demikian surat keterangan ini dibuat",
          "Untuk dipergunakan bagaimana semestinya",
        ],
      });
    }, 500);
  };


  const handleDownloadPDF = () => {
    alert("Fitur Unduh PDF akan diproses.");
  };

  const handleDownloadDoc = () => {
    alert("Fitur Unduh Doc akan diproses.");
  };

  const handleSaveArchive = () => {
    alert("Dokumen berhasil disimpan ke arsip.");
  };

  const handleHistory = () => {
    setShowHistory(true);
    setJenisOpen(false);
    setCurrentPage(1);
  };

  const handleHistoryBack = () => {
    setShowHistory(false);
    setJenisOpen(false);
  };

  const handleEditText = () => {
    setIsEditing((prev) => !prev);
  };


  return (
    <div className="smart-document-page">


      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <main className="smart-document-main">

        <Header
          title={showHistory ? "Riwayat Dokumen" : "Smart Document"}
          onMenuClick={() =>
            setSidebarOpen((prev) => !prev)
          }
        />

        <div className="smart-document-content">

          {showHistory ? (
            <HistoryDocumentTable
              jenisSurat={jenisSurat}
              jenisOpen={jenisOpen}
              currentPage={currentPage}
              setJenisSurat={setJenisSurat}
              setJenisOpen={setJenisOpen}
              setCurrentPage={setCurrentPage}
              onBack={handleHistoryBack}
            />
          ) : (
            <>

          <div className="smart-document-info">

            <div className="smart-document-info-left">

              <div className="smart-document-engine">

                <img
                  src={smartImage}
                  alt="SADEKA AI Engine"
                  className="smart-engine-image"
                />

                <span>
                  SADEKA AI ENGINE
                </span>

              </div>

              <p>
                Konversi dokumen fisik ke format digital terstruktur
                <br />
                menggunakan teknologi Optical Character Recognition (OCR)
              </p>

            </div>

            {/* RIWAYAT DOKUMEN */}

            <button
              type="button"
              className="history-document-button"
              onClick={handleHistory}
            >

              <img
                src={histoImage}
                alt=""
                className="document-action-image"
              />

              Riwayat Dokumen

            </button>

          </div>


          <div className="smart-document-workspace">


            <section className="smart-upload-section">

              <div
                className="smart-upload-box"
                onClick={handleUploadClick}
              >

                <img
                  src={uploadImage}
                  alt="Upload document"
                  className="upload-document-image"
                />

                <h2>
                  Upload Document
                </h2>

                <p className="upload-drag-text">
                  Drag &amp; drop file disini atau
                </p>

                <button
                  type="button"
                  className="choose-file-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleUploadClick();
                  }}
                >
                  Pilih File
                </button>

                <p className="upload-format">
                  JPG, PNG, PDF. Maksimal 10MB
                </p>

                {selectedFile && (
                  <div className="selected-file">

                    <span>
                      ✓
                    </span>

                    {selectedFile.name}

                  </div>
                )}

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                hidden
              />

            </section>


            <section className="smart-result-section">

              <div className="smart-result-card">

                <div className="smart-result-actions">

                  {/* UNDUH PDF */}

                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                  >

                    <img
                      src={unduhImage}
                      alt=""
                      className="document-action-image"
                    />

                    Unduh PDF

                  </button>

                  {/* UNDUH DOC */}

                  <button
                    type="button"
                    onClick={handleDownloadDoc}
                  >

                    <img
                      src={unduhImage}
                      alt=""
                      className="document-action-image"
                    />

                    Unduh Doc

                  </button>

                  {/* SIMPAN ARSIP */}

                  <button
                    type="button"
                    onClick={handleSaveArchive}
                  >
                    Simpan Arsip
                  </button>

                </div>

                <div className="ocr-header">

                  <span>
                    Hasil OCR
                  </span>

                  <button
                    type="button"
                    className="edit-text-button"
                    onClick={handleEditText}
                  >

                    <span>
                      ✎
                    </span>

                    {isEditing
                      ? "Selesai Edit"
                      : "Edit Teks"}

                  </button>

                </div>

                <div className="ocr-content">

                  {isEditing ? (

                    <textarea
                      className="ocr-edit-area"
                      value={`${ocrData.judul}\n\n${ocrData.isi.join("\n")}`}
                      onChange={(event) => {

                        const lines =
                          event.target.value.split("\n");

                        setOcrData({
                          judul: lines[0] || "",
                          isi: lines.slice(2),
                        });

                      }}
                    />

                  ) : (

                    <>

                      <h2>
                        {ocrData.judul}
                      </h2>

                      <div className="ocr-text">

                        {ocrData.isi.map(
                          (text, index) => (
                            <p key={index}>
                              {text}
                            </p>
                          )
                        )}

                      </div>

                    </>

                  )}

                </div>

              </div>

            </section>

          </div>

            </>
          )}

        </div>

      </main>

    </div>
  );
};

const historyRows = [
  {
    no: "001",
    nomor: "005/145/Kec.Sby/2026",
    tanggal: "10/09/2026",
    subjek: "Surat Keterangan Ahli Waris",
    detail: "Permohonan : Kel. Manukan Kulon",
    jenis: "Surat Ahli Waris",
    format: "PDF Terbit",
  },
  {
    no: "002",
    nomor: "470/098/DKPS/2025",
    tanggal: "02/01/2025",
    subjek: "Keterangan Ahli Waris Tanah dan Bangunan",
    detail: "Alm. H. Khalis Fatimah (Danang Tri & 2 lainnya)",
    jenis: "Surat Ahli Waris",
    format: "PDF Resmi",
  },
  {
    no: "003",
    nomor: "021/RT04/RW06/2025",
    tanggal: "20/05/2025",
    subjek: "Permohonan Bantuan Perbaikan",
    detail: "Pengirim : RT 04 Manukan Kulon",
    jenis: "Surat Masuk",
    format: "DOC Terbit",
  },
  {
    no: "004",
    nomor: "470/142/436.17.2/2024",
    tanggal: "11/08/2024",
    subjek: "Surat Pengantar e-KTP Warga",
    detail: "Tujuan : Dispenduk Capil Kota Surabaya",
    jenis: "Surat Keluar",
    format: "PDF Resmi",
  },
  {
    no: "005",
    nomor: "530/234/436/12.3/2024",
    tanggal: "09/09/2024",
    subjek: "Surat Keterangan Domisili Usaha",
    detail: "Pemohon : CV Jaya Sejahtera Maju",
    jenis: "Surat Keluar",
    format: "DOC Terbit",
  },
];

function HistoryDocumentTable({
  jenisSurat,
  jenisOpen,
  currentPage,
  setJenisSurat,
  setJenisOpen,
  setCurrentPage,
  onBack,
}) {
  const filteredRows = jenisSurat
    ? historyRows.filter((row) => row.jenis === jenisSurat)
    : historyRows;

  return (
    <section className="smart-history-view">
      <div className="smart-history-top-action">
        <button type="button" className="smart-history-back-button" onClick={onBack}>
          <img src={backIcon} alt="" /> Kembali ke Smart Document
        </button>
      </div>

      <div className="smart-history-table-card surat-masuk-table-card">
        <div className="table-top smart-history-table-top">
          <h2>Riwayat Dokumen</h2>
          <div className="filter-wrapper smart-history-filter-wrapper surat-masuk-filter-wrapper">
            <span className="filter-label">Filter</span>
            <div className="simple-dropdown">
              <button type="button" className="filter-button" onClick={() => setJenisOpen((previous) => !previous)}>
                {jenisSurat || "Jenis Surat"}
                <span className="dropdown-arrow">▼</span>
              </button>
              {jenisOpen && (
                <div className="simple-menu smart-history-filter-menu">
                  {["", "Surat Ahli Waris", "Surat Masuk", "Surat Keluar"].map((option) => (
                    <button type="button" className="simple-item" key={option || "semua"} onClick={() => { setJenisSurat(option); setJenisOpen(false); setCurrentPage(1); }}>
                      {option || "Semua Jenis Surat"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="table-scroll smart-history-table-scroll">
          <table className="smart-history-table surat-masuk-table">
            <thead><tr><th>No Urut</th><th>Nomor Surat</th><th>Tanggal</th><th>Perihal dan<br />Subjek</th><th>Jenis</th><th>Format OCR</th></tr></thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.no}>
                  <td>{row.no}</td><td>{row.nomor}</td><td>{row.tanggal}</td>
                  <td><strong>{row.subjek}</strong><small>{row.detail}</small></td>
                  <td><b className={`smart-history-type smart-history-type-${row.jenis.toLowerCase().replaceAll(" ", "-")}`}>{row.jenis}</b></td>
                  <td><span className="smart-history-format"><img src={row.format.startsWith("PDF") ? pdfIcon : docIcon} alt="" />{row.format}</span></td>
                </tr>
              ))}
              {filteredRows.length === 0 && <tr><td colSpan="6" className="smart-history-empty">Riwayat dokumen tidak ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="table-footer smart-history-footer">
          <p>Menampilkan <strong>{filteredRows.length > 0 ? `1-${filteredRows.length}` : "0"}</strong> dari <strong>{filteredRows.length}</strong> Riwayat Dokumen</p>
          <div className="pagination">
            <button type="button" disabled={currentPage === 1}>← <span>Sebelumnya</span></button>
            <button type="button" className="page-active">1</button>
            <button type="button" disabled>Selanjutnya →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SmartDocument;