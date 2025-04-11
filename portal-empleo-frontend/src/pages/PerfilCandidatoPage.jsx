import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSpinner, FaTimes, FaCheck, FaArrowLeft, FaEye } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import api from "../api/jobconnect.api";

function PerfilCandidatoPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const tableRowStyle = {
        borderBottom: "1px solid #e2e8f0"
    };

    const tableLabelStyle = {
        fontWeight: "600", 
        color: "#4a5568", 
        padding: "0.75rem",
        textAlign: "left",
        width: "30%"
    };

    const tableValueStyle = {
        padding: "0.75rem",
        textAlign: "left",
        width: "70%"
    };

    const fetchPostulaciones = async () => {
        try {
            const vacanteRes = await api.get(`/vacantes/${id}/`);
            console.log('Datos de la vacante:', vacanteRes.data);

            const rutasBusqueda = [
                `/postulaciones-por-vacante/?vacante=${id}`,
                `/postulaciones-recibidas/?vacante=${id}`,
                `/mis-postulaciones/?vacante=${id}`
            ];

            let postulantesRes = null;
            for (const ruta of rutasBusqueda) {
                try {
                    postulantesRes = await api.get(ruta);
                    break;
                } catch (error) {
                    console.log(`Error en ruta ${ruta}:`, error);
                }
            }

            if (!postulantesRes) {
                throw new Error('No se pudieron obtener los postulantes');
            }

            const datosPostulantes = postulantesRes.data.results || postulantesRes.data;
            
            // Obtener detalles de cada postulación
            const detallesPostulaciones = await Promise.all(
                datosPostulantes.map(async (postulante) => {
                    const detallePostulacion = await api.get(`/postulaciones/${postulante.id}/`);
                    return detallePostulacion.data;
                })
            );

            setPostulaciones(detallesPostulaciones);
            console.log('Postulaciones:', detallesPostulaciones);

        } catch (err) {
            console.error("Error al cargar postulaciones", err);
            setError(err);
            toast.error('Error al cargar los datos de los candidatos', {
                position: "bottom-right",
                autoClose: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstado = async (postulacionId, nuevoEstado) => {
        try {
            await api.patch(`/postulaciones/${postulacionId}/`, { estado: nuevoEstado });
            
            const postulacionesActualizadas = postulaciones.map(postulacion => 
                postulacion.id === postulacionId 
                    ? { ...postulacion, estado: nuevoEstado } 
                    : postulacion
            );
            
            setPostulaciones(postulacionesActualizadas);

            toast.success(`Estado cambiado a ${nuevoEstado}`, {
                position: "bottom-right",
                autoClose: 3000
            });
        } catch (err) {
            console.error("Error al cambiar estado", err);
            toast.error('Error al cambiar estado', {
                position: "bottom-right",
                autoClose: 3000
            });
        }
    };

    const renderEstadoIconos = (postulacion) => {
        const estadosPermitidos = {
            'en revision': 'text-yellow-500',
            'descartado': 'text-red-500',
            'seleccionado': 'text-green-500'
        };

        return (
            <div className="flex items-center space-x-2">
                <button 
                    onClick={() => cambiarEstado(postulacion.id, 'en revision')}
                    data-tooltip-id={`tooltip-revision-${postulacion.id}`}
                    data-tooltip-content="En Revisión"
                    className={`p-2 rounded-full hover:bg-yellow-100 ${estadosPermitidos['en revision']} 
                        ${postulacion.estado === 'en revision' ? 'bg-yellow-200' : ''}
                        transform transition-all duration-300 hover:scale-110 active:scale-95`}
                >
                    <FaSpinner />
                    <Tooltip id={`tooltip-revision-${postulacion.id}`} />
                </button>

                <button 
                    onClick={() => cambiarEstado(postulacion.id, 'descartado')}
                    data-tooltip-id={`tooltip-descartado-${postulacion.id}`}
                    data-tooltip-content="Descartado"
                    className={`p-2 rounded-full hover:bg-red-100 ${estadosPermitidos['descartado']} 
                        ${postulacion.estado === 'descartado' ? 'bg-red-200' : ''}
                        transform transition-all duration-300 hover:scale-110 active:scale-95`}
                >
                    <FaTimes />
                    <Tooltip id={`tooltip-descartado-${postulacion.id}`} />
                </button>

                <button 
                    onClick={() => cambiarEstado(postulacion.id, 'seleccionado')}
                    data-tooltip-id={`tooltip-seleccionado-${postulacion.id}`}
                    data-tooltip-content="Seleccionado"
                    className={`p-2 rounded-full hover:bg-green-100 ${estadosPermitidos['seleccionado']} 
                        ${postulacion.estado === 'seleccionado' ? 'bg-green-200' : ''}
                        transform transition-all duration-300 hover:scale-110 active:scale-95`}
                >
                    <FaCheck />
                    <Tooltip id={`tooltip-seleccionado-${postulacion.id}`} />
                </button>
            </div>
        );
    };

    useEffect(() => {
        fetchPostulaciones();
    }, [id]);

    if (loading) return <p className="p-4">Cargando postulaciones...</p>;
    if (error) return <p className="p-4">Error al cargar los datos</p>;
    if (postulaciones.length === 0) return <p className="p-4">No hay postulaciones</p>;

    return (
        <div style={{
            display: "flex",
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "100vh", 
            padding: "2rem",
            color: "#2c3e50"
        }}>
            <div style={{ 
                width: "100%", 
                maxWidth: "500px", 
                backgroundColor: "#ffffff", 
                borderRadius: "8px", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "2rem"
            }}>
                <div style={{
                    marginBottom: "1rem" 
                }}>
                    <button 
                        onClick={() => navigate('/reclutador')}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#4a5568",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            transform: "translateX(0)",
                            opacity: 1
                        }}
                        onMouseOver={(e) => {
                            e.target.style.color = "#2c3e50";
                            e.target.style.transform = "translateX(-5px)";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.color = "#4a5568";
                            e.target.style.transform = "translateX(0)";
                        }}
                    >
                        <FaArrowLeft /> Volver
                    </button>
                </div>

                <h2 className="text-2xl font-bold mb-4">
                    Postulantes de la Vacante
                </h2>

                {postulaciones.map(postulacion => {
                    const perfil = postulacion.perfil_candidato || {};
                    return (
                        <table key={postulacion.id} style={{ 
                            width: "100%", 
                            borderCollapse: "collapse",
                            marginBottom: "1rem"
                        }}>
                            <tbody>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Nombre</td>
                                    <td style={tableValueStyle}>{postulacion.nombre} {postulacion.apellido}</td>
                                </tr>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Email</td>
                                    <td style={tableValueStyle}>{postulacion.email || 'No disponible'}</td>
                                </tr>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Vacante</td>
                                    <td style={tableValueStyle}>{postulacion.vacante.titulo}</td>
                                </tr>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Fecha Postulación</td>
                                    <td style={tableValueStyle}>
                                        {new Date(postulacion.fecha_postulacion).toLocaleDateString('es-CO', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </td>
                                </tr>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Teléfono</td>
                                    <td style={tableValueStyle}>{perfil.telefono || 'No disponible'}</td>
                                </tr>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Ciudad</td>
                                    <td style={tableValueStyle}>{perfil.ciudad || 'No disponible'}</td>
                                </tr>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Formación</td>
                                    <td style={tableValueStyle}>{perfil.formacion || 'No disponible'}</td>
                                </tr>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Experiencia</td>
                                    <td style={tableValueStyle}>{perfil.experiencia || 'No disponible'}</td>
                                </tr>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Habilidades</td>
                                    <td style={tableValueStyle}>{perfil.habilidades || 'No disponible'}</td>
                                </tr>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Estado</td>
                                    <td style={tableValueStyle}>
                                        <span style={{
                                            padding: "0.25rem 0.5rem",
                                            borderRadius: "0.375rem",
                                            fontSize: "0.75rem",
                                            fontWeight: "500",
                                            backgroundColor: 
                                                postulacion.estado === 'en revision' ? "#fef3c7" :
                                                postulacion.estado === 'descartado' ? "#fee2e2" : 
                                                "#d1fae5",
                                            color: 
                                                postulacion.estado === 'en revision' ? "#92400e" :
                                                postulacion.estado === 'descartado' ? "#b91c1c" : 
                                                "#047857"
                                        }}>
                                            {postulacion.estado === 'en revision' ? 'En Revisión' : 
                                             postulacion.estado === 'descartado' ? 'Descartado' : 
                                             'Seleccionado'}
                                        </span>
                                    </td>
                                </tr>
                                <tr style={tableRowStyle}>
                                    <td style={tableLabelStyle}>Acciones</td>
                                    <td style={tableValueStyle}>
                                        {renderEstadoIconos(postulacion)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    );
                })}
            </div>
        </div>
    );
}

export default PerfilCandidatoPage;