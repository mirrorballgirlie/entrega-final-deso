"use client";
import React, { useState, useEffect } from "react";
import FormularioResponsable from "../Formularios/FormularioResponsable";
import PopupThreeOptions from "@/components/PopupThreeOptions";
import Toast from "@/components/Toast";
import CartelConfirmacion from "@/components/CartelConfirmacion";
import { useRouter } from "next/navigation";

export default function ModificarResponsableManager({ id }: { id: string }) {
  const router = useRouter();
  const [datosIniciales, setDatosIniciales] = useState<any>(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);
  //para la baja
  const [mostrarPopUpCancelar, setMostrarPopUpCancelar] = useState(false);
  const [mostrarPopUpEliminar, setMostrarPopUpEliminar] = useState(false);
  const [mostrarCartelImposible, setMostrarCartelImposible] = useState(false);
  const [mostrarCartelExitoBaja, setMostrarCartelExitoBaja] = useState(false);

  useEffect(() => {
    //mockeo un resp
    const responsableDummy = {
      razonSocial: "TECH SOLUTIONS S.A.",
      cuit: "30-12345678-9",
      telefono: "4455-6677",
      calle: "Av. Corrientes",
      numero: "1234",
      piso: "5",
      depto: "A",
      cp: "1000",
      localidad: "CABA",
      provincia: "Buenos Aires",
      pais: "Argentina"
    };
    setDatosIniciales(responsableDummy);
  }, [id]);

  const handleBorrar = () => {
       const tieneFacturas = false; //mockeado para ver el flujo del front!!!

       if (tieneFacturas) {
         setMostrarCartelImposible(true);
       } else {
         setMostrarPopUpEliminar(true);
       }
  };

  const ejecutarEliminacion = () => {
      setMostrarPopUpEliminar(false);
      setMostrarCartelExitoBaja(true);
  }

  const handleModificar = (datos: any) => {
    //mockeo cuit existente
    if (datos.cuit === "20-99999999-9") return "EXISTE";

    setMensajeExito("La operación ha culminado con éxito");
    setMostrarToast(true);
    setTimeout(() => router.push("/home"), 2000);
    return "OK";
  };

  if (!datosIniciales) return <p>Cargando datos del responsable...</p>;

  return (
    <div>
      <FormularioResponsable
        initialData={datosIniciales}
        onGuardar={handleModificar}
        onCancelar={() => setMostrarPopUpCancelar(true)}
        onBorrar={handleBorrar}
        isEdit={true}
      />

      {mostrarPopUpCancelar && (
        <PopupThreeOptions
          message="¿Desea cancelar la modificación del responsable de pago?"
          option1Text="SÍ"
          onOption1={() => router.push("/home")}
          option2Text="NO"
          onOption2={() => setMostrarPopUpCancelar(false)}
        />
      )}
      {mostrarPopUpEliminar && (
          <PopupThreeOptions
            message={`Los datos de ${datosIniciales.razonSocial}, CUIT: ${datosIniciales.cuit} serán eliminados del sistema.`}
            option1Text="ELIMINAR"
            onOption1={ejecutarEliminacion}
            option2Text="CANCELAR"
            onOption2={() => router.push("/home")}
          />
      )}
      {mostrarCartelImposible && (
          <CartelConfirmacion
            message="La firma no puede ser eliminada pues ya se le ha confeccionado una factura en el Hotel en alguna oportunidad."
            onContinue={() => router.push("/home")}
          />
      )}
      {mostrarCartelExitoBaja && (
          <CartelConfirmacion
            message={`Los datos de ${datosIniciales.razonSocial}, CUIT: ${datosIniciales.cuit} han sido eliminados del sistema.`}
            onContinue={() => router.push("/home")}
          />
      )}

      <Toast message={mensajeExito} isVisible={mostrarToast} type="success" />
    </div>
  );
}