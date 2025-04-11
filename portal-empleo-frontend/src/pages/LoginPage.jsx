import { useState, useContext } from "react";
import api from "../api/jobconnect.api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from 'react-toastify';

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
        setLoading(true);

        try {
            // Obtener los tokens
            const response = await api.post("/login/", {
                username,
                password,
            });

            const { access, refresh } = response.data;
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);

            await cargarUsuario(); // 

            // Obtener datos del usuario autenticado
            const userRes = await api.get("/perfil-usuario/");
            const rol = userRes.data.usuario.rol;

            if (rol === "candidato") {
                navigate("/candidato");
                // Delay toast to ensure navigation completes
                setTimeout(() => {
                    toast.success('¡Inicio de sesión exitoso!', {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                    });
                }, 100);
            } else if (rol === "reclutador") {
                navigate("/reclutador");
                // Delay toast to ensure navigation completes
                setTimeout(() => {
                    toast.success('¡Inicio de sesión exitoso!', {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                    });
                }, 100);
            } else {
                setError("Rol no válido.");
                toast.error("Rol de usuario no válido", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        } catch (err) {
            setError("Credenciales inválidas o usuario no activo.");
            toast.error("Credenciales inválidas. Por favor, verifica tus datos.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
            console.error(err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "100vh"
        }}>
            <div style={{ 
                width: "100%", 
                maxWidth: "400px", 
                padding: "2rem", 
                backgroundColor: "#ffffff",
                border: "1px solid #dfe3e8", 
                borderRadius: "8px", 
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)" 
            }}>
                <h2 style={{ 
                    textAlign: "center", 
                    marginBottom: "1.5rem",
                    color: "#2c3e50",
                    fontSize: "1.75rem",
                    fontWeight: "600"
                }}>Iniciar sesión</h2>
        
                {error && <p style={{ 
                    color: "#e74c3c", 
                    marginBottom: "1rem", 
                    textAlign: "center",
                    padding: "0.5rem",
                    backgroundColor: "#fdeaea",
                    borderRadius: "4px"
                }}>{error}</p>}
        
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ 
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #dfe3e8",
                            borderRadius: "4px",
                            transition: "border-color 0.2s",
                            outline: "none"
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ 
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #dfe3e8",
                            borderRadius: "4px",
                            transition: "border-color 0.2s",
                            outline: "none"
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!username || !password || loading}
                        style={{
                            padding: "0.75rem",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "1rem",
                            fontWeight: "500",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                            transition: "all 0.2s",
                            marginTop: "0.5rem"
                        }}
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>

                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                        <button
                            type="button"
                            onClick={() => navigate('/registro')}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#0066cc",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                textDecoration: "none",
                                padding: "0.5rem"
                            }}
                        >
                            ¿No tienes cuenta? Regístrate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;