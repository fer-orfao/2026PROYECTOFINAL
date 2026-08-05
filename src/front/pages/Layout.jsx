import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar"; 
import { Footer } from "../components/Footer";

export const Layout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};