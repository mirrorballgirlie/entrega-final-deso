"use client";
import { useState } from "react";
import FormularioFechas from "@/components/Formularios/FormularioFechas";
import RoomGrid from "@/components/RoomGrid";
import ListadoReserva from "@/components/Listados/ListadoReserva";
import FormularioEncargado from "@/components/Formularios/FormularioEncargado";
import PopupThreeOptions from "@/components/PopupThreeOptions";

interface Props {
  onExit: () => void;
}

export default function ReservarManager({ onExit }: Props) {
  const [step, setStep] = useState(1);
  const [flowData, setFlowData] = useState({
    startDate: "",
    endDate: "",
    rooms: [] as string[],
    selectedData: {} as any
  });
  
  const [success, setSuccess] = useState(false);

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);
  const update = (data: any) => setFlowData(prev => ({ ...prev, ...data }));


  const handleGridNext = (data: { rooms: string[]; selectedData: { [key: string]: string[] } }) => {
    // 1. Extraemos TODAS las fechas que el usuario seleccionó (clickeó)
    const allSelectedDates = Object.values(data.selectedData).flat().sort();

    // Seguridad: si no hay fechas, no hacemos nada
    if (allSelectedDates.length === 0) return;

    // 2. La fecha más chica es el INICIO real, la más grande es el FIN real
    // Como son strings ISO ("YYYY-MM-DD"), el sort() funciona perfecto.
    const realStartDate = allSelectedDates[0];
    const realEndDate = allSelectedDates[allSelectedDates.length - 1];

    // 3. Actualizamos el estado sobrescribiendo las fechas de búsqueda
    update({
        rooms: data.rooms,
        selectedData: data.selectedData,
        startDate: realStartDate, 
        endDate: realEndDate      
    });

    // 4. Avanzamos
    next();
  };

  if (success) {
    return (
        <div style={{padding: '40px', textAlign: 'center', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <h2 style={{color: '#28a745', marginBottom: '20px'}}>¡Reserva Exitosa!</h2>
            <p>La reserva se ha registrado correctamente en el sistema.</p>
            <button 
                onClick={onExit}
                style={{padding: '10px 20px', marginTop: '20px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px'}}
            >
                Volver al Menú Principal
            </button>
        </div>
    );
  }

  return (
    <>
      {/* PASO 1: Elegir Fechas (Buscador) */}
      {step === 1 && (
        <FormularioFechas 
            onNext={(fechas) => { update(fechas); next(); }} 
            onCancel={onExit} 
        />
      )}

      {/* PASO 2: Elegir Habitaciones (Grilla) */}
      {step === 2 && (
        <RoomGrid 
            mode="reservar"
            startDate={flowData.startDate} // Le pasamos el rango AMPLIO para mostrar la grilla
            endDate={flowData.endDate}
            onBack={back}
            onNext={handleGridNext}
        />
      )}

      {/* PASO 3: Confirmar Selección (Listado) */}
      {step === 3 && (
        <ListadoReserva 
            data={flowData} // Ahora flowData tendrá las fechas REALES (cortas)
            onBack={back}
            onNext={() => next()} 
        />
      )}

      {/* PASO 4: Datos del Responsable + POST
      {step === 4 && (
        <FormularioEncargado 
            data={flowData} 
            onBack={back}
            onSuccess={() => setSuccess(true)} 
        />
      )} */}

      {/* PASO 4: Datos del Responsable + POST */}
      {step === 4 && (
        <FormularioEncargado 
            data={flowData} 
            onBack={back}
            onSuccess={onExit} 
        />
      )}
    </>
  );
}