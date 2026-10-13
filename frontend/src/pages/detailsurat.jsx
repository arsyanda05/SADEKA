import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import backIcon from "../assets/back.png";
import pdfIcon from "../assets/pdf.png";
import { getBackendFileUrl, getSuratById } from "../services/api";

const formatTanggal = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function DetailSurat() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadSurat = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await getSuratById(id);
        if (active) {
          setSurat(result);
        }
      } catch (error) {
        console.error("Gagal mengambil detail surat:", error);
        if (active) {
          setErrorMessage(
            error.message || "Gagal mengambil detail surat."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSurat();
    return () => {
      active = false;
    };
  }, [id, location.pathname]);

  const arahSurat = surat?.arah_surat;
  const isSuratMasuk =
    arahSurat ? arahSurat === "Masuk" : location.pathname.startsWith("/surat-masuk/");
  const listRoute = isSuratMasuk ? "/surat-masuk" : "/surat-keluar";
  const title = isSuratMasuk ? "Detail Surat Masuk" : "Detail Surat Keluar";
  const dokumen = surat?.dokumen?.[0];

  const handleOpenFile = () => {
    if (!dokumen?.path_file) {
      return;
    }

    window.open(
      getBackendFileUrl(dokumen.path_file),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="detail-saw-page">
      <Header title={title} showSearch={false} />

      <main className="detail-saw-content">
        <div className="detail-saw-back-wrapper">
          <button
            type="button"
            className="tambah-surat-masuk-back-button"
            onClick={() => navigate(listRoute)}
          >
            <img src={backIcon} alt="" />
            Kembali ke {isSuratMasuk ? "Surat Masuk" : "Surat Keluar"}
          </button>
        </div>

        {loading ? (
          <div className="detail-surat-message">Memuat detail surat...</div>
        ) : errorMessage || !surat ? (
          <div className="detail-surat-message">
            <p>{errorMessage || "Data surat tidak ditemukan."}</p>
            <button
              type="button"
              className="tambah-surat-masuk-back-button"
              onClick={() => navigate(listRoute)}
            >
              <img src={backIcon} alt="" />
              Kembali ke {isSuratMasuk ? "Surat Masuk" : "Surat Keluar"}
            </button>
          </div>
        ) : (
          <div className="detail-saw-layout detail-surat-layout">
            <section className="detail-saw-card">
              <h2>Informasi Surat</h2>

              <div className="detail-saw-data">
                <div className="detail-saw-row">
                  <span>Nomor Surat</span>
                  <strong>{surat.nomor_surat || "-"}</strong>
                </div>
                <div className="detail-saw-row">
                  <span>Tanggal</span>
                  <strong>{formatTanggal(surat.tanggal)}</strong>
                </div>
                <div className="detail-saw-row">
                  <span>Jenis Surat</span>
                  <strong>{surat.jenis || "-"}</strong>
                </div>
                <div className="detail-saw-row">
                  <span>Arah Surat</span>
                  <strong>{surat.arah_surat || "-"}</strong>
                </div>
                <div className="detail-saw-row">
                  <span>Asal Surat</span>
                  <strong>{surat.asal || "-"}</strong>
                </div>
                <div className="detail-saw-row">
                  <span>Tujuan</span>
                  <strong>{surat.tujuan || "-"}</strong>
                </div>
                <div className="detail-saw-row detail-saw-address">
                  <span>Keterangan</span>
                  <strong>{surat.keterangan || "-"}</strong>
                </div>
                <div className="detail-saw-row">
                  <span>Berkas Surat</span>
                  {dokumen?.path_file ? (
                    <button
                      type="button"
                      className="detail-saw-file"
                      onClick={handleOpenFile}
                    >
                      <img className="pdf-icon-img" src={pdfIcon} alt="" />
                      {dokumen.nama_dokumen_file || "Lihat berkas surat"}
                    </button>
                  ) : (
                    <strong>Berkas surat belum tersedia.</strong>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default DetailSurat;
