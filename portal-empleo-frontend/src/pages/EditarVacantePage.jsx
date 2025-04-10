import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/jobconnect.api";
import FormularioVacante from "../components/FormularioVacante";

function EditarVacantePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vacante, setVacante] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const getVacante = async () => {
        try {
            const res = await api.get(`/vacantes/${id}/`);
            setVacante(res.data);
        } catch (err) {
            console.error("Error al cargar vacante", err);
            setError("No se pudo cargar la vacante.");
        } finally {
            setLoading(false);
        }
    };

    const actualizarVacante = async (data) => {
        try {
            await api.put(`/vacantes/${id}/`, data);
            alert("Vacante actualizada correctamente.");
            navigate(`/reclutador/vacante/${id}`);
        } catch (err) {
            console.error("Error al actualizar", err);
            setError("Error al guardar los cambios.");
        }
    };

    useEffect(() => {
        getVacante();
    }, [id]);

    if (loading) return <p className="p-4">Cargando vacante...</p>;

    return (
        <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-yellow-50 to-blue-50">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-6">Editar Vacante</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <FormularioVacante
                    modo="editar"
                    vacante={vacante}
                    onSubmit={actualizarVacante}
                />
            </div>
        </div>
    );
}

export default EditarVacantePage;
