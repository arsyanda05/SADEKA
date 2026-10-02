from pathlib import Path
import sys
import json

import joblib


# ============================================================
# PATH PROJECT
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_ROOT = Path(__file__).resolve().parent

for path in [str(PROJECT_ROOT), str(SRC_ROOT)]:
    if path not in sys.path:
        sys.path.insert(0, path)


# ============================================================
# IMPORT MODULE
# ============================================================

try:
    from preprocess import preprocess_text
    from parameter import extract_parameters
    from query_builder import build_query
    from database import execute_query
    from validation import validate_question_scope
except ModuleNotFoundError:
    from src.preprocess import preprocess_text
    from src.parameter import extract_parameters
    from src.query_builder import build_query
    from src.database import execute_query
    from src.validation import validate_question_scope


# ============================================================
# MODEL
# ============================================================

MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "model_intent_sadeka.pkl"
)

model = joblib.load(MODEL_PATH)

CONFIDENCE_THRESHOLD = 0.22


# ============================================================
# FALLBACK
# ============================================================

FALLBACK_MESSAGE = (
    "Maaf, saya belum bisa memahami pertanyaan ini. Coba ajukan "
    "pertanyaan seputar data kependudukan, kesejahteraan, UMKM, "
    "infrastruktur, pegawai, agenda, surat, atau dokumen kelurahan."
)


# ============================================================
# CEK PERTANYAAN JUMLAH
# ============================================================

def is_count_question(text):
    text = text.lower()

    count_keywords = [
        "berapa",
        "ada berapa",
        "jumlah",
        "total",
    ]

    return any(
        keyword in text
        for keyword in count_keywords
    )


# ============================================================
# PROSES PERTANYAAN
# ============================================================

def process_question(question):
    """
    Memproses pertanyaan pengguna menjadi:

    - intent
    - confidence
    - parameter
    - query SQL
    - hasil query
    - jawaban natural language

    Return:
        dict
    """

    question_processed = preprocess_text(
        question
    )

    proba = model.predict_proba(
        [question_processed]
    )[0]

    classes = model.classes_

    best_idx = proba.argmax()

    intent = classes[best_idx]

    confidence = float(
        proba[best_idx]
    )

    is_out_of_scope = (
        intent == "out_of_scope"
        or confidence < CONFIDENCE_THRESHOLD
    )

    result = {
        "question": question,
        "intent": intent,
        "confidence": confidence,
        "is_out_of_scope": is_out_of_scope,
        "parameters": {},
        "query": None,
        "query_params": [],
        "columns": [],
        "rows": [],
        "error": None,
        "answer": None,
    }

    # ========================================================
    # OUT OF SCOPE BERDASARKAN MODEL
    # ========================================================

    if is_out_of_scope:
        result["answer"] = FALLBACK_MESSAGE

        return result

    # ========================================================
    # VALIDASI SCOPE
    # ========================================================

    if not validate_question_scope(
        question,
        intent
    ):
        result["is_out_of_scope"] = True

        result["answer"] = (
            "Pertanyaan berada di luar cakupan "
            "data Asisten Data SADEKA."
        )

        return result

    # ========================================================
    # EKSTRAKSI PARAMETER
    # ========================================================

    parameters = extract_parameters(
        question
    )

    count_only = is_count_question(
        question
    )

    # ========================================================
    # BUILD QUERY
    # ========================================================

    query, query_params = build_query(
        intent,
        parameters,
        count_only=count_only
    )

    # ========================================================
    # EXECUTE QUERY POSTGRESQL
    # ========================================================

    columns, rows, error = execute_query(
        query,
        query_params
    )

    # ========================================================
    # SIMPAN HASIL
    # ========================================================

    result["parameters"] = parameters

    result["query"] = query

    result["query_params"] = query_params

    result["columns"] = columns

    result["rows"] = rows

    result["error"] = error

    result["answer"] = format_answer(
        intent,
        columns,
        rows,
        error,
        count_only
    )

    return result


# ============================================================
# FORMAT JAWABAN
# ============================================================

