import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import backIcon from "../assets/back.png";
import hapusIcon from "../assets/hapussampah.png";
import simpanDataIcon from "../assets/simpandata.png";
import {
  getSuratById,
  updateSurat,
  deleteSurat,
} from "../services/api";

const toDateInputValue = (value) => {
  if (!value) return "";

  // Jika format dari tabel adalah DD/MM/YYYY
  if (value.includes("/")) {
    const [day, month, year] = value.split("/");

    if (day && month && year) {
      return `${year}-${month}-${day}`;
    }
  }

  // Jika format dari database berupa ISO Date
  if (value.includes("T")) {
    return value.split("T")[0];
  }

  return value;
};

function EditSuratKeluar() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nomorSurat: "",
    tanggal: "",
    asalSurat: "",
    tujuan: "",
    keterangan: "",
    jenis: "",
  });

  // Mengambil data surat
  useEffect(() => {
    const loadSurat = async () => {
      try {
        setLoading(true);

        // Jika data dikirim melalui navigate(), langsung gunakan data tersebut
        if (state?.surat) {
          const surat = state.surat;

          setFormData({
            nomorSurat: surat.nomorSurat || surat.nomor_surat || "",
            tanggal: toDateInputValue(
              surat.tanggal || surat.tanggal_surat
            ),
            asalSurat: surat.asalSurat || surat.asal || "",
            tujuan: surat.tujuan || "",
            keterangan: surat.keterangan || "",
            jenis: surat.jenis || "",
          });

          return;
        }

        // Jika halaman direfresh / dibuka langsung,
        // ambil data berdasarkan ID dari database
        const data = await getSuratById(id);

        setFormData({
          nomorSurat: data.nomor_surat || "",
          tanggal: toDateInputValue(data.tanggal),
          asalSurat: data.asal || "",
          tujuan: data.tujuan || "",
          keterangan: data.keterangan || "",
          jenis: data.jenis || "",
        });
      } catch (error) {
        console.error("Error mengambil data surat keluar:", error);
        alert("Gagal mengambil data surat keluar.");
        navigate("/surat-keluar");
      } finally {
        setLoading(false);
      }
    };

    loadSurat();
  }, [id, state, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Simpan perubahan
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await updateSurat(id, {
        nomor_surat: formData.nomorSurat,
        tanggal: formData.tanggal,
        jenis: formData.jenis,
        arah_surat: "Keluar",
        asal: formData.asalSurat,
        tujuan: formData.tujuan,
        keterangan: formData.keterangan,
      });

      alert("Surat keluar berhasil diperbarui!");

      navigate("/surat-keluar");
    } catch (error) {
      console.error("Error mengubah surat keluar:", error);
      alert("Gagal memperbarui surat keluar.");
    } finally {
      setSaving(false);
    }
  };

  // Hapus surat
  const handleDelete = async () => {
    if (
      window.confirm(
        `Hapus surat keluar ${formData.nomorSurat}?`
      )
    ) {
      try {
        await deleteSurat(id);

        alert("Surat keluar berhasil dihapus!");

        navigate("/surat-keluar");
      } catch (error) {
        console.error("Error menghapus surat keluar:", error);
        alert("Gagal menghapus surat keluar.");
      }
    }
  };

  if (loading) {
    return (
      <div className="tambah-surat-masuk-page">
        <Header title="Edit Surat Keluar" showSearch={false} />

        <main className="tambah-surat-masuk-content">
          <p>Memuat data surat keluar...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="tambah-surat-masuk-page">
      <Header title="Edit Surat Keluar" showSearch={false} />

      <main className="tambah-surat-masuk-content">
        <div className="tambah-surat-masuk-back-wrapper">
          <button
            type="button"
            className="tambah-surat-masuk-back-button"
            onClick={() => navigate("/surat-keluar")}
          >
            <img src={backIcon} alt="" />
            Kembali ke Surat Keluar
          </button>
        </div>

        <form
          className="tambah-surat-masuk-form"
          onSubmit={handleSubmit}
        >
          <section className="tambah-surat-masuk-card">
            <h2>Informasi Surat Keluar</h2>

            <div className="tambah-surat-masuk-grid">

              {/* Nomor Surat */}
              <div className="tambah-surat-masuk-field">
                <label htmlFor="nomorSurat">
                  Nomor Surat
                </label>

                <input
                  id="nomorSurat"
                  name="nomorSurat"
                  value={formData.nomorSurat}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Tanggal */}
              <div className="tambah-surat-masuk-field">
                <label htmlFor="tanggal">
                  Tanggal
                </label>

                <input
                  id="tanggal"
                  name="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Asal Surat */}
              <div className="tambah-surat-masuk-field">
                <label htmlFor="asalSurat">
                  Asal Surat
                </label>

                <input
                  id="asalSurat"
                  name="asalSurat"
                  value={formData.asalSurat}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Tujuan Surat */}
              <div className="tambah-surat-masuk-field">
                <label htmlFor="tujuan">
                  Tujuan Surat
                </label>

                <input
                  id="tujuan"
                  name="tujuan"
                  value={formData.tujuan}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Keterangan */}
              <div className="tambah-surat-masuk-field tambah-surat-masuk-keterangan">
                <label htmlFor="keterangan">
                  Keterangan
                </label>

                <textarea
                  id="keterangan"
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Jenis Surat */}
              <div className="tambah-surat-masuk-field">
                <label htmlFor="jenis">
                  Jenis Surat
                </label>

                <select
                  id="jenis"
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Pilih Jenis Surat
                  </option>

                  <option value="Surat Keterangan Usaha">
                    Surat Keterangan Usaha
                  </option>

                  <option value="Undangan Dinas">
                    Undangan Dinas
                  </option>

                  <option value="Permohonan">
                    Permohonan
                  </option>

                  <option value="Laporan">
                    Laporan
                  </option>

                  <option value="Undangan Rapat">
                    Undangan Rapat
                  </option>

                  <option value="Rekomendasi">
                    Rekomendasi
                  </option>

                  <option value="Pengantar">
                    Pengantar
                  </option>

                  <option value="Pemberitahuan">
                    Pemberitahuan
                  </option>
                </select>
              </div>

            </div>
          </section>

          {/* Status dan tombol */}
          <section className="edit-surat-status-bar">

            <div>
              <strong>
                Status Pengisian : Form Siap Disimpan
              </strong>

              <small>
                Data tervalidasi oleh Sistem SADEKA
              </small>
            </div>

            <span>Terisi 100%</span>

            <button
              type="button"
              className="edit-surat-delete-button"
              onClick={handleDelete}
            >
              <img src={hapusIcon} alt="" />
              Hapus Data
            </button>

            <button
              type="submit"
              className="tambah-surat-masuk-save-button"
              disabled={saving}
            >
              <img src={simpanDataIcon} alt="" />

              {saving
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>

          </section>
        </form>
      </main>
    </div>
  );
}

export default EditSuratKeluar;