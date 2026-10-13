import re




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





    for location in OUT_OF_SCOPE_LOCATIONS:
        pola = r"\b" + re.escape(location) + r"\b"

        if re.search(pola, text_lower):
            return False





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