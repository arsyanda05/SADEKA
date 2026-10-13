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





  const resolvedData = data ?? null;

  if (!resolvedData) {
    return null;
  }







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







  const handleDelete = () => {









    if (onDelete) {
      onDelete(resolvedData);
      return;
    }





    console.error(
      "Fungsi onDelete belum diberikan ke DetailKesejahteraan."
    );
  };







  return (
    <div
      className="kesejahteraan-detail-overlay"
      onClick={handleClose}
    >
      <aside
        className="kesejahteraan-detail-sidebar"
        onClick={(e) => e.stopPropagation()}
      >


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



        <div className="kesejahteraan-detail-card">
          <h3>
            Keterangan
          </h3>

          <p className="kesejahteraan-detail-description">
            {resolvedData.keterangan || "-"}
          </p>
        </div>



        <div className="kesejahteraan-detail-card detail-penduduk-card">
          <h3>
            Data Penduduk
          </h3>

          <div className="kesejahteraan-detail-data-list">



            <div className="kesejahteraan-detail-row">
              <span>
                Nama
              </span>

              <strong>
                {resolvedData.nama || "-"}
              </strong>
            </div>



            <div className="kesejahteraan-detail-row">
              <span>
                NIK
              </span>

              <strong>
                {resolvedData.nik || "-"}
              </strong>
            </div>



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



            <div className="kesejahteraan-detail-row">
              <span>
                Usia
              </span>

              <strong>
                {resolvedData.usia || "-"}
              </strong>
            </div>



            <div className="kesejahteraan-detail-row">
              <span>
                Jenis Kelamin
              </span>

              <strong>
                {resolvedData.jenisKelamin || "-"}
              </strong>
            </div>



            <div className="kesejahteraan-detail-row">
              <span>
                RW
              </span>

              <strong>
                {resolvedData.rw || "-"}
              </strong>
            </div>



            <div className="kesejahteraan-detail-row">
              <span>
                RT
              </span>

              <strong>
                {resolvedData.rt || "-"}
              </strong>
            </div>



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



        <div className="kesejahteraan-detail-actions">



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