"use client"; 

import Home from "@/components/Home/page";

export default function HomePage() {

  const handleLogout = () => {
    window.location.href = "/";
  };

  return <Home onLogout={handleLogout} />;
}