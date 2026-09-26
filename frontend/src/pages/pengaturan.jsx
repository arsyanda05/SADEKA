import React, { useEffect, useState } from "react";
import SideBar from "./sidebarmenu";
import Header from "./header";
import profileImage from "../assets/foto.png";

const UserIcon = ({ size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
  >
    <circle
      cx="24"
      cy="24"
      r="23"
      fill="#000"
    />

    <circle
      cx="24"
      cy="17"
      r="7"
      fill="#fff"
    />

    <path
      d="M11 39C12.8 31.7 17.3 28 24 28C30.7 28 35.2 31.7 37 39"
      fill="#fff"
    />
  </svg>
);

const SettingsIcon = ({ size = 72 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 72 72"
    fill="none"
  >
    <path
      d="
        M28.8 6
        H43.2
        L45.4 13
        C47.3 13.7 49.1 14.6 50.8 15.7
        L57.4 12.6
        L64.6 22.4
        L59.4 27.2
        C59.8 29.2 60 31.1 60 33
        C60 34.9 59.8 36.8 59.4 38.8
        L64.6 43.6
        L57.4 53.4
        L50.8 50.3
        C49.1 51.4 47.3 52.3 45.4 53
        L43.2 60
        H28.8
        L26.6 53
        C24.7 52.3 22.9 51.4 21.2 50.3
        L14.6 53.4
        L7.4 43.6
        L12.6 38.8
        C12.2 36.8 12 34.9 12 33
        C12 31.1 12.2 29.2 12.6 27.2
        L7.4 22.4
        L14.6 12.6
        L21.2 15.7
        C22.9 14.6 24.7 13.7 26.6 13
        L28.8 6Z
      "
      stroke="#000"
      strokeWidth="3"
      strokeLinejoin="round"
    />

    <circle
      cx="36"
      cy="33"
      r="9"
      stroke="#000"
      strokeWidth="3"
    />
  </svg>
);

const BellIcon = ({ size = 30 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M10 21h4" />
  </svg>
);

const GlobeIcon = ({ size = 35 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    stroke="#000"
    strokeWidth="2.3"
  >
    <circle cx="18" cy="18" r="14" />
    <path d="M4 18H32" />
    <path d="M18 4C22 8 24 13 24 18C24 23 22 28 18 32" />
    <path d="M18 4C14 8 12 13 12 18C12 23 14 28 18 32" />
  </svg>
);

const ChevronDown = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function Pengaturan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(() => {
    return (
      localStorage.getItem("sadeka_profile_photo") ||
      profileImage
    );
  });

  const [profile, setProfile] = useState({
    nama: "Nadia Safira",
    nip: "198205127569835",
    jabatan: "Sekretaris",
    emailDinas: "NadiaSafira.835@kelurahan.go.id",
    emailPribadi: "NadSafiraaa@gmail.com",
    passwordBaru: "",
    konfirmasiPassword: "",
  });

  const [systemSettings, setSystemSettings] = useState({
    notifikasi: true,
    zonaWaktu: "WIB (Waktu Indonesia Barat)",
  });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(
        "sadeka_user"
      );

      if (savedUser) {
        const user = JSON.parse(savedUser);

        setProfile((prev) => ({
          ...prev,

          nama:
            user.nama ||
            user.name ||
            prev.nama,

          nip:
            user.nip ||
            prev.nip,

          jabatan:
            user.jabatan ||
            user.role ||
            prev.jabatan,

          emailDinas:
            user.emailDinas ||
            user.email ||
            prev.emailDinas,

          emailPribadi:
            user.emailPribadi ||
            prev.emailPribadi,
        }));
      }

      const savedPhoto = localStorage.getItem(
        "sadeka_profile_photo"
      );

      if (savedPhoto) {
        setProfilePhoto(savedPhoto);
      }
    } catch (error) {
      console.error(
        "Gagal membaca data profil:",
        error
      );
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSystemChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSystemSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (
      ![
        "image/jpeg",
        "image/png",
      ].includes(file.type)
    ) {
      alert(
        "Foto harus berformat JPG atau PNG."
      );

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(
        "Ukuran foto maksimal 2MB."
      );

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfilePhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    // Validasi password
    if (
      profile.passwordBaru &&
      profile.passwordBaru !==
        profile.konfirmasiPassword
    ) {
      alert(
        "Konfirmasi kata sandi tidak sesuai."
      );

      return;
    }

    try {
      // Ambil user lama dari localStorage
      let existingUser = {};

      const savedUser =
        localStorage.getItem("sadeka_user");

      if (savedUser) {
        existingUser = JSON.parse(savedUser);
      }

      // Gabungkan data lama dengan data profil terbaru
      const updatedUser = {
        ...existingUser,

        nama: profile.nama,

        // Jika sistem lama menggunakan name,
        // kita tetap update agar Header kompatibel.
        name: profile.nama,

        nip: profile.nip,

        jabatan: profile.jabatan,

        emailDinas:
          profile.emailDinas,

        emailPribadi:
          profile.emailPribadi,
      };

      const profileKey = `sadeka_profile_${
        existingUser.username || existingUser.id_user
      }`;

      localStorage.setItem(
        profileKey,
        JSON.stringify({
          nama: profile.nama,
          name: profile.nama,
          nip: profile.nip,
          jabatan: profile.jabatan,
          emailDinas: profile.emailDinas,
          emailPribadi: profile.emailPribadi,
        })
      );

      // Simpan user
      localStorage.setItem(
        "sadeka_user",
        JSON.stringify(updatedUser)
      );

      // Simpan foto jika sudah diubah
      if (
        profilePhoto &&
        profilePhoto !== profileImage
      ) {
        localStorage.setItem(
          "sadeka_profile_photo",
          profilePhoto
        );
      }

      // Beri tahu Header bahwa profil berubah
      window.dispatchEvent(
        new Event("profileUpdated")
      );

      setProfile((prev) => ({
        ...prev,
        passwordBaru: "",
        konfirmasiPassword: "",
      }));

      alert(
        "Perubahan profil berhasil disimpan."
      );
    } catch (error) {
      console.error(
        "Gagal menyimpan profil:",
        error
      );

      alert(
        "Gagal menyimpan perubahan profil."
      );
    }
  };

  const handleSaveSystem = (e) => {
    e.preventDefault();

    try {
      localStorage.setItem(
        "sadeka_system_settings",
        JSON.stringify(systemSettings)
      );

      alert(
        "Pengaturan sistem berhasil disimpan."
      );
    } catch (error) {
      console.error(
        "Gagal menyimpan pengaturan sistem:",
        error
      );

      alert(
        "Gagal menyimpan pengaturan sistem."
      );
    }
  };

  return (
    <div className="pengaturan-page">

      <SideBar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <main className="pengaturan-main">

        <Header
          title="Pengaturan"
          showSearch={false}
          onMenuClick={() =>
            setSidebarOpen((prev) => !prev)
          }
        />

        <section className="pengaturan-content">

          <div className="pengaturan-layout">

            <section className="pengaturan-profile-card">

              <div className="pengaturan-section-title">

                <div className="pengaturan-title-icon">
                  <UserIcon size={48} />
                </div>

                <div>
                  <h2>
                    Profile Pengguna
                  </h2>

                  <p>
                    Informasi Pribadi
                  </p>
                </div>

              </div>

              {/* FOTO PROFIL */}

              <div className="pengaturan-photo-section">

                <div className="pengaturan-photo-box">

                  <img
                    src={profilePhoto}
                    alt={`Foto profil ${profile.nama}`}
                  />

                </div>

                <div className="pengaturan-photo-action">

                  <label
                    htmlFor="profile-photo"
                    className="pengaturan-photo-button"
                  >
                    Ubah Foto
                  </label>

                  <input
                    id="profile-photo"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={
                      handlePhotoChange
                    }
                    hidden
                  />

                  <p>
                    Format : JPG, PNG. Maks 2MB
                  </p>

                </div>

              </div>

              {/* FORM PROFILE */}

              <form
                className="pengaturan-profile-form"
                onSubmit={
                  handleSaveProfile
                }
              >

                <div className="pengaturan-form-row">

                  <div className="pengaturan-form-group">

                    <label htmlFor="nama">
                      Nama Lengkap
                    </label>

                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      value={
                        profile.nama
                      }
                      onChange={
                        handleProfileChange
                      }
                    />

                  </div>

                  <div className="pengaturan-form-group">

                    <label htmlFor="nip">
                      NIP/ID Pegawai
                    </label>

                    <input
                      id="nip"
                      name="nip"
                      type="text"
                      value={
                        profile.nip
                      }
                      onChange={
                        handleProfileChange
                      }
                    />

                  </div>

                </div>

                {/* JABATAN */}

                <div className="pengaturan-form-group full">

                  <label htmlFor="jabatan">
                    Jabatan
                  </label>

                  <input
                    id="jabatan"
                    name="jabatan"
                    type="text"
                    value={
                      profile.jabatan
                    }
                    onChange={
                      handleProfileChange
                    }
                  />

                </div>

                {/* EMAIL DINAS */}

                <div className="pengaturan-form-group full">

                  <label htmlFor="emailDinas">
                    Email Dinas
                  </label>

                  <input
                    id="emailDinas"
                    name="emailDinas"
                    type="email"
                    value={
                      profile.emailDinas
                    }
                    onChange={
                      handleProfileChange
                    }
                  />

                </div>

                {/* EMAIL PRIBADI */}

                <div className="pengaturan-form-group full">

                  <label htmlFor="emailPribadi">
                    Email Pribadi
                  </label>

                  <input
                    id="emailPribadi"
                    name="emailPribadi"
                    type="email"
                    value={
                      profile.emailPribadi
                    }
                    onChange={
                      handleProfileChange
                    }
                  />

                </div>

                {/* BUTTON PROFILE */}

                <div className="pengaturan-profile-actions">

                  <button
                    type="button"
                    className="pengaturan-cancel-button"
                    onClick={() =>
                      window.location.reload()
                    }
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="pengaturan-save-button"
                  >
                    Simpan Perubahan
                  </button>

                </div>

              </form>

            </section>

            <section className="pengaturan-system-card">

              <div className="pengaturan-system-header">

                <div className="pengaturan-system-icon">
                  <SettingsIcon size={72} />
                </div>

                <div>

                  <h2>
                    Pengaturan Sistem
                  </h2>

                  <p>
                    Konfigurasi sistem
                  </p>

                </div>

              </div>

              <form
                className="pengaturan-system-form"
                onSubmit={
                  handleSaveSystem
                }
              >

                {/* NOTIFIKASI */}

                <div className="pengaturan-system-section">

                  <div className="pengaturan-system-heading">

                    <BellIcon size={31} />

                    <h3>
                      Notifikasi
                    </h3>

                  </div>

                  <div className="pengaturan-notification-setting">

                    <div>

                      <label>
                        Pengingat Agenda
                      </label>

                      <p>
                        Popup untuk pengingat
                        <br />
                        agenda di waktu terdekat
                      </p>

                    </div>

                    <label className="pengaturan-switch">

                      <input
                        type="checkbox"
                        name="notifikasi"
                        checked={
                          systemSettings.notifikasi
                        }
                        onChange={
                          handleSystemChange
                        }
                      />

                      <span className="pengaturan-slider">

                        <span className="pengaturan-slider-circle" />

                      </span>

                    </label>

                  </div>

                </div>

                {/* LOKASI */}

                <div className="pengaturan-location-section">

                  <div className="pengaturan-location-title">

                    <GlobeIcon size={35} />

                    <h3>
                      Lokasi
                    </h3>

                  </div>

                  <label
                    htmlFor="zonaWaktu"
                    className="pengaturan-location-label"
                  >
                    Zona Waktu
                  </label>

                  <div className="pengaturan-select-wrapper">

                    <select
                      id="zonaWaktu"
                      name="zonaWaktu"
                      value={
                        systemSettings.zonaWaktu
                      }
                      onChange={
                        handleSystemChange
                      }
                    >

                      <option>
                        WIB (Waktu Indonesia Barat)
                      </option>

                      <option>
                        WITA (Waktu Indonesia Tengah)
                      </option>

                      <option>
                        WIT (Waktu Indonesia Timur)
                      </option>

                    </select>

                    <span className="pengaturan-select-icon">
                      <ChevronDown />
                    </span>

                  </div>

                </div>

                <button
                  type="submit"
                  className="pengaturan-system-save"
                >
                  Simpan Pengaturan
                </button>

              </form>

            </section>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Pengaturan;