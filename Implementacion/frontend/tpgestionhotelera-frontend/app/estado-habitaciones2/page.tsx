"use client"; // 1. Necesario para usar hooks de navegación

import { useRouter } from "next/navigation"; 
import ReservarManager from "@/components/Manager/ReservarManager"; // Ajusta la ruta si es distinta

export default function EstadoHabitacionesPage() {
  const router = useRouter();

  // Esta función es la que le pasamos al componente hijo
  const handleExit = () => {
    // Le decimos al navegador: "Vuelve a la raíz (Menú Principal)"
    router.push("/");
  };

  return (
    <main>
      {/* Pasamos la función handleExit a la propiedad onExit */}
      <ReservarManager onExit={handleExit} />
    </main>
  );
}