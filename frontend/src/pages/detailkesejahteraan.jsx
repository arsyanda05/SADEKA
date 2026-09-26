import { useNavigate } from "react-router-dom";

import editDataIcon from "../assets/editdata.png";
import hapusDataIcon from "../assets/hapusdata.png";

import ksj2Icon from "../assets/ksj2.png";
import ksj3Icon from "../assets/ksj3.png";
import ksj4Icon from "../assets/ksj4.png";
import ksj5Icon from "../assets/ksj5.png";

function DetailKesejahteraan({
  data,
  onClose,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  /*
   * Jika tidak ada data,
   * detail tidak ditampilkan.
   */
  const resolvedData = data ?? null;

  if (!resolvedData) {
    return null;
  }

  /*
   * ==============================
   * ICON KATEGORI
   * ==============================
   */

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

  /*
   * ==============================
   * CLOSE
   * ==============================
   */

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/kesejahteraan");
  };

  /*
   * ==============================
   * EDIT
   * ==============================
   */

  const handleEdit = () => {
    /*
     * Jika parent menyediakan onEdit,
     * gunakan fungsi tersebut.
     */
    if (onEdit) {
      onEdit(resolvedData);
      return;
    }

    /*
     * Jika tidak ada onEdit,
     * langsung menuju halaman edit
     * berdasarkan ID dari database.
     */
    if (!resolvedData.id_kesejahteraan) {
      console.error(
        "ID kesejahteraan tidak ditemukan:",
        resolvedData
      );

      return;
    }

    navigate(
      `/kesejahteraan/${resolvedData.id_kesejahteraan}/edit`
    );
  };

  /*
   * ==============================
   * DELETE
   * ==============================
   */

  const handleDelete = () => {
    /*
     * Proses hapus dikelola oleh parent
     * karena parent sudah memiliki:
     *
     * 1. Konfirmasi
     * 2. API delete
     * 3. Refresh data
     * 4. Menutup detail
     */
    if (onDelete) {
      onDelete(resolvedData);
      return;
    }

    /*
     * Jika komponen digunakan tanpa onDelete,
     * tidak melakukan proses delete sendiri.
     */
    console.error(
      "Fungsi onDelete belum diberikan ke DetailKesejahteraan."
    );
  };

  /*
   * ==============================
   * RETURN
   * ==============================
   */

  return (
    <div
      className="kesejahteraan-detail-overlay"
      onClick={handleClose}
    >
      <aside
        className="kesejahteraan-detail-sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* JUDUL */}

        <div className="kesejahteraan-detail-header">
          <h2>
            Detail Data Kesejahteraan
          </h2>

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
              <h3>
                {resolvedData.nama || "-"}
              </h3>

              <p className="kesejahteraan-detail-age">
                {resolvedData.usia || "-"}
              </p>

              <div className="kesejahteraan-detail-category">
                <img
                  className="category-person-icon"
                  src={categoryIcon}
                  alt={
                    resolvedData.kategori || "Kategori"
                  }
                />

                <span>
                  {resolvedData.kategori || "-"}
                </span>
              </div>
            </div>

            <span
              className={`kesejahteraan-detail-status ${
                resolvedData.status === "Selesai"
                  ? "status-selesai"
                  : resolvedData.status ===
                    "Dalam Penanganan"
                  ? "status-penanganan"
                  : "status-belum"
              }`}
            >
              <span>•</span>

              {resolvedData.status || "-"}
            </span>
          </div>
        </div>

        {/* KETERANGAN */}

        <div className="kesejahteraan-detail-card">
          <h3>
            Keterangan
          </h3>

          <p className="kesejahteraan-detail-description">
            {resolvedData.keterangan || "-"}
          </p>
        </div>

        {/* DATA PENDUDUK */}

        <div className="kesejahteraan-detail-card detail-penduduk-card">
          <h3>
            Data Penduduk
          </h3>

          <div className="kesejahteraan-detail-data-list">

            {/* NAMA */}

            <div className="kesejahteraan-detail-row">
              <span>
                Nama
              </span>

              <strong>
                {resolvedData.nama || "-"}
              </strong>
            </div>

            {/* NIK */}

            <div className="kesejahteraan-detail-row">
              <span>
                NIK
              </span>

              <strong>
                {resolvedData.nik || "-"}
              </strong>
            </div>

            {/* TEMPAT TANGGAL LAHIR */}

            <div className="kesejahteraan-detail-row">
              <span>
                Tempat,
                <br />
                Tanggal Lahir
              </span>

              <strong>
                {resolvedData.tempatTanggalLahir ||
                  "-"}
              </strong>
            </div>

            {/* USIA */}

            <div className="kesejahteraan-detail-row">
              <span>
                Usia
              </span>

              <strong>
                {resolvedData.usia || "-"}
              </strong>
            </div>

            {/* JENIS KELAMIN */}

            <div className="kesejahteraan-detail-row">
              <span>
                Jenis Kelamin
              </span>

              <strong>
                {resolvedData.jenisKelamin || "-"}
              </strong>
            </div>

            {/* RW */}

            <div className="kesejahteraan-detail-row">
              <span>
                RW
              </span>

              <strong>
                {resolvedData.rw || "-"}
              </strong>
            </div>

            {/* RT */}

            <div className="kesejahteraan-detail-row">
              <span>
                RT
              </span>

              <strong>
                {resolvedData.rt || "-"}
              </strong>
            </div>

            {/* ALAMAT */}

            <div className="kesejahteraan-detail-row">
              <span>
                Alamat
              </span>

              <strong>
                {resolvedData.alamat || "-"}
              </strong>
            </div>

          </div>
        </div>

        {/* AKSI */}

        <div className="kesejahteraan-detail-actions">

          {/* EDIT */}

          <button
            type="button"
            className="kesejahteraan-edit-button"
            onClick={handleEdit}
          >
            <img
              className="action-icon-img"
              src={editDataIcon}
              alt=""
            />

            Edit Data
          </button>

          {/* HAPUS */}

          <button
            type="button"
            className="kesejahteraan-delete-button"
            onClick={handleDelete}
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

export default DetailKesejahteraan;