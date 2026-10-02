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
# IMPORT MAPPING
# ============================================================

try:
    if __package__:
        from .mapping import INTENT_MAPPING
    else:
        from src.mapping import INTENT_MAPPING

except ModuleNotFoundError:

    try:
        from mapping import INTENT_MAPPING

    except ModuleNotFoundError:
        raise


# ============================================================
# QUERY BUILDER
# ============================================================

def build_query(intent, parameters, count_only=False):
    """
    Membuat SQL query berdasarkan intent dan parameter.

    Query dibuat dalam bentuk PARAMETERIZED QUERY.

    PostgreSQL + psycopg2 menggunakan placeholder:
        %s

    Nilai parameter dikirim terpisah melalui list `params`.

    Contoh:

        query:
            SELECT *
            FROM penduduk
            WHERE rw = %s;

        params:
            ["05"]

    Cara ini digunakan untuk mencegah SQL Injection.

    Return:
        (query: str | None, params: list)

    Jika intent tidak dikenali:
        (None, [])
    """

    # ========================================================
    # VALIDASI INTENT
    # ========================================================

    if intent not in INTENT_MAPPING:
        return None, []


    # ========================================================
    # AMBIL MAPPING
    # ========================================================

    mapping = INTENT_MAPPING[intent]

    table = mapping["table"]

    alias = mapping.get("alias")

    join_clause = mapping.get("join", "")

    like_params = mapping.get("like_params", [])


    # ========================================================
    # SELECT + FROM
    # ========================================================

    if intent == "jumlah_rw":

        select_clause = """
SELECT COUNT(DISTINCT p.rw) AS jumlah
""".strip()

        from_clause = """
FROM penduduk p
""".strip()


    elif intent == "jumlah_rt":

        select_clause = """
SELECT COUNT(*) AS jumlah
""".strip()

        from_clause = """
FROM (
    SELECT DISTINCT
        p.rw,
        p.rt
    FROM penduduk p
) AS rt_data
""".strip()


    elif count_only:

        select_clause = """
SELECT COUNT(*) AS jumlah
""".strip()

        from_clause = (
            f"FROM {table}"
            + (f" {alias}" if alias else "")
        )


    elif intent == "jumlah_penduduk":

        select_clause = """
SELECT COUNT(*) AS jumlah
""".strip()

        from_clause = (
            f"FROM {table}"
            + (f" {alias}" if alias else "")
        )


    else:

        select_clause = (
            "SELECT "
            + ", ".join(mapping["columns"])
        )

        from_clause = (
            f"FROM {table}"
            + (f" {alias}" if alias else "")
        )


    # ========================================================
    # WHERE CLAUSE
    # ========================================================

    where_parts = []

    params = []


    for param_name, column in mapping.get(
        "param_columns",
        {}
    ).items():

        # ----------------------------------------------------
        # Parameter tersedia?
        # ----------------------------------------------------

        if param_name not in parameters:
            continue


        value = parameters[param_name]


        # ----------------------------------------------------
        # LIKE
        # ----------------------------------------------------

        if param_name in like_params:

            where_parts.append(
                f"{column} LIKE %s"
            )

            params.append(
                f"%{value}%"
            )


        # ----------------------------------------------------
        # EQUAL
        # ----------------------------------------------------

        else:

            where_parts.append(
                f"{column} = %s"
            )

            params.append(
                value
            )


    # ========================================================
    # GABUNGKAN QUERY
    # ========================================================

    parts = [
        select_clause,
        from_clause
    ]


    # --------------------------------------------------------
    # JOIN
    # --------------------------------------------------------

    if join_clause:

        parts.append(
            join_clause
        )


    # --------------------------------------------------------
    # QUERY
    # --------------------------------------------------------

    query = "\n".join(parts)


    # --------------------------------------------------------
    # WHERE
    # --------------------------------------------------------

    if where_parts:

        query += (
            "\nWHERE "
            + " AND ".join(where_parts)
        )


    # --------------------------------------------------------
    # SEMICOLON
    # --------------------------------------------------------

    query += ";"


    return query, params


# ============================================================
# TEST QUERY BUILDER
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 50)
    print("       TEST QUERY BUILDER POSTGRESQL")
    print("=" * 50)


    kasus_uji = [

        (
            "data_penduduk",
            {
                "rw": "05",
                "jenis_kelamin": "Perempuan"
            }
        ),

        (
            "data_infrastruktur",
            {
                "rw": "03",
                "jenis_infrastruktur": "CCTV",
                "kondisi": "Rusak"
            }
        ),

        (
            "jumlah_penduduk",
            {
                "rw": "05"
            }
        ),

        (
            "data_kesejahteraan",
            {
                "rw": "07",
                "kategori_kesejahteraan": "Stunting"
            }
        ),

        (
            "data_penduduk",
            {
                "nama": "Siti"
            }
        ),

        (
            "jumlah_rw",
            {}
        ),

        (
            "jumlah_rt",
            {}
        ),

        (
            "out_of_scope",
            {}
        ),
    ]


    for intent, params_in in kasus_uji:

        query, params_out = build_query(
            intent,
            params_in
        )


        print()
        print("-" * 50)

        print(
            f"Intent    : {intent}"
        )

        print(
            f"Parameter : {params_in}"
        )

        print(
            "SQL       :"
        )

        print(
            query
        )

        print(
            f"Values    : {params_out}"
        )


    print()
    print("=" * 50)
    print("TEST SELESAI")
    print("=" * 50)
