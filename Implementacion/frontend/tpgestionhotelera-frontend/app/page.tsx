'use client';

import { useState } from "react";
import Home from "@/components/Home/page";
import LoginManager from "@/components/Manager/LoginManager";

export default function App() {
  const [logeado, setLogeado] = useState(false);

  const handleLoginExitoso = () => {
    setLogeado(true);
  };

  const handleLogout = () => {
    setLogeado(false);
  };

  return (
    <>
      {logeado ? (
        <Home onLogout={handleLogout} />
      ) : (
        <LoginManager onLoginExitoso={handleLoginExitoso} />
      )}
    </>
  );
}
