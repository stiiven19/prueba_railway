import { useState, useEffect } from "react";
import api from "../api/jobconnect.api";
import FormularioVacante from "../components/FormularioVacante";
import MisVacantes from "../components/MisVacantes";

function DashboardReclutador() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
            <div className="text-center bg-white p-10 rounded-xl shadow-xl">
                <h1 className="text-3xl font-bold mb-4">¡Bienvenido Reclutador!</h1>
                <p className="text-gray-700">Puedes gestionar tus vacantes desde el menú.</p>
            </div>
        </div>
    );
}

export default DashboardReclutador;  