import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/jobconnect.api";

function ListaVacantesPage() {
    const [vacantes, setVacantes] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(true);
    
    const fetchVacantes = async () => {
        try {
            const res = await api.get(`/vacantes/?page=${pagina}`);
            setVacantes(res.data.results || res.data);
            setTotalPaginas(Math.ceil(res.data.count / 10)); // si la página es de 10 elementos
        } catch (err) {
            console.error("Error al cargar vacantes", err);
        } finally {
            setLoading(false);
        }
    };

    const eliminarVacante = async (id) => {
        if (!confirm("¿Estás seguro de eliminar esta vacante?")) return;

        try {
            await api.delete(`/vacantes/${id}/`);
            fetchVacantes();
        } catch (err) {
            console.error("Error al eliminar vacante", err);
        }
    };
    
    useEffect(() => {
        fetchVacantes();
    }, [pagina]);

    return (
        <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-100 to-green-100">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Mis Vacantes Publicadas</h2>
                    <Link to="/reclutador/publicar" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Nueva Vacante
                    </Link>
                </div>

                {loading ? (
                    <p>Cargando...</p>
                ) : vacantes.length === 0 ? (
                    <p>No has publicado ninguna vacante aún.</p>
                ) : (
                    <ul className="space-y-6">
                        {vacantes.map((v) => (
                            <li key={v.id} className="border-b pb-4">
                                <Link to={`/reclutador/vacante/${v.id}`} className="text-blue-600 font-semibold hover:underline">
                                    {v.titulo}
                                </Link>
                                <p className="text-gray-600">{v.ubicacion} — {v.tipo_contrato}</p>
                                <div className="flex gap-4 mt-3">
                                    <Link to={`/reclutador/vacante/${v.id}`} className="text-blue-600 hover:underline">
                                        Ver Postulados
                                    </Link>
                                    <Link to={`/reclutador/editar/${v.id}`} className="text-yellow-600 hover:underline">
                                        Editar
                                    </Link>
                                    <button onClick={() => eliminarVacante(v.id)} className="text-red-600 hover:underline">
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Paginación */}
                <div className="flex justify-center mt-8 gap-2">
                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPagina(i + 1)}
                            className={`px-3 py-1 border rounded ${pagina === i + 1 ? "bg-blue-500 text-white" : "bg-white"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListaVacantesPage;