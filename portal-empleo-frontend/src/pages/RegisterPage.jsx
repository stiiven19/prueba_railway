import { useState } from "react";
import api from "../api/jobconnect.api";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [rol, setRol] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        telefono: "",
        ciudad: "",
        experiencia: "",
        formacion: "",
        habilidades: "",
        empresa: "",
        cargo: "",
        sitio_web: ""
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            rol: rol
        };

        if (rol === "candidato") {
            payload.perfil_candidato = {
                telefono: formData.telefono,
                ciudad: formData.ciudad,
                experiencia: formData.experiencia,
                formacion: formData.formacion,
                habilidades: formData.habilidades,
            };
        } else if (rol === "reclutador") {
            payload.perfil_reclutador = {
                telefono: formData.telefono,
                empresa: formData.empresa,
                cargo: formData.cargo,
                sitio_web: formData.sitio_web,
            };
        }

        try {
            await api.post("registro/", payload);
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            navigate("/login");
        } catch (err) {
            setError("Ocurrió un error al registrarse.");
            console.error(err.response?.data);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 py-10">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Registro</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="username" placeholder="Usuario" onChange={handleChange} required className="input" />
                    <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required className="input" />
                    <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required className="input" />
                    <input type="text" name="first_name" placeholder="Nombre" onChange={handleChange} required className="input" />
                    <input type="text" name="last_name" placeholder="Apellido" onChange={handleChange} required className="input" />

                    <select value={rol} onChange={(e) => setRol(e.target.value)} required className="input">
                    <option value="">Selecciona tu rol</option>
                    <option value="candidato">Candidato</option>
                    <option value="reclutador">Reclutador</option>
                    </select>

                    <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required className="input" />

                    {rol === "candidato" && (
                    <>
                        <h4 className="text-lg font-semibold text-gray-700 mt-4">Datos como Candidato</h4>
                        <input type="text" name="ciudad" placeholder="Ciudad" onChange={handleChange} required className="input" />
                        <textarea name="experiencia" placeholder="Experiencia laboral" onChange={handleChange} className="textarea"></textarea>
                        <textarea name="formacion" placeholder="Formación académica" onChange={handleChange} className="textarea"></textarea>
                        <textarea name="habilidades" placeholder="Habilidades" onChange={handleChange} className="textarea"></textarea>
                    </>
                    )}

                    {rol === "reclutador" && (
                    <>
                        <h4 className="text-lg font-semibold text-gray-700 mt-4">Datos como Reclutador</h4>
                        <input type="text" name="empresa" placeholder="Empresa" onChange={handleChange} required className="input" />
                        <input type="text" name="cargo" placeholder="Cargo" onChange={handleChange} required className="input" />
                        <input type="url" name="sitio_web" placeholder="Sitio web (opcional)" onChange={handleChange} className="input" />
                    </>
                    )}

                    <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition duration-200"
                    >
                    Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
