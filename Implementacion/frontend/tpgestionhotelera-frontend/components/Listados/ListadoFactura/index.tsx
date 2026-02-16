"use client";

import { useState } from "react";
import React from "react";
import Button from "@/components/Button";
import styles from "./listadoFactura.module.css";

// -------------------------
// TYPES PARA LISTADO FACTURA
// -------------------------
type Consumo = {
  id: number;             // como agregaste en tu DTO
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
  //monto?: number;         // opcional si calculás monto
  //descripcion?: string;   // para mostrar en la UI
};

type Persona = {
  nombre?: string;
  razonSocial?: string;
  condicionIVA?: string;  // "RI" o cualquier otro
};

type ListadoFacturaProps = {
  persona: Persona;
  estadia: number;               // monto de la estadía
  consumos?: Consumo[];
  onAceptar: (hayItemsNoSeleccionados: boolean,
                estadiaSeleccionada: boolean,
                seleccionados: Record<number, boolean>
  ) => void;
};


// const ListadoFactura = ({
//   persona,
//   estadia,
//   consumos = [],
//   onAceptar
// }) => {

const ListadoFactura = ({
  persona,
  estadia,
  consumos = [],
  onAceptar
}: ListadoFacturaProps) => {


const esResponsableInscripto = persona?.condicionIVA === "RI";
const tipoFactura = esResponsableInscripto ? "A" : "B";

// const [seleccionados, setSeleccionados] = useState<Record<string, boolean>>(
//   () =>
const [seleccionados, setSeleccionados] = useState<Record<number, boolean>>(

    consumos.reduce((acc, c) => {
      acc[c.id] = true; // arrancan todos seleccionados
      return acc;
    }, {} as Record<number, boolean>)
);
const [estadiaSeleccionada, setEstadiaSeleccionada] = useState(true);

// const totalConsumido = consumos.reduce((total, c) => {
//   if (!seleccionados[c.id]) return total;
//   return total + c.monto;
// }, 0);

// const totalConsumido = consumos.reduce((total, c) => {
//   if (!seleccionados[c.id]) return total;
//   return total + (c.monto ?? 0); // si es undefined, suma 0
// }, 0);

const totalConsumido = consumos.reduce((total, c) => {  //fix agregado ya que monto jamas existio en el dto ni en la clase del modelo CONSUMO
  if (!seleccionados[c.id]) return total;
  return total + c.subtotal;
}, 0);



const totalFinal =
  (estadiaSeleccionada ? estadia : 0) + totalConsumido;


const subtotal =
  (estadiaSeleccionada ? estadia : 0) + totalConsumido;

const iva = esResponsableInscripto ? subtotal * 0.21 : 0;
const total = subtotal + iva;

const hayItemsNoSeleccionados =
  !estadiaSeleccionada ||
  Object.values(seleccionados).some(v => v === false);


  return (
    <div className={styles.container}>
      <h3 className={styles.titulo}>
        {persona?.razonSocial || persona?.nombre}
      </h3>

      <div className={styles.detalle}>
        <strong>Detalle</strong>

        <div className={styles.item}>
          <input
            type="checkbox"
            checked={estadiaSeleccionada}
            onChange={() => setEstadiaSeleccionada(!estadiaSeleccionada)}
          />

          <span>Estadía</span>

          <span>${(estadia ?? 0).toLocaleString("es-AR")}</span>
        </div>


        {consumos.map((c) => (
          <div key={c.id} className={styles.item}>
            <input
              type="checkbox"
              checked={seleccionados[c.id]}
              onChange={() =>
                setSeleccionados({
                  ...seleccionados,
                  [c.id]: !seleccionados[c.id],
                })
              }
            />

            {/* <span>{c.descripcion}</span> */}
            <span>{c.nombre}</span>


            <span>
              {/* ${c.monto.toLocaleString("es-AR")} */}
              {/* ${(c.monto ?? 0).toLocaleString("es-AR")} */}
              ${(c.subtotal ?? 0).toLocaleString("es-AR")}

            </span>
          </div>
        ))}

      </div>

      {esResponsableInscripto && (
        <div className={styles.fila}>
          <span>IVA (21%)</span>
          <span>${iva.toFixed(2)}</span>
        </div>
      )}

      <div className={styles.total}>
        <span>Total</span>
        <span>${totalFinal.toLocaleString("es-AR")}</span>
      </div>

      <div className={styles.tipoFactura}>
        Tipo de factura: <strong>{tipoFactura}</strong>
      </div>

      <div className={styles.acciones}>
        <Button variant="contained"
         onClick={() => onAceptar(hayItemsNoSeleccionados, estadiaSeleccionada, seleccionados)}
         >
          ACEPTAR
        </Button>
      </div>
    </div>
  );
};

export default ListadoFactura;