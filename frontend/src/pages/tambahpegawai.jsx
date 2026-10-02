import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createPegawai,
  createDokumenPegawai,
  createDiklat,
} from "../services/api";

import Header from "./header";

import backIcon from "../assets/back.png";
import simpanDataIcon from "../assets/simpandata.png";

// =====================================================
// INITIAL FORM DATA
// =====================================================

const initialFormData = {
  // =========================
  // BIODATA PEGAWAI
  // =========================

  nip: "",
  nama: "",
  status: "",
  jabatan: "",
  emailDinas: "",
  emailPribadi: "",
  telepon: "",
  alamat: "",

  // =========================
  // DOKUMEN PEGAWAI
  // =========================

  jenisDokumen: "",
  dokumen: null,
  tanggalUpload: "",

  // =========================
  // RIWAYAT DIKLAT
  // =========================

  namaDiklat: "",
  tanggalDiklat: "",
  sertifikat: null,
  keteranganDiklat: "",
};

// =====================================================
// COMPONENT
// =====================================================

function TambahPegawai() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    initialFormData
  );

  const [isSaving, setIsSaving] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      files,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: files
        ? files[0]
        : value,
    }));
  };

  // =====================================================
  // SIMPAN DATA
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      // =================================================
      // 1. SIMPAN BIODATA PEGAWAI
      // =================================================

      const pegawai =
        await createPegawai({
          nama: formData.nama,
          NIP: formData.nip,
          jabatan: formData.jabatan,
          status: formData.status,

          email_pribadi:
            formData.emailPribadi,

          email_pemerintahan:
            formData.emailDinas,

          no_telepon:
            formData.telepon,

          alamat_domisili:
            formData.alamat,
        });

      console.log(
        "Response create pegawai:",
        pegawai
      );

      // =================================================
      // AMBIL ID PEGAWAI DARI RESPONSE BACKEND
      // =================================================

      const idPegawai =
        pegawai?.data?.id_pegawai;

      if (!idPegawai) {
        throw new Error(
          "ID pegawai tidak berhasil diperoleh setelah menyimpan data."
        );
      }

      console.log(
        "ID Pegawai:",
        idPegawai
      );

      // =================================================
      // 2. SIMPAN DOKUMEN PEGAWAI
      // =================================================

      if (
        formData.jenisDokumen &&
        formData.dokumen
      ) {
        const dokumenFormData =
          new FormData();

        dokumenFormData.append(
          "id_pegawai",
          String(idPegawai)
        );

        dokumenFormData.append(
          "jenis_dokumen",
          formData.jenisDokumen
        );

        dokumenFormData.append(
          "tanggal_upload",
          formData.tanggalUpload ||
            new Date()
              .toISOString()
              .split("T")[0]
        );

        dokumenFormData.append(
          "dokumen",
          formData.dokumen
        );

        console.log(
          "Mengupload dokumen pegawai..."
        );

        const dokumen =
          await createDokumenPegawai(
            dokumenFormData
          );

        console.log(
          "Dokumen berhasil disimpan:",
          dokumen
        );
      }

      // =================================================
      // 3. SIMPAN RIWAYAT DIKLAT
      // =================================================

      if (
        formData.namaDiklat &&
        formData.tanggalDiklat
      ) {
        const diklatFormData =
          new FormData();

        diklatFormData.append(
          "id_pegawai",
          String(idPegawai)
        );

        diklatFormData.append(
          "nama_diklat",
          formData.namaDiklat
        );

        diklatFormData.append(
          "tanggal_diklat",
          formData.tanggalDiklat
        );

        diklatFormData.append(
          "keterangan",
          formData.keteranganDiklat || ""
        );

        // Sertifikat bersifat opsional
        if (formData.sertifikat) {
          diklatFormData.append(
            "sertifikat",
            formData.sertifikat
          );
        }

        console.log(
          "Menyimpan riwayat diklat..."
        );

        const diklat =
          await createDiklat(
            diklatFormData
          );

        console.log(
          "Riwayat diklat berhasil disimpan:",
          diklat
        );
      }

      // =================================================
      // 4. SELESAI
      // =================================================

      alert(
        "Data pegawai berhasil disimpan!"
      );

      navigate(
        "/data-pegawai"
      );

    } catch (error) {
      console.error(
        "Error menyimpan data pegawai:",
        error
      );

      alert(
        error.message ||
          "Gagal menyimpan data pegawai."
      );

    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="tambah-pegawai-page">

      <Header
        title="Tambah Pegawai"
        showSearch={false}
      />

      <main className="tambah-pegawai-content">

        {/* ================================================= */}
        {/* TOMBOL KEMBALI */}
        {/* ================================================= */}

        <div className="tambah-pegawai-back-wrapper">

          <button
            type="button"
            className="tambah-pegawai-back-button"
            onClick={() =>
              navigate(
                "/data-pegawai"
              )
            }
          >
            <img
              src={backIcon}
              alt=""
            />

            Kembali ke Data Pegawai
          </button>

        </div>

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form
          className="tambah-pegawai-form"
          onSubmit={handleSubmit}
        >

          <div className="tambah-pegawai-layout">

            {/* ================================================= */}
            {/* KOLOM KIRI */}
            {/* ================================================= */}

            <div className="tambah-pegawai-left-column">

              {/* ================================================= */}
              {/* BIODATA PEGAWAI */}
              {/* ================================================= */}

              <section className="tambah-pegawai-card">

                <h2>
                  Biodata Pegawai
                </h2>

                <div className="tambah-pegawai-fields">

                  {/* NIP */}

                  <div className="pegawai-field full-field">

                    <label htmlFor="nip">
                      NIP (Nomor Induk Pegawai){" "}
                      <i>*</i>
                    </label>

                    <input
                      id="nip"
                      name="nip"
                      placeholder="Masukkan NIP atau Nomor Induk Pegawai disini"
                      value={formData.nip}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* NAMA */}

                  <div className="pegawai-field full-field">

                    <label htmlFor="nama">
                      Nama Lengkap &amp; Gelar Akademik{" "}
                      <i>*</i>
                    </label>

                    <input
                      id="nama"
                      name="nama"
                      placeholder="Masukkan Nama Lengkap beserta Gelar Akademik disini"
                      value={formData.nama}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* STATUS */}

                  <div className="pegawai-field">

                    <label htmlFor="status">
                      Status{" "}
                      <i>*</i>
                    </label>

                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >

                      <option
                        value=""
                        disabled
                      >
                        Pilih Status disini
                      </option>

                      <option value="ASN">
                        ASN
                      </option>

                      <option value="PPPK">
                        PPPK
                      </option>

                    </select>

                  </div>

                  {/* JABATAN */}

                  <div className="pegawai-field">

                    <label htmlFor="jabatan">
                      Jabatan{" "}
                      <i>*</i>
                    </label>

                    <input
                      id="jabatan"
                      name="jabatan"
                      placeholder="Masukkan Jabatan disini"
                      value={formData.jabatan}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* EMAIL DINAS */}

                  <div className="pegawai-field">

                    <label htmlFor="emailDinas">
                      Email Dinas{" "}
                      <i>*</i>
                    </label>

                    <input
                      id="emailDinas"
                      name="emailDinas"
                      type="email"
                      placeholder="Masukkan Email Dinas disini"
                      value={formData.emailDinas}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* EMAIL PRIBADI */}

                  <div className="pegawai-field">

                    <label htmlFor="emailPribadi">
                      Email Pribadi
                    </label>

                    <input
                      id="emailPribadi"
                      name="emailPribadi"
                      type="email"
                      placeholder="Masukkan Email Pribadi disini"
                      value={formData.emailPribadi}
                      onChange={handleChange}
                    />

                  </div>

                  {/* TELEPON */}

                  <div className="pegawai-field full-field">

                    <label htmlFor="telepon">
                      Nomor Telepon/WA aktif{" "}
                      <i>*</i>
                    </label>

                    <input
                      id="telepon"
                      name="telepon"
                      type="tel"
                      placeholder="Masukkan Nomor Telepon/WA Aktif disini"
                      value={formData.telepon}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* ALAMAT */}

                  <div className="pegawai-field full-field">

                    <label htmlFor="alamat">
                      Alamat Domisili{" "}
                      <i>*</i>
                    </label>

                    <textarea
                      id="alamat"
                      name="alamat"
                      placeholder="Masukkan Alamat Lengkap Domisili disini"
                      value={formData.alamat}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

              </section>

              {/* ================================================= */}
              {/* RIWAYAT DIKLAT */}
              {/* ================================================= */}

              <section className="tambah-pegawai-card diklat-card">

                <h2>
                  Riwayat Diklat Pegawai
                </h2>

                <div className="tambah-pegawai-fields">

                  {/* NAMA DIKLAT */}

                  <div className="pegawai-field full-field">

                    <label htmlFor="namaDiklat">
                      Nama Diklat dan Sertifikasi
                    </label>

                    <input
                      id="namaDiklat"
                      name="namaDiklat"
                      placeholder="Masukkan Nama Diklat dan Sertifikasi"
                      value={formData.namaDiklat}
                      onChange={handleChange}
                    />

                  </div>

                  {/* TANGGAL */}

                  <div className="pegawai-field full-field">

                    <label htmlFor="tanggalDiklat">
                      Tanggal Pelaksanaan
                    </label>

                    <input
                      id="tanggalDiklat"
                      name="tanggalDiklat"
                      type="date"
                      value={
                        formData.tanggalDiklat
                      }
                      onChange={handleChange}
                    />

                  </div>

                  {/* KETERANGAN */}

                  <div className="pegawai-field full-field">

                    <label htmlFor="keteranganDiklat">
                      Keterangan
                    </label>

                    <textarea
                      id="keteranganDiklat"
                      name="keteranganDiklat"
                      placeholder="Masukkan keterangan atau lembaga penyelenggara"
                      value={
                        formData.keteranganDiklat
                      }
                      onChange={handleChange}
                    />

                  </div>

                  {/* SERTIFIKAT */}

                  <div className="pegawai-field full-field">

                    <label htmlFor="sertifikat">
                      Foto / File Sertifikat Diklat
                    </label>

                    <input
                      className="pegawai-file-input"
                      id="sertifikat"
                      name="sertifikat"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </section>

            </div>

            {/* ================================================= */}
            {/* KOLOM KANAN - DOKUMEN */}
            {/* ================================================= */}

            <section className="tambah-pegawai-card dokumen-card">

              <h2>
                Dokumen Pegawai
              </h2>

              <div className="tambah-pegawai-fields">

                {/* JENIS DOKUMEN */}

                <div className="pegawai-field full-field">

                  <label htmlFor="jenisDokumen">
                    Jenis Dokumen Pegawai
                  </label>

                  <input
                    id="jenisDokumen"
                    name="jenisDokumen"
                    placeholder="Contoh: Ijazah, KTP, SK Pengangkatan"
                    value={
                      formData.jenisDokumen
                    }
                    onChange={handleChange}
                  />

                </div>

                {/* FILE */}

                <div className="pegawai-field full-field">

                  <label htmlFor="dokumen">
                    Unggah Berkas
                  </label>

                  <input
                    className="pegawai-file-input"
                    id="dokumen"
                    name="dokumen"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleChange}
                  />

                </div>

                {/* TANGGAL */}

                <div className="pegawai-field full-field">

                  <label htmlFor="tanggalUpload">
                    Tanggal Upload Berkas
                  </label>

                  <input
                    id="tanggalUpload"
                    name="tanggalUpload"
                    type="date"
                    value={
                      formData.tanggalUpload
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>
            </section>
            </div>
          {/* ================================================= */}
          {/* STATUS BAR */}
          {/* ================================================= */}

          <section className="tambah-pegawai-status-bar">

            <div>

              <strong>

                Status Validasi:{" "}

                <b>
                  {isSaving
                    ? "Menyimpan..."
                    : "Siap Disimpan"}
                </b>

              </strong>

              <small>
                Biodata pegawai, dokumen,
                dan riwayat diklat siap disimpan.
              </small>

            </div>

            <span>
              Terisi 100%
            </span>

            {/* SIMPAN */}

            <button
              type="submit"
              className="tambah-pegawai-save-button"
              disabled={isSaving}
            >

              <img
                src={simpanDataIcon}
                alt=""
              />

              {isSaving
                ? "Menyimpan..."
                : "Simpan Data Pegawai"}

            </button>

          </section>

        </form>

      </main>

    </div>
  );
}

export default TambahPegawai;