"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormularioModificarHuesped from "@/components/Formularios/FormularioModificarHuesped";
import PopupCritical from "@/components/PopupCritical";
import Toast from "@/components/Toast";
import { on } from "events";

interface GuestData {
  id: number;
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  documento: string;
  direccion?: {
    pais?: string;
    provincia?: string;
    ciudad?: string;
    codigoPostal?: string;
    calle?: string;
    numero?: string;
  };
  nacionalidad?: string;
  fechaNacimiento?: string;
  posicionIVA?: string;
  ocupacion?: string;
  telefono?: string;
}

interface Props {
  huesped: GuestData;
}

export default function ModificarHuespedManager({ huesped }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<GuestData>(huesped || {});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [popupCancel, setPopupCancel] = useState(false);
  const [popupDocExists, setPopupDocExists] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [popupDelete, setPopupDelete] = useState(false); // primer popup borrar
  const [popupDeleteConfirm, setPopupDeleteConfirm] = useState(false); // segundo popup confirmar eliminación real
  const [popupCannotDelete, setPopupCannotDelete] = useState(false); // huésped con historial
  const [popupAnyKey, setPopupAnyKey] = useState(false); // para “presione cualquier tecla”

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeDireccion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      direccion: { ...prev.direccion, [name]: value }
    }));
  };

  const validateForm = () => {
    const newErrors: { [field: string]: string } = {};
    if (!form.apellido) newErrors.apellido = "Apellido obligatorio";
    if (!form.nombre) newErrors.nombre = "Nombre obligatorio";
    if (!form.tipoDocumento) newErrors.tipoDocumento = "Tipo de documento obligatorio";
    if (!form.documento) newErrors.documento = "Documento obligatorio";
    if (!form.nacionalidad) newErrors.nacionalidad = "Nacionalidad obligatoria";
    if (!form.fechaNacimiento) newErrors.fechaNacimiento = "Fecha de nacimiento obligatoria";
    if (!form.direccion?.pais) newErrors.pais = "Pais obligatorio";
    if (!form.direccion?.provincia) newErrors.provincia = "Provincia obligatoria";
    if (!form.direccion?.ciudad) newErrors.ciudad = "Ciudad obligatoria";
    if (!form.direccion?.codigoPostal) newErrors.codigoPostal = "Código postal obligatorio";
    if (!form.direccion?.calle) newErrors.calle = "Calle obligatoria";
    if (!form.direccion?.numero) newErrors.numero = "Número obligatorio";
    if (!form.posicionIVA) newErrors.posicionIVA = "Posición IVA obligatoria";
    if (!form.ocupacion) newErrors.ocupacion = "Ocupación obligatoria";
    if (!form.telefono) newErrors.telefono = "Teléfono obligatorio";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Flujo 2.A: errores de omisión
    }

    // Flujo alternativo 2.B: verificar si tipo+documento ya existe
    const guests = JSON.parse(sessionStorage.getItem("guestData") || "[]") as GuestData[];
    const exists = guests.some(
      g => g.tipoDocumento === form.tipoDocumento && g.documento === form.documento && g.id !== form.id
    );

    if (exists) {
      setPopupDocExists(true);
      return;
    }

    // flujo principal: actualizar huésped (mock)
    const updatedGuests = guests.map(g => (g.id === form.id ? form : g));
    sessionStorage.setItem("guestData", JSON.stringify(updatedGuests));

    // mostrar toast de éxito y volver al home
    setToastMsg("La operación ha culminado con éxito");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push("/home");
    }, 1500);
  };

  const onBlurSubmit = (e: React.FocusEvent) => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Flujo 2.A: errores de omisión
    }
  }

  //cancelar
  const handleCancel = () => setPopupCancel(true);
  const confirmCancel = () => {
    setPopupCancel(false);
    router.push("/home");
  };
  const rejectCancel = () => {
    setPopupCancel(false);
    setForm({ ...huesped });
  };

  //doc existente
  const acceptDocAnyway = () => {
    const guests = JSON.parse(sessionStorage.getItem("guestData") || "[]") as GuestData[];
    const updatedGuests = guests.map(g => (g.id === form.id ? form : g));
    sessionStorage.setItem("guestData", JSON.stringify(updatedGuests));
    setPopupDocExists(false);
    setToastMsg("La operación ha culminado con éxito");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push("/home");
    }, 1500);
  };
  const correctDoc = () => {
    setPopupDocExists(false);
    setErrors({ tipoDocumento: "Corrija el tipo y número de documento" });
  };

  //borrar
  const handleDeleteClick = () => setPopupDelete(true); // abre primer popup

  const confirmDeleteStep1 = () => {
    setPopupDelete(false);

    const hospedadoAntes = false; //hardcodeado para probar!!!
    if (hospedadoAntes) {
      setPopupCannotDelete(true);
    } else {
      setPopupDeleteConfirm(true);
    }
  };

  const cancelDeleteStep1 = () => setPopupDelete(false);
  const deleteGuest = () => {
    setPopupDeleteConfirm(false);
    setToastMsg(
      `Los datos del huésped ${form.nombre} ${form.apellido}, ${form.tipoDocumento} ${form.documento} han sido eliminados del sistema`
    );
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push("/home");
    }, 2000);
  };
  const cancelDeleteConfirm = () => {
    setPopupDeleteConfirm(false);
    router.push("/home");
  };


  useEffect(() => {
    if (!popupCannotDelete) return;

    const handleKeyDown = () => {
      setPopupCannotDelete(false);
      router.push("/home");
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [popupCannotDelete, router]);

  return (
    <div>
      <FormularioModificarHuesped
        huesped={form}
        form={form}
        errors={errors}
        onChange={handleChange}
        onChangeDireccion={handleChangeDireccion}
        onBlur={onBlurSubmit}
        onBlurDireccion={onBlurSubmit}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={handleDeleteClick}
      />

      {popupCancel && (
        <PopupCritical
          message="¿Desea cancelar la modificación del huésped?"
          primaryText="Si"
          secondaryText="No"
          onPrimary={confirmCancel}
          onSecondary={rejectCancel}
        />
      )}

      {popupDocExists && (
        <PopupCritical
          message="¡CUIDADO! El tipo y número de documento ya existen en el sistema"
          primaryText="ACEPTAR IGUALMENTE"
          secondaryText="CORREGIR"
          onPrimary={acceptDocAnyway}
          onSecondary={correctDoc}
        />
      )}

      {popupDelete && (
        <PopupCritical
          message="¿Desea borrar al huésped?"
          primaryText="Si"
          secondaryText="No"
          onPrimary={confirmDeleteStep1}
          onSecondary={cancelDeleteStep1}
        />
      )}

      {popupDeleteConfirm && (
        <PopupCritical
          message={`Los datos del huésped ${form.nombre} ${form.apellido}, ${form.tipoDocumento} ${form.documento} serán eliminados del sistema`}
          primaryText="ELIMINAR"
          secondaryText="CANCELAR"
          onPrimary={deleteGuest}
          onSecondary={cancelDeleteConfirm}
        />
      )}

      {popupCannotDelete && (
        <PopupCritical
          message="El huésped no puede ser eliminado pues se ha alojado en el Hotel en alguna oportunidad. PRESIONE CUALQUIER TECLA PARA CONTINUAR…"
          //hideButtons={true}
        />
      )}
      {popupAnyKey && (
        <PopupCritical
          message="El huésped no puede ser eliminado / Los datos han sido eliminados. Presione cualquier tecla para continuar..."
          type="anyKey"
          onPrimary={() => {
            setPopupAnyKey(false);
            router.push("/home");
          }}
        />
      )}
      {showToast && <Toast message={toastMsg} isVisible={showToast} type="warning" />}
    </div>
  );
}
