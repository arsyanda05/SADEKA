import { useEffect, useRef, useState } from "react";
import SideBar from "./sidebarmenu";
import Header from "./header";

import histoImage from "../assets/histo.png";
import unduhImage from "../assets/unduh.png";
import uploadImage from "../assets/upload.png";
import smartImage from "../assets/smart.png";
import pdfIcon from "../assets/pdf.png";
import docIcon from "../assets/doc.png";
import backIcon from "../assets/back.png";
import {
  archiveSmartDocument,
  exportSmartDocument,
  getBackendFileUrl,
  getSmartDocumentHistory,
  getSmartDocumentOptions,
  processSmartDocument,
} from "../services/api";

const today = () => new Date().toISOString().slice(0, 10);
const emptyMetadata = () => ({
  nomor_surat: "",
  tanggal: today(),
  jenis: "",
  asal: "",
  tujuan: "",
  keterangan: "",
  tanggal_pengajuan: today(),
  tahap: "Diajukan",
  tanggal_selesai: "",
  id_penduduk: "",
  id_penduduk_ahli_waris: "",
  hubungan: "",
});

const getMissingMetadata = (target, metadata) => {
  const fields = target === "surat-ahli-waris"
    ? [
      ["nomor_surat", "nomor surat"],
      ["tanggal_pengajuan", "tanggal pengajuan"],
      ["id_penduduk", "pewaris"],
      ["id_penduduk_ahli_waris", "ahli waris"],
      ["hubungan", "hubungan keluarga"],
    ]
    : [
      ["nomor_surat", "nomor surat"],
      ["tanggal", "tanggal"],
      ["jenis", "jenis surat"],
      ["asal", "asal surat"],
      ["tujuan", "tujuan surat"],
      ["keterangan", "isi/keterangan"],
    ];

  return fields
    .filter(([key]) => !String(metadata[key] ?? "").trim())
    .map(([, label]) => label);
};

const getSystemOptionsError = (error, afterArchive = false) => {
  if (error.message === "Endpoint API tidak ditemukan") {
    return afterArchive
      ? "Dokumen berhasil disimpan. Backend perlu dijalankan ulang agar daftar data surat dapat diperbarui."
      : "Backend perlu dijalankan ulang agar data surat dapat dimuat.";
  }

  return afterArchive
    ? `Dokumen tersimpan, tetapi daftar data surat gagal diperbarui: ${error.message}`
    : error.message;
};

const getTitleLineCount = (lines) => {
  let count = 0;
  for (const line of lines.slice(0, 3)) {
    const text = line.trim();
    if (
      !text ||
      /^\d+(?:\.\d+)+\.?\s+\S/.test(text) ||
      /^(nama lengkap|alamat domisili|universitas|email|nomor whatsapp)\b/i.test(text) ||
      /^(?:[-*]|\d+[.)])\s/.test(text) ||
      text.length > 70 ||
      /[.!?;:]$/.test(text)
    ) {
      break;
    }
    count += 1;
  }
  return count;
};

const isOcrSectionHeading = (text) =>
  /^\d+(?:\.\d+)+\.?\s+\S/.test(text) ||
  (/^[A-Z][A-Z\s]{2,}$/.test(text) && /[A-Z]/.test(text));

const isOcrListItem = (text) => /^(?:[-*]|\d+[.)])\s/.test(text);
const isOcrFormField = (text) =>
  /^(nama lengkap|alamat domisili|universitas|email|nomor whatsapp)\b/i.test(text);

const getOcrBodyBlocks = (lines) => {
  const blocks = [];
  for (const text of lines) {
    const previous = blocks[blocks.length - 1];
    const startsBlock =
      isOcrSectionHeading(text) ||
      isOcrListItem(text) ||
      isOcrFormField(text) ||
      !previous ||
      /[.!?]$/.test(previous);
    if (startsBlock && !(previous && isOcrFormField(previous) && /^[:=]/.test(text))) {
      blocks.push(text);
    } else {
      blocks[blocks.length - 1] = `${previous} ${text}`;
    }
  }
  return blocks;
};

