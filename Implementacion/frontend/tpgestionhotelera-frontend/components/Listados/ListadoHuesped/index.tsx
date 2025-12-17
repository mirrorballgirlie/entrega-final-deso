// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import style from "./lista-huesped.module.css";
// import PopupCritical from "@/components/PopupCritical"; 

// interface GuestResult {
//   apellido: string;
//   nombre: string;
//   tipoDocumento: string;
//   documento: string;
//   // Agrega ID si tu backend lo devuelve, es útil para el post final
//   id?: number; 
// }

// interface Props {
//   mode: "reservar" | "ocupar" | "buscar";
//   results: GuestResult[];
// }

// export default function ListadoHuesped({ mode, results }: Props) {
//   const router = useRouter();

//   const [selectedGuest, setSelectedGuest] = useState<number | null>(null);

//   // Popup que se muestra cuando NO seleccionó ningún huésped
//   const [popupNoSelection, setPopupNoSelection] = useState(false);

//   // Popup cuando backend no encontró resultados
//   const [popupNotFound, setPopupNotFound] = useState(false);

//   /* --- Mostrar popup si results está vacío --- */
//   useEffect(() => {
//     if (results.length === 0) {
//       setPopupNotFound(true);
//     }
//   }, [results]);

//   /* --- MODIFICACIÓN CLAVE AQUÍ --- */
//   const handleNext = () => {
//     // 1. Verificamos si seleccionó a alguien
//     if (selectedGuest !== null) {
      
//       // Obtenemos el objeto real del huésped usando el índice
//       const huespedSeleccionado = results[selectedGuest];

//       // LOGICA SEGÚN EL MODO
//       if (mode === "ocupar") {
//         // A. Guardamos el huésped en memoria para el siguiente paso
//         sessionStorage.setItem("guestData", JSON.stringify(huespedSeleccionado));
        
//         // B. Vamos a la página de confirmación/lista-reserva
//         router.push("/ocupar-habitacion/listado-reserva");

//       } else if (mode === "buscar") {
//         // Si solo estaba buscando, volvemos al inicio (o donde definas)
//         router.push("/");
//       }
      
//       return;
//     }

//     // Si NO seleccionó → mostrar popup estándar
//     setPopupNoSelection(true);
//   };

//   return (
//     <main className={style.container}>
//       <div className={style.resultsWrapper}>

//         {/* HEADER */}
//         <div className={style.header}>
//           <h2 className={style.headerLogo}>Huéspedes</h2>
//           <span className={style.resultsBadge}>{results.length} resultados</span>
//         </div>

//         {/* CONTENT */}
//         {results.length > 0 && (
//           <div className={style.contentWrapper}>
//             <h1 className={style.title}>Resultados</h1>

//             <div className={style.tableContainer}>
//               <table className={style.table}>
//                 <thead>
//                   <tr>
//                     <th></th>
//                     <th className={style.th}>Apellido</th>
//                     <th className={style.th}>Nombre</th>
//                     <th className={style.th}>Tipo Doc</th>
//                     <th className={style.th}>Documento</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {results.map((r, i) => (
//                     <tr key={i}>
//                       <td className={style.td}>
//                         <input
//                           type="radio"
//                           name="selectedGuest"
//                           checked={selectedGuest === i}
//                           onChange={() => setSelectedGuest(i)}
//                         />
//                       </td>

//                       <td className={style.td}>{r.apellido}</td>
//                       <td className={style.td}>{r.nombre}</td>
//                       <td className={style.td}>{r.tipoDocumento}</td>
//                       <td className={style.td}>{r.documento}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className={style.footer}>
//               <button
//                 onClick={() => router.back()}
//                 className={style.buttonCancel}
//               >
//                 Cancelar
//               </button>

//               <button
//                 onClick={handleNext}
//                 className={style.buttonSearch}
//               >
//                 Siguiente
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* POPUP: No seleccionó huésped */}
//       {popupNoSelection && (
//         <PopupCritical
//           message="No seleccionó ningún huésped. ¿Desea crear uno nuevo?"
//           primaryText="Cancelar"
//           secondaryText="Crear huésped nuevo"
//           onPrimary={() => setPopupNoSelection(false)}
//           onSecondary={() => router.push("/alta-huesped")}
//         />
//       )}

