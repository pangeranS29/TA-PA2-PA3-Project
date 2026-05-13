// src/pages/Login.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, getCurrentUser, getUserRedirectRoute } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(identifier, password);
      const user = getCurrentUser(); // ambil dari localStorage
      const targetRoute = getUserRedirectRoute(user);
      navigate(targetRoute, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-3">KIA System</h2>
        <p className="text-gray-600 text-sm">
          Halaman login web sudah dinonaktifkan. Sistem akan langsung diarahkan ke dashboard.
        </p>
      </div>
    </div>
  );
};

export default Login;