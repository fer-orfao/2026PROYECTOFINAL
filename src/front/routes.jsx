// src/front/routes.jsx
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout"; 
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Favorites } from "./pages/Favorites";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { Demo } from "./pages/Demo";
import { EditProfile } from "./pages/EditProfile.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // (El Layout envuelve a todas las rutas hijas)
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="demo" element={<Demo />} />
      <Route path="/edit-profile" element={<EditProfile />} />

    </Route>
  )
);