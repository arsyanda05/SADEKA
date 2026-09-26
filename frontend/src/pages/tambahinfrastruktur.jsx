import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

import { createInfrastruktur } from "../services/api";

function TambahInfrastruktur() {
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ============================================================
  // HANDLE PERUBAHAN INPUT
  // ============================================================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    // Hilangkan pesan error ketika user mulai memperbaiki form
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // ============================================================
  // HANDLE SUBMIT
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    // ----------------------------------------------------------
    // VALIDASI KOORDINAT
    // Format:
    // latitude, longitude
    // Contoh:
    // -7.265757, 112.642563
    // ----------------------------------------------------------
    const koordinatParts = formData.koordinat
      .split(",")
      .map((item) => item.trim());

    if (koordinatParts.length !== 2) {
      setErrorMessage(
        "Format koordinat tidak valid. Gunakan format: latitude, longitude"
      );
      return;
    }

    const latitude = Number(koordinatParts[0]);
    const longitude = Number(koordinatParts[1]);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      setErrorMessage(
        "Latitude dan longitude harus berupa angka."
      );
      return;
    }

    // ----------------------------------------------------------
    // VALIDASI RANGE KOORDINAT
    // ----------------------------------------------------------
    if (latitude < -90 || latitude > 90) {
      setErrorMessage(
        "Latitude harus berada di antara -90 sampai 90."
      );
      return;
    }

    if (longitude < -180 || longitude > 180) {
      setErrorMessage(
        "Longitude harus berada di antara -180 sampai 180."
      );
      return;
    }

    // ----------------------------------------------------------
    // VALIDASI FOTO
    // ----------------------------------------------------------
    if (!formData.foto) {
      setErrorMessage("Foto infrastruktur wajib diupload.");
      return;
    }

    // ----------------------------------------------------------
    // VALIDASI FORMAT FOTO
    // ----------------------------------------------------------
    const allowedTypes = [
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(formData.foto.type)) {
      setErrorMessage(
        "Foto harus berformat JPG, JPEG, atau PNG."
      );
      return;
    }

    // ----------------------------------------------------------
    // VALIDASI UKURAN FOTO
    // Maksimal 2 MB
    // ----------------------------------------------------------
    const maxSize = 2 * 1024 * 1024;

    if (formData.foto.size > maxSize) {
      setErrorMessage(
        "Ukuran foto maksimal 2 MB."
      );
      return;
    }

    try {
      setLoading(true);

      // ========================================================
      // DATA YANG DIKIRIM KE BACKEND
      // ========================================================
      const data = {
        jenis: formData.jenis,

        // kondisi -> kondisi_status
        kondisi_status: formData.kondisi,

        // pic -> penanggung_jawab
        penanggung_jawab: formData.pic,

        // telepon -> no_telp
        no_telp: formData.telepon,

        tanggal_pengadaan:
          formData.tanggalPengadaan,

        panjang:
          formData.panjang === ""
            ? 0
            : Number(formData.panjang),

        lebar:
          formData.lebar === ""
            ? 0
            : Number(formData.lebar),

        alamat: formData.alamat,

        rt: formData.rt,

        rw: formData.rw,

        latitude,

        longitude,

        // Untuk sementara kita simpan nama file.
        // Upload file fisik ke server kita kerjakan
        // setelah CRUD dasar berhasil.
        foto: formData.foto.name,
      };

      console.log(
        "Data yang dikirim ke backend:",
        data
      );

      // ========================================================
      // KIRIM KE BACKEND
      // ========================================================
      await createInfrastruktur(data);

      alert(
        "Data infrastruktur berhasil disimpan!"
      );

      // Kembali ke halaman Infrastruktur
      navigate("/infrastruktur");
    } catch (error) {
      console.error(
        "Error menyimpan infrastruktur:",
        error
      );

      setErrorMessage(
        error.message ||
          "Gagal menyimpan data infrastruktur."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tambah-infrastruktur-page">
      {/* ======================================================
          HEADER
      ====================================================== */}
      <Header
        title="Infrastruktur"
        showSearch={false}
      />

      {/* ======================================================
          CONTENT
      ====================================================== */}
      <main className="tambah-infrastruktur-content">

        {/* ====================================================
            KEMBALI
        ==================================================== */}
        <div className="tambah-top-action">
          <button
            type="button"
            className="back-infrastruktur-button"
            onClick={() =>
              navigate("/infrastruktur")
            }
          >
            ← Kembali ke Infrastruktur
          </button>
        </div>

        {/* ====================================================
            FORM CARD
        ==================================================== */}
        <section className="tambah-infrastruktur-card">

          <div className="tambah-card-title">
            <h2>Tambah Infrastruktur</h2>
          </div>

          {/* ==================================================
              PESAN ERROR
          ================================================== */}
          {errorMessage && (
            <div
              className="form-error-message"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="tambah-form-grid">

              {/* =================================================
                  KOLOM KIRI
              ================================================= */}
              <div className="tambah-form-column">

                {/* JENIS */}
                <div className="form-group">
                  <label htmlFor="jenis">
                    Jenis <span>*</span>
                  </label>

                  <select
                    id="jenis"
                    name="jenis"
                    value={formData.jenis}
                    onChange={handleChange}
                    required
                  >
                    <option
                      value=""
                      disabled
                      hidden
                    >
                      Pilih jenis infrastruktur
                    </option>

                    <option value="PJU">
                      PJU
                    </option>

                    <option value="CCTV">
                      CCTV
                    </option>

                    <option value="Saluran">
                      Saluran
                    </option>
                  </select>
                </div>

                {/* KONDISI */}
                <div className="form-group">
                  <label htmlFor="kondisi">
                    Kondisi <span>*</span>
                  </label>

                  <select
                    id="kondisi"
                    name="kondisi"
                    value={formData.kondisi}
                    onChange={handleChange}
                    required
                  >
                    <option
                      value=""
                      disabled
                      hidden
                    >
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
                    value={formData.pic}
                    onChange={handleChange}
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
                    value={formData.telepon}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* TANGGAL PENGADAAN */}
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
                    onChange={handleChange}
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
                    step="0.01"
                    min="0"
                    placeholder="Masukkan panjang saluran"
                    value={formData.panjang}
                    onChange={handleChange}
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
                    step="0.01"
                    min="0"
                    placeholder="Masukkan lebar saluran"
                    value={formData.lebar}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* =================================================
                  KOLOM KANAN
              ================================================= */}
              <div className="tambah-form-column">

                {/* ALAMAT */}
                <div className="form-group">
                  <label htmlFor="alamat">
                    Alamat <span>*</span>
                  </label>

                  <input
                    id="alamat"
                    name="alamat"
                    type="text"
                    placeholder="Masukkan letak infrastruktur"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* RT */}
                <div className="form-group">
                  <label htmlFor="rt">
                    RT <span>*</span>
                  </label>

                  <input
                    id="rt"
                    name="rt"
                    type="text"
                    placeholder="Masukkan RT infrastruktur"
                    value={formData.rt}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* RW */}
                <div className="form-group">
                  <label htmlFor="rw">
                    RW <span>*</span>
                  </label>

                  <input
                    id="rw"
                    name="rw"
                    type="text"
                    placeholder="Masukkan RW infrastruktur"
                    value={formData.rw}
                    onChange={handleChange}
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
                    placeholder="-7.265757, 112.642563"
                    value={formData.koordinat}
                    onChange={handleChange}
                    required
                  />

                  <small>
                    Masukkan latitude dan longitude,
                    dipisahkan dengan koma.
                  </small>
                </div>

                {/* FOTO */}
                <div className="form-group foto-group">
                  <label htmlFor="foto">
                    Foto <span>*</span>
                  </label>

                  <label
                    className="upload-box"
                    htmlFor="foto"
                  >
                    <div className="upload-icon">
                      ☁
                    </div>

                    <p>
                      Upload foto di sini dengan
                      format jpg
                      <br />
                      atau png
                    </p>

                    <input
                      id="foto"
                      name="foto"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleChange}
                      required
                    />
                  </label>

                  {formData.foto && (
                    <p className="selected-file">
                      {formData.foto.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ==================================================
                SIMPAN
            ================================================== */}
            <div className="form-submit">
              <button
                type="submit"
                className="save-infrastruktur-button"
                disabled={loading}
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

export default TambahInfrastruktur;