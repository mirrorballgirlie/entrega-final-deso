"use client";
import { useParams } from "next/navigation";
import ModificarHuespedManager from "@/components/Manager/ModificarHuespedManager";

export default function ModificarHuespedPage() {
  const params = useParams();
  const id = params.id as string; // Aquí capturamos el ID de la URL (ej: "123")

  return (
    <div className="p-6">
      <ModificarHuespedManager huespedId={id} />
    </div>
  );
}