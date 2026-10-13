from assistant import process_question


TEST_CASES = [

    "",


    "   ",


    "asdfghjkl",


    "Tampilkan ibu hamil di RW 03",


    "Tampilkan penduduk bernama ZZZZZ",


    "Tampilkan penduduk di RW 99",


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