import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const handleLogout = () => {
		localStorage.removeItem("token");
		alert("Sesión cerrada correctamente. ¡Hasta la próxima, Entrenador!");
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light mb-3 px-3">
			<div className="container-fluid">

				<Link to="/">

					<span className="navbar-brand mb-0 h1 text-primary">Pokédex</span>
				</Link>

				<Link to="/edit-profile" className="btn btn-warning ms-2">
					Edita tu nombre de entrenador
				</Link>


				<div className="ml-auto">
					{token ? (

						<>
							<Link to="/favorites" className="btn btn-success me-2">Mis Favoritos</Link>
							<button className="btn btn-danger" onClick={handleLogout}>
								Cerrar Sesión
							</button>
						</>
					) : (

						<>
							<Link to="/login" className="btn btn-primary me-2">Login</Link>
							<Link to="/signup" className="btn btn-success">Registro</Link>
						</>
					)}
				</div>

			</div>
		</nav>
	);
};