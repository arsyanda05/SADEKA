import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { updatePenduduk } from "../services/api";

import Header from "./header";
import backIcon from "../assets/back.png";
import hapusSampahIcon from "../assets/hapussampah.png";
import simpanDataIcon from "../assets/simpandata.png";

const emptyFormData = {
  nik: "",
  nama: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  alamat: "",
  rt: "",
  rw: "",
  status: "",
};

const monthNames = {
  Januari: "01",
  Februari: "02",
  Maret: "03",
  April: "04",
  Mei: "05",
  Juni: "06",
  Juli: "07",
  Agustus: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Desember: "12",
};

const toDateInputValue = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  // Jika sudah dalam format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  // Jika berupa tanggal ISO dari PostgreSQL
  if (typeof dateValue === "string" && dateValue.includes("T")) {
    return dateValue.split("T")[0];
  }

  // Jika berupa format seperti:
  // 01 Januari 2001
  const [day, month, year] = dateValue.split(" ");
  const monthNumber = monthNames[month];

  return day && monthNumber && year
    ? `${year}-${monthNumber}-${day.padStart(2, "0")}`
    : "";
};

const mapPendudukToForm = (penduduk) => {
  let jenisKelamin =
    penduduk?.jk ||
    penduduk?.jenisKelamin ||
    "";

  // Menyesuaikan data dengan value dropdown
  if (jenisKelamin === "Laki-laki") {
    jenisKelamin = "L";
  }

  if (jenisKelamin === "Perempuan") {
    jenisKelamin = "P";
  }

  return {
    nik: penduduk?.nik || "",
    nama: penduduk?.nama || "",
    tempatLahir: penduduk?.tempatLahir || "",
    tanggalLahir: toDateInputValue(
      penduduk?.tanggalLahir
    ),
    jenisKelamin,
    alamat: penduduk?.alamat || "",
    rt: penduduk?.rt || "",
    rw: penduduk?.rw || "",
    status: penduduk?.status || "",
  };
};

