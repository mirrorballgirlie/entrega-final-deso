# QuickStart - Prueba de Modificar Huésped

**Última actualización:** 13 Feb 2026  
**Versión:** 1.0  
**Estado:** ✅ Listo para Testing

---

## ⚡ Prueba Rápida en 5 Minutos

### Prerequisites
- Backend corriendo: `localhost:8080`
- Frontend corriendo: `localhost:3000`
- Mínimo 1 huésped en BD

### Test 1: Cargar un huésped existente

```
1. Browser: http://localhost:3000/modificar-huesped?id=1
2. Espera que cargue (2 segundos)
3. Deberías ver formulario con datos del huésped 1
✅ ÉXITO: Datos cargados correctamente
```

### Test 2: Modificar y guardar

```
1. Cambiar nombre: "JUAN" → "JORGE"
2. Presionar "Siguiente"
3. Toast: "La operación ha culminado con éxito"
4. Redirecciona a /home
✅ ÉXITO: Modificación guardada
```

### Test 3: Validación de campos

```
1. Limpiar campo "Apellido"
2. Presionar "Siguiente"
3. Error en rojo: "Apellido obligatorio"
4. Escribir apellido nuevamente
5. Error desaparece automáticamente
✅ ÉXITO: Validación funciona
```

### Test 4: Documento duplicado

```
1. Cambiar documento a uno que existe en otro huésped
2. Presionar "Siguiente"
3. Popup: "¡CUIDADO! El tipo y número de documento ya existen..."
4. Presionar "CORREGIR"
5. Foco en campo documento
✅ ÉXITO: Detección de duplicado funciona
```

### Test 5: Modo Mock (sin backend)

```
1. DevTools Console (F12):
   sessionStorage.setItem("guestData", JSON.stringify([
     { id: 1, nombre: "JUAN", apellido: "PÉREZ", 
       tipoDocumento: "DNI", documento: "12345678",
       nacionalidad: "Argentino", fechaNacimiento: "1990-01-15",
       posicionIVA: "Consumidor Final", ocupacion: "Ingeniero",
       telefono: "1234567890", email: "", cuit: "",
       direccion: {
         pais: "ARGENTINA", provincia: "Buenos Aires",
         ciudad: "La Plata", codigoPostal: "1900",
         calle: "Calle Falsa", numero: 123
       }
     }
   ]));

2. Browser: http://localhost:3000/modificar-huesped?id=1&mock=true
3. Formulario carga (instantáneamente)
4. Modificar campo
5. Presionar "Siguiente"
6. Toast de éxito
7. Recargar página: datos persisten
✅ ÉXITO: Mock funciona correctamente
```

---

## 📋 Archivos Clave

### Frontend
```
frontend/tpgestionhotelera-frontend/
├── components/Manager/ModificarHuespedManager.tsx     ← Principal
├── app/modificar-huesped/page.tsx                      ← Entry point
└── components/Formularios/FormularioModificarHuesped/  ← Presentación
```

### Backend
```
gestion-hotelera/src/main/java/com/gestionhotelera/.../
├── controller/HuespedController.java                   ← API REST
├── gestores/GestorHuesped.java                         ← Lógica
└── dto/{HuespedDTO, DireccionDTO}.java                ← DTOs
```

---

## 🔧 Endpoints

```
GET    /api/huespedes/1                           Cargar datos
PUT    /api/huespedes/actualizar/1                Actualizar
DELETE /api/huespedes/baja/1                      Eliminar
```

**Base URL:** `http://localhost:8080/api/huespedes`

---

## 🎯 Casos de Uso Implementados

| CU | Nombre | Flujos | Estado |
|----|--------|--------|--------|
| 10 | Modificar Huésped | Principal, 2.A, 2.B, 2.C | ✅ |
| 11 | Dar baja de Huésped | Principal, 2.A | ✅ |

### CU10: Modificar Huésped
- ✅ Flujo Principal: Modificación correcta
- ✅ Flujo 2.A: Validación de omisiones
- ✅ Flujo 2.B: Detección de documento duplicado
- ✅ Flujo 2.C: Cancelación con confirmación

### CU11: Dar baja de Huésped
- ✅ Flujo Principal: Eliminación sin estadías
- ✅ Flujo Alternativo 2.A: Rechazo si tiene estadías

---

## 💾 Modos de Operación

