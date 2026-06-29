import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		// Borramos el token del almacenamiento del navegador
		localStorage.removeItem("token");

		// Lo mandamos a la pantalla de acceso
		alert("Sesión cerrada correctamente. ¡Hasta la próxima, Entrenador!");
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light mb-3 px-3">
			<div className="container-fluid">
				<Link to="/">
					<span className="navbar-brand mb-0 h1 text-primary">Aplicación Pokédex</span>
				</Link>
				<div className="ml-auto">
					<button className="btn btn-danger" onClick={handleLogout}>
						Cerrar Sesión
					</button>
				</div>
			</div>
		</nav>
	);
};