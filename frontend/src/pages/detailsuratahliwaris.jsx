import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import pdfIcon from "../assets/pdf.png";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

/* =========================
   TAHAP TRACKING
========================= */
const tahapList = [
  {
    key: "Diterima oleh Kelurahan",
    title: "Diterima oleh Kelurahan",
    description:
      "Berkas diterima dan diverifikasi petugas pelayanan.",
  },
  {
    key: "Tanda Tangan Sekretaris",
    title: "Tanda Tangan Sekretaris",
    description:
      "Berkas diajukan kepada sekretaris untuk mendapatkan tanda tangan.",
  },
  {
    key: "Diproses Kecamatan",
    title: "Diproses Kecamatan",
    description:
      "Berkas dikirim ke kecamatan untuk diproses lebih lanjut.",
  },
  {
    key: "Selesai",
    title: "Selesai",
    description:
      "Berkas dikembalikan ke kelurahan setelah proses di kecamatan selesai.",
  },
];

/* =========================
   FORMAT TANGGAL
========================= */
const formatTanggal = (tanggal) => {
  if (!tanggal) {
    return "-";
  }

  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/* =========================
   FORMAT TANGGAL + JAM
========================= */
const formatTanggalJam = (tanggal) => {
  if (!tanggal) {
    return null;
  }

  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })} | ${date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

/* =========================
   NORMALISASI RESPONSE
========================= */
const getResponseData = (result) => {
  if (
    result &&
    typeof result === "object" &&
    "data" in result
  ) {
    return result.data;
  }

  return result;
};

function DetailSuratAhliWaris({ data, onClose }) {
  const navigate = useNavigate();
  const { id: routeId } = useParams();

  /* =========================
     ID SURAT
     
     Bisa berasal dari:
     1. URL /surat-ahli-waris/:id
     2. data dari halaman sebelumnya
  ========================= */
  const suratId =
    routeId ||
    data?.id_surat_ahli_waris ||
    data?.id;

  /* =========================
     STATE
  ========================= */
  const [detailData, setDetailData] = useState(
    data || null
  );

  const [pendudukData, setPendudukData] = useState([]);

  const [trackingData, setTrackingData] = useState([]);

  const [dokumenData, setDokumenData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [trackingLoading, setTrackingLoading] =
    useState(true);

  const [dokumenLoading, setDokumenLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =========================
     LOAD DATA DETAIL
  ========================= */
  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        let suratData = null;

        /* =========================
           AMBIL DETAIL DARI DATABASE
        ========================= */
        if (suratId) {
          const response = await fetch(
            `${API_URL}/surat-ahli-waris/${suratId}`
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
                "Gagal mengambil detail surat ahli waris."
            );
          }

          suratData = getResponseData(result);
        }

        /* =========================
           FALLBACK DATA DARI PROPS
        ========================= */
        if (!suratData) {
          suratData = data || null;
        }

        if (!suratData) {
          throw new Error(
            "Data surat ahli waris tidak ditemukan."
          );
        }

        console.log(
          "DETAIL SURAT AHLI WARIS:",
          suratData
        );

        /* =========================
           AMBIL DATA PENDUDUK
        ========================= */
        const pendudukResponse = await fetch(
          `${API_URL}/penduduk`
        );

        const pendudukResult =
          await pendudukResponse.json();

        if (!pendudukResponse.ok) {
          throw new Error(
            pendudukResult.message ||
              "Gagal mengambil data penduduk."
          );
        }

        const pendudukList =
          getResponseData(pendudukResult);

        setPendudukData(
          Array.isArray(pendudukList)
            ? pendudukList
            : []
        );

        setDetailData(suratData);
      } catch (error) {
        console.error(
          "Gagal mengambil detail surat ahli waris:",
          error
        );

        setErrorMessage(
          error.message ||
            "Gagal mengambil detail surat ahli waris."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [suratId, data]);

  /* =========================
     LOAD TRACKING
  ========================= */
  useEffect(() => {
    const loadTracking = async () => {
      if (!suratId) {
        setTrackingData([]);
        setTrackingLoading(false);
        return;
      }

      try {
        setTrackingLoading(true);

        const response = await fetch(
          `${API_URL}/tracking-surat/surat/${suratId}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Gagal mengambil tracking surat."
          );
        }

        const tracking =
          getResponseData(result);

        setTrackingData(
          Array.isArray(tracking)
            ? tracking
            : []
        );
      } catch (error) {
        console.error(
          "Gagal mengambil tracking surat:",
          error
        );

        setTrackingData([]);
      } finally {
        setTrackingLoading(false);
      }
    };

    loadTracking();
  }, [suratId]);

  /* =========================
     LOAD DOKUMEN
  ========================= */
  useEffect(() => {
    const loadDokumen = async () => {
      if (!suratId) {
        setDokumenData([]);
        setDokumenLoading(false);
        return;
      }

      try {
        setDokumenLoading(true);

        const response = await fetch(
          `${API_URL}/dokumen/surat-ahli-waris/${suratId}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Gagal mengambil dokumen surat."
          );
        }

        const dokumen =
          getResponseData(result);

        setDokumenData(
          Array.isArray(dokumen)
            ? dokumen
            : []
        );
      } catch (error) {
        console.error(
          "Gagal mengambil dokumen surat ahli waris:",
          error
        );

        setDokumenData([]);
      } finally {
        setDokumenLoading(false);
      }
    };

    loadDokumen();
  }, [suratId]);

  /* =========================
     DOKUMEN AKTIF
  ========================= */
  const dokumenAktif = useMemo(() => {
    if (!dokumenData.length) {
      return null;
    }

    return dokumenData[0];
  }, [dokumenData]);

  /* =========================
     DATA PEWARIS
     
     PENTING:
     id_penduduk pada SuratAhliWaris
     = ID PEWARIS
  ========================= */
  const pewarisData = useMemo(() => {
    if (!detailData) {
      return null;
    }

    /* Prioritas pertama:
       data penduduk yang langsung dikirim backend */
    if (detailData.penduduk) {
      return detailData.penduduk;
    }

    /* Fallback:
       cari berdasarkan id_penduduk */
    const idPenduduk = Number(
      detailData.id_penduduk
    );

    if (!idPenduduk) {
      return null;
    }

    return (
      pendudukData.find(
        (item) =>
          Number(item.id_penduduk) ===
          idPenduduk
      ) || null
    );
  }, [detailData, pendudukData]);

  /* =========================
     DATA AHLI WARIS
     
     PENTING:
     detailData.ahliWaris.id_penduduk
     = ID AHLI WARIS
  ========================= */
  const ahliWarisData = useMemo(() => {
    if (!detailData) {
      return null;
    }

    const ahliWaris =
      detailData.ahliWaris || null;

    if (!ahliWaris) {
      return null;
    }

    /* =========================
       JIKA BACKEND SUDAH
       MENGEMBALIKAN DATA LENGKAP
    ========================= */
    if (
      typeof ahliWaris === "object"
    ) {
      const idPendudukAhliWaris =
        Number(
          ahliWaris.id_penduduk
        );

      /* Cari data terbaru dari tabel Penduduk */
      if (idPendudukAhliWaris) {
        const pendudukAhliWaris =
          pendudukData.find(
            (item) =>
              Number(item.id_penduduk) ===
              idPendudukAhliWaris
          );

        if (pendudukAhliWaris) {
          return {
            ...pendudukAhliWaris,

            /* Jangan sampai hubungan
               dari database hilang */
            hubungan:
              ahliWaris.hubungan ||
              "-",

            id_ahli_waris:
              ahliWaris.id_ahli_waris,

            id_penduduk:
              ahliWaris.id_penduduk,
          };
        }
      }

      /* Kalau data Penduduk tidak ditemukan,
         tetap gunakan data dari backend */
      return ahliWaris;
    }

    return null;
  }, [detailData, pendudukData]);

  /* =========================
     DATA DETAIL YANG DITAMPILKAN
  ========================= */
  const resolvedData = useMemo(() => {
    if (!detailData) {
      return null;
    }

    /* =========================
       PEWARIS
    ========================= */
    const pewaris =
      pewarisData ||
      null;

    /* =========================
       AHLI WARIS
    ========================= */
    const ahliWaris =
      ahliWarisData ||
      null;

    /* =========================
       DOKUMEN
    ========================= */
    const namaFileDokumen =
      dokumenAktif?.nama_dokumen_file ||
      detailData.nama_dokumen_file ||
      detailData.nama_file ||
      detailData.file ||
      "";

    const pathFileDokumen =
      dokumenAktif?.path_file ||
      detailData.path_file ||
      "";

    /* =========================
       TEMPAT TANGGAL LAHIR
       AHLI WARIS
    ========================= */
    let tempatTanggalLahirAhliWaris =
      "-";

    if (
      ahliWaris?.tempatTanggalLahir
    ) {
      tempatTanggalLahirAhliWaris =
        ahliWaris.tempatTanggalLahir;
    } else if (
      ahliWaris?.tempat_lahir &&
      ahliWaris?.tanggal_lahir
    ) {
      tempatTanggalLahirAhliWaris =
        `${ahliWaris.tempat_lahir}, ${formatTanggal(
          ahliWaris.tanggal_lahir
        )}`;
    }

    return {
      id:
        detailData.id_surat_ahli_waris ||
        suratId,

      nomorSurat:
        detailData.nomor_surat ||
        "-",

      tanggalPengajuan:
        formatTanggal(
          detailData.tanggal_pengajuan
        ),

      tanggalSelesai:
        formatTanggal(
          detailData.tanggal_selesai
        ),

      tahap:
        detailData.tahap ||
        "-",

      /* =========================
         DATA PEWARIS
      ========================= */
      namaPewaris:
        pewaris?.nama ||
        "-",

      nikPewaris:
        pewaris?.nik ||
        "-",

      /* =========================
         DATA AHLI WARIS
      ========================= */
      ahliWaris:
        ahliWaris?.nama ||
        "-",

      nikAhliWaris:
        ahliWaris?.nik ||
        "-",

      hubungan:
        ahliWaris?.hubungan ||
        "-",

      tempatTanggalLahir:
        tempatTanggalLahirAhliWaris,

      jenisKelamin:
        ahliWaris?.jenis_kelamin ||
        ahliWaris?.jenisKelamin ||
        "-",

      rw:
        ahliWaris?.rw ||
        "-",

      rt:
        ahliWaris?.rt ||
        "-",

      alamat:
        ahliWaris?.alamat ||
        "-",

      /* =========================
         DOKUMEN
      ========================= */
      file:
        namaFileDokumen ||
        "-",

      pathFile:
        pathFileDokumen,
    };
  }, [
    detailData,
    pewarisData,
    ahliWarisData,
    dokumenAktif,
    suratId,
  ]);

  /* =========================
     TRACKING DIKELOMPOKKAN
  ========================= */
  const trackingByStage = useMemo(() => {
    const result = {};

    tahapList.forEach((tahap) => {
      result[tahap.key] = null;
    });

    trackingData.forEach((item) => {
      const keterangan =
        item.keterangan?.toLowerCase() ||
        "";

      const tahap = tahapList.find(
        (itemTahap) =>
          keterangan.includes(
            itemTahap.key.toLowerCase()
          )
      );

      if (tahap) {
        result[tahap.key] = item;
      }
    });

    return result;
  }, [trackingData]);

  /* =========================
     INDEX TAHAP AKTIF
  ========================= */
  const activeStageIndex = useMemo(() => {
    if (!detailData?.tahap) {
      return -1;
    }

    const tahapDatabase =
      detailData.tahap.toLowerCase();

    return tahapList.findIndex(
      (item) =>
        item.key.toLowerCase() ===
        tahapDatabase
    );
  }, [detailData]);

  /* =========================
     STATUS TRACKING
  ========================= */
  const getTrackingStatus = (index) => {
    const tahap = tahapList[index];

    const tracking =
      trackingByStage[tahap.key];

    if (tracking) {
      return "completed";
    }

    if (
      activeStageIndex >= 0 &&
      index < activeStageIndex
    ) {
      return "completed";
    }

    if (
      activeStageIndex === index
    ) {
      return "active";
    }

    return "pending";
  };

  /* =========================
     AMBIL WAKTU TRACKING
  ========================= */
  const getTrackingDate = (index) => {
    const tahap = tahapList[index];

    const tracking =
      trackingByStage[tahap.key];

    if (!tracking) {
      return null;
    }

    return formatTanggalJam(
      tracking.waktu
    );
  };

  /* =========================
     HANDLE KEMBALI
  ========================= */
  const handleBack = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/surat-ahli-waris");
  };

  /* =========================
     BUKA BERKAS
  ========================= */
  const handleOpenFile = () => {
    if (dokumenLoading) {
      alert(
        "Dokumen sedang dimuat. Silakan coba lagi."
      );
      return;
    }

    if (!resolvedData?.pathFile) {
      alert(
        "Berkas surat belum tersedia."
      );
      return;
    }

    let fileUrl = "";

    if (
      resolvedData.pathFile.startsWith(
        "http://"
      ) ||
      resolvedData.pathFile.startsWith(
        "https://"
      )
    ) {
      fileUrl =
        resolvedData.pathFile;
    } else if (
      resolvedData.pathFile.startsWith(
        "/uploads/"
      )
    ) {
      fileUrl =
        `${SERVER_URL}${resolvedData.pathFile}`;
    } else {
      const filename =
        resolvedData.pathFile
          .split("\\")
          .pop()
          .split("/")
          .pop();

      if (!filename) {
        alert(
          "Berkas surat belum tersedia."
        );
        return;
      }

      fileUrl =
        `${SERVER_URL}/uploads/surat-ahli-waris/${encodeURIComponent(
          filename
        )}`;
    }

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="detail-saw-page">
        <Header
          title="Surat Ahli Waris"
          showSearch={false}
        />

        <main className="detail-saw-content">
          <div
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            Memuat detail surat ahli waris...
          </div>
        </main>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */
  if (
    errorMessage ||
    !resolvedData
  ) {
    return (
      <div className="detail-saw-page">
        <Header
          title="Surat Ahli Waris"
          showSearch={false}
        />

        <main className="detail-saw-content">
          <div
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            <p>
              {errorMessage ||
                "Data surat ahli waris tidak ditemukan."}
            </p>

            <button
              type="button"
              className="detail-saw-back-button"
              onClick={handleBack}
            >
              ←&nbsp; Kembali
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="detail-saw-page">

      {/* ================= HEADER ================= */}

      <Header
        title="Surat Ahli Waris"
        showSearch={false}
      />

      {/* ================= CONTENT ================= */}

      <main className="detail-saw-content">

        {/* TOMBOL KEMBALI */}

        <div className="detail-saw-back-wrapper">

          <button
            type="button"
            className="detail-saw-back-button"
            onClick={handleBack}
          >
            ←&nbsp; Kembali
          </button>

        </div>

        <div className="detail-saw-layout">

          {/* ================= KOLOM KIRI ================= */}

          <div className="detail-saw-left">

            {/* =================
                INFORMASI PENGAJUAN
            ================= */}

            <section className="detail-saw-card">

              <h2>
                Informasi Pengajuan
              </h2>

              <div className="detail-saw-data">

                <div className="detail-saw-row">
                  <span>
                    Ahli Waris
                  </span>

                  <strong>
                    {resolvedData.ahliWaris}
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    NIK
                  </span>

                  <strong>
                    {resolvedData.nikAhliWaris}
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    Pewaris
                  </span>

                  <strong>
                    {resolvedData.namaPewaris}
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    Hubungan
                  </span>

                  <strong>
                    {resolvedData.hubungan}
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    Tanggal Pengajuan
                  </span>

                  <strong>
                    {
                      resolvedData.tanggalPengajuan
                    }
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    Tanggal Selesai
                  </span>

                  <strong>
                    {
                      resolvedData.tanggalSelesai
                    }
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    Tahap
                  </span>

                  <strong className="detail-saw-stage">
                    {resolvedData.tahap}
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    Berkas
                  </span>

                  {dokumenLoading ? (
                    <span>
                      Memuat berkas...
                    </span>
                  ) : dokumenAktif ? (
                    <button
                      type="button"
                      className="detail-saw-file"
                      onClick={handleOpenFile}
                    >
                      <img
                        className="pdf-icon-img"
                        src={pdfIcon}
                        alt=""
                      />

                      {resolvedData.file}
                    </button>
                  ) : (
                    <span>
                      Berkas belum tersedia
                    </span>
                  )}

                </div>

              </div>

            </section>

            {/* =================
                DATA AHLI WARIS
            ================= */}

            <section className="detail-saw-card detail-saw-person-card">

              <h2>
                Data Ahli Waris
              </h2>

              <div className="detail-saw-data">

                <div className="detail-saw-row">
                  <span>
                    Nama
                  </span>

                  <strong>
                    {resolvedData.ahliWaris}
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    NIK
                  </span>

                  <strong>
                    {resolvedData.nikAhliWaris}
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    Tempat, Tanggal Lahir
                  </span>

                  <strong>
                    {
                      resolvedData.tempatTanggalLahir
                    }
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    Jenis Kelamin
                  </span>

                  <strong>
                    {
                      resolvedData.jenisKelamin
                    }
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    RW
                  </span>

                  <strong>
                    {resolvedData.rw}
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>
                    RT
                  </span>

                  <strong>
                    {resolvedData.rt}
                  </strong>
                </div>

                <div className="detail-saw-row detail-saw-address">
                  <span>
                    Alamat
                  </span>

                  <strong>
                    {resolvedData.alamat}
                  </strong>
                </div>

              </div>

            </section>

          </div>

          {/* =================
              KOLOM KANAN
          ================= */}

          <section className="detail-saw-tracking">

            <h2>
              Tracking Surat Ahli Waris
            </h2>

            {trackingLoading ? (
              <div
                style={{
                  padding: "20px 0",
                }}
              >
                Memuat tracking...
              </div>
            ) : (
              <div className="tracking-list">

                {tahapList.map(
                  (tahap, index) => {
                    const status =
                      getTrackingStatus(
                        index
                      );

                    const tracking =
                      trackingByStage[
                        tahap.key
                      ];

                    const tanggal =
                      getTrackingDate(
                        index
                      );

                    return (
                      <div
                        className={`tracking-item ${
                          status ===
                          "completed"
                            ? "completed"
                            : status ===
                              "active"
                            ? "active"
                            : "last"
                        }`}
                        key={tahap.key}
                      >

                        {/* GARIS TRACKING */}

                        {index <
                          tahapList.length -
                            1 && (
                          <div className="tracking-line"></div>
                        )}

                        {/* CIRCLE */}

                        <div
                          className={`tracking-circle ${
                            status ===
                            "pending"
                              ? "pending"
                              : ""
                          }`}
                        >
                          {status ===
                          "completed"
                            ? "✓"
                            : index + 1}
                        </div>

                        {/* CONTENT */}

                        <div className="tracking-content">

                          <h3>
                            {tahap.title}
                          </h3>

                          {tanggal && (
                            <p className="tracking-date">
                              {tanggal}
                            </p>
                          )}

                          {tracking?.keterangan ? (
                            <p className="tracking-description">
                              {
                                tracking.keterangan
                              }
                            </p>
                          ) : (
                            <p className="tracking-description">
                              {
                                tahap.description
                              }
                            </p>
                          )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default DetailSuratAhliWaris;