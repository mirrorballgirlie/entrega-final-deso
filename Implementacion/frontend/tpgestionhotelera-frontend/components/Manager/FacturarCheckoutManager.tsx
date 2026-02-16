"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioFacturarCheckout from "@/components/Formularios/FormularioFacturarCheckout";
import ListadoOcupantes, { Ocupante, SeleccionResponsable } from "@/components/Listados/ListadoOcupantes";
import Button from "@/components/Button";
//import ListadoFactura, { hayItemsNoSeleccionados } from "@/components/Listados/ListadoFactura";
import ListadoFactura from "@/components/Listados/ListadoFactura";

const USE_MOCK = false; // CAMBIAR A false PARA USAR BACKEND REAL

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
  //const [ocupanteSeleccionado, setOcupanteSeleccionado] = useState(null);
  const [ocupanteSeleccionado, setOcupanteSeleccionado] = useState<Ocupante | null>(null);
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
        return;
      }
      if (habitacionesOcupadas.includes(numero)) {
        alert("La habitación está ocupada");                //simula saber el estado de la habitacion
        return;
      }

      setOcupantes(ocupantesMock);         //cargar ocupantes fake y mostrar el listado
      setMostrarGrilla(true);
      return;
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
        // `http://localhost:8080/api/facturas/buscar-ocupantes?habitacion=${numero}&salida=${new Date().toISOString().split("T")[0]}`
        `http://localhost:8080/api/facturas/buscar-ocupantes?habitacion=${numero}`
      );

      if (!resOcupantes.ok) {
        alert("Error al obtener ocupantes");
        return;
      }

      const dataOcupantes = await resOcupantes.json();
      // Transformar HuespedDTO al formato Ocupante esperado
      const ocupantesTransformados = dataOcupantes.map((h: any) => ({
        id: h.id,
        nombre: h.nombre + " " + h.apellido,
        dni: h.documento,
        edad: h.fechaNacimiento ? new Date().getFullYear() - new Date(h.fechaNacimiento).getFullYear() : 0
      }));
      setOcupantes(ocupantesTransformados);
      setMostrarGrilla(true);

    } catch {
      alert("Error de conexión");
    }
  };







  const handleAcceptOcupante = async () => {
  if (!responsableSeleccionado) return;

  // 🟣 CASO 5.B — TERCERO
  if (responsableSeleccionado === "TERCERO") {
    setMostrarInputCUIT(true);
    setErrorSeleccion("");
    return;
  }

  // 🔵 CASO 5.A — OCUPANTE

  if (!USE_MOCK) {
    try {
      // si es mayor de edad
      const resMayor = await fetch(`http://localhost:8080/api/facturas/verificar-mayor/${responsableSeleccionado.id}`);
      const esMayor = await resMayor.json();

      if (!esMayor) {
        setErrorSeleccion("La persona seleccionada es menor de edad. Por favor elija otra.");
        setResponsableSeleccionado(null);
        return;
      }

      // Huésped a Responsable de Pago en la DB
      const resAsegurar = await fetch(`http://localhost:8080/api/responsablesdepago/asegurar-huesped/${responsableSeleccionado.id}`, {
        method: 'POST'
      });

      if (!resAsegurar.ok) throw new Error("Error al asegurar responsable");
      const responsableFinal = await resAsegurar.json();

      // cargamos datos de la estadía
      if (estadiaId) {
        await cargarDatosFacturaReal();
      }

      // seteamos la persona para la factura usando el ID del nuevo ResponsableDePago
      setPersonaFactura({
        id: responsableFinal.id, // ID de la tabla responsable_de_pago
        nombre: responsableSeleccionado.nombre,
        condicionIVA: "CF",
      });

      setMostrarModalFactura(true);

    } catch (error) {
      console.error(error);
      alert("Error al procesar el ocupante");
    }
  }
}

const handleCUITAceptar = async () => {
  // Caso A: Todavía no buscamos la Razón Social (Primer clic)
  if (!razonSocial) {
    if (!cuitTercero.trim()) {
      alert("Por favor, ingrese un CUIT.");
      return;
    }

    try {
      // Llamamos al nuevo endpoint que creaste
      const res = await fetch(
        `http://localhost:8080/api/responsablesdepago/por-cuit/${cuitTercero.trim()}`
      );

      if (res.status === 404) {
        alert("El CUIT no existe. Debe registrarlo como nuevo responsable.");
        return;
      }

      if (!res.ok) {
        alert("Error en el servidor. Revisá la consola de Java.");
        return;
      }

      const responsable = await res.json();
            console.log("Objeto responsable recibido:", responsable);
        //setRazonSocial(responsable.nombreAMostrar);

      // Mapeamos el nombre buscando en las posibles estructuras (Juridica/Fisica/Atributo directo)
      const nombreEncontrado =
        responsable.nombreAMostrar ||
        responsable.nombreRazonSocial ||
        responsable.razonSocial ||
        (responsable.huesped ? `${responsable.huesped.nombre} ${responsable.huesped.apellido}` : null) ||
        responsable.nombre ||
        "Responsable sin Nombre";

      setRazonSocial(nombreEncontrado);

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }
    return; // Sale aquí para que el usuario vea el nombre y el botón cambie
  }

  // Caso B: Ya tenemos la Razón Social y el usuario confirmó (Segundo clic)
  setPersonaFactura({
    razonSocial: razonSocial,
    condicionIVA: "RI", // Responsable Inscripto por defecto para terceros con CUIT
  });

  // Si no es MOCK, cargamos los datos reales de la estadía para el modal
  if (!USE_MOCK && estadiaId) {
    cargarDatosFacturaReal();
  }

  setMostrarModalFactura(true);
  setMostrarInputCUIT(false);
};

