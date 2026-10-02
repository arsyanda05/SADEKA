from assistant import process_question


TEST_QUESTIONS = {
    "jumlah_penduduk": [
        "Berapa jumlah penduduk?",
        "Ada berapa warga di kelurahan?",
        "Jumlah warga yang tercatat berapa?",
        "Tolong hitung jumlah penduduk.",
    ],

    "jumlah_rw": [
        "Berapa jumlah RW di kelurahan?",
        "Ada berapa RW?",
        "Kelurahan ini memiliki berapa RW?",
        "Jumlah RW yang ada berapa?",
    ],

    "jumlah_rt": [
        "Berapa jumlah RT di kelurahan?",
        "Ada berapa RT?",
        "Kelurahan ini punya berapa RT?",
        "Jumlah RT yang tercatat berapa?",
    ],

    "data_penduduk": [
        "Tampilkan data penduduk.",
        "Saya ingin melihat daftar warga.",
        "Tolong tampilkan data warga.",
        "Lihat data penduduk yang tersimpan.",
    ],

    "data_histori_penduduk": [
        "Tampilkan histori penduduk.",
        "Saya ingin melihat riwayat perubahan penduduk.",
        "Lihat histori data warga.",
        "Tampilkan riwayat penduduk.",
    ],

    "data_kesejahteraan": [
        "Tampilkan data kesejahteraan.",
        "Saya ingin melihat data bantuan warga.",
        "Lihat data kesejahteraan masyarakat.",
        "Tampilkan data warga penerima bantuan.",
    ],

    "data_umkm": [
        "Tampilkan data UMKM.",
        "Saya ingin melihat daftar UMKM.",
        "Lihat data usaha warga.",
        "Tampilkan UMKM yang terdaftar.",
    ],

    "data_infrastruktur": [
        "Tampilkan data infrastruktur.",
        "Saya ingin melihat infrastruktur kelurahan.",
        "Lihat daftar fasilitas infrastruktur.",
        "Tampilkan data sarana yang tersedia.",
    ],

    "data_pegawai": [
        "Tampilkan data pegawai.",
        "Saya ingin melihat daftar pegawai kelurahan.",
        "Lihat data staf kelurahan.",
        "Tampilkan pegawai yang terdaftar.",
    ],

    "data_agenda": [
        "Tampilkan data agenda.",
        "Saya ingin melihat agenda kelurahan.",
        "Lihat daftar kegiatan kelurahan.",
        "Tampilkan jadwal kegiatan.",
    ],

    "data_surat": [
        "Tampilkan data surat.",
        "Saya ingin melihat daftar surat.",
        "Lihat surat yang tersimpan.",
        "Tampilkan semua surat yang ada.",
    ],

    "data_dokumen": [
        "Tampilkan data dokumen.",
        "Saya ingin melihat dokumen yang tersimpan.",
        "Lihat daftar dokumen.",
        "Tampilkan dokumen kelurahan.",
    ],

    "data_ahli_waris": [
        "Tampilkan data ahli waris.",
        "Saya ingin melihat daftar ahli waris.",
        "Lihat data ahli waris yang tersimpan.",
        "Tampilkan informasi ahli waris.",
    ],

    "data_tracking_surat": [
        "Tampilkan tracking surat.",
        "Saya ingin melihat status surat.",
        "Lihat proses surat.",
        "Tampilkan pelacakan surat.",
    ],

    "out_of_scope": [
        "Berapa harga laptop?",
        "Bagaimana cara membuat website?",
        "Siapa presiden Indonesia?",
        "Berapa nilai 100 dikali 20?",
    ],
}


total = 0
correct = 0

for expected_intent, questions in TEST_QUESTIONS.items():

    print("\n" + "=" * 70)
    print(f"INTENT YANG DIHARAPKAN: {expected_intent}")
    print("=" * 70)

    for question in questions:

        total += 1

        result = process_question(question)

        predicted_intent = result["intent"]
        confidence = result["confidence"]

        # Jika pertanyaan ditolak, tetapi memang expected out_of_scope,
        # tetap dianggap benar.
        if expected_intent == "out_of_scope":
            is_correct = result["is_out_of_scope"]
        else:
            is_correct = (
                predicted_intent == expected_intent
                and not result["is_out_of_scope"]
            )

        if is_correct:
            correct += 1

        status = "✓ BENAR" if is_correct else "✗ SALAH"

        print(f"\n{status}")
        print(f"Pertanyaan : {question}")
        print(f"Prediksi   : {predicted_intent}")
        print(f"Expected   : {expected_intent}")
        print(f"Confidence : {confidence:.2f}")

        if result["parameters"]:
            print(f"Parameter  : {result['parameters']}")

        if result["query"]:
            print(f"SQL        : {result['query']}")

        if result["rows"]:
            print(f"Jumlah data: {len(result['rows'])}")

        print(f"Jawaban    : {result['answer']}")


accuracy = correct / total * 100

print("\n" + "=" * 70)
print("HASIL AKHIR")
print("=" * 70)
print(f"Total pengujian : {total}")
print(f"Benar           : {correct}")
print(f"Salah           : {total - correct}")
print(f"Akurasi         : {accuracy:.2f}%")