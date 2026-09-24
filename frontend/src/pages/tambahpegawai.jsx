import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import backIcon from "../assets/back.png";
import simpanIcon from "../assets/simpan.png";
import simpanDataIcon from "../assets/simpandata.png";

const initialFormData = {
	nip: "", nama: "", status: "", jabatan: "", emailDinas: "", emailPribadi: "", telepon: "", alamat: "",
	namaDiklat: "", tanggalDiklat: "", sertifikat: null, penyelenggara: "", jenisDokumen: "", dokumen: null, tanggalUpload: "",
};

function TambahPegawai() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState(initialFormData);

	const handleChange = (event) => {
		const { name, value, files } = event.target;
		setFormData((previous) => ({ ...previous, [name]: files ? files[0] : value }));
	};

	const handleDraft = () => {
		console.log("Draft Pegawai:", formData);
		alert("Draft data pegawai berhasil disimpan!");
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Data Pegawai:", formData);
		alert("Data pegawai berhasil disimpan!");
		navigate("/data-pegawai");
	};

	return (
		<div className="tambah-pegawai-page">
			<Header title="Tambah Pegawai" showSearch={false} />
			<main className="tambah-pegawai-content">
				<div className="tambah-pegawai-back-wrapper">
					<button type="button" className="tambah-pegawai-back-button" onClick={() => navigate("/data-pegawai")}>
						<img src={backIcon} alt="" /> Kembali ke Data Pegawai
					</button>
				</div>

				<form className="tambah-pegawai-form" onSubmit={handleSubmit}>
					<div className="tambah-pegawai-layout">
						<div className="tambah-pegawai-left-column">
							<section className="tambah-pegawai-card">
								<h2>Biodata Pegawai</h2>
								<div className="tambah-pegawai-fields">
									<div className="pegawai-field full-field"><label htmlFor="nip">NIP (Nomor Induk Pegawai) <i>*</i></label><input id="nip" name="nip" placeholder="Masukkan NIP atau Nomor Induk Pegawai disini" value={formData.nip} onChange={handleChange} required /></div>
									<div className="pegawai-field full-field"><label htmlFor="nama">Nama Lengkap &amp; Gelar Akademik <i>*</i></label><input id="nama" name="nama" placeholder="Masukkan Nama Lengkap beserta Gelar Akademik disini" value={formData.nama} onChange={handleChange} required /></div>
									<div className="pegawai-field"><label htmlFor="status">Status <i>*</i></label><select id="status" name="status" value={formData.status} onChange={handleChange} required><option value="" disabled>Pilih Status disini</option><option value="PPPK">PPPK</option><option value="ASN">ASN</option></select></div>
									<div className="pegawai-field"><label htmlFor="jabatan">Jabatan <i>*</i></label><input id="jabatan" name="jabatan" placeholder="Masukkan Jabatan disini" value={formData.jabatan} onChange={handleChange} required /></div>
									<div className="pegawai-field"><label htmlFor="emailDinas">Email Dinas <i>*</i></label><input id="emailDinas" name="emailDinas" type="email" placeholder="Masukkan Email Dinas disini" value={formData.emailDinas} onChange={handleChange} required /></div>
									<div className="pegawai-field"><label htmlFor="emailPribadi">Email Pribadi</label><input id="emailPribadi" name="emailPribadi" type="email" placeholder="Masukkan Email Pribadi disini" value={formData.emailPribadi} onChange={handleChange} /></div>
									<div className="pegawai-field full-field"><label htmlFor="telepon">Nomor Telepon/WA aktif <i>*</i></label><input id="telepon" name="telepon" type="tel" placeholder="Masukkan Nomor Telepon/WA Aktif disini" value={formData.telepon} onChange={handleChange} required /></div>
									<div className="pegawai-field full-field"><label htmlFor="alamat">Alamat Domisili <i>*</i></label><textarea id="alamat" name="alamat" placeholder="Masukkan Alamat Lengkap Domisili disini" value={formData.alamat} onChange={handleChange} required /></div>
								</div>
							</section>

							<section className="tambah-pegawai-card diklat-card">
								<h2>Riwayat Diklat Pegawai</h2>
								<div className="tambah-pegawai-fields">
									<div className="pegawai-field full-field"><label htmlFor="namaDiklat">Nama Diklat dan Sertifikasi</label><input id="namaDiklat" name="namaDiklat" placeholder="Masukkan Nama Diklat dan Sertifikasi" value={formData.namaDiklat} onChange={handleChange} /></div>
									<div className="pegawai-field"><label htmlFor="tanggalDiklat">Tanggal Pelaksanaan</label><input id="tanggalDiklat" name="tanggalDiklat" type="date" value={formData.tanggalDiklat} onChange={handleChange} /></div>
									<div className="pegawai-field"><label htmlFor="sertifikat">File Sertifikat Diklat</label><input className="pegawai-file-input" id="sertifikat" name="sertifikat" type="file" onChange={handleChange} /></div>
									<div className="pegawai-field full-field"><label htmlFor="penyelenggara">Keterangan / Lembaga Penyelenggara</label><textarea id="penyelenggara" name="penyelenggara" placeholder="Masukkan Keterangan / Lembaga Penyelenggara disini" value={formData.penyelenggara} onChange={handleChange} /></div>
								</div>
							</section>
						</div>

						<section className="tambah-pegawai-card dokumen-card">
							<h2>Dokumen Pegawai</h2>
							<div className="tambah-pegawai-fields">
								<div className="pegawai-field full-field"><label htmlFor="jenisDokumen">Jenis Dokumen Pegawai</label><input id="jenisDokumen" name="jenisDokumen" placeholder="Masukkan Jenis Dokumen disini" value={formData.jenisDokumen} onChange={handleChange} /></div>
								<div className="pegawai-field full-field"><label htmlFor="dokumen">Unggah Berkas</label><input className="pegawai-file-input" id="dokumen" name="dokumen" type="file" onChange={handleChange} /></div>
								<div className="pegawai-field full-field"><label htmlFor="tanggalUpload">Tanggal Upload Berkas</label><input id="tanggalUpload" name="tanggalUpload" type="date" value={formData.tanggalUpload} onChange={handleChange} /></div>
							</div>
							<div className="dokumen-checklist"><span>Checklist dokumen terunggah :</span>{["Ijazah & NPWP", "KTP", "SK Pengangkatan", "Kartu Pegawai / ID Card"].map((item) => <div key={item}><b>✓</b><span>{item}</span><small>Siap diunggah</small></div>)}</div>
						</section>
					</div>

					<section className="tambah-pegawai-status-bar">
						<div><strong>Status Validasi: <b>Siap Disimpan</b></strong><small>Data Pegawai, Dokumen, dan Riwayat Diklat sudah terisi</small></div>
						<span>Terisi 100%</span>
						<button type="button" className="tambah-pegawai-draft-button" onClick={handleDraft}><img src={simpanIcon} alt="" />Simpan Draft</button>
						<button type="submit" className="tambah-pegawai-save-button"><img src={simpanDataIcon} alt="" />Simpan Data Pegawai</button>
					</section>
				</form>
			</main>
		</div>
	);
}

export default TambahPegawai;
