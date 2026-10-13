import re

from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import (
    StopWordRemoverFactory
)



stemmer_factory = StemmerFactory()
stemmer = stemmer_factory.create_stemmer()



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


    text = str(text)


    text = text.lower()


    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)



    text = re.sub(r"\b\d+\b", " ", text)


    text = re.sub(r"\s+", " ", text).strip()


    text = stopword_remover.remove(text)


    text = stemmer.stem(text)


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