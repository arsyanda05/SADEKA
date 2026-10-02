import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSadeka from "../assets/logo_sadeka.png";
import adIcon from "../assets/ad.png";
import SideBar from "./sidebarmenu";
import Header from "./header";

import { askAsistenData } from "../services/api";

function AsistenData() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [tentangOpen, setTentangOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const contohPertanyaan = [
    "Berapa jumlah penduduk?",
    "Berapa jumlah penduduk di RW 02?",
    "Agenda kegiatan bulan ini",
    "Jumlah rumah tidak layak huni",
    "Daftar UMKM yang memiliki NIB",
  ];

  const formatAnswer = (result, originalQuestion) => {
    if (!result) {
      return "Asisten Data tidak memberikan jawaban.";
    }

    const lowerQuestion =
      originalQuestion.toLowerCase();

    if (result.answer) {
      const answer = String(result.answer);

      if (
        Array.isArray(result.rows) &&
        result.rows.length > 0 &&
        /^Ditemukan\s+\d+\s+baris data\.\s*Kolom:\s*[\s\S]*$/i.test(
          answer.trim()
        )
      ) {
        return "";
      }

      const countMatch = answer.match(
        /Jumlah data yang sesuai:\s*(\d+)\.?/i
      );

      if (countMatch) {
        const jumlah = Number(countMatch[1]);

        /*
         * Pertanyaan jumlah penduduk berdasarkan RW
         */
        const rwMatch =
          lowerQuestion.match(
            /rw\s*0*(\d+)/i
          );

        if (
          lowerQuestion.includes("penduduk") &&
          rwMatch
        ) {
          const nomorRW = String(
            Number(rwMatch[1])
          ).padStart(2, "0");

          return `Jumlah penduduk di RW ${nomorRW} adalah ${jumlah.toLocaleString(
            "id-ID"
          )} jiwa.`;
        }

        /*
         * Jumlah seluruh penduduk
         */
        if (
          lowerQuestion.includes("penduduk")
        ) {
          return `Jumlah penduduk adalah ${jumlah.toLocaleString(
            "id-ID"
          )} jiwa.`;
        }

        return `Jumlah data yang sesuai adalah ${jumlah.toLocaleString(
          "id-ID"
        )}.`;
      }

      return answer;
    }

    return "Asisten Data tidak memberikan jawaban.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) {
      return;
    }

    /*
     * Tambahkan pertanyaan user ke chat
     */
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: cleanQuestion,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      console.log(
        "Pertanyaan Asisten Data:",
        cleanQuestion
      );

      const result =
        await askAsistenData(cleanQuestion);

      console.log(
        "Respons Asisten Data:",
        result
      );

      if (
        !result ||
        result.success !== true
      ) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Asisten Data gagal memberikan jawaban."
        );
      }

      const answer = formatAnswer(
        result,
        cleanQuestion
      );

      /*
       * Simpan hasil dari backend
       */
      const assistantMessage = {
        id: Date.now() + 1,
        type: "assistant",
        text: answer,
        columns: result.columns || [],
        rows: result.rows || [],
        intent: result.intent || "",
        question: cleanQuestion,
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(
        "Error Asisten Data:",
        error
      );

      const errorMessage = {
        id: Date.now() + 1,
        type: "assistant",
        text:
          error?.message ||
          "Terjadi kesalahan saat menghubungi Asisten Data.",
        isError: true,
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (text) => {
    setQuestion(text);
  };

  const formatColumnName = (column) => {
    if (!column) {
      return "";
    }

    const map = {
      id_penduduk: "ID",
      id_umkm: "ID",
      id_infrastruktur: "ID",

      nik: "NIK",
      nama: "Nama",
      tempat_lahir: "Tempat Lahir",
      tanggal_lahir: "Tanggal Lahir",
      jenis_kelamin: "Jenis Kelamin",
      alamat: "Alamat",
      rt: "RT",
      rw: "RW",
      status_penduduk: "Status",

      kategori: "Kategori",
      status: "Status",
      keterangan: "Keterangan",

      nama_usaha: "Nama Usaha",
      pemilik: "Pemilik",
      jenis_usaha: "Jenis Usaha",
      nib: "NIB",

      jenis: "Jenis",
      kondisi_status: "Kondisi",
      penanggung_jawab: "Penanggung Jawab",
      no_telp: "No. Telepon",

      tanggal: "Tanggal",
      kegiatan: "Kegiatan",
      PIC: "PIC",
      kategori_agenda: "Kategori",
    };

    return (
      map[column] ||
      column
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )
    );
  };

  const isUMKMResult = (message) => {
    if (!message) {
      return false;
    }

    if (
      message.intent === "data_umkm"
    ) {
      return true;
    }

    const question =
      message.question?.toLowerCase() || "";

    return question.includes("umkm");
  };

  const getDataPagePath = (message) => {
    const pathsByIntent = {
      data_penduduk: "/data-penduduk",
      data_kesejahteraan: "/kesejahteraan",
      data_umkm: "/umkm",
      data_infrastruktur: "/infrastruktur",
      data_pegawai: "/data-pegawai",
      data_agenda: "/agenda",
    };

    if (pathsByIntent[message.intent]) {
      return pathsByIntent[message.intent];
    }

    const question = message.question?.toLowerCase() || "";
    const pathsByKeyword = [
      ["penduduk", "/data-penduduk"],
      ["kesejahteraan", "/kesejahteraan"],
      ["umkm", "/umkm"],
      ["infrastruktur", "/infrastruktur"],
      ["pegawai", "/data-pegawai"],
      ["agenda", "/agenda"],
    ];

    return pathsByKeyword.find(([keyword]) =>
      question.includes(keyword)
    )?.[1];
  };

  const renderUMKMTable = (message) => {
    const rows = message.rows || [];

    if (rows.length === 0) {
      return null;
    }

    const columns = [
      {
        key: "nama_usaha",
        index: 1,
        label: "Nama Usaha",
      },
      {
        key: "pemilik",
        index: 2,
        label: "Pemilik",
      },
      {
        key: "jenis_usaha",
        index: 3,
        label: "Jenis Usaha",
      },
      {
        key: "rt",
        index: 6,
        label: "RT",
      },
      {
        key: "rw",
        index: 7,
        label: "RW",
      },
      {
        key: "nib",
        index: 4,
        label: "NIB",
      },
    ];

    const question =
      message.question?.toLowerCase() || "";

    let jenisUsahaText = "";

    const jenisUsaha = [
      "kuliner",
      "makanan",
      "jasa",
      "retail",
      "perdagangan",
    ];

    for (const jenis of jenisUsaha) {
      if (question.includes(jenis)) {
        jenisUsahaText = jenis;
        break;
      }
    }

    let judul;

    if (jenisUsahaText) {
      judul = `Berikut daftar UMKM dengan jenis usaha ${jenisUsahaText} di kelurahan ini`;
    } else {
      judul =
        "Berikut daftar UMKM di kelurahan ini";
    }

    return (
      <div
        style={{
          marginTop: "18px",
          backgroundColor: "#ffffff",
          border: "1px solid #a7a7a7",
          borderRadius: "12px",
          padding: "20px 16px 14px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {/* ================================================
            JUDUL
        ================================================= */}

        <div
          style={{
            fontSize: "16px",
            color: "#111",
            marginBottom: "16px",
            paddingLeft: "14px",
          }}
        >
          {judul}
        </div>

        {/* ================================================
            TABLE
        ================================================= */}

        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#dce7f8",
                }}
              >
                <th
                  style={{
                    width: "8%",
                    border: "1px solid #c1c1c1",
                    padding: "9px 5px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#111",
                  }}
                >
                  No
                </th>

                {columns.map(
                  (column) => (
                    <th
                      key={column.key}
                      style={{
                        border:
                          "1px solid #c1c1c1",
                        padding:
                          "9px 6px",
                        textAlign:
                          "center",
                        fontWeight:
                          "600",
                        color:
                          "#111",
                      }}
                    >
                      {column.label}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map(
                (row, rowIndex) => (
                  <tr
                    key={rowIndex}
                  >
                    {/* NO */}
                    <td
                      style={{
                        border:
                          "1px solid #d0d0d0",
                        padding:
                          "9px 5px",
                        textAlign:
                          "center",
                      }}
                    >
                      {rowIndex + 1}
                    </td>

                    {columns.map(
                      (column) => (
                        <td
                          key={
                            column.key
                          }
                          style={{
                            border:
                              "1px solid #d0d0d0",
                            padding:
                              "9px 8px",
                            textAlign:
                              "center",
                            color:
                              "#111",
                            wordBreak:
                              "break-word",
                          }}
                        >
                          {row[
                            column.index
                          ] ===
                            null ||
                          row[
                            column.index
                          ] ===
                            undefined
                            ? "-"
                            : String(
                                row[
                                  column.index
                                ]
                              )}
                        </td>
                      )
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* ================================================
            FOOTER
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginTop: "12px",
            padding:
              "0 10px",
            gap: "15px",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              fontWeight: "500",
              color: "#111",
            }}
          >
            Menampilkan{" "}
            {rows.length} data
            {jenisUsahaText
              ? ` UMKM ${jenisUsahaText}`
              : " UMKM"}
          </div>

          <button
            type="button"
            style={{
              border: "none",
              background:
                "transparent",
              color: "#1976d2",
              fontSize: "15px",
              cursor:
                "pointer",
              padding: "4px 0",
              whiteSpace:
                "nowrap",
            }}
            onClick={() => navigate("/umkm")}
          >
            Lihat semua data
          </button>
        </div>
      </div>
    );
  };

  const renderGeneralTable = (message) => {
    const columns =
      message.columns || [];

    const rows =
      message.rows || [];

    if (
      rows.length === 0
    ) {
      return null;
    }

    if (
      columns.length === 1 &&
      columns[0] === "jumlah"
    ) {
      return null;
    }

    const dataPagePath = getDataPagePath(message);

    return (
      <div
        style={{
          marginTop: "18px",
          backgroundColor: "#ffffff",
          border: "1px solid #a7a7a7",
          borderRadius: "12px",
          padding: "20px 16px 14px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            color: "#111",
            marginBottom: "16px",
            paddingLeft: "14px",
          }}
        >
          Berikut data yang sesuai
        </div>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: `${(columns.length + 1) * 110}px`,
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#dce7f8",
                }}
              >
                <th
                  style={{
                    width: "8%",
                    border: "1px solid #c1c1c1",
                    padding: "9px 5px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#111",
                  }}
                >
                  No
                </th>

                {columns.map(
                  (column) => (
                    <th
                      key={column}
                      style={{
                        border: "1px solid #c1c1c1",
                        padding: "9px 6px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#111",
                      }}
                    >
                      {formatColumnName(
                        column
                      )}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map(
                (
                  row,
                  rowIndex
                ) => (
                  <tr
                    key={
                      rowIndex
                    }
                  >
                    <td
                      style={{
                        border: "1px solid #d0d0d0",
                        padding: "9px 5px",
                        textAlign: "center",
                      }}
                    >
                      {rowIndex +
                        1}
                    </td>

                    {row.map(
                      (
                        value,
                        columnIndex
                      ) => (
                        <td
                          key={
                            columnIndex
                          }
                          style={{
                            border: "1px solid #d0d0d0",
                            padding: "9px 8px",
                            textAlign: "center",
                            color: "#111",
                            wordBreak: "break-word",
                          }}
                        >
                          {value ===
                            null ||
                          value ===
                            undefined
                            ? "-"
                            : String(
                                value
                              )}
                        </td>
                      )
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "12px",
            padding: "0 10px",
            gap: "15px",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              fontWeight: "500",
              color: "#111",
            }}
          >
            Menampilkan {rows.length} data
          </div>

          {dataPagePath && (
            <button
              type="button"
              style={{
                border: "none",
                background: "transparent",
                color: "#1976d2",
                fontSize: "15px",
                cursor: "pointer",
                padding: "4px 0",
                whiteSpace: "nowrap",
              }}
              onClick={() => navigate(dataPagePath)}
            >
              Lihat semua data
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderDataResult = (message) => {
    if (
      !message.rows ||
      message.rows.length === 0
    ) {
      return null;
    }

    /*
     * Khusus UMKM gunakan
     * desain seperti gambar kedua.
     */
    if (
      isUMKMResult(message)
    ) {
      return renderUMKMTable(
        message
      );
    }

    /*
     * Data selain UMKM
     * menggunakan tabel umum.
     */
    return renderGeneralTable(
      message
    );
  };

  return (
    <div className="asisten-page">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <SideBar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header
        title="Asisten Data"
        showSearch={false}
        onMenuClick={() =>
          setSidebarOpen(
            (prev) => !prev
          )
        }
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="asisten-content">
        {/* INFO */}
        <button
          className="asisten-info-button"
          type="button"
          onClick={() =>
            setTentangOpen(true)
          }
          aria-label="Tentang Asisten Data"
        >
          i
        </button>

        {/* ===================================================
            CONTOH PERTANYAAN
        =================================================== */}

        {messages.length === 0 && (
          <section className="contoh-pertanyaan-card">
            <h2>
              Contoh pertanyaan
            </h2>

            <div className="contoh-pertanyaan-list">
              {contohPertanyaan.map(
                (
                  item,
                  index
                ) => (
                  <button
                    key={
                      index
                    }
                    type="button"
                    className="contoh-pertanyaan-item"
                    onClick={() =>
                      handleQuestionClick(
                        item
                      )
                    }
                    disabled={
                      loading
                    }
                  >
                    <img
                      className="question-icon"
                      src={
                        adIcon
                      }
                      alt=""
                    />

                    <span className="question-text">
                      {
                        item
                      }
                    </span>
                  </button>
                )
              )}
            </div>
          </section>
        )}

        {/* ===================================================
            WELCOME
        =================================================== */}

        {messages.length === 0 && (
          <section className="asisten-center">
            <div className="asisten-logo">
              <img
                src={
                  logoSadeka
                }
                alt="Logo SADEKA"
              />
            </div>

            <h2 className="asisten-title">
              <span className="sparkle">
                ✦
              </span>
              Asisten Data SADEKA
            </h2>

            <p className="asisten-description">
              Asisten AI untuk
              mencari
              <br />
              informasi dari
              data kelurahan.
            </p>
          </section>
        )}

        {/* ===================================================
            CHAT
        =================================================== */}

        {messages.length > 0 && (
          <section
            className="asisten-chat-container"
            style={{
              width:
                "100%",
              flex:
                "1",
              overflowY:
                "auto",
              padding:
                "25px 25px 110px",
              boxSizing:
                "border-box",
            }}
          >
            {messages.map(
              (message) => {
                /* USER */
                if (
                  message.type ===
                  "user"
                ) {
                  return (
                    <div
                      key={
                        message.id
                      }
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "flex-end",
                        marginBottom:
                          "18px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            "#80A9E5",
                          border:
                            "1px solid #4E78B5",
                          borderRadius:
                            "14px",
                          padding:
                            "13px 18px",
                          maxWidth:
                            "55%",
                          color:
                            "#111",
                          fontSize:
                            "15px",
                          lineHeight:
                            "1.4",
                        }}
                      >
                        {
                          message.text
                        }
                      </div>
                    </div>
                  );
                }

                /* ASISTEN */
                return (
                  <div
                    key={
                      message.id
                    }
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "flex-start",
                      marginBottom:
                        "22px",
                    }}
                  >
                    <div
                      style={{
                        width:
                          "100%",
                        maxWidth:
                          "1050px",
                      }}
                    >
                      {/* JAWABAN */}
                      {message.text && (
                        <div
                          style={{
                            backgroundColor:
                              message.isError
                                ? "#ffe5e5"
                                : "#ffffff",
                            border:
                              message.isError
                                ? "1px solid #e57373"
                                : "1px solid #999",
                            borderRadius:
                              "14px",
                            padding:
                              "18px 22px",
                            color:
                              "#222",
                            fontSize:
                              "16px",
                            lineHeight:
                              "1.5",
                            boxSizing:
                              "border-box",
                          }}
                        >
                          {message.text}
                        </div>
                      )}

                      {/* TABEL */}
                      {renderDataResult(
                        message
                      )}
                    </div>
                  </div>
                );
              }
            )}

            {/* LOADING */}
            {loading && (
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-start",
                  marginBottom:
                    "20px",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      "#ffffff",
                    border:
                      "1px solid #999",
                    borderRadius:
                      "14px",
                    padding:
                      "13px 18px",
                    color:
                      "#666",
                    fontSize:
                      "14px",
                  }}
                >
                  Asisten Data sedang
                  memproses...
                </div>
              </div>
            )}
          </section>
        )}

        {/* ===================================================
            INPUT
        =================================================== */}

        <form
          className="asisten-question-form"
          onSubmit={
            handleSubmit
          }
        >
          <input
            type="text"
            value={
              question
            }
            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }
            placeholder="Ketik pertanyaan anda di sini"
            disabled={
              loading
            }
          />

          <button
            type="submit"
            className="asisten-send-button"
            aria-label="Kirim pertanyaan"
            disabled={
              loading ||
              !question.trim()
            }
          >
            {loading
              ? "..."
              : "➤"}
          </button>
        </form>

        {/* ===================================================
            TENTANG
        =================================================== */}

        {tentangOpen && (
          <div
            className="tentang-overlay"
            onClick={() =>
              setTentangOpen(
                false
              )
            }
          >
            <div
              className="tentang-popup"
              onClick={(e) =>
                e.stopPropagation()
              }
              role="dialog"
              aria-modal="true"
              aria-labelledby="tentang-asisten-title"
            >
              <div className="tentang-content">
                <div className="tentang-title">
                  <div className="tentang-info-icon">
                    i
                  </div>

                  <h2 id="tentang-asisten-title">
                    Tentang Asisten Data
                    SADEKA
                  </h2>
                </div>

                <p className="tentang-description">
                  Asisten Data SADEKA
                  adalah AI Asisten yang
                  membantu anda mencari
                  informasi dan data
                  kelurahan dengan cepat
                  dan akurat
                </p>
              </div>

              <div className="tentang-footer">
                <div
                  className="tentang-lock-icon"
                  aria-hidden="true"
                >
                  <span className="lock-shackle" />
                  <span className="lock-body" />
                  <span className="lock-keyhole" />
                </div>

                <p>
                  Data bersumber dari
                  sistem SADEKA dan
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