import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Componente pequeño para cargar la imagen de cada Pokémon
const PokemonCard = ({ name }) => {
    const [pokemonData, setPokemonData] = useState(null);

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then((res) => res.json())
            .then((data) => setPokemonData(data))
            .catch((err) => console.error("Error cargando imagen:", err));
    }, [name]);

    if (!pokemonData) return <div className="m-2">Cargando...</div>;

    return (
        <div className="card m-2" style={{ width: "150px" }}>
            <img
                src={pokemonData.sprites.front_default}
                className="card-img-top"
                alt={name}
            />
            <div className="card-body">
                <h5 className="card-title text-capitalize">{name}</h5>
                <Link to={`/single/${name}`} className="btn btn-primary btn-sm">Ver detalles</Link>
            </div>
        </div>
    );
};

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
                    alert("Tu sesión ha caducado.");
                    localStorage.removeItem("token");
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

    const uniqueFavorites = [...new Set(favorites)];

    return (
        <div className="text-center mt-5">
            <h1>Mis Pokémon Favoritos ❤️</h1>

            <div className="d-flex flex-wrap justify-content-center mt-4">
                {uniqueFavorites.length > 0 ? (
                    uniqueFavorites.map((name, index) => (
                        <PokemonCard key={index} name={name} />
                    ))
                ) : (
                    <p>Aún no tienes favoritos, ¡ve a buscar algunos!</p>
                )}
            </div>
        </div>
    );
};