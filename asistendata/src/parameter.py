import re


def extract_parameters(text):
    """
    Mengambil parameter dari pertanyaan pengguna.
    Semua nilai yang dihasilkan berasal dari:
    - regex angka (rw/rt), atau
    - lookup ke daftar nilai tetap (whitelist)
    sehingga aman dipakai sebagai parameter query (bukan teks bebas),
    kecuali "nama" yang sengaja dibatasi hanya huruf.
    """

    parameters = {}

    text_lower = text.lower()

    # =========================
    # RW
    # =========================
    rw_match = re.search(r"\brw\s*[-/]?\s*0*(\d{1,2})\b", text_lower)

    if rw_match:
        parameters["rw"] = rw_match.group(1).zfill(2)

    # =========================
    # RT
    # =========================
    rt_match = re.search(r"\brt\s*[-/]?\s*0*(\d{1,3})\b", text_lower)

    if rt_match:
        parameters["rt"] = rt_match.group(1).zfill(2)

    # =========================
    # JENIS KELAMIN
    # =========================
    if "perempuan" in text_lower or "wanita" in text_lower:
        parameters["jenis_kelamin"] = "Perempuan"

    elif "laki-laki" in text_lower or "laki laki" in text_lower:
        parameters["jenis_kelamin"] = "Laki-laki"

    # =========================
    # STATUS PENDUDUK
    # =========================
    status_penduduk = {
        "meninggal": "Meninggal",
        "pindah": "Pindah",
        "aktif": "Aktif"
    }

    for kata, nilai in status_penduduk.items():
        if kata in text_lower:
            parameters["status_penduduk"] = nilai
            break

    # =========================
    # NAMA
    # =========================
    # Hanya menangkap nama setelah kata kunci "bernama" / "nama" agar
    # tidak menangkap kata acak lain dalam kalimat.
    nama_match = re.search(
        r"bernama\s+([a-zA-Z]+)|(?:^|\s)nama\s+([a-zA-Z]+)",
        text_lower
    )

    if nama_match:
        nama = nama_match.group(1) or nama_match.group(2)
        parameters["nama"] = nama.title()

    # =========================
    # INFRASTRUKTUR
    # =========================
    jenis_infrastruktur = {
        "cctv": "CCTV",
        "pju": "PJU",
        "penerangan jalan": "PJU",
        "lampu jalan": "PJU",
        "saluran": "Saluran"
    }

    for kata, nilai in jenis_infrastruktur.items():
        if kata in text_lower:
            parameters["jenis_infrastruktur"] = nilai
            break

    # =========================
    # KONDISI INFRASTRUKTUR
    # =========================
    kondisi = {
        "baik": "Baik",
        "rusak": "Rusak",
        "sedang": "Sedang"
    }

    for kata, nilai in kondisi.items():
        if kata in text_lower:
            parameters["kondisi"] = nilai
            break

    # =========================
    # KESEJAHTERAAN
    # =========================
    kategori_kesejahteraan = {
        "stunting": "Stunting",
        "ibu hamil": "Ibu Hamil",
        "putus sekolah": "Putus Sekolah",
        "rutilahu": "RUTILAHU"
    }

    for kata, nilai in kategori_kesejahteraan.items():
        if kata in text_lower:
            parameters["kategori_kesejahteraan"] = nilai
            break

    # =========================
    # JABATAN PEGAWAI
    # =========================
    jabatan_map = {
        "lurah": "Lurah",
        "sekretaris": "Sekretaris",
        "kasi pemerintahan": "Kasi Pemerintahan",
        "kasi kesejahteraan": "Kasi Kesejahteraan",
        "kasi pelayanan": "Kasi Pelayanan",
        "staff": "Staff",
        "staf": "Staff"
    }

    for kata, nilai in jabatan_map.items():
        pola = r"\b" + re.escape(kata) + r"\b"
        if re.search(pola, text_lower):
            parameters["jabatan"] = nilai
            break

    # =========================
    # JENIS SURAT
    # =========================
    jenis_surat_map = {
        "surat masuk": "Masuk",
        "surat keluar": "Keluar",
        "surat pengantar": "Pengantar",
        "surat keterangan": "Keterangan"
    }

    for kata, nilai in jenis_surat_map.items():
        if kata in text_lower:
            parameters["jenis_surat"] = nilai
            break

    # =========================
    # ASAL SURAT
    # =========================
    asal_surat_map = {
        "kecamatan tandes": "Kecamatan Tandes",
        "dinas sosial": "Dinas Sosial",
        "kelurahan manukan kulon": "Kelurahan Manukan Kulon"
    }

    asal_match = re.search(
        r"(?:dari|asal(?:nya)?(?: surat)?(?: adalah)?)\s+"
        r"(kecamatan tandes|dinas sosial|kelurahan manukan kulon)",
        text_lower
    )

    if asal_match:
        parameters["asal_surat"] = asal_surat_map[asal_match.group(1)]

    # =========================
    # TUJUAN SURAT
    # =========================
    tujuan_surat_map = {
        "kecamatan tandes": "Kecamatan Tandes",
        "dinas sosial": "Dinas Sosial",
        "kelurahan manukan kulon": "Kelurahan Manukan Kulon"
    }

    tujuan_match = re.search(
        r"(?:ke|tujuan(?:nya)?(?: surat)?(?: adalah)?)\s+"
        r"(kecamatan tandes|dinas sosial|kelurahan manukan kulon)",
        text_lower
    )

    if tujuan_match:
        parameters["tujuan_surat"] = tujuan_surat_map[tujuan_match.group(1)]

    # =========================
    # NOMOR SURAT
    # =========================
    nomor_surat_match = re.search(
        r"\b\d{3}/[A-Za-z]+/[IVXLCDM]+/\d{4}\b",
        text
    )

    if nomor_surat_match:
        parameters["nomor_surat"] = nomor_surat_match.group(0).upper()

    # =========================
    # KATEGORI AGENDA
    # =========================
    kategori_agenda_map = {
        "rapat": "Rapat",
        "sosialisasi": "Sosialisasi",
        "posyandu": "Posyandu",
        "kerja bakti": "Kerja Bakti",
        "musyawarah": "Musyawarah"
    }

    for kata, nilai in kategori_agenda_map.items():
        if kata in text_lower:
            parameters["kategori_agenda"] = nilai
            break

    # =========================
    # HUBUNGAN (AHLI WARIS)
    # =========================
    hubungan_map = {
        "anak": "Anak",
        "istri": "Istri",
        "suami": "Suami",
        "orang tua": "Orang Tua",
        "saudara": "Saudara"
    }

    for kata, nilai in hubungan_map.items():
        if kata in text_lower:
            parameters["hubungan"] = nilai
            break

    # Status pegawai
    status_pegawai = {
        "asn": "ASN",
        "pppk": "PPPK"
    }

    for kata, nilai in status_pegawai.items():
        if re.search(r"\b" + re.escape(kata) + r"\b", text_lower):
            parameters["status_pegawai"] = nilai
            break


    # Kategori agenda
    kategori_agenda = {
        "agenda kelurahan": "Kelurahan",
        "agenda pkk": "PKK",
        "pkk": "PKK"
    }

    for kata, nilai in kategori_agenda.items():
        if kata in text_lower:
            parameters["kategori_agenda"] = nilai
            break
    return parameters


if __name__ == "__main__":

    contoh_pertanyaan = [
        "Tampilkan penduduk perempuan di RW 05",
        "Siapa saja warga laki-laki di RT 12?",
        "Berapa CCTV yang rusak di RW 03?",
        "Tampilkan PJU yang kondisinya baik",
        "Ada berapa kasus stunting di RW 07?",
        "Cari data penduduk bernama Siti",
        "Siapa ahli waris almarhum sebagai anak?",
        "Tampilkan pegawai dengan jabatan lurah",
        "Ada surat masuk hari ini?",
        "Ada agenda rapat minggu ini?",
        "Tampilkan surat dari Kecamatan Tandes",
        "Tampilkan surat ke Kecamatan Tandes",
        "Tampilkan surat keluar ke Kecamatan Tandes",
        "Tampilkan surat dengan nomor 001/UND/IX/2026",
    ]

    print("=== TEST EKSTRAKSI PARAMETER ===")

    for pertanyaan in contoh_pertanyaan:

        hasil = extract_parameters(pertanyaan)

        print("\nPertanyaan :", pertanyaan)
        print("Parameter  :", hasil)
