import ListadoReserva from "@/components/Listados/ListadoReserva";

export default function Page() {
  // ⚠️ TEMPORAL: datos falsos hasta que conectes la API
  const data = {
    startDate: "2025-01-10",
    endDate: "2025-01-15",
    rooms: ["101", "102"],
  };

  return <ListadoReserva mode="reservar" data={data} />;
}
