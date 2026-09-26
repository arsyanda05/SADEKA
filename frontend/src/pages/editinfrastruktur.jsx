import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

import {
  getDetailInfrastruktur,
  updateInfrastruktur,
} from "../services/api";

function EditInfrastruktur() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ============================================================
  // STATE
  // ============================================================

  const [formData, setFormData] = useState({
    jenis: "",
    kondisi: "",
    pic: "",
    telepon: "",
    tanggalPengadaan: "",
    panjang: "",
    lebar: "",
    alamat: "",
    rt: "",
    rw: "",
    koordinat: "",
    foto: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ============================================================
  // AMBIL DATA DARI DATABASE
  // ============================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        if (!id) {
          throw new Error(
            "ID infrastruktur tidak ditemukan"
          );
        }

        const data =
          await getDetailInfrastruktur(id);

        // ------------------------------------------------------
        // KOORDINAT
        // ------------------------------------------------------

        const latitude =
          data.latitude ?? "";

        const longitude =
          data.longitude ?? "";

        const koordinat =
          latitude !== "" &&
          longitude !== ""
            ? `${latitude}, ${longitude}`
            : "";

        // ------------------------------------------------------
        // TANGGAL
        // ------------------------------------------------------

        let tanggalPengadaan = "";

        if (data.tanggal_pengadaan) {
          try {
            tanggalPengadaan =
              data.tanggal_pengadaan
                .toString()
                .substring(0, 10);
          } catch (error) {
            console.error(
              "Error membaca tanggal:",
              error
            );
          }
        }

        // ------------------------------------------------------
        // MASUKKAN DATA DATABASE KE FORM
        // ------------------------------------------------------

        setFormData({
          jenis: data.jenis || "",

          kondisi:
            data.kondisi_status || "",

          pic:
            data.penanggung_jawab || "",

          telepon:
            data.no_telp || "",

          tanggalPengadaan,

          panjang:
            data.panjang ?? "",

          lebar:
            data.lebar ?? "",

          alamat:
            data.alamat || "",

          rt:
            data.rt || "",

          rw:
            data.rw || "",

          koordinat,

          // Foto lama tidak dimasukkan
          // ke input file karena browser
          // tidak mengizinkan input file
          // diisi secara otomatis.
          foto: null,
        });
      } catch (error) {
        console.error(
          "Error mengambil data infrastruktur:",
          error
        );

        setErrorMessage(
          error.message ||
            "Gagal mengambil data infrastruktur"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // ============================================================
  // HANDLE CHANGE
  // ============================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files
        ? files[0]
        : value,
    }));
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setErrorMessage("");

      // --------------------------------------------------------
      // VALIDASI ID
      // --------------------------------------------------------

      if (!id) {
        throw new Error(
          "ID infrastruktur tidak ditemukan"
        );
      }

      // --------------------------------------------------------
      // VALIDASI KOORDINAT
      // --------------------------------------------------------

      const koordinatParts =
        formData.koordinat
          .split(",")
          .map((item) =>
            item.trim()
          );

      if (
        koordinatParts.length !== 2
      ) {
        throw new Error(
          "Format koordinat harus: latitude, longitude"
        );
      }

      const latitude =
        Number(koordinatParts[0]);

      const longitude =
        Number(koordinatParts[1]);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        throw new Error(
          "Latitude dan longitude harus berupa angka"
        );
      }

      if (
        latitude < -90 ||
        latitude > 90
      ) {
        throw new Error(
          "Latitude harus berada di antara -90 sampai 90"
        );
      }

      if (
        longitude < -180 ||
        longitude > 180
      ) {
        throw new Error(
          "Longitude harus berada di antara -180 sampai 180"
        );
      }

      // --------------------------------------------------------
      // VALIDASI FOTO
      // --------------------------------------------------------

      if (formData.foto) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
        ];

        if (
          !allowedTypes.includes(
            formData.foto.type
          )
        ) {
          throw new Error(
            "Foto harus berformat JPG, JPEG, atau PNG"
          );
        }

        if (
          formData.foto.size >
          2 * 1024 * 1024
        ) {
          throw new Error(
            "Ukuran foto maksimal 2 MB"
          );
        }
      }

      // --------------------------------------------------------
      // DATA YANG DIKIRIM KE BACKEND
      // --------------------------------------------------------

      const data = {
        jenis:
          formData.jenis,

        kondisi_status:
          formData.kondisi,

        penanggung_jawab:
          formData.pic,

        no_telp:
          formData.telepon,

        tanggal_pengadaan:
          formData.tanggalPengadaan,

        panjang:
          formData.panjang === ""
            ? 0
            : Number(
                formData.panjang
              ),

        lebar:
          formData.lebar === ""
            ? 0
            : Number(
                formData.lebar
              ),

        alamat:
          formData.alamat,

        rt:
          formData.rt,

        rw:
          formData.rw,

        latitude,

        longitude,

        // Untuk sekarang masih menyimpan
        // nama file saja.
        foto:
          formData.foto
            ? formData.foto.name
            : "",
      };

      // --------------------------------------------------------
      // UPDATE DATABASE
      // --------------------------------------------------------

      await updateInfrastruktur(
        id,
        data
      );

      alert(
        "Data infrastruktur berhasil diperbarui!"
      );

      // Kembali ke detail
      navigate(
        `/infrastruktur/${id}`
      );
    } catch (error) {
      console.error(
        "Error mengubah infrastruktur:",
        error
      );

      setErrorMessage(
        error.message ||
          "Gagal memperbarui data infrastruktur"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="tambah-infrastruktur-page">
        <Header
          title="Infrastruktur"
          showSearch={false}
        />

        <main className="tambah-infrastruktur-content">
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Memuat data infrastruktur...
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // ERROR SAAT LOAD DATA
  // ============================================================

  if (errorMessage && !formData.jenis) {
    return (
      <div className="tambah-infrastruktur-page">
        <Header
          title="Infrastruktur"
          showSearch={false}
        />

        <main className="tambah-infrastruktur-content">
          <div
            style={{
              padding: "40px",
            }}
          >
            <p>
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/infrastruktur"
                )
              }
            >
              Kembali
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="tambah-infrastruktur-page">

      {/* HEADER */}

      <Header
        title="Infrastruktur"
        showSearch={false}
      />

      {/* CONTENT */}

      <main className="tambah-infrastruktur-content">

        {/* KEMBALI */}

        <div className="tambah-top-action">
          <button
            type="button"
            className="back-infrastruktur-button"
            onClick={() =>
              navigate(
                `/infrastruktur/${id}`
              )
            }
          >
            ← Kembali ke Detail Infrastruktur
          </button>
        </div>

        {/* FORM CARD */}

        <section className="tambah-infrastruktur-card">

          <div className="tambah-card-title">
            <h2>
              Edit Infrastruktur
            </h2>
          </div>

          {/* ERROR */}

          {errorMessage && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px",
                color: "#b91c1c",
                background:
                  "#fee2e2",
                borderRadius: "8px",
              }}
            >
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >

            <div className="tambah-form-grid">

              {/* ================================================== */}
              {/* KOLOM KIRI */}
              {/* ================================================== */}

              <div className="tambah-form-column">

                {/* JENIS */}

                <div className="form-group">
                  <label htmlFor="jenis">
                    Jenis{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="jenis"
                    name="jenis"
                    value={
                      formData.jenis
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    <option value="">
                      Pilih jenis infrastruktur
                    </option>

                    <option value="Saluran">
                      Saluran
                    </option>

                    <option value="PJU">
                      PJU
                    </option>

                    <option value="CCTV">
                      CCTV
                    </option>
                  </select>
                </div>

                {/* KONDISI */}

                <div className="form-group">
                  <label htmlFor="kondisi">
                    Kondisi{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="kondisi"
                    name="kondisi"
                    value={
                      formData.kondisi
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    <option value="">
                      Pilih kondisi infrastruktur
                    </option>

                    <option value="Baik">
                      Baik
                    </option>

                    <option value="Rusak Ringan">
                      Rusak Ringan
                    </option>

                    <option value="Rusak Berat">
                      Rusak Berat
                    </option>
                  </select>
                </div>

                {/* PENANGGUNG JAWAB */}

                <div className="form-group">
                  <label htmlFor="pic">
                    Penanggung Jawab{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="pic"
                    name="pic"
                    type="text"
                    placeholder="Masukkan penanggung jawab"
                    value={
                      formData.pic
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* NOMOR TELEPON */}

                <div className="form-group">
                  <label htmlFor="telepon">
                    Nomor Telepon{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="telepon"
                    name="telepon"
                    type="tel"
                    placeholder="Masukkan nomor telepon"
                    value={
                      formData.telepon
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* TANGGAL */}

                <div className="form-group">
                  <label htmlFor="tanggalPengadaan">
                    Tanggal Pengadaan{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="tanggalPengadaan"
                    name="tanggalPengadaan"
                    type="date"
                    value={
                      formData.tanggalPengadaan
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* PANJANG */}

                <div className="form-group">
                  <label htmlFor="panjang">
                    Panjang
                  </label>

                  <input
                    id="panjang"
                    name="panjang"
                    type="number"
                    placeholder="Masukkan panjang saluran"
                    value={
                      formData.panjang
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                {/* LEBAR */}

                <div className="form-group">
                  <label htmlFor="lebar">
                    Lebar
                  </label>

                  <input
                    id="lebar"
                    name="lebar"
                    type="number"
                    placeholder="Masukkan lebar saluran"
                    value={
                      formData.lebar
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

              </div>

              {/* ================================================== */}
              {/* KOLOM KANAN */}
              {/* ================================================== */}

              <div className="tambah-form-column">

                {/* ALAMAT */}

                <div className="form-group">
                  <label htmlFor="alamat">
                    Alamat{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="alamat"
                    name="alamat"
                    type="text"
                    placeholder="Masukkan letak infrastruktur"
                    value={
                      formData.alamat
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* RT */}

                <div className="form-group">
                  <label htmlFor="rt">
                    RT{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="rt"
                    name="rt"
                    type="text"
                    placeholder="Masukkan RT infrastruktur"
                    value={
                      formData.rt
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* RW */}

                <div className="form-group">
                  <label htmlFor="rw">
                    RW{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="rw"
                    name="rw"
                    type="text"
                    placeholder="Masukkan RW infrastruktur"
                    value={
                      formData.rw
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* KOORDINAT */}

                <div className="form-group">
                  <label htmlFor="koordinat">
                    Koordinat Lokasi{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="koordinat"
                    name="koordinat"
                    type="text"
                    placeholder="Masukkan koordinat lokasi"
                    value={
                      formData.koordinat
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* FOTO */}

                <div className="form-group foto-group">

                  <label htmlFor="foto">
                    Foto
                  </label>

                  <label
                    className="upload-box"
                    htmlFor="foto"
                  >
                    <div className="upload-icon">
                      ☁
                    </div>

                    <p>
                      Upload foto baru di sini dengan format jpg
                      <br />
                      atau png
                    </p>

                    <input
                      id="foto"
                      name="foto"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={
                        handleChange
                      }
                    />
                  </label>

                  {formData.foto && (
                    <p className="selected-file">
                      {
                        formData.foto
                          .name
                      }
                    </p>
                  )}

                </div>

              </div>
            </div>

            {/* ================================================== */}
            {/* SIMPAN */}
            {/* ================================================== */}

            <div className="form-submit">
              <button
                type="submit"
                className="save-infrastruktur-button"
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

export default EditInfrastruktur;