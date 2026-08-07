import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const EditProfile = () => {
    const [username, setUsername] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token"); 

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ username: username })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje("¡Nombre de entrenador actualizado con éxito!");
                setTimeout(() => {
                    navigate("/"); 
                }, 1500);
            } else {
                setMensaje(data.msg || "Hubo un error al actualizar");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            setMensaje("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <div className="card shadow p-4 text-center">
                <h2>Editar Perfil de Entrenador</h2>
                <p className="text-muted">Cambia el nombre con el que te registraste en la Pokédex</p>

                {mensaje && <div className="alert alert-info">{mensaje}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label">Nuevo nombre de entrenador</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ej. Ash Ketchum"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-2">
                        Guardar Cambios
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary w-100"
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </button>
                </form>
            </div>
        </div>
    );
};