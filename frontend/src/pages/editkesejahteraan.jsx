import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

import {
  getDetailKesejahteraan,
  getPenduduk,
  updateKesejahteraan,
} from "../services/api";

function EditKesejahteraan() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    penduduk: "",
    kategori: "",
    status: "",
    keterangan: "",
  });

  const [dataPenduduk, setDataPenduduk] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  /*
   * ==============================
   * LOAD DATA KESEJAHTERAAN
   * ==============================
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        /*
         * Ambil data kesejahteraan berdasarkan ID
         * dan data penduduk secara bersamaan.
         */
        const [dataKesejahteraan, penduduk] =
          await Promise.all([
            getDetailKesejahteraan(id),
            getPenduduk(),
          ]);

        /*
         * Simpan data penduduk untuk
         * pencarian nama / NIK saat submit.
         */
        setDataPenduduk(penduduk);

        /*
         * Isi form berdasarkan data
         * yang berasal dari database.
         */
        setFormData({
          penduduk:
            dataKesejahteraan.nama || "",
          kategori:
            dataKesejahteraan.kategori || "",
          status:
            dataKesejahteraan.status || "",
          keterangan:
            dataKesejahteraan.keterangan || "",
        });
      } catch (error) {
        console.error(
          "Error mengambil data kesejahteraan:",
          error
        );

        setErrorMessage(
          error.message ||
            "Gagal mengambil data kesejahteraan"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /*
   * ==============================
   * HANDLE INPUT
   * ==============================
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * ==============================
   * HANDLE SUBMIT
   * ==============================
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
     * Validasi data
     */
    if (
      !formData.penduduk.trim() ||
      !formData.kategori ||
      !formData.status ||
      !formData.keterangan.trim()
    ) {
      window.alert(
        "Semua data wajib diisi."
      );
      return;
    }

    /*
     * Normalisasi input penduduk
     * agar pencarian tidak sensitif
     * terhadap huruf besar / kecil.
     */
    const inputPenduduk =
      formData.penduduk
        .trim()
        .toLowerCase();

    /*
     * Cari penduduk berdasarkan
     * nama atau NIK.
     */
    const pendudukDipilih =
      dataPenduduk.find((item) => {
        const nama = String(
          item.nama || ""
        )
          .trim()
          .toLowerCase();

        const nik = String(
          item.nik || ""
        )
          .trim()
          .toLowerCase();

        return (
          nama === inputPenduduk ||
          nik === inputPenduduk
        );
      });

    /*
     * Jika penduduk tidak ditemukan
     */
    if (!pendudukDipilih) {
      window.alert(
        "Data penduduk tidak ditemukan. Masukkan nama atau NIK yang sesuai dengan data penduduk."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * Update data Kesejahteraan
       * ke PostgreSQL melalui API.
       */
      await updateKesejahteraan(id, {
        id_penduduk:
          pendudukDipilih.id_penduduk,
        kategori:
          formData.kategori,
        status:
          formData.status,
        keterangan:
          formData.keterangan.trim(),
      });

      window.alert(
        "Data kesejahteraan berhasil diperbarui."
      );

      /*
       * Kembali ke halaman Kesejahteraan
       */
      navigate("/kesejahteraan");
    } catch (error) {
      console.error(
        "Error mengubah data kesejahteraan:",
        error
      );

      window.alert(
        error.message ||
          "Gagal mengubah data kesejahteraan."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ==============================
   * LOADING
   * ==============================
   */
  if (loading) {
    return (
      <div className="tambah-kesejahteraan-page">

        <Header
          title="Kesejahteraan"
          showSearch={false}
        />

        <main className="tambah-kesejahteraan-content">

          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Memuat data kesejahteraan...
          </div>

        </main>
      </div>
    );
  }

  /*
   * ==============================
   * ERROR
   * ==============================
   */
  if (errorMessage) {
    return (
      <div className="tambah-kesejahteraan-page">

        <Header
          title="Kesejahteraan"
          showSearch={false}
        />

        <main className="tambah-kesejahteraan-content">

          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >

            <p>{errorMessage}</p>

            <button
              type="button"
              className="back-kesejahteraan-button"
              onClick={() =>
                navigate("/kesejahteraan")
              }
            >
              ←&nbsp; Kembali ke Kesejahteraan
            </button>

          </div>

        </main>
      </div>
    );
  }

  /*
   * ==============================
   * HALAMAN EDIT
   * ==============================
   */
  return (
    <div className="tambah-kesejahteraan-page">

      {/* HEADER */}
      <Header
        title="Kesejahteraan"
        showSearch={false}
      />

      {/* CONTENT */}
      <main className="tambah-kesejahteraan-content">

        {/* TOMBOL KEMBALI */}
        <div className="tambah-kesejahteraan-top-action">

          <button
            type="button"
            className="back-kesejahteraan-button"
            onClick={() =>
              navigate("/kesejahteraan")
            }
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

              {/* =========================
                  KOLOM KIRI
              ========================== */}
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
                      disabled={saving}
                    />

                    <span className="search-icon">
                      ⌕
                    </span>

                  </div>

                  <small>
                    Masukkan nama atau NIK sesuai
                    data penduduk.
                  </small>

                </div>

              </div>

              {/* =========================
                  KOLOM KANAN
              ========================== */}
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
                      disabled={saving}
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
                      disabled={saving}
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
                    disabled={saving}
                  />

                </div>

              </div>
            </div>

            {/* SIMPAN */}
            <div className="tambah-kesejahteraan-submit">

              <button
                type="submit"
                className="save-kesejahteraan-button"
                disabled={saving}
              >

                <img
                  className="save-icon-img"
                  src={simpanDataIcon}
                  alt=""
                />

                {saving
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}

              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default EditKesejahteraan;