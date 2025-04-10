import { useEffect, useState } from "react";
import api from "../api/jobconnect.api";

function DashboardCandidato() {
    const [vacantes, setVacantes] = useState([]);
    const [postulaciones, setPostulaciones] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    
    // Vacantes paginadas
    const getVacantes = async () => {
        try {
            const res = await api.get(`/vacantes/?page=${pagina}`);
            setVacantes(res.data.results);
            setTotalPaginas(Math.ceil(res.data.count / 10));
        } catch (err) {
            console.error("Error al cargar vacantes", err);
        }
    };
    
    // 🧾 Tus postulaciones
    const getPostulaciones = async () => {
        try {
            const res = await api.get("/mis-postulaciones/");
            setPostulaciones(res.data.results || []);
        } catch (err) {
            console.error("Error al cargar tus postulaciones", err);
        }
    };

    const cancelarPostulacion = async (id) => {
        const confirmar = confirm("¿Seguro que deseas cancelar esta postulación?");
        if (!confirmar) return;
        
        try {
            await api.delete(`/postulaciones/${id}/`);
            setMensaje("Postulación cancelada correctamente.");
            getPostulaciones();
        } catch (err) {
            console.error("Error al cancelar la postulación", err);
            setMensaje("No se pudo cancelar la postulación.");
        }
    };
    
    const postularse = async (id) => {
        try {
            const res = await api.post("/postulaciones/", { vacante: id });
            setMensaje(res.data.mensaje || "Te has postulado correctamente."); // ✅ Usa la respuesta del backend
            getPostulaciones();
        } catch (err) {
            setMensaje(err.response?.data?.non_field_errors?.[0] || "Ya estás postulado.");
        }
    };
    
    useEffect(() => {
        if (mensaje) {
            const timeout = setTimeout(() => setMensaje(""), 4000);
            return () => clearTimeout(timeout);
        }
    }, [mensaje]);
    
    useEffect(() => {
        getVacantes();
    }, [pagina]);
    
    useEffect(() => {
        getPostulaciones();
    }, []);
    
    return (
        <div>
            <h2>Vacantes Disponibles</h2>
            {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
            
            {vacantes.length === 0 ? (
                <p>No hay vacantes disponibles.</p>
            ) : (
                <>
                    <ul>
                        {vacantes.map((v) => (
                            <li key={v.id} style={{ marginBottom: "1rem" }}>
                                <strong>{v.titulo}</strong> - {v.ubicacion} <br />
                                {v.descripcion} <br />
                                <button onClick={() => postularse(v.id)}>Postularme</button>
                            </li>
                        ))}
                    </ul>
                    {/* Paginación de vacantes */}
                    <div style={{ marginTop: "1rem" }}>
                        {Array.from({ length: totalPaginas }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPagina(i + 1)}
                                style={{
                                    marginRight: "0.5rem",
                                    fontWeight: pagina === i + 1 ? "bold" : "normal"
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <hr />

            <h2>Mis Postulaciones</h2>
            {postulaciones.length === 0 ? (
                <p>No te has postulado a ninguna vacante aún.</p>
            ) : (
                <ul>
                    {postulaciones.map((p) => (
                        <li key={p.id} style={{ marginBottom: "1rem" }}>
                            <strong>{p.vacante?.titulo}</strong> — {p.vacante.ubicacion}
                            <br />
                            <em>Estado:</em>
                            <strong style={{ color: p.estado === "seleccionado" ? "green" : p.estado === "descartado" ? "red" : "#555" }}>
                                {p.estado}
                            </strong>
                            <br />
                            <small>Postulado el: {new Date(p.fecha_postulacion).toLocaleDateString()}</small>
                            <br />
                            <button onClick={() => cancelarPostulacion(p.id)} style={{ color: "red" }}>Cancelar Postulación</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DashboardCandidato;
