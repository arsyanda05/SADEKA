import re

from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import (
    StopWordRemoverFactory
)


# Membuat stemmer Bahasa Indonesia
stemmer_factory = StemmerFactory()
stemmer = stemmer_factory.create_stemmer()


# Membuat stopword remover Bahasa Indonesia
stopword_factory = StopWordRemoverFactory()
stopword_remover = stopword_factory.create_stop_word_remover()


def preprocess_text(text):
    """
    Melakukan preprocessing pada pertanyaan pengguna:
    1. Case folding
    2. Menghapus tanda baca
    3. Menghapus angka yang berdiri sendiri
    4. Menghapus spasi berlebih
    5. Stopword removal
    6. Stemming Bahasa Indonesia
    """

    # Pastikan input berupa string
    text = str(text)

    # 1. Case folding
    text = text.lower()

    # 2. Menghapus tanda baca
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)

    # 3. Menghapus angka yang berdiri sendiri
    # Contoh: "tahun 2026" menjadi "tahun"
    text = re.sub(r"\b\d+\b", " ", text)

    # 4. Menghapus spasi berlebih
    text = re.sub(r"\s+", " ", text).strip()

    # 5. Stopword removal
    text = stopword_remover.remove(text)

    # 6. Stemming Bahasa Indonesia
    text = stemmer.stem(text)

    # Bersihkan spasi sekali lagi
    text = re.sub(r"\s+", " ", text).strip()

    return text


if __name__ == "__main__":

    contoh = [
        "Berapa jumlah penduduk di kelurahan?",
        "Tampilkan data penduduk perempuan di RW 05.",
        "Ada berapa kasus stunting?",
        "Berapa jumlah CCTV yang kondisinya rusak?"
    ]

    print("=== HASIL PREPROCESSING ===")

    for pertanyaan in contoh:
        hasil = preprocess_text(pertanyaan)

        print("\nPertanyaan :", pertanyaan)
        print("Hasil      :", hasil)