import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import pdfIcon from "../assets/pdf.png";
import { API_URL, getBackendFileUrl } from "../services/api";




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








  const suratId =
    routeId ||
    data?.id_surat_ahli_waris ||
    data?.id;




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




  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        let suratData = null;




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




  const dokumenAktif = useMemo(() => {
    if (!dokumenData.length) {
      return null;
    }

    return dokumenData[0];
  }, [dokumenData]);








  const pewarisData = useMemo(() => {
    if (!detailData) {
      return null;
    }



    if (detailData.penduduk) {
      return detailData.penduduk;
    }



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








  const ahliWarisData = useMemo(() => {
    if (!detailData) {
      return null;
    }

    const ahliWaris =
      detailData.ahliWaris || null;

    if (!ahliWaris) {
      return null;
    }





    if (
      typeof ahliWaris === "object"
    ) {
      const idPendudukAhliWaris =
        Number(
          ahliWaris.id_penduduk
        );


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



      return ahliWaris;
    }

    return null;
  }, [detailData, pendudukData]);




  const resolvedData = useMemo(() => {
    if (!detailData) {
      return null;
    }




    const pewaris =
      pewarisData ||
      null;




    const ahliWaris =
      ahliWarisData ||
      null;




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




      namaPewaris:
        pewaris?.nama ||
        "-",

      nikPewaris:
        pewaris?.nik ||
        "-",




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




  const handleBack = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/surat-ahli-waris");
  };




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

    let fileUrl;

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
      fileUrl = getBackendFileUrl(resolvedData.pathFile);
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

      fileUrl = getBackendFileUrl(
        `/uploads/surat-ahli-waris/${encodeURIComponent(filename)}`
      );
    }

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };




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



      <Header
        title="Surat Ahli Waris"
        showSearch={false}
      />



      <main className="detail-saw-content">



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



          <div className="detail-saw-left">





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



                        {index <
                          tahapList.length -
                            1 && (
                          <div className="tracking-line"></div>
                        )}



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