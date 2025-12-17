
// "use client"

// import { useState, useEffect } from "react"
// import styles from "./room-grid.module.css"
// import Button from "@/components/Button"
// import PopupCritical from "@/components/PopupCritical"
// import Toast from "@/components/Toast" // Asegúrate de tener el Toast que creamos antes

// // --- TIPOS ---

// interface RoomStatus {
//   roomNumber: string
//   date: string
//   status: "available" | "reserved" | "occupied" | "maintenance"
//   reservedBy?: string // Nuevo campo para el nombre del huésped (para el conflicto)
// }

// interface GridData {
//   dates: string[]
//   rooms: string[]
//   statuses: RoomStatus[]
//   idMap: { [key: string]: number }
// }

// // Interfaces del Backend (Mantenidas)
// interface BackendHabitacionEstadoDTO {
//   id: number
//   numero: number
//   tipo: string
//   estadoActual: string
//   estadosPorDia: { fecha: string; estado: string }[]
// }

// interface BackendResponse {
//   dias: string[]
//   habitaciones: BackendHabitacionEstadoDTO[]
// }

// interface RoomGridProps {
//   mode: "reservar" | "ocupar";
//   startDate: string;
//   endDate: string;
//   onBack: () => void;
//   onNext: (data: { rooms: string[]; selectedData: { [key: string]: string[] } }) => void;
// }

// const roomTypeMap: { [key: string]: string[] } = {
//   "individual-estandar": ["INDIVIDUAL_ESTANDAR"],
//   "doble": ["DOBLE_ESTANDAR", "DOBLE_SUPERIOR"],
//   "superior-family": ["SUPERIOR_FAMILY_PLAN"],
//   "suite": ["SUITE_DOBLE"]
// }

// export default function RoomGrid({ mode, startDate, endDate, onBack, onNext }: RoomGridProps) {
  
//   // --- ESTADOS DE DATOS ---
//   const [gridData, setGridData] = useState<GridData | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [roomType, setRoomType] = useState("individual-estandar")

//   // --- ESTADOS DE UI (Scroll) ---
//   const [dateScrollIndex, setDateScrollIndex] = useState(0)
//   const [roomScrollIndex, setRoomScrollIndex] = useState(0)

//   // --- ESTADOS DE SELECCIÓN (RANGO) ---
//   // Guardamos el primer click para definir el inicio del rango
//   const [firstClick, setFirstClick] = useState<{ date: string, room: string, dateIndex: number } | null>(null)
//   // Guardamos la selección final confirmada
//   const [selection, setSelection] = useState<{ 
//     room: string, 
//     startDate: string, 
//     endDate: string,
//     dateRange: string[] // Lista de todas las fechas ISO
//   } | null>(null)

//   // --- POPUPS Y TOASTS ---
//   const [toastMsg, setToastMsg] = useState("")
//   const [showToast, setShowToast] = useState(false)
//   const [toastType, setToastType] = useState<"success" | "error" | "warning">("success");
//   const [conflictPopup, setConflictPopup] = useState<{ show: boolean, guestName: string, dates: string } | null>(null)

//   // --- HELPERS ---
//   const formatDate = (iso: string): string => {
//     if (!iso) return "";
//     const datePart = iso.split("T")[0]; 
//     const [year, month, day] = datePart.split("-");
//     return `${day}/${month}/${year.slice(-2)}`;
//   }

//   const convertToISO = (displayDate: string) => {
//     const [day, month, year] = displayDate.split("/")
//     return `20${year}-${month}-${day}`
//   }

//   const mapStatus = (backendStatus: string): RoomStatus["status"] => {
//     switch (backendStatus.toUpperCase()) {
//       case "DISPONIBLE": return "available"
//       case "RESERVADA": return "reserved"
//       case "OCUPADA": return "occupied"
//       case "MANTENIMIENTO": return "maintenance"
//       default: return "available"
//     }
//   }

//   // Helper para mostrar Toast
//   const triggerToast = (msg: string, type: "success" | "error" | "warning") => {
//     setToastMsg(msg)
//     setShowToast(true)
//     setTimeout(() => setShowToast(false), 3000)
//     setToastType(type);
//   }

//   // --- FETCH Y MAPEO ---
//   const mapBackendToGrid = (backend: BackendResponse, selectedType: string): GridData => {
//     const dates = backend.dias.map(d => formatDate(d))
//     const allowedTypes = roomTypeMap[selectedType] || []
//     const habitacionesFiltradas = backend.habitaciones.filter(h => allowedTypes.includes(h.tipo))
    
//     const rooms = habitacionesFiltradas.map(h => String(h.numero))
//     const statuses: RoomStatus[] = []
//     const idMap: { [key: string]: number } = {}

//     habitacionesFiltradas.forEach(h => {
//       idMap[String(h.numero)] = h.id
//       h.estadosPorDia.forEach(est => {
//         statuses.push({
//           roomNumber: String(h.numero),
//           date: formatDate(est.fecha),
//           status: mapStatus(est.estado),
//           reservedBy: "Cliente Desconocido" // El backend aun no manda esto, ponemos placeholder
//         })
//       })
//     })

//     return { dates, rooms, statuses, idMap }
//   }

