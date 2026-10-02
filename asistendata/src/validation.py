import re


# Wilayah di luar cakupan database SADEKA.
# Tambahkan nama wilayah lain jika memang diperlukan.
OUT_OF_SCOPE_LOCATIONS = [
    "indonesia",
    "jawa timur",
    "jawa tengah",
    "jawa barat",
    "jakarta",
    "surabaya",
    "malang",
    "sidoarjo",
]


def validate_question_scope(text, intent):
    """
    Memeriksa apakah pertanyaan masih berada dalam cakupan
    data yang dapat dijawab oleh Asisten Data SADEKA.

    Return:
        True  -> pertanyaan boleh diproses
        False -> pertanyaan perlu ditolak
    """

    text_lower = text.lower()

    # ---------------------------------------------------------
    # 1. Tolak pertanyaan yang secara eksplisit meminta
    #    data wilayah di luar cakupan SADEKA.
    # ---------------------------------------------------------
    for location in OUT_OF_SCOPE_LOCATIONS:
        pola = r"\b" + re.escape(location) + r"\b"

        if re.search(pola, text_lower):
            return False

    # ---------------------------------------------------------
    # 2. Pertanyaan tentang sejarah/berdirinya kelurahan
    #    belum memiliki intent di Asisten Data.
    # ---------------------------------------------------------
    unsupported_topics = [
        "berdiri",
        "didirikan",
        "sejarah kelurahan",
        "tahun berdiri",
        "tanggal berdiri",
    ]

    for topic in unsupported_topics:
        if topic in text_lower:
            return False

    return True