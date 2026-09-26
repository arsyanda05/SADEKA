import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Daftar from "./pages/daftar";
import LupaPassword from "./pages/lupapassword";

import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import DataPegawai from "./pages/datapegawai";
import TambahPegawai from "./pages/tambahpegawai";
import EditPegawai from "./pages/editpegawai";

import DataPenduduk from "./pages/datapenduduk";
import TambahPenduduk from "./pages/tambahpenduduk";
import EditPenduduk from "./pages/editpenduduk";

import Agenda from "./pages/agenda";
import TambahAgenda from "./pages/tambahagenda";

import SuratMasuk from "./pages/suratmasuk";
import TambahSuratMasuk from "./pages/tambahsuratmasuk";
import EditSuratMasuk from "./pages/editsuratmasuk";

import SuratKeluar from "./pages/suratkeluar";
import TambahSuratKeluar from "./pages/tambahsuratkeluar";
import EditSuratKeluar from "./pages/editsuratkeluar";

import SmartDocument from "./pages/smartdocument";

import Infrastruktur from "./pages/infrastruktur";
import DetailInfrastruktur from "./pages/detailinfrastruktur";
import TambahInfrastruktur from "./pages/tambahinfrastruktur";
import EditInfrastruktur from "./pages/editinfrastruktur";

import SuratAhliWaris from "./pages/suratahliwaris";
import TambahSuratAhliWaris from "./pages/tambahsuratahliwaris";
import EditSuratAhliWaris from "./pages/editsuratahliwaris";
import DetailSuratAhliWaris from "./pages/detailsuratahliwaris";

import UMKM from "./pages/umkm";
import TambahUMKM from "./pages/tambahumkm";
import EditUMKM from "./pages/editumkm";
import DetailUMKM from "./pages/detailumkm";

import Kesejahteraan from "./pages/kesejahteraan";
import TambahKesejahteraan from "./pages/tambahkesejahteraan";
import EditKesejahteraan from "./pages/editkesejahteraan";
import DetailKesejahteraan from "./pages/detailkesejahteraan";

import AsistenData from "./pages/asistendata";
import Pengaturan from "./pages/pengaturan";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/daftar"
          element={<Daftar />}
        />

        <Route
          path="/lupa-password"
          element={<LupaPassword />}
        />

        <Route element={<ProtectedRoute />}>

          {/* =========================
              DASHBOARD
          ========================= */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* =========================
              PEGAWAI
          ========================= */}

          <Route
            path="/data-pegawai"
            element={<DataPegawai />}
          />

          <Route
            path="/data-pegawai/tambah"
            element={<TambahPegawai />}
          />

          <Route
            path="/data-pegawai/:id/edit"
            element={<EditPegawai />}
          />

          {/* =========================
              PENDUDUK
          ========================= */}

          <Route
            path="/data-penduduk"
            element={<DataPenduduk />}
          />

          <Route
            path="/data-penduduk/tambah"
            element={<TambahPenduduk />}
          />

          <Route
            path="/data-penduduk/:id/edit"
            element={<EditPenduduk />}
          />

          {/* =========================
              AGENDA
          ========================= */}

          <Route
            path="/agenda"
            element={<Agenda />}
          />

          <Route
            path="/agenda/tambah"
            element={<TambahAgenda />}
          />

          <Route
            path="/agenda/:id/edit"
            element={<TambahAgenda />}
          />

          {/* =========================
              SURAT MASUK
          ========================= */}

          <Route
            path="/surat-masuk"
            element={<SuratMasuk />}
          />

          <Route
            path="/surat-masuk/tambah"
            element={<TambahSuratMasuk />}
          />

          <Route
            path="/surat-masuk/:id/edit"
            element={<EditSuratMasuk />}
          />

          {/* =========================
              SURAT KELUAR
          ========================= */}

          <Route
            path="/surat-keluar"
            element={<SuratKeluar />}
          />

          <Route
            path="/surat-keluar/tambah"
            element={<TambahSuratKeluar />}
          />

          <Route
            path="/surat-keluar/:id/edit"
            element={<EditSuratKeluar />}
          />

          {/* =========================
              SMART DOCUMENT
          ========================= */}

          <Route
            path="/smart-document"
            element={<SmartDocument />}
          />

          {/* =========================
              INFRASTRUKTUR
          ========================= */}

          <Route
            path="/infrastruktur"
            element={<Infrastruktur />}
          />

          <Route
            path="/infrastruktur/:id"
            element={<Infrastruktur />}
          />

          <Route
            path="/infrastruktur/tambah"
            element={<TambahInfrastruktur />}
          />

          <Route
            path="/infrastruktur/:id/edit"
            element={<EditInfrastruktur />}
          />

          {/* =========================
              SURAT AHLI WARIS
          ========================= */}

          <Route
            path="/surat-ahli-waris"
            element={<SuratAhliWaris />}
          />

          <Route
            path="/surat-ahli-waris/tambah"
            element={<TambahSuratAhliWaris />}
          />

          {/* EDIT SURAT AHLI WARIS */}
          <Route
            path="/surat-ahli-waris/:id/edit"
            element={<EditSuratAhliWaris />}
          />

          <Route
            path="/surat-ahli-waris/:id"
            element={<DetailSuratAhliWaris />}
          />

          {/* =========================
              UMKM
          ========================= */}

          <Route
            path="/umkm"
            element={<UMKM />}
          />

          <Route
            path="/umkm/tambah"
            element={<TambahUMKM />}
          />

          <Route
            path="/umkm/:id/edit"
            element={<EditUMKM />}
          />

          <Route
            path="/umkm/:id"
            element={<DetailUMKM />}
          />

          {/* =========================
              KESEJAHTERAAN
          ========================= */}

          <Route
            path="/kesejahteraan"
            element={<Kesejahteraan />}
          />

          <Route
            path="/kesejahteraan/tambah"
            element={<TambahKesejahteraan />}
          />

          <Route
            path="/kesejahteraan/:id/edit"
            element={<EditKesejahteraan />}
          />

          <Route
            path="/kesejahteraan/:id"
            element={<DetailKesejahteraan />}
          />

          {/* =========================
              ASISTEN DATA
          ========================= */}

          <Route
            path="/asisten-data"
            element={<AsistenData />}
          />

          {/* =========================
              PENGATURAN
          ========================= */}

          <Route
            path="/pengaturan"
            element={<Pengaturan />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;