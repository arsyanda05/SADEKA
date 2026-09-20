import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

function TambahKesejahteraan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    penduduk: "",
    kategori: "",
    status: "",
    keterangan: "",
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

    console.log("Data Kesejahteraan:", formData);

    navigate("/kesejahteraan");
  };

  return (
    <div className="tambah-kesejahteraan-page">

      {/* HEADER */}
      <Header title="Kesejahteraan" showSearch={false} />

      {/* CONTENT */}
      <main className="tambah-kesejahteraan-content">

        {/* TOMBOL KEMBALI */}
        <div className="tambah-kesejahteraan-top-action">
          <button
            type="button"
            className="back-kesejahteraan-button"
            onClick={() => navigate("/kesejahteraan")}
          >
            ←&nbsp; Kembali ke Kesejahteraan
          </button>
        </div>

        {/* FORM CARD */}
        <section className="tambah-kesejahteraan-card">

          <div className="tambah-kesejahteraan-card-title">
            <h2>Tambah Kesejahteraan</h2>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="tambah-kesejahteraan-form-grid">

              {/* KOLOM KIRI */}
              <div className="tambah-kesejahteraan-form-column">

                {/* PENDUDUK */}
                <div className="kesejahteraan-form-group">
                  <label>
                    Penduduk<span>*</span>
                  </label>

                  <div className="kesejahteraan-search-input">
                    <input
                      type="text"
                      name="penduduk"
                      value={formData.penduduk}
                      onChange={handleChange}
                      placeholder="Cari data penduduk"
                    />

                    <span className="search-icon">⌕</span>
                  </div>
                </div>

              </div>

              {/* KOLOM KANAN */}
              <div className="tambah-kesejahteraan-form-column">

                {/* KATEGORI */}
                <div className="kesejahteraan-form-group">
                  <label>
                    Kategori<span>*</span>
                  </label>

                  <div className="kesejahteraan-select-wrapper">
                    <select
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleChange}
                    >
                      <option value="">
                        Pilih kategori kesejahteraan
                      </option>
                      <option value="Stunting">Stunting</option>
                      <option value="Ibu Hamil">Ibu Hamil</option>
                      <option value="Rutilahu">Rutilahu</option>
                      <option value="Putus Sekolah">Putus Sekolah</option>
                    </select>

                    <span className="select-arrow"></span>
                  </div>
                </div>

                {/* STATUS */}
                <div className="kesejahteraan-form-group">
                  <label>
                    Status<span>*</span>
                  </label>

                  <div className="kesejahteraan-select-wrapper">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="">
                        Masukkan status
                      </option>
                      <option value="Belum Ditangani">
                        Belum Ditangani
                      </option>
                      <option value="Dalam Penanganan">
                        Dalam Penanganan
                      </option>
                      <option value="Selesai">
                        Selesai
                      </option>
                    </select>

                    <span className="select-arrow"></span>
                  </div>
                </div>

                {/* KETERANGAN */}
                <div className="kesejahteraan-form-group">
                  <label>
                    Keterangan<span>*</span>
                  </label>

                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    placeholder="Masukkan Keterangan"
                  />
                </div>

              </div>
            </div>

            {/* SIMPAN */}
            <div className="tambah-kesejahteraan-submit">
              <button
                type="submit"
                className="save-kesejahteraan-button"
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

export default TambahKesejahteraan;