//   const generateDateRange = (start: string, end: string): string[] => {
//     const dates: string[] = []
//     const current = new Date(start + "T12:00:00")
//     const endDateObj = new Date(end + "T12:00:00")
//     while (current <= endDateObj) {
//       dates.push(formatDate(current.toISOString()))
//       current.setDate(current.getDate() + 1)
//     }
//     return dates
//   }

//   const fetchRoomData = async (start: string, end: string) => {
//     setLoading(true)
//     try {
//       const base = process.env.NEXT_PUBLIC_API_BASE || ""
//       const url = `${base}/habitaciones/estado?desde=${start}&hasta=${end}`
//       const response = await fetch(url)
//       if (!response.ok) throw new Error(`API error: ${response.status}`)
//       const data: BackendResponse = await response.json()
//       const mapped = mapBackendToGrid(data, roomType)
      
//       // Fallback si viene vacío (Mantenido de tu código)
//       if (mapped.rooms.length === 0) throw new Error("Empty rooms");

//       setGridData(mapped)
//     } catch (error) {
//       console.log("Usando datos Mock", error)
//       const dates = generateDateRange(start, end)
//       const rooms = ["101", "102", "103", "104", "105"]
//       const statuses: RoomStatus[] = []
//       const mockIdMap: { [key: string]: number } = {}
      
//       dates.forEach(date => {
//         rooms.forEach(room => {
//            const r = Math.random();
//            let s: RoomStatus["status"] = "available";
//            let user = "";
//            if(r > 0.8) { s = "reserved"; user = "JUAN PEREZ"; }
//            else if (r > 0.9) s = "occupied";
//            else if (r > 0.95) s = "maintenance";

//            statuses.push({ roomNumber: room, date, status: s, reservedBy: user })
//            mockIdMap[room] = Number(room)
//         })
//       })
//       setGridData({ dates, rooms, statuses, idMap: mockIdMap })
//     } finally {
//       setLoading(false)
//       // Reseteamos selección al cambiar datos
//       setSelection(null)
//       setFirstClick(null)
//     }
//   }

//   useEffect(() => {
//     if (startDate && endDate) {
//       fetchRoomData(startDate, endDate)
//       setDateScrollIndex(0)
//       setRoomScrollIndex(0)
//     }
//   }, [roomType, startDate, endDate])


//   //Nuevo
//   // --- LÓGICA DE SELECCIÓN (CLICKS) ---

//   const handleCellClick = (date: string, room: string, dateIndexInFullList: number) => {
//     if (!gridData) return;

//     const statusObj = gridData.statuses.find(s => s.roomNumber === room && s.date === date);
//     const currentStatus = statusObj?.status || "available";

//     // 1. REGLAS INMEDIATAS (Bloqueos Hard)
//     if (currentStatus === "occupied" || currentStatus === "maintenance") {
//       triggerToast("Habitación no disponible.", "error");
//       return;
//     }

//     // 2. REGLA MODO RESERVAR
//     if (mode === "reservar" && currentStatus === "reserved") {
//       triggerToast("Día Reservado", "error");
//       return;
//     }

//     // --- LÓGICA 1 o 2 CLICKS ---

//     // A. Si no hay primer click O cambiamos de habitación -> SELECCIÓN DE 1 DÍA
//     if (!firstClick || firstClick.room !== room) {
//       // Guardamos el punto de anclaje
//       setFirstClick({ date, room, dateIndex: dateIndexInFullList });
      
//       // CAMBIO AQUÍ: En lugar de borrar la selección (null), 
//       // establecemos inmediatamente una selección de 1 día.
//       setSelection({
//         room,
//         startDate: date,
//         endDate: date,
//         dateRange: [convertToISO(date)]
//       });
//       return;
//     }

//     // B. Si es el segundo click en la misma habitación -> Definimos Rango
//     if (firstClick.room === room) {
//       const startIdx = Math.min(firstClick.dateIndex, dateIndexInFullList);
//       const endIdx = Math.max(firstClick.dateIndex, dateIndexInFullList);
      
//       const datesInRange = gridData.dates.slice(startIdx, endIdx + 1);
      
//       // Validamos el rango
//       let conflictFound = false;
//       for (const d of datesInRange) {
//           const s = gridData.statuses.find(st => st.roomNumber === room && st.date === d);
//           const st = s?.status || "available";
          
//           if (st === "occupied" || st === "maintenance") conflictFound = true;
//           if (mode === "reservar" && st === "reserved") conflictFound = true;
//       }

//       if (conflictFound) {
//         triggerToast("El rango seleccionado contiene días no válidos.","error");
//         setFirstClick(null); 
//         // Opcional: Si falla el rango, podrías querer volver a la selección de 1 día 
//         // o dejarlo nulo. Dejarlo nulo es más seguro para obligar a re-seleccionar.
//         setSelection(null); 
//         return;
//       }

//       const startDate = gridData.dates[startIdx];
//       const endDate = gridData.dates[endIdx];
//       const isoDates = datesInRange.map(d => convertToISO(d));

//       setSelection({
//         room,
//         startDate,
//         endDate,
//         dateRange: isoDates
//       });
      
//       // Terminamos la interacción de "rango activo", pero la selección queda guardada
//       setFirstClick(null); 
//     }
//   }


//   // --- LÓGICA DEL BOTÓN SIGUIENTE ---

