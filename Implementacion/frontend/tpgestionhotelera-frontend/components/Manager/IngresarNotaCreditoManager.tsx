"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioBuscarFactura from "@/components/Formularios/FormularioBuscarFactura";
import ListadoFacturasNC from "@/components/Listados/ListadoFacturasNC";
import DetalleNotaCredito from "@/components/Listados/DetalleNotaCredito";

export default function IngresarNotaCreditoManager() {
  const router = useRouter();
  const finalizar = () => {
      router.push("/home");
  };

  const [step, setStep] = useState(1); // 1: Buscar, 2: Listado, 3: Detalle
  const [facturasPendientes, setFacturasPendientes] = useState([]);
  const [facturasSeleccionadas, setFacturasSeleccionadas] = useState([]);
  const [notaCreditoGenerada, setNotaCreditoGenerada] = useState(null);

  const handleBuscar = (filtros: any) => {
    const mockFacturas = [
      { id: 1, numeroFactura: "001-00542", fechaDeConfeccion: "2024-05-10", importeNeto: 10000, iva: 2100, total: 12100 },
      { id: 2, numeroFactura: "001-00545", fechaDeConfeccion: "2024-05-12", importeNeto: 5000, iva: 1050, total: 6050 },
    ];

    if (mockFacturas.length > 0) {
      setFacturasPendientes(mockFacturas);
      setStep(2);
    } else {
      alert("No hay facturas pendientes para los datos ingresados.");
    }
  };

  const handleGenerarNC = (seleccionadas: any[]) => {

    const totalNeto = seleccionadas.reduce((acc, f) => acc + f.importeNeto, 0);
    const totalIVA = seleccionadas.reduce((acc, f) => acc + (f.iva || 0), 0);

    setNotaCreditoGenerada({
      nroNotaCredito: "NC-0001-000045",
      responsablePago: "Juan Pérez",
      importeNeto: totalNeto,
      iva: totalIVA,
      importeTotal: totalNeto + totalIVA
    });
    setStep(3);
  };

  return (
    <div>
      {step === 1 && <FormularioBuscarFactura onBuscar={handleBuscar} onCancelar={finalizar}/>}

      {step === 2 && (
        <ListadoFacturasNC
          facturas={facturasPendientes}
          onAceptar={handleGenerarNC}
          onCancelar={() => setStep(1)}
        />
      )}

      {step === 3 && notaCreditoGenerada && (
        <DetalleNotaCredito
          datos={notaCreditoGenerada}
          onFinalizar={finalizar}
        />
      )}
    </div>
  );
}