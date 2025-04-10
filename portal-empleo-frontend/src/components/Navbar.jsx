import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const { usuario, cerrarSesion } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        cerrarSesion();
        navigate("/login");
    };

    return (
        <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <Link to="/" className="text-xl font-bold hover:text-blue-300 transition">
                Portal de Empleo
            </Link>

            <div className="flex items-center gap-4 flex-wrap">
                {!usuario && (
                    <>
                        <Link to="/login" className="hover:text-blue-600 transition">
                            Login
                        </Link>
                        <Link to="/registro" className="hover:text-blue-600 transition">
                            Registro
                        </Link>
                    </>
                )}

                {usuario?.rol === "reclutador" && (
                    <>
                        <Link to="/reclutador" className="hover:text-blue-600 transition">
                            Panel Reclutador
                        </Link>
                        <Link to="/reclutador/publicar" className="hover:text-blue-300">Publicar Vacante</Link>
                        <Link to="/reclutador/vacantes" className="hover:text-blue-300">Mis Vacantes</Link>
                    </>
                )}

                {usuario?.rol === "candidato" && (
                    <Link to="/candidato" className="text-gray-700 hover:text-blue-600 transition">
                        Panel Candidato
                    </Link>
                )}

                {usuario && (
                    <>
                        <span className="text-sm hidden sm:inline">
                            Hola, <strong>{usuario.first_name}</strong> ({usuario.rol})
                        </span>
                        <button
                            onClick={handleLogout}
                            className="ml-2 px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-sm"
                        >
                            Cerrar sesión
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