//   const handleNextClick = () => {
//     if (!selection || !gridData) return;

//     // VALIDACIÓN MODO OCUPAR (Conflicto con Reservas)
//     if (mode === "ocupar") {
//        // Buscar si hay alguna reserva en el rango seleccionado
//        // Necesitamos ver los status de esas fechas
//        let reservedConflict: RoomStatus | undefined;
       
//        // Convertimos las fechas ISO de la selección de vuelta a Display para buscar en gridData
//        // O usamos los índices si los tuviéramos, pero iteramos fechas visuales:
//        // Generamos fechas display del rango seleccionado
//        const rangeStartIdx = gridData.dates.indexOf(selection.startDate);
//        const rangeEndIdx = gridData.dates.indexOf(selection.endDate);
       
//        for(let i = rangeStartIdx; i <= rangeEndIdx; i++) {
//           const d = gridData.dates[i];
//           const st = gridData.statuses.find(s => s.roomNumber === selection.room && s.date === d);
//           if (st?.status === "reserved") {
//             reservedConflict = st;
//             break; 
//           }
//        }

//        if (reservedConflict) {
//          // DISPARAMOS EL POPUP
//          setConflictPopup({
//             show: true,
//             guestName: reservedConflict.reservedBy || "DESCONOCIDO",
//             dates: `${selection.startDate} al ${selection.endDate}`
//          });
//          return;
//        }
//     }

//     // Si no hay conflicto o es modo reservar (ya validado en click)
//     confirmNext();
//   }

//   const confirmNext = () => {
//     if (!selection || !gridData) return;
    
//     // Armamos objeto de retorno
//     // onNext espera: { rooms: string[], selectedData: { [key: string]: string[] } }
    
//     // ID real de la habitación
//     const realId = String(gridData.idMap[selection.room]);
    
//     const selectedData = {
//       [selection.room]: selection.dateRange
//     };

//     onNext({
//       rooms: [realId],
//       selectedData
//     });
//   }


//   // --- RENDER HELPERS ---
//   const VISIBLE_DATES = 3
//   const VISIBLE_ROOMS = 7
//   const visibleDates = gridData?.dates.slice(dateScrollIndex, dateScrollIndex + VISIBLE_DATES) || []
//   const visibleRooms = gridData?.rooms.slice(roomScrollIndex, roomScrollIndex + VISIBLE_ROOMS) || []

//   // Estilos de celda
//   const getCellClassName = (date: string, room: string) => {
//     const s = gridData?.statuses.find(st => st.roomNumber === room && st.date === date);
//     const status = s?.status || "available";

//     let classes = `${styles["status-box"]} `;

//     // Base color
//     if (status === "available") classes += styles["status-available"];
//     else if (status === "reserved") classes += styles["status-reserved"];
//     else if (status === "occupied") classes += styles["status-occupied"];
//     else if (status === "maintenance") classes += styles["status-maintenance"];

//     // Estados de selección
//     const isFirstClick = firstClick?.room === room && firstClick.date === date;
    
//     // Verificamos si está dentro del rango seleccionado
//     let isInRange = false;
//     if (selection && selection.room === room && gridData) {
//        const idx = gridData.dates.indexOf(date);
//        const startIdx = gridData.dates.indexOf(selection.startDate);
//        const endIdx = gridData.dates.indexOf(selection.endDate);
//        if (idx >= startIdx && idx <= endIdx) isInRange = true;
//     }

//     if (isFirstClick || isInRange) {
//       classes += ` ${styles["selected"]}`;
//     } else if (status === "available" || (mode === "ocupar" && status === "reserved")) {
//       // Cursor pointer si es seleccionable
//       classes += ` ${styles["selectable"]}`;
//     }

//     return classes;
//   }


//   if (loading || !gridData) return <div className={styles["grid-container"]}>Cargando disponibilidad...</div>

//   return (
//     <div className={styles["grid-wrapper"]}>
//       <Toast message={toastMsg} isVisible={showToast} type={toastType} />
      
//       {/* Header */}
//       <div className={styles["grid-header"]}>
//         <Button className={styles["btn-back"]} onClick={onBack}>Volver</Button>
//         <div className={styles["grid-title"]}>
//            {mode === "reservar" ? "Reservar Habitación" : "Ocupar Habitación"}
//         </div>
//         <select
//           className={styles["room-type-select"]}
//           value={roomType}
//           onChange={(e) => setRoomType(e.target.value)}
//         >
//           <option value="individual-estandar">Individual Estandar</option>
//           <option value="doble">Doble</option>
//           <option value="superior-family">Superior Family Plan</option>
//           <option value="suite">Suite</option>
//         </select>
//       </div>

//       <div className={styles["grid-main"]}>
//         {/* Controles y Tabla */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          
//           <div className={`${styles["room-controls"]} ${styles["horizontal"]}`}>
//             <button className={styles["scroll-btn"]} onClick={() => setRoomScrollIndex(Math.max(0, roomScrollIndex - 1))} disabled={roomScrollIndex === 0}>◄</button>
//              <span className={styles["scroll-info"]}>
//               {visibleRooms[0]} - {visibleRooms[visibleRooms.length - 1]}
//             </span>
//             <button className={styles["scroll-btn"]} onClick={() => setRoomScrollIndex(Math.min(gridData.rooms.length - VISIBLE_ROOMS, roomScrollIndex + 1))} disabled={roomScrollIndex >= gridData.rooms.length - VISIBLE_ROOMS}>►</button>
//           </div>