//       {/* POPUP: No se encontró ningún huésped */}
//       {popupNotFound && (
//         <PopupCritical
//           message="Huésped no encontrado. ¿Desea dar de alta un huésped nuevo?"
//           primaryText="Volver"
//           secondaryText="Dar alta"
//           onPrimary={() => router.push("/")} 
//           onSecondary={() => router.push("/alta-huesped")}
//         />
//       )}
//     </main>
//   );
// }

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
  id?: number; 
}

interface Props {
  mode: "reservar" | "ocupar" | "buscar";
  results: GuestResult[];
  onRetry: () => void;
  onSelectionComplete?: (huespedes: GuestResult[]) => void; 
}

export default function ListadoHuesped({ mode, results, onRetry, onSelectionComplete }: Props) {
  const router = useRouter();

  // Estado para selección ÚNICA (radio button) -> Modo "buscar" / "reservar"
  const [selectedSingleIndex, setSelectedSingleIndex] = useState<number | null>(null);

  // Estado para selección MÚLTIPLE (checkbox) -> Modo "ocupar"
  const [selectedMultipleIndices, setSelectedMultipleIndices] = useState<number[]>([]);

  // Popups
  const [popupNoSelection, setPopupNoSelection] = useState(false);
  const [popupNotFound, setPopupNotFound] = useState(false);

  /* --- Mostrar popup si results está vacío --- */
  useEffect(() => {
    if (results.length === 0) {
      setPopupNotFound(true);
    }
  }, [results]);

  // Maneja el toggle de los checkboxes
  const toggleCheckbox = (index: number) => {
    setSelectedMultipleIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index); // Desmarcar
      } else {
        return [...prev, index]; // Marcar
      }
    });
  };

  const handleNext = () => {
    // -------------------------------------------------
    // CASO 1: MODO OCUPAR (Múltiples huéspedes - Checkboxes)
    // -------------------------------------------------
    if (mode === "ocupar") {
      if (selectedMultipleIndices.length > 0) {
        // A. Convertimos los índices seleccionados a los objetos reales de huéspedes
        const huespedesSeleccionados = selectedMultipleIndices.map(
          (index) => results[index]
        );

        // B. PRIORIDAD WIZARD: Si el componente padre nos pasó la función, la usamos.
        // Esto evita usar sessionStorage y router.push
        if (onSelectionComplete) {
          onSelectionComplete(huespedesSeleccionados);
          return; 
        }

        // C. FALLBACK (Legacy): Si no hay callback, usamos el comportamiento antiguo
        sessionStorage.setItem("guestData", JSON.stringify(huespedesSeleccionados));
        router.push("/ocupar-habitacion/listado-reserva");
        return;
      }
      
      // Si no seleccionó nada
      setPopupNoSelection(true);
      return;
    }

    // -------------------------------------------------
    // CASO 2: MODO BUSCAR / RESERVAR (Huésped único - Radio)
    // -------------------------------------------------
    if (selectedSingleIndex !== null) {
      const huespedSeleccionado = results[selectedSingleIndex];

      // Si por alguna razón el Wizard usa modo simple, devolvemos un array de 1
      if (onSelectionComplete) {
        onSelectionComplete([huespedSeleccionado]);
        return;
      }

      // Lógica de navegación antigua
      if (mode === "buscar") {
        router.push("/");
      } else {
        // Caso "reservar" antiguo
        sessionStorage.setItem("guestData", JSON.stringify(huespedSeleccionado));
        router.push("/"); // O la ruta que corresponda
      }
      return;
    }

    // Si no seleccionó nada en modo single
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
                        {/* CONDICIONAL: Checkbox si es 'ocupar', Radio si es 'buscar' */}
                        {mode === "ocupar" ? (
                          <input
                            type="checkbox"
                            checked={selectedMultipleIndices.includes(i)}
                            onChange={() => toggleCheckbox(i)}
                            style={{ cursor: "pointer", width: "18px", height: "18px" }}
                          />
                        ) : (
                          <input
                            type="radio"
                            name="selectedGuest"
                            checked={selectedSingleIndex === i}
                            onChange={() => setSelectedSingleIndex(i)}
                            style={{ cursor: "pointer", width: "18px", height: "18px" }}
                          />
                        )}
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
                onClick={onRetry} 
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
          onPrimary={onRetry} 
          onSecondary={() => router.push("/alta-huesped")}
        />
      )}
    </main>
  );
}