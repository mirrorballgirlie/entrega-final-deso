// import FormularioHuesped from "@/components/Formularios/FormularioHuesped";

// export default function BuscarHuespedPage() {
//   return <FormularioHuesped mode="buscar" />;
// }
"use client"; 
import BuscarHuespedManager from "@/components/Manager/BuscarHuespedManager"; // Ajusta la ruta si lo guardaste en otro lado

export default function BuscarHuespedPage() {
  return <BuscarHuespedManager mode="buscar" />;
}