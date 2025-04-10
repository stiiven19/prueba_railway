import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardCandidato from "./pages/DashboardCandidato";
import DashboardReclutador from "./pages/DashboardReclutador";
import PublicarVacantePage from "./pages/PublicarVacantePage";
import DetalleVacantePage from "./pages/DetalleVacantePage";
import ListaVacantesPage from "./pages/ListaVacantesPage";
import PerfilCandidatoPage from "./pages/PerfilCandidatoPage";
import EditarVacantePage from "./pages/EditarVacantePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/candidato"
            element={
              <RutaProtegida rolRequerido="candidato">
                <DashboardCandidato />
              </RutaProtegida>
            }
          />

          <Route
            path="/reclutador"
            element={
              <RutaProtegida rolRequerido="reclutador">
                <DashboardReclutador />
              </RutaProtegida>
            }
          />

          <Route 
            path="/reclutador/publicar" 
            element={
              <RutaProtegida rolRequerido="reclutador">
                <PublicarVacantePage />
              </RutaProtegida>} 
          />

          <Route 
            path="/reclutador/vacantes" 
            element={
              <RutaProtegida rolRequerido="reclutador">
                <ListaVacantesPage />
              </RutaProtegida>} 
          />
          
          <Route
            path="/reclutador/vacante/:id"
            element={
              <RutaProtegida rolRequerido="reclutador">
                <DetalleVacantePage />
              </RutaProtegida>} 
          />
          
          <Route
            path="/reclutador/perfil-candidato/:id"
            element={
              <RutaProtegida rolRequerido="reclutador">
                <PerfilCandidatoPage />
              </RutaProtegida>} 
          />
          
          <Route path="/reclutador/editar/:id" element={
            <RutaProtegida rolRequerido="reclutador">
              <EditarVacantePage />
            </RutaProtegida>
          } />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