//           <div className={styles["grid-container"]}>
//             <table className={styles["room-grid-table"]}>
//               <thead>
//                 <tr>
//                   <th className={styles["header-cell"]}>Fecha</th>
//                   {visibleRooms.map((room) => <th key={room} className={styles["room-header"]}>{room}</th>)}
//                 </tr>
//               </thead>
//               <tbody>
//                 {visibleDates.map((date, idxRelative) => {
//                   const dateIndexInFullList = dateScrollIndex + idxRelative;
//                   return (
//                     <tr key={date}>
//                       <td className={styles["date-cell"]}>{date}</td>
//                       {visibleRooms.map(room => (
//                         <td 
//                           key={`${date}-${room}`} 
//                           className={styles["status-cell"]}
//                           onClick={() => handleCellClick(date, room, dateIndexInFullList)}
//                         >
//                           <div className={getCellClassName(date, room)} />
//                         </td>
//                       ))}
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Date Controls */}
//         <div className={`${styles["date-controls"]} ${styles["vertical"]}`}>
//           <button className={`${styles["scroll-btn"]} ${styles["vertical"]}`} onClick={() => setDateScrollIndex(Math.max(0, dateScrollIndex - 1))} disabled={dateScrollIndex === 0}>▲</button>
//           <span className={`${styles["scroll-info"]} ${styles["vertical"]}`}>Fechas</span>
//           <button className={`${styles["scroll-btn"]} ${styles["vertical"]}`} onClick={() => setDateScrollIndex(Math.min(gridData.dates.length - VISIBLE_DATES, dateScrollIndex + 1))} disabled={dateScrollIndex >= gridData.dates.length - VISIBLE_DATES}>▼</button>
//         </div>
//       </div>

//       {/* --- LEYENDA (REFERENCIAS) --- */}
//       <div className={styles["legend-container"]}>
//          <div className={styles["legend-item"]}>
//             <span className={`${styles["legend-box"]} ${styles["status-available"]}`}></span> Disponible
//          </div>
//          <div className={styles["legend-item"]}>
//             <span className={`${styles["legend-box"]} ${styles["status-reserved"]}`}></span> Reservado
//          </div>
//          <div className={styles["legend-item"]}>
//             <span className={`${styles["legend-box"]} ${styles["status-occupied"]}`}></span> Ocupado
//          </div>
//          <div className={styles["legend-item"]}>
//             <span className={`${styles["legend-box"]} ${styles["status-maintenance"]}`}></span> Mantenimiento
//          </div>
//          <div className={styles["legend-item"]}>
//             <span className={`${styles["legend-box"]} ${styles["legend-selected"]}`}></span> Selección
//          </div>
//       </div>

//       {/* Footer */}
//       <div className={styles["grid-footer"]}>
//         <div style={{flex: 1, fontSize: '14px'}}>
//            {firstClick && !selection && "Seleccione la fecha final..."}
//            {selection && `Selección: Hab ${selection.room} (${selection.startDate} - ${selection.endDate})`}
//            {!firstClick && !selection && "Toque una fecha para comenzar."}
//         </div>
//         <Button className={styles["btn-next"]} onClick={handleNextClick} disabled={!selection}>Siguiente</Button>
//       </div>

//       {/* POPUP DE CONFLICTO (OCUPAR) */}
//       {conflictPopup?.show && (
//         <PopupCritical 
//            message={`El/Los día/s ${conflictPopup.dates} la habitación está reservada por ${conflictPopup.guestName}.`}
//            primaryText="OCUPAR IGUAL"
//            secondaryText="CANCELAR"
//            onPrimary={() => {
//               setConflictPopup(null);
//               confirmNext(); // Procedemos
//            }}
//            onSecondary={() => {
//               setConflictPopup(null);
//               setSelection(null); // Borrar selección
//               setFirstClick(null);
//            }}
//         />
//       )}

//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import styles from "./room-grid.module.css"
import Button from "@/components/Button"
import PopupCritical from "@/components/PopupCritical"
import Toast from "@/components/Toast" 

// --- TIPOS ---

interface RoomStatus {
  roomNumber: string
  date: string
  status: "available" | "reserved" | "occupied" | "maintenance"
  // --- NUEVOS CAMPOS DEL BACKEND ---
  reservadoPor?: string 
  clienteId?: number    
  reservaId?: number
}

interface GridData {
  dates: string[]
  rooms: string[]
  statuses: RoomStatus[]
  idMap: { [key: string]: number }
}

// Interfaces del Backend (Actualizadas con los nuevos campos del DTO)
interface BackendEstadoDiario {
  fecha: string;
  estado: string;
  reservadoPor?: string;
  clienteId?: number;
  reservaId?: number;
}

interface BackendHabitacionEstadoDTO {
  id: number
  numero: number
  tipo: string
  estadoActual: string
  estadosPorDia: BackendEstadoDiario[]
}

interface BackendResponse {
  dias: string[]
  habitaciones: BackendHabitacionEstadoDTO[]
}

