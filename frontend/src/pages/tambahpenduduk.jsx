import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";
import simpanIcon from "../assets/simpan.png";
import backIcon from "../assets/back.png";

function TambahPenduduk() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamat: "",
    rt: "",
    rw: "",
    status: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Data Penduduk:", formData);
    alert("Data penduduk berhasil disimpan!");
    navigate("/data-penduduk");
  };

  const handleDraft = () => {
    console.log("Draft Penduduk:", formData);
    alert("Draft data penduduk berhasil disimpan!");
  };

  return (
    <div className="tambah-penduduk-page">
      <Header title="Tambah Penduduk" showSearch={false} />

      <main className="tambah-penduduk-content">
        <div className="tambah-penduduk-back-wrapper">
          <button
            type="button"
            className="tambah-penduduk-back-button"
            onClick={() => navigate("/data-penduduk")}
          >
            <img
              className="tambah-penduduk-back-icon"
              src={backIcon}
              alt=""
            />
            Kembali ke Data Penduduk
          </button>
        </div>

        <form
          className="tambah-penduduk-form"
          onSubmit={handleSubmit}
        >
          <section className="tambah-penduduk-card">
            <div className="tambah-penduduk-card-title">
              <h2>Informasi Data Penduduk</h2>
            </div>

            <div className="tambah-penduduk-form-grid">
              <div className="tambah-penduduk-form-group">
                <label htmlFor="nik">NIK (Nomor Induk Kependudukan)</label>
                <input
                  id="nik"
                  name="nik"
                  type="text"
                  inputMode="numeric"
                  placeholder="Masukkan NIK disini"
                  value={formData.nik}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="tambah-penduduk-form-group">
                <label htmlFor="nama">Nama Lengkap</label>
                <input
                  id="nama"
                  name="nama"
                  type="text"
                  placeholder="Masukkan Nama Lengkap disini"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="tambah-penduduk-form-group">
                <label htmlFor="tempatLahir">Tempat Lahir</label>
                <input
                  id="tempatLahir"
                  name="tempatLahir"
                  type="text"
                  placeholder="Masukkan Tempat Lahir Disini"
                  value={formData.tempatLahir}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="tambah-penduduk-form-group">
                <label htmlFor="tanggalLahir">Tanggal Lahir</label>
                <input
                  id="tanggalLahir"
                  name="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="tambah-penduduk-form-group">
                <label htmlFor="jenisKelamin">Jenis Kelamin</label>
                <select
                  id="jenisKelamin"
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>
                    Pilih Jenis Kelamin
                  </option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div className="tambah-penduduk-form-group tambah-penduduk-full-width">
                <label htmlFor="alamat">Alamat Domisili</label>
                <textarea
                  id="alamat"
                  name="alamat"
                  placeholder="Masukkan Alamat Domisili Lengkap disini"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="tambah-penduduk-form-group tambah-penduduk-small-field">
                <label htmlFor="rt">RT</label>
                <input
                  id="rt"
                  name="rt"
                  type="text"
                  placeholder="Isi RT disini"
                  value={formData.rt}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="tambah-penduduk-form-group tambah-penduduk-small-field">
                <label htmlFor="rw">RW</label>
                <input
                  id="rw"
                  name="rw"
                  type="text"
                  placeholder="Isi RW disini"
                  value={formData.rw}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="tambah-penduduk-form-group tambah-penduduk-status-field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>
                    Pilih Status
                  </option>
                  <option value="Tetap">Tetap</option>
                  <option value="Sementara">Sementara</option>
                  <option value="Meninggal">Meninggal</option>
                  <option value="Pindah">Pindah</option>
                </select>
              </div>
            </div>
          </section>

          <section className="tambah-penduduk-form-status">
            <div>
              <strong>Status Pengisian : Form Siap Disimpan</strong>
              <span>Data tervalidasi oleh Sistem SADEKA</span>
            </div>
            <b>Terisi 100%</b>
            <button
              type="button"
              className="tambah-penduduk-draft-button"
              onClick={handleDraft}
            >
              <img src={simpanIcon} alt="" />
              Simpan Draft
            </button>
            <button
              type="submit"
              className="tambah-penduduk-save-button"
            >
              <img src={simpanDataIcon} alt="" />
              Simpan Data Penduduk
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}

export default TambahPenduduk;
