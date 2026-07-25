import React, { useEffect } from "react"
//import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Home = () => {

	const initialState = {
		pokemons: [] // ¡Esto es clave!
	};
	const { store, dispatch } = useGlobalReducer();

	const loadPokemons = async () => {
		try {
			const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
			const data = await response.json();
			// Guardamos la lista en el store global
			dispatch({ type: "set_pokemons", payload: data.results });
		} catch (error) {
			console.error("Error cargando Pokémon:", error);
		}
	};

	useEffect(() => {
		loadPokemons();
	}, []);

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Mi Pokédex</h1>
			<div className="row">
				{store.pokemons.map((pokemon, index) => {
					// El ID es el número que sale al final de la URL que nos da la API
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