# Guía de Testing - Modificar y Dar Baja de Huésped

## 1. Verificaciones Previas

Antes de empezar las pruebas, asegurate de:

### ✅ Backend
```bash
# Verificar que el backend está corriendo
# Puerto: 8080
# Iniciar desde: gestion-hotelera/
mvn spring-boot:run

# O compilar y ejecutar el JAR
mvn clean package
java -jar target/gestion-hotelera-*.jar
```

### ✅ Frontend
```bash
# Verificar que el frontend está corriendo
# Puerto: 3000
# Iniciar desde: frontend/tpgestionhotelera-frontend/
npm run dev
```

### ✅ Base de Datos
- Verificar que H2 está activo u otra BD configurada
- Tablas creadas: `huesped`, `direccion`, `estadia`

---

## 2. Testing con Postman (Backend Directo)

### 2.1 Obtener Huésped (GET)

**Request:**
```
GET http://localhost:8080/api/huespedes/1
```

**Response esperada (200):**
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

**Response esperada (404):**
```json
{
  // Empty - 404 Not Found
}
```

---

### 2.2 Actualizar Huésped (PUT)

**Request:**
```
PUT http://localhost:8080/api/huespedes/actualizar/1
Content-Type: application/json

{
  "id": 1,
  "nombre": "MARCELO",
  "apellido": "GONZALEZ",
  "tipoDocumento": "DNI",
  "documento": "12345678",
  "posicionIVA": "Monotributista",
  "fechaNacimiento": "1990-01-15",
  "telefono": "9876543210",
  "email": "marcelo@example.com",
  "ocupacion": "ARQUITECTO",
  "nacionalidad": "Argentino",
  "cuit": null,
  "direccion": {
    "pais": "ARGENTINA",
    "provincia": "CÓRDOBA",
    "ciudad": "CÓRDOBA",
    "codigoPostal": "5000",
    "calle": "AVENIDA COLÓN",
    "numero": 500,
    "piso": null,
    "departamento": null
  }
}
```

**Response esperada (200):**
```json
{
  "id": 1,
  "nombre": "MARCELO",
  "apellido": "GONZALEZ",
  // ... (datos actualizados)
}
```

**Response Error - Documento Duplicado (400):**
```json
{
  "error": "El tipo y número de documento ya existe en el sistema."
}
```

**Response Error - Huésped no existe (404):**
```json
// Empty 404
```

**Response Error - Validación (400):**
```json
{
  "status": 400,
  "errores": [
    {
      "campo": "nombre",
      "mensaje": "El nombre no puede estar vacío"
    },
    {
      "campo": "apellido",
      "mensaje": "El apellido no puede estar vacío"
    }
  ]
}
```

---

### 2.3 Eliminar Huésped (DELETE)

**Request (Sin Estadías):**
```
DELETE http://localhost:8080/api/huespedes/baja/1
```

**Response esperada (200):**
```json
"Los datos del huésped han sido eliminados del sistema."
```

**Request (Con Estadías):**
```
DELETE http://localhost:8080/api/huespedes/baja/1
```

**Response Error (400):**
```json
{
  "error": "No se puede eliminar el huésped porque posee estadías asociadas."
}
```

**Response Error - No existe (404):**
```json
// Empty 404
```

---

## 3. Testing con Frontend (Browser)

### 3.1 Test: Modificación Simple

**Objetivo:** Modificar un huésped y guardarlo exitosamente

**Pasos:**

1. Navegar a:
   ```
   http://localhost:3000/modificar-huesped?id=1
   ```

2. Esperar a que cargue (debería ver "Cargando datos del huésped..." brevemente)

3. Una vez cargados, cambiar un campo:
   - Ej: Cambiar nombre de "JUAN" a "JORGE"

4. Presionar botón "Siguiente"

5. Esperar toast de éxito:
   ```
   "La operación ha culminado con éxito"
   ```

6. Debería redirigir a `/home`

**Verificación:**
- En Postman: GET /api/huespedes/1 debería mostrar nombre "JORGE"
- En BD: Ver tabla `huesped` y verificar cambio

---

### 3.2 Test: Validación de Campos Obligatorios

**Objetivo:** Verificar que el sistema rechace campos vacíos

**Pasos:**

1. Navegar a:
   ```
   http://localhost:3000/modificar-huesped?id=1
   ```

2. Limpiar el campo "Apellido"

3. Presionar "Siguiente"

4. Debería aparecer error en rojo debajo del campo:
   ```
   "Apellido obligatorio"
   ```

5. Debería estar visible el resto del formulario (no tapado)

6. Escribir un apellido nuevamente en "Apellido"

7. El error debería desaparecer automáticamente

8. Presionar "Siguiente" nuevamente

9. Debería guardarse exitosamente

**Verificación:**
- Los errores deben mostrarse en tiempo real conforme se completan los campos
- No debe permitir guardar con campos vacíos

---

### 3.3 Test: Documento Duplicado (Flujo Alternativo 2.B)

**Objetivo:** Verificar manejo de documento duplicado

**Prerequisites:**
- Tener 2 huéspedes en la BD:
  - Huésped 1: DNI 11111111
  - Huésped 2: DNI 22222222