function EditPenduduk() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [formData, setFormData] = useState(() =>
    state?.penduduk
      ? mapPendudukToForm(state.penduduk)
      : emptyFormData
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==============================
  // SIMPAN PERUBAHAN DATA
  // ==============================
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const id = state?.penduduk?.id;

      if (!id) {
        alert("ID penduduk tidak ditemukan.");
        return;
      }

      const data = {
        nik: formData.nik,
        nama: formData.nama,
        tempat_lahir: formData.tempatLahir,
        tanggal_lahir: formData.tanggalLahir,
        jenis_kelamin:
          formData.jenisKelamin === "L"
            ? "Laki-laki"
            : formData.jenisKelamin === "P"
              ? "Perempuan"
              : formData.jenisKelamin,
        alamat: formData.alamat,
        rt: formData.rt,
        rw: formData.rw,
        status_penduduk: formData.status,
      };

      console.log("Data yang dikirim:", data);

      await updatePenduduk(id, data);

      alert("Data penduduk berhasil diperbarui!");

      navigate("/data-penduduk");
    } catch (error) {
      console.error(
        "Gagal memperbarui data penduduk:",
        error
      );

      alert("Gagal memperbarui data penduduk.");
    }
  };

  // ==============================
  // HAPUS DATA
  // ==============================
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Hapus data penduduk ${formData.nama || "ini"}?`
    );

    if (confirmed) {
      navigate("/data-penduduk");
    }
  };

  return (
    <div className="tambah-penduduk-page edit-penduduk-page">
      <Header
        title="Edit Penduduk"
        showSearch={false}
      />

      <main className="tambah-penduduk-content">

        {/* TOMBOL KEMBALI */}
        <div className="tambah-penduduk-back-wrapper">
          <button
            type="button"
            className="tambah-penduduk-back-button"
            onClick={() =>
              navigate("/data-penduduk")
            }
          >
            <img
              className="tambah-penduduk-back-icon"
              src={backIcon}
              alt=""
            />

            Kembali ke Data Penduduk
          </button>
        </div>

        {/* FORM EDIT */}
        <form
          className="tambah-penduduk-form"
          onSubmit={handleSubmit}
        >
          <section className="tambah-penduduk-card">

            <div className="tambah-penduduk-card-title">
              <h2>Informasi Data Penduduk</h2>
            </div>

            <div className="tambah-penduduk-form-grid">

              {/* NIK */}
              <div className="tambah-penduduk-form-group">
                <label htmlFor="nik">
                  NIK (Nomor Induk Kependudukan)
                </label>

                <input
                  id="nik"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* NAMA */}
              <div className="tambah-penduduk-form-group">
                <label htmlFor="nama">
                  Nama Lengkap
                </label>

                <input
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* TEMPAT LAHIR */}
              <div className="tambah-penduduk-form-group">
                <label htmlFor="tempatLahir">
                  Tempat Lahir
                </label>

                <input
                  id="tempatLahir"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* TANGGAL LAHIR */}
              <div className="tambah-penduduk-form-group">
                <label htmlFor="tanggalLahir">
                  Tanggal Lahir
                </label>

                <input
                  id="tanggalLahir"
                  name="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* JENIS KELAMIN */}
              <div className="tambah-penduduk-form-group">
                <label htmlFor="jenisKelamin">
                  Jenis Kelamin
                </label>

                <select
                  id="jenisKelamin"
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={handleChange}
                  required
                >
                  <option
                    value=""
                    disabled
                    hidden
                  >
                    Pilih Jenis Kelamin
                  </option>

                  <option value="L">
                    Laki-laki
                  </option>

                  <option value="P">
                    Perempuan
                  </option>
                </select>
              </div>

              {/* ALAMAT */}
              <div className="tambah-penduduk-form-group tambah-penduduk-full-width">
                <label htmlFor="alamat">
                  Alamat Domisili
                </label>

                <textarea
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* RT */}
              <div className="tambah-penduduk-form-group tambah-penduduk-small-field">
                <label htmlFor="rt">
                  RT
                </label>

                <input
                  id="rt"
                  name="rt"
                  value={formData.rt}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* RW */}
              <div className="tambah-penduduk-form-group tambah-penduduk-small-field">
                <label htmlFor="rw">
                  RW
                </label>

                <input
                  id="rw"
                  name="rw"
                  value={formData.rw}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* STATUS */}
              <div className="tambah-penduduk-form-group tambah-penduduk-status-field">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option
                    value=""
                    disabled
                    hidden
                  >
                    Pilih Status
                  </option>

                  <option value="Tetap">
                    Tetap
                  </option>

                  <option value="Sementara">
                    Sementara
                  </option>

                  <option value="Meninggal">
                    Meninggal
                  </option>

                  <option value="Pindah">
                    Pindah
                  </option>
                </select>
              </div>

            </div>
          </section>

          {/* STATUS PENGISIAN DAN TOMBOL */}
          <section className="edit-penduduk-form-status">

            <div>
              <strong>
                Status Pengisian : Form Siap Disimpan
              </strong>

              <span>
                Data tervalidasi oleh Sistem SADEKA
              </span>
            </div>

            <b>
              Terisi 100%
            </b>

            {/* HAPUS */}
            <button
              type="button"
              className="edit-penduduk-delete-button"
              onClick={handleDelete}
            >
              <img
                src={hapusSampahIcon}
                alt=""
              />

              Hapus Data Penduduk
            </button>

            {/* SIMPAN */}
            <button
              type="submit"
              className="edit-penduduk-save-button"
            >
              <img
                src={simpanDataIcon}
                alt=""
              />

              Simpan Data Penduduk
            </button>

          </section>
        </form>
      </main>
    </div>
  );
}

export default EditPenduduk;