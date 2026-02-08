"use client";
import { useRouter } from "next/navigation";
import BuscarResponsableManager from "@/components/Manager/BuscarResponsableManager";

export default function BuscarResponsablePage() {
  const router = useRouter();

  const handleExit = () => {
    router.push("/");
  };

  return (
    <main>
      <BuscarResponsableManager onExit={handleExit} />
    </main>
  );
}
