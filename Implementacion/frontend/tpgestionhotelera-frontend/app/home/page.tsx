"use client"; 

import Home from "@/components/Home/page";

export default function HomePage() {

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    window.location.href = "/login";
  };

  return <Home onLogout={handleLogout} />;
}