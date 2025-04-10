import FormularioVacante from "../components/FormularioVacante";
import { useNavigate } from "react-router-dom";
import api from "../api/jobconnect.api";

function PublicarVacantePage() {
    const navigate = useNavigate();

    const crearVacante = async(data) => {
        try{
            await api.post("/vacantes/", data);
            // Redirigir al listado de vacantes después de crear
            navigate("/reclutador/vacantes");
        } catch (err) {
            console.error("Error al crear", err);
            setError("Error al crear vacante.");
        }
        
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Publicar Vacante</h2>
                <FormularioVacante 
                    modo="crear" 
                    onSubmit={crearVacante}
                />
            </div>
        </div>
    );
}

export default PublicarVacantePage;