from assistant import process_question


TEST_CASES = [
    ("Penduduk - RW + jenis kelamin",
     "Tampilkan penduduk perempuan di RW 05",
     "data_penduduk", {"rw": "05", "jenis_kelamin": "Perempuan"}),

    ("Penduduk - RW + jenis kelamin laki-laki",
     "Tampilkan penduduk laki-laki di RW 05",
     "data_penduduk", {"rw": "05", "jenis_kelamin": "Laki-laki"}),

    ("Penduduk - status pindah + RW",
     "Tampilkan penduduk yang pindah di RW 05",
     "data_penduduk", {"rw": "05", "status_penduduk": "Pindah"}),

    ("Penduduk - status meninggal + RW",
     "Tampilkan penduduk yang meninggal di RW 05",
     "data_penduduk", {"rw": "05", "status_penduduk": "Meninggal"}),

    ("Penduduk - RT + RW",
     "Tampilkan penduduk di RT 02 RW 05",
     "data_penduduk", {"rt": "02", "rw": "05"}),

    ("Penduduk - nama",
     "Tampilkan data penduduk bernama Budi",
     "data_penduduk", {"nama": "Budi"}),

    ("Kesejahteraan - kategori + RW",
     "Tampilkan warga stunting di RW 05",
     "data_kesejahteraan",
     {"rw": "05", "kategori_kesejahteraan": "Stunting"}),

    ("Kesejahteraan - ibu hamil + RW",
     "Tampilkan ibu hamil di RW 05",
     "data_kesejahteraan",
     {"rw": "05", "kategori_kesejahteraan": "Ibu Hamil"}),

    ("Infrastruktur - CCTV + kondisi + RW",
     "Tampilkan CCTV yang rusak di RW 05",
     "data_infrastruktur",
     {"rw": "05", "jenis_infrastruktur": "CCTV", "kondisi": "Rusak"}),

    ("Infrastruktur - PJU + kondisi + RW",
     "Tampilkan PJU yang rusak di RW 05",
     "data_infrastruktur",
     {"rw": "05", "jenis_infrastruktur": "PJU", "kondisi": "Rusak"}),

    ("Infrastruktur - saluran + kondisi",
     "Tampilkan saluran yang baik",
     "data_infrastruktur",
     {"jenis_infrastruktur": "Saluran", "kondisi": "Baik"}),

    ("UMKM - RT + RW",
     "Tampilkan UMKM di RT 04 RW 05",
     "data_umkm", {"rt": "04", "rw": "05"}),

    ("Pegawai - jabatan Lurah",
     "Tampilkan pegawai dengan jabatan Lurah",
     "data_pegawai", {"jabatan": "Lurah"}),

    ("Pegawai - Staff",
     "Tampilkan data staf kelurahan",
     "data_pegawai", {"jabatan": "Staff"}),

    ("Agenda - kategori Rapat",
     "Tampilkan agenda rapat",
     "data_agenda", {"kategori_agenda": "Rapat"}),

    ("Agenda - kategori Posyandu",
     "Tampilkan agenda posyandu",
     "data_agenda", {"kategori_agenda": "Posyandu"}),

    ("Surat - masuk + asal",
     "Tampilkan surat masuk dari Kecamatan Tandes",
     "data_surat",
     {"jenis_surat": "Masuk", "asal_surat": "Kecamatan Tandes"}),

    ("Surat - keluar + tujuan",
     "Tampilkan surat keluar ke Kecamatan Tandes",
     "data_surat",
     {"jenis_surat": "Keluar", "tujuan_surat": "Kecamatan Tandes"}),

    ("Ahli waris - hubungan",
     "Tampilkan ahli waris dengan hubungan anak",
     "data_ahli_waris", {"hubungan": "Anak"}),

    ("Jumlah RW",
     "Berapa jumlah RW di kelurahan?",
     "jumlah_rw", {}),

    ("Jumlah RT",
     "Berapa jumlah RT di kelurahan?",
     "jumlah_rt", {}),
]


def parameters_match(actual, expected):
    return all(actual.get(key) == value for key, value in expected.items())


total = len(TEST_CASES)
passed = 0

print("=" * 80)
print("PENGUJIAN PARAMETER + QUERY BUILDER ASISTEN DATA SADEKA")
print("=" * 80)

for number, (name, question, expected_intent, expected_parameters) in enumerate(
    TEST_CASES, start=1
):
    result = process_question(question)

    intent_ok = result["intent"] == expected_intent
    parameter_ok = parameters_match(
        result["parameters"], expected_parameters
    )
    scope_ok = not result["is_out_of_scope"]
    query_ok = result["query"] is not None
    database_ok = result["error"] is None

    test_passed = (
        intent_ok
        and parameter_ok
        and scope_ok
        and query_ok
        and database_ok
    )

    if test_passed:
        passed += 1

    print("\n" + "-" * 80)
    print(f"TEST {number:02d} - {name}")
    print("-" * 80)
    print("✓ LULUS" if test_passed else "✗ GAGAL")
    print(f"Pertanyaan           : {question}")
    print(f"Expected intent      : {expected_intent}")
    print(f"Prediksi intent      : {result['intent']}")
    print(f"Confidence           : {result['confidence']:.2f}")
    print(f"Expected parameter   : {expected_parameters}")
    print(f"Parameter terdeteksi : {result['parameters']}")
    print(f"Intent               : {'✓' if intent_ok else '✗'}")
    print(f"Parameter            : {'✓' if parameter_ok else '✗'}")
    print(f"Scope                : {'✓' if scope_ok else '✗'}")
    print(f"Query terbentuk      : {'✓' if query_ok else '✗'}")
    print(f"Database             : {'✓' if database_ok else '✗'}")

    if result["query"]:
        print("\nSQL:")
        print(result["query"])

    if result["query_params"]:
        print(f"SQL Parameters       : {result['query_params']}")

    if result["error"]:
        print(f"Database Error       : {result['error']}")

    if result["rows"]:
        print(f"Jumlah hasil         : {len(result['rows'])}")

    print(f"Jawaban              : {result['answer']}")


accuracy = passed / total * 100

print("\n" + "=" * 80)
print("HASIL AKHIR")
print("=" * 80)
print(f"Total pengujian : {total}")
print(f"Lulus           : {passed}")
print(f"Gagal           : {total - passed}")
print(f"Akurasi         : {accuracy:.2f}%")
print("=" * 80)
