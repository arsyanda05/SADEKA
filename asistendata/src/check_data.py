import sys
from pathlib import Path


# ============================================================
# SETUP PATH
# ============================================================

if __package__ in (None, ""):
    repo_root = Path(__file__).resolve().parents[2]
    app_root = Path(__file__).resolve().parents[1]

    for candidate in (str(repo_root), str(app_root)):
        if candidate not in sys.path:
            sys.path.insert(0, candidate)


# ============================================================
# IMPORT DATABASE
# ============================================================

try:
    from src.database import execute_query
except ModuleNotFoundError:
    from database import execute_query


# ============================================================
# FUNGSI TEST
# ============================================================

def run_query(judul, query):

    print()
    print("=" * 70)
    print(judul)
    print("=" * 70)

    columns, rows, error = execute_query(
        query,
        []
    )

    if error:

        print()
        print("STATUS : GAGAL")
        print("ERROR  :", error)

        return

    print()
    print("COLUMNS:")
    print(columns)

    print()
    print("ROWS:")

    if not rows:
        print("(tidak ada data)")
    else:
        for row in rows:
            print(row)


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 70)
    print("              CEK DATA POSTGRESQL SADEKA")
    print("=" * 70)


    # ========================================================
    # 1. DATA PENDUDUK
    # ========================================================

    run_query(
        "DATA PENDUDUK",
        """
        SELECT
            id_penduduk,
            nama,
            nik,
            rt,
            rw,
            jenis_kelamin,
            status_penduduk
        FROM penduduk
        ORDER BY id_penduduk;
        """
    )


    # ========================================================
    # 2. DAFTAR RW
    # ========================================================

    run_query(
        "DAFTAR RW",
        """
        SELECT
            rw,
            COUNT(*) AS jumlah
        FROM penduduk
        GROUP BY rw
        ORDER BY rw;
        """
    )


    # ========================================================
    # 3. DATA KESEJAHTERAAN
    # ========================================================

    run_query(
        "DATA KESEJAHTERAAN",
        """
        SELECT
            k.id_kesejahteraan,
            p.nama,
            p.rt,
            p.rw,
            k.kategori,
            k.status,
            k.keterangan
        FROM kesejahteraan k
        JOIN penduduk p
            ON k.id_penduduk = p.id_penduduk
        ORDER BY k.id_kesejahteraan;
        """
    )


    # ========================================================
    # 4. DATA INFRASTRUKTUR
    # ========================================================

    run_query(
        "DATA INFRASTRUKTUR",
        """
        SELECT
            id_infrastruktur,
            jenis,
            alamat,
            kondisi_status,
            rt,
            rw,
            penanggung_jawab
        FROM infrastruktur
        ORDER BY id_infrastruktur;
        """
    )


    # ========================================================
    # 5. DATA UMKM
    # ========================================================

    run_query(
        "DATA UMKM",
        """
        SELECT
            id_umkm,
            nama_usaha,
            pemilik,
            jenis_usaha,
            rt,
            rw
        FROM "uMKM"
        ORDER BY id_umkm;
        """
    )


    # ========================================================
    # 6. DATA PEGAWAI
    # ========================================================

    run_query(
        "DATA PEGAWAI",
        """
        SELECT
            id_pegawai,
            nama,
            "NIP",
            jabatan,
            status,
            no_telepon
        FROM pegawai
        ORDER BY id_pegawai;
        """
    )


    # ========================================================
    # 7. DATA AGENDA
    # ========================================================

    run_query(
        "DATA AGENDA",
        """
        SELECT
            id_agenda,
            tanggal,
            jam,
            kegiatan,
            "PIC",
            kategori
        FROM agenda
        ORDER BY tanggal, jam;
        """
    )


    print()
    print("=" * 70)
    print("                    SELESAI")
    print("=" * 70)