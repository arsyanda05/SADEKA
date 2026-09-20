function Header({
  title,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  onMenuClick,
}) {
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
        <button
          type="button"
          className="notification-button"
          aria-label="Notifikasi"
        />

        <div className="global-user-info">
          <div className="global-user-avatar" aria-hidden="true">
            N
          </div>

          <div className="global-user-text">
            <strong>Nadia S</strong>
            <span>Sekretaris</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
