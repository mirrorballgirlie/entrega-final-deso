"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ListadoFacturasPendientes from "../Listados/ListadoFacturasPendientes";
import FormularioIngresarPago from "../Formularios/FormularioIngresarPago";
import PopupCritical from "../PopupCritical";
import Title from "@/components/Title";
import Button from "@/components/Button";

export default function IngresarPagoManager() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1. buscar 2. listado 3. pagar
  const [nroHabitacion, setNroHabitacion] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);
  const [error, setError] = useState("");

  const buscarFacturas = async () => {
    if (!nroHabitacion) {
      setError("Número de habitación faltante");
      return;
    }
       
    try {
      //simulo api
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const res = await fetch(`${base}/api/pago/facturas-pendiente/${nroHabitacion}`);
      
      if (!res.ok) throw new Error();
      const data = await res.json();

      if (data.length === 0) {
        setError("No existen facturas pendientes de pago");
      } else {
        setFacturas(data);
        setError("");
        setStep(2);
      }
    } catch (err) {
      setError("Habitación incorrecta o error de conexión");
    }
  };


  const seleccionarFactura = (factura: any) => {
    setFacturaSeleccionada(factura);
    setStep(3);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "80vh",
      padding: "20px"
    }}>

      <div style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "60px",
          overflow: "visible",
        //transform: "scale(0.8)",
        //transformOrigin: "center",
        marginTop: "30px",
        marginBottom: "30px"
      }}>
        <Title>Ingresar Pago</Title>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {step === 1 && (
          <div style={{
            width: "100%",
            maxWidth: "500px",
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            marginTop: "40px"
          }}>
            <h3 style={{ marginBottom: "20px", fontSize: "24px", color: "black" }}>Buscar Factura</h3>

            <label style={{ display: "block", color: "black", marginBottom: "8px", fontWeight: "600" }}>
              Número de Habitación *
            </label>
            <input
              type="text"
              value={nroHabitacion}
              onChange={(e) => setNroHabitacion(e.target.value)}
              placeholder="Ej: 101"
              style={{
                  color: "black",
                width: "100%",
                padding: "12px",
                marginBottom: "10px",
                border: "2px solid #374375",
                borderRadius: "6px",
                fontSize: "16px"
              }}
            />

            {error && (
              <p style={{ color: "#d32f2f", fontSize: "14px", marginBottom: "15px", fontWeight: "bold" }}>
                 {error}
              </p>
            )}

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "30px" }}>
              <Button onClick={buscarFacturas}>Siguiente</Button>
              <Button
                  onClick={() => router.push("/home")}
                  style={{ backgroundColor: "#6c757d" }} // Un gris para diferenciarlo
                >
                  Cancelar
                </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ width: "100%", maxWidth: "1000px", marginTop: "20px" }}>
            <ListadoFacturasPendientes
              facturas={facturas}
              onSeleccionar={seleccionarFactura}
              onBack={() => setStep(1)}
            />
          </div>
        )}

        {step === 3 && (
          <div style={{ width: "100%", maxWidth: "1100px", marginTop: "20px" }}>
            <FormularioIngresarPago
              factura={facturaSeleccionada}
              onSuccess={() => router.push("/home")}
              onCancel={() => setStep(2)}
            />
          </div>
        )}

      </div>

      <div style={{ flex: 2 }}></div>
    </div>
  );
}