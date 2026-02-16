// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// //import FormularioBuscarFactura from "@/components/Formularios/FormularioBuscarFactura";
// import FormularioBuscarFactura from "../Formularios/FormularioBuscarFactura";
// //import ListadoFacturasNC from "@/components/Listados/ListadoFacturasNC";
// import ListadoFacturasNC from "../Listados/ListadoFacturasNC";
// import DetalleNotaCredito from "@/components/Listados/DetalleNotaCredito";

// interface Factura {
//   id: number;
//   numeroFactura: string;
//   fechaConfeccion: string;
//   importeNeto: number;
//   iva: number;
//   total: number;
// }

// interface NotaCreditoData {
//   nroNotaCredito: string;
//   responsablePago: string;
//   importeNeto: number;
//   iva: number;
//   importeTotal: number;
// }


// export default function IngresarNotaCreditoManager() {
//   const router = useRouter();
//   const finalizar = () => {
//       router.push("/home");
//   };

//   //const [step, setStep] = useState(1); // 1: Buscar, 2: Listado, 3: Detalle
// //   const [facturasPendientes, setFacturasPendientes] = useState([]);
// //   const [facturasSeleccionadas, setFacturasSeleccionadas] = useState([]);
// //   const [notaCreditoGenerada, setNotaCreditoGenerada] = useState(null);

// const [step, setStep] = useState(1);
  
//   // REEMPLAZA ESTAS TRES LÍNEAS:
//   const [facturasPendientes, setFacturasPendientes] = useState<Factura[]>([]); 
//   const [facturasSeleccionadas, setFacturasSeleccionadas] = useState<Factura[]>([]);
//   const [notaCreditoGenerada, setNotaCreditoGenerada] = useState<NotaCreditoData | null>(null);



//   const handleBuscar = (filtros: any) => {
//     const mockFacturas = [
//       { id: 1, numeroFactura: "001-00542", fechaDeConfeccion: "2024-05-10", importeNeto: 10000, iva: 2100, total: 12100 },
//       { id: 2, numeroFactura: "001-00545", fechaDeConfeccion: "2024-05-12", importeNeto: 5000, iva: 1050, total: 6050 },
//     ];

//     if (mockFacturas.length > 0) {
//       setFacturasPendientes(mockFacturas);
//       setStep(2);
//     } else {
//       alert("No hay facturas pendientes para los datos ingresados.");
//     }
//   };

//   const handleGenerarNC = (seleccionadas: any[]) => {

//     const totalNeto = seleccionadas.reduce((acc, f) => acc + f.importeNeto, 0);
//     const totalIVA = seleccionadas.reduce((acc, f) => acc + (f.iva || 0), 0);

//     setNotaCreditoGenerada({
//       nroNotaCredito: "NC-0001-000045",
//       responsablePago: "Juan Pérez",
//       importeNeto: totalNeto,
//       iva: totalIVA,
//       importeTotal: totalNeto + totalIVA
//     });
//     setStep(3);
//   };

//   return (
//     <div>
//       {step === 1 && <FormularioBuscarFactura onBuscar={handleBuscar} onCancelar={finalizar}/>}

//       {step === 2 && (
//         <ListadoFacturasNC
//           facturas={facturasPendientes}
//           onAceptar={handleGenerarNC}
//           onCancelar={() => setStep(1)}
//         />
//       )}

//       {step === 3 && notaCreditoGenerada && (
//         <DetalleNotaCredito
//           datos={notaCreditoGenerada}
//           onFinalizar={finalizar}
//         />
//       )}
//     </div>
//   );
// }

// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import FormularioBuscarFactura from "../Formularios/FormularioBuscarFactura";
// import ListadoFacturasNC from "../Listados/ListadoFacturasNC";
// import DetalleNotaCredito from "@/components/Listados/DetalleNotaCredito";

// // Definimos las interfaces EXACTAMENTE como las esperan los hijos
// interface Factura {
//   id: string; // Cambiado a string para coincidir con el Listado
//   numeroFactura: string;
//   fechaConfeccion: string; // Sin el "De" para que coincida con el mock y el hijo
//   importeNeto: number;
//   iva: number;
//   total: number;
// }

// interface NotaCreditoData {
//   nroNotaCredito: string;
//   responsablePago: string;
//   importeNeto: number;
//   iva: number;
//   importeTotal: number;
// }

// export default function IngresarNotaCreditoManager() {
//   const router = useRouter();
//   const finalizar = () => {
//     router.push("/home");
//   };

//   const [step, setStep] = useState(1);
//   const [facturasPendientes, setFacturasPendientes] = useState<Factura[]>([]);
//   const [notaCreditoGenerada, setNotaCreditoGenerada] = useState<NotaCreditoData | null>(null);

