import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  updatePegawai,
  deletePegawai,
} from "../services/api";
import Header from "./header";
import backIcon from "../assets/back.png";
import hapusSampahIcon from "../assets/hapussampah.png";
import simpanDataIcon from "../assets/simpandata.png";

const emptyFormData = {
  nip: "",
  nama: "",
  status: "",
  jabatan: "",
  email: "",
  emailPribadi: "",
  telepon: "",
  domisili: "",
};

function EditPegawai() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const pegawai = state?.pegawai;

  const [formData, setFormData] = useState(() => ({
    ...emptyFormData,

    ...(pegawai
      ? {
          nip: String(
            pegawai.NIP || pegawai.nip || ""
          ).replace(/^NIP:\s*/, ""),
          nama: pegawai.nama || "",
          status: pegawai.status || "",
          jabatan: pegawai.jabatan || "",
          email:
            pegawai.email_pemerintahan ||
            pegawai.email ||
            "",
          emailPribadi:
            pegawai.email_pribadi ||
            "",
          telepon:
            pegawai.no_telepon ||
            pegawai.telepon ||
            "",
          domisili:
            pegawai.alamat_domisili ||
            pegawai.domisili ||
            "",
        }
      : {}),
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // SIMPAN PERUBAHAN
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const pegawaiId =
      pegawai?.id_pegawai || pegawai?.id;

    if (!pegawaiId) {
      alert("Data pegawai tidak ditemukan.");
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);

      await updatePegawai(pegawaiId, {
        nama: formData.nama,
        NIP: formData.nip,
        jabatan: formData.jabatan,
        status: formData.status,
        email_pribadi: formData.emailPribadi,
        email_pemerintahan: formData.email,
        no_telepon: formData.telepon,
        alamat_domisili: formData.domisili,
      });

      alert("Data pegawai berhasil diperbarui!");

      navigate("/data-pegawai");
    } catch (error) {
      console.error(
        "Error memperbarui data pegawai:",
        error
      );

      alert(
        error.message ||
          "Gagal memperbarui data pegawai."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =========================
  // HAPUS DATA
  // =========================

  const handleDelete = async () => {
    const pegawaiId =
      pegawai?.id_pegawai || pegawai?.id;

    if (!pegawaiId) {
      alert("Data pegawai tidak ditemukan.");
      return;
    }

    const confirmed = window.confirm(
      `Hapus data pegawai ${
        formData.nama || "ini"
      }?`
    );

    if (!confirmed || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      await deletePegawai(pegawaiId);

      alert("Data pegawai berhasil dihapus!");

      navigate("/data-pegawai");
    } catch (error) {
      console.error(
        "Error menghapus data pegawai:",
        error
      );

      alert(
        error.message ||
          "Gagal menghapus data pegawai."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // =========================
  // JIKA DATA TIDAK DITEMUKAN
  // =========================

  if (!pegawai) {
    return (
      <div className="tambah-pegawai-page edit-pegawai-page">
        <Header
          title="Edit Pegawai"
          showSearch={false}
        />

        <main className="tambah-pegawai-content">
          <div className="tambah-pegawai-back-wrapper">
            <button
              type="button"
              className="tambah-pegawai-back-button"
              onClick={() =>
                navigate("/data-pegawai")
              }
            >
              <img src={backIcon} alt="" />
              Kembali ke Data Pegawai
            </button>
          </div>

          <section className="tambah-pegawai-card">
            <h2>Data Pegawai Tidak Ditemukan</h2>

            <p>
              Data pegawai tidak tersedia untuk
              diedit. Silakan kembali ke halaman
              Data Pegawai.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="tambah-pegawai-page edit-pegawai-page">
      <Header
        title="Edit Pegawai"
        showSearch={false}
      />

      <main className="tambah-pegawai-content">

        {/* ========================= */}
        {/* KEMBALI */}
        {/* ========================= */}

        <div className="tambah-pegawai-back-wrapper">
          <button
            type="button"
            className="tambah-pegawai-back-button"
            onClick={() =>
              navigate("/data-pegawai")
            }
          >
            <img src={backIcon} alt="" />
            Kembali ke Data Pegawai
          </button>
        </div>

        <form
          className="tambah-pegawai-form"
          onSubmit={handleSubmit}
        >

          {/* ========================= */}
          {/* INFORMASI PEGAWAI */}
          {/* ========================= */}

          <section className="tambah-pegawai-card">
            <h2>Informasi Data Pegawai</h2>

            <div className="tambah-pegawai-fields">

              {/* NIP */}
              <div className="pegawai-field">
                <label htmlFor="nip">
                  NIP (Nomor Induk Pegawai)
                </label>

                <input
                  id="nip"
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* NAMA */}
              <div className="pegawai-field">
                <label htmlFor="nama">
                  Nama Lengkap &amp; Gelar Akademik
                </label>

                <input
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* STATUS */}
              <div className="pegawai-field">
                <label htmlFor="status">
                  Status
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
                    Pilih Status
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
                  Jabatan
                </label>

                <input
                  id="jabatan"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="pegawai-field">
                <label htmlFor="email">
                  Email Dinas
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* TELEPON */}
              <div className="pegawai-field">
                <label htmlFor="telepon">
                  Nomor Telepon/WA Aktif
                </label>

                <input
                  id="telepon"
                  name="telepon"
                  type="tel"
                  value={formData.telepon}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* ALAMAT */}
              <div className="pegawai-field full-field">
                <label htmlFor="domisili">
                  Alamat Domisili
                </label>

                <textarea
                  id="domisili"
                  name="domisili"
                  value={formData.domisili}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          </section>

          {/* ========================= */}
          {/* STATUS DAN BUTTON */}
          {/* ========================= */}

          <section className="edit-penduduk-form-status edit-pegawai-form-status">

            <div>
              <strong>
                Status Pengisian :{" "}
                {isSaving
                  ? "Sedang Menyimpan..."
                  : "Form Siap Disimpan"}
              </strong>

              <span>
                Data tervalidasi oleh Sistem SADEKA
              </span>
            </div>

            <b>Terisi 100%</b>

            {/* HAPUS */}
            <button
              type="button"
              className="edit-penduduk-delete-button"
              onClick={handleDelete}
              disabled={
                isSaving || isDeleting
              }
            >
              <img
                src={hapusSampahIcon}
                alt=""
              />

              {isDeleting
                ? "Menghapus..."
                : "Hapus Data Pegawai"}
            </button>

            {/* SIMPAN */}
            <button
              type="submit"
              className="edit-penduduk-save-button"
              disabled={
                isSaving || isDeleting
              }
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

export default EditPegawai;