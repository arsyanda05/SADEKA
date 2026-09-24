import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header";
import backIcon from "../assets/back.png";
import simpanDataIcon from "../assets/simpandata.png";

const documentRows = [
	["001", "SK Kenaikan Pangkat", "SK_KP_RezaSaputra.pdf", "10 April 2024, 09:30"],
	["002", "Ijazah Magister Bisnis Manajemen", "IjazahMagister.pdf", "12 Maret 2022, 07:30"],
	["003", "SK Jabatan Terakhir", "SK_Pengelola_IT_Data.pdf", "09 Mei 2020, 08:00"],
	["004", "Kartu NPWP Elektronik", "Kartu_NPWP_Elektronik.PNG", "02 Juli 2022, 09:30"],
	["005", "KK Legalisir", "KK_Legalisir_Dukcapil_2022.pdf", "01 Agustus 2022, 09:30"],
];

const trainingRows = [
	["001", "Diklat Transformasi Pelayanan Publik", "KemenPAN", "24 - 30 Juli 2025"],
	["002", "Pelatihan Kepemimpinan Administrator", "Pudiklat Kemendagri", "21 - 26 April 2024"],
	["003", "Bimbingan Teknis Pengelolaan Data", "BPSDM Kota", "12 - 15 Februari 2024"],
];

