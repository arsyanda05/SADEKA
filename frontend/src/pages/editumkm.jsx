import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

import {
  getDetailUMKM,
  updateUMKM,
} from "../services/api";


function EditUmkm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    namaUsaha: "",
    pemilik: "",
    jenisUsaha: "",
    nib: "",
    rt: "",
    rw: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  /* =========================================================
     AMBIL DATA UMKM
  ========================================================= */

  useEffect(() => {
    const loadDataUMKM = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getDetailUMKM(id);

        setFormData({
          namaUsaha: data.nama_usaha || "",
          pemilik: data.pemilik || "",
          jenisUsaha: data.jenis_usaha || "",
          nib: data.nib || "",
          rt: data.rt || "",
          rw: data.rw || "",
          alamat: data.alamat || "",
        });

      } catch (error) {
        console.error(
          "Gagal mengambil detail UMKM:",
          error
        );

        setErrorMessage(
          error.message ||
          "Gagal mengambil data UMKM"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDataUMKM();
  }, [id]);


  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  /* =========================================================
     HANDLE SUBMIT
  ========================================================= */

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
      window.alert(
        "Semua data UMKM wajib diisi."
      );

      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");

      await updateUMKM(id, {
        nama_usaha: formData.namaUsaha.trim(),
        pemilik: formData.pemilik.trim(),
        jenis_usaha: formData.jenisUsaha.trim(),
        nib: formData.nib.trim(),
        rt: formData.rt.trim(),
        rw: formData.rw.trim(),
        alamat: formData.alamat.trim(),
      });

      window.alert(
        "Data UMKM berhasil diperbarui."
      );

      navigate("/umkm");

    } catch (error) {
      console.error(
        "Gagal mengubah data UMKM:",
        error
      );

      window.alert(
        error.message ||
        "Gagal mengubah data UMKM."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="tambah-umkm-page">

        <Header
          title="UMKM"
          showSearch={false}
          onMenuClick={() =>
            navigate("/umkm")
          }
        />

        <main className="tambah-umkm-content">

          <div className="tambah-umkm-top-action">

            <button
              type="button"
              className="back-umkm-button"
              onClick={() =>
                navigate("/umkm")
              }
            >
              ← Kembali ke UMKM
            </button>

          </div>

          <section className="tambah-umkm-card">

            <div className="tambah-umkm-card-title">
              <h2>Edit UMKM</h2>
            </div>

            <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
            >
              Memuat data UMKM...
            </div>

          </section>

        </main>

      </div>
    );
  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (errorMessage) {
    return (
      <div className="tambah-umkm-page">

        <Header
          title="UMKM"
          showSearch={false}
          onMenuClick={() =>
            navigate("/umkm")
          }
        />

        <main className="tambah-umkm-content">

          <div className="tambah-umkm-top-action">

            <button
              type="button"
              className="back-umkm-button"
              onClick={() =>
                navigate("/umkm")
              }
            >
              ← Kembali ke UMKM
            </button>

          </div>

          <section className="tambah-umkm-card">

            <div className="tambah-umkm-card-title">
              <h2>Edit UMKM</h2>
            </div>

            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "#d32f2f",
              }}
            >
              {errorMessage}
            </div>

          </section>

        </main>

      </div>
    );
  }


  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="tambah-umkm-page">

      {/* HEADER */}

      <Header
        title="UMKM"
        showSearch={false}
        onMenuClick={() =>
          navigate("/umkm")
        }
      />


      {/* CONTENT */}

      <main className="tambah-umkm-content">

        {/* KEMBALI */}

        <div className="tambah-umkm-top-action">

          <button
            type="button"
            className="back-umkm-button"
            onClick={() =>
              navigate("/umkm")
            }
          >
            ← Kembali ke UMKM
          </button>

        </div>


        {/* FORM */}

        <section className="tambah-umkm-card">

          <div className="tambah-umkm-card-title">

            <h2>
              Edit UMKM
            </h2>

          </div>


          <form
            onSubmit={handleSubmit}
          >

            <div className="tambah-umkm-form-grid">

              {/* =================================================
                  KOLOM KIRI
              ================================================= */}

              <div className="tambah-umkm-form-column">

                {/* NAMA USAHA */}

                <div className="umkm-form-group">

                  <label>
                    Nama Usaha <span>*</span>
                  </label>

                  <input
                    type="text"
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

                <div className="umkm-form-group">

                  <label>
                    Pemilik <span>*</span>
                  </label>

                  <input
                    type="text"
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

                <div className="umkm-form-group">

                  <label>
                    Jenis Usaha <span>*</span>
                  </label>

                  <input
                    type="text"
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

                <div className="umkm-form-group">

                  <label>
                    Nomor Induk Berusaha (NIB){" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
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


              {/* =================================================
                  KOLOM KANAN
              ================================================= */}

              <div className="tambah-umkm-form-column">

                {/* RT */}

                <div className="umkm-form-group">

                  <label>
                    RT <span>*</span>
                  </label>

                  <input
                    type="text"
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

                <div className="umkm-form-group">

                  <label>
                    RW <span>*</span>
                  </label>

                  <input
                    type="text"
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

                <div className="umkm-form-group">

                  <label>
                    Alamat <span>*</span>
                  </label>

                  <textarea
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


            {/* =================================================
                SIMPAN
            ================================================= */}

            <div className="umkm-form-submit">

              <button
                type="submit"
                className="save-umkm-button"
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

export default EditUmkm;