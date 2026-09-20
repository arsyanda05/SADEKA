import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

function TambahSuratAhliWaris() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pewaris: "",
    ahliWaris: "",
    hubungan: "",
    nomorSurat: "",
    tanggalPengajuan: "",
    tanggalSelesai: "",
    tahap: "",
    dokumen: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Data Surat Ahli Waris:", formData);

    alert("Data surat ahli waris berhasil ditambahkan!");
    navigate("/surat-ahli-waris");
  };

  return (
    <div className="tambah-saw-page">

      {/* ================= HEADER ================= */}
      <Header title="Surat Ahli Waris" showSearch={false} />

      {/* ================= CONTENT ================= */}
      <main className="tambah-saw-content">

        {/* KEMBALI */}
        <div className="tambah-saw-top-action">
          <button
            type="button"
            className="kembali-saw-button"
            onClick={() => navigate("/surat-ahli-waris")}
          >
            ← Kembali ke Surat Ahli Waris
          </button>
        </div>

        {/* ================= FORM ================= */}
        <section className="tambah-saw-card">

          <div className="tambah-saw-title">
            <h2>Tambah Surat Ahli Waris</h2>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="tambah-saw-form-grid">

              {/* ================= KOLOM KIRI ================= */}
              <div className="tambah-saw-column">

                {/* PEWARIS */}
                <div className="saw-form-group">
                  <label htmlFor="pewaris">
                    Pewaris <span>*</span>
                  </label>

                  <div className="saw-search-input">
                    <input
                      id="pewaris"
                      name="pewaris"
                      type="text"
                      placeholder="Cari data pewaris"
                      value={formData.pewaris}
                      onChange={handleChange}
                      required
                    />

                    <span>⌕</span>
                  </div>
                </div>

                {/* AHLI WARIS */}
                <div className="saw-form-group">
                  <label htmlFor="ahliWaris">
                    Ahli Waris <span>*</span>
                  </label>

                  <div className="saw-search-input">
                    <input
                      id="ahliWaris"
                      name="ahliWaris"
                      type="text"
                      placeholder="Cari data ahli waris"
                      value={formData.ahliWaris}
                      onChange={handleChange}
                      required
                    />

                    <span>⌕</span>
                  </div>
                </div>

                {/* HUBUNGAN */}
                <div className="saw-form-group">
                  <label htmlFor="hubungan">
                    Hubungan <span>*</span>
                  </label>

                  <input
                    id="hubungan"
                    name="hubungan"
                    type="text"
                    placeholder="Masukkan hubungan"
                    value={formData.hubungan}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* UPLOAD */}
                <div className="saw-form-group saw-upload-group">

                  <label htmlFor="dokumen">
                    Upload Dokumen <span>*</span>
                  </label>

                  <label
                    htmlFor="dokumen"
                    className="saw-upload-box"
                  >
                    <div className="upload-icon">☁</div>

                    <p>
                      Upload dokumen di sini dengan format
                      <br />
                      PDF
                    </p>

                    <input
                      id="dokumen"
                      name="dokumen"
                      type="file"
                      accept=".pdf"
                      onChange={handleChange}
                      required
                    />
                  </label>

                  {formData.dokumen && (
                    <p className="saw-selected-file">
                      {formData.dokumen.name}
                    </p>
                  )}

                </div>

              </div>

              {/* ================= KOLOM KANAN ================= */}
              <div className="tambah-saw-column">

                {/* NOMOR SURAT */}
                <div className="saw-form-group">
                  <label htmlFor="nomorSurat">
                    Nomor Surat <span>*</span>
                  </label>

                  <input
                    id="nomorSurat"
                    name="nomorSurat"
                    type="text"
                    placeholder="Masukkan nomor surat"
                    value={formData.nomorSurat}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* TANGGAL PENGAJUAN */}
                <div className="saw-form-group">
                  <label htmlFor="tanggalPengajuan">
                    Tanggal Pengajuan <span>*</span>
                  </label>

                  <div className="saw-date-input">
                    <input
                      id="tanggalPengajuan"
                      name="tanggalPengajuan"
                      type="date"
                      value={formData.tanggalPengajuan}
                      onChange={handleChange}
                      required
                    />

                    <span>▣</span>
                  </div>
                </div>

                {/* TANGGAL SELESAI */}
                <div className="saw-form-group">
                  <label htmlFor="tanggalSelesai">
                    Tanggal Selesai
                  </label>

                  <div className="saw-date-input">
                    <input
                      id="tanggalSelesai"
                      name="tanggalSelesai"
                      type="date"
                      value={formData.tanggalSelesai}
                      onChange={handleChange}
                    />

                    <span>▣</span>
                  </div>
                </div>

                {/* TAHAP */}
                <div className="saw-form-group">
                  <label htmlFor="tahap">
                    Tahap <span>*</span>
                  </label>

                  <div className="saw-select-wrapper">
                    <select
                      id="tahap"
                      name="tahap"
                      value={formData.tahap}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Pilih tahap
                      </option>

                      <option value="Diterima oleh kelurahan">
                        Diterima oleh kelurahan
                      </option>

                      <option value="Tanda Tangan Sekretaris">
                        Tanda Tangan Sekretaris
                      </option>

                      <option value="Diproses Kecamatan">
                        Diproses Kecamatan
                      </option>

                      <option value="Selesai">
                        Selesai
                      </option>
                    </select>
                  </div>
                </div>

              </div>

            </div>

            {/* SIMPAN */}
            <div className="tambah-saw-submit">
              <button
                type="submit"
                className="simpan-saw-button"
              >
                <img className="save-icon-img" src={simpanDataIcon} alt="" />
                Simpan Data
              </button>
            </div>

          </form>

        </section>

      </main>
    </div>
  );
}

export default TambahSuratAhliWaris;