### Modo Backend (Producción)
```
?id=123
├─ GET /api/huespedes/123
├─ PUT /api/huespedes/actualizar/123
└─ DELETE /api/huespedes/baja/123
```

### Modo Mock (Testing/Development)
```
?id=123&mock=true
├─ sessionStorage.getItem("guestData")
├─ sessionStorage.setItem("guestData", ...)
└─ Sin llamadas al servidor
```

---

## 📊 Validaciones

### Obligatorios (14)
```
Apellido, Nombre, Tipo Doc, Documento, Nacionalidad,
Fecha Nacimiento, País, Provincia, Ciudad, 
Código Postal, Calle, Número, Posición IVA, Ocupación, Teléfono
```

### Opcionales (4)
```
Email, CUIT, Piso, Departamento
```

### Especiales
```
✓ Documento duplicado → Popup
✓ Texto → MAYÚSCULAS automático
✓ Estadías → No eliminar
```

---

## 🚀 Quick Commands

```bash
# Backend
cd gestion-hotelera && mvn spring-boot:run

# Frontend
cd frontend/tpgestionhotelera-frontend && npm run dev

# Test Backend con curl
curl -X GET http://localhost:8080/api/huespedes/1

# Ver estado
curl -X GET http://localhost:8080/actuator/health
```

---

## ❌ Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| "No se pudo cargar" | Backend no corre: `mvn spring-boot:run` |
| Import Frontend fail | `npm install` en carpeta frontend |
| Error 404 huésped | Verificar ID existe en BD |
| CORS error | Revisa @CrossOrigin en HuespedController |
| Mock no funciona | Copiar datos hacia sessionStorage (ver Test 5) |
| Toast no aparece | Esperar 2 segundos después de guardar |

---

## 📱 Screenshots Esperados

### Al Cargar
```
┌─────────────────────────────────────┐
│         Modificar Huésped           │
├─────────────────────────────────────┤
│ Datos Personales                    │
│  Apellido: [Precargado ]            │
│  Nombre: [Precargado ]              │
│  ...                                │
│                                     │
│  [Siguiente] [Cancelar] [Borrar]    │
└─────────────────────────────────────┘
```

### Con Errores
```
┌─────────────────────────────────────┐
│         Modificar Huésped           │
├─────────────────────────────────────┤
│ Datos Personales                    │
│  Apellido: [  ]                     │
│           ╔════════════════════════╗│
│           ║ Apellido obligatorio   ║│
│           ╚════════════════════════╝│
│  ...                                │
│                                     │
│  [Siguiente] [Cancelar] [Borrar]    │
└─────────────────────────────────────┘
```

### Popup Documento Duplicado
```
┌──────────────────────────────────────┐
│ ¡CUIDADO!                            │
│ El tipo y número de documento ya    │
│ existen en el sistema                │
│                                      │
│    [ACEPTAR IGUALMENTE] [CORREGIR]   │
└──────────────────────────────────────┘
```

---

## 📖 Documentación Completa

Para más detalles, ver:

1. **CONEXION_MODIFICAR_HUESPED.md**
   - Explicación técnica completa
   - DTOs y tipos de datos
   - Todos los flujos detallados

2. **TESTING_MODIFICAR_HUESPED.md**
   - Pasos exactos para testear
   - Ejemplos JSON
   - Casos de error

3. **ARQUITECTURA_MODIFICAR_HUESPED.md**
   - Diagramas de flujo
   - Estado management
   - Integración con otros componentes

4. **RESUMEN_EJECUTIVO_MODIFICAR_HUESPED.md**
   - Descripción general
   - Cambios realizados
   - Checklist de verificación

---

## ✅ Verificación Final

```
□ Backend en localhost:8080
□ Frontend en localhost:3000
□ Datos en BD
□ GET /api/huespedes/1 retorna 200
□ Página carga: ?id=1
□ Modificación guarda correctamente
□ Delete funciona
□ Mock mode funciona: ?id=1&mock=true
□ Validaciones funcionan
□ Errores en rojo
□ Toast aparece
□ Redirige a /home

¡Si todos están ✅, está LISTO!
```

---

## 🎓 Siguiente Paso

**Una vez verificado:**
1. Integrar con `BuscarHuespedManager`
2. Agregar navegación desde home
3. Implementar seguridad/autenticación
4. Testing end-to-end completo

**Contacto:** Ver CONEXION_MODIFICAR_HUESPED.md para soporte

