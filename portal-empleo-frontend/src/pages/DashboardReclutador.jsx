import { useState, useEffect } from "react";
import api from "../api/jobconnect.api";
import FormularioVacante from "../components/FormularioVacante";
import MisVacantes from "../components/MisVacantes";

function DashboardReclutador() {
    const [vacantes, setVacantes] = useState([]);
    const [expandida, setExpandida] = useState(null);
    const [actualizar, setActualizar] = useState(false); // para forzar recarga
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const fetchVacantes = async () => {
        try {
            const res = await api.get(`/vacantes/?page=${pagina}`);
            setVacantes(res.data.results); // <-- arreglo de vacantes
            setTotalPaginas(Math.ceil(res.data.count / 10)); // si la página es de 10 elementos 
        } catch (err) {
            console.error("Error al cargar vacantes", err);
        }
    };
    
    useEffect(() => {
        fetchVacantes();
    }, [pagina, actualizar]); // se ejecuta al cargar el componente y al cambiar la página o actualizar
    
    const irPagina = (num) => {
        setPagina(num);
    };
    
    return (
        <div>
            <h2>Panel del Reclutador</h2>
            {/* Formulario para publicar nueva vacante */}
            <FormularioVacante onVacanteCreada={() => setActualizar(!actualizar)} />
            <hr />
            
            {/* Lista de vacantes del reclutador */}
            <MisVacantes 
                vacantes={vacantes}
                onActualizar={() => setActualizar(!actualizar)}
                expandida={expandida}
                setExpandida={setExpandida}
            />
            
            {/* Paginación */}
            <div style={{ marginTop: "1rem" }}>
                {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => irPagina(i + 1)}
                        style={{
                            marginRight: "0.5rem",
                            fontWeight: pagina === i + 1 ? "bold" : "normal"
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DashboardReclutador;  