**Pasos:**

1. Navegar a:
   ```
   http://localhost:3000/modificar-huesped?id=2
   ```

2. Cambiar documento a "11111111" (número del otro huésped)

3. Presionar "Siguiente"

4. Debe aparecer popup:
   ```
   "¡CUIDADO! El tipo y número de documento ya existen en el sistema"
   [ACEPTAR IGUALMENTE] [CORREGIR]
   ```

5. **Opción A:** Presionar "CORREGIR"
   - Popup cierra
   - Foco aparece en campo "Tipo de Documento"
   - Campo tiene estilo de error (borde rojo)

6. **Opción B:** Presionar "ACEPTAR IGUALMENTE"
   - Popup cierra
   - Sistema actualiza igual
   - Toast de éxito
   - Redirecciona a /home

**Verificación:**
- En Postman: GET /api/huespedes/2 debería mostrar documento actualizado si eligió "ACEPTAR IGUALMENTE"

---

### 3.4 Test: Cancelar Modificación (Flujo Alternativo 2.C)

**Objetivo:** Verificar que cancel revierte cambios

**Pasos:**

1. Navegar a:
   ```
   http://localhost:3000/modificar-huesped?id=1
   ```

2. Cambiar varios campos (ej: nombre, apellido, ciudad)

3. Presionar botón "Cancelar"

4. Debe aparecer popup:
   ```
   "¿Desea cancelar la modificación del huésped?"
   [Si] [No]
   ```

5. **Opción A:** Presionar "No"
   - Popup cierra
   - Los cambios permanecen en el formulario
   - Se puede continuar editando

6. **Opción B:** Presionar "Si"
   - Popup cierra
   - Redirecciona a `/home`
   - Los cambios NO se guardan

**Verificación:**
- En Postman: GET /api/huespedes/1 debería mostrar datos originales (sin cambios)

---

### 3.5 Test: Eliminación sin Estadías (CU11 - Flujo Principal)

**Objective:** Verificar eliminación exitosa

**Prerequisites:**
- Usar un huésped que NO tiene estadías asociadas

**Pasos:**

1. Navegar a:
   ```
   http://localhost:3000/modificar-huesped?id=1
   ```

2. Presionar botón "BORRAR" (en rojo)

3. Debe aparecer popup:
   ```
   "¿Desea borrar al huésped?"
   [Si] [No]
   ```

4. Presionar "Si"

5. Debe aparecer segundo popup:
   ```
   "Los datos del huésped JUAN PÉREZ, DNI 12345678 serán eliminados del sistema"
   [ELIMINAR] [CANCELAR]
   ```

6. Presionar "ELIMINAR"

7. Debe aparecer toast:
   ```
   "Los datos del huésped JUAN PÉREZ, DNI 12345678 han sido eliminados del sistema"
   ```

8. Redirecciona a `/home`

**Verificación:**
- En Postman: GET /api/huespedes/1 debería devolver 404
- En BD: Fila debería estar eliminada de tabla `huesped`

---

### 3.6 Test: Eliminación con Estadías (CU11 - Flujo Alternativo 2.A)

**Objetivo:** Verificar que NO se puede eliminar si hay estadías

**Prerequisites:**
- Usar un huésped que TIENE estadías asociadas
- Insertar una estadia para el huésped:
  ```sql
  INSERT INTO estadia (huesped_id, ...) VALUES (X, ...);
  ```

**Pasos:**

1. Navegar a:
   ```
   http://localhost:3000/modificar-huesped?id=1
   ```

2. Presionar botón "BORRAR"

3. Debe aparecer popup:
   ```
   "¿Desea borrar al huésped?"
   [Si] [No]
   ```

4. Presionar "Si"

5. Debe aparecer popup FIJO (sin botones):
   ```
   "El huésped no puede ser eliminado pues se ha alojado 
    en el Hotel en alguna oportunidad. 
    PRESIONE CUALQUIER TECLA PARA CONTINUAR…"
   ```

6. Presionar cualquier tecla

7. Popup cierra y redirecciona a `/home`

**Verificación:**
- En Postman: GET /api/huespedes/1 debería devolver 200 (sigue existiendo)
- El huésped NO fue eliminado

---

### 3.7 Test: Modo Mock (Testing sin Backend)

**Objetivo:** Verificar que el sistema funciona sin backend usando mock

**Setup:**
1. Abrir DevTools (F12)
2. Ir a Console
3. Ejecutar:

