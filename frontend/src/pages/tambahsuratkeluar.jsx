import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import backIcon from "../assets/back.png";
import simpanIcon from "../assets/simpan.png";
import simpanDataIcon from "../assets/simpandata.png";
import { createSuratWithDocument } from "../services/api";

function TambahSuratKeluar() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomorSurat: "",
    tanggal: "",
    asalSurat: "",
    tujuan: "",
    keterangan: "",
    jenis: "",
    dokumen: null,
  });

  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE PERUBAHAN FORM
  // =====================================================

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: files ? files[0] : value,
    }));
  };

  // =====================================================
  // SIMPAN SURAT KELUAR
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await createSuratWithDocument({
        nomor_surat: formData.nomorSurat,
        tanggal: formData.tanggal,
        jenis: formData.jenis,

        // PENTING:
        // membedakan Surat Keluar dengan Surat Masuk
        arah_surat: "Keluar",

        asal: formData.asalSurat,
        tujuan: formData.tujuan,
        keterangan: formData.keterangan,
      }, formData.dokumen);

      alert("Surat keluar berhasil disimpan!");

      navigate("/surat-keluar");
    } catch (error) {
      console.error(
        "Error menyimpan surat keluar:",
        error
      );

      alert("Gagal menyimpan surat keluar.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SIMPAN DRAFT
  // =====================================================

  const handleDraft = () => {
    alert("Draft surat keluar berhasil disimpan!");
  };

  // =====================================================
  // TAMPILAN
  // =====================================================

  return (
    <div className="tambah-surat-masuk-page">

      <Header
        title="Tambah Surat Keluar"
        showSearch={false}
      />

      <main className="tambah-surat-masuk-content">

        {/* ==============================
            KEMBALI
        ============================== */}

        <div className="tambah-surat-masuk-back-wrapper">

          <button
            type="button"
            className="tambah-surat-masuk-back-button"
            onClick={() =>
              navigate("/surat-keluar")
            }
          >
            <img
              src={backIcon}
              alt=""
            />

            Kembali ke Surat Keluar
          </button>

        </div>

        {/* ==============================
            FORM
        ============================== */}

        <form
          className="tambah-surat-masuk-form"
          onSubmit={handleSubmit}
        >

          <section className="tambah-surat-masuk-card">

            <h2>
              Informasi Surat Keluar
            </h2>

            <div className="tambah-surat-masuk-grid">

              {/* NOMOR SURAT */}

              <div className="tambah-surat-masuk-field">

                <label htmlFor="nomorSurat">
                  Nomor Surat
                </label>

                <input
                  id="nomorSurat"
                  name="nomorSurat"
                  placeholder="Masukkan Nomor Surat disini"
                  value={formData.nomorSurat}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* TANGGAL */}

              <div className="tambah-surat-masuk-field">

                <label htmlFor="tanggal">
                  Tanggal
                </label>

                <input
                  id="tanggal"
                  name="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* ASAL SURAT */}

              <div className="tambah-surat-masuk-field">

                <label htmlFor="asalSurat">
                  Asal Surat
                </label>

                <input
                  id="asalSurat"
                  name="asalSurat"
                  placeholder="Masukkan Asal Surat disini"
                  value={formData.asalSurat}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* TUJUAN */}

              <div className="tambah-surat-masuk-field">

                <label htmlFor="tujuan">
                  Tujuan Surat
                </label>

                <input
                  id="tujuan"
                  name="tujuan"
                  placeholder="Masukkan Tujuan Surat disini"
                  value={formData.tujuan}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* KETERANGAN */}

              <div className="tambah-surat-masuk-field tambah-surat-masuk-keterangan">

                <label htmlFor="keterangan">
                  Keterangan
                </label>

                <textarea
                  id="keterangan"
                  name="keterangan"
                  placeholder="Masukkan Keterangan disini"
                  value={formData.keterangan}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* JENIS SURAT */}

              <div className="tambah-surat-masuk-field">

                <label htmlFor="jenis">
                  Jenis Surat
                </label>

                <select
                  id="jenis"
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleChange}
                  required
                >

                  <option
                    value=""
                    disabled
                    hidden
                  >
                    Pilih Jenis Surat
                  </option>

                  <option value="Surat Keterangan Usaha">
                    Surat Keterangan Usaha
                  </option>

                  <option value="Undangan Dinas">
                    Undangan Dinas
                  </option>

                  <option value="Permohonan">
                    Permohonan
                  </option>

                  <option value="Laporan">
                    Laporan
                  </option>

                  <option value="Undangan Rapat">
                    Undangan Rapat
                  </option>

                  <option value="Rekomendasi">
                    Rekomendasi
                  </option>

                  <option value="Pengantar">
                    Pengantar
                  </option>

                  <option value="Pemberitahuan">
                    Pemberitahuan
                  </option>

                </select>

              </div>

              <div className="tambah-surat-masuk-field tambah-surat-masuk-berkas">
                <label htmlFor="dokumenSuratKeluar">
                  Berkas Surat (PDF)
                </label>
                <input
                  id="dokumenSuratKeluar"
                  name="dokumen"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleChange}
                  required
                />
                {formData.dokumen && (
                  <small className="tambah-surat-masuk-selected-file">
                    {formData.dokumen.name}
                  </small>
                )}
              </div>

            </div>

          </section>

          {/* ==============================
              STATUS BAR
          ============================== */}

          <section className="tambah-surat-masuk-status-bar">

            <div>

              <strong>
                Status Pengisian : Form Siap Disimpan
              </strong>

              <small>
                Data tervalidasi oleh Sistem SADEKA
              </small>

            </div>

            <span>
              Terisi 100%
            </span>

            {/* SIMPAN DRAFT */}

            <button
              type="button"
              className="tambah-surat-masuk-draft-button"
              onClick={handleDraft}
              disabled={loading}
            >

              <img
                src={simpanIcon}
                alt=""
              />

              Simpan Draft

            </button>

            {/* SIMPAN */}

            <button
              type="submit"
              className="tambah-surat-masuk-save-button"
              disabled={loading}
            >

              <img
                src={simpanDataIcon}
                alt=""
              />

              {loading
                ? "Menyimpan..."
                : "Simpan dan Teruskan"}

            </button>

          </section>

        </form>

      </main>

    </div>
  );
}

export default TambahSuratKeluar;