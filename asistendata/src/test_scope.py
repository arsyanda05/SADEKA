from assistant import process_question


TEST_CASES = [
    # Pertanyaan di luar cakupan
    "Siapa presiden Indonesia?",
    "Berapa harga beras hari ini?",
    "Bagaimana cuaca di Surabaya?",
    "Kapan Kelurahan Manukan Kulon berdiri?",
    "Siapa gubernur Jawa Timur?",
    "Berapa jumlah penduduk Indonesia?",
    "Apa ibu kota Indonesia?",

    # Pertanyaan yang seharusnya masih dalam cakupan SADEKA
    "Berapa jumlah penduduk di RW 05?",
    "Tampilkan penduduk perempuan di RW 05",
    "Tampilkan UMKM di RW 05",
    "Tampilkan agenda rapat",
]


print("=" * 80)
print("PENGUJIAN SCOPE ASISTEN DATA SADEKA")
print("=" * 80)


for i, question in enumerate(TEST_CASES, start=1):
    print("\n" + "-" * 80)
    print(f"TEST {i:02d}")
    print("-" * 80)
    print(f"Pertanyaan : {question}")

    try:
        result = process_question(question)

        print(f"Intent     : {result.get('intent')}")
        print(f"Confidence : {result.get('confidence'):.2f}")
        print(f"Out Scope  : {result.get('is_out_of_scope')}")
        print(f"Answer     : {result.get('answer')}")

    except Exception as e:
        print(f"ERROR      : {e}")


print("\n" + "=" * 80)
print("PENGUJIAN SELESAI")
print("=" * 80)