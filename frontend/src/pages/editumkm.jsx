import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

const dataUMKM = [
  {
    no: "001",
    namaUsaha: "Bakso Berkah",
    pemilik: "Ahmad Fauzi",
    jenisUsaha: "Kuliner",
    nib: "9120003540844",
    rt: "02",
    rw: "01",
    alamat:
      "Jl. Manukan Asri No.I-A, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "002",
    namaUsaha: "Dapur Ibu",
    pemilik: "Siti Aminah",
    jenisUsaha: "Kuliner",
    nib: "9120003540943",
    rt: "16",
    rw: "03",
    alamat:
      "Jl. Manukan Asri No. 16, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "003",
    namaUsaha: "Pangkas Rambut Andi",
    pemilik: "Andi Hirawan",
    jenisUsaha: "Jasa",
    nib: "9120003520123",
    rt: "19",
    rw: "04",
    alamat:
      "Jl. Manukan Asri No. 19, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "004",
    namaUsaha: "Toko Sembako Lina",
    pemilik: "Linawati",
    jenisUsaha: "Retail",
    nib: "9120009910125",
    rt: "23",
    rw: "05",
    alamat:
      "Jl. Manukan Subur No. 08, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "005",
    namaUsaha: "Laundry Murah",
    pemilik: "Setyo",
    jenisUsaha: "Jasa",
    nib: "9120009913007",
    rt: "06",
    rw: "02",
    alamat:
      "Jl. Manukan Krajan No. 02, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
];

function EditUmkm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const data = dataUMKM.find((item) => item.no === id);

  const [formData, setFormData] = useState(
    data || {
      namaUsaha: "",
      pemilik: "",
      jenisUsaha: "",
      nib: "",
      rt: "",
      rw: "",
      alamat: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Data UMKM diperbarui:", formData);

    navigate("/umkm");
  };

  return (
    <div className="tambah-umkm-page">
      {/* HEADER */}
      <Header
        title="UMKM"
        showSearch={false}
        onMenuClick={() => navigate("/umkm")}
      />

      {/* CONTENT */}
      <main className="tambah-umkm-content">
        {/* KEMBALI */}
        <div className="tambah-umkm-top-action">
          <button
            type="button"
            className="back-umkm-button"
            onClick={() => navigate("/umkm")}
          >
            ← Kembali ke UMKM
          </button>
        </div>

        {/* FORM */}
        <section className="tambah-umkm-card">
          <div className="tambah-umkm-card-title">
            <h2>Edit UMKM</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="tambah-umkm-form-grid">
              {/* KOLOM KIRI */}
              <div className="tambah-umkm-form-column">

                <div className="umkm-form-group">
                  <label>
                    Nama Usaha <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="namaUsaha"
                    value={formData.namaUsaha}
                    onChange={handleChange}
                    placeholder="Masukkan nama usaha"
                  />
                </div>

                <div className="umkm-form-group">
                  <label>
                    Pemilik <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="pemilik"
                    value={formData.pemilik}
                    onChange={handleChange}
                    placeholder="Masukkan nama pemilik"
                  />
                </div>

                <div className="umkm-form-group">
                  <label>
                    Jenis Usaha <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="jenisUsaha"
                    value={formData.jenisUsaha}
                    onChange={handleChange}
                    placeholder="Masukkan jenis usaha"
                  />
                </div>

                <div className="umkm-form-group">
                  <label>
                    Nomor Induk Berusaha (NIB) <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="nib"
                    value={formData.nib}
                    onChange={handleChange}
                    placeholder="Masukkan NIB"
                  />
                </div>

              </div>

              {/* KOLOM KANAN */}
              <div className="tambah-umkm-form-column">

                <div className="umkm-form-group">
                  <label>
                    RT <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="rt"
                    value={formData.rt}
                    onChange={handleChange}
                    placeholder="Masukkan RT usaha"
                  />
                </div>

                <div className="umkm-form-group">
                  <label>
                    RW <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="rw"
                    value={formData.rw}
                    onChange={handleChange}
                    placeholder="Masukkan RW usaha"
                  />
                </div>

                <div className="umkm-form-group">
                  <label>
                    Alamat <span>*</span>
                  </label>

                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Masukkan alamat usaha"
                  />
                </div>

              </div>
            </div>

            {/* SIMPAN */}
            <div className="umkm-form-submit">
              <button
                type="submit"
                className="save-umkm-button"
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

export default EditUmkm;