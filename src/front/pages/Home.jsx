import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Home = () => {
    // Usamos un estado local para guardar los pokémon directamente en esta vista
    const [pokemons, setPokemons] = useState([]);

    const loadPokemons = async () => {
        try {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
            const data = await response.json();
            setPokemons(data.results);
        } catch (error) {
            console.error("Error cargando Pokémon:", error);
        }
    };

    useEffect(() => {
        loadPokemons();
    }, []);

    return (
        <div className="container text-center mt-5">
            <h1 className="display-4 mb-4">Mi Pokédex</h1>
            <div className="row">
                {pokemons.map((pokemon, index) => {
                    const id = index + 1;

                    return (
                        <div key={id} className="col-md-3 mb-4">
                            <div className="card text-center shadow-sm">
                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                                    className="card-img-top w-50 mx-auto"
                                    alt={pokemon.name}
                                />
                                <div className="card-body">
                                    <h5 className="card-title text-capitalize">{pokemon.name}</h5>
                                    <Link to={`/single/${id}`} className="btn btn-primary">
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};