const SmartDocument = () => {
  const fileInputRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [jenisSurat, setJenisSurat] = useState("");
  const [jenisOpen, setJenisOpen] = useState(false);
  const [selectedDocumentName, setSelectedDocumentName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [scannedImageUrl, setScannedImageUrl] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [target, setTarget] = useState("umum");
  const [recordMode, setRecordMode] = useState("new");
  const [recordId, setRecordId] = useState("");
  const [metadata, setMetadata] = useState(emptyMetadata);
  const [systemOptions, setSystemOptions] = useState({
    surat: [],
    suratAhliWaris: [],
    penduduk: [],
  });
  const [historyRows, setHistoryRows] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    getSmartDocumentOptions()
      .then(setSystemOptions)
      .catch((error) => setStatusMessage(getSystemOptionsError(error)));
  }, []);

  const selectedRecord = target === "surat-ahli-waris"
    ? systemOptions.suratAhliWaris.find(
      (item) => String(item.id_surat_ahli_waris) === recordId
    )
    : systemOptions.surat.find(
      (item) => String(item.id_surat) === recordId
    );
  const archiveButtonLabel = target === "umum"
    ? "Simpan ke Arsip"
    : `Simpan ke ${target === "surat-masuk" ? "Surat Masuk" : target === "surat-keluar" ? "Surat Keluar" : "Surat Ahli Waris"}`;
  const isArchiveButtonDisabled = !documentId || isProcessing || isExporting ||
    isArchiving || isArchived ||
    (target !== "umum" && recordMode === "existing" && !recordId);
  const ocrLines = ocrText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const titleLineCount = getTitleLineCount(ocrLines);
  const ocrBodyBlocks = getOcrBodyBlocks(ocrLines.slice(titleLineCount));

  const updateMetadata = (event) => {
    const { name, value } = event.target;
    setMetadata((previous) => ({ ...previous, [name]: value }));
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  const handleUploadClick = () => {
    if (isProcessing || isArchiving) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setStatusMessage("Format foto harus JPG, JPEG, atau PNG.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatusMessage("Ukuran foto maksimal 10MB.");
      event.target.value = "";
      return;
    }

    setSelectedDocumentName(file.name);
    setStatusMessage("Foto diunggah. Mendeteksi tepi, memotong, dan membaca teks...");
    setIsProcessing(true);
    setDocumentId("");
    setScannedImageUrl("");
    setOcrText("");
    setIsArchived(false);

    try {
      const result = await processSmartDocument(file);
      setDocumentId(result.id);
      setScannedImageUrl(result.scannedImageUrl);
      setOcrText(result.text);
      setStatusMessage("Deteksi dokumen dan OCR selesai. Periksa dan edit hasilnya sebelum ekspor.");
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  };

  const downloadDocument = async (format) => {
    if (!documentId || !ocrText.trim() || isExporting || isArchiving) return;

    setIsExporting(true);
    try {
      setStatusMessage(`Membuat file ${format.toUpperCase()}...`);
      const blob = await exportSmartDocument({
        documentId,
        format,
        text: ocrText,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `smart-document.${format}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatusMessage(`File ${format.toUpperCase()} berhasil diunduh.`);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPDF = () => downloadDocument("pdf");
  const handleDownloadDoc = () => downloadDocument("docx");

  const handleSaveArchive = async () => {
    if (!documentId || !ocrText.trim() || isExporting || isArchiving) return;
    if (target !== "umum" && recordMode === "existing" && !recordId) {
      setStatusMessage("Pilih surat yang akan ditautkan terlebih dahulu.");
      return;
    }
    if (target !== "umum" && recordMode === "new") {
      const missingFields = getMissingMetadata(target, metadata);
      if (missingFields.length > 0) {
        setStatusMessage(`Lengkapi ${missingFields.join(", ")} sebelum menyimpan.`);
        return;
      }
    }

    setIsArchiving(true);
    setStatusMessage("Menyimpan dokumen dan hasil OCR ke arsip...");
    try {
      const result = await archiveSmartDocument(documentId, ocrText, {
        target,
        recordId: recordMode === "existing" ? recordId : undefined,
        metadata: recordMode === "new" ? metadata : undefined,
      });
      setStatusMessage(result.message);
      setIsArchived(true);
      getSmartDocumentOptions()
        .then(setSystemOptions)
        .catch((error) => setStatusMessage(getSystemOptionsError(error, true)));
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleHistory = async () => {
    setHistoryLoading(true);
    setStatusMessage("");
    setJenisOpen(false);
    try {
      const documents = await getSmartDocumentHistory();
      setHistoryRows(documents.map((document, index) => ({
        no: String(index + 1).padStart(3, "0"),
        nomor: `SD-${document.id_dokumen}`,
        tanggal: new Date(document.tanggal_upload).toLocaleDateString("id-ID"),
        subjek: document.nama_dokumen_file,
        detail: document.hasil_OCR?.slice(0, 100) || "Hasil OCR",
        jenis: document.jenis_dokumen || "Smart Document",
        format: document.jenis_dokumen === "SmartDocument" ? "OCR" : "PDF OCR",
        pathPdf: getBackendFileUrl(document.path_file),
        pathDocx: getBackendFileUrl(document.path_file.replace(/\.pdf$/i, ".docx")),
      })));
      setShowHistory(true);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setHistoryLoading(false);
    }
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
              rows={historyRows}
              loading={historyLoading}
              jenisSurat={jenisSurat}
              jenisOpen={jenisOpen}
              setJenisSurat={setJenisSurat}
              setJenisOpen={setJenisOpen}
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

          <section className="smart-document-routing">
            <div className="smart-document-field smart-document-target-field">
              <label htmlFor="smart-document-target">Simpan dokumen sebagai</label>
              <select
                id="smart-document-target"
                value={target}
                disabled={isProcessing || isArchiving || isArchived}
                onChange={(event) => {
                  setTarget(event.target.value);
                  setRecordMode("new");
                  setRecordId("");
                  setIsArchived(false);
                }}
              >
                <option value="umum">Arsip SmartDocument umum</option>
                <option value="surat-masuk">Surat Masuk</option>
                <option value="surat-keluar">Surat Keluar</option>
                <option value="surat-ahli-waris">Surat Ahli Waris</option>
              </select>
            </div>

            {target !== "umum" && (
              <>
                <div className="smart-document-field">
                  <label htmlFor="smart-document-record-mode">Tujuan data surat</label>
                  <select
                    id="smart-document-record-mode"
                    value={recordMode}
                    disabled={isProcessing || isArchiving}
                    onChange={(event) => {
                      setRecordMode(event.target.value);
                      setRecordId("");
                    }}
                  >
                    <option value="new">Buat data surat baru</option>
                    <option value="existing">Tautkan ke surat yang sudah ada</option>
                  </select>
                </div>

                {recordMode === "existing" ? (
                  <div className="smart-document-field smart-document-record-field">
                    <label htmlFor="smart-document-record">
                      {target === "surat-ahli-waris" ? "Pilih surat ahli waris" : "Pilih surat"}
                    </label>
                    <select
                      id="smart-document-record"
                      value={recordId}
                      disabled={isProcessing || isArchiving}
                      onChange={(event) => setRecordId(event.target.value)}
                    >
                      <option value="">Pilih surat dari sistem</option>
                      {target === "surat-ahli-waris"
                        ? systemOptions.suratAhliWaris.map((item) => (
                          <option key={item.id_surat_ahli_waris} value={item.id_surat_ahli_waris}>
                            {item.nomor_surat || `Surat #${item.id_surat_ahli_waris}`} — {item.pewaris?.nama || "Pewaris"}
                          </option>
                        ))
                        : systemOptions.surat
                          .filter((item) => item.arah_surat === (target === "surat-masuk" ? "Masuk" : "Keluar"))
                          .map((item) => (
                            <option key={item.id_surat} value={item.id_surat}>
                              {item.nomor_surat} — {item.keterangan}
                            </option>
                          ))}
                    </select>
                    <small>Dokumen hasil scan akan ditautkan ke data surat yang dipilih.</small>
                    {selectedRecord?.dokumen?.length > 0 && (
                      <div className="smart-document-existing-files">
                        <span>Dokumen yang sudah tersimpan:</span>
                        {selectedRecord.dokumen.map((document) => (
                          <a
                            key={document.id_dokumen}
                            href={getBackendFileUrl(document.path_file)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {document.nama_dokumen_file}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="smart-document-metadata">
                    {target === "surat-ahli-waris" ? (
                      <>
                        <div className="smart-document-field">
                          <label htmlFor="smart-heir-number">Nomor surat</label>
                          <input id="smart-heir-number" name="nomor_surat" value={metadata.nomor_surat} onChange={updateMetadata} />
                        </div>
                        <div className="smart-document-field">
                          <label htmlFor="smart-heir-date">Tanggal pengajuan</label>
                          <input id="smart-heir-date" type="date" name="tanggal_pengajuan" value={metadata.tanggal_pengajuan} onChange={updateMetadata} />
                        </div>
                        <div className="smart-document-field">
                          <label htmlFor="smart-inheritor">Pewaris</label>
                          <select id="smart-inheritor" name="id_penduduk" value={metadata.id_penduduk} onChange={updateMetadata}>
                            <option value="">Pilih pewaris</option>
                            {systemOptions.penduduk.map((person) => (
                              <option key={person.id_penduduk} value={person.id_penduduk}>{person.nama} — {person.nik}</option>
                            ))}
                          </select>
                        </div>
                        <div className="smart-document-field">
                          <label htmlFor="smart-heir">Ahli waris</label>
                          <select id="smart-heir" name="id_penduduk_ahli_waris" value={metadata.id_penduduk_ahli_waris} onChange={updateMetadata}>
                            <option value="">Pilih ahli waris</option>
                            {systemOptions.penduduk
                              .filter((person) => String(person.id_penduduk) !== String(metadata.id_penduduk))
                              .map((person) => (
                                <option key={person.id_penduduk} value={person.id_penduduk}>{person.nama} — {person.nik}</option>
                              ))}
                          </select>
                        </div>
                        <div className="smart-document-field">
                          <label htmlFor="smart-heir-relationship">Hubungan keluarga</label>
                          <input id="smart-heir-relationship" name="hubungan" value={metadata.hubungan} onChange={updateMetadata} placeholder="Contoh: Anak kandung" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="smart-document-field">
                          <label htmlFor="smart-letter-number">Nomor surat</label>
                          <input id="smart-letter-number" name="nomor_surat" value={metadata.nomor_surat} onChange={updateMetadata} />
                        </div>
                        <div className="smart-document-field">
                          <label htmlFor="smart-letter-date">Tanggal</label>
                          <input id="smart-letter-date" type="date" name="tanggal" value={metadata.tanggal} onChange={updateMetadata} />
                        </div>
                        <div className="smart-document-field">
                          <label htmlFor="smart-letter-type">Jenis surat</label>
                          <input id="smart-letter-type" name="jenis" value={metadata.jenis} onChange={updateMetadata} placeholder="Contoh: Undangan Dinas" />
                        </div>
                        <div className="smart-document-field">
                          <label htmlFor="smart-letter-origin">Asal surat</label>
                          <input id="smart-letter-origin" name="asal" value={metadata.asal} onChange={updateMetadata} />
                        </div>
                        <div className="smart-document-field">
                          <label htmlFor="smart-letter-destination">Tujuan surat</label>
                          <input id="smart-letter-destination" name="tujuan" value={metadata.tujuan} onChange={updateMetadata} />
                        </div>
                        <div className="smart-document-field smart-document-body-field">
                          <label htmlFor="smart-letter-body">Isi / keterangan</label>
                          <textarea id="smart-letter-body" name="keterangan" value={metadata.keterangan} onChange={updateMetadata} rows="3" />
                        </div>
                      </>
                    )}

                  </div>
                )}
              </>
            )}
            <div className="smart-document-save-actions">
              <button
                type="button"
                className="smart-document-save-button"
                onClick={handleSaveArchive}
                disabled={isArchiveButtonDisabled}
              >
                {isArchiving ? "Menyimpan..." : isArchived ? "Tersimpan" : archiveButtonLabel}
              </button>
            </div>
          </section>

          {statusMessage && (
            <p className="smart-document-status" role="status">
              {statusMessage}
            </p>
          )}

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
                  JPG atau PNG. Maksimal 10MB
                </p>

                {selectedDocumentName && (
                  <div className="selected-file">

                    <span>
                      ✓
                    </span>

                    {selectedDocumentName}

                  </div>
                )}

                {scannedImageUrl && (
                  <div className="smart-document-scan-preview">
                    <p>Hasil deteksi tepi dan auto-crop</p>
                    <img
                      src={scannedImageUrl}
                      alt="Hasil crop dokumen"
                      onClick={(event) => event.stopPropagation()}
                    />
                  </div>
                )}

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                capture="environment"
                onChange={handleFileChange}
                hidden
              />

            </section>


            <section className="smart-result-section">

              <div className="smart-result-card">

                <div className="smart-result-actions">



                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={!documentId || isProcessing || isExporting}
                  >

                    <img
                      src={unduhImage}
                      alt=""
                      className="document-action-image"
                    />

                    Unduh PDF

                  </button>



                  <button
                    type="button"
                    onClick={handleDownloadDoc}
                    disabled={!documentId || isProcessing || isExporting}
                  >

                    <img
                      src={unduhImage}
                      alt=""
                      className="document-action-image"
                    />

                    Unduh Doc

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
                      value={ocrText}
                      onChange={(event) => setOcrText(event.target.value)}
                      placeholder="Hasil OCR akan muncul di sini setelah foto diproses."
                    />

                  ) : (

                    <>
                      {ocrLines.slice(0, titleLineCount).map((line, index) => (
                        <h2 className="ocr-document-title" key={`${index}-${line}`}>
                          {line}
                        </h2>
                      ))}
                      {ocrLines.length > 0 ? (
                        <div className="ocr-text">
                          {ocrBodyBlocks.map((text, index) => (
                            <p
                              className={isOcrSectionHeading(text) ? "ocr-section-heading" : undefined}
                              key={`${index}-${text}`}
                            >
                              {text}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="ocr-empty-state">
                          Unggah foto dokumen untuk melihat hasil OCR di sini.
                        </p>
                      )}

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

function HistoryDocumentTable({
  rows,
  loading,
  jenisSurat,
  jenisOpen,
  setJenisSurat,
  setJenisOpen,
  onBack,
}) {
  const filteredRows = jenisSurat
    ? rows.filter((row) => row.jenis === jenisSurat)
    : rows;

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
                  {["", "Smart Document", "Surat Masuk", "Surat Keluar", "Surat Ahli Waris"].map((option) => (
                    <button type="button" className="simple-item" key={option || "semua"} onClick={() => { setJenisSurat(option); setJenisOpen(false); }}>
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
              {loading && <tr><td colSpan="6" className="smart-history-empty">Memuat riwayat...</td></tr>}
              {filteredRows.map((row) => (
                <tr key={row.no}>
                  <td>{row.no}</td><td>{row.nomor}</td><td>{row.tanggal}</td>
                  <td><strong>{row.subjek}</strong><small>{row.detail}</small></td>
                  <td><b className={`smart-history-type smart-history-type-${row.jenis.toLowerCase().replaceAll(" ", "-")}`}>{row.jenis}</b></td>
                  <td>
                    <span className="smart-history-format">
                      <a href={row.pathPdf} target="_blank" rel="noreferrer"><img src={pdfIcon} alt="" />PDF</a>
                      {" "}
                      <a href={row.pathDocx} target="_blank" rel="noreferrer"><img src={docIcon} alt="" />DOCX</a>
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && filteredRows.length === 0 && <tr><td colSpan="6" className="smart-history-empty">Riwayat dokumen tidak ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="table-footer smart-history-footer">
          <p>Menampilkan <strong>{filteredRows.length > 0 ? `1-${filteredRows.length}` : "0"}</strong> dari <strong>{filteredRows.length}</strong> Riwayat Dokumen</p>
          <div className="pagination">
            <button type="button" disabled>← <span>Sebelumnya</span></button>
            <button type="button" className="page-active">1</button>
            <button type="button" disabled>Selanjutnya →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SmartDocument;