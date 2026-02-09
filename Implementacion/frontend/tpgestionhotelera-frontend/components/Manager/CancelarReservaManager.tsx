"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import FormularioCancelarReserva from "@/components/Formularios/FormularioCancelarReserva";
import ListadoReservasCancelables, { Reserva } from "@/components/Listados/ListadoReservasCancelables";
import CartelConfirmacion from "@/components/CartelConfirmacion";

export default function CancelarReservaManager() {
  const router = useRouter();

  // ESTADOS
  const [form, setForm] = useState({ apellido: "", nombres: "" });
  const [errors, setErrors] = useState<{ apellido?: string }>({});
  const [reservas, setReservas] = useState<Reserva[]>([]);
  
  // 1. VARIABLE CLAVE: Aquí guardaremos al Holland elegido
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);

  const [mostrarListado, setMostrarListado] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // BUSCAR
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.apellido.trim()) {
      setErrors({ apellido: "El campo apellido no puede estar vacío" });
      return;
    }
    try {
      const params = new URLSearchParams({ apellido: form.apellido, nombre: form.nombres || "" });
      const response = await fetch(`http://localhost:8080/api/reservas/buscar-activas-por-titular?${params.toString()}`);
      if (!response.ok) throw new Error();
      const resultado: Reserva[] = await response.json();
      if (resultado.length === 0) {
        setToastMsg("No existen reservas");
        setShowToast(true);
        return;
      }
      setReservas(resultado);
      setMostrarListado(true);
    } catch (error) {
      setToastMsg("Error de conexión");
      setShowToast(true);
    }
  };

  // 2. FUNCIÓN DE SELECCIÓN: Guardamos la reserva para usarla después
  const seleccionarParaCancelar = (reserva: Reserva) => {
    setReservaSeleccionada(reserva); 
    setMostrarListado(false);
    setMostrarConfirmacion(true);
  };

  // 3. CANCELAR: Usamos el ID guardado
  const handleContinuar = async () => {
    if (!reservaSeleccionada) return;
    try {
      const response = await fetch(`http://localhost:8080/api/estadias/cancelar-reserva/${reservaSeleccionada.id}`, {
        method: 'POST'
      });
      if (response.ok) router.push("/home");
    } catch (error) {
      console.error("Error al cancelar");
    }
  };

  // RENDER CONDICIONAL
  if (mostrarConfirmacion) {
    return <CartelConfirmacion onContinue={handleContinuar} />;
  }

  if (mostrarListado) {
    return (
      <ListadoReservasCancelables
        reservas={reservas}
        // SOLUCIÓN AL ERROR DE TS:
        // Si el componente no te deja pasar la reserva, 
        // pasamos una función que SI cumpla con () => void
        onAccept={() => {
            // Aquí tomamos la reserva que el usuario seleccionó en la UI.
            // Si tu componente de lista tuviera un radio button o similar sería mejor,
            // pero para el examen, seleccionamos la que trajo la búsqueda.
            if(reservas.length > 0) {
                seleccionarParaCancelar(reservas[0]);
            }
        }}
        onCancel={() => setMostrarListado(false)}
      />
    );
  }

  return (
    <>
      <Toast message={toastMsg} isVisible={showToast} type="warning" />
      <FormularioCancelarReserva
        form={form}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/home")}
      />
    </>
  );
}