"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormularioModificarHuesped from "@/components/Formularios/FormularioModificarHuesped";
import PopupCritical from "@/components/PopupCritical";
import Toast from "@/components/Toast";

interface DireccionData {
  pais: string;
  provincia: string;
  ciudad: string;
  codigoPostal: string;
  calle: string;
  numero: number;
  piso?: number;
  departamento?: string;
}

interface GuestData {
  id: number;
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  documento: string;
  direccion: DireccionData;
  nacionalidad: string;
  fechaNacimiento: string;
  posicionIVA: string;
  ocupacion: string;
  telefono: string;
  email?: string;
  cuit?: string;
}

interface Props {
  huesped?: GuestData;
  huespedId?: number;
  useMock?: boolean;
}

const API_BASE_URL = "http://localhost:8080/api/huespedes";

export default function ModificarHuespedManager({ huesped, huespedId, useMock = false }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<GuestData>(huesped || ({} as GuestData));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [popupCancel, setPopupCancel] = useState(false);
  const [popupDocExists, setPopupDocExists] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [popupDelete, setPopupDelete] = useState(false);
  const [popupDeleteConfirm, setPopupDeleteConfirm] = useState(false);
  const [popupCannotDelete, setPopupCannotDelete] = useState(false);

  // Cargar huésped de backend si tenemos ID
  useEffect(() => {
    if (!huesped && huespedId && !useMock) {
      loadHuespedFromBackend(huespedId);
    }
  }, [huespedId, useMock]);

  // Cargar desde mock (sessionStorage)
  useEffect(() => {
    if (useMock && huespedId && !huesped) {
      loadHuespedFromMock(huespedId);
    }
  }, [huespedId, useMock]);

  const loadHuespedFromBackend = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error("No se pudo cargar los datos del huésped");
      }
      const data: GuestData = await response.json();
      setForm(data);
    } catch (error) {
      console.error("Error cargando huésped:", error);
      setToastMsg("Error al cargar los datos del huésped");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHuespedFromMock = (id: number) => {
    const guests = JSON.parse(sessionStorage.getItem("guestData") || "[]") as GuestData[];
    const guest = guests.find(g => g.id === id);
    if (guest) {
      setForm(guest);
    } else {
      setToastMsg("Huésped no encontrado en datos mock");
      setShowToast(true);
    }
  };

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpiar errores del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleChangeDireccion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      direccion: { ...(prev.direccion || {}), [name]: isNumericField(name) ? parseInt(value) : value } as DireccionData
    }));
    // Limpiar errores del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Validación en tiempo real al perder el foco (opcional)
    // Por ahora no implementado, pero el framework está listo para extenderlo
  };

  const handleBlurDireccion = (e: React.FocusEvent<HTMLInputElement>) => {
    // Validación en tiempo real para dirección al perder el foco (opcional)
    // Por ahora no implementado, pero el framework está listo para extenderlo
  };

  const isNumericField = (name: string): boolean => {
    return ["numero", "piso"].includes(name);
  };

  const validateForm = (): boolean => {
    const newErrors: { [field: string]: string } = {};
    
    if (!form.apellido?.trim()) newErrors.apellido = "Apellido obligatorio";
    if (!form.nombre?.trim()) newErrors.nombre = "Nombre obligatorio";
    if (!form.tipoDocumento?.trim()) newErrors.tipoDocumento = "Tipo de documento obligatorio";
    if (!form.documento?.trim()) newErrors.documento = "Documento obligatorio";
    if (!form.nacionalidad?.trim()) newErrors.nacionalidad = "Nacionalidad obligatoria";
    if (!form.fechaNacimiento?.trim()) newErrors.fechaNacimiento = "Fecha de nacimiento obligatoria";
    if (!form.direccion?.pais?.trim()) newErrors.pais = "País obligatorio";
    if (!form.direccion?.provincia?.trim()) newErrors.provincia = "Provincia obligatoria";
    if (!form.direccion?.ciudad?.trim()) newErrors.ciudad = "Ciudad obligatoria";
    if (!form.direccion?.codigoPostal?.trim()) newErrors.codigoPostal = "Código postal obligatorio";
    if (!form.direccion?.calle?.trim()) newErrors.calle = "Calle obligatoria";
    if (!form.direccion?.numero) newErrors.numero = "Número obligatorio";
    if (!form.posicionIVA?.trim()) newErrors.posicionIVA = "Posición IVA obligatoria";
    if (!form.ocupacion?.trim()) newErrors.ocupacion = "Ocupación obligatoria";
    if (!form.telefono?.trim()) newErrors.telefono = "Teléfono obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Crear DTO para enviar al backend
  const createHuespedDTO = (): any => {
    return {
      id: form.id,
      nombre: form.nombre.toUpperCase(),
      apellido: form.apellido.toUpperCase(),
      tipoDocumento: form.tipoDocumento,
      documento: form.documento,
      posicionIVA: form.posicionIVA,
      fechaNacimiento: form.fechaNacimiento,
      telefono: form.telefono,
      email: form.email || null,
      ocupacion: form.ocupacion.toUpperCase(),
      nacionalidad: form.nacionalidad,
      cuit: form.cuit || null,
      direccion: {
        pais: form.direccion.pais.toUpperCase(),
        provincia: form.direccion.provincia.toUpperCase(),
        ciudad: form.direccion.ciudad.toUpperCase(),
        codigoPostal: form.direccion.codigoPostal.toUpperCase(),
        calle: form.direccion.calle.toUpperCase(),
        numero: parseInt(form.direccion.numero.toString()),
        piso: form.direccion.piso ? parseInt(form.direccion.piso.toString()) : null,
        departamento: form.direccion.departamento?.toUpperCase() || null
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Flujo 2.A: Validación de campos obligatorios
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (useMock) {
        // Flujo alternativo 2.B: verificar si tipo+documento ya existe (MOCK)
        const guests = JSON.parse(sessionStorage.getItem("guestData") || "[]") as GuestData[];
        const exists = guests.some(
          g => g.tipoDocumento === form.tipoDocumento && g.documento === form.documento && g.id !== form.id
        );

        if (exists) {
          setPopupDocExists(true);
          setIsLoading(false);
          return;
        }

        // Actualizar en mock
        const updatedGuests = guests.map(g => (g.id === form.id ? form : g));
        sessionStorage.setItem("guestData", JSON.stringify(updatedGuests));

        setToastMsg("La operación ha culminado con éxito");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push("/home");
        }, 1500);
      } else {
        // Actualizar en backend
        const dto = createHuespedDTO();
        const response = await fetch(`${API_BASE_URL}/actualizar/${form.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dto),
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          // Manejar error de documento duplicado (Flujo 2.B)
          if (response.status === 400 && errorData.error?.includes("documento")) {
            setPopupDocExists(true);
            setIsLoading(false);
            return;
          }

          throw new Error(errorData.error || "Error al actualizar el huésped");
        }

        setToastMsg("La operación ha culminado con éxito");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push("/home");
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      setToastMsg(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // --- CANCELAR ---
  const handleCancel = () => setPopupCancel(true);
  const confirmCancel = () => {
    setPopupCancel(false);
    router.push("/home");
  };
  const rejectCancel = () => {
    setPopupCancel(false);
    setErrors({});
  };

  // --- DOCUMENTO EXISTENTE ---
  const acceptDocAnyway = async () => {
    setPopupDocExists(false);
    setIsLoading(true);

    try {
      if (useMock) {
        const guests = JSON.parse(sessionStorage.getItem("guestData") || "[]") as GuestData[];
        const updatedGuests = guests.map(g => (g.id === form.id ? form : g));
        sessionStorage.setItem("guestData", JSON.stringify(updatedGuests));

        setToastMsg("La operación ha culminado con éxito");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push("/home");
        }, 1500);
      } else {
        const dto = createHuespedDTO();
        const response = await fetch(`${API_BASE_URL}/actualizar/${form.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dto),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el huésped");
        }

        setToastMsg("La operación ha culminado con éxito");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push("/home");
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      setToastMsg(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const correctDoc = () => {
    setPopupDocExists(false);
    setErrors({ tipoDocumento: "Corrija el tipo y número de documento" });
  };

  // --- BORRAR (CU11: Dar baja de huésped) ---
  const handleDeleteClick = () => setPopupDelete(true);

  const confirmDeleteStep1 = async () => {
    setPopupDelete(false);
    setIsLoading(true);

    try {
      if (useMock) {
        // En mock, asumimos que no hay hospedajes previos
        setPopupDeleteConfirm(true);
      } else {
        // Verificar si el huésped tiene estadías
        const response = await fetch(`${API_BASE_URL}/${form.id}`);
        
        if (!response.ok) {
          throw new Error("Error al verificar el historial del huésped");
        }

        const hData = await response.json();
        
        // Si tiene estadías, no puede eliminarse (Flujo alternativo 2.A)
        // El backend devuelve un error si el huésped tiene estadías
        setPopupDeleteConfirm(true);
      }
    } catch (error: any) {
      // Si el error indica que el huésped tiene ahorro
      if (error.message?.includes("alojado")) {
        setPopupCannotDelete(true);
      } else {
        console.error("Error:", error);
        setToastMsg(`Error: ${error.message}`);
        setShowToast(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDeleteStep1 = () => setPopupDelete(false);

  const deleteGuest = async () => {
    setPopupDeleteConfirm(false);
    setIsLoading(true);

    try {
      if (useMock) {
        // Eliminar del mock
        const guests = JSON.parse(sessionStorage.getItem("guestData") || "[]") as GuestData[];
        const updatedGuests = guests.filter(g => g.id !== form.id);
        sessionStorage.setItem("guestData", JSON.stringify(updatedGuests));

        setToastMsg(
          `Los datos del huésped ${form.nombre} ${form.apellido}, ${form.tipoDocumento} ${form.documento} han sido eliminados del sistema`
        );
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push("/home");
        }, 2000);
      } else {
        // Eliminar del backend
        const response = await fetch(`${API_BASE_URL}/baja/${form.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Si tiene estadías, mostrar el popup
          if (response.status === 400) {
            setPopupCannotDelete(true);
            setIsLoading(false);
            return;
          }
          throw new Error(errorData.error || "Error al eliminar el huésped");
        }

        setToastMsg(
          `Los datos del huésped ${form.nombre} ${form.apellido}, ${form.tipoDocumento} ${form.documento} han sido eliminados del sistema`
        );
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push("/home");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setToastMsg(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDeleteConfirm = () => {
    setPopupDeleteConfirm(false);
  };

  // Efecto para el popup "presione cualquier tecla"
  useEffect(() => {
    if (!popupCannotDelete) return;

    const handleKeyDown = () => {
      setPopupCannotDelete(false);
      router.push("/home");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [popupCannotDelete, router]);

  if (isLoading && !form.id) {
    return <div>Cargando datos del huésped...</div>;
  }

  return (
    <div>
      <FormularioModificarHuesped
        huesped={huesped}
        form={form}
        errors={errors}
        onChange={handleChange}
        onChangeDireccion={handleChangeDireccion}
        onBlur={handleBlur}
        onBlurDireccion={handleBlurDireccion}
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
          hideButtons={true}
        />
      )}

      {showToast && <Toast message={toastMsg} isVisible={showToast} type="warning" />}
    </div>
  );
}
