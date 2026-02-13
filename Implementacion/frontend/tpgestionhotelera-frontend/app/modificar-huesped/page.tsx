"use client";

import { useSearchParams } from "next/navigation";
import ModificarHuespedManager from "@/components/Manager/ModificarHuespedManager";

export default function ModificarHuespedPage() {
  const searchParams = useSearchParams();
  const huespedId = searchParams.get("id") ? parseInt(searchParams.get("id") as string) : undefined;
  const useMock = searchParams.get("mock") === "true";

  return <ModificarHuespedManager huespedId={huespedId} useMock={useMock} />;
}
