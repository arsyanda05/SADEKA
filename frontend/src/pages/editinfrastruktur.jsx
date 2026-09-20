import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

function EditInfrastruktur() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Data sementara
  const dataInfrastruktur = {
    "001": {
      jenis: "CCTV",
      kondisi: "Baik",
      pic: "Setyo",
      telepon: "081963542083",
      tanggalPengadaan: "2025-01-15",
      panjang: "",
      lebar: "",
      alamat:
        "Jl. Manukan Asri No.I-A, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
      rt: "02",
      rw: "01",
      koordinat: "-7.258100, 112.653900",
      foto: null,
    },

    "002": {
      jenis: "PJU",
      kondisi: "Baik",
      pic: "Bambang",
      telepon: "088863542099",
      tanggalPengadaan: "2024-08-20",
      panjang: "",
      lebar: "",
      alamat:
        "Jl. Manukan Asri No. 16, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
      rt: "16",
      rw: "03",
      koordinat: "-7.259200, 112.654500",
      foto: null,
    },

    "003": {
      jenis: "CCTV",
      kondisi: "Rusak Ringan",
      pic: "Rini",
      telepon: "085263542081",
      tanggalPengadaan: "2023-06-10",
      panjang: "",
      lebar: "",
      alamat:
        "Jl. Manukan Asri No. 19, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
      rt: "19",
      rw: "04",
      koordinat: "-7.260100, 112.655200",
      foto: null,
    },

    "004": {
      jenis: "Saluran",
      kondisi: "Rusak Ringan",
      pic: "Hadi",
      telepon: "081977512083",
      tanggalPengadaan: "2022-03-12",
      panjang: "20",
      lebar: "2",
      alamat:
        "Jl. Manukan Subur No. 08, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
      rt: "23",
      rw: "05",
      koordinat: "-7.261000, 112.656000",
      foto: null,
    },

    "005": {
      jenis: "CCTV",
      kondisi: "Rusak Berat",
      pic: "Julia",
      telepon: "081263549001",
      tanggalPengadaan: "2021-11-05",
      panjang: "",
      lebar: "",
      alamat:
        "Jl. Manukan Krajan No. 02, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
      rt: "06",
      rw: "02",
      koordinat: "-7.257800, 112.654200",
      foto: null,
    },
  };

  const dataLama = dataInfrastruktur[id] || {
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
  };

  const [formData, setFormData] = useState(dataLama);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Data Infrastruktur yang diubah:", {
      id,
      ...formData,
    });

    alert("Data infrastruktur berhasil diperbarui!");
    navigate(`/infrastruktur/${id}`);
  };

  return (
    <div className="tambah-infrastruktur-page">
      {/* HEADER */}
      <Header title="Infrastruktur" showSearch={false} />

      {/* CONTENT */}
      <main className="tambah-infrastruktur-content">

        {/* KEMBALI */}
        <div className="tambah-top-action">
          <button
            type="button"
            className="back-infrastruktur-button"
            onClick={() => navigate(`/infrastruktur/${id}`)}
          >
            ← Kembali ke Detail Infrastruktur
          </button>
        </div>

        {/* FORM CARD */}
        <section className="tambah-infrastruktur-card">

          <div className="tambah-card-title">
            <h2>Edit Infrastruktur</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="tambah-form-grid">

              {/* KOLOM KIRI */}
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
                    <option value="">
                      Pilih jenis infrastruktur
                    </option>
                    <option value="Saluran">Saluran</option>
                    <option value="PJU">PJU</option>
                    <option value="CCTV">CCTV</option>
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
                    <option value="">
                      Pilih kondisi infrastruktur
                    </option>
                    <option value="Baik">Baik</option>
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
                    Penanggung Jawab <span>*</span>
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
                    Nomor Telepon <span>*</span>
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

                {/* TANGGAL */}
                <div className="form-group">
                  <label htmlFor="tanggalPengadaan">
                    Tanggal Pengadaan <span>*</span>
                  </label>

                  <input
                    id="tanggalPengadaan"
                    name="tanggalPengadaan"
                    type="date"
                    value={formData.tanggalPengadaan}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PANJANG */}
                <div className="form-group">
                  <label htmlFor="panjang">Panjang</label>

                  <input
                    id="panjang"
                    name="panjang"
                    type="number"
                    placeholder="Masukkan panjang saluran"
                    value={formData.panjang}
                    onChange={handleChange}
                  />
                </div>

                {/* LEBAR */}
                <div className="form-group">
                  <label htmlFor="lebar">Lebar</label>

                  <input
                    id="lebar"
                    name="lebar"
                    type="number"
                    placeholder="Masukkan lebar saluran"
                    value={formData.lebar}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* KOLOM KANAN */}
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
                    Koordinat Lokasi <span>*</span>
                  </label>

                  <input
                    id="koordinat"
                    name="koordinat"
                    type="text"
                    placeholder="Masukkan koordinat lokasi"
                    value={formData.koordinat}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* FOTO */}
                <div className="form-group foto-group">
                  <label htmlFor="foto">
                    Foto
                  </label>

                  <label className="upload-box" htmlFor="foto">
                    <div className="upload-icon">☁</div>

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
                      onChange={handleChange}
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

            {/* SIMPAN */}
            <div className="form-submit">
              <button
                type="submit"
                className="save-infrastruktur-button"
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

export default EditInfrastruktur;