import { useState } from "react";
import logoSadeka from "../assets/logo_sadeka.png";
import adIcon from "../assets/ad.png";
import SideBar from "./sidebarmenu";
import Header from "./header";

function AsistenData() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [tentangOpen, setTentangOpen] = useState(false);

  const contohPertanyaan = [
    "Berapa jumlah penduduk per RW?",
    "Jumlah surat masuk hari ini",
    "Agenda kegiatan bulan ini",
    "Jumlah rumah tidak layak huni",
    "Daftar UMKM yang memiliki NIB",
  ];

  const handleQuestionClick = (text) => {
    setQuestion(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    console.log("Pertanyaan:", question);

    // Nanti bisa dihubungkan ke proses NLP / Asisten Data
  };

  return (
    <div className="asisten-page">
      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Header
        title="Asisten Data"
        showSearch={false}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />

      {/* CONTENT */}
      <main className="asisten-content">

        {/* INFO */}
        <button
          className="asisten-info-button"
          type="button"
          onClick={() => setTentangOpen(true)}
          aria-label="Tentang Asisten Data"
        >
          i
        </button>

        {/* CONTOH PERTANYAAN */}
        <section className="contoh-pertanyaan-card">
          <h2>Contoh pertanyaan</h2>

          <div className="contoh-pertanyaan-list">
            {contohPertanyaan.map((item, index) => (
              <button
                key={index}
                type="button"
                className="contoh-pertanyaan-item"
                onClick={() => handleQuestionClick(item)}
              >
                <img className="question-icon" src={adIcon} alt="" />

                <span className="question-text">
                  {item}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* BAGIAN TENGAH */}
        <section className="asisten-center">

          {/* LOGO */}
          <div className="asisten-logo">
            <img src={logoSadeka} alt="Logo SADEKA" />
          </div>

          <h2 className="asisten-title">
            <span className="sparkle">✦</span>
            Asisten Data SADEKA
          </h2>

          <p className="asisten-description">
            Asisten AI untuk mencari
            <br />
            informasi dari data kelurahan.
          </p>
        </section>

        {/* INPUT PERTANYAAN */}
        <form
          className="asisten-question-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ketik pertanyaan anda di sini"
          />

          <button
            type="submit"
            className="asisten-send-button"
            aria-label="Kirim pertanyaan"
          >
            ➤
          </button>
        </form>

        {tentangOpen && (
          <div
            className="tentang-overlay"
            onClick={() => setTentangOpen(false)}
          >
            <div
              className="tentang-popup"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="tentang-asisten-title"
            >
              <div className="tentang-content">
                <div className="tentang-title">
                  <div className="tentang-info-icon">i</div>
                  <h2 id="tentang-asisten-title">
                    Tentang Asisten Data SADEKA
                  </h2>
                </div>

                <p className="tentang-description">
                  Asisten Data SADEKA adalah AI Asisten yang membantu anda
                  mencari informasi dan data kelurahan dengan cepat dan akurat
                </p>
              </div>

              <div className="tentang-footer">
                <div className="tentang-lock-icon" aria-hidden="true">
                  <span className="lock-shackle" />
                  <span className="lock-body" />
                  <span className="lock-keyhole" />
                </div>

                <p>
                  Data bersumber dari sistem SADEKA dan
                  <br />
                  bersifat internal
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default AsistenData;