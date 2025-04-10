import { useState, useEffect } from "react";
import api from "../api/jobconnect.api";

const OPCIONES_CONTRATO = [
    "Término indefinido",
    "Término fijo",
    "Prestación de servicios",
    "Prácticas",
    "Freelance",
];

function FormularioVacante({ vacante = null, onSubmit, modo = "crear" }) {
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        requisitos: "",
        ubicacion: "",
        tipo_contrato: "",
    });

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    // Si viene vacante, lo usamos para precargar los datos
    useEffect(() => {
        if (vacante) {
        setFormData({
            titulo: vacante.titulo || "",
            descripcion: vacante.descripcion || "",
            requisitos: vacante.requisitos || "",
            ubicacion: vacante.ubicacion || "",
            tipo_contrato: vacante.tipo_contrato || "",
        });
        }
    }, [vacante]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        try {
            if (onSubmit) {
                await onSubmit(formData);
                setMensaje(modo === "editar" ? "Vacante actualizada" : "Vacante publicada con éxito");
                if (modo === "crear") {
                    setFormData({
                    titulo: "",
                    descripcion: "",
                    requisitos: "",
                    ubicacion: "",
                    tipo_contrato: "",
                    });
                }
            }
        } catch (err) {
                console.error("Error en el formulario:", err);
                setError("Hubo un error al guardar la vacante.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {mensaje && <p className="text-green-600 text-center">{mensaje}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={formData.titulo}
                onChange={handleChange}
                className="input"
                required
            />
            <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                className="textarea"
                required
            />
            <textarea
                name="requisitos"
                placeholder="Requisitos"
                value={formData.requisitos}
                onChange={handleChange}
                className="textarea"
                required
            />
            <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación"
                value={formData.ubicacion}
                onChange={handleChange}
                className="input"
            />

            <select
                name="tipo_contrato"
                value={formData.tipo_contrato}
                onChange={handleChange}
                className="input"
                required
            >
                <option value="">Seleccionar tipo de contrato</option>
                {OPCIONES_CONTRATO.map((op) => (
                <option key={op} value={op}>
                    {op}
                </option>
                ))}
            </select>

            <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
                {modo === "editar" ? "Guardar Cambios" : "Publicar Vacante"}
            </button>
        </form>
    );
}

export default FormularioVacante;
