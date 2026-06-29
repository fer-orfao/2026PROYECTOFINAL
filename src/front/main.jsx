import React from 'react'
import ReactDOM from 'react-dom/client'

import "./index.css" // Estilos globales

// Forzamos a React a usar el archivo correcto de tus rutas
import { router } from "./routes.jsx"
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)