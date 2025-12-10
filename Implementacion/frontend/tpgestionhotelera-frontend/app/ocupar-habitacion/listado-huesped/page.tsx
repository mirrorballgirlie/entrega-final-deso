// app/ocupar-habitacion/listado-huesped/page.tsx

import ListadoHuesped from "@/components/Listados/ListadoHuesped";

export default function Page({ searchParams }: any) {
  const { apellido, nombres, tipoDocumento, documento, mode } = searchParams;

  // ⚠️ TEMPORAL: simulación de resultados hasta que conectes la API
  const results = [
    {
      apellido: apellido || "González",
      nombres: nombres || "Juan",
      tipoDocumento: tipoDocumento || "DNI",
      documento: documento || "12345678",
    },
  ];

  return <ListadoHuesped mode={mode || "ocupar"} results={results} />;
}
