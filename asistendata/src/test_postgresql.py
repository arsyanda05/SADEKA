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
# IMPORT
# ============================================================

try:
    from src.query_builder import build_query
    from src.database import execute_query

except ModuleNotFoundError:

    from query_builder import build_query
    from database import execute_query


# ============================================================
# TEST
# ============================================================

def test_query(intent, parameters):

    print()
    print("=" * 60)
    print(f"TEST INTENT : {intent}")
    print(f"PARAMETER   : {parameters}")
    print("=" * 60)


    # --------------------------------------------------------
    # BUILD QUERY
    # --------------------------------------------------------

    query, params = build_query(
        intent,
        parameters
    )


    if query is None:

        print("Query       : None")
        print("Status      : Intent tidak memiliki query")

        return


    print()
    print("SQL:")
    print(query)

    print()
    print("Values:")
    print(params)


    # --------------------------------------------------------
    # EXECUTE DATABASE
    # --------------------------------------------------------

    columns, rows, error = execute_query(
        query,
        params
    )


    # --------------------------------------------------------
    # HASIL
    # --------------------------------------------------------

    if error:

        print()
        print("STATUS      : GAGAL")
        print("ERROR       :", error)

        return


    print()
    print("STATUS      : BERHASIL")

    print()
    print("COLUMNS:")
    print(columns)

    print()
    print("ROWS:")

    for row in rows:
        print(row)


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 60)
    print("     TEST QUERY BUILDER + POSTGRESQL SADEKA")
    print("=" * 60)


    # ========================================================
    # 1. JUMLAH PENDUDUK
    # ========================================================

    test_query(
        "jumlah_penduduk",
        {}
    )


    # ========================================================
    # 2. PENDUDUK BERDASARKAN RW
    # ========================================================

    test_query(
        "jumlah_penduduk",
        {
            "rw": "05"
        }
    )


    # ========================================================
    # 3. DATA PENDUDUK
    # ========================================================

    test_query(
        "data_penduduk",
        {
            "rw": "05"
        }
    )


    # ========================================================
    # 4. DATA KESEJAHTERAAN
    # ========================================================

    test_query(
        "data_kesejahteraan",
        {
            "rw": "07",
            "kategori_kesejahteraan": "Stunting"
        }
    )


    # ========================================================
    # 5. DATA INFRASTRUKTUR
    # ========================================================

    test_query(
        "data_infrastruktur",
        {
            "rw": "03"
        }
    )


    print()
    print("=" * 60)
    print("              SEMUA TEST SELESAI")
    print("=" * 60)