import { useState, useContext } from "react";
import api from "../api/jobconnect.api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { cargarUsuario } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Obtener los tokens
            const response = await api.post("/login/", {
                username,
                password,
            });

            const { access, refresh } = response.data;
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);

            await cargarUsuario(); // 👈 Esto actualiza el Navbar

            // Obtener datos del usuario autenticado
            const userRes = await api.get("/perfil-usuario/");
            const rol = userRes.data.usuario.rol;

            if (rol === "candidato") {
                navigate("/candidato");
            } else if (rol === "reclutador") {
                navigate("/reclutador");
            } else {
                setError("Rol no válido.");
            }
        } catch (err) {
            setError("Credenciales inválidas o usuario no activo.");
            console.error(err.response?.data);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar sesión</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input"
                    />
                    <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input"
                    />
                    <button
                    type="submit"
                    disabled={!username || !password || loading}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200 ${loading && "opacity-60 cursor-not-allowed"}`}
                    >
                    {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
