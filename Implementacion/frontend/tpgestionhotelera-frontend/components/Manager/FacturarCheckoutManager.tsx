"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioFacturarCheckout from "@/components/Formularios/FormularioFacturarCheckout";
import ListadoOcupantes, { Ocupante, SeleccionResponsable } from "@/components/Listados/ListadoOcupantes";
import Button from "@/components/Button";
import ListadoFactura, { hayItemsNoSeleccionados } from "@/components/Listados/ListadoFactura";

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
  const [ocupanteSeleccionado, setOcupanteSeleccionado] = useState(null);
  const [personaFactura, setPersonaFactura] = useState<any>(null);
  const [mostrarModalFactura, setMostrarModalFactura] = useState(false);


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


const onAceptar = () => {
  if (!ocupanteSeleccionado) return;

  if (ocupanteSeleccionado.requiereCuit) {
    setFlujo('cuit');
  } else if (ocupanteSeleccionado.mayorEdad) {
    setFlujo('factura');
  }
};


//formularios
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nuevosErrores: {
      numeroHabitacion?: string;
      horaSalida?: string;
    } = {};

    // validar habitación
    if (!form.numeroHabitacion.trim()) {
      nuevosErrores.numeroHabitacion = "Número de habitación faltante";
    } else {
      const numero = Number(form.numeroHabitacion);

      if (isNaN(numero) || numero <= 0) {
        nuevosErrores.numeroHabitacion = "Número de habitación incorrecto";
      } else if (!habitacionesExistentes.includes(numero)) {
        nuevosErrores.numeroHabitacion = "La habitación no existe";
      } else if (habitacionesOcupadas.includes(numero)) {
        nuevosErrores.numeroHabitacion = "La habitación está ocupada";
      }
    }

    // validar hora
    if (!form.horaSalida.trim()) {
      nuevosErrores.horaSalida = "Hora de salida faltante";
    } else if (esHoraFutura(form.horaSalida)) {
      nuevosErrores.horaSalida = "La hora no puede ser futura";
    }

    // si hay errores
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    // si no
    setErrors({});
    //console.log("Checkout facturado", form);
    setOcupantes(ocupantesMock);
    setMostrarGrilla(true);

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
    if (responsableSeleccionado ){ // //=! tercero
        if(responsableSeleccionado.edad < 18){
        setErrorSeleccion("La persona seleccionada es menor de edad. Por favor elija otra.");
        setResponsableSeleccionado(null);
        return;
        }

        setPersonaFactura({
            nombre: responsableSeleccionado.nombre,
            condicionIVA: "CF",
        });

        setErrorSeleccion("");
        setMostrarInputCUIT(false);
        setMostrarModalFactura(true);
    }

  };

  //cuit tercero
  const handleCUITAceptar = () => {
      if(!razonSocial) {
        if (!cuitTercero.trim()){
          alert("Ingrese un CUIT valido");
          return;
        }
        const razon = tercerosMock[cuitTercero] ?? "Razon social no encontrada";
        setRazonSocial(razon);
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
      if(razonSocial){
          setRazonSocial(null); //vuelve a ingreso cuit
      } else {
    setCuitTercero("");
    setMostrarInputCUIT(false);
    setResponsableSeleccionado(null);
    }
  };

//ui

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
        mostrarBotones={!mostrarInputCUIT && !mostrarFormularioResponsable}
      >

      {errorSeleccion && (
        <div style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
          {errorSeleccion}
        </div>
      )}

      {mostrarInputCUIT && (
            <div
              style={{
                  display: "flex",
                  margin: "0 auto",
                  flexDirection: "column",
                  gap: "12px",
                  alignSelf: "center",
                  width: "100%",
                  maxWidth: "420px",
                  padding: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                  marginTop: "-20px"
              }}
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


    </div>
  );

}
