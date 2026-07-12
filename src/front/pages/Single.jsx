import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; // Asegúrate de importar esto

export const Single = () => {
  const { theId } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const { store } = useGlobalReducer();

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${theId}`)
      .then((res) => res.json())
      .then((data) => setPokemon(data))
      .catch((err) => console.error(err));
  }, [theId]);

  const addFavorite = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ pokemon_name: pokemon.name }),
      });

      if (response.ok) {
        alert("¡Pokémon añadido a favoritos!");
      } else {
        alert("Error al añadir favorito. ¿Estás logueado?");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!pokemon) return <div className="text-center mt-5">Cargando detalles...</div>;

  return (
    <div className="text-center mt-5">
      <h1 className="text-capitalize">{pokemon.name}</h1>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        style={{ width: "200px" }}
      />
      <p>Altura: {pokemon.height / 10}m</p>
      <p>Peso: {pokemon.weight / 10}kg</p>

      {/* Botón de favoritos */}
      <button className="btn btn-warning mx-2" onClick={addFavorite}>
        ❤️ Añadir a Favoritos
      </button>

      <Link to="/" className="btn btn-primary">Volver a la Pokédex</Link>
    </div>
  );
};