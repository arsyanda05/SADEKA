import { useNavigate } from "react-router-dom";

import editDataIcon from "../assets/editdata.png";
import hapusDataIcon from "../assets/hapusdata.png";


function DetailUMKM({
  data,
  onClose,
  onDelete,
}) {
  const navigate = useNavigate();

  /*
   * Data UMKM berasal dari parent
   * yang mengambil data dari database.
   */
  const resolvedData = data ?? null;

  if (!resolvedData) {
    return null;
  }


  /*
   * ==============================
   * STATUS NIB
   * ==============================
   */

  const hasNib =
    Boolean(
      String(
        resolvedData.nib || ""
      ).trim()
    );


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

    navigate("/umkm");
  };


  /*
   * ==============================
   * EDIT
   * ==============================
   */

  const handleEdit = () => {
    /*
     * Gunakan ID dari database,
     * bukan nomor tabel/dummy.
     */

    if (!resolvedData.id_umkm) {
      console.error(
        "ID UMKM tidak ditemukan:",
        resolvedData
      );

      return;
    }

    navigate(
      `/umkm/${resolvedData.id_umkm}/edit`
    );
  };


  /*
   * ==============================
   * DELETE
   * ==============================
   */

  const handleDelete = () => {
    /*
     * Proses delete diserahkan
     * kepada parent UMKM.
     */

    if (onDelete) {
      onDelete(resolvedData);
      return;
    }

    console.error(
      "Fungsi onDelete belum diberikan ke DetailUMKM."
    );
  };


  /*
   * ==============================
   * RETURN
   * ==============================
   */

  return (
    <div
      className="detail-umkm-overlay"
      onClick={handleClose}
    >
      <aside
        className="detail-umkm-sidebar"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="detail-umkm-header">

          <h2>
            Detail Data UMKM
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


        {/* =================================================
            INFORMASI UTAMA
        ================================================= */}

        <div className="detail-umkm-main-card">

          <div className="detail-umkm-main-top">

            <div>

              <h3>
                {resolvedData.nama_usaha ||
                  "-"}
              </h3>

              <p>
                {resolvedData.pemilik ||
                  "-"}
              </p>

            </div>


            {/* STATUS NIB */}

            <span
              className={
                hasNib
                  ? "detail-umkm-nib-status active"
                  : "detail-umkm-nib-status"
              }
            >
              •{" "}
              {hasNib
                ? "NIB Terdaftar"
                : "Belum Memiliki NIB"}
            </span>

          </div>


          {/* JENIS USAHA */}

          <div className="detail-umkm-type">

            <span>
              {resolvedData.jenis_usaha ||
                "-"}
            </span>

          </div>

        </div>


        {/* =================================================
            DATA USAHA
        ================================================= */}

        <div className="detail-umkm-card">

          <h3>
            Data Usaha
          </h3>


          <div className="detail-umkm-data-list">


            {/* NAMA USAHA */}

            <div className="detail-umkm-row">

              <span>
                Nama Usaha
              </span>

              <strong>
                {resolvedData.nama_usaha ||
                  "-"}
              </strong>

            </div>


            {/* PEMILIK */}

            <div className="detail-umkm-row">

              <span>
                Pemilik
              </span>

              <strong>
                {resolvedData.pemilik ||
                  "-"}
              </strong>

            </div>


            {/* JENIS USAHA */}

            <div className="detail-umkm-row">

              <span>
                Jenis Usaha
              </span>

              <strong>
                {resolvedData.jenis_usaha ||
                  "-"}
              </strong>

            </div>


            {/* NIB */}

            <div className="detail-umkm-row">

              <span>
                NIB
              </span>

              <strong>
                {resolvedData.nib ||
                  "-"}
              </strong>

            </div>


            {/* RW */}

            <div className="detail-umkm-row">

              <span>
                RW
              </span>

              <strong>
                {resolvedData.rw ||
                  "-"}
              </strong>

            </div>


            {/* RT */}

            <div className="detail-umkm-row">

              <span>
                RT
              </span>

              <strong>
                {resolvedData.rt ||
                  "-"}
              </strong>

            </div>


            {/* ALAMAT */}

            <div className="detail-umkm-row detail-umkm-address-row">

              <span>
                Alamat
              </span>

              <strong>
                {resolvedData.alamat ||
                  "-"}
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            ACTION
        ================================================= */}

        <div className="detail-umkm-actions">


          {/* EDIT */}

          <button
            type="button"
            className="detail-umkm-edit-button"
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
            className="detail-umkm-delete-button"
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


export default DetailUMKM;