"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import style from "./lista-huesped.module.css";
import PopupCritical from "@/components/PopupCritical"; 

interface GuestResult {
  apellido: string;
  nombre: string;
  tipoDocumento: string;
  documento: string;
  // Agrega ID si tu backend lo devuelve, es útil para el post final
  id?: number; 
}

interface Props {
  mode: "reservar" | "ocupar" | "buscar";
  results: GuestResult[];
}

export default function ListadoHuesped({ mode, results }: Props) {
  const router = useRouter();

  const [selectedGuest, setSelectedGuest] = useState<number | null>(null);

  // Popup que se muestra cuando NO seleccionó ningún huésped
  const [popupNoSelection, setPopupNoSelection] = useState(false);

  // Popup cuando backend no encontró resultados
  const [popupNotFound, setPopupNotFound] = useState(false);

  /* --- Mostrar popup si results está vacío --- */
  useEffect(() => {
    if (results.length === 0) {
      setPopupNotFound(true);
    }
  }, [results]);

  /* --- MODIFICACIÓN CLAVE AQUÍ --- */
  const handleNext = () => {
    // 1. Verificamos si seleccionó a alguien
    if (selectedGuest !== null) {
      
      // Obtenemos el objeto real del huésped usando el índice
      const huespedSeleccionado = results[selectedGuest];

      // LOGICA SEGÚN EL MODO
      if (mode === "ocupar") {
        // A. Guardamos el huésped en memoria para el siguiente paso
        sessionStorage.setItem("guestData", JSON.stringify(huespedSeleccionado));
        
        // B. Vamos a la página de confirmación/lista-reserva
        router.push("/ocupar-habitacion/listado-reserva");

      } else if (mode === "buscar") {
        // Si solo estaba buscando, volvemos al inicio (o donde definas)
        router.push("/");
      }
      
      return;
    }

    // Si NO seleccionó → mostrar popup estándar
    setPopupNoSelection(true);
  };

  return (
    <main className={style.container}>
      <div className={style.resultsWrapper}>

        {/* HEADER */}
        <div className={style.header}>
          <h2 className={style.headerLogo}>Huéspedes</h2>
          <span className={style.resultsBadge}>{results.length} resultados</span>
        </div>

        {/* CONTENT */}
        {results.length > 0 && (
          <div className={style.contentWrapper}>
            <h1 className={style.title}>Resultados</h1>

            <div className={style.tableContainer}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th></th>
                    <th className={style.th}>Apellido</th>
                    <th className={style.th}>Nombre</th>
                    <th className={style.th}>Tipo Doc</th>
                    <th className={style.th}>Documento</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}>
                      <td className={style.td}>
                        <input
                          type="radio"
                          name="selectedGuest"
                          checked={selectedGuest === i}
                          onChange={() => setSelectedGuest(i)}
                        />
                      </td>

                      <td className={style.td}>{r.apellido}</td>
                      <td className={style.td}>{r.nombre}</td>
                      <td className={style.td}>{r.tipoDocumento}</td>
                      <td className={style.td}>{r.documento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={style.footer}>
              <button
                onClick={() => router.back()}
                className={style.buttonCancel}
              >
                Cancelar
              </button>

              <button
                onClick={handleNext}
                className={style.buttonSearch}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POPUP: No seleccionó huésped */}
      {popupNoSelection && (
        <PopupCritical
          message="No seleccionó ningún huésped. ¿Desea crear uno nuevo?"
          primaryText="Cancelar"
          secondaryText="Crear huésped nuevo"
          onPrimary={() => setPopupNoSelection(false)}
          onSecondary={() => router.push("/alta-huesped")}
        />
      )}

      {/* POPUP: No se encontró ningún huésped */}
      {popupNotFound && (
        <PopupCritical
          message="Huésped no encontrado. ¿Desea dar de alta un huésped nuevo?"
          primaryText="Volver"
          secondaryText="Dar alta"
          onPrimary={() => router.push("/")} 
          onSecondary={() => router.push("/alta-huesped")}
        />
      )}
    </main>
  );
}