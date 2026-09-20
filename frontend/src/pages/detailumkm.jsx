import { useNavigate, useParams } from "react-router-dom";
import editDataIcon from "../assets/editdata.png";
import hapusDataIcon from "../assets/hapusdata.png";

const fallbackData = [
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
    pemilik: "Lina Wati",
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

function DetailUMKM({ data, onClose, onDelete }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const resolvedData =
    data ?? fallbackData.find((item) => item.no === id) ?? null;

  if (!resolvedData) return null;

  const hasNib = Boolean(resolvedData.nib);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/umkm");
  };

  return (
    <div className="detail-umkm-overlay" onClick={handleClose}>
      <aside
        className="detail-umkm-sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="detail-umkm-header">
          <h2>Detail Data UMKM</h2>

          <button
            type="button"
            className="detail-umkm-close"
            onClick={handleClose}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        {/* INFORMASI UTAMA */}
        <div className="detail-umkm-main-card">
          <div className="detail-umkm-main-top">
            <div>
              <h3>{resolvedData.namaUsaha}</h3>

              <p>{resolvedData.pemilik}</p>
            </div>

            <span
              className={
                hasNib
                  ? "detail-umkm-nib-status active"
                  : "detail-umkm-nib-status"
              }
            >
              • {hasNib ? "NIB Terdaftar" : "Belum Memiliki NIB"}
            </span>
          </div>

          <div className="detail-umkm-type">

            <span>{resolvedData.jenisUsaha}</span>
          </div>
        </div>

        {/* DATA USAHA */}
        <div className="detail-umkm-card">
          <h3>Data Usaha</h3>

          <div className="detail-umkm-data-list">
            <div className="detail-umkm-row">
              <span>Nama Usaha</span>
              <strong>{resolvedData.namaUsaha || "-"}</strong>
            </div>

            <div className="detail-umkm-row">
              <span>Pemilik</span>
              <strong>{resolvedData.pemilik || "-"}</strong>
            </div>

            <div className="detail-umkm-row">
              <span>Jenis Usaha</span>
              <strong>{resolvedData.jenisUsaha || "-"}</strong>
            </div>

            <div className="detail-umkm-row">
              <span>NIB</span>
              <strong>{resolvedData.nib || "-"}</strong>
            </div>

            <div className="detail-umkm-row">
              <span>RW</span>
              <strong>{resolvedData.rw || "-"}</strong>
            </div>

            <div className="detail-umkm-row">
              <span>RT</span>
              <strong>{resolvedData.rt || "-"}</strong>
            </div>

            <div className="detail-umkm-row detail-umkm-address-row">
              <span>Alamat</span>

              <strong>{resolvedData.alamat || "-"}</strong>
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="detail-umkm-actions">
          <button
            type="button"
            className="detail-umkm-edit-button"
            onClick={() =>
              navigate(`/umkm/${resolvedData.no}/edit`)
            }
          >
            <img className="action-icon-img" src={editDataIcon} alt="" />
            Edit Data
          </button>

          <button
            type="button"
            className="detail-umkm-delete-button"
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

export default DetailUMKM;