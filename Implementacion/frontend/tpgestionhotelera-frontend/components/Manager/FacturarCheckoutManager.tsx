"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioFacturarCheckout from "@/components/Formularios/FormularioFacturarCheckout";
import ListadoOcupantes, { Ocupante, SeleccionResponsable } from "@/components/Listados/ListadoOcupantes";
import Button from "@/components/Button";
<<<<<<< HEAD
=======
//import ListadoFactura, { hayItemsNoSeleccionados } from "@/components/Listados/ListadoFactura";
import ListadoFactura from "@/components/Listados/ListadoFactura";

const USE_MOCK = false; // 🔥 CAMBIAR A false PARA USAR BACKEND REAL
>>>>>>> develop-maria

export default function FacturarCheckoutManager() {
  const router = useRouter();

  const [form, setForm] = useState({
    numeroHabitacion: "",
    horaSalida: "",
  });

  const [errors, setErrors] = useState<{
    numeroHabitacion?: string;
    horaSalida?: string;
  }>({});

// estados
  const [mostrarGrilla, setMostrarGrilla] = useState(false);
  const [ocupantes, setOcupantes] = useState<Ocupante[]>([]);
  const [responsableSeleccionado, setResponsableSeleccionado] = useState<SeleccionResponsable | null>(null);
  const [errorSeleccion, setErrorSeleccion] = useState(""); //error menor de edad
  const [mostrarInputCUIT, setMostrarInputCUIT] = useState(false);
  const [cuitTercero, setCuitTercero] = useState("");
  const [mostrarFormularioResponsable, setMostrarFormularioResponsable] = useState(false);
  const [razonSocial, setRazonSocial] = useState<string | null>(null);
  const [flujo, setFlujo] = useState<'ocupantes' | 'cuit' | 'factura'>('ocupantes');
<<<<<<< HEAD
  const [ocupanteSeleccionado, setOcupanteSeleccionado] = useState<{requiereCuit: boolean; mayorEdad: boolean} | null>(null);;
=======
  //const [ocupanteSeleccionado, setOcupanteSeleccionado] = useState(null);
  const [ocupanteSeleccionado, setOcupanteSeleccionado] = useState<Ocupante | null>(null);
>>>>>>> develop-maria
  const [personaFactura, setPersonaFactura] = useState<any>(null);
  const [mostrarModalFactura, setMostrarModalFactura] = useState(false);

  // 🔥 estados nuevos para backend real
  const [estadiaId, setEstadiaId] = useState<number | null>(null);
  const [valorEstadia, setValorEstadia] = useState<number>(0);
  const [consumosReales, setConsumosReales] = useState<any[]>([]);



  // mocks
  const habitacionesExistentes = [101, 102, 201, 202, 203, 301, 302, 303];
  const habitacionesOcupadas = [101, 203, 302];

  const ocupantesMock: Ocupante[] = [
    { id: 1, nombre: "Juan Pérez", dni: "30123456", edad: 35 },
    { id: 2, nombre: "Ana Gómez", dni: "45111222", edad: 17 },
    { id: 3, nombre: "Carlos López", dni: "28999888", edad: 42 },
  ];

  const tercerosMock: Record<string, string> = {
    "30712345678": "ACME S.A.",
    "30987654321": "Servicios Patito SRL",
  };

  const facturaMock = {
    estadia: 50000,
    consumos: [
      { descripcion: "Minibar", monto: 12000 },
      { descripcion: "Room service", monto: 8000 },
    ],
  };

   const consumosDisponiblesMock = [
      { id: "bar", descripcion: "Bar", monto: 12000 },
      { id: "sauna", descripcion: "Sauna", monto: 0 },
      { id: "lavado", descripcion: "Lavado", monto: 8000 },
   ];


// const onAceptar = () => {                    supuestamente hay que eliminar esto porque no se necesita mas
//   if (!ocupanteSeleccionado) return;

//   if (ocupanteSeleccionado.requiereCuit) {
//     setFlujo('cuit');
//   } else if (ocupanteSeleccionado.mayorEdad) {
//     setFlujo('factura');
//   }
// };




//formularios

const handleCancel = () => {
  router.push("/home");
};


   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setForm({ ...form, [e.target.name]: e.target.value });
   };

  

  const esHoraFutura = (hora: string) => {
    const ahora = new Date();
    const [h, m] = hora.split(":").map(Number);

    const horaIngresada = new Date();
    horaIngresada.setHours(h, m, 0, 0);

    return horaIngresada > ahora;
  };

