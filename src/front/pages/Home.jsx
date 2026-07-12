import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
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
				{store.pokemons.map((pokemon, index) => (
					<div key={index} className="col-md-3">
						<div className="card m-2">
							<div className="card-body">
								<h5>{pokemon.name.toUpperCase()}</h5>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};