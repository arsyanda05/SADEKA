import { useEffect, useState } from "react";

import {
  getDokumenPegawaiByPegawai,
  getDiklatByPegawai,
  createDokumenPegawai,
  createDiklat,
} from "../services/api";

function DetailPegawai({
  data,
  onClose,
  onEdit,
  onDelete,
}) {
  // ============================================================
  // DATA
  // ============================================================

  const [dokumen, setDokumen] =
    useState([]);

  const [diklat, setDiklat] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ============================================================
  // MODAL
  // ============================================================

  const [showDokumenForm, setShowDokumenForm] =
    useState(false);

  const [showDiklatForm, setShowDiklatForm] =
    useState(false);

  // ============================================================
  // STATUS SIMPAN
  // ============================================================

  const [savingDokumen, setSavingDokumen] =
    useState(false);

  const [savingDiklat, setSavingDiklat] =
    useState(false);

  // ============================================================
  // FORM DOKUMEN
  // ============================================================

  const [dokumenForm, setDokumenForm] =
    useState({
      jenisDokumen: "",
      tanggalUpload: "",
      dokumen: null,
    });

  // ============================================================
  // FORM DIKLAT
  // ============================================================

  const [diklatForm, setDiklatForm] =
    useState({
      namaDiklat: "",
      tanggalDiklat: "",
      keterangan: "",
      sertifikat: null,
    });

  // ============================================================
  // AMBIL DATA DOKUMEN DAN DIKLAT
  // ============================================================

  const loadDetail = async () => {
    if (!data?.id_pegawai) {
      return;
    }

    try {
      setLoading(true);

      const [
        dokumenResult,
        diklatResult,
      ] = await Promise.all([
        getDokumenPegawaiByPegawai(
          data.id_pegawai
        ),
        getDiklatByPegawai(
          data.id_pegawai
        ),
      ]);

      setDokumen(
        Array.isArray(dokumenResult)
          ? dokumenResult
          : Array.isArray(
              dokumenResult?.data
            )
          ? dokumenResult.data
          : []
      );

      setDiklat(
        Array.isArray(diklatResult)
          ? diklatResult
          : Array.isArray(
              diklatResult?.data
            )
          ? diklatResult.data
          : []
      );

    } catch (error) {
      console.error(
        "Gagal mengambil detail pegawai:",
        error
      );

      setDokumen([]);
      setDiklat([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [data]);

  // ============================================================
  // FORMAT TANGGAL
  // ============================================================

  const formatTanggal = (tanggal) => {
    if (!tanggal) {
      return "-";
    }

    try {
      return new Date(
        tanggal
      ).toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return tanggal;
    }
  };

  // ============================================================
  // BUKA FILE
  // ============================================================

  const handleOpenFile = (
    path,
    folder = "dokumen-pegawai"
  ) => {
    if (!path) {
      return;
    }

    const normalizedPath =
      String(path).replaceAll(
        "\\",
        "/"
      );

    const filename =
      normalizedPath
        .split("/")
        .pop();

    if (!filename) {
      return;
    }

    const url =
      `http://localhost:5000/uploads/${folder}/${filename}`;

    console.log(
      "Membuka file:",
      url
    );

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ============================================================
  // FORM DOKUMEN - HANDLE CHANGE
  // ============================================================

  const handleDokumenChange = (
    event
  ) => {
    const {
      name,
      value,
      files,
    } = event.target;

    setDokumenForm(
      (previous) => ({
        ...previous,
        [name]: files
          ? files[0]
          : value,
      })
    );
  };

  // ============================================================
  // FORM DIKLAT - HANDLE CHANGE
  // ============================================================

  const handleDiklatChange = (
    event
  ) => {
    const {
      name,
      value,
      files,
    } = event.target;

    setDiklatForm(
      (previous) => ({
        ...previous,
        [name]: files
          ? files[0]
          : value,
      })
    );
  };

  // ============================================================
  // RESET FORM DOKUMEN
  // ============================================================

  const resetDokumenForm = () => {
    setDokumenForm({
      jenisDokumen: "",
      tanggalUpload: "",
      dokumen: null,
    });
  };

  // ============================================================
  // RESET FORM DIKLAT
  // ============================================================

  const resetDiklatForm = () => {
    setDiklatForm({
      namaDiklat: "",
      tanggalDiklat: "",
      keterangan: "",
      sertifikat: null,
    });
  };

  // ============================================================
  // TUTUP FORM DOKUMEN
  // ============================================================

  const handleCloseDokumenForm = () => {
    if (savingDokumen) {
      return;
    }

    setShowDokumenForm(false);
    resetDokumenForm();
  };

  // ============================================================
  // TUTUP FORM DIKLAT
  // ============================================================

  const handleCloseDiklatForm = () => {
    if (savingDiklat) {
      return;
    }

    setShowDiklatForm(false);
    resetDiklatForm();
  };

  // ============================================================
  // SIMPAN DOKUMEN BARU
  // ============================================================

  const handleSubmitDokumen = async (
    event
  ) => {
    event.preventDefault();

    if (!data?.id_pegawai) {
      alert(
        "ID pegawai tidak ditemukan."
      );
      return;
    }

    if (
      !dokumenForm.jenisDokumen
    ) {
      alert(
        "Jenis dokumen wajib diisi."
      );
      return;
    }

    if (!dokumenForm.dokumen) {
      alert(
        "File dokumen wajib dipilih."
      );
      return;
    }

    try {
      setSavingDokumen(true);

      const formData =
        new FormData();

      formData.append(
        "id_pegawai",
        String(data.id_pegawai)
      );

      formData.append(
        "jenis_dokumen",
        dokumenForm.jenisDokumen
      );

      formData.append(
        "tanggal_upload",
        dokumenForm.tanggalUpload ||
          new Date()
            .toISOString()
            .split("T")[0]
      );

      formData.append(
        "dokumen",
        dokumenForm.dokumen
      );

      const result =
        await createDokumenPegawai(
          formData
        );

      console.log(
        "Dokumen berhasil ditambahkan:",
        result
      );

      alert(
        "Dokumen berhasil ditambahkan."
      );

      setShowDokumenForm(false);

      resetDokumenForm();

      await loadDetail();

    } catch (error) {
      console.error(
        "Gagal menambahkan dokumen:",
        error
      );

      alert(
        error.message ||
          "Gagal menambahkan dokumen."
      );

    } finally {
      setSavingDokumen(false);
    }
  };

  // ============================================================
  // SIMPAN DIKLAT BARU
  // ============================================================

  const handleSubmitDiklat = async (
    event
  ) => {
    event.preventDefault();

    if (!data?.id_pegawai) {
      alert(
        "ID pegawai tidak ditemukan."
      );
      return;
    }

    if (!diklatForm.namaDiklat) {
      alert(
        "Nama diklat wajib diisi."
      );
      return;
    }

    if (!diklatForm.tanggalDiklat) {
      alert(
        "Tanggal diklat wajib diisi."
      );
      return;
    }

    try {
      setSavingDiklat(true);

      const formData =
        new FormData();

      formData.append(
        "id_pegawai",
        String(data.id_pegawai)
      );

      formData.append(
        "nama_diklat",
        diklatForm.namaDiklat
      );

      formData.append(
        "tanggal_diklat",
        diklatForm.tanggalDiklat
      );

      formData.append(
        "keterangan",
        diklatForm.keterangan ||
          ""
      );

      if (
        diklatForm.sertifikat
      ) {
        formData.append(
          "sertifikat",
          diklatForm.sertifikat
        );
      }

      const result =
        await createDiklat(
          formData
        );

      console.log(
        "Diklat berhasil ditambahkan:",
        result
      );

      alert(
        "Riwayat diklat berhasil ditambahkan."
      );

      setShowDiklatForm(false);

      resetDiklatForm();

      await loadDetail();

    } catch (error) {
      console.error(
        "Gagal menambahkan diklat:",
        error
      );

      alert(
        error.message ||
          "Gagal menambahkan riwayat diklat."
      );

    } finally {
      setSavingDiklat(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (!data) {
    return null;
  }

  return (
    <div className="detail-overlay">

      <div className="detail-panel">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="detail-header">

          <div>

            <h2>
              Detail Pegawai
            </h2>

            <p>
              Informasi lengkap data
              pegawai
            </p>

          </div>

          <button
            type="button"
            className="detail-close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {/* ================================================== */}
        {/* CONTENT */}
        {/* ================================================== */}

        <div className="detail-content">

          {/* ================================================== */}
          {/* BIODATA */}
          {/* ================================================== */}

          <section className="detail-section">

            <div className="detail-section-header">

              <h3>
                Biodata Pegawai
              </h3>

            </div>

            <div className="detail-grid">

              <div className="detail-item">

                <strong>
                  Nama Lengkap
                </strong>

                <span>
                  {data.nama || "-"}
                </span>

              </div>

              <div className="detail-item">

                <strong>
                  NIP
                </strong>

                <span>
                  {data.NIP || "-"}
                </span>

              </div>

              <div className="detail-item">

                <strong>
                  Jabatan
                </strong>

                <span>
                  {data.jabatan || "-"}
                </span>

              </div>

              <div className="detail-item">

                <strong>
                  Status
                </strong>

                <span>
                  {data.status || "-"}
                </span>

              </div>

              <div className="detail-item">

                <strong>
                  Email Dinas
                </strong>

                <span>
                  {
                    data.email_pemerintahan ||
                    "-"
                  }
                </span>

              </div>

              <div className="detail-item">

                <strong>
                  Email Pribadi
                </strong>

                <span>
                  {
                    data.email_pribadi ||
                    "-"
                  }
                </span>

              </div>

              <div className="detail-item">

                <strong>
                  Nomor Telepon / WA
                </strong>

                <span>
                  {
                    data.no_telepon ||
                    "-"
                  }
                </span>

              </div>

              <div className="detail-item detail-item-full">

                <strong>
                  Alamat Domisili
                </strong>

                <span>
                  {
                    data.alamat_domisili ||
                    "-"
                  }
                </span>

              </div>

            </div>

          </section>

          {/* ================================================== */}
          {/* DOKUMEN */}
          {/* ================================================== */}

          <section className="detail-section">

            <div className="detail-section-header">

              <div>

                <h3>
                  Dokumen Terlampir
                </h3>

                <p>
                  Dokumen administrasi
                  pegawai
                </p>

              </div>

              <div className="detail-section-actions">

                <span className="detail-count">
                  {dokumen.length} Dokumen
                </span>

                <button
                  type="button"
                  className="detail-add-button"
                  onClick={() =>
                    setShowDokumenForm(
                      true
                    )
                  }
                >
                  + Unggah Dokumen
                </button>

              </div>

            </div>

            {loading ? (

              <div className="detail-empty">
                Memuat dokumen...
              </div>

            ) : dokumen.length === 0 ? (

              <div className="detail-empty">

                <span>
                  Belum ada dokumen
                  yang dilampirkan.
                </span>

              </div>

            ) : (

              <div className="detail-list">

                {dokumen.map(
                  (item) => (

                    <div
                      className="detail-list-item"
                      key={
                        item.id_dokumen_pegawai
                      }
                    >

                      <div className="detail-list-info">

                        <strong>
                          {
                            item.jenis_dokumen ||
                            "-"
                          }
                        </strong>

                        <span>
                          {
                            item.nama_file ||
                            "-"
                          }
                        </span>

                        <small>
                          Tanggal Upload:{" "}
                          {formatTanggal(
                            item.tanggal_upload
                          )}
                        </small>

                      </div>

                      <button
                        type="button"
                        className="detail-file-button"
                        onClick={() =>
                          handleOpenFile(
                            item.path_file,
                            "dokumen-pegawai"
                          )
                        }
                      >
                        Lihat File
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

          {/* ================================================== */}
          {/* DIKLAT */}
          {/* ================================================== */}

          <section className="detail-section">

            <div className="detail-section-header">

              <div>

                <h3>
                  Riwayat Diklat &
                  Sertifikasi
                </h3>

                <p>
                  Riwayat pelatihan dan
                  sertifikasi pegawai
                </p>

              </div>

              <div className="detail-section-actions">

                <span className="detail-count">
                  {diklat.length} Riwayat
                </span>

                <button
                  type="button"
                  className="detail-add-button"
                  onClick={() =>
                    setShowDiklatForm(
                      true
                    )
                  }
                >
                  + Tambah Diklat
                </button>

              </div>

            </div>

            {loading ? (

              <div className="detail-empty">
                Memuat riwayat
                diklat...
              </div>

            ) : diklat.length === 0 ? (

              <div className="detail-empty">

                <span>
                  Belum ada riwayat
                  diklat.
                </span>

              </div>

            ) : (

              <div className="detail-list">

                {diklat.map(
                  (item) => (

                    <div
                      className="detail-list-item"
                      key={
                        item.id_diklat
                      }
                    >

                      <div className="detail-list-info">

                        <strong>
                          {
                            item.nama_diklat ||
                            "-"
                          }
                        </strong>

                        <span>
                          Tanggal:{" "}
                          {formatTanggal(
                            item.tanggal_diklat
                          )}
                        </span>

                        <small>
                          Keterangan:{" "}
                          {
                            item.keterangan ||
                            "-"
                          }
                        </small>

                      </div>

                      {item.sertifikat && (

                        <button
                          type="button"
                          className="detail-file-button"
                          onClick={() =>
                            handleOpenFile(
                              item.sertifikat,
                              "diklat"
                            )
                          }
                        >
                          Lihat Sertifikat
                        </button>

                      )}

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <div className="detail-footer">

          <button
            type="button"
            className="detail-edit-button"
            onClick={onEdit}
          >
            Edit Data
          </button>

          <button
            type="button"
            className="detail-delete-button"
            onClick={() =>
              onDelete(data)
            }
          >
            Hapus
          </button>

        </div>

      </div>

      {/* ================================================== */}
      {/* MODAL UPLOAD DOKUMEN */}
      {/* ================================================== */}

      {showDokumenForm && (

        <div
          className="detail-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseDokumenForm();
            }
          }}
        >

          <div className="detail-modal">

            <div className="detail-modal-header">

              <div>

                <h3>
                  Unggah Dokumen
                </h3>

                <p>
                  Tambahkan dokumen baru
                  untuk pegawai ini.
                </p>

              </div>

              <button
                type="button"
                className="detail-modal-close"
                onClick={
                  handleCloseDokumenForm
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleSubmitDokumen
              }
            >

              <div className="detail-modal-body">

                <div className="detail-form-group">

                  <label>
                    Jenis Dokumen{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="jenisDokumen"
                    placeholder="Contoh: SK Pengangkatan"
                    value={
                      dokumenForm.jenisDokumen
                    }
                    onChange={
                      handleDokumenChange
                    }
                    required
                  />

                </div>

                <div className="detail-form-group">

                  <label>
                    Tanggal Upload
                  </label>

                  <input
                    type="date"
                    name="tanggalUpload"
                    value={
                      dokumenForm.tanggalUpload
                    }
                    onChange={
                      handleDokumenChange
                    }
                  />

                </div>

                <div className="detail-form-group">

                  <label>
                    File Dokumen{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="file"
                    name="dokumen"
                    accept="image/*,.pdf"
                    onChange={
                      handleDokumenChange
                    }
                    required
                  />

                  {dokumenForm.dokumen && (
                    <small>
                      File dipilih:{" "}
                      {
                        dokumenForm
                          .dokumen
                          .name
                      }
                    </small>
                  )}

                </div>

              </div>

              <div className="detail-modal-footer">

                <button
                  type="button"
                  className="detail-modal-cancel"
                  onClick={
                    handleCloseDokumenForm
                  }
                  disabled={
                    savingDokumen
                  }
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="detail-modal-save"
                  disabled={
                    savingDokumen
                  }
                >
                  {savingDokumen
                    ? "Menyimpan..."
                    : "Simpan Dokumen"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ================================================== */}
      {/* MODAL TAMBAH DIKLAT */}
      {/* ================================================== */}

      {showDiklatForm && (

        <div
          className="detail-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseDiklatForm();
            }
          }}
        >

          <div className="detail-modal">

            <div className="detail-modal-header">

              <div>

                <h3>
                  Tambah Riwayat Diklat
                </h3>

                <p>
                  Tambahkan riwayat
                  pelatihan atau
                  sertifikasi baru.
                </p>

              </div>

              <button
                type="button"
                className="detail-modal-close"
                onClick={
                  handleCloseDiklatForm
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleSubmitDiklat
              }
            >

              <div className="detail-modal-body">

                <div className="detail-form-group">

                  <label>
                    Nama Diklat / Sertifikasi{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="namaDiklat"
                    placeholder="Masukkan nama diklat atau sertifikasi"
                    value={
                      diklatForm.namaDiklat
                    }
                    onChange={
                      handleDiklatChange
                    }
                    required
                  />

                </div>

                <div className="detail-form-group">

                  <label>
                    Tanggal Diklat{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="tanggalDiklat"
                    value={
                      diklatForm.tanggalDiklat
                    }
                    onChange={
                      handleDiklatChange
                    }
                    required
                  />

                </div>

                <div className="detail-form-group">

                  <label>
                    Keterangan
                  </label>

                  <textarea
                    name="keterangan"
                    placeholder="Masukkan keterangan atau lembaga penyelenggara"
                    value={
                      diklatForm.keterangan
                    }
                    onChange={
                      handleDiklatChange
                    }
                    rows="4"
                  />

                </div>

                <div className="detail-form-group">

                  <label>
                    Sertifikat
                  </label>

                  <input
                    type="file"
                    name="sertifikat"
                    accept="image/*,.pdf"
                    onChange={
                      handleDiklatChange
                    }
                  />

                  {diklatForm.sertifikat && (
                    <small>
                      File dipilih:{" "}
                      {
                        diklatForm
                          .sertifikat
                          .name
                      }
                    </small>
                  )}

                </div>

              </div>

              <div className="detail-modal-footer">

                <button
                  type="button"
                  className="detail-modal-cancel"
                  onClick={
                    handleCloseDiklatForm
                  }
                  disabled={
                    savingDiklat
                  }
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="detail-modal-save"
                  disabled={
                    savingDiklat
                  }
                >
                  {savingDiklat
                    ? "Menyimpan..."
                    : "Simpan Diklat"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default DetailPegawai;