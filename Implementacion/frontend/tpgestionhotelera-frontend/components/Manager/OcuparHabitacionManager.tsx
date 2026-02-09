"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import FormularioFechas from "@/components/Formularios/FormularioFechas"; 
import RoomGrid from "@/components/RoomGrid";
import FormularioHuesped from "@/components/Formularios/FormularioHuesped";
import ListadoHuesped from "@/components/Listados/ListadoHuesped"; 
import ListadoReserva from "@/components/Listados/ListadoReserva";
import PopupThreeOptions from "@/components/PopupThreeOptions";
import PopupCritical from "@/components/PopupCritical"; 
import Toast from "@/components/Toast"; 

enum Step {
  FECHAS = 1,
  GRILLA = 2,
  BUSCAR_HUESPED = 3,
  LISTADO_RESULTADOS = 4,
  RESUMEN_CONFIRMACION = 5,
  POPUP_DECISION = 6, 
}

interface Guest {
  id?: number;
  apellido: string;
  nombre: string;
  tipoDocumento: string;
  documento: string;
  telefono?: string;
}

interface BookingState {
  startDate: string;
  endDate: string;
  roomIds: string[];
  roomDisplayData: { [key: string]: string[] } | null;
  guests: Guest[]; 
}

export default function OcuparHabitacionManager() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<Step>(Step.FECHAS);
  
  const [bookingData, setBookingData] = useState<BookingState>({
    startDate: "",
    endDate: "",
    roomIds: [],
    roomDisplayData: null,
    guests: [],
  });

  const [guestSearchForm, setGuestSearchForm] = useState({
    apellido: "",
    nombre: "",
    tipoDocumento: "",
    documento: "",
  });

  const [guestSearchResults, setGuestSearchResults] = useState<Guest[]>([]);
  const [errorPopup, setErrorPopup] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- LOGICA ---

  const handleFechasSubmit = (fechas: { startDate: string; endDate: string }) => {
    setBookingData((prev) => ({ ...prev, ...fechas }));
    setCurrentStep(Step.GRILLA);
  };

  const handleRoomSubmit = async (data: { 
      rooms: string[]; 
      selectedData: { [key: string]: string[] };
      reservationContext?: { reservadoPor?: string; clienteId?: number; } 
  }) => {
    
    let realStartDate = bookingData.startDate;
    let realEndDate = bookingData.endDate;
    const roomNumbers = Object.keys(data.selectedData);
    if (roomNumbers.length > 0) {
        const firstRoom = roomNumbers[0];
        const fechas = data.selectedData[firstRoom];
        if (fechas && fechas.length > 0) {
            const fechasOrdenadas = fechas.sort();
            realStartDate = fechasOrdenadas[0];
            realEndDate = fechasOrdenadas[fechasOrdenadas.length - 1];
        }
    }

    const updatedBookingData = {
      ...bookingData,
      roomIds: data.rooms,
      roomDisplayData: data.selectedData,
      startDate: realStartDate, 
      endDate: realEndDate
    };

    setBookingData(updatedBookingData);

    const ctx = data.reservationContext;
    const base = process.env.NEXT_PUBLIC_API_BASE || "";

    // Lógica Check-in Inteligente
    if (ctx?.clienteId) {
        try {
            const res = await fetch(`${base}/api/huespedes/${ctx.clienteId}`);
            if (res.ok) {
                const huespedCompleto = await res.json();
                setBookingData({
                    ...updatedBookingData,
                    guests: [huespedCompleto]
                });
                
                triggerToast(`Se agregó a ${huespedCompleto.nombre} ${huespedCompleto.apellido} (Responsable) a la lista.`);
                
                setCurrentStep(Step.RESUMEN_CONFIRMACION);
                return;
            }
        } catch (error) { console.error(error); }
    }

    if (ctx?.reservadoPor && !ctx.clienteId) {
        const partes = ctx.reservadoPor.trim().split(" ");
        let nombrePred = partes[0]; 
        let apellidoPred = partes.slice(1).join(" "); 
        setGuestSearchForm({ apellido: apellidoPred, nombre: nombrePred, tipoDocumento: "", documento: "" });

        try {
            const params = new URLSearchParams();
            if (apellidoPred) params.append("apellido", apellidoPred);
            const res = await fetch(`${base}/api/huespedes/buscar?${params.toString()}`);
            if (res.ok) {
                const searchData = await res.json();
                setGuestSearchResults(searchData.existe ? searchData.resultados : []);
                setCurrentStep(Step.LISTADO_RESULTADOS);
                return;
            }
        } catch (error) { console.error(error); }
    }
    
    setCurrentStep(Step.BUSCAR_HUESPED);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGuestSearchForm({ ...guestSearchForm, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const q = new URLSearchParams();
      if(guestSearchForm.apellido) q.append("apellido", guestSearchForm.apellido);
      if(guestSearchForm.nombre) q.append("nombre", guestSearchForm.nombre);
      if(guestSearchForm.tipoDocumento) q.append("tipoDocumento", guestSearchForm.tipoDocumento);
      if(guestSearchForm.documento) q.append("documento", guestSearchForm.documento);

      const res = await fetch(`${base}/api/huespedes/buscar?${q.toString()}`);
      if (!res.ok) throw new Error("Error búsqueda");
      const data = await res.json();
      setGuestSearchResults(data.existe ? data.resultados : []);
      setCurrentStep(Step.LISTADO_RESULTADOS);
    } catch (e) { setErrorPopup("Error de conexión"); }
  };

  const handleGuestSelectionComplete = (selectedGuests: Guest[]) => {
    setBookingData((prev) => ({ ...prev, guests: [...prev.guests, ...selectedGuests] }));
    setCurrentStep(Step.RESUMEN_CONFIRMACION);
  };

  const handleRetrySearch = () => {
    setGuestSearchResults([]);
    setCurrentStep(Step.BUSCAR_HUESPED);
  };

  // --- NUEVA LÓGICA DE FINALIZACIÓN ---

  const handleOpenDecisionPopup = () => {
    setCurrentStep(Step.POPUP_DECISION);
  };

  const executeSave = async (onSuccess: () => void) => {
    setIsSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE || "";
      
      const listaHuespedesIds = bookingData.guests.map(g => g.id).filter(id => id !== undefined);
      const listaHabitaciones = bookingData.roomIds.map(roomId => ({
          habitacionId: Number(roomId),
          fechaDesde: bookingData.startDate,
          fechaHasta: bookingData.endDate
      }));

      const payload = {
        huespedIds: listaHuespedesIds,
        habitaciones: listaHabitaciones,
        opcionOcuparIgual: true 
      };

      const res = await fetch(`${baseUrl}/api/estadias/ocupar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const msg = errorData?.message || errorData?.error || "Error del servidor";
        throw new Error(msg);
      }

      onSuccess();

    } catch (error: any) {
      console.error(error);
      setErrorPopup(error.message || "Error al guardar.");
      setCurrentStep(Step.RESUMEN_CONFIRMACION); 
    } finally {
      setIsSaving(false);
    }
  };

  // --- BOTONES DEL POPUP FINAL ---

  const handleOptionSalir = () => {
    executeSave(() => {
        triggerToast("Estadía registrada correctamente.", "success");
        setTimeout(() => {
            router.push("/home");
        }, 2000);
    });
  };

  const handleOptionSeguir = () => {
    setGuestSearchResults([]);
    setGuestSearchForm({ apellido: "", nombre: "", tipoDocumento: "", documento: "" });
    setCurrentStep(Step.BUSCAR_HUESPED);
  };

  const handleOptionOtraHabitacion = () => {
    executeSave(() => {
        triggerToast("Estadía registrada. Lista para la siguiente.", "success");
        setBookingData((prev) => ({
            ...prev,
            roomIds: [],
            roomDisplayData: null,
            guests: [],
        }));
        setCurrentStep(Step.GRILLA);
    });
  };


  return (
    <>
      <Toast message={toastMsg} isVisible={showToast} type={toastType} />

      {currentStep === Step.FECHAS && (
        <FormularioFechas onNext={handleFechasSubmit} onCancel={() => router.push("/home")} />
      )}

      {currentStep === Step.GRILLA && (
        <RoomGrid
          mode="ocupar"
          startDate={bookingData.startDate}
          endDate={bookingData.endDate}
          onBack={() => setCurrentStep(Step.FECHAS)}
          onNext={handleRoomSubmit}
        />
      )}

      {currentStep === Step.BUSCAR_HUESPED && (
        <FormularioHuesped
          form={guestSearchForm}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          onCancel={() => {
              if (bookingData.guests.length > 0) setCurrentStep(Step.RESUMEN_CONFIRMACION);
              else setCurrentStep(Step.GRILLA);
          }}
        />
      )}

      {currentStep === Step.LISTADO_RESULTADOS && (
        <ListadoHuesped
          mode="ocupar"
          results={guestSearchResults}
          onRetry={handleRetrySearch}
          onSelectionComplete={handleGuestSelectionComplete} 
        />
      )}

      {currentStep === Step.RESUMEN_CONFIRMACION && (
        <ListadoReserva
          data={{
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            rooms: bookingData.roomIds,
            selectedData: bookingData.roomDisplayData || undefined,
          }}
          onBack={() => {
              setBookingData(prev => ({ ...prev, guests: [] }));
              setCurrentStep(Step.BUSCAR_HUESPED);
          }}
          
          onCancel={() => router.push("/home")}
          onNext={handleOpenDecisionPopup} 
        />
      )}

      {currentStep === Step.POPUP_DECISION && (
        <PopupThreeOptions
          message={isSaving ? "Guardando estadía..." : "¿Qué desea hacer a continuación?"}
          option1Text="Salir"
          onOption1={handleOptionSalir}
          option2Text="Seguir Cargando"
          onOption2={handleOptionSeguir}
          option3Text="Cargar Otra Habitación"
          onOption3={handleOptionOtraHabitacion}
        />
      )}

      {errorPopup && (
        <PopupCritical
          message={errorPopup}
          primaryText="Cerrar"
          secondaryText=""
          onPrimary={() => setErrorPopup(null)}
          onSecondary={() => {}}
        />
      )}
    </>
  );
}