"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import styles from "./room-grid.module.css"
import Button from "@/components/Button"

interface RoomStatus {
  roomNumber: string
  date: string
  status: "available" | "reserved" | "occupied" | "maintenance"
}

interface GridData {
  dates: string[]
  rooms: string[]
  statuses: RoomStatus[]
  // CAMBIO 1: Agregamos el mapa para traducir de Número a ID
  idMap: { [key: string]: number }
}

interface BackendHabitacionEstadoDTO {
  id: number
  numero: number
  tipo: string
  capacidad: number
  precio: number
  descripcion: string
  estadoActual: string
  estadosPorDia: { fecha: string; estado: string }[]
}

interface BackendResponse {
  dias: string[]
  habitaciones: BackendHabitacionEstadoDTO[]
}

interface RoomGridProps {
  mode: "reservar" | "ocupar"
}

// Map de roomType a tipos del enum del backend
const roomTypeMap: { [key: string]: string[] } = {
  "individual-estandar": ["INDIVIDUAL_ESTANDAR"],
  "doble": ["DOBLE_ESTANDAR", "DOBLE_SUPERIOR"],
  "superior-family": ["SUPERIOR_FAMILY_PLAN"],
  "suite": ["SUITE_DOBLE"]
}

export default function RoomGrid({ mode }: RoomGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const startDateParam = searchParams.get("desde")
  const endDateParam = searchParams.get("hasta")

  const [gridData, setGridData] = useState<GridData | null>(null)
  const [loading, setLoading] = useState(false)
  const [roomType, setRoomType] = useState("individual-estandar")
  const [dateScrollIndex, setDateScrollIndex] = useState(0)
  const [roomScrollIndex, setRoomScrollIndex] = useState(0)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const formatDate = (iso: string): string => {
    if (!iso) return "";
    const datePart = iso.split("T")[0]; 
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
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

  const mapBackendToGrid = (backend: BackendResponse, selectedType: string): GridData => {
    const dates = backend.dias.map(d => formatDate(d))
    const allowedTypes = roomTypeMap[selectedType] || []

    const habitacionesFiltradas = backend.habitaciones.filter(h =>
      allowedTypes.includes(h.tipo)
    )

    const rooms = habitacionesFiltradas.map(h => String(h.numero))
    const statuses: RoomStatus[] = []
    
    // CAMBIO 2: Llenar el mapa de IDs
    const idMap: { [key: string]: number } = {}

    habitacionesFiltradas.forEach(h => {
      // Guardamos la relación: "101" -> 5 (ID Real)
      idMap[String(h.numero)] = h.id

      h.estadosPorDia.forEach(est => {
        statuses.push({
          roomNumber: String(h.numero),
          date: formatDate(est.fecha),
          status: mapStatus(est.estado)
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

      if (mapped.rooms.length === 0) {
        const defaultRooms = ["101", "102", "103", "104", "105"]
        const statuses: RoomStatus[] = []
        // Mock ID map para fallback
        const mockIdMap: { [key: string]: number } = {}
        
        const dateList = mapped.dates.length > 0 ? mapped.dates : generateDateRange(start, end);
        
        dateList.forEach(date => {
          defaultRooms.forEach(room => {
            statuses.push({ roomNumber: room, date, status: "available" })
            mockIdMap[room] = Number(room) // Fallback simple
          })
        })
        mapped.dates = dateList;
        mapped.rooms = defaultRooms
        mapped.statuses = statuses
        mapped.idMap = mockIdMap
      }

      setGridData(mapped)
      setSelectedCells(new Set())
    } catch (error) {
      console.log("API unavailable, using mock data", error)
      const dates = generateDateRange(start, end)
      const rooms = ["101", "102", "103", "104", "105"]
      const statuses: RoomStatus[] = []
      const mockIdMap: { [key: string]: number } = {}

      dates.forEach(date => {
        rooms.forEach(room => {
          const statusOptions: RoomStatus["status"][] = ["available", "reserved", "occupied", "maintenance"]
          const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]
          statuses.push({ roomNumber: room, date, status: randomStatus })
          mockIdMap[room] = Number(room)
        })
      })
      setGridData({ dates, rooms, statuses, idMap: mockIdMap })
    } finally {
      setLoading(false)
    }
  }

  const formatDateForApi = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    if (!startDateParam || !endDateParam) {
      console.error("Faltan parámetros startDate o endDate en la URL")
      return
    }
    fetchRoomData(startDateParam, endDateParam)
    setDateScrollIndex(0)
    setRoomScrollIndex(0)
  }, [roomType, startDateParam, endDateParam])

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "available": return styles["status-available"]
      case "reserved": return styles["status-reserved"]
      case "occupied": return styles["status-occupied"]
      case "maintenance": return styles["status-maintenance"]
      default: return ""
    }
  }

  const handleCellClick = (date: string, room: string) => {
    const status = gridData?.statuses.find(s => s.roomNumber === room && s.date === date)
    if (status?.status !== "available") return
    const cellKey = `${date}-${room}`
    const newSelected = new Set(selectedCells)
    if (newSelected.has(cellKey)) newSelected.delete(cellKey)
    else newSelected.add(cellKey)
    setSelectedCells(newSelected)
  }

  const convertToISO = (displayDate: string) => {
    const [day, month, year] = displayDate.split("/")
    return `20${year}-${month}-${day}`
  }

  const handleNext = () => {
    if (selectedCells.size === 0) {
      setErrorMessage("Selecciona al menos una habitación")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    const roomDates: { [key: string]: string[] } = {}
    const allSelectedDatesISO: string[] = [] 
    let allValid = true

    selectedCells.forEach((cellKey) => {
      const parts = cellKey.split("-")
      const dateDisplay = parts[0]
      const room = parts[1]

      const status = gridData?.statuses.find((s) => s.roomNumber === room && s.date === dateDisplay)
      
      if (status?.status !== "available") {
        allValid = false
      }

      const dateISO = convertToISO(dateDisplay)

      if (!roomDates[room]) {
        roomDates[room] = []
      }
      roomDates[room].push(dateISO)
      allSelectedDatesISO.push(dateISO)
    })

    // Validación de única habitación
    const uniqueRooms = Object.keys(roomDates);
    if (uniqueRooms.length > 1) {
      setErrorMessage("Solo puedes reservar una habitación por operación.")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    if (!allValid) {
      setErrorMessage("Las habitaciones seleccionadas no están disponibles")
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    allSelectedDatesISO.sort()

    const minDate = allSelectedDatesISO[0]
    const maxDate = allSelectedDatesISO[allSelectedDatesISO.length - 1]

    
    const selectedRoomNumbers = Object.keys(roomDates);
    
    const selectedRoomIds = selectedRoomNumbers.map(num => String(gridData!.idMap[num]));

    sessionStorage.setItem("reservationData", JSON.stringify({
      startDate: minDate, 
      endDate: maxDate,   
      rooms: selectedRoomIds, 
      roomType,
      selectedData: roomDates,
    }))

    if (mode === "reservar") {
      router.push("/estado-habitaciones2/ListadoReserva")
    } else {
      router.push("/ocupar-habitacion/formulario-huesped")
    }
  }


  if (!gridData) return <div className={styles["grid-container"]}>Cargando...</div>

  const VISIBLE_DATES = 3
  const VISIBLE_ROOMS = 7
  const visibleDates = gridData.dates.slice(dateScrollIndex, dateScrollIndex + VISIBLE_DATES)
  const visibleRooms = gridData.rooms.slice(roomScrollIndex, roomScrollIndex + VISIBLE_ROOMS)

  const handleDatePrev = () => setDateScrollIndex(Math.max(0, dateScrollIndex - 1))
  const handleDateNext = () => setDateScrollIndex(Math.min(gridData.dates.length - VISIBLE_DATES, dateScrollIndex + 1))
  const handleRoomPrev = () => setRoomScrollIndex(Math.max(0, roomScrollIndex - 1))
  const handleRoomNext = () => setRoomScrollIndex(Math.min(gridData.rooms.length - VISIBLE_ROOMS, roomScrollIndex + 1))
  const isCellSelected = (date: string, room: string) => selectedCells.has(`${date}-${room}`)
  const isCellSelectable = (status: string) => status === "available"

  return (
    <div className={styles["grid-wrapper"]}>
      <div className={styles["grid-header"]}>
        <Button className={styles["btn-back"]}>Volver</Button>
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

      {showError && <div className={styles["error-popup"]}>{errorMessage}</div>}

      <div className={styles["grid-main"]}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          <div className={`${styles["room-controls"]} ${styles["horizontal"]}`}>
            <button className={styles["scroll-btn"]} onClick={handleRoomPrev} disabled={roomScrollIndex === 0}>◄</button>
            <span className={styles["scroll-info"]}>
              {roomScrollIndex + 1} - {Math.min(roomScrollIndex + VISIBLE_ROOMS, gridData.rooms.length)} de {gridData.rooms.length} habitaciones
            </span>
            <button className={styles["scroll-btn"]} onClick={handleRoomNext} disabled={roomScrollIndex >= gridData.rooms.length - VISIBLE_ROOMS}>►</button>
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
                {visibleDates.map(date => (
                  <tr key={date}>
                    <td className={styles["date-cell"]}>{date}</td>
                    {visibleRooms.map(room => {
                      const status = gridData.statuses.find(s => s.roomNumber === room && s.date === date)
                      const statusColor = getStatusColor(status?.status || "")
                      const isSelectable = isCellSelectable(status?.status || "")
                      const isSelected = isCellSelected(date, room)

                      return (
                        <td key={`${date}-${room}`} className={styles["status-cell"]} onClick={() => isSelectable && handleCellClick(date, room)} style={{ cursor: isSelectable ? "pointer" : "default" }}>
                          <div className={`${styles["status-box"]} ${statusColor} ${isSelected ? styles["selected"] : ""} ${isSelectable ? styles["selectable"] : ""}`}
                               title={`Habitación ${room} - ${date} - ${status?.status || "desconocido"}`} />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${styles["date-controls"]} ${styles["vertical"]}`}>
          <button className={`${styles["scroll-btn"]} ${styles["vertical"]}`} onClick={handleDatePrev} disabled={dateScrollIndex === 0}>▲</button>
          <span className={`${styles["scroll-info"]} ${styles["vertical"]}`}>{dateScrollIndex + 1} - {Math.min(dateScrollIndex + VISIBLE_DATES, gridData.dates.length)}/{gridData.dates.length}</span>
          <button className={`${styles["scroll-btn"]} ${styles["vertical"]}`} onClick={handleDateNext} disabled={dateScrollIndex >= gridData.dates.length - VISIBLE_DATES}>▼</button>
        </div>
      </div>

      <div className={styles["grid-footer"]}>
        <span className={styles["total-info"]}>Total: {gridData.rooms.length} habitaciones × {gridData.dates.length} fechas | Seleccionadas: {selectedCells.size}</span>
        <Button className={styles["btn-next"]} onClick={handleNext} disabled={selectedCells.size === 0}>Siguiente</Button>
      </div>
    </div>
  )
}