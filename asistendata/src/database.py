import os
from pathlib import Path

import psycopg2
from psycopg2 import Error

def load_database_url():
    """
    Mengambil DATABASE_URL dari environment.

    Prioritas:
    1. DATABASE_URL yang sudah tersedia di environment.
    2. File backend/.env SADEKA.
    """

    database_url = os.getenv("DATABASE_URL")

    if database_url:
        return database_url

    project_root = Path(__file__).resolve().parents[2]

    env_path = project_root / "backend" / ".env"

    if not env_path.exists():
        return None

    try:
        with open(env_path, "r", encoding="utf-8") as file:
            for line in file:
                line = line.strip()

                if not line:
                    continue

                if line.startswith("#"):
                    continue

                if line.startswith("DATABASE_URL="):
                    value = line.split("=", 1)[1].strip()

                    # Menghapus tanda kutip jika ada
                    if (
                        len(value) >= 2
                        and value[0] == value[-1]
                        and value[0] in ('"', "'")
                    ):
                        value = value[1:-1]

                    return value

    except OSError as error:
        print("Gagal membaca backend/.env:", error)

    return None


DATABASE_URL = load_database_url()

def get_connection():
    """
    Membuat koneksi ke PostgreSQL SADEKA.

    Database yang digunakan adalah database SADEKA yang sama
    dengan yang digunakan oleh backend.
    """

    if not DATABASE_URL:
        raise RuntimeError(
            "DATABASE_URL tidak ditemukan. "
            "Pastikan backend/.env memiliki DATABASE_URL."
        )

    return psycopg2.connect(DATABASE_URL)

def execute_query(query, params=None):
    """
    Menjalankan query SELECT secara aman menggunakan
    parameter binding PostgreSQL.

    Parameter query dari query_builder.py nantinya menggunakan
    placeholder PostgreSQL:

        %s

    Contoh:

        SELECT *
        FROM penduduk
        WHERE rw = %s;

    params:

        ["05"]

    Return:

        (
            columns,
            rows,
            error
        )

    columns = nama kolom hasil query
    rows    = data hasil query
    error   = pesan error atau None

    Asisten Data hanya diperbolehkan membaca data.
    Fungsi ini tidak digunakan untuk INSERT, UPDATE, atau DELETE.
    """

    if params is None:
        params = []

    if query is None:
        return [], [], "Query tidak tersedia untuk intent ini."

    connection = None
    cursor = None

    try:
        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(query, params)

        columns = []

        if cursor.description:
            columns = [
                description[0]
                for description in cursor.description
            ]

        rows = cursor.fetchall()

        return columns, rows, None

    except Error as error:
        return [], [], str(error)

    except Exception as error:
        return [], [], str(error)

    finally:

        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()

def test_connection():
    """
    Mengecek apakah Asisten Data berhasil terhubung
    ke PostgreSQL SADEKA.
    """

    connection = None
    cursor = None

    try:

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute("SELECT current_database();")

        database_name = cursor.fetchone()[0]

        print("========================================")
        print("KONEKSI DATABASE SADEKA BERHASIL")
        print("========================================")
        print("Database :", database_name)

        return True

    except Exception as error:

        print("========================================")
        print("KONEKSI DATABASE SADEKA GAGAL")
        print("========================================")
        print("Error :", error)

        return False

    finally:

        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()

def test_query():
    """
    Test sederhana untuk membaca jumlah penduduk
    dari PostgreSQL SADEKA.
    """

    query = """
        SELECT COUNT(*) AS jumlah
        FROM penduduk;
    """

    columns, rows, error = execute_query(query)

    if error:

        print("Query gagal:")
        print(error)

        return

    print("========================================")
    print("TEST QUERY PENDUDUK")
    print("========================================")
    print("Columns :", columns)
    print("Rows    :", rows)

if __name__ == "__main__":

    print()
    print("========================================")
    print("   DATABASE ASISTEN DATA SADEKA")
    print("========================================")
    print()

    if not DATABASE_URL:

        print("DATABASE_URL tidak ditemukan.")
        print()
        print(
            "Pastikan file berikut tersedia:"
        )
        print(
            "backend/.env"
        )
        print()
        print(
            "dan berisi:"
        )
        print()
        print(
            "DATABASE_URL=..."
        )

    else:

        test_connection()

        print()

        test_query()