# Conexión Frontend-Backend: Modificar y Dar Baja de Huésped (CU10 y CU11)

## Resumen

Se ha implementado la conexión completa entre el frontend (React/Next.js) y backend (Spring Boot) para los casos de uso:
- **CU10: Modificar Huésped**
- **CU11: Dar baja de Huésped**

El módulo incluye soporte para **testing con modo mock** usando datos en `sessionStorage` sin conectar al backend.

---

## Cambios Realizados

### 1. **ModificarHuespedManager.tsx** (Frontend)

**Ruta**: `frontend/tpgestionhotelera-frontend/components/Manager/ModificarHuespedManager.tsx`

#### Cambios principales:

✅ **Actualizada la interfaz `GuestData`** para ser concordante con `HuespedDTO`:
```typescript
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
  email?: string;        // Opcional
  cuit?: string;         // Opcional
}

interface DireccionData {
  pais: string;
  provincia: string;
  ciudad: string;
  codigoPostal: string;
  calle: string;
  numero: number;
  piso?: number;         // Opcional
  departamento?: string; // Opcional
}
```

✅ **Props actualizadas**:
```typescript
interface Props {
  huesped?: GuestData;      // Datos iniciales del huésped
  huespedId?: number;        // ID para cargar desde backend
  useMock?: boolean;         // Flag para modo mock (testing)
}
```

✅ **Endpoints conectados**:
- `GET /api/huespedes/{id}` → Obtener datos del huésped
- `PUT /api/huespedes/actualizar/{id}` → Actualizar huésped
- `DELETE /api/huespedes/baja/{id}` → Eliminar huésped

✅ **Funciones clave implementadas**:

| Función | Descripción |
|---------|------------|
| `loadHuespedFromBackend()` | Carga datos del huésped desde el backend (GET) |
| `loadHuespedFromMock()` | Carga datos del huésped desde sessionStorage (testing) |
| `createHuespedDTO()` | Crea el DTO correcto para enviar al backend |
| `handleSubmit()` | Valida y actualiza el huésped (PUT) |
| `deleteGuest()` | Elimina el huésped (DELETE) |
| `validateForm()` | Valida todos los campos obligatorios |

✅ **Flujos implementados** (según CU10 y CU11):

**Flujo Principal - Modificación:**
1. Cargar datos del huésped (GET)
2. Validar campos obligatorios → Flujo 2.A
3. Verificar documento duplicado → Flujo 2.B
4. Actualizar en backend (PUT)
5. Mostrar éxito y redirigir a /home

**Flujo Alternativo - Documento Duplicado (2.B):**
- Mostrar popup "¡CUIDADO! El tipo y número de documento ya existen"
- Opción 1: "ACEPTAR IGUALMENTE" → Procede con actualización
- Opción 2: "CORREGIR" → Retorna a formulario con foco en documento

**Flujo Eliminación (CU11):**
1. Usuario presiona "BORRAR"
2. Sistema verifica si hay estadías previas
   - Si SÍ: Mostrar popup fijo "No puede ser eliminado"
   - Si NO: Mostrar confirmación antes de eliminar
3. Usuario presiona "ELIMINAR" → DELETE al backend
4. Mostrar mensaje de éxito y redirigir

---

### 2. **page.tsx** (Página de Modificación)

**Ruta**: `app/modificar-huesped/page.tsx`

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import ModificarHuespedManager from "@/components/Manager/ModificarHuespedManager";

export default function ModificarHuespedPage() {
  const searchParams = useSearchParams();
  const huespedId = searchParams.get("id") ? parseInt(searchParams.get("id") as string) : undefined;
  const useMock = searchParams.get("mock") === "true";

  return <ModificarHuespedManager huespedId={huespedId} useMock={useMock} />;
}
```

**Parámetros de URL:**
- `?id=123` → ID del huésped a modificar (carga desde backend)
- `?mock=true` → Usa datos mock en lugar del backend (testing)
- `?id=123&mock=true` → Carga desde mock usando sessionStorage

---

### 3. **Backend - HuespedController.java**

**Ruta**: `gestion-hotelera/src/main/java/com/gestionhotelera/gestion_hotelera/controller/HuespedController.java`

Los siguientes endpoints ya están implementados y son usados:

```java
// GET - Obtener huésped por ID
@GetMapping("/{id}")
public ResponseEntity<?> obtenerHuespedPorId(@PathVariable Long id)

// PUT - Actualizar huésped
@PutMapping("/actualizar/{id}")
public ResponseEntity<?> actualizarHuesped(@PathVariable Long id, @Valid @RequestBody HuespedDTO huespedDTO)

