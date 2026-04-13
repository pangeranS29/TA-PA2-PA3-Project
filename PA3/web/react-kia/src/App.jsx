// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NeonatusList from "./pages/Neonatus";
import CreateNeonatus from "./pages/Neonatus/Create";
import { isAuthenticated } from "./services/auth";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={ <PrivateRoute><Dashboard /></PrivateRoute> }/>
        <Route path="/neonatus" element={ <PrivateRoute><NeonatusList /></PrivateRoute> }/>
        <Route path="/neonatus/create" element={ <PrivateRoute><CreateNeonatus /></PrivateRoute> }/>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        {/* Tambahkan route lain jika perlu */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;