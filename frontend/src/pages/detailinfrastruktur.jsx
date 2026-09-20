import { useNavigate, useParams } from "react-router-dom";
import pjuImage from "../assets/pju.jpg";
import mapsIcon from "../assets/maps.png";
import editDataIcon from "../assets/editdata.png";
import hapusDataIcon from "../assets/hapusdata.png";

const fallbackData = [
  {
    no: "001",
    jenis: "CCTV",
    kondisi: "Baik",
    pic: "Setyo",
    telepon: "081963542083",
    rt: "02",
    rw: "01",
    alamat:
      "Jl. Manukan Asri No.I-A, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "002",
    jenis: "PJU",
    kondisi: "Baik",
    pic: "Bambang",
    telepon: "088863542099",
    rt: "16",
    rw: "03",
    alamat:
      "Jl. Manukan Asri No. 16, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "003",
    jenis: "CCTV",
    kondisi: "Rusak Ringan",
    pic: "Rini",
    telepon: "085263542081",
    rt: "19",
    rw: "04",
    alamat:
      "Jl. Manukan Asri No. 19, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "004",
    jenis: "Saluran",
    kondisi: "Rusak Ringan",
    pic: "Hadi",
    telepon: "081977512083",
    rt: "23",
    rw: "05",
    alamat:
      "Jl. Manukan Subur No. 08, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "005",
    jenis: "CCTV",
    kondisi: "Rusak Berat",
    pic: "Julia",
    telepon: "081263549001",
    rt: "06",
    rw: "02",
    alamat:
      "Jl. Manukan Krajan No. 02, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
];

function DetailInfrastruktur({ data, onClose, onEdit, onDelete }) {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = useParams();
  const resolvedData = data ?? fallbackData.find((item) => item.no === params.id) ?? null;

  if (!resolvedData) return null;

  const kondisiClass =
    resolvedData.kondisi === "Baik"
      ? "detail-condition baik"
      : resolvedData.kondisi === "Rusak Ringan"
      ? "detail-condition ringan"
      : "detail-condition berat";

  const photoSource = resolvedData.foto || pjuImage;

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/infrastruktur");
  };

  return (
    <div className="detail-overlay" onClick={handleClose}>
      <aside
        className="detail-sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="detail-header">
          <h2>Detail Data Infrastruktur</h2>

          <button
            type="button"
            className="detail-close"
            onClick={handleClose}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        {/* INFORMASI UTAMA */}
        <div className="detail-main-card">
          <div className="detail-main-top">
            <h3>{resolvedData.jenis}</h3>

            <span className={kondisiClass}>
              • {resolvedData.kondisi}
            </span>
          </div>

          <button
            type="button"
            className="location-button"
            onClick={() => {
              if (resolvedData.latitude && resolvedData.longitude) {
                window.open(
                  `https://www.google.com/maps?q=${resolvedData.latitude},${resolvedData.longitude}`,
                  "_blank"
                );
              }
            }}
          >
            <img className="location-icon" src={mapsIcon} alt="" />

            <span>
              <strong>Lihat Lokasi</strong>
              <small>
                {resolvedData.latitude || "-"}, {resolvedData.longitude || "-"}
              </small>
            </span>
          </button>
        </div>

        {/* FOTO */}
        <div className="detail-card detail-photo-card">
          <h3>Foto</h3>

          <div className="detail-photo">
            {photoSource ? (
              <img
                src={photoSource}
                alt={`Foto ${resolvedData.jenis}`}
              />
            ) : (
              <div className="photo-placeholder">
                <div className="photo-icon">
                  <span className="photo-sun"></span>
                  <span className="photo-mountain"></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DATA INFRASTRUKTUR */}
        <div className="detail-card detail-data-card">
          <h3>Data Infrastruktur</h3>

          <div className="detail-data-list">
            <div className="detail-row">
              <span>Jenis</span>
              <strong>{resolvedData.jenis || "-"}</strong>
            </div>

            <div className="detail-row">
              <span>Kondisi</span>
              <strong>{resolvedData.kondisi || "-"}</strong>
            </div>

            <div className="detail-row">
              <span>PIC</span>
              <strong>{resolvedData.pic || "-"}</strong>
            </div>

            <div className="detail-row">
              <span>Nomor Telepon</span>
              <strong>{resolvedData.telepon || "-"}</strong>
            </div>

            <div className="detail-row">
              <span>Tanggal Pengadaan</span>
              <strong>{resolvedData.tanggalPengadaan || "-"}</strong>
            </div>

            <div className="detail-row">
              <span>RW</span>
              <strong>{resolvedData.rw || "-"}</strong>
            </div>

            <div className="detail-row">
              <span>RT</span>
              <strong>{resolvedData.rt || "-"}</strong>
            </div>

            <div className="detail-row detail-address-row">
              <span>Alamat</span>
              <strong>{resolvedData.alamat || "-"}</strong>
            </div>
          </div>
        </div>

        {/* AKSI */}
        <div className="detail-actions">
          <button
            type="button"
            className="edit-data-button"
            onClick={() => navigate(`/infrastruktur/${resolvedData.no}/edit`)}
            >
            <img className="action-icon-img" src={editDataIcon} alt="" />
            Edit Data
            </button>

          <button
            type="button"
            className="delete-data-button"
            onClick={() => onDelete?.(resolvedData)}
          >
            <img className="action-icon-img" src={hapusDataIcon} alt="" />
            Hapus Data
          </button>
        </div>
      </aside>
    </div>
  );
}

export default DetailInfrastruktur;