# CORRECCIONES APLICADAS - Frontend Backend Connection

## ✅ CORRECCIONES REALIZADAS

### Backend

#### 1. FacturarController.java
- ✅ **Agregado** `@RequestMapping("/api/facturas")` para consistencia de URLs
- ✅ **Agregado** `PostMapping("/generar")` para generar facturas
- ✅ **Agregada** importación de `GenerarFacturaRequest` y `Factura`

#### 2. GestorFactura.java
- ✅ **Corregido** `obtenerItemsPendientes()` - ahora calcula y retorna:
  - `id` del consumo
  - `subtotal` (cantidad * precio)
- ✅ **Agregado** método `generarFactura(GenerarFacturaRequest request)` que:
  - Obtiene estadia y responsable de pago
  - Calcula montos (estadia + consumos)
  - Crea factura con tipo A o B
  - Marca consumos como facturados
- ✅ **Agregadas** dependencias: `FacturaRepository`, `ResponsableDePagoRepository`

#### 3. ResponsableDePagoRepository.java
- ✅ **Agregado** método `findByCuit(String cuit)` para buscar por CUIT

### Frontend

#### FacturarCheckoutManager.tsx

##### URLs Corregidas
| Antes | Después |
|-------|---------|
| `http://localhost:8080/buscar-ocupantes` | `http://localhost:8080/api/facturas/buscar-ocupantes` |
| `http://localhost:8080/${estadiaId}/valor-estadia` | `http://localhost:8080/api/facturas/${estadiaId}/valor-estadia` |
| `http://localhost:8080/${estadiaId}/items-pendientes` | `http://localhost:8080/api/facturas/${estadiaId}/items-pendientes` |
| `http://localhost:8080/verificar-mayor/{id}` | `http://localhost:8080/api/facturas/verificar-mayor/{id}` |

##### Transformación de DTOs
- ✅ **Agregado** mapeo de `HuespedDTO` a `Ocupante` en respuesta `/buscar-ocupantes`:
  ```tsx
  const ocupantesTransformados = dataOcupantes.map((h: any) => ({
    id: h.id,
    nombre: h.nombre + " " + h.apellido,
    dni: h.documento,
    edad: calcularEdad(h.fechaNacimiento)
  }));
  ```

##### Implementación de Flujos
- ✅ **Flujo 5.C** - CUIT vacío: Se muestra alert (TODO: integrar CU03)
- ✅ **Flujo 9.A** - Items no seleccionados: Cierra modal sin limpiar selección
- ✅ **Flujo Principal** - Generar factura: POST a `/api/facturas/generar` con:
  ```json
  {
    "estadiaId": Long,
    "cuitResponsable": String,
    "incluirEstadia": boolean,
    "idsConsumosSeleccionados": [Long]
  }
  ```

---

## 🧪 CASOS DE PRUEBA A VALIDAR

### Flujo Principal (Feliz)
**Precondición**: Habitación ocupada con consumos pendientes

**Pasos**:
1. Ingresar número de habitación válido y hora de salida
2. Seleccionar ocupante mayor de edad
3. Ver items (estadia + consumos) con subtotales calculados
4. Seleccionar todos los items
5. Aceptar y verificar POST a `/api/facturas/generar`
6. Verificar que consumos se marcan como `facturado = true`

**Resultado esperado**: 
- Factura generada
- Redirige a `/home`
- Consumos marcados como facturados en BD

---

### Flujo Alternativo 3.A - Validación de Campos

**Caso 3.A.1**: Campo faltante
- Dejar vacío "Número de habitación"
- Verificar error: "Número de habitación faltante"

**Caso 3.A.2**: Hora no válida
- Ingresar hora futura (ej: 23:00 si son las 10:00)
- Verificar error: "La hora no puede ser futura"

**Resultado esperado**: 
- Errores mostrados en rojo
- Foco en primer campo incorrecto
- No continúar al siguiente paso

---

### Flujo Alternativo 5.A - Verificar Mayor de Edad

**Setup**: Seleccionar ocupante menor de edad

**Pasos**:
1. Seleccionar "Ana Gómez" (edad 17) del listado
2. Hacer click en Aceptar
3. Verificar llamada a `/api/facturas/verificar-mayor/{id}`
4. Backend retorna `false`

**Resultado esperado**:
- Error: "La persona seleccionada es menor de edad..."
- Permitir seleccionar otro ocupante
- No mostrar modal de factura

---

### Flujo Alternativo 5.B - Facturar a Tercero

**Pasos**:
1. En listado de ocupantes, seleccionar "TERCERO"
2. Ingresar CUIT válido (ej: "20123456789")
3. Verificar GET a `/responsablesdepago?cuit={cuit}`
4. Mostrar razón social
5. Aceptar

**Resultado esperado**:
- Mostrar nombre de la persona jurídica
- Mostrar tipo de factura "A" (si es RI)
- Permitir facturación