function UnggahDokumen() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [activeTab, setActiveTab] = useState(state?.tab || "dokumen");
	const [formData, setFormData] = useState({ jenisDokumen: "", berkas: null, tanggal: "", namaDiklat: "", tanggalDiklat: "", sertifikat: null, penyelenggara: "" });

	const handleChange = (event) => {
		const { name, value, files } = event.target;
		setFormData((previous) => ({ ...previous, [name]: files ? files[0] : value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		alert(activeTab === "dokumen" ? "Dokumen berhasil disimpan!" : "Riwayat diklat berhasil disimpan!");
	};

	return (
		<div className="unggah-dokumen-page">
			<Header title="Unggah Dokumen & Riwayat Diklat" showSearch={false} />
			<main className="unggah-dokumen-content">
				<div className="unggah-dokumen-back-wrapper">
					<button type="button" className="unggah-dokumen-back-button" onClick={() => navigate("/data-pegawai")}>
						<img src={backIcon} alt="" /> Kembali ke Data Pegawai
					</button>
				</div>

				<div className="unggah-dokumen-tabs">
					<button type="button" className={activeTab === "dokumen" ? "active" : ""} onClick={() => setActiveTab("dokumen")}>Unggah Dokumen</button>
					<button type="button" className={activeTab === "diklat" ? "active" : ""} onClick={() => setActiveTab("diklat")}>Riwayat Diklat</button>
				</div>

				<form className="unggah-dokumen-form" onSubmit={handleSubmit}>
					<section className="unggah-dokumen-card unggah-dokumen-form-card">
						<h2>{activeTab === "dokumen" ? "Dokumen Pegawai" : "Riwayat Diklat Pegawai"}</h2>
						{activeTab === "dokumen" ? (
							<div className="unggah-dokumen-fields">
								<div><label htmlFor="jenisDokumen">Jenis Dokumen Pegawai</label><input id="jenisDokumen" name="jenisDokumen" placeholder="Masukkan Jenis Dokumen disini" value={formData.jenisDokumen} onChange={handleChange} required /></div>
								<div><label htmlFor="berkas">Unggah Berkas</label><input id="berkas" name="berkas" type="file" onChange={handleChange} required /></div>
								<div><label htmlFor="tanggal">Tanggal Upload Berkas</label><input id="tanggal" name="tanggal" type="date" value={formData.tanggal} onChange={handleChange} required /></div>
								<div className="unggah-dokumen-checklist"><span>Checklist dokumen terunggah :</span>{["Ijazah & NPWP", "KTP", "SK Pengangkatan", "Kartu Pegawai / ID Card"].map((item) => <div key={item}><b>✓</b><span>{item}</span><small>Siap diunggah</small></div>)}</div>
							</div>
						) : (
							<div className="unggah-dokumen-fields">
								<div><label htmlFor="namaDiklat">Nama Diklat dan Sertifikasi</label><input id="namaDiklat" name="namaDiklat" placeholder="Masukkan Nama Diklat dan Sertifikasi" value={formData.namaDiklat} onChange={handleChange} required /></div>
								<div><label htmlFor="tanggalDiklat">Tanggal Pelaksanaan</label><input id="tanggalDiklat" name="tanggalDiklat" type="date" value={formData.tanggalDiklat} onChange={handleChange} required /></div>
								<div><label htmlFor="sertifikat">File Sertifikat Diklat</label><input id="sertifikat" name="sertifikat" type="file" onChange={handleChange} required /></div>
								<div><label htmlFor="penyelenggara">Keterangan / Lembaga Penyelenggara</label><textarea id="penyelenggara" name="penyelenggara" placeholder="Masukkan Keterangan / Lembaga Penyelenggara disini" value={formData.penyelenggara} onChange={handleChange} required /></div>
							</div>
						)}
						<div className="unggah-dokumen-form-footer"><span>Batal</span><button type="submit"><img src={simpanDataIcon} alt="" /> Simpan {activeTab === "dokumen" ? "Dokumen" : "Riwayat"}</button></div>
					</section>

					{activeTab === "dokumen" ? (
						<section className="unggah-dokumen-card unggah-dokumen-table-card infrastructure-table-card">
							<div className="table-top unggah-dokumen-table-top"><h2>Daftar Dokumen</h2></div>
							<div className="unggah-dokumen-table-scroll table-scroll"><table className="infrastructure-table unggah-dokumen-table"><thead><tr><th>Nomor</th><th>Jenis Dokumen</th><th>Nama Berkas dan Informasi</th><th>Tanggal Upload</th><th>Verifikasi</th></tr></thead><tbody>{documentRows.map((row) => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td><strong>{row[2]}</strong><small>Berikut file dokumen pegawai</small></td><td>{row[3]}<small>Oleh Nadia S (Sekretaris)</small></td><td><button type="button">Terverifikasi</button></td></tr>)}</tbody></table></div>
							<div className="table-footer unggah-dokumen-table-footer"><p>Menampilkan <strong>1-5</strong> dari <strong>10</strong> data dokumen</p><div className="pagination"><button type="button" disabled>← <span>Sebelumnya</span></button><button type="button" className="page-active">1</button><button type="button">2</button><button type="button"><span>Selanjutnya</span> →</button></div></div>
						</section>
					) : (
						<section className="unggah-dokumen-card unggah-dokumen-table-card infrastructure-table-card">
							<div className="table-top unggah-dokumen-table-top"><h2>Riwayat Diklat &amp; Pelatihan</h2></div>
							<div className="unggah-dokumen-table-scroll table-scroll"><table className="infrastructure-table unggah-dokumen-table unggah-diklat-table"><thead><tr><th>Nomor</th><th>Nama Diklat</th><th>Lembaga Penyelenggara</th><th>Tanggal Pelaksanaan</th><th>Status</th></tr></thead><tbody>{trainingRows.map((row) => <tr key={row[0]}><td>{row[0]}</td><td><strong>{row[1]}</strong></td><td>{row[2]}</td><td>{row[3]}</td><td><button type="button">✓ Bersertifikat</button></td></tr>)}</tbody></table></div>
							<div className="table-footer unggah-dokumen-table-footer"><p>Menampilkan <strong>1-3</strong> dari <strong>3</strong> data diklat</p><div className="pagination"><button type="button" disabled>← <span>Sebelumnya</span></button><button type="button" className="page-active">1</button><button type="button" disabled><span>Selanjutnya</span> →</button></div></div>
						</section>
					)}
				</form>
			</main>
		</div>
	);
}

export default UnggahDokumen;
