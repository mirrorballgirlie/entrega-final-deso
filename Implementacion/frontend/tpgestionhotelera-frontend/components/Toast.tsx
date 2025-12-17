import React from "react";

// Definimos los tipos permitidos
export type ToastType = "success" | "error" | "warning";

interface Props {
  message: string;
  isVisible: boolean;
  type?: ToastType; // Es opcional, por defecto será 'success'
}

export default function Toast({ message, isVisible, type = "success" }: Props) {
  if (!isVisible) return null;

  // Configuración de colores según el tipo
  // Success: Verde, Error: Rojo, Warning: Naranja (para que se lea bien la letra blanca)
  const stylesConfig = {
    success: { backgroundColor: "#28a745" },
    error:   { backgroundColor: "#dc3545" },
    warning: { backgroundColor: "#ff9800" }, // Naranja fuerte para advertencia
  };

  const currentStyle = stylesConfig[type];

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: currentStyle.backgroundColor, // Color dinámico
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
          animation: "slideIn 0.5s ease-out",
        }}
      >
        {/* Renderizado condicional del ícono SVG según el tipo */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {type === "success" && <polyline points="20 6 9 17 4 12" />}
          
          {type === "error" && (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          )}

          {type === "warning" && (
            <>
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </>
          )}
        </svg>
        
        {message}
      </div>
    </>
  );
}