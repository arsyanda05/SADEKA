import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

import { createUMKM } from "../services/api";

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

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.namaUsaha.trim() ||
      !formData.pemilik.trim() ||
      !formData.jenisUsaha.trim() ||
      !formData.nib.trim() ||
      !formData.rt.trim() ||
      !formData.rw.trim() ||
      !formData.alamat.trim()
    ) {
      setErrorMessage(
        "Semua data UMKM wajib diisi."
      );
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");

      await createUMKM({
        nama_usaha: formData.namaUsaha.trim(),
        pemilik: formData.pemilik.trim(),
        jenis_usaha: formData.jenisUsaha.trim(),
        nib: formData.nib.trim(),
        alamat: formData.alamat.trim(),
        rt: formData.rt.trim(),
        rw: formData.rw.trim(),
      });

      window.alert(
        "Data UMKM berhasil ditambahkan."
      );

      navigate("/umkm");
    } catch (error) {
      console.error(
        "Gagal menambahkan data UMKM:",
        error
      );

      setErrorMessage(
        error.message ||
          "Gagal menambahkan data UMKM."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tambah-umkm-page">

      {/* HEADER */}
      <Header
        title="UMKM"
        showSearch={false}
      />

      {/* CONTENT */}
      <main className="tambah-umkm-content">

        {/* TOMBOL KEMBALI */}
        <div className="tambah-umkm-back-wrapper">

          <button
            type="button"
            className="tambah-umkm-back-button"
            onClick={() =>
              navigate("/umkm")
            }
            disabled={saving}
          >
            ←
            <span>
              Kembali ke UMKM
            </span>
          </button>

        </div>

        {/* FORM */}
        <section className="tambah-umkm-card">

          <div className="tambah-umkm-card-title">
            <h2>
              Tambah UMKM
            </h2>
          </div>

          {errorMessage && (
            <div className="umkm-error-message">
              {errorMessage}
            </div>
          )}

          <form
            className="tambah-umkm-form"
            onSubmit={handleSubmit}
          >

            <div className="tambah-umkm-form-grid">

              {/* =========================================
                  KOLOM KIRI
              ========================================= */}

              <div className="tambah-umkm-column">

                {/* NAMA USAHA */}
                <div className="tambah-umkm-form-group">

                  <label htmlFor="namaUsaha">
                    Nama Usaha{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="namaUsaha"
                    name="namaUsaha"
                    value={
                      formData.namaUsaha
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan nama usaha"
                    required
                    disabled={saving}
                  />

                </div>

                {/* PEMILIK */}
                <div className="tambah-umkm-form-group">

                  <label htmlFor="pemilik">
                    Pemilik{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="pemilik"
                    name="pemilik"
                    value={
                      formData.pemilik
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan nama pemilik"
                    required
                    disabled={saving}
                  />

                </div>

                {/* JENIS USAHA */}
                <div className="tambah-umkm-form-group">

                  <label htmlFor="jenisUsaha">
                    Jenis Usaha{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="jenisUsaha"
                    name="jenisUsaha"
                    value={
                      formData.jenisUsaha
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan jenis usaha"
                    required
                    disabled={saving}
                  />

                </div>

                {/* NIB */}
                <div className="tambah-umkm-form-group">

                  <label htmlFor="nib">
                    Nomor Induk Berusaha (NIB){" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="nib"
                    name="nib"
                    value={
                      formData.nib
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan NIB"
                    required
                    disabled={saving}
                  />

                </div>

              </div>

              {/* =========================================
                  KOLOM KANAN
              ========================================= */}

              <div className="tambah-umkm-column">

                {/* RT */}
                <div className="tambah-umkm-form-group">

                  <label htmlFor="rt">
                    RT{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="rt"
                    name="rt"
                    value={
                      formData.rt
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan RT usaha"
                    required
                    disabled={saving}
                  />

                </div>

                {/* RW */}
                <div className="tambah-umkm-form-group">

                  <label htmlFor="rw">
                    RW{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="rw"
                    name="rw"
                    value={
                      formData.rw
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan RW usaha"
                    required
                    disabled={saving}
                  />

                </div>

                {/* ALAMAT */}
                <div className="tambah-umkm-form-group tambah-umkm-alamat-group">

                  <label htmlFor="alamat">
                    Alamat{" "}
                    <span>*</span>
                  </label>

                  <textarea
                    id="alamat"
                    name="alamat"
                    value={
                      formData.alamat
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan alamat usaha"
                    required
                    disabled={saving}
                  />

                </div>

              </div>

            </div>

            {/* SIMPAN */}
            <div className="tambah-umkm-submit">

              <button
                type="submit"
                className="tambah-umkm-save-button"
                disabled={saving}
              >

                <img
                  className="save-icon-img"
                  src={simpanDataIcon}
                  alt=""
                />

                {saving
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

export default TambahUMKM;