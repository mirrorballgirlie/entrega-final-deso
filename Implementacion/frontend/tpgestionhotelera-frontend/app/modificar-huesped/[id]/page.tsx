"use client";
import { useParams } from "next/navigation";
import ModificarHuespedManager from "@/components/Manager/ModificarHuespedManager";

export default function Page() {
  const params = useParams();
  return <ModificarHuespedManager huespedId={params.id as string} />;
  }
