"use client";

import { useState } from "react";
import styles from "./formulario.module.css";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import ListadoHuesped from "@/components/Listados/ListadoHuesped"; 
import {
  isValidName,
  isRequired,
  isValidPhone,
  validateDocumentNumber
} from "@/utils/validators"; // ajustá la ruta según dónde tengas tus validators


interface WizardData {
  startDate: string;
  endDate: string;
  rooms: string[]; 
}

interface Props {
  data: WizardData; 
  onBack: () => void;
  onSuccess: () => void; 
}

export default function FormularioEncargado({ data, onBack, onSuccess }: Props) {
  
  const [formData, setFormData] = useState({
    apellido: "",
    nombre: "",
    telefono: "",
  });
  const [clienteId, setClienteId] = useState<number | null>(null);

  const [searchParams, setSearchParams] = useState({
    apellido: "",
    nombre: "",
    tipoDocumento: "",
    documento: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [resultados, setResultados] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Estado para errores por campo
const [fieldErrors, setFieldErrors] = useState({
  apellido: "",
  nombre: "",
  telefono: ""
});


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Si editan a mano, quitamos el vínculo para evitar inconsistencias
    if (name === "nombre" || name === "apellido") {
        setClienteId(null);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); 
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // --- LÓGICA DE BÚSQUEDA CORREGIDA (Permite vacíos) ---
const buscarHuespedes = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  const { apellido, nombre, documento, tipoDocumento } = searchParams;

  // Validación condicional: si el usuario pone algo, validamos formato
  if (apellido && !isValidName(apellido)) {
    setSearchError("Apellido inválido: unicamente caracteres y espacios");
    return;
  }
  if (nombre && !isValidName(nombre)) {
    setSearchError("Nombre inválido: unicamente caracteres y espacios");
    return;
  }
  if (documento && !validateDocumentNumber(tipoDocumento, documento)) {
    setSearchError("Documento inválido para el tipo seleccionado. DNI, LE, LC: solo dígitos, Pasaporte/Otro: alfanumérico (todos sin puntos).");
    return;
  }

  setSearching(true);
  setSearchError("");
  setResultados([]); 

  try {
    const base = process.env.NEXT_PUBLIC_API_BASE || "";
    const queryParams = new URLSearchParams();
    if (apellido) queryParams.append("apellido", apellido);
    if (nombre) queryParams.append("nombre", nombre);
    if (tipoDocumento) queryParams.append("tipoDocumento", tipoDocumento);
    if (documento) queryParams.append("documento", documento);

    const res = await fetch(`${base}/api/huespedes/buscar?${queryParams.toString()}`);
    if (!res.ok) throw new Error("Error en la búsqueda");

    const data = await res.json();
    const encontrados = data.existe ? data.resultados : [];
    
    setResultados(encontrados);
    setShowModal(true); 
  } catch (err) {
    console.error(err);
    setSearchError("Error de conexión al buscar.");
  } finally {
    setSearching(false);
  }
};

  const handleSeleccionCompleta = (huespedes: any[]) => {
    if (huespedes && huespedes.length > 0) {
        const huesped = huespedes[0];

        setFormData({
            nombre: huesped.nombre,
            apellido: huesped.apellido,
            telefono: huesped.telefono || "" 
        });

        // Guardamos el ID en memoria (Estado temporal).
        // La relación REAL en base de datos se crea recién en handleSubmit.
        setClienteId(huesped.id);
        
        setShowModal(false);
        setSearchError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const newErrors: typeof fieldErrors = { apellido: "", nombre: "", telefono: "" };
  let hasError = false;

  if (!isRequired(formData.apellido) || !isValidName(formData.apellido)) {
    newErrors.apellido = "Apellido inválido, se admiten unicamente caracteres y espacios";
    hasError = true;
  }

  if (!isRequired(formData.nombre) || !isValidName(formData.nombre)) {
    newErrors.nombre = "Nombre inválido, se admiten unicamente caracteres y espacios";
    hasError = true;
  }

  if (!isRequired(formData.telefono) || !isValidPhone(formData.telefono)) {
    newErrors.telefono = "Teléfono inválido, ejemplo valido: +541112345678 o 541112345678";
    hasError = true;
  }

  setFieldErrors(newErrors);

  if (hasError) return;

  setLoading(true);

  // --- Validación de fechas ---
  const desde = new Date(data.startDate);
  const hasta = new Date(data.endDate);

 // Normalizamos horas para evitar errores con la hora
    desde.setHours(0,0,0,0);
    hasta.setHours(0,0,0,0);

    if (desde >= hasta) {
          setError("La fecha de inicio debe ser anterior a la fecha de fin.");
          setLoading(false);   // nos aseguramos de que loading no quede en true
  return;              // <-- cortamos la ejecución antes de hacer fetch
}

  setLoading(true);

  try {
    const payload = {
      habitacionIds: data.rooms.map((r) => Number(r)), 
      fechaDesde: data.startDate,
      fechaHasta: data.endDate,
      nombre: formData.nombre.toUpperCase(),
      apellido: formData.apellido.toUpperCase(),
      telefono: formData.telefono,
      clienteId: clienteId 
    };

    const base = process.env.NEXT_PUBLIC_API_BASE || "";
    const url = `${base}/api/reservas/confirmar`; 

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      let msg = `Error ${response.status}`;
      try { msg = JSON.parse(text).message || msg } catch {}
      throw new Error(msg);
    }

    setShowToast(true); 
    setTimeout(() => { onSuccess(); }, 2000);
  } catch (err: any) {
    console.error("Error:", err);
    setError(err.message || "Error al procesar reserva.");
    setLoading(false); 
  }
};

  return (
    <div className={styles["form-wrapper"]}>
      <Toast message="¡Reserva exitosa!" isVisible={showToast} type={"success"} />

      <div className={styles["form-header"]}>
        <Button className={styles["btn-back"]} onClick={onBack}>Volver</Button>
        <h2 className={styles["form-title"]}>Datos del Responsable</h2>
      </div>

      <div className={styles["form-container"]}>
        
        <div className={styles["search-section"]}>
            <div className={styles["search-header-row"]}>
                <p className={styles["search-label"]}>Buscar cliente existente para autocompletar:</p>
                {clienteId && (
                    <div className={styles["linked-badge"]}>
                        ✓ Seleccionado (ID: {clienteId})
                    </div>
                )}
            </div>

            <div className={styles["search-grid"]}>
                <div className={styles["search-field"]}>
                    <label>Apellido</label>
                    <input 
                        name="apellido"
                        value={searchParams.apellido}
                        onChange={handleSearchChange}
                        className={styles["search-input"]}
                        onKeyDown={(e) => e.key === 'Enter' && buscarHuespedes(e)}
                    />
                </div>

                <div className={styles["search-field"]}>
                    <label>Nombre</label>
                    <input 
                        name="nombre"
                        value={searchParams.nombre}
                        onChange={handleSearchChange}
                        className={styles["search-input"]}
                        onKeyDown={(e) => e.key === 'Enter' && buscarHuespedes(e)}
                    />
                </div>

                <div className={styles["search-field"]}>
                    <label>Tipo Doc</label>
                    <select 
                        name="tipoDocumento"
                        value={searchParams.tipoDocumento}
                        onChange={handleSearchChange}
                        className={styles["search-input"]}
                    >
                        <option className={styles["search-input"]} value="DNI">DNI</option>
                        <option className={styles["search-input"]} value="Pasaporte">Pasaporte</option>
                        <option className={styles["search-input"]} value="LC">LC</option>
                        <option className={styles["search-input"]} value="LE">LE</option>
                        <option className={styles["search-input"]} value="Otro">Otro</option>
                    </select>
                </div>

                <div className={styles["search-field"]}>
                    <label>Documento</label>
                    <input 
                        name="documento"
                        value={searchParams.documento}
                        onChange={handleSearchChange}
                        className={styles["search-input"]}
                        onKeyDown={(e) => e.key === 'Enter' && buscarHuespedes(e)}
                    />
                </div>
            </div>

            <div className={styles["search-actions"]}>
                <button 
                    type="button" 
                    className={styles["btn-search"]} 
                    onClick={(e) => buscarHuespedes(e)}
                    disabled={searching}
                >
                    {searching ? "Buscando..." : "Buscar Cliente"}
                </button>
            </div>
            
            {searchError && <span className={styles["search-error"]}>{searchError}</span>}
        </div>
        
        <hr className={styles["divider"]} />

        {error && <div className={styles["error-banner"]} style={{color: 'red', marginBottom: '15px'}}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <div className={styles["form-inputs"]}>

              <div className={styles["input-field"]}>
                <label className={styles["field-label"]}>Apellido <span className={styles["required"]}>(*)</span></label>
                <input 
                className={styles["form-input"]} 
                type="text" 
                name="apellido" 
                value={formData.apellido} 
                onChange={handleInputChange} 
                />

                {fieldErrors.apellido && (
                  <span className={styles["field-error"]} style={{ color: 'red', fontSize: '0.8rem' }}>
                  {fieldErrors.apellido}
                  </span> )}

              </div>


              <div className={styles["input-field"]}>
                <label className={styles["field-label"]}>Nombre <span className={styles["required"]}>(*)</span></label>
                <input 
                className={styles["form-input"]} 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleInputChange} />
  
                {fieldErrors.nombre && (
                <span className={styles["field-error"]} style={{ color: 'red', fontSize: '0.8rem' }}>
                {fieldErrors.nombre}
                </span> )}


              </div>
              <div className={styles["input-field"]}>
                <label className={styles["field-label"]}>Teléfono <span className={styles["required"]}>(*)</span></label>
                <input 
                className={styles["form-input"]} 
                type="tel" 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleInputChange} />

                {fieldErrors.telefono && (
                <span className={styles["field-error"]} style={{ color: 'red', fontSize: '0.8rem' }}>
                {fieldErrors.telefono}
                </span>)}


              </div>
            </div>
          </div>

          <div className={styles["button-container"]}>       
            <Button type="submit" className={styles["btn-accept"]} disabled={loading || showToast}>
              {loading ? "Procesando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </form>
      </div>

      <button className={styles["btn-cancel"]} onClick={onBack}>Cancelar</button>

      {showModal && (
        <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
                <ListadoHuesped 
                    mode="reservar"
                    results={resultados}
                    onRetry={() => setShowModal(false)}
                    onSelectionComplete={handleSeleccionCompleta}
                />
            </div>
        </div>
      )}

    </div>
  );
}