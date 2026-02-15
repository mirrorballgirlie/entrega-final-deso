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

  const handleGuardar = async (datos: any) => {
    try {
        console.log("Lo que se va a enviar al back:", datos);

      const response = await fetch("http://localhost:8080/api/responsablesdepago/alta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (response.ok) {

        setMensajeExito(`Responsable de Pago  ${datos.razonSocial}  ha sido satisfactoriamente cargado`);
        setMostrarToast(true);
        setTimeout(() => {
          router.push("/home");
        }, 2000);
        return "OK";

      } else {

        const errorMsg = await response.text();
        console.error("ERROR DEL BACK", errorMsg);

        if (errorMsg.includes("CUIT") || errorMsg.includes("registrado")) {
            return "EXISTE";
        }
        return "ERROR";
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      return "ERROR";
    }
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