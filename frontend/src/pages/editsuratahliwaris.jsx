import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import simpanDataIcon from "../assets/simpandata.png";
import { API_URL } from "../services/api";

function EditSuratAhliWaris() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    pewaris: "",
    ahliWaris: "",
    hubungan: "",
    nomorSurat: "",
    tanggalPengajuan: "",
    tanggalSelesai: "",
    tahap: "",
  });

  const [dataPenduduk, setDataPenduduk] = useState([]);
  const [loadingPenduduk, setLoadingPenduduk] =
    useState(true);

  const [loadingData, setLoadingData] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");




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
              "Gagal mengambil data penduduk."
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




  useEffect(() => {
    const loadDetailSurat = async () => {
      try {
        setLoadingData(true);
        setErrorMessage("");

        const response = await fetch(
          `${API_URL}/surat-ahli-waris/${id}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Gagal mengambil data surat ahli waris."
          );
        }

        const surat = result?.data || result;




        const namaPewaris =
          surat?.penduduk?.nama ||
          "";




        const namaAhliWaris =
          surat?.ahliWaris?.nama ||
          "";




        const tanggalPengajuan =
          surat?.tanggal_pengajuan ||
          surat?.tanggalPengajuan ||
          "";




        const tanggalSelesai =
          surat?.tanggal_selesai ||
          surat?.tanggalSelesai ||
          "";

        setFormData({
          pewaris: namaPewaris,
          ahliWaris: namaAhliWaris,
          hubungan:
            surat?.ahliWaris?.hubungan ||
            surat?.hubungan ||
            "",
          nomorSurat:
            surat?.nomor_surat ||
            surat?.nomorSurat ||
            "",
          tanggalPengajuan:
            String(tanggalPengajuan).slice(
              0,
              10
            ),
          tanggalSelesai:
            tanggalSelesai
              ? String(tanggalSelesai).slice(
                  0,
                  10
                )
              : "",
          tahap: surat?.tahap || "",
        });
      } catch (error) {
        console.error(
          "Gagal mengambil detail surat ahli waris:",
          error
        );

        setErrorMessage(
          error.message ||
            "Gagal mengambil data surat ahli waris."
        );
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      loadDetailSurat();
    }
  }, [id]);




  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };




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




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }




    if (loadingPenduduk) {
      alert(
        "Data penduduk masih dimuat. Silakan tunggu sebentar."
      );
      return;
    }




    if (loadingData) {
      alert(
        "Data surat masih dimuat. Silakan tunggu sebentar."
      );
      return;
    }




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




    if (!id) {
      alert(
        "ID surat ahli waris tidak ditemukan."
      );
      return;
    }

    try {
      setSaving(true);




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
        "Data Surat Ahli Waris yang diperbarui:",
        dataSurat
      );




      const response =
        await fetch(
          `${API_URL}/surat-ahli-waris/${id}`,
          {
            method: "PUT",

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
            "Gagal memperbarui surat ahli waris."
        );
      }

      console.log(
        "Surat ahli waris berhasil diperbarui:",
        result
      );




      alert(
        "Data surat ahli waris berhasil diperbarui!"
      );

      navigate(
        "/surat-ahli-waris"
      );
    } catch (error) {
      console.error(
        "Gagal memperbarui surat ahli waris:",
        error
      );

      alert(
        error.message ||
          "Gagal memperbarui surat ahli waris."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tambah-saw-page">



      <Header
        title="Surat Ahli Waris"
        showSearch={false}
      />



      <main className="tambah-saw-content">



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



        <section className="tambah-saw-card">

          <div className="tambah-saw-title">

            <h2>
              Edit Surat Ahli Waris
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

          {loadingData ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
            >
              Memuat data surat ahli waris...
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
            >

              <div className="tambah-saw-form-grid">



                <div className="tambah-saw-column">



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
                        list="daftar-pewaris-edit"
                        disabled={
                          loadingPenduduk ||
                          saving
                        }
                        required
                      />

                      <span>
                        ⌕
                      </span>

                      <datalist id="daftar-pewaris-edit">

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
                        list="daftar-ahli-waris-edit"
                        disabled={
                          loadingPenduduk ||
                          saving
                        }
                        required
                      />

                      <span>
                        ⌕
                      </span>

                      <datalist id="daftar-ahli-waris-edit">

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



                  <div className="saw-form-group saw-upload-group">

                    <label>
                      Dokumen
                    </label>

                    <div
                      className="saw-upload-box"
                      style={{
                        cursor: "default",
                      }}
                    >

                      <div className="upload-icon">
                        ☁
                      </div>

                      <p>
                        Dokumen yang sudah
                        tersimpan tetap
                        digunakan.
                        <br />
                        Upload dokumen baru
                        dilakukan melalui
                        detail surat.
                      </p>

                    </div>

                  </div>

                </div>



                <div className="tambah-saw-column">



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
                    : "Simpan Perubahan"}

                </button>

              </div>

            </form>
          )}

        </section>

      </main>

    </div>
  );
}

export default EditSuratAhliWaris;