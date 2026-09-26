import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";

const API_URL = "http://localhost:5000/api";

function TambahSuratAhliWaris() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pewaris: "",
    ahliWaris: "",
    hubungan: "",
    nomorSurat: "",
    tanggalPengajuan: "",
    tanggalSelesai: "",
    tahap: "",
    dokumen: null,
  });

  const [dataPenduduk, setDataPenduduk] = useState([]);
  const [loadingPenduduk, setLoadingPenduduk] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // ==========================================
  // LOAD DATA PENDUDUK
  // ==========================================
  useEffect(() => {
    const loadPenduduk = async () => {
      try {
        setLoadingPenduduk(true);
        setErrorMessage("");

        const response = await fetch(
          `${API_URL}/penduduk`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Gagal mengambil data penduduk"
          );
        }

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
          ? result.data
          : [];

        setDataPenduduk(data);
      } catch (error) {
        console.error(
          "Gagal mengambil data penduduk:",
          error
        );

        setErrorMessage(
          error.message ||
            "Gagal mengambil data penduduk."
        );

        setDataPenduduk([]);
      } finally {
        setLoadingPenduduk(false);
      }
    };

    loadPenduduk();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================
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

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // ==========================================
  // CARI DATA PENDUDUK BERDASARKAN NAMA
  // ==========================================
  const cariPenduduk = (nama) => {
    const namaDicari =
      nama.trim().toLowerCase();

    return dataPenduduk.find(
      (penduduk) =>
        String(
          penduduk.nama || ""
        )
          .trim()
          .toLowerCase() === namaDicari
    );
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    // ========================================
    // PASTIKAN DATA PENDUDUK SUDAH TERSEDIA
    // ========================================
    if (loadingPenduduk) {
      alert(
        "Data penduduk masih dimuat. Silakan tunggu sebentar."
      );
      return;
    }

    // ========================================
    // VALIDASI PEWARIS
    // ========================================
    const pendudukPewaris =
      cariPenduduk(
        formData.pewaris
      );

    if (!pendudukPewaris) {
      alert(
        "Data pewaris tidak ditemukan. Pastikan nama pewaris sesuai dengan data penduduk."
      );
      return;
    }

    // ========================================
    // VALIDASI AHLI WARIS
    // ========================================
    const pendudukAhliWaris =
      cariPenduduk(
        formData.ahliWaris
      );

    if (!pendudukAhliWaris) {
      alert(
        "Data ahli waris tidak ditemukan. Pastikan nama ahli waris sesuai dengan data penduduk."
      );
      return;
    }

    // ========================================
    // VALIDASI PEWARIS DAN AHLI WARIS
    // ========================================
    if (
      Number(
        pendudukPewaris.id_penduduk
      ) ===
      Number(
        pendudukAhliWaris.id_penduduk
      )
    ) {
      alert(
        "Pewaris dan ahli waris tidak boleh merupakan orang yang sama."
      );
      return;
    }

    // ========================================
    // VALIDASI TANGGAL
    // ========================================
    if (
      formData.tanggalPengajuan &&
      formData.tanggalSelesai &&
      formData.tanggalSelesai <
        formData.tanggalPengajuan
    ) {
      alert(
        "Tanggal selesai tidak boleh lebih awal dari tanggal pengajuan."
      );
      return;
    }

    // ========================================
    // VALIDASI DOKUMEN
    // ========================================
    if (!formData.dokumen) {
      alert(
        "Dokumen surat ahli waris wajib diunggah."
      );
      return;
    }

    // Pastikan file PDF
    if (
      formData.dokumen.type !==
        "application/pdf" &&
      !formData.dokumen.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      alert(
        "Dokumen harus berformat PDF."
      );
      return;
    }

    try {
      setSaving(true);

      // ======================================
      // DATA SURAT AHLI WARIS
      // ======================================
      const dataSurat = {
        id_penduduk:
          Number(
            pendudukPewaris.id_penduduk
          ),

        id_penduduk_ahli_waris:
          Number(
            pendudukAhliWaris.id_penduduk
          ),

        hubungan:
          formData.hubungan.trim(),

        nomor_surat:
          formData.nomorSurat.trim(),

        tanggal_pengajuan:
          formData.tanggalPengajuan,

        tahap:
          formData.tahap,

        tanggal_selesai:
          formData.tanggalSelesai
            ? formData.tanggalSelesai
            : null,
      };

      console.log(
        "Data Surat Ahli Waris yang dikirim:",
        dataSurat
      );

      // ======================================
      // 1. SIMPAN SURAT AHLI WARIS
      // ======================================
      const response =
        await fetch(
          `${API_URL}/surat-ahli-waris`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              dataSurat
            ),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal menambahkan surat ahli waris."
        );
      }

      console.log(
        "Surat ahli waris berhasil disimpan:",
        result
      );

      // ======================================
      // AMBIL ID SURAT YANG BARU DIBUAT
      // ======================================
      const suratData =
        result?.data || result;

      const idSuratAhliWaris =
        suratData?.id_surat_ahli_waris;

      if (!idSuratAhliWaris) {
        console.error(
          "Response backend:",
          result
        );

        throw new Error(
          "Surat berhasil disimpan, tetapi ID surat tidak ditemukan."
        );
      }

      console.log(
        "ID Surat Ahli Waris:",
        idSuratAhliWaris
      );

      // ======================================
      // 2. UPLOAD DOKUMEN
      // ======================================
      const dokumenFormData =
        new FormData();

      dokumenFormData.append(
        "id_surat_ahli_waris",
        String(
          idSuratAhliWaris
        )
      );

      dokumenFormData.append(
        "jenis_dokumen",
        "Dokumen Surat Ahli Waris"
      );

      dokumenFormData.append(
        "dokumen",
        formData.dokumen
      );

      console.log(
        "Mengupload dokumen surat ahli waris..."
      );

      const dokumenResponse =
        await fetch(
          `${API_URL}/dokumen`,
          {
            method: "POST",
            body: dokumenFormData,
          }
        );

      const dokumenResult =
        await dokumenResponse.json();

      if (!dokumenResponse.ok) {
        console.error(
          "Response upload dokumen:",
          dokumenResult
        );

        throw new Error(
          dokumenResult.message ||
            "Surat berhasil disimpan, tetapi dokumen gagal diupload."
        );
      }

      console.log(
        "Dokumen berhasil diupload:",
        dokumenResult
      );

      // ======================================
      // BERHASIL
      // ======================================
      alert(
        "Data surat ahli waris dan dokumen berhasil ditambahkan!"
      );

      navigate(
        "/surat-ahli-waris"
      );
    } catch (error) {
      console.error(
        "Gagal menambahkan surat ahli waris:",
        error
      );

      alert(
        error.message ||
          "Gagal menambahkan surat ahli waris."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tambah-saw-page">

      {/* ================= HEADER ================= */}

      <Header
        title="Surat Ahli Waris"
        showSearch={false}
      />

      {/* ================= CONTENT ================= */}

      <main className="tambah-saw-content">

        {/* ================= KEMBALI ================= */}

        <div className="tambah-saw-top-action">

          <button
            type="button"
            className="kembali-saw-button"
            onClick={() =>
              navigate(
                "/surat-ahli-waris"
              )
            }
          >
            ← Kembali ke Surat Ahli Waris
          </button>

        </div>

        {/* ================= FORM ================= */}

        <section className="tambah-saw-card">

          <div className="tambah-saw-title">

            <h2>
              Tambah Surat Ahli Waris
            </h2>

          </div>

          {errorMessage && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor:
                  "#ffecec",
                color: "#c62828",
              }}
            >
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >

            <div className="tambah-saw-form-grid">

              {/* ================= KOLOM KIRI ================= */}

              <div className="tambah-saw-column">

                {/* PEWARIS */}

                <div className="saw-form-group">

                  <label htmlFor="pewaris">
                    Pewaris{" "}
                    <span>*</span>
                  </label>

                  <div className="saw-search-input">

                    <input
                      id="pewaris"
                      name="pewaris"
                      type="text"
                      placeholder={
                        loadingPenduduk
                          ? "Memuat data penduduk..."
                          : "Cari data pewaris"
                      }
                      value={
                        formData.pewaris
                      }
                      onChange={
                        handleChange
                      }
                      list="daftar-pewaris"
                      disabled={
                        loadingPenduduk ||
                        saving
                      }
                      required
                    />

                    <span>
                      ⌕
                    </span>

                    <datalist id="daftar-pewaris">

                      {dataPenduduk.map(
                        (penduduk) => (
                          <option
                            key={
                              penduduk.id_penduduk
                            }
                            value={
                              penduduk.nama
                            }
                          />
                        )
                      )}

                    </datalist>

                  </div>

                </div>

                {/* AHLI WARIS */}

                <div className="saw-form-group">

                  <label htmlFor="ahliWaris">
                    Ahli Waris{" "}
                    <span>*</span>
                  </label>

                  <div className="saw-search-input">

                    <input
                      id="ahliWaris"
                      name="ahliWaris"
                      type="text"
                      placeholder={
                        loadingPenduduk
                          ? "Memuat data penduduk..."
                          : "Cari data ahli waris"
                      }
                      value={
                        formData.ahliWaris
                      }
                      onChange={
                        handleChange
                      }
                      list="daftar-ahli-waris"
                      disabled={
                        loadingPenduduk ||
                        saving
                      }
                      required
                    />

                    <span>
                      ⌕
                    </span>

                    <datalist id="daftar-ahli-waris">

                      {dataPenduduk.map(
                        (penduduk) => (
                          <option
                            key={
                              penduduk.id_penduduk
                            }
                            value={
                              penduduk.nama
                            }
                          />
                        )
                      )}

                    </datalist>

                  </div>

                </div>

                {/* HUBUNGAN */}

                <div className="saw-form-group">

                  <label htmlFor="hubungan">
                    Hubungan{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="hubungan"
                    name="hubungan"
                    type="text"
                    placeholder="Masukkan hubungan"
                    value={
                      formData.hubungan
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                    required
                  />

                </div>

                {/* UPLOAD */}

                <div className="saw-form-group saw-upload-group">

                  <label htmlFor="dokumen">
                    Upload Dokumen{" "}
                    <span>*</span>
                  </label>

                  <label
                    htmlFor="dokumen"
                    className="saw-upload-box"
                  >

                    <div className="upload-icon">
                      ☁
                    </div>

                    <p>
                      Upload dokumen di sini
                      dengan format
                      <br />
                      PDF
                    </p>

                    <input
                      id="dokumen"
                      name="dokumen"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={
                        handleChange
                      }
                      disabled={saving}
                      required
                    />

                  </label>

                  {formData.dokumen && (
                    <p className="saw-selected-file">
                      {
                        formData
                          .dokumen
                          .name
                      }
                    </p>
                  )}

                </div>

              </div>

              {/* ================= KOLOM KANAN ================= */}

              <div className="tambah-saw-column">

                {/* NOMOR SURAT */}

                <div className="saw-form-group">

                  <label htmlFor="nomorSurat">
                    Nomor Surat{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="nomorSurat"
                    name="nomorSurat"
                    type="text"
                    placeholder="Masukkan nomor surat"
                    value={
                      formData.nomorSurat
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                    required
                  />

                </div>

                {/* TANGGAL PENGAJUAN */}

                <div className="saw-form-group">

                  <label htmlFor="tanggalPengajuan">
                    Tanggal Pengajuan{" "}
                    <span>*</span>
                  </label>

                  <div className="saw-date-input">

                    <input
                      id="tanggalPengajuan"
                      name="tanggalPengajuan"
                      type="date"
                      value={
                        formData.tanggalPengajuan
                      }
                      onChange={
                        handleChange
                      }
                      disabled={saving}
                      required
                    />

                  </div>

                </div>

                {/* TANGGAL SELESAI */}

                <div className="saw-form-group">

                  <label htmlFor="tanggalSelesai">
                    Tanggal Selesai
                  </label>

                  <div className="saw-date-input">

                    <input
                      id="tanggalSelesai"
                      name="tanggalSelesai"
                      type="date"
                      value={
                        formData.tanggalSelesai
                      }
                      onChange={
                        handleChange
                      }
                      disabled={saving}
                    />

                  </div>

                </div>

                {/* TAHAP */}

                <div className="saw-form-group">

                  <label htmlFor="tahap">
                    Tahap{" "}
                    <span>*</span>
                  </label>

                  <div className="saw-select-wrapper">

                    <select
                      id="tahap"
                      name="tahap"
                      value={
                        formData.tahap
                      }
                      onChange={
                        handleChange
                      }
                      disabled={saving}
                      required
                    >

                      <option value="">
                        Pilih tahap
                      </option>

                      <option value="Diterima oleh kelurahan">
                        Diterima oleh kelurahan
                      </option>

                      <option value="Tanda Tangan Sekretaris">
                        Tanda Tangan Sekretaris
                      </option>

                      <option value="Diproses Kecamatan">
                        Diproses Kecamatan
                      </option>

                      <option value="Selesai">
                        Selesai
                      </option>

                    </select>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= SIMPAN ================= */}

            <div className="tambah-saw-submit">

              <button
                type="submit"
                className="simpan-saw-button"
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

export default TambahSuratAhliWaris;