//   const handleBuscar = (filtros: any) => {
//     // Corregimos los datos del mock para que respeten la interfaz
//     const mockFacturas: Factura[] = [
//       { 
//         id: "1", // String
//         numeroFactura: "001-00542", 
//         fechaConfeccion: "2024-05-10", // Sin el "De"
//         importeNeto: 10000, 
//         iva: 2100, 
//         total: 12100 
//       },
//       { 
//         id: "2", // String
//         numeroFactura: "001-00545", 
//         fechaConfeccion: "2024-05-12", // Sin el "De"
//         importeNeto: 5000, 
//         iva: 1050, 
//         total: 6050 
//       },
//     ];

//     if (mockFacturas.length > 0) {
//       setFacturasPendientes(mockFacturas);
//       setStep(2);
//     } else {
//       alert("No hay facturas pendientes para los datos ingresados.");
//     }
//   };

//   // Cambiamos any[] por Factura[] para que sea consistente
//   const handleGenerarNC = (seleccionadas: Factura[]) => {
//     const totalNeto = seleccionadas.reduce((acc, f) => acc + f.importeNeto, 0);
//     const totalIVA = seleccionadas.reduce((acc, f) => acc + (f.iva || 0), 0);

//     setNotaCreditoGenerada({
//       nroNotaCredito: "NC-0001-000045",
//       responsablePago: "Juan Pérez",
//       importeNeto: totalNeto,
//       iva: totalIVA,
//       importeTotal: totalNeto + totalIVA
//     });
//     setStep(3);
//   };

//   return (
//     <div>
//       {step === 1 && <FormularioBuscarFactura onBuscar={handleBuscar} onCancelar={finalizar}/>}

//       {step === 2 && (
//         <ListadoFacturasNC
//           facturas={facturasPendientes}
//           onAceptar={handleGenerarNC}
//           onCancelar={() => setStep(1)}
//         />
//       )}

//       {step === 3 && notaCreditoGenerada && (
//         <DetalleNotaCredito
//           datos={notaCreditoGenerada}
//           onFinalizar={finalizar}
//         />
//       )}
//     </div>
//   );
// }

// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import FormularioBuscarFactura from "../Formularios/FormularioBuscarFactura";
// import ListadoFacturasNC from "../Listados/ListadoFacturasNC";
// import DetalleNotaCredito from "@/components/Listados/DetalleNotaCredito";

// // 💡 CONFIGURACIÓN: true para usar tu Backend de Java, false para datos locales
// const USE_MOCK = true; 
// const API_URL = "http://localhost:8080/api/notas-credito";

// interface Factura {
//   id: number;
//   numeroFactura: string;
//   fechaConfeccion: string;
//   importeNeto: number;
//   iva: number;
//   total: number;
// }

// export default function IngresarNotaCreditoManager() {
//   const router = useRouter();
//   const [step, setStep] = useState(1); // 1: Filtros, 2: Grilla, 3: Éxito
//   const [loading, setLoading] = useState(false);
//   const [facturasPendientes, setFacturasPendientes] = useState<Factura[]>([]);
//   const [notaCreditoGenerada, setNotaCreditoGenerada] = useState(null);

//   const finalizar = () => router.push("/home"); // Paso 10 del CU

//   // --- PASO 4: BÚSQUEDA ROBUSTA ---
//   const handleBuscar = async (filtros: any) => {
//     setLoading(true);
    
//     if (!USE_MOCK) {
//       // Mock local del frontend para pruebas rápidas
//       const mock = [
//         { id: 999, numeroFactura: "001-FRONT-MOCK", fechaConfeccion: "2026-02-15", importeNeto: 5000, iva: 1050, total: 6050 }
//       ];
//       setFacturasPendientes(mock);
//       setStep(2);
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}/buscar-facturas`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(filtros),
//       });

//       if (res.status === 204) {
//         alert("¡CUIDADO! No hay facturas pendientes para los datos ingresados."); // Paso 4.A
//         setLoading(false);
//         return;
//       }

//       const data = await res.json();
//       // Mapeo de DTO Java a Interfaz de Front
//       const mapeadas = data.map((f: any) => ({
//         id: f.id,
//         numeroFactura: f.nroFactura,
//         fechaConfeccion: f.fecha,
//         importeNeto: f.importeNeto,
//         iva: f.iva,
//         total: f.importeTotal
//       }));

//       setFacturasPendientes(mapeadas);
//       setStep(2);
//     } catch (error) {
//       alert("Error de conexión con el servidor Java.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- PASOS 7, 8 y 9: GENERACIÓN Y REACTIVACIÓN DE DEUDA ---
//   const handleGenerarNC = async (seleccionadas: Factura[]) => {
//     if (seleccionadas.length === 0) {
//       alert("Debe seleccionar al menos una factura.");
//       return;
//     }

//     setLoading(true);

//     if (!USE_MOCK) {
//       setNotaCreditoGenerada({
//         nroNotaCredito: "NC-FRONT-001",
//         responsablePago: "CLIENTE PRUEBA",
//         importeNeto: 5000,
//         iva: 1050,
//         importeTotal: 6050
//       });
//       setStep(3);
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}/generar`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ facturaIds: seleccionadas.map(f => f.id) }),
//       });