// Lo que devolvemos al padre
export interface SelectionResult {
  rooms: string[];
  selectedData: { [key: string]: string[] };
  // Nuevo contexto para el Check-in Inteligente
  reservationContext?: {
      reservadoPor?: string;
      clienteId?: number;
      reservaId?: number;
  }
}

interface RoomGridProps {
  mode: "reservar" | "ocupar";
  startDate: string;
  endDate: string;
  onBack: () => void;
  // Actualizamos la firma del onNext
  onNext: (result: SelectionResult) => void;
}

const roomTypeMap: { [key: string]: string[] } = {
  "individual-estandar": ["INDIVIDUAL_ESTANDAR"],
  "doble": ["DOBLE_ESTANDAR", "DOBLE_SUPERIOR"],
  "superior-family": ["SUPERIOR_FAMILY_PLAN"],
  "suite": ["SUITE_DOBLE"]
}

export default function RoomGrid({ mode, startDate, endDate, onBack, onNext }: RoomGridProps) {
  
  // --- ESTADOS DE DATOS ---
  const [gridData, setGridData] = useState<GridData | null>(null)
  const [loading, setLoading] = useState(false)
  const [roomType, setRoomType] = useState("individual-estandar")

  // --- ESTADOS DE UI (Scroll) ---
  const [dateScrollIndex, setDateScrollIndex] = useState(0)
  const [roomScrollIndex, setRoomScrollIndex] = useState(0)

  // --- ESTADOS DE SELECCIÓN (RANGO) ---
  const [firstClick, setFirstClick] = useState<{ date: string, room: string, dateIndex: number } | null>(null)
  const [selection, setSelection] = useState<{ 
    room: string, 
    startDate: string, 
    endDate: string,
    dateRange: string[] 
  } | null>(null)

  // --- POPUPS Y TOASTS ---
  const [toastMsg, setToastMsg] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<"success" | "error" | "warning">("success");
  const [conflictPopup, setConflictPopup] = useState<{ show: boolean, guestName: string, dates: string } | null>(null)

  // --- HELPERS ---
  const formatDate = (iso: string): string => {
    if (!iso) return "";
    const datePart = iso.split("T")[0]; 
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  }

  const convertToISO = (displayDate: string) => {
    const [day, month, year] = displayDate.split("/")
    return `20${year}-${month}-${day}`
  }

  const mapStatus = (backendStatus: string): RoomStatus["status"] => {
    switch (backendStatus.toUpperCase()) {
      case "DISPONIBLE": return "available"
      case "RESERVADA": return "reserved"
      case "OCUPADA": return "occupied"
      case "MANTENIMIENTO": return "maintenance"
      default: return "available"
    }
  }

  const triggerToast = (msg: string, type: "success" | "error" | "warning") => {
    setToastMsg(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    setToastType(type);
  }

  // --- FETCH Y MAPEO (ACTUALIZADO) ---
  // const mapBackendToGrid = (backend: BackendResponse, selectedType: string): GridData => {
  //   const dates = backend.dias.map(d => formatDate(d))
  //   const allowedTypes = roomTypeMap[selectedType] || []
  //   const habitacionesFiltradas = backend.habitaciones.filter(h => allowedTypes.includes(h.tipo))
    
  //   const rooms = habitacionesFiltradas.map(h => String(h.numero))
  //   const statuses: RoomStatus[] = []
  //   const idMap: { [key: string]: number } = {}

  //   habitacionesFiltradas.forEach(h => {
  //     idMap[String(h.numero)] = h.id
  //     h.estadosPorDia.forEach(est => {
  //       statuses.push({
  //         roomNumber: String(h.numero),
  //         date: formatDate(est.fecha),
  //         status: mapStatus(est.estado),
  //         // AQUÍ MAPEAMOS LOS NUEVOS DATOS REALES
  //         reservadoPor: est.reservadoPor, 
  //         clienteId: est.clienteId,
  //         reservaId: est.reservaId
  //       })
  //     })
  //   })

  //   return { dates, rooms, statuses, idMap }
  // }

  const mapBackendToGrid = (backend: BackendResponse, selectedType: string): GridData => {
    const dates = backend.dias.map(d => formatDate(d))
    const allowedTypes = roomTypeMap[selectedType] || []
    const habitacionesFiltradas = backend.habitaciones.filter(h => allowedTypes.includes(h.tipo))
    
    const rooms = habitacionesFiltradas.map(h => String(h.numero))
    const statuses: RoomStatus[] = []
    const idMap: { [key: string]: number } = {}

    habitacionesFiltradas.forEach(h => {
      idMap[String(h.numero)] = h.id
      h.estadosPorDia.forEach(est => {
        if (est.estado === "RESERVADA") {
        console.log("Datos que llegan del Back:", est); 
        }
        statuses.push({
          roomNumber: String(h.numero),
          date: formatDate(est.fecha),
          status: mapStatus(est.estado),
          
          // --- AQUÍ ESTÁ EL ERROR. CAMBIA ESTO: ---
          // ANTES: reservedBy: "Cliente Desconocido"
          
          // AHORA (ASÍ DEBE QUEDAR):
          reservadoPor: est.reservadoPor, // <--- Lee lo que viene del backend
          clienteId: est.clienteId,       // <--- Lee el ID
          reservaId: est.reservaId
        })
      })
    })

    return { dates, rooms, statuses, idMap }
  }

  const generateDateRange = (start: string, end: string): string[] => {
    const dates: string[] = []
    const current = new Date(start + "T12:00:00")
    const endDateObj = new Date(end + "T12:00:00")
    while (current <= endDateObj) {
      dates.push(formatDate(current.toISOString()))
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  const fetchRoomData = async (start: string, end: string) => {
    setLoading(true)
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || ""
      const url = `${base}/habitaciones/estado?desde=${start}&hasta=${end}`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      const data: BackendResponse = await response.json()
      const mapped = mapBackendToGrid(data, roomType)
      
      if (mapped.rooms.length === 0) throw new Error("Empty rooms");

      setGridData(mapped)
    } catch (error) {
      console.log("Usando datos Mock por error", error)
      // MOCK DATA PARA PRUEBAS (Se mantiene igual)
      const dates = generateDateRange(start, end)
      const rooms = ["101", "102", "103", "104", "105"]
      const statuses: RoomStatus[] = []
      const mockIdMap: { [key: string]: number } = {}
      
      dates.forEach(date => {
        rooms.forEach(room => {
           const r = Math.random();
           let s: RoomStatus["status"] = "available";
           let user = undefined;
           if(r > 0.8) { s = "reserved"; user = "JUAN PEREZ (Mock)"; }
           else if (r > 0.9) s = "occupied";
           else if (r > 0.95) s = "maintenance";

           statuses.push({ roomNumber: room, date, status: s, reservadoPor: user })
           mockIdMap[room] = Number(room)
        })
      })
      setGridData({ dates, rooms, statuses, idMap: mockIdMap })
    } finally {
      setLoading(false)
      setSelection(null)
      setFirstClick(null)
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      fetchRoomData(startDate, endDate)
      setDateScrollIndex(0)
      setRoomScrollIndex(0)
    }
  }, [roomType, startDate, endDate])


  // --- LÓGICA DE SELECCIÓN (CLICKS) ---

  const handleCellClick = (date: string, room: string, dateIndexInFullList: number) => {
    if (!gridData) return;

    const statusObj = gridData.statuses.find(s => s.roomNumber === room && s.date === date);
    const currentStatus = statusObj?.status || "available";

    // 1. REGLAS INMEDIATAS (Bloqueos Hard)
    if (currentStatus === "occupied" || currentStatus === "maintenance") {
      triggerToast("Habitación no disponible.", "error");
      return;
    }

    // 2. REGLA MODO RESERVAR (No pisar reservas)
    if (mode === "reservar" && currentStatus === "reserved") {
      triggerToast("Día Reservado", "error");
      return;
    }

    // A. Selección 1 día
    if (!firstClick || firstClick.room !== room) {
      setFirstClick({ date, room, dateIndex: dateIndexInFullList });
      setSelection({
        room,
        startDate: date,
        endDate: date,
        dateRange: [convertToISO(date)]
      });
      return;
    }

    // B. Selección Rango
    if (firstClick.room === room) {
      const startIdx = Math.min(firstClick.dateIndex, dateIndexInFullList);
      const endIdx = Math.max(firstClick.dateIndex, dateIndexInFullList);
      
      const datesInRange = gridData.dates.slice(startIdx, endIdx + 1);
      
      // Validamos el rango
      let conflictFound = false;
      for (const d of datesInRange) {
          const s = gridData.statuses.find(st => st.roomNumber === room && st.date === d);
          const st = s?.status || "available";
          
          if (st === "occupied" || st === "maintenance") conflictFound = true;
          if (mode === "reservar" && st === "reserved") conflictFound = true;
      }

      if (conflictFound) {
        triggerToast("El rango seleccionado contiene días no válidos.","error");
        setFirstClick(null); 
        setSelection(null); 
        return;
      }

      const startDate = gridData.dates[startIdx];
      const endDate = gridData.dates[endIdx];
      const isoDates = datesInRange.map(d => convertToISO(d));

      setSelection({
        room,
        startDate,
        endDate,
        dateRange: isoDates
      });
      
      setFirstClick(null); 
    }
  }


  // --- LÓGICA DEL BOTÓN SIGUIENTE (MODIFICADA) ---

  // --- LÓGICA DEL BOTÓN SIGUIENTE (CON POPUP RESTAURADO) ---
  const handleNextClick = () => {
    // if (!selection || !gridData) return;

    // // VALIDACIÓN MODO OCUPAR: Detectar si pisamos una reserva
    // if (mode === "ocupar") {
    //    let reservedConflict: RoomStatus | undefined;
       
    //    // Buscamos si hay alguna reserva en el rango seleccionado
    //    const rangeStartIdx = gridData.dates.indexOf(selection.startDate);
    //    const rangeEndIdx = gridData.dates.indexOf(selection.endDate);
       
    //    for(let i = rangeStartIdx; i <= rangeEndIdx; i++) {
    //       const d = gridData.dates[i];
    //       const st = gridData.statuses.find(s => s.roomNumber === selection.room && s.date === d);
          
    //       if (st?.status === "reserved") {
    //         reservedConflict = st;
    //         break; 
    //       }
    //    }

    //    if (reservedConflict) {
    //      // ¡HAY CONFLICTO! Disparamos el Popup
    //      setConflictPopup({
    //        show: true,
    //        // Usamos el nombre real que viene del backend o un fallback
    //        guestName: reservedConflict.reservadoPor || "Un Cliente",
    //        dates: `${selection.startDate} al ${selection.endDate}`
    //      });
    //      return; // <--- AQUÍ DETENEMOS EL FLUJO HASTA QUE CONFIRME
    //    }
    // }

    // // Si no hay conflicto, avanzamos directo
    // confirmNext();
    if (!selection || !gridData) return;

    // VALIDACIÓN MODO OCUPAR: Detectar si pisamos una reserva
    if (mode === "ocupar") {
       let reservedConflict: RoomStatus | undefined;
       
       // Convertimos fechas de selección a indices para iterar
       const startIdx = gridData.dates.indexOf(selection.startDate);
       const endIdx = gridData.dates.indexOf(selection.endDate);
       
       for(let i = startIdx; i <= endIdx; i++) {
          const d = gridData.dates[i];
          const st = gridData.statuses.find(s => s.roomNumber === selection.room && s.date === d);
          
          if (st?.status === "reserved") {
            reservedConflict = st;
            break; // Con encontrar un día reservado basta
          }
       }

       if (reservedConflict) {
         // ¡HAY CONFLICTO! Disparamos el Popup con el nombre
         setConflictPopup({
           show: true,
           // Aquí leemos el campo 'reservadoPor' que viene del Backend
           guestName: reservedConflict.reservadoPor || "un cliente desconocido",
           dates: `${selection.startDate} al ${selection.endDate}`
         });
         return; // Detenemos el flujo
       }
    }

    // Si no hay conflicto, avanzamos
    confirmNext();
  }

  const confirmNext = () => {
    if (!selection || !gridData) return;
    
    // ID real de la habitación
    const realId = String(gridData.idMap[selection.room]);
    const selectedData = {
      [selection.room]: selection.dateRange
    };

    // --- NUEVO: Extraer contexto de reserva ---
    let reservationInfo = {};

    if (mode === "ocupar") {
        // Buscamos si en los días seleccionados hay información de reserva
        // Iteramos sobre las fechas visuales seleccionadas
        const rangeStartIdx = gridData.dates.indexOf(selection.startDate);
        const rangeEndIdx = gridData.dates.indexOf(selection.endDate);

        for(let i = rangeStartIdx; i <= rangeEndIdx; i++) {
            const d = gridData.dates[i];
            const st = gridData.statuses.find(s => s.roomNumber === selection.room && s.date === d);
            
            // Si encontramos un día reservado con datos, los capturamos
            if (st?.status === "reserved" && (st.reservadoPor || st.clienteId)) {
                reservationInfo = {
                    reservadoPor: st.reservadoPor,
                    clienteId: st.clienteId,
                    reservaId: st.reservaId
                };
                break; // Con encontrar uno nos basta para identificar al cliente
            }
        }
    }

    // Enviamos todo al padre
    onNext({
      rooms: [realId],
      selectedData,
      reservationContext: reservationInfo // Datos encontrados (o vacío)
    });
  }


  // --- RENDER HELPERS ---
  const VISIBLE_DATES = 3
  const VISIBLE_ROOMS = 7
  const visibleDates = gridData?.dates.slice(dateScrollIndex, dateScrollIndex + VISIBLE_DATES) || []
  const visibleRooms = gridData?.rooms.slice(roomScrollIndex, roomScrollIndex + VISIBLE_ROOMS) || []

  // Estilos de celda
  const getCellClassName = (date: string, room: string) => {
    const s = gridData?.statuses.find(st => st.roomNumber === room && st.date === date);
    const status = s?.status || "available";

    let classes = `${styles["status-box"]} `;

    if (status === "available") classes += styles["status-available"];
    else if (status === "reserved") classes += styles["status-reserved"];
    else if (status === "occupied") classes += styles["status-occupied"];
    else if (status === "maintenance") classes += styles["status-maintenance"];

    const isFirstClick = firstClick?.room === room && firstClick.date === date;
    
    let isInRange = false;
    if (selection && selection.room === room && gridData) {
       const idx = gridData.dates.indexOf(date);
       const startIdx = gridData.dates.indexOf(selection.startDate);
       const endIdx = gridData.dates.indexOf(selection.endDate);
       if (idx >= startIdx && idx <= endIdx) isInRange = true;
    }

    if (isFirstClick || isInRange) {
      classes += ` ${styles["selected"]}`;
    } else if (status === "available" || (mode === "ocupar" && status === "reserved")) {
      classes += ` ${styles["selectable"]}`;
    }

    return classes;
  }


  if (loading || !gridData) return <div className={styles["grid-container"]}>Cargando disponibilidad...</div>

  return (
    <div className={styles["grid-wrapper"]}>
      <Toast message={toastMsg} isVisible={showToast} type={toastType} />
      
      {/* Header */}
      <div className={styles["grid-header"]}>
        <Button className={styles["btn-back"]} onClick={onBack}>Volver</Button>
        <div className={styles["grid-title"]}>
           {mode === "reservar" ? "Reservar Habitación" : "Ocupar Habitación"}
        </div>
        <select
          className={styles["room-type-select"]}
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
        >
          <option value="individual-estandar">Individual Estandar</option>
          <option value="doble">Doble</option>
          <option value="superior-family">Superior Family Plan</option>
          <option value="suite">Suite</option>
        </select>
      </div>

      <div className={styles["grid-main"]}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          
          <div className={`${styles["room-controls"]} ${styles["horizontal"]}`}>
            <button className={styles["scroll-btn"]} onClick={() => setRoomScrollIndex(Math.max(0, roomScrollIndex - 1))} disabled={roomScrollIndex === 0}>◄</button>
             <span className={styles["scroll-info"]}>
              {visibleRooms[0]} - {visibleRooms[visibleRooms.length - 1]}
            </span>
            <button className={styles["scroll-btn"]} onClick={() => setRoomScrollIndex(Math.min(gridData.rooms.length - VISIBLE_ROOMS, roomScrollIndex + 1))} disabled={roomScrollIndex >= gridData.rooms.length - VISIBLE_ROOMS}>►</button>
          </div>

          <div className={styles["grid-container"]}>
            <table className={styles["room-grid-table"]}>
              <thead>
                <tr>
                  <th className={styles["header-cell"]}>Fecha</th>
                  {visibleRooms.map((room) => <th key={room} className={styles["room-header"]}>{room}</th>)}
                </tr>
              </thead>
              <tbody>
                {visibleDates.map((date, idxRelative) => {
                  const dateIndexInFullList = dateScrollIndex + idxRelative;
                  return (
                    <tr key={date}>
                      <td className={styles["date-cell"]}>{date}</td>
                      {visibleRooms.map(room => (
                        <td 
                          key={`${date}-${room}`} 
                          className={styles["status-cell"]}
                          onClick={() => handleCellClick(date, room, dateIndexInFullList)}
                        >
                          <div className={getCellClassName(date, room)} />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Date Controls */}
        <div className={`${styles["date-controls"]} ${styles["vertical"]}`}>
          <button className={`${styles["scroll-btn"]} ${styles["vertical"]}`} onClick={() => setDateScrollIndex(Math.max(0, dateScrollIndex - 1))} disabled={dateScrollIndex === 0}>▲</button>
          <span className={`${styles["scroll-info"]} ${styles["vertical"]}`}>Fechas</span>
          <button className={`${styles["scroll-btn"]} ${styles["vertical"]}`} onClick={() => setDateScrollIndex(Math.min(gridData.dates.length - VISIBLE_DATES, dateScrollIndex + 1))} disabled={dateScrollIndex >= gridData.dates.length - VISIBLE_DATES}>▼</button>
        </div>
      </div>

      {/* --- LEYENDA --- */}
      <div className={styles["legend-container"]}>
         <div className={styles["legend-item"]}>
            <span className={`${styles["legend-box"]} ${styles["status-available"]}`}></span> Disponible
         </div>
         <div className={styles["legend-item"]}>
            <span className={`${styles["legend-box"]} ${styles["status-reserved"]}`}></span> Reservado
         </div>
         <div className={styles["legend-item"]}>
            <span className={`${styles["legend-box"]} ${styles["status-occupied"]}`}></span> Ocupado
         </div>
         <div className={styles["legend-item"]}>
            <span className={`${styles["legend-box"]} ${styles["status-maintenance"]}`}></span> Mantenimiento
         </div>
         <div className={styles["legend-item"]}>
            <span className={`${styles["legend-box"]} ${styles["legend-selected"]}`}></span> Selección
         </div>
      </div>

      {/* Footer */}
      <div className={styles["grid-footer"]}>
        <div style={{flex: 1, fontSize: '14px'}}>
           {firstClick && !selection && "Seleccione la fecha final..."}
           {selection && `Selección: Hab ${selection.room} (${selection.startDate} - ${selection.endDate})`}
           {!firstClick && !selection && "Toque una fecha para comenzar."}
        </div>
        <Button className={styles["btn-next"]} onClick={handleNextClick} disabled={!selection}>Siguiente</Button>
      </div>

      {/* POPUP DE CONFLICTO (Solo mantenido si quisieras usarlo para otra cosa, actualmente no se dispara en reserved) */}
      {/* POPUP DE CONFLICTO (OCUPAR) */}
      {conflictPopup?.show && (
        <PopupCritical 
           // AQUÍ SE MUESTRA EL NOMBRE
           message={`El/Los día/s ${conflictPopup.dates} la habitación está reservada por ${conflictPopup.guestName}.`}
           primaryText="OCUPAR IGUAL"
           secondaryText="CANCELAR"
           onPrimary={() => {
              setConflictPopup(null);
              confirmNext(); 
           }}
           onSecondary={() => {
              setConflictPopup(null);
              setSelection(null); 
              setFirstClick(null);
           }}
        />
      )}
      
      {conflictPopup?.show && (
        <PopupCritical 
           message={`El/Los día/s ${conflictPopup.dates} la habitación está reservada por ${conflictPopup.guestName}.`}
           primaryText="OCUPAR IGUAL"
           secondaryText="CANCELAR"
           onPrimary={() => {
              setConflictPopup(null);
              confirmNext(); 
           }}
           onSecondary={() => {
              setConflictPopup(null);
              setSelection(null); 
              setFirstClick(null);
           }}
        />
      )}

    </div>
  )
}