import React, { useEffect, useState } from "react";

function Header({
  title,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  onMenuClick,
}) {
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const savedUser = localStorage.getItem("sadeka_user");

      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.error("Gagal membaca data user:", error);
    }

    return null;
  });

  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem("sadeka_profile_photo") || null;
  });

  useEffect(() => {
    const handleProfileUpdated = () => {
      try {
        const savedUser = localStorage.getItem("sadeka_user");

        if (savedUser) {
          setUserProfile(JSON.parse(savedUser));
        } else {
          setUserProfile(null);
        }

        const savedPhoto = localStorage.getItem(
          "sadeka_profile_photo"
        );

        setProfilePhoto(savedPhoto || null);
      } catch (error) {
        console.error(
          "Gagal memperbarui data profil:",
          error
        );
      }
    };

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdated
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdated
      );
    };
  }, []);

  const namaUser =
    userProfile?.nama ||
    userProfile?.name ||
    "Nadia Safira";

  const jabatanUser =
    userProfile?.jabatan ||
    userProfile?.role ||
    "Sekretaris";

  const getInitials = (nama) => {
    if (!nama) return "N";

    const words = nama.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(namaUser);

  return (
    <header className="global-header">
      <div className="global-header-left">
        <button
          type="button"
          className="global-menu-button"
          onClick={onMenuClick}
          aria-label="Buka menu"
        >
          ☰
        </button>

        <h1>{title}</h1>
      </div>

      {showSearch && (
        <div className="global-search">
          <span aria-hidden="true">⌕</span>

          <input
            type="text"
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Cari...."
            aria-label={`Cari ${title}`}
          />
        </div>
      )}

      <div className="global-header-right">
        
        <div className="global-user-info">
          <div className="global-user-avatar">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={`Foto profil ${namaUser}`}
              />
            ) : (
              initials
            )}
          </div>

          <div className="global-user-text">
            <strong>{namaUser}</strong>

            <span>{jabatanUser}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
