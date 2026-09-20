import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "./sidebarmenu";
import DetailInfrastruktur from "./detailinfrastruktur";
import Header from "./header";
import inf1Icon from "../assets/inf1.png";
import inf2Icon from "../assets/inf2.png";
import inf3Icon from "../assets/inf3.png";
import inf4Icon from "../assets/inf4.png";


function Infrastruktur() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [kategori, setKategori] = useState("");

  const [wilayah, setWilayah] = useState("");
  const [wilayahOpen, setWilayahOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [kategoriOpen, setKategoriOpen] = useState(false);
  const [hoveredRW, setHoveredRW] = useState(null);
  const [selectedRT, setSelectedRT] = useState("");
  
  const [jenis, setJenis] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!params.id) {
      setSelectedInfrastructure(null);
      return;
    }

    const selected = dataInfrastruktur.find((item) => item.no === params.id);
    setSelectedInfrastructure(selected ?? null);
  }, [params.id]);

  const closeSidebar = () => setSidebarOpen(false);

  const dataInfrastruktur = [
    {
      no: "001",
      jenis: "CCTV",
      kondisi: "Baik",
      pic: "Setyo",
      telepon: "081963542083",
      rt: "02",
      rw: "01",
      alamat:
        "Jl. Manukan Asri No.I-A, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
    },
    {
      no: "002",
      jenis: "PJU",
      kondisi: "Baik",
      pic: "Bambang",
      telepon: "088863542099",
      rt: "16",
      rw: "03",
      alamat:
        "Jl. Manukan Asri No. 16, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
    },
    {
      no: "003",
      jenis: "CCTV",
      kondisi: "Rusak Ringan",
      pic: "Rini",
      telepon: "085263542081",
      rt: "19",
      rw: "04",
      alamat:
        "Jl. Manukan Asri No. 19, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
    },
    {
      no: "004",
      jenis: "Saluran",
      kondisi: "Rusak Ringan",
      pic: "Hadi",
      telepon: "081977512083",
      rt: "23",
      rw: "05",
      alamat:
        "Jl. Manukan Subur No. 08, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
    },
    {
      no: "005",
      jenis: "CCTV",
      kondisi: "Rusak Berat",
      pic: "Julia",
      telepon: "081263549001",
      rt: "06",
      rw: "02",
      alamat:
        "Jl. Manukan Krajan No. 02, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185",
    },
  ];

  const wilayahData = {
  "01": ["01", "02", "03", "04", "05"],
  "02": ["06", "07", "08", "09", "10"],
  "03": ["11", "12", "13", "14", "15"],
  "04": ["16", "17", "18", "19", "20"],
  "05": ["21", "22", "23", "24", "25"],
  "06": ["26", "27", "28", "29", "30"],
  "07": ["31", "32", "33", "34", "35"],
  "08": ["36", "37", "38", "39", "40"],
  "09": ["41", "42", "43", "44", "45"],
  "10": ["46", "47", "48", "49", "50"],
  "11": ["51", "52", "53", "54", "55"],
  "12": ["56", "57", "58", "59", "60"],
  "13": ["61", "62", "63", "64", "65"],
  "14": ["66", "67", "68", "69", "70"],
  "15": ["71", "72", "73", "74", "75"],
  };

  const filteredData = dataInfrastruktur.filter((item) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      item.no.toLowerCase().includes(keyword) ||
      item.jenis.toLowerCase().includes(keyword) ||
      item.kondisi.toLowerCase().includes(keyword) ||
      item.pic.toLowerCase().includes(keyword) ||
      item.telepon.toLowerCase().includes(keyword) ||
      item.rt.toLowerCase().includes(keyword) ||
      item.rw.toLowerCase().includes(keyword) ||
      item.alamat.toLowerCase().includes(keyword);

    const matchesWilayah = wilayah === "" || item.rw === wilayah;
    const matchesRT =
      selectedRT === "" || item.rt === selectedRT;
    const matchesJenis = jenis === "" || item.jenis === jenis;
    const matchesKondisi = kondisi === "" || item.kondisi === kondisi;
    const matchesStatus = status === "" || item.status === status;

    return matchesSearch && matchesWilayah && matchesRT && matchesJenis && matchesKondisi && matchesStatus;
  });

  return (
    <div className="infrastruktur-page">
      <SideBar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* MAIN */}
      <main className="infrastruktur-main">
        <Header
          title="Infrastruktur"
          showSearch={true}
          searchValue={search}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <section className="infrastruktur-content">
          <div className="top-action">
            <button
              type="button"
              className="add-infrastructure-button"
              onClick={() => navigate("/infrastruktur/tambah")}
            >
              <span>+</span>
              Tambah Infrastruktur
            </button>
          </div>

          {/* STATISTICS */}
          <div className="infrastructure-stats">
            <StatCard
              icon={<img src={inf1Icon} alt="" />}
              title="Infrastruktur"
              value="297"
              label="Total Infrastruktur"
            />
            <StatCard
              icon={<img src={inf2Icon} alt="" />}
              title="Saluran"
              value="117"
              label="Total Saluran"
            />
            <StatCard
              icon={<img src={inf3Icon} alt="" />}
              title="PJU"
              value="130"
              label="Total PJU"
            />
            <StatCard
              icon={<img src={inf4Icon} alt="" />}
              title="CCTV"
              value="50"
              label="Total CCTV"
            />
          </div>

          {/* TABLE */}
          <div className="infrastructure-table-card">
            <div className="table-top">
              <h2>Daftar Infrastruktur</h2>

              <div className="filter-wrapper">
                <span className="filter-label">Filter</span>

                {/* WILAYAH */}
                <div className="wilayah-dropdown">
                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => {
                      setWilayahOpen((prev) => !prev);
                      setStatusOpen(false);
                      setKategoriOpen(false);
                    }}
                  >
                    {wilayah ? `RW ${wilayah}` : "Wilayah"}
                    <span className="dropdown-arrow">▼</span>
                  </button>

                  {wilayahOpen && (
                    <div className="wilayah-menu">
                      <div
                        className="wilayah-item"
                        onMouseEnter={() => setHoveredRW(null)}
                        onClick={() => {
                          setWilayah("");
                          setSelectedRT("");
                          setWilayahOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        <span>Semua Wilayah</span>
                      </div>

                      {Object.keys(wilayahData)
                        .sort((a, b) => Number(a) - Number(b))
                        .map((rw) => (
                          <div
                            key={rw}
                            className="wilayah-item"
                            onMouseEnter={() => setHoveredRW(rw)}
                          >
                            <span>RW {rw}</span>
                            <span className="rw-arrow">›</span>

                            {hoveredRW === rw && (
                              <div className="rt-menu">
                                {wilayahData[rw].map((rt) => (
                                  <div
                                    key={rt}
                                    className="rt-item"
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      setWilayah(rw);
                                      setSelectedRT(rt);
                                      setWilayahOpen(false);
                                      setCurrentPage(1);
                                    }}
                                  >
                                    RT {rt}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* STATUS */}
                <div className="simple-dropdown">
                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => {
                      setStatusOpen((prev) => !prev);
                      setWilayahOpen(false);
                      setKategoriOpen(false);
                    }}
                  >
                    {status || "Status"}
                    <span className="dropdown-arrow">▼</span>
                  </button>

                  {statusOpen && (
                    <div className="simple-menu">
                      <div
                        className="simple-item"
                        onClick={() => {
                          setStatus("");
                          setStatusOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        Semua Status
                      </div>

                      <div
                        className="simple-item"
                        onClick={() => {
                          setStatus("Baik");
                          setStatusOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        Baik
                      </div>

                      <div
                        className="simple-item"
                        onClick={() => {
                          setStatus("Rusak Ringan");
                          setStatusOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        Rusak Ringan
                      </div>

                      <div
                        className="simple-item"
                        onClick={() => {
                          setStatus("Rusak Berat");
                          setStatusOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        Rusak Berat
                      </div>
                    </div>
                  )}
                </div>

                {/* KATEGORI */}
                <div className="simple-dropdown">
                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => {
                      setKategoriOpen((prev) => !prev);
                      setWilayahOpen(false);
                      setStatusOpen(false);
                    }}
                  >
                    {kategori || "Kategori"}
                    <span className="dropdown-arrow">▼</span>
                  </button>

                  {kategoriOpen && (
                    <div className="simple-menu">
                      <div
                        className="simple-item"
                        onClick={() => {
                          setKategori("");
                          setKategoriOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        Semua Kategori
                      </div>

                      <div
                        className="simple-item"
                        onClick={() => {
                          setKategori("Saluran");
                          setKategoriOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        Saluran
                      </div>

                      <div
                        className="simple-item"
                        onClick={() => {
                          setKategori("PJU");
                          setKategoriOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        PJU
                      </div>

                      <div
                        className="simple-item"
                        onClick={() => {
                          setKategori("CCTV");
                          setKategoriOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        CCTV
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="table-scroll">
              <table className="infrastructure-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Jenis</th>
                    <th>Kondisi</th>
                    <th>PIC</th>
                    <th>Nomor<br />Telepon</th>
                    <th>RT</th>
                    <th>RW</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.no}>
                        <td>{item.no}</td>
                        <td>{item.jenis}</td>
                        <td>
                          <span
                            className={`condition condition-${item.kondisi
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {item.kondisi}
                          </span>
                        </td>
                        <td>{item.pic}</td>
                        <td>{item.telepon}</td>
                        <td>{item.rt}</td>
                        <td>{item.rw}</td>
                        <td className="address-cell">{item.alamat}</td>
                        <td>
                          <button
                            type="button"
                            className="action-button"
                            aria-label={`Aksi ${item.no}`}
                            onClick={() => setSelectedInfrastructure(item)}
                          >
                            ⋮
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="empty-table">
                        Data infrastruktur tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <p>
                Menampilkan <strong>{filteredData.length > 0 ? "1" : "0"}-
                {filteredData.length}</strong> dari{" "}
                <strong>297</strong> Infrastruktur
              </p>

              <div className="pagination">
                <button
                  type="button"
                  className="page-prev"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                >
                  ← <span>Sebelumnya</span>
                </button>

                <button
                  type="button"
                  className={currentPage === 1 ? "page-active" : ""}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className={currentPage === 2 ? "page-active" : ""}
                >
                  2
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage(3)}
                  className={currentPage === 3 ? "page-active" : ""}
                >
                  3
                </button>

                <button
                  type="button"
                  className="page-next"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(3, page + 1))
                  }
                >
                  <span>Selanjutnya</span> →
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {selectedInfrastructure && (
        <DetailInfrastruktur
          data={selectedInfrastructure}
          onClose={() => setSelectedInfrastructure(null)}
        />
      )}
    </div>
  );
}

function StatCard({ icon, title, value, label }) {
  return (
    <div className="infrastructure-stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <h3>{title}</h3>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default Infrastruktur;
