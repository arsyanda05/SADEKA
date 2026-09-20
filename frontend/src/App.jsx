import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Daftar from "./pages/daftar";
import LupaPassword from "./pages/lupapassword";
import Dashboard from "./pages/dashboard";
import Infrastruktur from "./pages/infrastruktur";
import DetailInfrastruktur from "./pages/detailinfrastruktur";
import TambahInfrastruktur from "./pages/tambahinfrastruktur";
import EditInfrastruktur from "./pages/editinfrastruktur";
import SuratAhliWaris from "./pages/suratahliwaris";
import TambahSuratAhliWaris from "./pages/tambahsuratahliwaris";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/daftar" element={<Daftar />} />

        <Route path="/lupa-password" element={<LupaPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/infrastruktur" element={<Infrastruktur />} />

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

        <Route
          path="/surat-ahli-waris"
          element={<SuratAhliWaris />}
        />

        <Route
          path="/surat-ahli-waris/tambah"
          element={<TambahSuratAhliWaris />}
        />

        <Route
          path="/surat-ahli-waris/:id"
          element={<DetailSuratAhliWaris />}
        />

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
          path="/kesejahteraan/:id/edit"
          element={<EditKesejahteraan />}
        />

        <Route
          path="/kesejahteraan/:id"
          element={<DetailKesejahteraan />}
        />

        <Route
          path="/asisten-data"
          element={<AsistenData />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;