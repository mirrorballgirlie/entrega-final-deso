"use client";
import React, { useState, useEffect } from "react";
import styles from "./formularioIngresarPago.module.css";
import Button from "@/components/Button";
import CartelConfirmacion from "@/components/CartelConfirmacion";


interface Props {
  factura: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function FormularioIngresarPago({ factura, onSuccess, onCancel }: Props) {
  const [metodo, setMetodo] = useState("");
  const [totalAPagar, setTotalAPagar] = useState(factura.total);
  const [vuelto, setVuelto] = useState(0);
  const [saldada, setSaldada] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const [form, setForm] = useState({
    importe: "",
    moneda: "ARS",
    cotizacion: "1",
    tarjeta: "",
    nroCheque: "",
    banco: "",
    plaza: "",
    fechaCobro: ""
  });

  const handleMetodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMetodo(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const procesarPago = () => {
    setMensajeError("");
    const monto = Number(form.importe); //convierte todo el string a numero

    if (isNaN(monto) || form.importe.trim() === "" | monto <=0) { //valido datos
      setMensajeError("Por favor, ingrese un monto valido");
      return;
    }
    if (metodo.includes("tarjeta") && !form.tarjeta) {
        setMensajeError("Debe seleccionar una tarjeta");
        return;
    }
    if (metodo === "cheques"){ //validacion para cheque zzz
        const hoy = new Date(); //para q no me acepte un cheque pasado
        hoy.setHours(0, 0, 0, 0);
        const fechaSeleccionada = new Date(form.fechaCobro);
        fechaSeleccionada.setMinutes(fechaSeleccionada.getMinutes() + fechaSeleccionada.getTimezoneOffset());
        //validacion campos vacios
        if (!form.nroCheque || !form.banco || !form.fechaCobro) {
        setMensajeError("DEBE COMPLETAR LOS DATOS DEL CHEQUE (Numero, Banco y Fecha de cobro)");
        return;
        }
        //validacion formato numerico ??
        if(isNaN(Number(form.nroCheque))){
            setMensajeError("EL NÚMERO DE CHEQUE DEBE SER ÚNICAMENTE NUMÉRICO");
            return;
        }
        //validacion fecha
        if (fechaSeleccionada < hoy) {
            setMensajeError("LA FECHA DEL CHEQUE DEBE SER ACTUAL O FUTURA");
            return;
        }
    }
    setMensajeError(""); //si sale todo ok
    const nuevoDeuda = totalAPagar - monto;

    if (nuevoDeuda <= 0) { //factura saldada
      setVuelto(Math.abs(nuevoDeuda));
      setTotalAPagar(0);
      setSaldada(true);
    } else { //monto menor a la deuda
      setTotalAPagar(nuevoDeuda);
      setMetodo("");
      setForm({
          importe: "",
          moneda: "ARS",
          cotizacion: "1",
          tarjeta: "",
          nroCheque: "",
          banco: "",
          plaza: "",
          fechaCobro: ""
          });
      setMensajeError("Pago parcial recibido");
      }

  };

  return (
    <div className={styles.container}>
      <h2 style={{
          fontFamily: 'Mate SC', textAlign: 'center',
          fontSize: '40px', color: '#374375',  }}>
        Detalle del Pago
      </h2>

      <div className={styles.summary}>
        <div>
          <p><strong>Factura:</strong> {factura.numeroFactura}</p>
          <p><strong>Responsable:</strong> {factura.nombreResponsable}</p>
        </div>
        <div>
          <p className={styles.totalHighlight}>Total a Pagar: ${totalAPagar}</p>
          <p className={styles.vueltoHighlight}>Vuelto: ${vuelto}</p>
        </div>
      </div>

      <label className={styles.label}>Medio de Pago</label>
      <select className={styles.select} value={metodo} onChange={handleMetodoChange}>
        <option value="">Seleccione una opción...</option>
        <option value="moneda">Moneda</option>
        <option value="cheques">Cheques</option>
        <option value="tarjeta_c">Tarjeta Crédito</option>
        <option value="tarjeta_d">Tarjeta Débito</option>
      </select>

      <div className={styles.gridFields}>
        <input
          name="importe"
          placeholder="IMPORTE"
          className={styles.input}
          disabled={!metodo}
          value={form.importe}
          onChange={(e) => {
                  setMensajeError("");
                  handleInputChange(e);
          }}
        />

        <select
          name="moneda"
          className={styles.select}
          disabled={metodo !== "moneda"}
          value={form.moneda}
          onChange={handleInputChange}
        >
          <option value="ARS">ARS - Pesos Argentinos</option>
          <option value="USD">USD - Dolares</option>
        </select>

        <select
          name="tarjeta"
          className={styles.select}
          disabled={!metodo.includes("tarjeta")}
          value={form.tarjeta || ""}
          onChange={handleInputChange}
        >
          <option value="">Seleccionar Tarjeta...</option>
          <option value="visa">Visa</option>
          <option value="master">Mastercard</option>
        </select>

        <input
          name="nroCheque"
          placeholder="NRO CHEQUE"
          className={styles.input}
          disabled={metodo !== "cheques"}
          value={form.nroCheque || ""}
          onChange={handleInputChange}
        />
        <input
          name="banco"
          placeholder="BANCO"
          className={styles.input}
          disabled={metodo !== "cheques"}
          value={form.banco}
          onChange={handleInputChange}
        />
        <input
          name="fechaCobro"
          type="date"
          className={styles.input}
          disabled={metodo !== "cheques"}
          value={form.fechaCobro}
          onChange={handleInputChange}
        />
      </div>
      {mensajeError && (
                      <span className={styles.errorText}>
                       {mensajeError}
                      </span>
                    )}
      <div className={styles.buttonGroup}>
        <Button onClick={procesarPago}>Ingresar Pago</Button>
        <Button onClick={onCancel}>Cancelar</Button>
      </div>

      {saldada && (
        <CartelConfirmacion
           message="FACTURA SALDADA"
           subMessage={`VUELTO: $${vuelto}`}
           onContinue={onSuccess}
        />
      )}
    </div>
  );
}