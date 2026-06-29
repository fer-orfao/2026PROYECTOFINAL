import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Obtenemos la URL de tu API guardada en el .env de forma automática
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        console.log("La URL que está leyendo React es:", backendUrl); // <-- AÑADE ESTA LÍNEA

        try {
            const response = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Error al registrar al entrenador");
            }

            // Si todo sale bien, lo redirigimos al login para que entre
            alert("¡Entrenador registrado con éxito! Ahora puedes iniciar sesión.");
            navigate("/login");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Registro de Entrenadores</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre de Entrenador (Username)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Registrar Cuenta Pokédex</button>
            </form>
        </div>
    );
};