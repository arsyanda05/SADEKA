from assistant import process_question


TEST_CASES = [
    # 1. Pertanyaan kosong
    "",

    # 2. Input hanya spasi
    "   ",

    # 3. Pertanyaan tidak jelas
    "asdfghjkl",

    # 4. Pertanyaan valid tetapi data tidak ada
    "Tampilkan ibu hamil di RW 03",

    # 5. Pertanyaan dengan data yang kemungkinan tidak ditemukan
    "Tampilkan penduduk bernama ZZZZZ",

    # 6. Pertanyaan dengan RW yang tidak ada di dummy database
    "Tampilkan penduduk di RW 99",

    # 7. Pertanyaan out-of-scope
    "Berapa harga mobil hari ini?",
]


print("=" * 80)
print("PENGUJIAN ERROR HANDLING ASISTEN DATA SADEKA")
print("=" * 80)


for i, question in enumerate(TEST_CASES, start=1):
    print("\n" + "-" * 80)
    print(f"TEST {i:02d}")
    print("-" * 80)
    print(f"Pertanyaan : {repr(question)}")

    try:
        result = process_question(question)

        print(f"Status     : TIDAK CRASH")
        print(f"Intent     : {result.get('intent')}")
        print(f"Confidence : {result.get('confidence')}")
        print(f"Out Scope  : {result.get('is_out_of_scope')}")
        print(f"Error      : {result.get('error')}")
        print(f"Answer     : {result.get('answer')}")

    except Exception as e:
        print(f"Status     : CRASH")
        print(f"Error      : {type(e).__name__}: {e}")


print("\n" + "=" * 80)
print("PENGUJIAN SELESAI")
print("=" * 80)