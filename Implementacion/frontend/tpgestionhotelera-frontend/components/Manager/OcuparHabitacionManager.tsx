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
  POPUP_DECISION = 6, // Renombrado para mayor claridad (antes POPUP_EXITO)
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
  
  // Estado de carga para el momento de guardar (dentro del popup)
  const [isSaving, setIsSaving] = useState(false);

  // Estados Toast
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
    
    // Lógica de fechas (igual que antes)
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
                
                // Toast solicitado: Aviso de carga automática
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

  // ... (handleSearchChange, handleSearchSubmit, handleRetrySearch, handleGuestSelectionComplete IGUALES QUE ANTES) ...
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

  // 1. Al dar "Confirmar" en el Resumen, NO guardamos todavía. Solo mostramos el Popup.
  const handleOpenDecisionPopup = () => {
    setCurrentStep(Step.POPUP_DECISION);
  };

  // 2. Función auxiliar para ejecutar el POST al Backend
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
        opcionOcuparIgual: true // Forzamos ocupación si hay reserva (validado visualmente antes)
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

      // Si todo sale bien, ejecutamos la acción de navegación
      onSuccess();

    } catch (error: any) {
      console.error(error);
      setErrorPopup(error.message || "Error al guardar.");
      // Si falla, nos quedamos en el popup o volvemos al resumen?
      // Mejor cerrar el popup para que vea el error
      setCurrentStep(Step.RESUMEN_CONFIRMACION); 
    } finally {
      setIsSaving(false);
    }
  };

  // --- BOTONES DEL POPUP FINAL ---

  // OPCIÓN 1: Salir (Guarda y va al Home)
  const handleOptionSalir = () => {
    executeSave(() => {
        triggerToast("Estadía registrada correctamente.", "success");
        setTimeout(() => {
            router.push("/");
        }, 2000);
    });
  };

  // OPCIÓN 2: Seguir Cargando (NO GUARDA, vuelve a buscar para añadir a la lista actual)
  const handleOptionSeguir = () => {
    // No llamamos a executeSave. Simplemente volvemos al paso de búsqueda.
    // Los datos en bookingData.guests se mantienen en memoria.
    setGuestSearchResults([]);
    setGuestSearchForm({ apellido: "", nombre: "", tipoDocumento: "", documento: "" });
    setCurrentStep(Step.BUSCAR_HUESPED);
  };

  // OPCIÓN 3: Cargar Otra Habitación (Guarda y reinicia para nueva carga)
  const handleOptionOtraHabitacion = () => {
    executeSave(() => {
        triggerToast("Estadía registrada. Lista para la siguiente.", "success");
        // Reiniciamos datos
        setBookingData((prev) => ({
            ...prev,
            roomIds: [],
            roomDisplayData: null,
            guests: [],
            // Mantenemos fechas
        }));
        setCurrentStep(Step.GRILLA);
    });
  };


  return (
    <>
      <Toast message={toastMsg} isVisible={showToast} type={toastType} />

      {currentStep === Step.FECHAS && (
        <FormularioFechas onNext={handleFechasSubmit} onCancel={() => router.push("/")} />
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
              // Limpiamos la lista temporal si volvemos atrás para evitar duplicados en re-selección
              setBookingData(prev => ({ ...prev, guests: [] }));
              setCurrentStep(Step.BUSCAR_HUESPED);
          }}
          // AHORA: Al confirmar, solo abrimos el popup de decisión
          onNext={handleOpenDecisionPopup} 
        />
      )}

      {/* --- POPUP FINAL (DECISIÓN) --- */}
      {currentStep === Step.POPUP_DECISION && (
        <PopupThreeOptions
          // Mensaje de pregunta, no de éxito todavía (salvo para la opción 2 que implica seguir)
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