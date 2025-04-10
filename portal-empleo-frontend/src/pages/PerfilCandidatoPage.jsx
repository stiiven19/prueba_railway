import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/jobconnect.api";

function PerfilCandidatoPage() {
    const { id } = useParams();
    const [postulacion, setPostulacion] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPostulacion = async () => {
        try {
            const res = await api.get(`/postulaciones/${id}/`);
            setPostulacion(res.data);
        } catch (err) {
            
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstado = async (nuevoEstado) => {
        try {
            await api.patch(`/postulaciones/${id}/`, { estado: nuevoEstado });
            fetchPostulacion(); // refresca estado
        } catch (err) {
            console.error("Error al cambiar estado", err);
        }
    };

    useEffect(() => {
        fetchPostulacion();
    }, [id]);

    if (loading) return <p className="p-4">Cargando perfil...</p>;
    if (!postulacion) return <p className="p-4">No se encontró la postulación.</p>;

    const perfil = postulacion.perfil_candidato;

    return (
        <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-purple-50 to-green-50">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
            <Link to={`/reclutador/vacante/${postulacion.vacante.id}`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                ← Volver a la vacante
            </Link>

            <h2 className="text-2xl font-bold mb-4">{postulacion.nombre} {postulacion.apellido}</h2>
            <p className="text-gray-600 mb-2">Postulado a: <strong>{postulacion.vacante.titulo}</strong></p>
            <p className="text-gray-600 mb-4">Fecha de postulación: {new Date(postulacion.fecha_postulacion).toLocaleDateString()}</p>

            <div className="space-y-2 mb-4">
                <p><strong>Teléfono:</strong> {perfil.telefono}</p>
                <p><strong>Ciudad:</strong> {perfil.ciudad}</p>
                <p><strong>Formación:</strong> {perfil.formacion}</p>
                <p><strong>Experiencia:</strong> {perfil.experiencia}</p>
                <p><strong>Habilidades:</strong> {perfil.habilidades}</p>
            </div>

            <div className="mt-6">
                <label className="mr-2 font-medium">Estado:</label>
                <select
                    value={postulacion.estado}
                    onChange={(e) => cambiarEstado(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="en revision">En revisión</option>
                    <option value="descartado">Descartado</option>
                    <option value="seleccionado">Seleccionado</option>
                </select>
            </div>
        </div>
        </div>
    );
}

export default PerfilCandidatoPage;
