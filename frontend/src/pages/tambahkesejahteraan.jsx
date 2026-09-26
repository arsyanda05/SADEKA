import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./header";

import simpanDataIcon from "../assets/simpandata.png";

import {
  createKesejahteraan,
  getPenduduk,
} from "../services/api";

function TambahKesejahteraan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    penduduk: "",
    kategori: "",
    status: "",
    keterangan: "",
  });

  const [dataPenduduk, setDataPenduduk] = useState([]);

  const [loading, setLoading] = useState(false);

  const [loadingPenduduk, setLoadingPenduduk] =
    useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     AMBIL DATA PENDUDUK
     ======================================================= */

  useEffect(() => {
    const loadPenduduk = async () => {
      try {
        setLoadingPenduduk(true);
        setError("");

        const data = await getPenduduk();

        setDataPenduduk(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Gagal mengambil data penduduk:",
          error
        );

        setError(
          "Gagal mengambil data penduduk."
        );
      } finally {
        setLoadingPenduduk(false);
      }
    };

    loadPenduduk();
  }, []);

  /* =======================================================
     HANDLE CHANGE
     ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  /* =======================================================
     SUBMIT
     ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    /* =====================================================
       VALIDASI FORM
       ===================================================== */

    if (!formData.penduduk.trim()) {
      setError(
        "Penduduk wajib diisi."
      );
      return;
    }

    if (!formData.kategori) {
      setError(
        "Kategori wajib dipilih."
      );
      return;
    }

    if (!formData.status) {
      setError(
        "Status wajib dipilih."
      );
      return;
    }

    if (!formData.keterangan.trim()) {
      setError(
        "Keterangan wajib diisi."
      );
      return;
    }

    /* =====================================================
       CARI PENDUDUK
       BERDASARKAN NAMA ATAU NIK
       ===================================================== */

    const inputPenduduk =
      formData.penduduk
        .trim()
        .toLowerCase();

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

    /* =====================================================
       JIKA PENDUDUK TIDAK DITEMUKAN
       ===================================================== */

    if (!pendudukDipilih) {
      setError(
        "Data penduduk tidak ditemukan. Masukkan nama atau NIK yang sesuai dengan data penduduk."
      );
      return;
    }

    /* =====================================================
       SIMPAN KE DATABASE
       ===================================================== */

    try {
      setLoading(true);

      await createKesejahteraan({
        id_penduduk:
          pendudukDipilih.id_penduduk,

        kategori:
          formData.kategori,

        status:
          formData.status,

        keterangan:
          formData.keterangan.trim(),
      });

      /* ===================================================
         JIKA BERHASIL
         KEMBALI KE HALAMAN KESEJAHTERAAN
         =================================================== */

      navigate("/kesejahteraan");

    } catch (error) {
      console.error(
        "Gagal menyimpan data kesejahteraan:",
        error
      );

      setError(
        error.message ||
          "Gagal menyimpan data kesejahteraan."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     RETURN
     ======================================================= */

  return (
    <div className="tambah-kesejahteraan-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <Header
        title="Kesejahteraan"
        showSearch={false}
      />

      {/* ===================================================
          CONTENT
          =================================================== */}

      <main className="tambah-kesejahteraan-content">

        {/* =================================================
            TOMBOL KEMBALI
            ================================================= */}

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

        {/* =================================================
            FORM CARD
            ================================================= */}

        <section className="tambah-kesejahteraan-card">

          <div className="tambah-kesejahteraan-card-title">

            <h2>
              Tambah Kesejahteraan
            </h2>

          </div>

          <form
            onSubmit={handleSubmit}
          >

            {/* =================================================
                ERROR
                ================================================= */}

            {error && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background:
                    "#fee2e2",
                  color: "#b91c1c",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <div className="tambah-kesejahteraan-form-grid">

              {/* =================================================
                  KOLOM KIRI
                  ================================================= */}

              <div className="tambah-kesejahteraan-form-column">

                {/* =================================================
                    PENDUDUK
                    ================================================= */}

                <div className="kesejahteraan-form-group">

                  <label>
                    Penduduk<span>*</span>
                  </label>

                  <div className="kesejahteraan-search-input">

                    <input
                      type="text"
                      name="penduduk"
                      value={
                        formData.penduduk
                      }
                      onChange={
                        handleChange
                      }
                      placeholder={
                        loadingPenduduk
                          ? "Memuat data penduduk..."
                          : "Cari data penduduk"
                      }
                      disabled={
                        loadingPenduduk
                      }
                    />

                    <span className="search-icon">
                      ⌕
                    </span>

                  </div>

                  {/* =================================================
                      INFORMASI PENCARIAN
                      ================================================= */}

                  {formData.penduduk &&
                    !loadingPenduduk && (
                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        Masukkan nama atau NIK
                        sesuai data penduduk.
                      </div>
                    )}

                </div>

              </div>

              {/* =================================================
                  KOLOM KANAN
                  ================================================= */}

              <div className="tambah-kesejahteraan-form-column">

                {/* =================================================
                    KATEGORI
                    ================================================= */}

                <div className="kesejahteraan-form-group">

                  <label>
                    Kategori<span>*</span>
                  </label>

                  <div className="kesejahteraan-select-wrapper">

                    <select
                      name="kategori"
                      value={
                        formData.kategori
                      }
                      onChange={
                        handleChange
                      }
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

                {/* =================================================
                    STATUS
                    ================================================= */}

                <div className="kesejahteraan-form-group">

                  <label>
                    Status<span>*</span>
                  </label>

                  <div className="kesejahteraan-select-wrapper">

                    <select
                      name="status"
                      value={
                        formData.status
                      }
                      onChange={
                        handleChange
                      }
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

                {/* =================================================
                    KETERANGAN
                    ================================================= */}

                <div className="kesejahteraan-form-group">

                  <label>
                    Keterangan<span>*</span>
                  </label>

                  <textarea
                    name="keterangan"
                    value={
                      formData.keterangan
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan Keterangan"
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                SIMPAN
                ================================================= */}

            <div className="tambah-kesejahteraan-submit">

              <button
                type="submit"
                className="save-kesejahteraan-button"
                disabled={
                  loading ||
                  loadingPenduduk
                }
              >

                <img
                  className="save-icon-img"
                  src={simpanDataIcon}
                  alt=""
                />

                {loading
                  ? "Menyimpan..."
                  : "Simpan Data"}

              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default TambahKesejahteraan;