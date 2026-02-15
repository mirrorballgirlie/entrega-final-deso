"use client";
import { useEffect } from "react";

interface Props {
  onContinue: () => void;
  message?: string;

}

export default function CartelConfirmacion({ onContinue, message }: Props) {
  useEffect(() => {
    const handleKeyDown = () => onContinue();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onContinue]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px 60px",
          borderRadius: "12px",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
          color: "black",
        }}
      >
        <p>Reservas cancelada/s</p>
        <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "5rem",
                }}>
                  <p style={{
                    color: "#000",
                    fontFamily: "Open Sans",
                    fontSize: "32px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}>{message}</p>
                </div>
        <span
          style={{
            display: "block",
            marginTop: "15px",
            fontSize: "14px",
            opacity: 0.7,
            color: "black",
          }}
        >
          PRESIONE UNA TECLA PARA CONTINUAR…
        </span>
      </div>
    </div>
  );
}
