"""
Script untuk MEMPERBESAR dataset intent SADEKA.

Dataset lama hanya 15 kalimat per intent (180 total, 12 kelas) -- terlalu
kecil untuk hasil evaluasi yang meyakinkan, dan tidak punya kelas
"di luar cakupan" sama sekali.

Script ini membuat dataset baru dengan:
1. Variasi kalimat per intent lebih banyak (kombinasi kata tanya,
   sinonim, lokasi RW/RT, dsb).
2. Kelas baru "out_of_scope" untuk pertanyaan yang tidak berkaitan
   dengan SADEKA (basa-basi, cuaca, pengetahuan umum, dll), supaya
   model bisa belajar menolak menjawab alih-alih memaksa memilih
   salah satu dari 12 intent.

Jalankan: python src/generate_dataset.py
Hasil disimpan ke dataset/dataset_intent_sadeka.csv (menimpa yang lama).
"""

import csv
import random
from itertools import product
from pathlib import Path

random.seed(42)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = PROJECT_ROOT / "dataset" / "dataset_intent_sadeka.csv"

TARGET_PER_INTENT = 40
TARGET_OUT_OF_SCOPE = 60

RW_LIST = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]
RT_LIST = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]
NAMA_LIST = ["Siti", "Budi", "Andi", "Rina", "Ani", "Dewi", "Joko", "Rudi", "Sri", "Bambang"]


def loc_variants():
    variants = [""]
    for rw in RW_LIST:
        variants.append(f" di RW {rw}")
        variants.append(f" di wilayah RW {rw}")
    for rt in RT_LIST:
        variants.append(f" di RT {rt}")
    return variants


LOC = loc_variants()


def sample(pool, n):
    n = min(n, len(pool))
    return random.sample(pool, n)


