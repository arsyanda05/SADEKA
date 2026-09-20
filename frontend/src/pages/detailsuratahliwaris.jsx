import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import pdfIcon from "../assets/pdf.png";

const fallbackData = [
  {
    no: "200",
    nomorSurat: "474.3/012/IX/2026",
    ahliWaris: "Hariadi",
    nik: "3530110702060001",
    pewaris: "Supriyono",
    hubungan: "Orang Tua",
    tanggalPengajuan: "09/09/2026",
    tanggalSelesai: "-",
    tahap: "Diterima oleh Kelurahan",
    file: "SAW Hariadi.pdf",
    nama: "Hariadi",
    tempatTanggalLahir: "Surabaya, 13 April 1995",
    jenisKelamin: "Laki-laki",
    rw: "01",
    rt: "02",
    alamat:
      "Jl. Manukan Asri No.I-A, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "199",
    nomorSurat: "474.3/012/IX/2026",
    ahliWaris: "Bambang",
    nik: "3530111502060003",
    pewaris: "Supriyono",
    hubungan: "Orang Tua",
    tanggalPengajuan: "07/09/2026",
    tanggalSelesai: "-",
    tahap: "Tanda Tangan Sekretaris",
    file: "SAW Bambang.pdf",
    nama: "Bambang",
    tempatTanggalLahir: "Surabaya, 10 Januari 1994",
    jenisKelamin: "Laki-laki",
    rw: "03",
    rt: "16",
    alamat:
      "Jl. Manukan Asri No. 16, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
  {
    no: "198",
    nomorSurat: "474.3/012/IX/2026",
    ahliWaris: "Rini",
    nik: "3210113502060003",
    pewaris: "Supriyono",
    hubungan: "Orang Tua",
    tanggalPengajuan: "05/09/2026",
    tanggalSelesai: "-",
    tahap: "Diproses Kecamatan",
    file: "SAW Rini.pdf",
    nama: "Rini",
    tempatTanggalLahir: "Surabaya, 13 April 1995",
    jenisKelamin: "Perempuan",
    rw: "01",
    rt: "02",
    alamat:
      "Jl. Manukan Asri No.I-A, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
  },
];

function DetailSuratAhliWaris({ data, onClose }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const resolvedData =
    data ?? fallbackData.find((item) => item.no === id) ?? fallbackData[2];

  const handleBack = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/surat-ahli-waris");
  };

  return (
    <div className="detail-saw-page">

      {/* ================= HEADER ================= */}

      <Header title="Surat Ahli Waris" showSearch={false} />

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

            {/* INFORMASI PENGAJUAN */}

            <section className="detail-saw-card">

              <h2>Informasi Pengajuan</h2>

              <div className="detail-saw-data">

                <div className="detail-saw-row">
                  <span>Ahli Waris</span>
                  <strong>{resolvedData.ahliWaris}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>NIK</span>
                  <strong>{resolvedData.nik}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>Pewaris</span>
                  <strong>{resolvedData.pewaris}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>Hubungan</span>
                  <strong>{resolvedData.hubungan}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>Tanggal Pengajuan</span>
                  <strong>{resolvedData.tanggalPengajuan}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>Tanggal Selesai</span>
                  <strong>{resolvedData.tanggalSelesai}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>Tahap</span>

                  <strong className="detail-saw-stage">
                    {resolvedData.tahap}
                  </strong>
                </div>

                <div className="detail-saw-row">
                  <span>Berkas</span>

                  <button
                    type="button"
                    className="detail-saw-file"
                  >
                    <img className="pdf-icon-img" src={pdfIcon} alt="" />
                    {resolvedData.file}
                  </button>
                </div>

              </div>

            </section>

            {/* DATA AHLI WARIS */}

            <section className="detail-saw-card detail-saw-person-card">

              <h2>Data Ahli Waris</h2>

              <div className="detail-saw-data">

                <div className="detail-saw-row">
                  <span>Nama</span>
                  <strong>{resolvedData.nama}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>NIK</span>
                  <strong>{resolvedData.nik}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>Tempat, Tanggal Lahir</span>
                  <strong>{resolvedData.tempatTanggalLahir}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>Jenis Kelamin</span>
                  <strong>{resolvedData.jenisKelamin}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>RW</span>
                  <strong>{resolvedData.rw}</strong>
                </div>

                <div className="detail-saw-row">
                  <span>RT</span>
                  <strong>{resolvedData.rt}</strong>
                </div>

                <div className="detail-saw-row detail-saw-address">
                  <span>Alamat</span>

                  <strong>
                    {resolvedData.alamat}
                  </strong>
                </div>

              </div>

            </section>

          </div>

          {/* ================= KOLOM KANAN ================= */}

          <section className="detail-saw-tracking">

            <h2>Tracking Surat Ahli Waris</h2>

            <div className="tracking-list">

              {/* STATUS 1 */}

              <div className="tracking-item completed">

                <div className="tracking-line"></div>

                <div className="tracking-circle">
                  ✓
                </div>

                <div className="tracking-content">

                  <h3>Diterima oleh Kelurahan</h3>

                  <p className="tracking-date">
                    05/09/2026 | 11:23
                  </p>

                  <p className="tracking-description">
                    Berkas diterima dan diverifikasi petugas
                    pelayanan.
                  </p>

                </div>

              </div>

              {/* STATUS 2 */}

              <div className="tracking-item completed">

                <div className="tracking-line"></div>

                <div className="tracking-circle">
                  ✓
                </div>

                <div className="tracking-content">

                  <h3>Tanda Tangan Sekretaris</h3>

                  <p className="tracking-date">
                    06/09/2026 | 09:23
                  </p>

                  <p className="tracking-description">
                    Berkas diajukan kepada sekretaris untuk
                    mendapatkan tanda tangan.
                  </p>

                </div>

              </div>

              {/* STATUS 3 */}

              <div className="tracking-item active">

                <div className="tracking-line"></div>

                <div className="tracking-circle">
                  3
                </div>

                <div className="tracking-content">

                  <h3>Diproses Kecamatan</h3>

                  <p className="tracking-date">
                    08/09/2026 | 12:03
                  </p>

                  <p className="tracking-description">
                    Berkas dikirim ke kecamatan untuk diproses
                    lebih lanjut.
                  </p>

                </div>

              </div>

              {/* STATUS 4 */}

              <div className="tracking-item last">

                <div className="tracking-circle pending">4</div>

                <div className="tracking-content">

                  <h3>Selesai</h3>

                  <p className="tracking-description">
                    Berkas dikembalikan ke kelurahan setelah
                    proses di kecamatan selesai.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default DetailSuratAhliWaris;