import ListadoHuesped from "@/components/Listados/ListadoHuesped";

interface PageProps {
  searchParams: Promise<{
    apellido?: string;
    nombre?: string;
    tipoDocumento?: string;
    documento?: string;
    mode?: "reservar" | "ocupar" | "buscar";
  }>;
}

export default async function ListadoHuespedPage(props: PageProps) {
 
  const searchParams = await props.searchParams;

  const base = process.env.NEXT_PUBLIC_API_BASE;

  // Construcción segura de parámetros: NO envia vacíos
  const queryParams = new URLSearchParams();

  if (searchParams.apellido) queryParams.append("apellido", searchParams.apellido);
  if (searchParams.nombre) queryParams.append("nombre", searchParams.nombre);
  if (searchParams.tipoDocumento) queryParams.append("tipoDocumento", searchParams.tipoDocumento);
  if (searchParams.documento) queryParams.append("documento", searchParams.documento);

  const query = queryParams.toString();

  const url = `${base}/api/huespedes/buscar?${queryParams.toString()}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  const results = data.existe ? data.resultados : [];

  return (
    <ListadoHuesped
      mode={searchParams.mode || "buscar"}
      results={results}
    />
  );
}
