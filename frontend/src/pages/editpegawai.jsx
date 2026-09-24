import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header";
import backIcon from "../assets/back.png";
import hapusSampahIcon from "../assets/hapussampah.png";
import simpanDataIcon from "../assets/simpandata.png";

const emptyFormData = {
	nip: "",
	nama: "",
	status: "",
	jabatan: "",
	email: "",
	telepon: "",
	domisili: "",
};

function EditPegawai() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const pegawai = state?.pegawai;
	const [formData, setFormData] = useState(() => ({
		...emptyFormData,
		...(pegawai
			? {
				nip: pegawai.nip?.replace(/^NIP:/, "") || "",
				nama: pegawai.nama || "",
				status: pegawai.status || "",
				jabatan: pegawai.jabatan || "",
				email: pegawai.email || "",
				telepon: pegawai.telepon || "",
				domisili: pegawai.domisili || "",
			}
			: {}),
	}));

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((previous) => ({ ...previous, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Perubahan Data Pegawai:", formData);
		alert("Data pegawai berhasil diperbarui!");
		navigate("/data-pegawai");
	};

	const handleDelete = () => {
		const confirmed = window.confirm(`Hapus data pegawai ${formData.nama || "ini"}?`);
		if (confirmed) {
			navigate("/data-pegawai");
		}
	};

	return (
		<div className="tambah-pegawai-page edit-pegawai-page">
			<Header title="Edit Pegawai" showSearch={false} />
			<main className="tambah-pegawai-content">
				<div className="tambah-pegawai-back-wrapper">
					<button type="button" className="tambah-pegawai-back-button" onClick={() => navigate("/data-pegawai")}>
						<img src={backIcon} alt="" /> Kembali ke Data Pegawai
					</button>
				</div>

				<form className="tambah-pegawai-form" onSubmit={handleSubmit}>
					<section className="tambah-pegawai-card">
						<h2>Informasi Data Pegawai</h2>
						<div className="tambah-pegawai-fields">
							<div className="pegawai-field"><label htmlFor="nip">NIP (Nomor Induk Pegawai)</label><input id="nip" name="nip" value={formData.nip} onChange={handleChange} required /></div>
							<div className="pegawai-field"><label htmlFor="nama">Nama Lengkap &amp; Gelar Akademik</label><input id="nama" name="nama" value={formData.nama} onChange={handleChange} required /></div>
							<div className="pegawai-field"><label htmlFor="status">Status</label><select id="status" name="status" value={formData.status} onChange={handleChange} required><option value="" disabled>Pilih Status</option><option value="ASN">ASN</option><option value="PPPK">PPPK</option></select></div>
							<div className="pegawai-field"><label htmlFor="jabatan">Jabatan</label><input id="jabatan" name="jabatan" value={formData.jabatan} onChange={handleChange} required /></div>
							<div className="pegawai-field"><label htmlFor="email">Email Dinas</label><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
							<div className="pegawai-field"><label htmlFor="telepon">Nomor Telepon/WA Aktif</label><input id="telepon" name="telepon" type="tel" value={formData.telepon} onChange={handleChange} required /></div>
							<div className="pegawai-field full-field"><label htmlFor="domisili">Alamat Domisili</label><textarea id="domisili" name="domisili" value={formData.domisili} onChange={handleChange} required /></div>
						</div>
					</section>

					<section className="edit-penduduk-form-status edit-pegawai-form-status">
						<div><strong>Status Pengisian : Form Siap Disimpan</strong><span>Data tervalidasi oleh Sistem SADEKA</span></div>
						<b>Terisi 100%</b>
						<button type="button" className="edit-penduduk-delete-button" onClick={handleDelete}><img src={hapusSampahIcon} alt="" />Hapus Data Pegawai</button>
						<button type="submit" className="edit-penduduk-save-button"><img src={simpanDataIcon} alt="" />Simpan Data Pegawai</button>
					</section>
				</form>
			</main>
		</div>
	);
}

export default EditPegawai;