import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importamos useNavigate

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
  const navigate = useNavigate(); // Inicializamos navigate

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
          navigate("/login");
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

  // Función para eliminar la cuenta
  const handleDeleteAccount = async () => {
    if (!window.confirm("¿Estás segura de que quieres eliminar tu cuenta de forma permanente? Perderás todos tus favoritos.")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        localStorage.removeItem("token");
        alert("Tu cuenta ha sido eliminada. ¡Esperamos verte pronto!");
        navigate("/"); // Llevamos al usuario a la home
      } else {
        alert("Hubo un error al eliminar la cuenta.");
      }
    } catch (err) {
      console.error("Error al eliminar la cuenta:", err);
    }
  };

  const uniqueFavorites = [...new Set(favorites)];

  return (
    <div className="container text-center mt-5 mb-5">
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

      {/* Separador y botón de zona de peligro al final */}
      <hr className="mt-5" />
      <div className="mt-4">
        <p className="text-muted small">Zona de peligro</p>
        <button onClick={handleDeleteAccount} className="btn btn-outline-danger btn-sm">
          ¿Quieres eliminar tu cuenta?
        </button>
      </div>
    </div>
  );
};