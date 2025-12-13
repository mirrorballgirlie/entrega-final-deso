import React from "react";

interface Props {
  message: string;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: Props) {
  if (!isVisible) return null;

  return (
    <>
      {/* 1. Definimos la animación aquí mismo */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>

      {/* 2. El contenedor del Toast con estilos en línea */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#28a745", // Verde éxito
          color: "white",
          padding: "15px 30px",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          fontWeight: "bold",
          fontSize: "16px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          animation: "slideIn 0.5s ease-out", // Usamos la animación definida arriba
        }}
      >
        {/* Ícono de check simple */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        {message}
      </div>
    </>
  );
}