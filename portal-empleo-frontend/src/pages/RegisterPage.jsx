import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from "../api/jobconnect.api";

function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        rol: "candidato",
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
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validaciones básicas antes del envío
        if (!formData.username.trim()) {
            toast.error("El nombre de usuario es obligatorio", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true
            });
            setLoading(false);
            return;
        }

        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Por favor, ingrese un correo electrónico válido", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true
            });
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true
            });
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Las contraseñas no coinciden", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true
            });
            setLoading(false);
            return;
        }

        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            rol: formData.rol
        };

        if (formData.rol === "candidato") {
            payload.perfil_candidato = {
                telefono: formData.telefono,
                ciudad: formData.ciudad,
                experiencia: formData.experiencia,
                formacion: formData.formacion,
                habilidades: formData.habilidades,
            };
        } else if (formData.rol === "reclutador") {
            payload.perfil_reclutador = {
                telefono: formData.telefono,
                empresa: formData.empresa,
                cargo: formData.cargo,
                sitio_web: formData.sitio_web,
            };
        }

        try {
            const response = await api.post("/registro/", payload);
            
            if (response.status === 201) {
                toast.success('Registro exitoso', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                });

                // Pequeño retraso antes de navegar
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            // Log full error details for debugging
            console.error("Error completo en el registro:", error);
            console.log("Error config:", error.config);
            console.log("Error response:", error.response);
            
            let errorMessage = "Error al registrar. Por favor, intenta de nuevo.";
            let errorDetails = null;
            
            if (error.response) {
                // The request was made and the server responded with a status code
                const errors = error.response.data;
                console.log('Errores del servidor:', errors);

                // Manejar errores específicos del servidor con más detalle
                if (typeof errors === 'object') {
                    // Priorizar errores de username
                    if (errors.username) {
                        errorMessage = Array.isArray(errors.username) 
                            ? errors.username[0] 
                            : "El nombre de usuario ya está en uso.";
                        errorDetails = {
                            field: 'username',
                            message: errorMessage
                        };
                    } 
                    // Si no hay error de username, revisar email
                    else if (errors.email) {
                        errorMessage = Array.isArray(errors.email)
                            ? errors.email[0]
                            : "El correo electrónico ya está registrado.";
                        errorDetails = {
                            field: 'email',
                            message: errorMessage
                        };
                    } 
                    // Otros tipos de errores
                    else if (errors.password) {
                        errorMessage = Array.isArray(errors.password)
                            ? errors.password[0]
                            : "La contraseña no cumple con los requisitos.";
                    } else if (errors.non_field_errors) {
                        errorMessage = Array.isArray(errors.non_field_errors)
                            ? errors.non_field_errors[0]
                            : "Error en el registro. Verifica tus datos.";
                    }
                } else if (typeof errors === 'string') {
                    // Si el error es un string plano
                    errorMessage = errors;
                }
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = "No se recibió respuesta del servidor. Verifica tu conexión.";
            }
            
            // Mostrar toast de error con mensaje detallado
            toast.error(errorMessage, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });

            // Si hay detalles específicos de error, hacer algo adicional
            if (errorDetails) {
                // Opcional: Puedes agregar lógica adicional aquí, como resaltar el campo
                console.log(`Error en campo: ${errorDetails.field}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "2rem" }}>
            <div style={{ 
                width: "90%", 
                maxWidth: "450px", 
                padding: "1rem", 
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
                }}>Registro</h2>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <select
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        required
                        style={{ 
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #dfe3e8",
                            borderRadius: "4px",
                            backgroundColor: "#ffffff"
                        }}
                    >
                        <option value="">Selecciona un rol</option>
                        <option value="candidato">Candidato</option>
                        <option value="reclutador">Reclutador</option>
                    </select>

                    <input
                        type="text"
                        name="username"
                        placeholder="Usuario"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ 
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #dfe3e8",
                            borderRadius: "4px"
                        }}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ 
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #dfe3e8",
                            borderRadius: "4px"
                        }}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ 
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #dfe3e8",
                            borderRadius: "4px"
                        }}
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{ 
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #dfe3e8",
                            borderRadius: "4px"
                        }}
                    />

                    <input
                        type="text"
                        name="first_name"
                        placeholder="Nombre"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        style={{ 
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #dfe3e8",
                            borderRadius: "4px"
                        }}
                    />

                    <input
                        type="text"
                        name="last_name"
                        placeholder="Apellido"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        style={{ 
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #dfe3e8",
                            borderRadius: "4px"
                        }}
                    />

                    <input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        style={{ 
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #dfe3e8",
                            borderRadius: "4px"
                        }}
                    />

                    {formData.rol === "candidato" && (
                        <>
                            <input 
                                type="text" 
                                name="ciudad" 
                                placeholder="Ciudad" 
                                value={formData.ciudad}
                                onChange={handleChange} 
                                required 
                                style={{ 
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    border: "1px solid #dfe3e8",
                                    borderRadius: "4px"
                                }}
                            />
                            <textarea 
                                name="experiencia" 
                                placeholder="Experiencia laboral" 
                                value={formData.experiencia}
                                onChange={handleChange} 
                                style={{ 
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    border: "1px solid #dfe3e8",
                                    borderRadius: "4px",
                                    minHeight: "30px",
                                    resize: "vertical"
                                }}
                            ></textarea>
                            <textarea 
                                name="formacion" 
                                placeholder="Formación académica" 
                                value={formData.formacion}
                                onChange={handleChange} 
                                style={{ 
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    border: "1px solid #dfe3e8",
                                    borderRadius: "4px",
                                    minHeight: "30px",
                                    resize: "vertical"
                                }}
                            ></textarea>
                            <textarea 
                                name="habilidades" 
                                placeholder="Habilidades" 
                                value={formData.habilidades}
                                onChange={handleChange} 
                                style={{ 
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    border: "1px solid #dfe3e8",
                                    borderRadius: "4px",
                                    minHeight: "30px",
                                    resize: "vertical"
                                }}
                            ></textarea>
                        </>
                    )}

                    {formData.rol === "reclutador" && (
                        <>
                            <input 
                                type="text" 
                                name="empresa" 
                                placeholder="Empresa" 
                                value={formData.empresa}
                                onChange={handleChange} 
                                required 
                                style={{ 
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    border: "1px solid #dfe3e8",
                                    borderRadius: "4px"
                                }} 
                            />
                            <input 
                                type="text" 
                                name="cargo" 
                                placeholder="Cargo" 
                                value={formData.cargo}
                                onChange={handleChange} 
                                required 
                                style={{ 
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    border: "1px solid #dfe3e8",
                                    borderRadius: "4px"
                                }} 
                            />
                            <input 
                                type="url" 
                                name="sitio_web" 
                                placeholder="Sitio web (opcional)" 
                                value={formData.sitio_web}
                                onChange={handleChange} 
                                style={{ 
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    border: "1px solid #dfe3e8",
                                    borderRadius: "4px"
                                }} 
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        style={{
                            padding: "0.75rem",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "1rem",
                            fontWeight: "500",
                            cursor: "pointer",
                            marginTop: "1rem"
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>

                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
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
                            ¿Ya tienes cuenta? Inicia sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;