const cargarDatosFacturaReal = async () => {
  try {
    // 1. Traer valor de estadía
    const resValor = await fetch(`http://localhost:8080/api/facturas/${estadiaId}/valor-estadia`);
    const valor = await resValor.json();
    setValorEstadia(valor);

    // 2. Traer consumos pendientes
    const resConsumos = await fetch(`http://localhost:8080/api/facturas/${estadiaId}/items-pendientes`);
    const consumos = await resConsumos.json();
    setConsumosReales(consumos);
  } catch (error) {
    console.error("Error cargando detalles de factura:", error);
  }
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

    <div className="container mx-auto p-4 max-w-6xl">
        {errorSeleccion && (
                 <div style={{ color: "red",
                     marginTop: "30px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     fontWeight: "bold" }}>
                   {errorSeleccion}
                 </div>
        )}

      <ListadoOcupantes
            ocupantes={ocupantes}
            seleccionado={responsableSeleccionado}
            onSelect={(val) => {
              setResponsableSeleccionado(val);
              // Si cambia de selección mientras ve el CUIT, reseteamos
              if (val !== "TERCERO") {
                setMostrarInputCUIT(false);
                setRazonSocial(null);
              }
            }}
            onCancel={handleCancel}
            onAccept={handleAcceptOcupante}
            // 🟢 Prop clave: Si estamos en modo CUIT, el componente Listado NO debe renderizar sus botones
            mostrarBotones={!mostrarInputCUIT}
          />

{mostrarInputCUIT && (
    <div style={{
      marginTop: "5px",
          padding: "15px",
          border: "2px solid",
          borderRadius: "4px",
          backgroundColor: "#fff",
          maxWidth: "750px",
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.1)",
      }}>
      <label style={{ display: "block", marginBottom: "5px", color: "#333", fontWeight: "bold" }}>
        CUIT del tercero
      </label>
      <div style={{ display: "flex", gap: "10px", border: "2px solid", }}>
        <input
          type="text"
          value={cuitTercero}
          onChange={(e) => setCuitTercero(e.target.value)}
          placeholder="Ingrese CUIT"
          style={{ flex: 1, padding: "8px", border: "2px solid", borderRadius: "4px", color: "black" }}
        />
        <Button type="button" onClick={handleCUITAceptar}>
          {razonSocial ? "Confirmar" : "Buscar"}
        </Button>
        <Button type="button" onClick={handleCUITCancelar}>
          Cancelar
        </Button>
      </div>

      {razonSocial && (
        <div style={{ marginTop: "10px", color: "green", fontWeight: "bold" }}>
          Razón social: {razonSocial}
        </div>
      )}
    </div>
      )  }


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
                  // Usamos el mock o lo real según la bandera
                  estadia={USE_MOCK ? facturaMock.estadia : valorEstadia}
                  consumos={USE_MOCK ? consumosDisponiblesMock : consumosReales}
                  onAceptar={async (hayItemsNoSeleccionados, estadiaSeleccionada, seleccionados) => {

                if (hayItemsNoSeleccionados) {
                  setMostrarModalFactura(false);
                  setResponsableSeleccionado(null);
                  return;
                }

                // --- PUNTO 6: GENERAR FACTURA REAL ---
                try {
                  const bodyFactura = {
                    estadiaId: estadiaId,
                    huespedId: (responsableSeleccionado && responsableSeleccionado !== "TERCERO") ? responsableSeleccionado.id : null,
                    cuitResponsable: personaFactura.razonSocial ? cuitTercero : null,
                    incluirEstadia: estadiaSeleccionada,
                    idsConsumosSeleccionados: consumosReales
                      .filter(c => seleccionados[c.id])
                      .map(c => c.id)
                  };

                  const res = await fetch(`http://localhost:8080/api/facturas/generar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bodyFactura)
                  });

                  if (res.ok) {
                    alert("Factura generada e impresa correctamente ✔");
                    fetch (`http://localhost:8080/api/estadias/checkout/${estadiaId}`, { method: "POST" }); // Marcar estadía como finalizada
                    fetch (`http://localhost:8080/api/habitaciones/liberar/${form.numeroHabitacion}`, { method: "POST" }); // Liberar habitación
                    
                    router.push("/home");
                  } else {
                    alert("Error al procesar la factura en el servidor.");
                  }
                } catch (error) {
                  alert("Error crítico al generar factura.");
                }

              }}
               />
          </div>
        </div>
      )}
    </div>
);
}
