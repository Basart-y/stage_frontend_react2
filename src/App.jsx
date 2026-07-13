import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Demandes from "./pages/Demandes";
import PointsRelais from "./pages/PointsRelais";
import ReceptionColis from "./pages/ReceptionColis";
import RetraitColis from "./pages/RetraitColis";
import RetourColis from "./pages/RetourColis";
import SuiviColis from "./pages/SuiviColis";
import Profil from "./pages/Profil";
import DemandePointRelais from "./pages/DemandePointRelais.jsx";
import DemandeDetail from "./pages/DemandeDetail";
import PointRelaisDetail from "./pages/PointRelaisDetail";
import ColisDetail from "./pages/ColisDetail";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="demandes" element={<Demandes />} />
                <Route path="points-relais" element={<PointsRelais />} />
                <Route path="reception-colis" element={<ReceptionColis />} />
                <Route path="retrait-colis" element={<RetraitColis />} />
                <Route path="retour-colis" element={<RetourColis />} />
                <Route path="suivi-colis" element={<SuiviColis />} />
                <Route path="profil" element={<Profil />} />
                <Route path="/demande-point-relais" element={<DemandePointRelais />} />
                <Route path="/demandes" element={<Demandes />} />
                <Route path="/demandes/:id" element={<DemandeDetail />} />
                <Route path="/points-relais" element={<PointsRelais />} />
                <Route path="/points-relais/:id" element={<PointRelaisDetail />} />
                <Route path="/colis/:id" element={<ColisDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
{/* Ensemble des routes */}