// DELETE - Eliminar huésped
@DeleteMapping("/baja/{id}")
public ResponseEntity<?> eliminarHuesped(@PathVariable Long id)
```

**Consideraciones**:
- ✅ Los DTOs (HuespedDTO, DireccionDTO) son correctos y concordantes
- ✅ El validador rechaza documento duplicado en actualización
- ✅ El eliminador rechaza si el huésped tiene estadías
- ✅ Los campos obligatorios y opcionales están bien configurados

---

## Cómo Usar

### Modo Backend (Producción)

**Navegar para modificar un huésped:**
```
http://localhost:3000/modificar-huesped?id=1
```

El Manager:
1. Carga datos desde `GET /api/huespedes/1`
2. Muestra formulario con datos precargados
3. Al guardar: `PUT /api/huespedes/actualizar/1`
4. Al eliminar: `DELETE /api/huespedes/baja/1`

### Modo Mock (Testing/Desarrollo)

**Navegar para modificar un huésped con datos mock:**
```
http://localhost:3000/modificar-huesped?id=1&mock=true
```

El Manager:
1. Carga datos desde `sessionStorage` (key: `guestData`)
2. Muestra formulario con datos del sessionStorage
3. Al guardar: Actualiza `sessionStorage` (sin llamar al backend)
4. Al eliminar: Elimina de `sessionStorage` (sin llamar al backend)

**Preparar datos mock en sessionStorage:**
```javascript
// En DevTools Console:
const mockGuests = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    tipoDocumento: "DNI",
    documento: "12345678",
    posicionIVA: "Consumidor Final",
    fechaNacimiento: "1990-01-15",
    telefono: "1234567890",
    email: "juan@example.com",
    ocupacion: "Ingeniero",
    nacionalidad: "Argentino",
    cuit: "23-12345678-9",
    direccion: {
      pais: "Argentina",
      provincia: "Buenos Aires",
      ciudad: "La Plata",
      codigoPostal: "1900",
      calle: "Calle Falsa",
      numero: 123,
      piso: 2,
      departamento: "B"
    }
  }
];
sessionStorage.setItem("guestData", JSON.stringify(mockGuests));
```

---

## Validaciones Implementadas

### Al Guardar (Flujo 2.A - Errores de Omisión)

Los siguientes campos son **OBLIGATORIOS**:
- ✔ Apellido
- ✔ Nombre
- ✔ Tipo de documento
- ✔ Número de documento
- ✔ Nacionalidad
- ✔ Fecha de nacimiento
- ✔ País (Dirección)
- ✔ Provincia (Dirección)
- ✔ Ciudad (Dirección)
- ✔ Código postal (Dirección)
- ✔ Calle (Dirección)
- ✔ Número (Dirección)
- ✔ Posición IVA
- ✔ Ocupación
- ✔ Teléfono

Los siguientes campos son **OPCIONALES**:
- ℹ Email
- ℹ CUIT
- ℹ Piso (Dirección)
- ℹ Departamento (Dirección)

### Al Guardar (Flujo 2.B - Documento Duplicado)

Si el huésped ingresa un `tipo + número de documento` que ya existe (en otro huésped), se muestra:
```
¡CUIDADO! El tipo y número de documento ya existen en el sistema
[ACEPTAR IGUALMENTE] [CORREGIR]
```

### Al Eliminar (CU11 - Flujo Alternativo 2.A)

Si el huésped tiene estadías previas:
```
El huésped no puede ser eliminado pues se ha alojado en el Hotel 
en alguna oportunidad. PRESIONE CUALQUIER TECLA PARA CONTINUAR…
```

---

## Flujo de Datos

### 1. Actualizar Huésped

```
Cliente                    Backend
   │                          │
   ├─ GET /api/huespedes/1───>│ Obtener datos
   │<─ HuespedDTO ─────────────┤
   │
   │ [Usuario modifica datos]
   │
   ├─ PUT /actualizar/1 ──────>│ 
   │   (HuespedDTO) ────────────│
   │                            │
   │                    [Validar]
   │              [Verificar doc duplicado]
   │              [Actualizar en BD]
   │
   │<─ Huesped actualizado ────┤
   │
   │ [Toast éxito]
   │ [Redireccionar a /home]
```

**DTO Enviado al Backend:**
```json
{
  "id": 1,
  "nombre": "JUAN",
  "apellido": "PÉREZ",
  "tipoDocumento": "DNI",
  "documento": "12345678",
  "posicionIVA": "Consumidor Final",
  "fechaNacimiento": "1990-01-15",
  "telefono": "1234567890",
  "email": "juan@example.com",
  "ocupacion": "INGENIERO",
  "nacionalidad": "Argentino",
  "cuit": "23-12345678-9",
  "direccion": {
    "pais": "ARGENTINA",
    "provincia": "BUENOS AIRES",
    "ciudad": "LA PLATA",
    "codigoPostal": "1900",
    "calle": "CALLE FALSA",
    "numero": 123,
    "piso": 2,
    "departamento": "B"
  }
}
```

### 2. Eliminar Huésped

```
Cliente                    Backend
   │                          │
   ├─ DELETE /baja/1 ────────>│
   │                           │
   │              [Verificar si tiene estadías]
   │
   │<─ "Eliminado correctamente" (200)
   │     o
   │<─ "No puede ser eliminado" (400)
   │
   │ [Toast con resultado]
   │ [Redireccionar a /home]