def format_answer(
    intent,
    columns,
    rows,
    error,
    count_only=False
):
    """
    Membuat ringkasan jawaban
    berbahasa natural.
    """

    if error:
        return (
            f"Tidak bisa mengambil data: {error}"
        )

    if count_only:
        jumlah = (
            rows[0][0]
            if rows
            else 0
        )

        return (
            f"Jumlah data yang sesuai: {jumlah}."
        )

    if intent == "jumlah_penduduk":
        jumlah = (
            rows[0][0]
            if rows
            else 0
        )

        return (
            f"Jumlah data yang sesuai: {jumlah}."
        )

    if not rows:
        return (
            "Tidak ditemukan data yang sesuai "
            "dengan pertanyaan tersebut."
        )

    return (
        f"Ditemukan {len(rows)} baris data. "
        f"Kolom: {', '.join(columns)}."
    )


# ============================================================
# MODE API
# ============================================================

def run_api_mode():
    """
    Mode yang digunakan oleh backend Express.

    Express mengirim satu JSON melalui stdin:

    {
        "question": "Berapa jumlah penduduk?"
    }

    Python mengembalikan satu JSON melalui stdout.
    """

    try:
        input_data = sys.stdin.read()

        if not input_data.strip():
            print(
                json.dumps(
                    {
                        "success": False,
                        "message": (
                            "Input pertanyaan tidak ditemukan."
                        ),
                    },
                    ensure_ascii=False,
                )
            )

            return

        data = json.loads(
            input_data
        )

        question = data.get(
            "question"
        )

        if (
            not isinstance(
                question,
                str
            )
            or not question.strip()
        ):
            print(
                json.dumps(
                    {
                        "success": False,
                        "message": (
                            "Pertanyaan tidak boleh kosong."
                        ),
                    },
                    ensure_ascii=False,
                )
            )

            return

        question = question.strip()

        result = process_question(
            question
        )

        # ====================================================
        # RESPONSE UNTUK EXPRESS
        # ====================================================

        response = {
            "success": True,
            "question": result[
                "question"
            ],
            "intent": result[
                "intent"
            ],
            "confidence": result[
                "confidence"
            ],
            "is_out_of_scope": result[
                "is_out_of_scope"
            ],
            "parameters": result[
                "parameters"
            ],
            "query": result[
                "query"
            ],
            "query_params": result[
                "query_params"
            ],
            "columns": result[
                "columns"
            ],
            "rows": result[
                "rows"
            ],
            "error": result[
                "error"
            ],
            "answer": result[
                "answer"
            ],
        }

        print(
            json.dumps(
                response,
                ensure_ascii=False,
                default=str,
            )
        )

    except json.JSONDecodeError as error:
        print(
            json.dumps(
                {
                    "success": False,
                    "message": (
                        "Format input JSON tidak valid."
                    ),
                    "error": str(error),
                },
                ensure_ascii=False,
            )
        )

    except Exception as error:
        print(
            json.dumps(
                {
                    "success": False,
                    "message": (
                        "Terjadi kesalahan "
                        "pada Asisten Data."
                    ),
                    "error": str(error),
                },
                ensure_ascii=False,
            )
        )


# ============================================================
# MODE TERMINAL
# ============================================================

def run_terminal_mode():
    """
    Mode lama untuk menjalankan Asisten Data
    langsung dari terminal.

    Contoh:

        python asistendata/src/assistant.py

    """

    print(
        "=== ASISTEN DATA SADEKA ==="
    )

    print(
        "Ketik 'exit' untuk keluar.\n"
    )

    while True:

        question = input(
            "Pertanyaan: "
        )

        if question.lower() == "exit":
            break

        hasil = process_question(
            question
        )

        print(
            "Intent     :",
            hasil["intent"],
            f"(confidence={hasil['confidence']:.2f})",
        )

        if not hasil[
            "is_out_of_scope"
        ]:

            print(
                "Parameter  :",
                hasil["parameters"],
            )

            print(
                "SQL        :",
                hasil["query"],
            )

            print(
                "Values     :",
                hasil["query_params"],
            )

        print(
            "Jawaban    :",
            hasil["answer"],
        )

        print()


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    # Jika dipanggil dengan:
    #
    # python assistant.py --api
    #
    # maka Python menggunakan mode API.

    if "--api" in sys.argv:

        run_api_mode()

    else:

        run_terminal_mode()