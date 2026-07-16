import React, { useEffect, useState } from "react";

export const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    // El token expiró
                    alert("Tu sesión ha caducado. Por favor, vuelve a iniciar sesión.");
                    localStorage.removeItem("token");
                    // Opcional: navigate("/login");
                    return;
                }

                const data = await response.json();
                setFavorites(data);
            } catch (err) {
                console.error("Error cargando favoritos:", err);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="text-center mt-5">
            <h1>Mis Pokémon Favoritos ❤️</h1>
            <ul className="list-group w-50 mx-auto mt-4">
                {favorites.length > 0 ? (
                    favorites.map((name, index) => (
                        <li key={index} className="list-group-item text-capitalize">
                            {name}
                        </li>
                    ))
                ) : (
                    <p>Aún no tienes favoritos...</p>
                )}
            </ul>
        </div>
    );
};