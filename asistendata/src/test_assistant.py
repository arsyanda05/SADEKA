from assistant import process_question


TEST_CASES = [
    "Tampilkan penduduk perempuan di RW 05",
    "Tampilkan penduduk laki-laki di RW 05",
    "Tampilkan penduduk yang pindah di RW 05",
    "Tampilkan data penduduk bernama Budi",
    "Tampilkan warga stunting di RW 05",
    "Tampilkan ibu hamil di RW 05",
    "Tampilkan CCTV yang rusak di RW 05",
    "Tampilkan PJU yang rusak di RW 05",
    "Tampilkan UMKM di RT 04 RW 05",
    "Tampilkan pegawai dengan jabatan Lurah",
    "Tampilkan agenda rapat",
    "Tampilkan surat masuk dari Kecamatan Tandes",
    "Tampilkan ahli waris dengan hubungan anak",
    "Berapa jumlah RW di kelurahan?",
    "Berapa jumlah RT di kelurahan?",
]


print("=" * 80)
print("PENGUJIAN INTEGRASI ASISTEN DATA SADEKA")
print("=" * 80)

for i, question in enumerate(TEST_CASES, start=1):
    print("\n" + "-" * 80)
    print(f"TEST {i:02d}")
    print("-" * 80)
    print(f"Pertanyaan : {question}")

    try:
        result = process_question(question)

        print(f"Hasil      : {result}")

    except Exception as e:
        print(f"ERROR      : {e}")

print("\n" + "=" * 80)
print("PENGUJIAN SELESAI")
print("=" * 80)