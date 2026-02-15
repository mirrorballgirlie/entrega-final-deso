import ModificarResponsableManager from "@/components/Manager/ModificarResponsableManager";

export default async function ModificarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; //

  return <ModificarResponsableManager id={id} />;
}
