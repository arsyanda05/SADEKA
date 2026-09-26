import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header";
import backIcon from "../assets/back.png";
import simpanIcon from "../assets/simpan.png";
import simpanDataIcon from "../assets/simpandata.png";

import {
  createAgenda,
  updateAgenda,
} from "../services/api.js";

function TambahAgenda() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const editingAgenda = state?.agenda;

  const [formData, setFormData] = useState(() => ({
    kegiatan: "",
    kategori: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    pic: "",
    notifikasi: true,
    popup: true,

    ...(editingAgenda
      ? {
          kegiatan: editingAgenda.kegiatan,

          kategori: editingAgenda.kategori,

          tanggal: editingAgenda.tanggal
            .split("/")
            .reverse()
            .join("-"),

          waktuMulai: editingAgenda.jam
            ? editingAgenda.jam
                .split("-")[0]
                .replace(".", ":")
                .trim()
            : "",

          waktuSelesai: editingAgenda.jam
            ? editingAgenda.jam
                .split("-")[1]
                ?.replace(".", ":")
                .trim() || ""
            : "",

          pic: editingAgenda.pic,
        }
      : {}),
  }));

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
  };

  // =========================
  // SUBMIT AGENDA
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");

    // Validasi waktu
    if (
      formData.waktuMulai &&
      formData.waktuSelesai &&
      formData.waktuMulai >=
        formData.waktuSelesai
    ) {
      setError(
        "Waktu selesai harus lebih besar dari waktu mulai."
      );

      return;
    }

    try {
      setSaving(true);

      // Gabungkan waktu mulai dan selesai
      //
      // Contoh:
      // 07:00 + 09:00
      // menjadi:
      // 07:00-09:00

      const jam =
        `${formData.waktuMulai}-${formData.waktuSelesai}`;

      const dataAgenda = {
        tanggal: formData.tanggal,

        jam,

        kegiatan: formData.kegiatan,

        PIC: formData.pic,

        kategori: formData.kategori,

        // H-1 = 1440 menit
        pengingat_menit: 1440,
      };

      // =========================
      // MODE EDIT
      // =========================

      if (editingAgenda) {
        await updateAgenda(
          editingAgenda.id_agenda,
          dataAgenda
        );

        alert(
          "Agenda berhasil diperbarui!"
        );
      }

      // =========================
      // MODE TAMBAH
      // =========================

      else {
        await createAgenda(
          dataAgenda
        );

        alert(
          "Agenda berhasil dijadwalkan!"
        );
      }

      // Kembali ke halaman Agenda
      navigate("/agenda");

    } catch (error) {
      console.error(
        "Error menyimpan agenda:",
        error
      );

      setError(
        error.message ||
          "Gagal menyimpan agenda."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // SIMPAN DRAFT
  // =========================

  const handleDraft = () => {
    alert(
      "Fitur Simpan Draft belum terhubung ke database."
    );
  };

  return (
    <div className="tambah-agenda-page">

      <Header
        title={
          editingAgenda
            ? "Edit Agenda"
            : "Tambah Agenda"
        }
        showSearch={false}
      />

      <main className="tambah-agenda-content">

        <div className="tambah-agenda-back-wrapper">

          <button
            type="button"
            className="tambah-agenda-back-button"
            onClick={() =>
              navigate("/agenda")
            }
          >
            <img
              src={backIcon}
              alt=""
            />

            Kembali ke Agenda
          </button>

        </div>

        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}

        <form
          className="tambah-agenda-form"
          onSubmit={handleSubmit}
        >

          <div className="tambah-agenda-layout">

            {/* =========================
                INFORMASI AGENDA
            ========================= */}

            <section className="tambah-agenda-card agenda-information-card">

              <div className="tambah-agenda-card-heading">

                <h2>
                  Informasi Agenda
                </h2>

                <span>
                  Wajib diisi
                </span>

              </div>

              <div className="tambah-agenda-fields">

                {/* KEGIATAN */}

                <div className="tambah-agenda-field kegiatan-field">

                  <label htmlFor="kegiatan">
                    Kegiatan yang akan dilaksanakan
                  </label>

                  <input
                    id="kegiatan"
                    name="kegiatan"
                    placeholder="Masukkan Kegiatan disini"
                    value={
                      formData.kegiatan
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                {/* KATEGORI */}

                <div className="tambah-agenda-field kategori-field">

                  <label htmlFor="kategori">
                    Pilih Kategori
                  </label>

                  <select
                    id="kategori"
                    name="kategori"
                    value={
                      formData.kategori
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >

                    <option
                      value=""
                      disabled
                      hidden
                    >
                      Pilih Kategori disini
                    </option>

                    <option value="Kelurahan">
                      Kelurahan
                    </option>

                    <option value="PKK">
                      PKK
                    </option>

                  </select>

                </div>

                {/* TANGGAL */}

                <div className="tambah-agenda-field tanggal-field">

                  <label htmlFor="tanggal">
                    Tanggal Acara
                  </label>

                  <input
                    id="tanggal"
                    name="tanggal"
                    type="date"
                    value={
                      formData.tanggal
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                {/* WAKTU MULAI */}

                <div className="tambah-agenda-field waktu-field">

                  <label htmlFor="waktuMulai">
                    Waktu Mulai
                  </label>

                  <input
                    id="waktuMulai"
                    name="waktuMulai"
                    type="time"
                    value={
                      formData.waktuMulai
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                {/* WAKTU SELESAI */}

                <div className="tambah-agenda-field waktu-field">

                  <label htmlFor="waktuSelesai">
                    Waktu Selesai
                  </label>

                  <input
                    id="waktuSelesai"
                    name="waktuSelesai"
                    type="time"
                    value={
                      formData.waktuSelesai
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                {/* PIC */}

                <div className="tambah-agenda-field pic-field">

                  <label htmlFor="pic">
                    PIC
                  </label>

                  <input
                    id="pic"
                    name="pic"
                    placeholder="Masukkan Nama PIC disini"
                    value={
                      formData.pic
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>

            </section>

            {/* =========================
                PENGINGAT AGENDA
            ========================= */}

            <section className="tambah-agenda-card agenda-reminder-card">

              <h2>
                Pengingat Agenda
              </h2>

              <div className="agenda-reminder-setting">

                <label htmlFor="notifikasi">
                  Aktifkan Notifikasi Sistem
                </label>

                <label className="agenda-switch">

                  <input
                    id="notifikasi"
                    name="notifikasi"
                    type="checkbox"
                    checked={
                      formData.notifikasi
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span />

                </label>

              </div>

              <label className="agenda-popup-setting">

                <input
                  name="popup"
                  type="checkbox"
                  checked={
                    formData.popup
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>

                  <strong>
                    Pop Up Sistem
                  </strong>

                  <small>
                    Muncul di desktop pengguna
                    <br />
                    sebelum H-1 kegiatan dimulai
                  </small>

                </span>

              </label>

            </section>

          </div>

          {/* =========================
              STATUS BAR
          ========================= */}

          <section className="tambah-agenda-status-bar">

            <div>

              <strong>
                Status Kelengkapan :{" "}
                <b>
                  Siap Dijadwalkan
                </b>
              </strong>

              <small>
                Data tervalidasi oleh Sistem SADEKA
              </small>

            </div>

            <span>
              Terisi 100%
            </span>

            <button
              type="button"
              className="tambah-agenda-draft-button"
              onClick={
                handleDraft
              }
              disabled={saving}
            >

              <img
                src={simpanIcon}
                alt=""
              />

              Simpan Draft

            </button>

            <button
              type="submit"
              className="tambah-agenda-save-button"
              disabled={saving}
            >

              <img
                src={simpanDataIcon}
                alt=""
              />

              {saving
                ? "Menyimpan..."
                : editingAgenda
                ? "Simpan Perubahan"
                : "Jadwalkan Agenda Sekarang"}

            </button>

          </section>

        </form>

      </main>

    </div>
  );
}

export default TambahAgenda;
