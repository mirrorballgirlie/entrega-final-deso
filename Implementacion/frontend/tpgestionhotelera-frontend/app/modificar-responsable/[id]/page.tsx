import ModificarResponsableManager from "@/components/Manager/ModificarResponsableManager";

export default function ModificarPage({ params }: { params: { id: string } }) {
  return (
    <main style={{ padding: "40px", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <ModificarResponsableManager id={params.id} />
    </main>
  );
}
