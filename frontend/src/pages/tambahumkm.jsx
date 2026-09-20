import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

function TambahUMKM() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaUsaha: "",
    pemilik: "",
    jenisUsaha: "",
    nib: "",
    rt: "",
    rw: "",
    alamat: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Data UMKM:", formData);

    // sementara kembali ke halaman UMKM
    navigate("/umkm");
  };

  return (
    <div className="tambah-umkm-page">
      {/* HEADER */}
      <Header title="UMKM" showSearch={false} />

      {/* CONTENT */}
      <main className="tambah-umkm-content">

        {/* TOMBOL KEMBALI */}
        <div className="tambah-umkm-back-wrapper">
          <button
            type="button"
            className="tambah-umkm-back-button"
            onClick={() => navigate("/umkm")}
          >
            ←
            <span>Kembali ke UMKM</span>
          </button>
        </div>

        {/* FORM */}
        <section className="tambah-umkm-card">

          <div className="tambah-umkm-card-title">
            <h2>Tambah UMKM</h2>
          </div>

          <form
            className="tambah-umkm-form"
            onSubmit={handleSubmit}
          >
            <div className="tambah-umkm-form-grid">

              {/* KOLOM KIRI */}
              <div className="tambah-umkm-column">

                <div className="tambah-umkm-form-group">
                  <label htmlFor="namaUsaha">
                    Nama Usaha <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="namaUsaha"
                    name="namaUsaha"
                    value={formData.namaUsaha}
                    onChange={handleChange}
                    placeholder="Masukkan nama usaha"
                    required
                  />
                </div>

                <div className="tambah-umkm-form-group">
                  <label htmlFor="pemilik">
                    Pemilik <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="pemilik"
                    name="pemilik"
                    value={formData.pemilik}
                    onChange={handleChange}
                    placeholder="Masukkan nama pemilik"
                    required
                  />
                </div>

                <div className="tambah-umkm-form-group">
                  <label htmlFor="jenisUsaha">
                    Jenis Usaha <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="jenisUsaha"
                    name="jenisUsaha"
                    value={formData.jenisUsaha}
                    onChange={handleChange}
                    placeholder="Masukkan jenis usaha"
                    required
                  />
                </div>

                <div className="tambah-umkm-form-group">
                  <label htmlFor="nib">
                    Nomor Induk Berusaha (NIB) <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="nib"
                    name="nib"
                    value={formData.nib}
                    onChange={handleChange}
                    placeholder="Masukkan NIB"
                    required
                  />
                </div>

              </div>

              {/* KOLOM KANAN */}
              <div className="tambah-umkm-column">

                <div className="tambah-umkm-form-group">
                  <label htmlFor="rt">
                    RT <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="rt"
                    name="rt"
                    value={formData.rt}
                    onChange={handleChange}
                    placeholder="Masukkan RT usaha"
                    required
                  />
                </div>

                <div className="tambah-umkm-form-group">
                  <label htmlFor="rw">
                    RW <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="rw"
                    name="rw"
                    value={formData.rw}
                    onChange={handleChange}
                    placeholder="Masukkan RW usaha"
                    required
                  />
                </div>

                <div className="tambah-umkm-form-group tambah-umkm-alamat-group">
                  <label htmlFor="alamat">
                    Alamat <span>*</span>
                  </label>

                  <textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Masukkan alamat usaha"
                    required
                  />
                </div>

              </div>

            </div>

            {/* SIMPAN */}
            <div className="tambah-umkm-submit">
              <button
                type="submit"
                className="tambah-umkm-save-button"
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

export default TambahUMKM;