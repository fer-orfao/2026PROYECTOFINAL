import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Single = () => {
  const { theId } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // 1. Nuevo estado para el botón

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${theId}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data);
        // 2. Aquí llamarías a una función para verificar si ya es favorito
        // Por ahora, empezaremos con el toggle manual
      })
      .catch((err) => console.error(err));
  }, [theId]);

  // 3. Función única para alternar entre POST y DELETE
  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    // Si ya es favorito, eliminamos (DELETE). Si no, añadimos (POST).
    const method = isFavorite ? "DELETE" : "POST";
    const url = isFavorite
      ? `${import.meta.env.VITE_BACKEND_URL}/api/favorite/${pokemon.name}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/favorite`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: !isFavorite ? JSON.stringify({ pokemon_name: pokemon.name }) : null
      });

      if (response.ok) {
        setIsFavorite(!isFavorite); // 4. AQUÍ ES DONDE EL BOTÓN CAMBIA DE COLOR/ESTADO
        alert(isFavorite ? "Eliminado de favoritos" : "¡Añadido a favoritos!");
      } else if (response.status === 401) {
        alert("Sesión caducada, inicia sesión de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!pokemon) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <div className="text-center mt-5">
      <h1 className="text-capitalize">{pokemon.name}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: "200px" }} />

      {/* 5. El botón ahora cambia dinámicamente de clase y texto */}
      <button
        className={`btn ${isFavorite ? "btn-danger" : "btn-warning"} mx-2`}
        onClick={toggleFavorite}
      >
        {isFavorite ? "❤️ Eliminar de Favoritos" : "🤍 Añadir a Favoritos"}
      </button>

      <Link to="/" className="btn btn-primary">Volver</Link>
    </div>
  );

};