function DetailPenduduk({ data, onClose, onEdit, onDelete }) {
  if (!data) {
    return null;
  }

  return (
    <div className="detail-overlay">
      <div className="detail-panel">
        <div className="detail-header">
          <div>
            <h2>Detail Penduduk</h2>
            <p>Informasi lengkap data penduduk</p>
          </div>

          <button
            type="button"
            className="detail-close-button"
            onClick={onClose}
            aria-label="Tutup detail penduduk"
          >
            ×
          </button>
        </div>

        <div className="detail-content">
          <section className="detail-section">
            <div className="detail-section-header">
              <h3>Biodata Penduduk</h3>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <strong>Nama Lengkap</strong>
                <span>{data.nama || "-"}</span>
              </div>

              <div className="detail-item">
                <strong>NIK</strong>
                <span>{data.nik || "-"}</span>
              </div>

              <div className="detail-item">
                <strong>Tempat Lahir</strong>
                <span>{data.tempatLahir || "-"}</span>
              </div>

              <div className="detail-item">
                <strong>Tanggal Lahir</strong>
                <span>{data.tanggalLahir || "-"}</span>
              </div>

              <div className="detail-item">
                <strong>Jenis Kelamin</strong>
                <span>
                  {data.jk === "L"
                    ? "Laki-laki"
                    : data.jk === "P"
                      ? "Perempuan"
                      : "-"}
                </span>
              </div>

              <div className="detail-item">
                <strong>Status Penduduk</strong>
                <span>{data.status || "-"}</span>
              </div>

              <div className="detail-item">
                <strong>RT</strong>
                <span>{data.rt || "-"}</span>
              </div>

              <div className="detail-item">
                <strong>RW</strong>
                <span>{data.rw || "-"}</span>
              </div>

              <div className="detail-item detail-item-full">
                <strong>Alamat</strong>
                <span>{data.alamat || "-"}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="detail-footer">
          <button
            type="button"
            className="detail-edit-button"
            onClick={onEdit}
          >
            Edit Data
          </button>

          <button
            type="button"
            className="detail-delete-button"
            onClick={() => onDelete(data)}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailPenduduk;
