"use client";
import IngresarPagoManager from "@/components/Manager/IngresarPagoManager";

export default function IngresarPagoPage() {
  return (
    <main style={{
          minHeight: "95vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5"
        }}>
          <IngresarPagoManager />
        </main>
  );
}