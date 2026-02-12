"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioFechas from "@/components/Formularios/FormularioFechas";
import RoomGrid from "@/components/RoomGrid";
import ListadoReserva from "@/components/Listados/ListadoReserva";
import FormularioEncargado from "@/components/Formularios/FormularioEncargado";



export default function ReservarManager() {
    const router = useRouter();
    const handleExit = () => {router.push("/home");};

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
    const allSelectedDates = Object.values(data.selectedData).flat().sort();

    if (allSelectedDates.length === 0) return;

    const realStartDate = allSelectedDates[0];
    const realEndDate = allSelectedDates[allSelectedDates.length - 1];

    update({
        rooms: data.rooms,
        selectedData: data.selectedData,
        startDate: realStartDate, 
        endDate: realEndDate      
    });

    next();
  };

  if (success) {
    return (
        <div style={{padding: '40px', textAlign: 'center', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <h2 style={{color: '#28a745', marginBottom: '20px'}}>¡Reserva Exitosa!</h2>
            <p>La reserva se ha registrado correctamente en el sistema.</p>
            <button 
                onClick={handleExit}
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
            onCancel={handleExit}
        />
      )}

      {/* PASO 2: Elegir Habitaciones (Grilla) */}
      {step === 2 && (
        <RoomGrid 
            mode="reservar"
            startDate={flowData.startDate} 
            endDate={flowData.endDate}
            onBack={handleExit}
            onNext={handleGridNext}
        />
      )}

      {/* PASO 3: Confirmar Selección (Listado) */}
      {step === 3 && (
        <ListadoReserva 
            data={flowData} 
            onBack={back}    // Volver al paso 2 (Grid)
            onCancel={handleExit} // Cancelar todo (Menú Principal)
            onNext={() => next()} 
        />
      )}

      {/* PASO 4: Datos del Responsable + POST */}
      {step === 4 && (
        <FormularioEncargado 
            data={flowData} 
            onBack={back}
            onSuccess={handleExit}
        />
      )}
    </>
  );
}