<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent<any>) => {
  e.preventDefault();
  // ... (tus validaciones de errores de habitación y hora)

  try {
    // Llamamos al controlador real
    const params = new URLSearchParams({ 
      habitacion: form.numeroHabitacion, 
      salida: new Date().toISOString().split('T')[0] // Fecha de hoy o la que elijas
    });

    const response = await fetch(`http://localhost:8080/api/facturas/buscar-ocupantes?${params.toString()}`);
    
    if (!response.ok) throw new Error("No se encontraron ocupantes");

    const datosReales = await response.json();
    
    setOcupantes(datosReales); // <--- ACÁ guardás los ocupantes que vienen de tu BDD
    setMostrarGrilla(true);
    setErrors({});
  } catch (error) {
    alert("Error: No se encontró una estadía activa para esa habitación.");
  }
};

  const handleCancel = () => {
    router.push("/home");
  };

//al aceptar ocupante
  const handleAcceptOcupante = () => {
    if(responsableSeleccionado === "TERCERO") { // es tercero
    setErrorSeleccion("");
    setMostrarModalFactura(false);
    setMostrarInputCUIT(true); //muestra cuit tercero
    return;
    }
    const ocupante = responsableSeleccionado;
    if (ocupante ){ // //=! tercero
        if(ocupante.edad < 18){
        setErrorSeleccion("La persona seleccionada es menor de edad. Por favor elija otra.");
        setResponsableSeleccionado(null);
=======
  

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const nuevosErrores: {
  //     numeroHabitacion?: string;
  //     horaSalida?: string;
  //   } = {};

  //   // validar habitación
  //   if (!form.numeroHabitacion.trim()) {
  //     nuevosErrores.numeroHabitacion = "Número de habitación faltante";
  //   } else {
  //     const numero = Number(form.numeroHabitacion);

  //     if (isNaN(numero) || numero <= 0) {
  //       nuevosErrores.numeroHabitacion = "Número de habitación incorrecto";
  //     } 
  //     else if (!habitacionesExistentes.includes(numero)) {
  //       nuevosErrores.numeroHabitacion = "La habitación no existe";
  //     } 
  //     else if (habitacionesOcupadas.includes(numero)) {
  //       nuevosErrores.numeroHabitacion = "La habitación está ocupada";
  //     }
  //   }

  //   // validar hora
  //   if (!form.horaSalida.trim()) {
  //     nuevosErrores.horaSalida = "Hora de salida faltante";
  //   } else if (esHoraFutura(form.horaSalida)) {
  //     nuevosErrores.horaSalida = "La hora no puede ser futura";
  //   }

  //   // si hay errores
  //   if (Object.keys(nuevosErrores).length > 0) {
  //     setErrors(nuevosErrores);
  //     return;
  //   }

  //   // si no
  //   setErrors({});
  //   //console.log("Checkout facturado", form);
  //   setOcupantes(ocupantesMock);
  //   setMostrarGrilla(true);

  // };

  // const handleCancel = () => {
  //   router.push("/home");
  // };


  //=======================================SUBMIT========================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();                                                //prevenir recarga de la pagina

    const nuevosErrores: {                      //creacion de un objet vacio para cargar errores de validacion
      numeroHabitacion?: string;
      horaSalida?: string;
    } = {};

    if (!form.numeroHabitacion.trim()) {
      nuevosErrores.numeroHabitacion = "Número de habitación faltante";  //validacion de campos
    }

    if (!form.horaSalida.trim()) {
      nuevosErrores.horaSalida = "Hora de salida faltante";     //validacion de campos
    } else if (esHoraFutura(form.horaSalida)) {
      nuevosErrores.horaSalida = "La hora no puede ser futura"; //validacion de campos
    }

    if (Object.keys(nuevosErrores).length > 0) {                //si hay errores corto el flujo
      setErrors(nuevosErrores);
      return;
    }

    setErrors({});                                             //si no hay errores, limpio errores previos (si los hubiera) y sigo con el flujo
    const numero = Number(form.numeroHabitacion);              //pasamos el numero a Number, para poder usarlo en la URL

    // 🔵 MODO MOCK
    if (USE_MOCK) {
      if (!habitacionesExistentes.includes(numero)) {
        alert("La habitación no existe");                    //simula que la habitacion exista
>>>>>>> develop-maria
        return;
      }
      if (habitacionesOcupadas.includes(numero)) {
        alert("La habitación está ocupada");                //simula saber el estado de la habitacion
        return;
      }

<<<<<<< HEAD
        setPersonaFactura({
            nombre: ocupante.nombre,
            condicionIVA: "CF",
        });

        setErrorSeleccion("");
        setMostrarInputCUIT(false);
        setMostrarModalFactura(true);
=======
      setOcupantes(ocupantesMock);         //cargar ocupantes fake y mostrar el listado
      setMostrarGrilla(true);
      return;
>>>>>>> develop-maria
    }

    // 🔴 MODO REAL BDD
    try {
      const resEstadia = await fetch(
        `http://localhost:8080/api/estadias/buscar-por-habitacion/${numero}`    //url chequeada, deberia estar bien
      );

      if (!resEstadia.ok) {
        alert("No existe estadía activa");
        return;
      }

      const estadia = await resEstadia.json();
      setEstadiaId(estadia.id);

      const resOcupantes = await fetch(
        `http://localhost:8080/buscar-ocupantes?habitacion=${numero}&salida=${new Date().toISOString().split("T")[0]}` //segun chat esta url esta bien
      );

      const dataOcupantes = await resOcupantes.json();
      setOcupantes(dataOcupantes);
      setMostrarGrilla(true);

    } catch {
      alert("Error de conexión");
    }
  };

//======================================ACEPTAR OCUPANTE==========================================

  // const handleAcceptOcupante = () => {
  //   if(responsableSeleccionado === "TERCERO") { // es tercero
  //   setErrorSeleccion("");
  //   setMostrarModalFactura(false);
  //   setMostrarInputCUIT(true); //muestra cuit tercero
  //   return;
  //   }
  //   if (responsableSeleccionado ){ // //=! tercero
  //       if(responsableSeleccionado.edad < 18){
  //       setErrorSeleccion("La persona seleccionada es menor de edad. Por favor elija otra.");
  //       setResponsableSeleccionado(null);
  //       return;
  //       }

  //       setPersonaFactura({
  //           nombre: responsableSeleccionado.nombre,
  //           condicionIVA: "CF",
  //       });

  //       setErrorSeleccion("");
  //       setMostrarInputCUIT(false);
  //       setMostrarModalFactura(true);
  //   }

  // };

  // const handleAcceptOcupante = async () => {
  //   //if (!responsableSeleccionado) return;
  //   if (!responsableSeleccionado || responsableSeleccionado === "TERCERO") return;

  //   // 🔵 MOCK
  //   if (USE_MOCK) {
  //     if (responsableSeleccionado.edad < 18) {
  //       setErrorSeleccion("La persona seleccionada es menor de edad.");
  //       setResponsableSeleccionado(null);
  //       return;
  //     }
  //   } 
  //   // 🔴 REAL
  //   else {
  //     const resMayor = await fetch(
  //       `http://localhost:8080/verificar-mayor/${responsableSeleccionado.id}`
  //     );
  //     const esMayor = await resMayor.json();

  //     if (!esMayor) {
  //       setErrorSeleccion("La persona seleccionada es menor de edad.");
  //       setResponsableSeleccionado(null);
  //       return;
  //     }

  //     if (estadiaId) {
  //       const resValor = await fetch(`http://localhost:8080/${estadiaId}/valor-estadia`);
  //       const valor = await resValor.json();
  //       setValorEstadia(valor);

  //       const resConsumos = await fetch(`http://localhost:8080/${estadiaId}/items-pendientes`);
  //       const consumos = await resConsumos.json();
  //       setConsumosReales(consumos);
  //     }
  //   }

  //   setPersonaFactura({
  //     nombre: responsableSeleccionado.nombre,
  //     condicionIVA: "CF",
  //   });

  //   setErrorSeleccion("");
  //   setMostrarModalFactura(true);
  // };

  const handleAcceptOcupante = async () => {
  if (!responsableSeleccionado) return;

  // 🟣 CASO 5.B — TERCERO
  if (responsableSeleccionado === "TERCERO") {
    setMostrarInputCUIT(true);
    setErrorSeleccion("");
    return;
  }

  // 🔵 CASO 5.A — OCUPANTE

  if (USE_MOCK) {
    if (responsableSeleccionado.edad < 18) {
      setErrorSeleccion(
        "La persona seleccionada es menor de edad. Por favor elija otra."
      );
      setResponsableSeleccionado(null);
      return;
    }
  } else {
    const resMayor = await fetch(
      `http://localhost:8080/verificar-mayor/${responsableSeleccionado.id}`
    );

    const esMayor = await resMayor.json();

    if (!esMayor) {
      setErrorSeleccion(
        "La persona seleccionada es menor de edad. Por favor elija otra."
      );
      setResponsableSeleccionado(null);
      return;
    }

    if (estadiaId) {
      const resValor = await fetch(
        `http://localhost:8080/${estadiaId}/valor-estadia`
      );
      const valor = await resValor.json();
      setValorEstadia(valor);

      const resConsumos = await fetch(
        `http://localhost:8080/${estadiaId}/items-pendientes`
      );
      const consumos = await resConsumos.json();
      setConsumosReales(consumos);
    }
  }

  // 👉 Punto 6 del CU
  setPersonaFactura({
    nombre: responsableSeleccionado.nombre,
    condicionIVA: "CF",
  });

  setMostrarModalFactura(true);
};



  //=====================================CUIT===============================================
  // const handleCUITAceptar = () => {
  //     if(!razonSocial) {
  //       if (!cuitTercero.trim()){
  //         alert("Ingrese un CUIT valido");
  //         return;
  //       }
  //       const razon = tercerosMock[cuitTercero] ?? "Razon social no encontrada";
  //       setRazonSocial(razon);
  //       return;
  //     }

  //     setPersonaFactura({
  //       razonSocial,
  //       condicionIVA: "RI",
  //     });
  //     setMostrarModalFactura(true);
  //     setMostrarInputCUIT(false);
  // };

  // const handleCUITCancelar = () => {
  //     if(razonSocial){
  //         setRazonSocial(null); //vuelve a ingreso cuit
  //     } else {
  //   setCuitTercero("");
  //   setMostrarInputCUIT(false);
  //   setResponsableSeleccionado(null);
  //   }
  // };

  const handleCUITAceptar = async () => {
    if (!razonSocial) {
      if (!cuitTercero.trim()) {
        alert("Ingrese un CUIT válido");
        return;
        //ACA EN REALIDAD SE DEBERIA IMPLEMENTAR EL LLAMADO A ALTA DE RESPONSABLE DE PAGO, PERO AUN NO ESTA IMPLEMENTADO
      }

      // MOCK
      if (USE_MOCK) {
        const razon = tercerosMock[cuitTercero] ?? null;
        if (!razon) {
          alert("CUIT no encontrado");
          return;
        }
        setRazonSocial(razon);
        return;
      }

      // REAL
      const res = await fetch(
        `http://localhost:8080/responsablesdepago?cuit=${cuitTercero}`
      );

      const data = await res.json();
      if (!data || data.length === 0) {
        alert("CUIT no encontrado");
        return;
      }

      setRazonSocial(data[0].razonSocial);
      return;
    }

    setPersonaFactura({
      razonSocial,
      condicionIVA: "RI",
    });

    setMostrarModalFactura(true);
    setMostrarInputCUIT(false);
  };

  const handleCUITCancelar = () => {
    if (razonSocial) {
      setRazonSocial(null);
    } else {
      setCuitTercero("");
      setMostrarInputCUIT(false);
      setResponsableSeleccionado(null);
    }
  };

<<<<<<< HEAD
  const handleFacturaFinal = async (datosFactura: any, pendientes: boolean) => {
    try {
        const response = await fetch("http://localhost:8080/api/facturas/generar", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosFactura)
        });

        if (response.ok) {
            if (pendientes) {
                // REQUERIMIENTO: si hay items no tildados vuelve a mostrar la grilla
                alert("Factura parcial generada. Quedan ítems pendientes.");
                setMostrarModalFactura(false);
                setResponsableSeleccionado(null);
                setRazonSocial(null);
                // Aquí podrías volver a cargar los ocupantes/consumos actualizados
            } else {
                alert("Facturación completa");
                router.push("/home");
            }
        }
    } catch (error) {
        console.error("Error al facturar", error);
    }
};

//ui
=======
>>>>>>> develop-maria

//==========================================UI===========================================

//   if (!mostrarGrilla) {
//     return (
//       <FormularioFacturarCheckout
//         form={form}
//         errors={errors}
//         onChange={handleChange}
//         onSubmit={handleSubmit}
//         onCancel={handleCancel}
//       />
//     );
//   }

//   return (
//     <div>
//       <ListadoOcupantes
//         ocupantes={ocupantes}
//         seleccionado={responsableSeleccionado}
//         onSelect={setResponsableSeleccionado}
//         onCancel={handleCancel}
//         onAccept={handleAcceptOcupante}
//         mostrarBotones={!mostrarInputCUIT && !mostrarFormularioResponsable}
//       >

//       {errorSeleccion && (
//         <div style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
//           {errorSeleccion}
//         </div>
//       )}

//       {mostrarInputCUIT && (
//             <div
//               style={{
//                   display: "flex",
//                   margin: "0 auto",
//                   flexDirection: "column",
//                   gap: "12px",
//                   alignSelf: "center",
//                   width: "100%",
//                   maxWidth: "420px",
//                   padding: "16px",
//                   border: "1px solid #ccc",
//                   borderRadius: "8px",
//                   backgroundColor: "#fafafa",
//                   marginTop: "-20px"
//               }}
//             >
//               <label style={{
//                   display: "block",
//                   color: "black",
//                   marginBottom: "8px"
//                   }}
//               >
//               CUIT del tercero
//               </label>

//               <input
//                 type="text"
//                 value={cuitTercero}
//                 onChange={(e) => setCuitTercero(e.target.value)}
//                 placeholder="Ingrese CUIT"
//                 style={{ width: "100%", color: "black" }}
//               />


//                 {razonSocial && (
//                       <div
//                         style={{
//                           backgroundColor: "#eee",
//                           padding: "10px",
//                           borderRadius: "6px",
//                           color: "black",
//                           fontSize: "14px",
//                         }}
//                       >
//                         <strong>Razón social:</strong> {razonSocial}
//                       </div>
//                     )}


//               <div style={{
//                   marginTop: "10px",
//                   display: "flex",
//                   gap: "8px"
//                   }}
//               >
//                 <Button type="button" onClick={handleCUITCancelar}>
//                   Cancelar
//                 </Button>
//                 <Button type="button" onClick={handleCUITAceptar}>
//                   Aceptar
//                 </Button>
//               </div>
//             </div>
//           )
//       }

//      </ListadoOcupantes>

//        {mostrarModalFactura && personaFactura && (
//          <div
//            style={{
//              position: "fixed",
//              color: "black",
//              inset: 0,
//              backgroundColor: "rgba(0,0,0,0.5)",
//              display: "flex",
//              alignItems: "center",
//              justifyContent: "center",
//              zIndex: 1000,
//            }}
//          >
//            <div
//              style={{
//                  position: "relative",
//                backgroundColor: "white",
//                padding: "24px",
//                borderRadius: "12px",
//                width: "100%",
//                maxWidth: "600px",
//                maxHeight: "90vh",
//                overflowY: "auto",
//              }}
//            >
//             <button
//               onClick={() => setMostrarModalFactura(false)}
//               style={{
//                 position: "absolute",
//                 top: "12px",
//                 right: "12px",
//                 border: "none",
//                 background: "transparent",
//                 fontSize: "20px",
//                 cursor: "pointer",
//                 color: "#555",
//               }}
//               aria-label="Cerrar"
//             >
//                ✕
//             </button>

//              <ListadoFactura
//                persona={personaFactura}
//                estadia={facturaMock.estadia}
//                consumos={consumosDisponiblesMock}
//                onAceptar={(hayItemsNoSeleccionados) => {
//                    if(hayItemsNoSeleccionados){
//                        setMostrarModalFactura(false);
//                        setResponsableSeleccionado(null);
//                        setRazonSocial(null);
//                        setCuitTercero("");
//                        return;}
//                  alert("Factura confirmada ✔");
//                  setMostrarModalFactura(false);
//                  router.push("/home");
//                }}
//              />

//            </div>
//          </div>
//        )}


//     </div>
//   );

// }

if (!mostrarGrilla) {
    return (
      <FormularioFacturarCheckout
        form={form}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div>
      <ListadoOcupantes
        ocupantes={ocupantes}
        seleccionado={responsableSeleccionado}
        onSelect={setResponsableSeleccionado}
        onCancel={handleCancel}
        onAccept={handleAcceptOcupante}
      />

      {mostrarInputCUIT && (
  <div style={{ marginTop: "20px" }}>
    <label>CUIT del tercero</label>
    <input
      type="text"
      value={cuitTercero}
      onChange={(e) => setCuitTercero(e.target.value)}
    />

    {razonSocial && (
      <div>
        <strong>Razón social:</strong> {razonSocial}
      </div>
    )}

    <div style={{ marginTop: "10px" }}>
      <Button type="button" onClick={handleCUITCancelar}>
        Cancelar
      </Button>
      <Button type="button" onClick={handleCUITAceptar}>
        Aceptar
      </Button>
    </div>
  </div>
)}


      {mostrarModalFactura && personaFactura && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "600px",
          }}>
            <ListadoFactura
              persona={personaFactura}
              estadia={USE_MOCK ? facturaMock.estadia : valorEstadia}
              consumos={USE_MOCK ? consumosDisponiblesMock : consumosReales}
              //onAceptar={() => {
              onAceptar={(hayItemsNoSeleccionados: boolean) => {


                if (hayItemsNoSeleccionados) {
                // 🔁 Flujo alternativo 9.A
                setMostrarModalFactura(false);
                setResponsableSeleccionado(null);
                return; // vuelve al punto 4
                }
                // ✅ Flujo principal
                // Acá debería ir el POST al backend para generar factura
                alert("Factura confirmada ✔");
                setMostrarModalFactura(false);
                router.push("/home");
              }}
<<<<<<< HEAD
            >
              <label style={{
                  display: "block",
                  color: "black",
                  marginBottom: "8px"
                  }}
              >
              CUIT del tercero
              </label>

              <input
                type="text"
                value={cuitTercero}
                onChange={(e) => setCuitTercero(e.target.value)}
                placeholder="Ingrese CUIT"
                style={{ width: "100%", color: "black" }}
              />


                {razonSocial && (
                      <div
                        style={{
                          backgroundColor: "#eee",
                          padding: "10px",
                          borderRadius: "6px",
                          color: "black",
                          fontSize: "14px",
                        }}
                      >
                        <strong>Razón social:</strong> {razonSocial}
                      </div>
                    )}


              <div style={{
                  marginTop: "10px",
                  display: "flex",
                  gap: "8px"
                  }}
              >
                <Button type="button" onClick={handleCUITCancelar}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleCUITAceptar}>
                  Aceptar
                </Button>
              </div>
            </div>
          )
      }

     </ListadoOcupantes>

       {mostrarModalFactura && personaFactura && (
         <div
           style={{
             position: "fixed",
             color: "black",
             inset: 0,
             backgroundColor: "rgba(0,0,0,0.5)",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             zIndex: 1000,
           }}
         >
           <div
             style={{
                 position: "relative",
               backgroundColor: "white",
               padding: "24px",
               borderRadius: "12px",
               width: "100%",
               maxWidth: "600px",
               maxHeight: "90vh",
               overflowY: "auto",
             }}
           >
            <button
              onClick={() => setMostrarModalFactura(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
                color: "#555",
              }}
              aria-label="Cerrar"
            >
               ✕
            </button>

             <ListadoFactura
               persona={personaFactura}
               estadia={facturaMock.estadia}
               consumos={consumosDisponiblesMock}
               cuitTercero={cuitTercero}
               onAceptar={(hayItemsNoSeleccionados) => {
                   if(hayItemsNoSeleccionados){
                       setMostrarModalFactura(false);
                       setResponsableSeleccionado(null);
                       setRazonSocial(null);
                       setCuitTercero("");
                       return;}
                 alert("Factura confirmada ✔");
                 setMostrarModalFactura(false);
                 router.push("/home");
               }}
             />

           </div>
         </div>
       )}


=======
            />
          </div>
        </div>
      )}
>>>>>>> develop-maria
    </div>
  );
}


