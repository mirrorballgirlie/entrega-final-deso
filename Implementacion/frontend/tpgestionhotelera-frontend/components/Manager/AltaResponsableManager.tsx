"use client";
import React, { useState } from "react";
import FormularioResponsable from "@/components/Formularios/FormularioResponsable";
import PopupThreeOptions from "@/components/PopupThreeOptions";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";

export default function AltaResponsableManager() {
  const router = useRouter();
  const [mostrarPopUpCancelar, setMostrarPopUpCancelar] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);

  const handleGuardar = (datos: any) => {
    //mockeo cuit duplicado
    if (datos.cuit === "30-11111111-2") {
      return "EXISTE";
    }

    setMensajeExito(`La firma ${datos.razonSocial} ha sido satisfactoriamente cargada`);
    setMostrarToast(true);

    setTimeout(() => {
      //setMensajeExito("");
      router.push("/home");
    }, 2000);

    return "OK";
  };

return (
    <div>
      <FormularioResponsable
        onGuardar={handleGuardar}
        onCancelar={() => setMostrarPopUpCancelar(true)}
      />

      {mostrarPopUpCancelar && (
        <PopupThreeOptions
          message="¿Desea cancelar el alta del responsable de pago?"
          option1Text="SÍ"
          onOption1={() => router.push("/home")}
          option2Text="NO"
          onOption2={() => setMostrarPopUpCancelar(false)}
        />
      )}

      <Toast
        message={mensajeExito}
        isVisible={mostrarToast}
        type="success"
      />
    </div>
  );
}