```javascript
const mockGuests = [
  {
    id: 1,
    nombre: "JUAN",
    apellido: "PÉREZ",
    tipoDocumento: "DNI",
    documento: "12345678",
    posicionIVA: "Consumidor Final",
    fechaNacimiento: "1990-01-15",
    telefono: "1234567890",
    email: "juan@example.com",
    ocupacion: "INGENIERO",
    nacionalidad: "Argentino",
    cuit: "23-12345678-9",
    direccion: {
      pais: "ARGENTINA",
      provincia: "BUENOS AIRES",
      ciudad: "LA PLATA",
      codigoPostal: "1900",
      calle: "CALLE FALSA",
      numero: 123,
      piso: 2,
      departamento: "B"
    }
  },
  {
    id: 2,
    nombre: "MARIA",
    apellido: "GARCÍA",
    tipoDocumento: "DNI",
    documento: "87654321",
    posicionIVA: "Responsable Inscripto",
    fechaNacimiento: "1985-05-20",
    telefono: "9876543210",
    email: "maria@example.com",
    ocupacion: "ABOGADA",
    nacionalidad: "Argentina",
    cuit: "27-87654321-5",
    direccion: {
      pais: "ARGENTINA",
      provincia: "CÓRDOBA",
      ciudad: "CÓRDOBA",
      codigoPostal: "5000",
      calle: "AVENIDA COLÓN",
      numero: 500
    }
  }
];
sessionStorage.setItem("guestData", JSON.stringify(mockGuests));
```

**Pasos - Modificación:**

1. Navegar a:
   ```
   http://localhost:3000/modificar-huesped?id=1&mock=true
   ```

2. Debería cargar desde sessionStorage (instantáneamente)

3. Cambiar un campo (ej: nombre)

4. Presionar "Siguiente"

5. Debería guardar y redirigir

6. Recargar la página:
   ```
   http://localhost:3000/modificar-huesped?id=1&mock=true
   ```

7. **Verificación:** El cambio debería persistir (guardó en sessionStorage)

**Pasos - Eliminación:**

1. Navegar a:
   ```
   http://localhost:3000/modificar-huesped?id=2&mock=true
   ```

2. Presionar "BORRAR"

3. Confirmar eliminación

4. Debería redirigir a /home

5. Navegar a:
   ```
   http://localhost:3000/modificar-huesped?id=2&mock=true
   ```

6. **Verificación:** Mensaje de error "Huésped no encontrado en datos mock"

---

### 3.8 Test: Transformación a MAYÚSCULAS

**Objetivo:** Verificar que texto se convierte a mayúsculas

**Pasos:**

1. Navegar a:
   ```
   http://localhost:3000/modificar-huesped?id=1
   ```

2. En campos de texto, escribir en minúsculas:
   - Nombre: "jorge" → debería guardarse "JORGE"
   - Calle: "calle falsa" → debería guardarse "CALLE FALSA"
   - Ocupación: "ingeniero" → debería guardarse "INGENIERO"

3. Presionar "Siguiente"

4. Toast de éxito

5. Verificación en Postman:
   ```
   GET /api/huespedes/1
   
   nombre: "JORGE"  ✓
   direccion.calle: "CALLE FALSA"  ✓
   ocupacion: "INGENIERO"  ✓
   ```

---

## 4. Casos de Error

### 4.1 Backend no disponible
**Esperado:** Toast de error
```
Error: No se pudo cargar los datos del huésped
```

### 4.2 Huésped no existe (ID inválido)
**Esperado:** Toast de error
```
Error: No se pudo cargar los datos del huésped
```

### 4.3 Validación fallida (campos vacíos)
**Esperado:** Errores en rojo bajo los campos

### 4.4 Conexión perdida durante submit
**Esperado:** Toast de error genérico
```
Error: Error desconocido
```

---

## 5. Checklist Final

- [ ] Backend corriendo en localhost:8080
- [ ] Frontend corriendo en localhost:3000
- [ ] BD accesible con datos de prueba
- [ ] GET /api/huespedes/{id} funciona
- [ ] PUT /actualizar/{id} funciona
- [ ] DELETE /baja/{id} funciona
- [ ] Validaciones muestran errores correctos
- [ ] Documento duplicado detecta y maneja correctamente
- [ ] Eliminación sin estadías funciona
- [ ] Eliminación con estadías es rechazada
- [ ] Cancelación revierte cambios
- [ ] Modo mock funciona sin backend
- [ ] Texto se convierte a MAYÚSCULAS
- [ ] Popups aparecen correctamente
- [ ] Toast messages muestran mensajes apropiados
- [ ] Redirecciones a /home funcionan

---

## 6. Comandos Útiles

### Limpiar BD (H2)
```sql
DELETE FROM estadia;
DELETE FROM huesped;
DELETE FROM direccion;
```

### Crear Datos de Prueba
```sql
INSERT INTO direccion (pais, provincia, ciudad, codigo_postal, calle, numero)
VALUES ('ARGENTINA', 'BUENOS AIRES', 'LA PLATA', '1900', 'CALLE FALSA', 123);

INSERT INTO huesped (nombre, apellido, tipo_documento, documento, 
posicion_iva, fecha_nacimiento, telefono, ocupacion, nacionalidad, direccion_id)
VALUES ('JUAN', 'PÉREZ', 'DNI', '12345678', 'Consumidor Final', 
'1990-01-15', '1234567890', 'INGENIERO', 'Argentino', 1);
```

### Verificar Datos (curl)
```bash
# GET
curl -X GET http://localhost:8080/api/huespedes/1

# PUT
curl -X PUT http://localhost:8080/api/huespedes/actualizar/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"JORGE",...}'

# DELETE
curl -X DELETE http://localhost:8080/api/huespedes/baja/1
```