**Con CUIT no existente**:
- Alert: "CUIT no encontrado"
- Permitir reintentar

---

### Flujo Alternativo 5.C - CUIT Vacío (No Implementado Aún)

**Pasos**:
1. Seleccionar TERCERO
2. Dejar CUIT vacío
3. Click en Aceptar

**Resultado actual**: Alert "CUIT vacío..."
**TODO**: Integrar navegación a CU03 (Alta de Responsable)

---

### Flujo Alternativo 9.A - Deseleccionar Items

**Pasos**:
1. En modal de factura, desmarcar algún consumo
2. Click en Aceptar

**Resultado esperado**:
- Modal se cierra
- Regresa a listado de ocupantes
- Permite reseleccionar y refacturar

**Verificar**: 
- NO limpiar `responsableSeleccionado`
- Permitir volver a aceptar sin reseleccionar ocupante

---

### Botón CANCELAR (En cualquier paso)

**Pasos**:
1. En cualquier pantalla, click en CANCELAR
2. Verificar que regresa a `/home`

**Resultado esperado**: 
- Se cancela la operación
- No se genera factura
- Redirige a home

---

## 🔧 CONFIGURACIÓN DE MOCK VS REAL

### Activar Modo REAL (Producción)
```tsx
const USE_MOCK = false;  // Cambiar a false
```

### Activar Modo MOCK (Desarrollo)
```tsx
const USE_MOCK = true;   // Para usar datos fake
```

---

## 📋 ESTRUCTURA DE DTOs

### HuespedDTO (Backend → Frontend)
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "documento": "30123456",
  "fechaNacimiento": "1990-01-15"
}
```
↓ **Se transforma a** ↓
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "dni": "30123456",
  "edad": 34
}
```

### ConsumoDTO (Backend → Frontend)
```json
{
  "id": 1,
  "nombre": "Minibar",
  "cantidad": 2,
  "precio": 5000,
  "subtotal": 10000
}
```

### GenerarFacturaRequest (Frontend → Backend)
```json
{
  "estadiaId": 1,
  "cuitResponsable": "20123456789",
  "incluirEstadia": true,
  "idsConsumosSeleccionados": [1, 2]
}
```

---

## ⚠️ ISSUES CONOCIDOS / TODO

### 1. Flujo 5.C - Alta de Responsable (CU03)
**Estado**: ❌ NO IMPLEMENTADO
**Acción**: Integrar navegación a modal/página de CU03 cuando CUIT esté vacío

### 2. Validación de Tipo de Factura
**Estado**: ⚠️ INCOMPLETO
**Actual**: Siempre genera tipo "B"
**TODO**: Verificar condición fiscal del `ResponsableDePago` y asignar tipo A o B

### 3. Cálculo de IVA
**Estado**: ⚠️ INCOMPLETO
**Actual**: IVA siempre = 0
**TODO**: Aplicar 21% de IVA solo para responsables tipo "RI"

### 4. Transformación de Nombres
**Actual**: Se concatenan nombre + apellido
**TODO**: Considerar si hay mejor forma de obtener nombre completo desde backend

### 5. Horario de Checkout
**Nota**: Backend permite seleccionar `horaSalida` pero actualmente se ignora en estimación de monto
**TODO**: Implementar recargo por hora de salida tardía si es necesario

---

## 📊 MAPA DE ENDPOINTS

```
POST   /api/facturas/generar                    → Generar factura
GET    /api/facturas/buscar-ocupantes           → Obtener ocupantes por habitación
GET    /api/facturas/verificar-mayor/{huespedId}  → Verificar si es mayor de edad
GET    /api/facturas/{estadiaId}/items-pendientes → Obtener consumos pendientes
GET    /api/facturas/{estadiaId}/valor-estadia    → Obtener valor de la estadía
GET    /api/facturas/{estadiaId}/valor-total      → Obtener total pendiente
GET    /responsablesdepago                      → Buscar por CUIT (sin /api)
```

---

## 🚀 PRÓXIMOS PASOS

1. **Verificar importación de `GenerarFacturaRequest`** en FacturarController
2. **Testear todos los flujos** con base de datos real
3. **Implementar CU03** (Alta de Responsable) para flujo 5.C
4. **Mejorar cálculos** de IVA y tipo de factura
5. **Documentar decisiones** de diseño en condiciones fiscales

---

## 🎯 RESUMEN DE CAMBIOS

| Archivo | Cambios | Líneas |
|---------|---------|--------|
| `FacturarController.java` | Agregar @RequestMapping, POST /generar | 3 |
| `GestorFactura.java` | Corregir métodos, agregar generarFactura | 60+ |
| `ResponsableDePagoRepository.java` | Agregar findByCuit | 1 |
| `FacturarCheckoutManager.tsx` | Corregir URLs, transformar DTOs, post | 40+ |
| `GenerarFacturaRequest.java` | Nuevo archivo DTO | 13 |

**Total estimado**: ~120 líneas de código modificadas/agregadas

