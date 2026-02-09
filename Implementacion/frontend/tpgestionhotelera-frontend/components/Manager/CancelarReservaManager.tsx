"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import FormularioCancelarReserva from "@/components/Formularios/FormularioCancelarReserva";
import ListadoReservasCancelables, { Reserva, } from "@/components/Listados/ListadoReservasCancelables";
import CartelConfirmacion from "@/components/CartelConfirmacion";

const reservasMock: Reserva[] = [ //mock
  {
    id: 1,
    apellido: "Perez",
    nombres: "Juan",
    numeroHabitacion: "101",
    tipoHabitacion: "Simple",
    fechaInicio: "2024-06-10",
    fechaFin: "2024-06-15",
  },
  {
    id: 2,
    apellido: "Perez",
    nombres: "Juan",
    numeroHabitacion: "203",
    tipoHabitacion: "Doble",
    fechaInicio: "2024-07-01",
    fechaFin: "2024-07-05",
  },
];


export default function CancelarReservaManager() {
  const router = useRouter(); // <- importante
  //form
  const [form, setForm] = useState({
    apellido: "",
    nombres: "",
  });
  //errores
  const [errors, setErrors] = useState<{ apellido?: string }>({});
  //reservas
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [mostrarListado, setMostrarListado] = useState(false);
  //toast
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  //confirmacion final
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.apellido.trim()) { //3.1 apellido vacio
      setErrors({ apellido: "El campo apellido no puede estar vacío" });
      return;
    }

    setErrors({}); //limpio errores

    const apellidoBuscado = form.apellido.toLowerCase();

    const resultado = reservasMock.filter((reserva) =>
      reserva.apellido.toLowerCase().includes(apellidoBuscado)
    );

    if(resultado.length === 0){ //4.1 no existen reservas
        setToastMsg("No existen reservas para los criterios de busqueda");
        //setToastType("warning");
        setShowToast(true);
        return;
    }

    setReservas(resultado); //si hay reservas
    setMostrarListado(true);

    console.log("Buscar reservas con:", form);
  };

  const handleCancel = () => {
    // resetea los campos
    setForm({ apellido: "", nombres: "" });
    setErrors({});
    // navega al Home
    router.push("/home");
  };

  const handleCancelListado = () => {
      router.push("/home");
  };

    const handleAccept = () => {
      setMostrarListado(false);
      setMostrarConfirmacion(true);
    };
    const handleContinuar = () => {
        router.push("/home");
    };

    // RENDER
    if(mostrarConfirmacion){ //cartel final
        return <CartelConfirmacion onContinue={handleContinuar} />;
    }
    if (mostrarListado) { //listado reservas
      return (
        <ListadoReservasCancelables
          reservas={reservas}
          onAccept={handleAccept}
          onCancel={handleCancelListado}
        />
      );
    }

    return (
      <>
        <Toast
          message={toastMsg}
          isVisible={showToast}
          type="warning"
        />

        <FormularioCancelarReserva
          form={form}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </>
    );
}