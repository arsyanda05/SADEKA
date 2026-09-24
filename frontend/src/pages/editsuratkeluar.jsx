import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header";
import backIcon from "../assets/back.png";
import hapusIcon from "../assets/hapussampah.png";
import simpanDataIcon from "../assets/simpandata.png";

const toDateInputValue = (value) => {
  if (!value) return "";
  const [day, month, year] = value.split("/");
  return day && month && year ? `${year}-${month}-${day}` : value;
};

function EditSuratKeluar() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const surat = state?.surat;
  const [formData, setFormData] = useState({
    nomorSurat: surat?.nomorSurat || "",
    tanggal: toDateInputValue(surat?.tanggal),
    asalSurat: surat?.asalSurat || "",
    tujuan: surat?.tujuan || "",
    keterangan: surat?.keterangan || "",
    jenis: surat?.jenis || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Surat keluar berhasil diperbarui!");
    navigate("/surat-keluar");
  };

  const handleDelete = () => {
    if (window.confirm(`Hapus surat keluar ${formData.nomorSurat}?`)) {
      navigate("/surat-keluar");
    }
  };

  return (
    <div className="tambah-surat-masuk-page">
      <Header title="Edit Surat Keluar" showSearch={false} />
      <main className="tambah-surat-masuk-content">
        <div className="tambah-surat-masuk-back-wrapper">
          <button type="button" className="tambah-surat-masuk-back-button" onClick={() => navigate("/surat-keluar")}>
            <img src={backIcon} alt="" />
            Kembali ke Surat Keluar
          </button>
        </div>

        <form className="tambah-surat-masuk-form" onSubmit={handleSubmit}>
          <section className="tambah-surat-masuk-card">
            <h2>Informasi Surat Keluar</h2>
            <div className="tambah-surat-masuk-grid">
              <div className="tambah-surat-masuk-field"><label htmlFor="nomorSurat">Nomor Surat</label><input id="nomorSurat" name="nomorSurat" value={formData.nomorSurat} onChange={handleChange} required /></div>
              <div className="tambah-surat-masuk-field"><label htmlFor="tanggal">Tanggal</label><input id="tanggal" name="tanggal" type="date" value={formData.tanggal} onChange={handleChange} required /></div>
              <div className="tambah-surat-masuk-field"><label htmlFor="asalSurat">Asal Surat</label><input id="asalSurat" name="asalSurat" value={formData.asalSurat} onChange={handleChange} required /></div>
              <div className="tambah-surat-masuk-field"><label htmlFor="tujuan">Tujuan Surat</label><input id="tujuan" name="tujuan" value={formData.tujuan} onChange={handleChange} required /></div>
              <div className="tambah-surat-masuk-field tambah-surat-masuk-keterangan"><label htmlFor="keterangan">Keterangan</label><textarea id="keterangan" name="keterangan" value={formData.keterangan} onChange={handleChange} required /></div>
              <div className="tambah-surat-masuk-field"><label htmlFor="jenis">Jenis Surat</label><select id="jenis" name="jenis" value={formData.jenis} onChange={handleChange} required><option value="" disabled>Pilih Jenis Surat</option><option value="Surat Keterangan Usaha">Surat Keterangan Usaha</option><option value="Undangan Dinas">Undangan Dinas</option><option value="Permohonan">Permohonan</option><option value="Laporan">Laporan</option><option value="Undangan Rapat">Undangan Rapat</option><option value="Rekomendasi">Rekomendasi</option><option value="Pengantar">Pengantar</option><option value="Pemberitahuan">Pemberitahuan</option></select></div>
            </div>
          </section>

          <section className="edit-surat-status-bar">
            <div><strong>Status Pengisian : Form Siap Disimpan</strong><small>Data tervalidasi oleh Sistem SADEKA</small></div>
            <span>Terisi 100%</span>
            <button type="button" className="edit-surat-delete-button" onClick={handleDelete}><img src={hapusIcon} alt="" />Hapus Data</button>
            <button type="submit" className="tambah-surat-masuk-save-button"><img src={simpanDataIcon} alt="" />Simpan Perubahan</button>
          </section>
        </form>
      </main>
    </div>
  );
}

export default EditSuratKeluar;
