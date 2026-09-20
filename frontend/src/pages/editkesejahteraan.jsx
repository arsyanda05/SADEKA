import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

const dataKesejahteraan = [
  {
    no: "001",
    nama: "Haryadi",
    nik: "3530110702060001",
    kategori: "Rutilahu",
    status: "Selesai",
    rt: "02",
    rw: "01",
    keterangan:
      "Kondisi atap dan dinding rumah yang mengalami kerusakan sudah diperbaiki",
  },
  {
    no: "002",
    nama: "Sri Rejeki",
    nik: "3530115702060001",
    kategori: "Ibu Hamil",
    status: "Dalam Penanganan",
    rt: "16",
    rw: "03",
    keterangan:
      "Kehamilan 7 bulan, rutin melakukan pemeriksaan",
  },
  {
    no: "003",
    nama: "Nadira",
    nik: "3520116704090001",
    kategori: "Stunting",
    status: "Belum Ditangani",
    rt: "19",
    rw: "04",
    keterangan:
      "Memerlukan pemantauan pertumbuhan dan asupan gizi secara berkala",
  },
  {
    no: "004",
    nama: "Kayla",
    nik: "3540121702090001",
    kategori: "Putus Sekolah",
    status: "Selesai",
    rt: "23",
    rw: "05",
    keterangan:
      "Telah kembali melanjutkan pendidikan",
  },
  {
    no: "005",
    nama: "Utami",
    nik: "3550118702980001",
    kategori: "Ibu Hamil",
    status: "Dalam Penanganan",
    rt: "06",
    rw: "02",
    keterangan:
      "Rutin melakukan pemeriksaan kehamilan di fasilitas kesehatan",
  },
];

function EditKesejahteraan() {
  const navigate = useNavigate();
  const { id } = useParams();

  const data =
    dataKesejahteraan.find((item) => item.no === id) ||
    dataKesejahteraan[0];

  const [formData, setFormData] = useState({
    penduduk: data.nama,
    kategori: data.kategori,
    status: data.status,
    keterangan: data.keterangan,
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

    console.log("Data yang diedit:", {
      id,
      ...formData,
    });

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
            <h2>Edit Kesejahteraan</h2>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="tambah-kesejahteraan-form-grid">

              {/* KOLOM KIRI */}
              <div className="tambah-kesejahteraan-form-column">

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

                    <span className="search-icon">
                      ⌕
                    </span>
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
                      <option value="Stunting">
                        Stunting
                      </option>
                      <option value="Ibu Hamil">
                        Ibu Hamil
                      </option>
                      <option value="Rutilahu">
                        Rutilahu
                      </option>
                      <option value="Putus Sekolah">
                        Putus Sekolah
                      </option>
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
                Simpan Perubahan
              </button>
            </div>

          </form>
        </section>
      </main>
    </div>
  );
}

export default EditKesejahteraan;