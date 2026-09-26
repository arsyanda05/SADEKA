import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import pjuImage from "../assets/pju.jpg";
import mapsIcon from "../assets/maps.png";
import editDataIcon from "../assets/editdata.png";
import hapusDataIcon from "../assets/hapusdata.png";

import {
  getDetailInfrastruktur,
} from "../services/api";

function DetailInfrastruktur({
  data,
  onClose,
  onDelete,
}) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [detailData, setDetailData] = useState(
    data ?? null
  );

  const [loading, setLoading] = useState(
    !data
  );

  const [errorMessage, setErrorMessage] =
    useState("");

  // ============================================================
  // AMBIL DETAIL DARI DATABASE
  // ============================================================

  useEffect(() => {
    const loadDetail = async () => {
      // Kalau data sudah dikirim dari halaman Infrastruktur,
      // tidak perlu request lagi.
      if (data) {
        setDetailData(data);
        setLoading(false);
        return;
      }

      if (!id) {
        setLoading(false);
        setErrorMessage(
          "ID infrastruktur tidak ditemukan"
        );
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        const result =
          await getDetailInfrastruktur(id);

        setDetailData(result);
      } catch (error) {
        console.error(
          "Error mengambil detail infrastruktur:",
          error
        );

        setErrorMessage(
          error.message ||
            "Gagal mengambil detail infrastruktur"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [data, id]);

  // ============================================================
  // TUTUP DETAIL
  // ============================================================

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/infrastruktur");
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div
        className="detail-overlay"
        onClick={handleClose}
      >
        <aside
          className="detail-sidebar"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <div className="detail-header">
            <h2>
              Detail Data Infrastruktur
            </h2>

            <button
              type="button"
              className="detail-close"
              onClick={handleClose}
              aria-label="Tutup"
            >
              ×
            </button>
          </div>

          <div
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            Memuat data...
          </div>
        </aside>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (errorMessage || !detailData) {
    return (
      <div
        className="detail-overlay"
        onClick={handleClose}
      >
        <aside
          className="detail-sidebar"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <div className="detail-header">
            <h2>
              Detail Data Infrastruktur
            </h2>

            <button
              type="button"
              className="detail-close"
              onClick={handleClose}
              aria-label="Tutup"
            >
              ×
            </button>
          </div>

          <div
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            <p>
              {errorMessage ||
                "Data infrastruktur tidak ditemukan"}
            </p>
          </div>
        </aside>
      </div>
    );
  }

  // ============================================================
  // DATA DARI DATABASE
  // ============================================================

  const resolvedData = detailData;

  // Database:
  // kondisi_status
  const kondisi =
    resolvedData.kondisi_status || "";

  const kondisiClass =
    kondisi === "Baik"
      ? "detail-condition baik"
      : kondisi === "Rusak Ringan"
      ? "detail-condition ringan"
      : "detail-condition berat";

  // ============================================================
  // FOTO
  // ============================================================

  // Saat ini database masih menyimpan nama file foto,
  // bukan file gambar sebenarnya.
  //
  // Jadi kalau foto belum berupa URL/path gambar,
  // gunakan gambar default pju.jpg.

  const photoSource =
    resolvedData.foto &&
    (
      resolvedData.foto.startsWith("http") ||
      resolvedData.foto.startsWith("/") ||
      resolvedData.foto.startsWith("data:")
    )
      ? resolvedData.foto
      : pjuImage;

  // ============================================================
  // FORMAT TANGGAL
  // ============================================================

  const formatTanggal = (tanggal) => {
    if (!tanggal) {
      return "-";
    }

    try {
      return new Date(
        tanggal.toString()
      ).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  // ============================================================
  // FORMAT KOORDINAT
  // ============================================================

  const latitude =
    resolvedData.latitude;

  const longitude =
    resolvedData.longitude;

  // ============================================================
  // LIHAT LOKASI
  // ============================================================

  const handleOpenMaps = () => {
    if (
      latitude === undefined ||
      latitude === null ||
      longitude === undefined ||
      longitude === null
    ) {
      return;
    }

    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank"
    );
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleEdit = () => {
    navigate(
      `/infrastruktur/${resolvedData.id_infrastruktur}/edit`
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="detail-overlay"
      onClick={handleClose}
    >
      <aside
        className="detail-sidebar"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="detail-header">
          <h2>
            Detail Data Infrastruktur
          </h2>

          <button
            type="button"
            className="detail-close"
            onClick={handleClose}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        {/* ================================================== */}
        {/* INFORMASI UTAMA */}
        {/* ================================================== */}

        <div className="detail-main-card">
          <div className="detail-main-top">
            <h3>
              {resolvedData.jenis || "-"}
            </h3>

            <span className={kondisiClass}>
              • {kondisi || "-"}
            </span>
          </div>

          <button
            type="button"
            className="location-button"
            onClick={handleOpenMaps}
          >
            <img
              className="location-icon"
              src={mapsIcon}
              alt=""
            />

            <span>
              <strong>
                Lihat Lokasi
              </strong>

              <small>
                {latitude ?? "-"},{" "}
                {longitude ?? "-"}
              </small>
            </span>
          </button>
        </div>

        {/* ================================================== */}
        {/* FOTO */}
        {/* ================================================== */}

        <div className="detail-card detail-photo-card">
          <h3>Foto</h3>

          <div className="detail-photo">
            <img
              src={photoSource}
              alt={`Foto ${
                resolvedData.jenis || "infrastruktur"
              }`}
            />
          </div>
        </div>

        {/* ================================================== */}
        {/* DATA INFRASTRUKTUR */}
        {/* ================================================== */}

        <div className="detail-card detail-data-card">
          <h3>Data Infrastruktur</h3>

          <div className="detail-data-list">

            {/* JENIS */}

            <div className="detail-row">
              <span>Jenis</span>

              <strong>
                {resolvedData.jenis || "-"}
              </strong>
            </div>

            {/* KONDISI */}

            <div className="detail-row">
              <span>Kondisi</span>

              <strong>
                {resolvedData.kondisi_status ||
                  "-"}
              </strong>
            </div>

            {/* PIC */}

            <div className="detail-row">
              <span>PIC</span>

              <strong>
                {resolvedData.penanggung_jawab ||
                  "-"}
              </strong>
            </div>

            {/* NOMOR TELEPON */}

            <div className="detail-row">
              <span>
                Nomor Telepon
              </span>

              <strong>
                {resolvedData.no_telp || "-"}
              </strong>
            </div>

            {/* TANGGAL PENGADAAN */}

            <div className="detail-row">
              <span>
                Tanggal Pengadaan
              </span>

              <strong>
                {formatTanggal(
                  resolvedData.tanggal_pengadaan
                )}
              </strong>
            </div>

            {/* PANJANG */}

            <div className="detail-row">
              <span>Panjang</span>

              <strong>
                {resolvedData.panjang ?? "-"}
              </strong>
            </div>

            {/* LEBAR */}

            <div className="detail-row">
              <span>Lebar</span>

              <strong>
                {resolvedData.lebar ?? "-"}
              </strong>
            </div>

            {/* RW */}

            <div className="detail-row">
              <span>RW</span>

              <strong>
                {resolvedData.rw || "-"}
              </strong>
            </div>

            {/* RT */}

            <div className="detail-row">
              <span>RT</span>

              <strong>
                {resolvedData.rt || "-"}
              </strong>
            </div>

            {/* ALAMAT */}

            <div className="detail-row detail-address-row">
              <span>Alamat</span>

              <strong>
                {resolvedData.alamat || "-"}
              </strong>
            </div>

          </div>
        </div>

        {/* ================================================== */}
        {/* AKSI */}
        {/* ================================================== */}

        <div className="detail-actions">

          {/* EDIT */}

          <button
            type="button"
            className="edit-data-button"
            onClick={handleEdit}
          >
            <img
              className="action-icon-img"
              src={editDataIcon}
              alt=""
            />

            Edit Data
          </button>

          {/* DELETE */}

          <button
            type="button"
            className="delete-data-button"
            onClick={() =>
              onDelete?.(resolvedData)
            }
          >
            <img
              className="action-icon-img"
              src={hapusDataIcon}
              alt=""
            />

            Hapus Data
          </button>

        </div>
      </aside>
    </div>
  );
}

export default DetailInfrastruktur;