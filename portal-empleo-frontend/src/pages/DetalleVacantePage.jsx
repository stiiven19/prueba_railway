import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/jobconnect.api";

function DetalleVacantePage (){
    const { id } = useParams(); // ID de la vacante
    const [vacante, setVacante] = useState(null);
    const [postulados, setPostulados] = useState([]);
    const [loading, setLoading] = useState(true);

    const getDatos = async () => {
        try {
            const vacanteRes = await api.get(`/vacantes/${id}/`);
            setVacante(vacanteRes.data.results || vacanteRes.data);

            const postuladosRes = await api.get(`/postulaciones-por-vacante/?vacante=${id}`);
            setPostulados(postuladosRes.data.results);
        } catch (err) {
            console.error("Error al cargar datos", err);
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstado = async (postulacionId, nuevoEstado) => {
        try {
            await api.patch(`/postulaciones/${postulacionId}/`, { estado: nuevoEstado });
            getDatos(); // Refrescar lista
        } catch (err) {
            console.error("Error al cambiar estado", err);
        }
    };

    useEffect(() => {
        getDatos();
    }, [id]);

    if (loading) return <p className="p-4">Cargando datos...</p>;
    if (!vacante) return <p className="p-4">Vacante no encontrada.</p>;

    return (
        <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-50 to-green-50">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
                <Link to="/reclutador/vacantes" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                    ← Volver a la lista
                </Link>
                <h2 className="text-3xl font-bold mb-4">{vacante.titulo}</h2>
                <p className="text-gray-600">{vacante.descripcion}</p>
                <p className="mt-2"><strong>Ubicación:</strong> {vacante.ubicacion}</p>
                <p><strong>Tipo de Contrato:</strong> {vacante.tipo_contrato}</p>
                <p className="mb-6"><strong>Requisitos:</strong> {vacante.requisitos}</p>

                <h3 className="text-2xl font-semibold mb-4 mt-8">Postulados</h3>

                {postulados.length === 0 ? (
                    <p>No hay personas postuladas a esta vacante aún.</p>
                ) : (
                    <ul className="space-y-4">
                        {postulados.map((p) => (
                            <li key={p.id} className="border p-4 rounded bg-gray-50 shadow-sm hover:shadow transition">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{p.nombre} {p.apellido}</p>
                                        <p className="text-sm text-gray-500">Postulado el {new Date(p.fecha_postulacion).toLocaleString("es-CO")}</p>
                                    </div>
                                    <Link
                                        to={`/reclutador/perfil-candidato/${p.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Ver perfil
                                    </Link>
                                </div>

                                <div className="mt-2">
                                    <label className="mr-2">Estado:</label>
                                    <select
                                        value={p.estado}
                                        onChange={(e) => cambiarEstado(p.id, e.target.value)}
                                        className="border p-1 rounded"
                                    >
                                        <option value="en revision">En revisión</option>
                                        <option value="descartado">Descartado</option>
                                        <option value="seleccionado">Seleccionado</option>
                                    </select>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default DetalleVacantePage;