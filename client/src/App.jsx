import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { currentUser } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Navigate to="/dashboard" /> : <Home />}
        />
        <Route
          path="/dashboard"
          element={currentUser ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={
            currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/" />
          }
        />
      </Routes>
      <Toaster></Toaster>
    </>
  );
}
