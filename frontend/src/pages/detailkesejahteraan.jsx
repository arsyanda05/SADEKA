import { useNavigate, useParams } from "react-router-dom";
import editDataIcon from "../assets/editdata.png";
import hapusDataIcon from "../assets/hapusdata.png";
import ksj2Icon from "../assets/ksj2.png";
import ksj3Icon from "../assets/ksj3.png";
import ksj4Icon from "../assets/ksj4.png";
import ksj5Icon from "../assets/ksj5.png";

const fallbackData = [
  {
    no: "001",
    nama: "Haryadi",
    nik: "3530110702060001",
    kategori: "Rutilahu",
    status: "Selesai",
    rt: "02",
    rw: "01",
    keterangan:
      "Kondisi atap dan dinding rumah yang mengalami kerusakan sudah diperbaiki",
    tempatTanggalLahir: "Surabaya, 13 April 1995",
    usia: "31 Tahun",
    jenisKelamin: "Laki-laki",
    alamat:
      "Jl. Manukan Asri No.I-A, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "002",
    nama: "Sri Rejeki",
    nik: "3530115702060001",
    kategori: "Ibu Hamil",
    status: "Dalam Penanganan",
    rt: "16",
    rw: "03",
    keterangan:
      "Kehamilan 7 bulan, rutin melakukan pemeriksaan",
    tempatTanggalLahir: "Surabaya, 20 Januari 1998",
    usia: "28 Tahun",
    jenisKelamin: "Perempuan",
    alamat:
      "Jl. Manukan Asri No. 16, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "003",
    nama: "Nadira",
    nik: "3520116704090001",
    kategori: "Stunting",
    status: "Belum Ditangani",
    rt: "03",
    rw: "01",
    keterangan:
      "Memerlukan pemantauan pertumbuhan dan asupan gizi secara berkala",
    tempatTanggalLahir: "Surabaya, 13 April 2020",
    usia: "6 Tahun",
    jenisKelamin: "Perempuan",
    alamat:
      "Jl. Manukan Asri No.06, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "004",
    nama: "Kayla",
    nik: "3540121702090001",
    kategori: "Putus Sekolah",
    status: "Selesai",
    rt: "23",
    rw: "05",
    keterangan:
      "Telah kembali melanjutkan pendidikan",
    tempatTanggalLahir: "Surabaya, 17 Februari 2009",
    usia: "17 Tahun",
    jenisKelamin: "Perempuan",
    alamat:
      "Jl. Manukan Subur No. 08, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "005",
    nama: "Utami",
    nik: "3550118702980001",
    kategori: "Ibu Hamil",
    status: "Dalam Penanganan",
    rt: "06",
    rw: "02",
    keterangan:
      "Rutin melakukan pemeriksaan kehamilan di fasilitas kesehatan",
    tempatTanggalLahir: "Surabaya, 2 September 1998",
    usia: "28 Tahun",
    jenisKelamin: "Perempuan",
    alamat:
      "Jl. Manukan Krajan No. 02, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
];

function DetailKesejahteraan({
  data,
  onClose,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const { id } = useParams();

  const resolvedData =
    data ??
    fallbackData.find((item) => item.no === id) ??
    null;

  if (!resolvedData) return null;

  const categoryIcon =
    resolvedData.kategori === "Stunting"
      ? ksj2Icon
      : resolvedData.kategori === "Ibu Hamil"
      ? ksj3Icon
      : resolvedData.kategori === "Rutilahu"
      ? ksj4Icon
      : resolvedData.kategori === "Putus Sekolah"
      ? ksj5Icon
      : ksj2Icon;

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/kesejahteraan");
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(resolvedData);
      return;
    }

    navigate(`/kesejahteraan/${resolvedData.no}/edit`);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(resolvedData);
    }
  };

  return (
    <div className="kesejahteraan-detail-overlay" onClick={handleClose}>
      <aside
        className="kesejahteraan-detail-sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* JUDUL */}
        <div className="kesejahteraan-detail-header">
          <h2>Detail Data Kesejahteraan</h2>

          <button
            type="button"
            className="detail-umkm-close"
            onClick={handleClose}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        {/* DATA UTAMA */}
        <div className="kesejahteraan-detail-main-card">
          <div className="kesejahteraan-detail-main-top">
            <div>
              <h3>{resolvedData.nama}</h3>

              <p className="kesejahteraan-detail-age">
                {resolvedData.usia}
              </p>

              <div className="kesejahteraan-detail-category">
                <img
                  className="category-person-icon"
                  src={categoryIcon}
                  alt={resolvedData.kategori}
                />
                <span>{resolvedData.kategori}</span>
              </div>
            </div>

            <span
              className={`kesejahteraan-detail-status ${
                resolvedData.status === "Selesai"
                  ? "status-selesai"
                  : resolvedData.status === "Dalam Penanganan"
                  ? "status-penanganan"
                  : "status-belum"
              }`}
            >
              <span>•</span>
              {resolvedData.status}
            </span>
          </div>
        </div>

        {/* KETERANGAN */}
        <div className="kesejahteraan-detail-card">
          <h3>Keterangan</h3>

          <p className="kesejahteraan-detail-description">
            {resolvedData.keterangan || "-"}
          </p>
        </div>

        {/* DATA PENDUDUK */}
        <div className="kesejahteraan-detail-card detail-penduduk-card">
          <h3>Data Penduduk</h3>

          <div className="kesejahteraan-detail-data-list">
            <div className="kesejahteraan-detail-row">
              <span>Nama</span>
              <strong>{resolvedData.nama || "-"}</strong>
            </div>

            <div className="kesejahteraan-detail-row">
              <span>NIK</span>
              <strong>{resolvedData.nik || "-"}</strong>
            </div>

            <div className="kesejahteraan-detail-row">
              <span>
                Tempat,
                <br />
                Tanggal Lahir
              </span>

              <strong>
                {resolvedData.tempatTanggalLahir || "-"}
              </strong>
            </div>

            <div className="kesejahteraan-detail-row">
              <span>Usia</span>
              <strong>{resolvedData.usia || "-"}</strong>
            </div>

            <div className="kesejahteraan-detail-row">
              <span>Jenis Kelamin</span>
              <strong>{resolvedData.jenisKelamin || "-"}</strong>
            </div>

            <div className="kesejahteraan-detail-row">
              <span>RW</span>
              <strong>{resolvedData.rw || "-"}</strong>
            </div>

            <div className="kesejahteraan-detail-row">
              <span>RT</span>
              <strong>{resolvedData.rt || "-"}</strong>
            </div>

            <div className="kesejahteraan-detail-row">
              <span>Alamat</span>
              <strong>{resolvedData.alamat || "-"}</strong>
            </div>
          </div>
        </div>

        {/* AKSI */}
        <div className="kesejahteraan-detail-actions">
          <button
            type="button"
            className="kesejahteraan-edit-button"
            onClick={handleEdit}
          >
            <img className="action-icon-img" src={editDataIcon} alt="" />
            Edit Data
          </button>

          <button
            type="button"
            className="kesejahteraan-delete-button"
            onClick={handleDelete}
          >
            <img className="action-icon-img" src={hapusDataIcon} alt="" />
            Hapus Data
          </button>
        </div>
      </aside>
    </div>
  );
}

export default DetailKesejahteraan;