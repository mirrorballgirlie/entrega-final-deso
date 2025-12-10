import RoomGrid from "@/components/RoomGrid";

export default async function GrillaOcupar({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {

  
  const params = await searchParams;

  const start = Array.isArray(params.start)
    ? params.start[0]
    : params.start ?? null;

  const end = Array.isArray(params.end)
    ? params.end[0]
    : params.end ?? null;

  return (
    <RoomGrid
      startDate={start}
      endDate={end}
      mode="reservar"
    />
  );
}
