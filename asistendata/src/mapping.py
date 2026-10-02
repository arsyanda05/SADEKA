INTENT_MAPPING = {

    "jumlah_penduduk": {
        "table": "penduduk",
        "alias": "p",
        "columns": [
            "id_penduduk", "nik", "nama", "tempat_lahir", "tanggal_lahir",
            "jenis_kelamin", "alamat", "rt", "rw", "status_penduduk"
        ],
        "param_columns": {
            "rw": "p.rw",
            "rt": "p.rt",
            "jenis_kelamin": "p.jenis_kelamin",
            "status_penduduk": "p.status_penduduk",
            "nama": "p.nama"
        },
        "like_params": ["nama"]
    },

    "jumlah_rw": {
        "table": "penduduk",
        "alias": "p",
        "columns": ["rw"],
        "param_columns": {},
        "like_params": []
    },

    "jumlah_rt": {
        "table": "penduduk",
        "alias": "p",
        "columns": ["rt"],
        "param_columns": {},
        "like_params": []
    },

    "data_penduduk": {
        "table": "penduduk",
        "alias": "p",
        "columns": [
            "id_penduduk", "nik", "nama", "tempat_lahir", "tanggal_lahir",
            "jenis_kelamin", "alamat", "rt", "rw", "status_penduduk"
        ],
        "param_columns": {
            "rw": "p.rw",
            "rt": "p.rt",
            "jenis_kelamin": "p.jenis_kelamin",
            "status_penduduk": "p.status_penduduk",
            "nama": "p.nama"
        },
        "like_params": ["nama"]
    },

    "data_kesejahteraan": {
        "table": "kesejahteraan",
        "alias": "k",
        "columns": [
            "k.id_kesejahteraan", "k.id_penduduk", "p.nama", "p.rt", "p.rw",
            "k.kategori", "k.status", "k.keterangan"
        ],
        "join": "JOIN penduduk p ON k.id_penduduk = p.id_penduduk",
        "param_columns": {
            "rw": "p.rw",
            "rt": "p.rt",
            "kategori_kesejahteraan": "k.kategori"
        },
        "like_params": []
    },

    "data_umkm": {
        "table": '"uMKM"',
        "alias": None,
        "columns": [
            "id_umkm", "nama_usaha", "pemilik", "jenis_usaha", "nib",
            "alamat", "rt", "rw"
        ],
        "param_columns": {
            "rw": "rw",
            "rt": "rt"
        },
        "like_params": []
    },

    "data_infrastruktur": {
        "table": "infrastruktur",
        "alias": "i",
        "columns": [
            "id_infrastruktur", "jenis", "foto", "alamat", "latitude",
            "longitude", "kondisi_status", "rt", "rw", "penanggung_jawab",
            "no_telp", "panjang", "lebar", "tanggal_pengadaan"
        ],
        "param_columns": {
            "rw": "i.rw",
            "rt": "i.rt",
            "jenis_infrastruktur": "i.jenis",
            "kondisi": "i.kondisi_status"
        },
        "like_params": []
    },

    "data_pegawai": {
        "table": "pegawai",
        "alias": "pg",
        "columns": [
            "id_pegawai", "nama", '"NIP"', "jabatan", "status",
            "email_pribadi", "email_pemerintahan", "no_telepon",
            "alamat_domisili"
        ],
        "param_columns": {
            "jabatan": "pg.jabatan",
            "status_pegawai": "pg.status"
        },
        "like_params": []
    },

    "data_agenda": {
        "table": "agenda",
        "alias": "a",
        "columns": [
            "id_agenda", "tanggal", "jam", "kegiatan", '"PIC"', "kategori",
            "pengingat_menit", "waktu_pengingat"
        ],
        "param_columns": {
            "kategori_agenda": "a.kategori"
        },
        "like_params": []
    },

    "data_surat": {
        "table": "surat",
        "alias": None,
        "columns": [
            "id_surat", "tanggal", "jenis", "asal", "tujuan", "keterangan",
            "nomor_surat"
        ],
        "param_columns": {
            "jenis_surat": "jenis",
            "asal_surat": "asal",
            "tujuan_surat": "tujuan",
            "nomor_surat": "nomor_surat"
        },
        "like_params": []
    },

    "data_dokumen": {
        "table": "dokumen",
        "alias": None,
        "columns": [
            "id_dokumen", "id_surat", "id_surat_ahli_waris",
            "nama_dokumen_file", "jenis_dokumen", "path_file", "hasil_OCR",
            "tanggal_upload"
        ],
        "param_columns": {},
        "like_params": []
    },

    "data_ahli_waris": {
        "table": "ahli_waris",
        "alias": None,
        "columns": [
            "id_ahli_waris", "id_surat_ahli_waris", "id_penduduk", "hubungan"
        ],
        "param_columns": {
            "hubungan": "hubungan"
        },
        "like_params": []
    },

    "data_tracking_surat": {
        "table": "tracking_surat",
        "alias": None,
        "columns": [
            "id_tracking", "id_surat_ahli_waris", "waktu", "keterangan"
        ],
        "param_columns": {},
        "like_params": []
    },

    "data_histori_penduduk": {
        "table": "histori_penduduk",
        "alias": None,
        "columns": [
            "id_histori", "id_penduduk", "id_user", "status_lama",
            "status_baru", "waktu_perubahan", "keterangan"
        ],
        "param_columns": {},
        "like_params": []
    }
}


if __name__ == "__main__":

    print("=== TEST MAPPING ===")

    for intent, data in INTENT_MAPPING.items():

        print(f"\nIntent : {intent}")
        print(f"Tabel  : {data['table']}")
        print(f"Parameter yang didukung : {list(data['param_columns'].keys())}")
