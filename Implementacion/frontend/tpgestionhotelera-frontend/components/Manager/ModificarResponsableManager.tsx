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
        if (!id) return;

        fetch(`http://localhost:8080/api/responsablesdepago/${id}`)
          .then((res) => {
              if (!res.ok) throw new Error("Error en el servidor");
              return res.json();
          })
          .then((data) => {

            setDatosIniciales({
              ...data, //trae todo lo del back
              //por las dudas
              calle: data.direccion?.calle,
              numero: data.direccion?.numero,
              piso: data.direccion?.piso,
              depto: data.direccion?.departamento,
              cp: data.direccion?.codigoPostal,
              localidad: data.direccion?.ciudad,
              provincia: data.direccion?.provincia,
              pais: data.direccion?.pais,
              razonSocial: data.nombreRazonSocial || data.razonSocial
            });
          })
          .catch((err) => console.error("Error cargando:", err));
      }, [id]);

  const handleBorrar = async () => {

      try {
        const response = await fetch(`http://localhost:8080/api/responsablesdepago/baja/${id}`, {
          method: "DELETE"
        });

        if (response.ok) {

          setMostrarCartelExitoBaja(true);
        } else {
          // error posiblemente por facturas checkear!!!
          setMostrarCartelImposible(true);
        }
      } catch (error) {
        console.error("Error en la baja", error);
        setMostrarCartelImposible(true);
      }
    };

  const ejecutarEliminacion = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/responsablesdepago/baja/${id}`, {
          method: "DELETE",
        });

        setMostrarPopUpEliminar(false);

        if (response.ok) {
          setMostrarCartelExitoBaja(true);
        } else if (response.status === 409 || response.status === 400) {
          // NO se puede (por facturas u otra razón)
          setMostrarCartelImposible(true);
        } else {
          alert("Error inesperado al intentar eliminar.");
        }
      } catch (error) {
        console.error("Error de red:", error);
        alert("No se pudo conectar con el servidor.");
      }
    };

  const handleModificar = async (datos: any) => {
      try {
        const response = await fetch(`http://localhost:8080/api/responsablesdepago/modificar/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        });

        if (response.ok) {
          setMensajeExito("La operación ha culminado con éxito");
          setMostrarToast(true);
          setTimeout(() => router.push("/home"), 2000);
          return "OK";
        } else {
          const errorText = await response.text();
          console.error("respuesta error back", errorText);
          return "ERROR";
        }
      } catch (error) {
        console.error("error de red", error);
        return "ERROR";
      }
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