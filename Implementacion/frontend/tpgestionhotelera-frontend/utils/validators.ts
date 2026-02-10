export const validateDocumentNumber = (type: string, value: string): boolean => {
    if (!value) return false;
    const trimmed = value.trim();

    switch(type) {
        case "DNI":
        case "LE":
        case "LC":
            // Opción A: Solo números (7 u 8 dígitos, lo normal en Argentina)
            const soloNumeros = /^\d{7,8}$/.test(trimmed);
            // Opción B: Formato con puntos (ej: 12.345.678 o 1.234.567)
            //const conPuntos = /^\d{1,3}(\.\d{3}){2}$/.test(trimmed);
            
            return soloNumeros;

        case "Pasaporte":
            // Alfanumérico, entre 6 y 15 caracteres (estándar internacional)
            return /^[A-Z0-9]{6,15}$/i.test(trimmed);
        case "Otro":
            // Un rango amplio pero seguro (3 a 20 caracteres)
            return /^[A-Z0-9]{3,20}$/i.test(trimmed);
            
        default:
            return false;
    }
};

/**
 * Valida si un string es un email válido.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};


/**
 * Valida si un valor contiene solo números.
 * Útil para DNI, Teléfono, Número de calle.
 */
export const isNumeric = (value: string): boolean => {
  const regex = /^\d+$/;
  return regex.test(value);
};

/**
 * Valida un rango de fechas.
 * Retorna TRUE si las fechas son válidas y lógica correcta (Inicio <= Fin).
 * Retorna FALSE si hay error o están invertidas.
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return false;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Verificar que sean fechas válidas
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

  // Verificar que la fecha de inicio no sea mayor que la de fin
  if (start > end) return false;

  return true;
};

/**
 * Verifica si una fecha es futura o es hoy (para validar check-in).
 */
export const isFutureOrToday = (dateString: string): boolean => {
  if (!dateString) return false;
  
  // Ajuste de zona horaria simple: tratamos el string como local
  // "2024-10-20" -> new Date("2024-10-20T00:00:00")
  const date = new Date(dateString + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
};

export const isValidCUIT = (value: string): boolean => {
    if (!value) return true; // CUIT no obligatorio, vacío está permitido

    const trimmed = value.trim();

    // Regex para los dos formatos permitidos
    const regexConGuiones = /^\d{2}-\d{8}-\d{1}$/;
    const regexSinGuiones = /^\d{11}$/;

    return regexConGuiones.test(trimmed) || regexSinGuiones.test(trimmed);
};

export const isRequired = (value: string) => !!value.trim();  //para campos obligatorios

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  const trimmed = phone.trim();
  // Acepta un '+' opcional y entre 7 y 15 números
  return /^\+?\d{7,15}$/.test(trimmed); 
};


/**
 * Valida nombres de ubicaciones (País, Provincia, Localidad).
 * Soporta: Letras de cualquier idioma, números, espacios, puntos, 
 * guiones, comas y comillas simples.
 */
/**
 * Valida nombres de ubicaciones (País, Provincia, Localidad).
 * Versión restrictiva: Sin comas ni guiones.
 * Soporta: Letras internacionales, números, espacios, puntos y comillas simples.
 */
export const isValidLocation = (value: string): boolean => {
  if (!value) return false;
  const trimmed = value.trim();

  // \p{L}: Letras de cualquier idioma (Unicode)
  // 0-9: Números (para "Ruta 3", "Calle 14", etc.)
  // \s: Espacios
  // . : Puntos (para "Gral. Roca", "St. Louis")
  // ' : Comilla simple (para "O'Higgins", "L'Hospitalet")
  // La flag 'u' habilita el soporte para \p{L}
  const regex = /^[\p{L}0-9\s.']+$/u;

  return regex.test(trimmed) && trimmed.length >= 2 && trimmed.length <= 50;
};

/**
 * Valida Nombre o Apellido internacional.
 * Acepta: Letras de cualquier idioma (Unicode), espacios y comilla simple.
 */
export const isValidName = (value: string): boolean => {
  if (!value) return false;
  const trimmed = value.trim();
  
  // \p{L}: Cualquier letra en cualquier idioma (incluye tildes, ñ, ç, ß, ø, etc.)
  // \s: Espacios
  // ': Comilla simple para apellidos tipo D'Amico o O'Connor
  // La flag 'u' al final es obligatoria para habilitar Unicode
  const regex = /^[\p{L}\s']+$/u;

  return regex.test(trimmed) && trimmed.length >= 2;
};
/**
 * Valida Código Postal Argentino.
 * Acepta el formato de 4 dígitos (Tradicional) 
 * o el de 8 caracteres (CPA: Letra-4Números-3Letras).
 */
export const isValidPostCode = (value: string): boolean => {
  if (!value) return false;
  const trimmed = value.trim().toUpperCase();

  // Regex para: 4 números O (1 letra + 4 números + 3 letras)
  const regex = /^(\d{4}|[A-Z]\d{4}[A-Z]{3})$/;
  
  return regex.test(trimmed);
};

export const onlyLettersAndNumbers = (value: string): boolean => {
  if (!value) return false;
  const trimmed = value.trim();
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9]+$/;
  return regex.test(trimmed);
};









