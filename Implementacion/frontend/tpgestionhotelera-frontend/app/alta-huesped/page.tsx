"use client";
import { useRouter } from "next/navigation";
import AltaHuespedManager from "@/components/Manager/AltaHuespedManager";

export default function AltaHuespedPage() {
  const router = useRouter();

  const handleExit = () => {
    router.push("/");
  };

  return (
    <main>
      <AltaHuespedManager onExit={handleExit} />
    </main>
  );
}