//       if (!res.ok) throw new Error();

//       const nc = await res.json();
//       setNotaCreditoGenerada(nc);
//       setStep(3); // Paso 8: Mostrar detalle
//     } catch (error) {
//       alert("La operación no se pudo concretar. Las facturas permanecen como pagadas."); // Postcondición Fracaso
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       {loading && <div className="text-blue-600 font-bold mb-4">Procesando solicitud...</div>}

//       {step === 1 && (
//         <FormularioBuscarFactura 
//           onBuscar={handleBuscar} 
//           onCancelar={finalizar} 
//         />
//       )}

//       {step === 2 && (
//         <ListadoFacturasNC
//           facturas={facturasPendientes}
//           onAceptar={handleGenerarNC}
//           onCancelar={() => setStep(1)}
//         />
//       )}

//       {step === 3 && notaCreditoGenerada && (
//         <DetalleNotaCredito
//           datos={notaCreditoGenerada}
//           onFinalizar={finalizar}
//         />
//       )}
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioBuscarFactura from "../Formularios/FormularioBuscarFactura";
import ListadoFacturasNC from "../Listados/ListadoFacturasNC";
import DetalleNotaCredito from "@/components/Listados/DetalleNotaCredito";

// 💡 CONFIGURACIÓN
const USE_MOCK = false; // true para usar los datos mock del aca del front, false para usar bdd (o los datos del factura repository mock, ojo con eso VER EL TODO)
const API_URL = "http://localhost:8080/api/notas-credito";

// Definimos las interfaces para que coincidan con los Listados
interface Factura {
  id: string; // Cambiado a string para que el Listado no proteste
  numeroFactura: string;
  fechaConfeccion: string;
  importeNeto: number;
  iva: number;
  total: number;
}

interface NotaCreditoData {
  nroNotaCredito: string;
  responsablePago: string;
  importeNeto: number;
  iva: number;
  importeTotal: number;
}

export default function IngresarNotaCreditoManager() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 💉 Agregamos tipos a los estados para solucionar el Error 1
  const [facturasPendientes, setFacturasPendientes] = useState<Factura[]>([]);
  const [notaCreditoGenerada, setNotaCreditoGenerada] = useState<NotaCreditoData | null>(null);

  const finalizar = () => router.push("/home");

  const handleBuscar = async (filtros: any) => {
    setLoading(true);
    
    if (USE_MOCK) {
      const mock: Factura[] = [
        { id: "999", numeroFactura: "001-FRONT-MOCK", fechaConfeccion: "2026-02-15", importeNeto: 5000, iva: 1050, total: 6050 }
      ];
      setFacturasPendientes(mock);
      setStep(2);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/buscar-facturas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtros),
      });

      if (res.status === 204) {
        alert("¡CUIDADO! No hay facturas pendientes para los datos ingresados.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      
      // 🛠️ Mapeo: Convertimos el id numérico de Java a string para el Front
      const mapeadas: Factura[] = data.map((f: any) => ({
        id: String(f.id), // Solución al Error de id (number vs string)
        numeroFactura: f.nroFactura,
        fechaConfeccion: f.fecha,
        importeNeto: f.importeNeto,
        iva: f.iva,
        total: f.importeTotal
      }));

      setFacturasPendientes(mapeadas);
      setStep(2);
    } catch (error) {
      alert("Error de conexión con el servidor Java.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarNC = async (seleccionadas: Factura[]) => {
    if (seleccionadas.length === 0) {
      alert("Debe seleccionar al menos una factura.");
      return;
    }

    setLoading(true);

    if (USE_MOCK) {
      setNotaCreditoGenerada({
        nroNotaCredito: "NC-FRONT-001",
        responsablePago: "CLIENTE PRUEBA",
        importeNeto: 5000,
        iva: 1050,
        importeTotal: 6050
      });
      setStep(3);
      setLoading(false);
      return;
    }

    try {
      // Convertimos los IDs de nuevo a número para el Backend de Java
      const facturaIds = seleccionadas.map(f => Number(f.id));

      const res = await fetch(`${API_URL}/generar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facturaIds }),
      });

      if (!res.ok) throw new Error();

      const nc: NotaCreditoData = await res.json();
      setNotaCreditoGenerada(nc);
      setStep(3);
    } catch (error) {
      alert("La operación no se pudo concretar. Las facturas permanecen como pagadas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {loading && <div className="text-blue-600 font-bold mb-4">Procesando solicitud...</div>}

      {step === 1 && (
        <FormularioBuscarFactura 
          onBuscar={handleBuscar} 
          onCancelar={finalizar} 
        />
      )}

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