def build_intent_sentences():
    data = {}

    # ---------------- jumlah_penduduk ----------------
    tanya = ["Berapa", "Ada berapa", "Berapa banyak", "Tolong hitung", "Mohon info jumlah", "Bisa tampilkan jumlah", "Berapa total"]
    obj = ["jumlah penduduk", "jumlah warga", "penduduk yang terdaftar", "total penduduk", "warga yang tercatat"]
    gender = ["laki-laki", "perempuan"]
    status = ["aktif", "pindah", "meninggal"]

    sentences = set()
    for t, o, l in product(tanya, obj, sample(LOC, 12)):
        sentences.add(f"{t} {o}{l}?")
    for t, g, l in product(tanya, gender, sample(LOC, 6)):
        sentences.add(f"{t} penduduk {g}{l}?")
    for t, s, l in product(tanya, status, sample(LOC, 4)):
        sentences.add(f"{t} penduduk berstatus {s}{l}?")
    data["jumlah_penduduk"] = sentences

    # ---------------- data_penduduk ----------------
    tampil = ["Tampilkan", "Cari", "Lihat", "Mohon tampilkan", "Bisa tampilkan", "Tolong perlihatkan", "Cek data"]
    sentences = set()
    for t, l in product(tampil, sample(LOC, 15)):
        sentences.add(f"{t} data penduduk{l}.")
        sentences.add(f"{t} daftar warga{l}.")
    for t, g, l in product(tampil, gender, sample(LOC, 8)):
        sentences.add(f"{t} data penduduk {g}{l}.")
        sentences.add(f"Siapa saja penduduk {g}{l}?")
    for t, s, l in product(tampil, status, sample(LOC, 4)):
        sentences.add(f"{t} warga berstatus {s}{l}.")
    for nm in NAMA_LIST:
        sentences.add(f"Cari data penduduk bernama {nm}.")
        sentences.add(f"Siapa warga bernama {nm}?")
        sentences.add(f"Tampilkan data atas nama {nm}.")
    data["data_penduduk"] = sentences

    # ---------------- data_kesejahteraan ----------------
    kategori = ["stunting", "ibu hamil", "putus sekolah", "beasiswa", "rutilahu"]
    sentences = set()
    for t, k, l in product(tampil, kategori, sample(LOC, 8)):
        sentences.add(f"{t} data {k}{l}.")
        sentences.add(f"Ada berapa kasus {k}{l}?")
        sentences.add(f"Siapa saja penerima {k}{l}?")
    data["data_kesejahteraan"] = sentences

    # ---------------- data_umkm ----------------
    sentences = set()
    for t, l in product(tampil, sample(LOC, 15)):
        sentences.add(f"{t} data umkm{l}.")
        sentences.add(f"{t} daftar usaha{l}.")
    for l in sample(LOC, 10):
        sentences.add(f"Ada berapa umkm{l}?")
        sentences.add(f"Siapa saja pemilik umkm{l}?")
    data["data_umkm"] = sentences

    # ---------------- data_infrastruktur ----------------
    jenis_infra = ["cctv", "pju", "penerangan jalan", "saluran"]
    kondisi = ["baik", "rusak", "sedang"]
    sentences = set()
    for t, j, l in product(tampil, jenis_infra, sample(LOC, 6)):
        sentences.add(f"{t} data {j}{l}.")
    for j, k, l in product(jenis_infra, kondisi, sample(LOC, 6)):
        sentences.add(f"Berapa {j} yang kondisinya {k}{l}?")
        sentences.add(f"{tampil[0]} {j} yang {k}{l}.")
    data["data_infrastruktur"] = sentences

    # ---------------- data_pegawai ----------------
    jabatan = ["lurah", "sekretaris", "kasi pemerintahan", "kasi kesejahteraan", "kasi pelayanan", "staff"]
    sentences = set()
    for t in tampil:
        sentences.add(f"{t} data pegawai kelurahan.")
        sentences.add(f"{t} daftar pegawai.")
    for j in jabatan:
        sentences.add(f"Tampilkan pegawai dengan jabatan {j}.")
        sentences.add(f"Siapa saja pegawai yang menjabat sebagai {j}?")
        sentences.add(f"Cari pegawai jabatan {j}.")
    data["data_pegawai"] = sentences

    # ---------------- data_agenda ----------------
    kategori_agenda = ["rapat", "sosialisasi", "posyandu", "kerja bakti", "musyawarah"]
    sentences = set()
    for t in tampil:
        sentences.add(f"{t} agenda kegiatan kelurahan.")
        sentences.add(f"{t} jadwal kegiatan minggu ini.")
    sentences.add("Ada acara apa saja bulan ini?")
    sentences.add("Ada kegiatan apa minggu ini?")
    for k in kategori_agenda:
        sentences.add(f"Ada agenda {k} minggu ini?")
        sentences.add(f"Tampilkan jadwal {k}.")
        sentences.add(f"Kapan jadwal {k} berikutnya?")
    data["data_agenda"] = sentences

    # ---------------- data_surat ----------------
    jenis_surat = ["surat masuk", "surat keluar", "surat pengantar", "surat keterangan"]
    sentences = set()
    for t in tampil:
        sentences.add(f"{t} data surat.")
        sentences.add(f"{t} daftar surat bulan ini.")
    for j in jenis_surat:
        sentences.add(f"Ada berapa {j} hari ini?")
        sentences.add(f"Tampilkan {j} minggu ini.")
        sentences.add(f"Cek daftar {j}.")
    data["data_surat"] = sentences

    # ---------------- data_dokumen ----------------
    sentences = set()
    for t in tampil:
        sentences.add(f"{t} data dokumen.")
        sentences.add(f"{t} dokumen yang diunggah.")
    sentences.update([
        "Ada berapa dokumen yang tersimpan?",
        "Tampilkan file hasil OCR.",
        "Cari dokumen berdasarkan nama file.",
        "Tampilkan dokumen terbaru yang diupload.",
        "Ada dokumen apa saja di sistem?",
    ])
    data["data_dokumen"] = sentences

    # ---------------- data_ahli_waris ----------------
    hubungan = ["anak", "istri", "suami", "orang tua", "saudara"]
    sentences = set()
    for t in tampil:
        sentences.add(f"{t} data ahli waris.")
        sentences.add(f"{t} daftar ahli waris.")
    for nm in NAMA_LIST:
        sentences.add(f"Siapa ahli waris dari almarhum {nm}?")
        sentences.add(f"Tampilkan ahli waris atas nama {nm}.")
    for h in hubungan:
        sentences.add(f"Tampilkan ahli waris dengan hubungan {h}.")
        sentences.add(f"Siapa ahli waris berstatus {h}?")
    data["data_ahli_waris"] = sentences

    # ---------------- data_tracking_surat ----------------
    sentences = set()
    for t in tampil:
        sentences.add(f"{t} status pelacakan surat.")
        sentences.add(f"{t} histori tracking surat.")
    sentences.update([
        "Sudah sampai mana proses surat saya?",
        "Cek status surat yang diajukan.",
        "Bagaimana progres pengurusan surat?",
        "Surat saya sudah diproses belum?",
        "Tampilkan riwayat tracking pengajuan surat.",
    ])
    data["data_tracking_surat"] = sentences

    # ---------------- data_histori_penduduk ----------------
    sentences = set()
    for t in tampil:
        sentences.add(f"{t} riwayat perubahan status penduduk.")
        sentences.add(f"{t} log perubahan data penduduk.")
    for nm in NAMA_LIST:
        sentences.add(f"Tampilkan histori perubahan status {nm}.")
        sentences.add(f"Riwayat pindah penduduk bernama {nm}.")
    sentences.update([
        "Ada berapa perubahan status bulan ini?",
        "Tampilkan histori penduduk yang pindah.",
        "Riwayat penduduk yang berubah status meninggal.",
    ])
    data["data_histori_penduduk"] = sentences

    return data


