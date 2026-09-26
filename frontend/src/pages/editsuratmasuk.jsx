import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import backIcon from "../assets/back.png";
import hapusIcon from "../assets/hapussampah.png";
import simpanDataIcon from "../assets/simpandata.png";
import { getSuratById, updateSurat, deleteSurat } from "../services/api";

const toDateInputValue = (value) => {
  if (!value) return "";

  // Jika sudah format YYYY-MM-DD
  if (value.includes("-")) {
    return value.slice(0, 10);
  }

  // Jika format DD/MM/YYYY
  if (value.includes("/")) {
    const [day, month, year] = value.split("/");

    if (day && month && year) {
      return `${year}-${month}-${day}`;
    }
  }

  return "";
};

function EditSuratMasuk() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const [formData, setFormData] = useState({
    nomorSurat: "",
    tanggal: "",
    asalSurat: "",
    tujuan: "",
    keterangan: "",
    jenis: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // =====================================================
  // MENGAMBIL DATA SURAT
  // =====================================================

  useEffect(() => {
    const loadSurat = async () => {
      try {
        setLoading(true);

        /*
          Jika data surat dikirim melalui navigate state,
          gunakan terlebih dahulu.
        */
        if (state?.surat) {
          const surat = state.surat;

          setFormData({
            nomorSurat: surat.nomorSurat || "",
            tanggal: toDateInputValue(surat.tanggal),
            asalSurat: surat.asalSurat || "",
            tujuan: surat.tujuan || "",
            keterangan: surat.keterangan || "",
            jenis: surat.jenis || "",
          });

          setLoading(false);
          return;
        }

        /*
          Jika halaman direfresh atau dibuka langsung melalui URL,
          ambil data berdasarkan ID dari backend.
        */
        const surat = await getSuratById(id);

        setFormData({
          nomorSurat: surat.nomor_surat || "",
          tanggal: toDateInputValue(surat.tanggal),
          asalSurat: surat.asal || "",
          tujuan: surat.tujuan || "",
          keterangan: surat.keterangan || "",
          jenis: surat.jenis || "",
        });
      } catch (error) {
        console.error("Error mengambil data surat:", error);

        alert("Gagal mengambil data surat.");

        navigate("/surat-masuk");
      } finally {
        setLoading(false);
      }
    };

    loadSurat();
  }, [id, state, navigate]);

  // =====================================================
  // HANDLE PERUBAHAN FORM
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE SURAT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await updateSurat(id, {
        nomor_surat: formData.nomorSurat,
        tanggal: formData.tanggal,
        jenis: formData.jenis,
        arah_surat: "Masuk",
        asal: formData.asalSurat,
        tujuan: formData.tujuan,
        keterangan: formData.keterangan,
      });

      alert("Surat masuk berhasil diperbarui!");

      navigate("/surat-masuk");
    } catch (error) {
      console.error("Error mengubah surat masuk:", error);

      alert("Gagal mengubah surat masuk.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE SURAT
  // =====================================================

  const handleDelete = async () => {
    const konfirmasi = window.confirm(
      `Apakah Anda yakin ingin menghapus surat ${formData.nomorSurat}?`
    );

    if (!konfirmasi) {
      return;
    }

    try {
      setDeleting(true);

      await deleteSurat(id);

      alert("Surat masuk berhasil dihapus!");

      navigate("/surat-masuk");
    } catch (error) {
      console.error("Error menghapus surat masuk:", error);

      alert("Gagal menghapus surat masuk.");
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="tambah-surat-masuk-page">
        <Header title="Edit Surat Masuk" showSearch={false} />

        <main className="tambah-surat-masuk-content">
          <p>Memuat data surat...</p>
        </main>
      </div>
    );
  }

  // =====================================================
  // TAMPILAN
  // =====================================================

  return (
    <div className="tambah-surat-masuk-page">
      <Header title="Edit Surat Masuk" showSearch={false} />

      <main className="tambah-surat-masuk-content">

        {/* ==============================
            TOMBOL KEMBALI
        ============================== */}

        <div className="tambah-surat-masuk-back-wrapper">
          <button
            type="button"
            className="tambah-surat-masuk-back-button"
            onClick={() => navigate("/surat-masuk")}
          >
            <img src={backIcon} alt="" />
            Kembali ke Surat Masuk
          </button>
        </div>

        {/* ==============================
            FORM EDIT
        ============================== */}

        <form
          className="tambah-surat-masuk-form"
          onSubmit={handleSubmit}
        >
          <section className="tambah-surat-masuk-card">

            <h2>Informasi Surat Masuk</h2>

            <div className="tambah-surat-masuk-grid">

              {/* NOMOR SURAT */}

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

              {/* TANGGAL */}

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

              {/* ASAL SURAT */}

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

              {/* TUJUAN */}

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

              {/* KETERANGAN */}

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

              {/* JENIS SURAT */}

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

          {/* ==============================
              STATUS BAR
          ============================== */}

          <section className="edit-surat-status-bar">

            <div>
              <strong>
                Status Pengisian : Form Siap Disimpan
              </strong>

              <small>
                Data tervalidasi oleh Sistem SADEKA
              </small>
            </div>

            <span>
              Terisi 100%
            </span>

            {/* HAPUS */}

            <button
              type="button"
              className="edit-surat-delete-button"
              onClick={handleDelete}
              disabled={deleting || saving}
            >
              <img src={hapusIcon} alt="" />

              {deleting
                ? "Menghapus..."
                : "Hapus Data"}
            </button>

            {/* SIMPAN */}

            <button
              type="submit"
              className="tambah-surat-masuk-save-button"
              disabled={saving || deleting}
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

export default EditSuratMasuk;
