import { Suspense } from "react"
import RoomGrid from "@/components/RoomGrid"

export default function GrillaOcupar() {

  return (
    // Es OBLIGATORIO usar Suspense porque RoomGrid es un Client Component que lee la URL
    <Suspense fallback={<div>Cargando grilla...</div>}>
      <RoomGrid mode="ocupar" />
    </Suspense>
  )
}