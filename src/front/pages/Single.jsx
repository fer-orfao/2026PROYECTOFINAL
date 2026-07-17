import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const Single = () => {
  const navigate = useNavigate();
  const { theId } = useParams(); // Este es el nombre o ID que viene en la URL
  const [isFavorite, setIsFavorite] = useState(false);
  const [pokemon, setPokemon] = useState(null); // Estado para guardar los datos del Pokémon

  // 1. Cargar datos del Pokémon desde PokeAPI
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${theId}`)
      .then((res) => res.json())
      .then((data) => setPokemon(data))
      .catch((err) => console.error("Error cargando Pokémon:", err));
  }, [theId]);

  // 2. Comprobar si ya es favorito
  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Comparamos usando el nombre que viene de la PokeAPI
          if (pokemon && data.includes(pokemon.name)) setIsFavorite(true);
        }
      } catch (err) {
        console.error("Error comprobando favoritos:", err);
      }
    };
    checkStatus();
  }, [theId, pokemon]); // Se ejecuta cuando cambia el Pokémon

  // 3. Lógica para añadir/eliminar favorito
  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");

    if (!token || token === "null" || token === "undefined") {
      alert("Inicia sesión para gestionar favoritos.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite/${pokemon.name}`, {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error("Error al gestionar favorito:", err);
    }
  };

  return (
    <div className="container text-center mt-5">
      {pokemon ? (
        <>
          <img 
            src={pokemon.sprites.other["official-artwork"].front_default} 
            alt={pokemon.name} 
            style={{ width: "300px" }} 
          />
          <h1 className="mt-3">{pokemon.name.toUpperCase()}</h1>
          <p>Altura: {pokemon.height} | Peso: {pokemon.weight}</p>
          
          <button
            onClick={toggleFavorite}
            className={`btn ${isFavorite ? "btn-danger" : "btn-primary"} mt-3`}
          >
            {isFavorite ? "❤️ Eliminar de Favoritos" : "🤍 Añadir a Favoritos"}
          </button>
        </>
      ) : (
        <h2>Cargando información del Pokémon...</h2>
      )}
    </div>
  );
};