def build_out_of_scope_sentences():
    sentences = set([
        "Bagaimana cuaca hari ini?",
        "Siapa presiden Indonesia sekarang?",
        "Ceritakan lelucon dong.",
        "Apa kabar?",
        "Terima kasih banyak ya.",
        "Kamu siapa?",
        "Rekomendasi tempat makan enak di Surabaya.",
        "Bagaimana cara membuat kopi yang enak?",
        "1 tambah 1 berapa?",
        "Apa itu machine learning?",
        "Tolong nyanyikan sebuah lagu.",
        "Jam berapa sekarang?",
        "Berapa harga emas hari ini?",
        "Siapa pemenang piala dunia terakhir?",
        "Ceritakan sejarah kota Surabaya.",
        "Apa arti mimpi buruk?",
        "Bagaimana cara belajar bahasa Inggris?",
        "Film apa yang bagus ditonton akhir pekan ini?",
        "Kamu bisa membantu PR matematika?",
        "Berikan resep nasi goreng.",
        "Apa itu kecerdasan buatan?",
        "Selamat pagi, semoga harimu menyenangkan.",
        "Halo, sedang apa?",
        "Bisa bantu saya menulis puisi?",
        "Apa hobi kamu?",
        "Berapa jarak Surabaya ke Jakarta?",
        "Kapan hari kemerdekaan Indonesia?",
        "Tolong terjemahkan kata ini ke bahasa Inggris.",
        "Apa perbedaan kucing dan anjing?",
        "Aplikasi ini dibuat pakai bahasa pemrograman apa?",
        "Bagaimana cara reset password email saya?",
        "Berapa kalori dalam semangkuk nasi?",
        "Apa saja rukun Islam?",
        "Bisa rekomendasikan buku bacaan bagus?",
        "Bagaimana cara olahraga yang benar?",
        "Apa itu inflasi?",
        "Ceritakan tentang planet Mars.",
        "Bagaimana prediksi cuaca besok?",
        "Siapa penemu lampu pijar?",
        "Apa itu bitcoin?",
        "Tolong hitung 25 kali 4.",
    ])
    return sentences


def main():
    intent_data = build_intent_sentences()
    out_of_scope = build_out_of_scope_sentences()

    rows = []

    for intent, sentences in intent_data.items():
        chosen = sample(sorted(sentences), TARGET_PER_INTENT)
        for s in chosen:
            rows.append((s, intent))

    chosen_oos = sample(sorted(out_of_scope), min(TARGET_OUT_OF_SCOPE, len(out_of_scope)))
    for s in chosen_oos:
        rows.append((s, "out_of_scope"))

    random.shuffle(rows)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["pertanyaan", "intent"])
        writer.writerows(rows)

    print(f"Dataset baru disimpan di: {OUTPUT_PATH}")
    print(f"Total baris: {len(rows)}")

    from collections import Counter
    counts = Counter(r[1] for r in rows)
    for intent, c in counts.most_common():
        print(f"  {intent:25s} : {c}")


if __name__ == "__main__":
    main()
