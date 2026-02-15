"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioBuscarFactura from "@/components/Formularios/FormularioBuscarFactura";
import ListadoFacturasNC from "@/components/Listados/ListadoFacturasNC";
import DetalleNotaCredito from "@/components/Listados/DetalleNotaCredito";
//import  triggerToast from "@/utils/ToastUtils";

export default function IngresarNotaCreditoManager() {
  const router = useRouter();
  const finalizar = () => {
      router.push("/home");
  };

  const [step, setStep] = useState(1); // 1: Buscar, 2: Listado, 3: Detalle
  const [facturasPendientes, setFacturasPendientes] = useState([]);
  const [facturasSeleccionadas, setFacturasSeleccionadas] = useState([]);
  const [notaCreditoGenerada, setNotaCreditoGenerada] = useState<any>({
    nroNotaCredito: "",
    responsablePago: "",
    importeNeto: 0,
    iva: 0,
    importeTotal: 0
});
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
const triggerToast = (msg: string, type: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuscar = async (filtros: any) => {
    const base = process.env.NEXT_PUBLIC_API_BASE || "";
    const response = await fetch(`${base}/api/facturas/facturas-pendiente?cuit=${filtros.cuit}&tipoDocumento=${filtros.tipoDocumento}&documento=${filtros.numeroDocumento}`);
    if (response.ok) {
      const data = await response.json();
      setFacturasPendientes(data);
      setStep(2); 
    } else {
      alert("No hay facturas pendientes para los datos ingresados.");
    }
  };

  const handleGenerarNC = async (seleccionadas: any[]) => {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE || "";
    
    // 1. Extraemos solo los IDs de las facturas seleccionadas
    const facturasIds = seleccionadas.map(f => f.id);

    // 2. LLAMADA AL BACKEND (Controller)
    const response = await fetch(`${base}/api/facturas/generar-notacredito`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facturasIds) // Enviamos la lista de IDs al backend
    });

    if (response.ok) {
      const data = await response.json(); // La NotaCreditoDTO que devuelve Java

      // 3. ACTUALIZAMOS EL ESTADO con datos REALES del servidor
      setNotaCreditoGenerada({
        nroNotaCredito: data.numero || "NC-GENERADA", // Usamos lo que viene de Java
        //responsablePago: form.nombre + " " + form.apellido, // O el dato que tengas en el form
        importeNeto: data.monto,
        iva: data.iva,
        importeTotal: data.total
      });

      // 4. PASAMOS AL PASO DE VISUALIZACIÓN
      setStep(3);
    } else {
      triggerToast("Error al generar la Nota de Crédito en el servidor", "error");
    }
  } catch (error) {
    triggerToast("Error de conexión", "error");
  }
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