```

---

## Stack Tecnológico

### Frontend
- **React 18** con **Next.js 13+**
- **TypeScript** para type safety
- **Fetch API** para comunicación HTTP
- **sessionStorage** para datos mock

### Backend  
- **Spring Boot 3.x**
- **Spring Data JPA** para persistencia
- **Validación Bean** (@NotBlank, @NotNull, etc.)
- **CORS** habilitado para `localhost:3000`

### Base de Datos
- **H2** (desarrollo) o **MySQL** (producción)
- Tablas: `huesped`, `direccion`, `estadia`

---

## Pruebas Recomendadas

### Test 1: Modificación Simple con Backend
```
1. URL: http://localhost:3000/modificar-huesped?id=1
2. Cambiar un campo (ej: nombre)
3. Presionar "Siguiente"
4. Verificar cambio en BD (Postman o NavCat)
```

### Test 2: Validación de Campos Obligatorios
```
1. URL: http://localhost:3000/modificar-huesped?id=1
2. Limpiar un campo obligatorio (ej: apellido)
3. Presionar "Siguiente"
4. Verificar error en rojo bajo el campo
5. Completar nuevamente el campo
6. Error debe desaparecer
```

### Test 3: Documento Duplicado
```
1. URL: http://localhost:3000/modificar-huesped?id=1
2. Cambiar tipo+documento a un documento que existe en otro huésped
3. Presionar "Siguiente"
4. Popup: "¡CUIDADO! El tipo y número de documento ya existen..."
5. Presionar "CORREGIR"
6. Foco debe estar en el campo de tipo documento
```

### Test 4: Eliminación sin Estadías
```
1. URL: http://localhost:3000/modificar-huesped?id=1 (usar huésped sin estadías)
2. Presionar "BORRAR"
3. Popup: "¿Desea borrar al huésped?"
4. Presionar "Si"
5. Popup: "Los datos del huésped [nombre] [apellido]..."
6. Presionar "ELIMINAR"
7. Toast de éxito
8. Redireccionar a /home
```

### Test 5: Eliminación con Estadías (Mock)
```
1. URL: http://localhost:3000/modificar-huesped?id=1&mock=true
2. Presionar "BORRAR"
3. Popup: "¿Desea borrar al huésped?"
4. Presionar "Si"
5. Debería mostrar: "El huésped no puede ser eliminado..."
   (Nota: En mock siempre podemos eliminar, en backend se valida)
```

### Test 6: Modo Mock Completo
```
1. Preparar datos mock en sessionStorage (ver sección anterior)
2. URL: http://localhost:3000/modificar-huesped?id=1&mock=true
3. Modificar datos
4. Presionar "Siguiente"
5. Verificar que se guarda en sessionStorage (DevTools)
6. Recargar página: datos deben persistir del sessionStorage
```

---

## Notas Importantes

### ⚠️ Transformación de Datos

El Manager automáticamente convierte a **MAYÚSCULAS** los campos de texto:
- Nombre, Apellido, Ocupación
- País, Provincia, Ciudad, Calle, Departamento

Esto cumple con el requisito especial: *"No importando el estado de la tecla <bloq mayús>, el ingreso de datos literales será SIEMPRE en mayúsculas"*

### 🔒 Seguridad

- **CORS**: Habilitado solo para `http://localhost:3000`
- **Validación**: Los DTOs tienen validaciones Backend con @NotBlank, @Email, etc.
- **Autenticación**: No implementada (por especificar en Security)

### 📡 API Base URL

```typescript
const API_BASE_URL = "http://localhost:8080/api/huespedes";
```

**Cambiar si el backend está en otro puerto:**
```typescript
const API_BASE_URL = "http://tuhost:tu-puerto/api/huespedes";
```

---

## Troubleshooting

### Error: "No se pudo cargar los datos del huésped"
- ✔ Verificar que el backend está corriendo en `localhost:8080`
- ✔ Verificar que el huésped existe (ID correcto)
- ✔ Revisar la consola del browser (F12 → Network)

### Error: "Error al actualizar el huésped"
- ✔ Verificar validaciones en los DTOs
- ✔ Verificar que el huésped existe
- ✔ Revisar respuesta del servidor (Postman)

### Datos no se guardan
- ✔ En backend: Verificar que la BD está acesible
- ✔ En mock: Verificar que `useMock=true` está en URL
- ✔ Revisar consola del navegador

---

## Próximos Pasos Sugeridos

1. **Integración con Buscar Huésped**: Modificar `BuscarHuespedManager` para navegar correctamente a `/modificar-huesped?id=X`
2. **Autenticación**: Agregar JWT o sesión para verificar que solo el Conserje accede
3. **Auditoría**: Registrar quién modificó/eliminó cada huésped y cuándo
4. **Confirmación de Cambios**: Mostrar qué cambió exactamente antes de confirmación final
5. **Historial**: Permitir ver cambios históricos del huésped
