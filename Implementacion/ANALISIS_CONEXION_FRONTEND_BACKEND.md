# ANÁLISIS DE CONEXIÓN FRONTEND-BACKEND: FacturarCheckout

## 🔴 PROBLEMAS ENCONTRADOS

### 1. URLs INCORRECTAS (Mismatch entre Frontend y Backend)

#### Problema en FacturarController.java
- **No tiene `@RequestMapping`** → Las rutas no tienen prefijo `/api`
- Las rutas mapeadas son directamente en la raíz: `/buscar-ocupantes`, `/verificar-mayor/{id}`, etc.

#### URLs en Frontend (INCORRECTAS):
```tsx
// ❌ INCORRECTO - Falta /api o tiene ruta incorrecta
http://localhost:8080/buscar-ocupantes?...  // No tiene /api
http://localhost:8080/${estadiaId}/valor-estadia  // No tiene /api
http://localhost:8080/${estadiaId}/items-pendientes  // No tiene /api
http://localhost:8080/verificar-mayor/${id}  // No tiene /api
```

#### URLs que SI son correctas:
```tsx
// ✅ CORRECTO
http://localhost:8080/api/estadias/buscar-por-habitacion/{numero}  // EstadiaController
http://localhost:8080/responsablesdepago?cuit={cuit}  // ResponsableDePagoController tiene @RequestMapping("/responsablesdepago")
```

**RECOMENDACIÓN**: Agregar `@RequestMapping("/api/facturas")` al FacturarController para consistencia.

---

### 2. MISMATCH DE DTOs

#### HuespedDTO (Backend) vs Ocupante (Frontend)

**Backend (GestorFactura.obtenerOcupantes)**:
```java
HuespedDTO{
  id: Long
  nombre: String
  apellido: String
  documento: String
  fechaNacimiento: LocalDate
}
```

**Frontend Mock (FacturarCheckoutManager)**:
```tsx
Ocupante{
  id: number
  nombre: string
  dni: string          // ❌ Backend usa "documento"
  edad: number         // ❌ Backend usa "fechaNacimiento"
}
```

**PROBLEMA**: El frontend espera `dni` y `edad`, pero el backend retorna `documento` y `fechaNacimiento`.

---

#### ConsumoDTO Inconsistencia

**Backend (ConsumoDTO.java)**:
```java
{
  id: Long
  nombre: String
  cantidad: int
  precio: double
  subtotal: double
}
```

**Frontend Mock (ListadoFactura)**:
```tsx
Consumo{
  id: number
  nombre: string
  cantidad: number
  precio: number
  subtotal: number  // ✅ Correcto
}
```

**Pero en FacturarCheckoutManager**:
```tsx
const consumosDisponiblesMock = [
  { id: "bar", descripcion: "Bar", monto: 12000 },     // ❌ "descripcion" vs "nombre", "monto" vs "subtotal"
  // ...
];
```

---

### 3. FLUJOS ALTERNATIVOS NO COMPLETAMENTE IMPLEMENTADOS

#### 5.C - Crear nuevo Responsable de Pago
```
Requisito: Si el CUIT está vacío, debe ejecutar CU03 "Dar Alta de Responsable de Pago"
Estado: ❌ NO IMPLEMENTADO
```

El código actual solo muestra un alert:
```tsx
if (!cuitTercero.trim()) {
  alert("Ingrese un CUIT válido");
  // ❌ Falta integración con CU03 (Alta de Responsable)
}
```

#### 9.A - Volver a seleccionar items si algunos no están tildados
```
Requisito: Si hayItemsNoSeleccionados = true, volver al punto 4 del flujo principal
Estado: ✅ PARCIALMENTE IMPLEMENTADO pero con issue
```

Problema actual:
```tsx
if (hayItemsNoSeleccionados) {
  setMostrarModalFactura(false);
  setResponsableSeleccionado(null);  // ❌ Limpia la selección
  return; // vuelve al punto 4
}
```

Debería permitir volver sin limpiar la selección, solo cerrar el modal.

---

### 4. VALIDACIÓN DE CAMPOS (3.A)

**Estado**: ✅ PARCIALMENTE CORRECTA

Validaciones implementadas:
- ✅ Número de habitación faltante
- ✅ Hora de salida faltante
- ✅ Hora no puede ser futura
- ❌ **Falta**: Validar que la habitación exista (solo en MOCK)
- ❌ **Falta**: Validar que la habitación esté ocupada (solo en MOCK)
- ⚠️ En REAL mode, se valida indirectamente mediante:
  ```tsx
  if (!resEstadia.ok) {
    alert("No existe estadía activa");  // No es un error detallado
  }
  ```

---

### 5. VERIFICACIÓN DE RESPONSABLE (5.A - Menor de edad)

**Estado**: ✅ IMPLEMENTADO CORRECTAMENTE

- ✅ En MOCK: Usa `responsableSeleccionado.edad < 18`
- ✅ En REAL: Llama a `/verificar-mayor/{huespedId}` ← **URL sin /api**
- ✅ Mensaje de error correcto: "La persona seleccionada es menor de edad..."

---

### 6. TERCERO (5.B). Facturar a nombre de tercero

**Estado**: ✅ IMPLEMENTADO

- ✅ Opción "TERCERO" activada
- ✅ Entrada de CUIT
- ✅ Búsqueda de razón social
- ✅ Botones ACEPTAR/CANCELAR

**Pero verificar**:
- URL: `http://localhost:8080/responsablesdepago?cuit=${cuitTercero}` ✅ Correcta
- DTOs esperados: El backend debería retornar ResponsableDePagoDTO

---

### 7. OBTENCIÓN DE DATOS PARA FACTURACIÓN (Punto 6 del CU)

**Estado**: ⚠️ INCOMPLETO

Cuando se selecciona un responsable:
```tsx
if (estadiaId) {
  // ❌ URLs sin /api
  const resValor = await fetch(`http://localhost:8080/${estadiaId}/valor-estadia`);
  const resConsumos = await fetch(`http://localhost:8080/${estadiaId}/items-pendientes`);
  
  // ❌ Los DTOs que retorna no se transforman al formato de ListadoFactura
  setConsumosReales(consumos);  // Directamente, sin mapeo
}
```

**PROBLEMA**: 
- El consumo del backend tiene estructura diferente al mock
- No hay transformación/mapeo de datos
- No se calcula el subtotal si el backend no lo proporciona

---

### 8. GENERACIÓN DE FACTURA (Punto 8 del CU)

**Estado**: ❌ NO IMPLEMENTADO

El código actual:
```tsx
onAceptar={(hayItemsNoSeleccionados: boolean) => {
  if (hayItemsNoSeleccionados) {
    // vuelve al listado
    return;
  }
  // ❌ Falta generar la factura (POST al backend)
  alert("Factura confirmada ✔");
  router.push("/home");
}
```

**Falta**:
- Endpoint POST para generar facturas
- Envío de items seleccionados
- Marcar consumos como facturados en el backend

---

## 📋 RESUMEN DE CORRECCIONES NECESARIAS

### Backend
- [ ] Agregar `@RequestMapping("/api/facturas")` a FacturarController
- [ ] Implementar endpoint POST `/api/facturas/generar` para crear facturas
- [ ] Asegurar que ConsumoDTO.subtotal se calcula correctamente

### Frontend
- [ ] Corregir URLs: agregar `/api/facturas` al prefijo
- [ ] Transformar respuesta de HuespedDTO al tipo Ocupante esperado
- [ ] Transformar consumos reales al formato de ListadoFactura
- [ ] Implementar CU03 (Alta de Responsable) para el flujo 5.C
- [ ] NO limpiar selección cuando hay items no seleccionados (flujo 9.A)
- [ ] Implementar POST para generar facturas
- [ ] Mejorar validación de habitación: verificar existencia y ocupación

---

## 🧪 CASOS DE PRUEBA A VALIDAR

1. **Main Flow**: Seleccionar ocupante → Ver y facturar todos los items
2. **3.A**: Campos vacíos o inválidos → mostrar errores específicos
3. **5.A**: Ocupante menor de edad → mostrar error y permitir seleccionar otro
4. **5.B**: Seleccionar TERCERO → ingresar CUIT → buscar razón social
5. **5.B.2.2**: Cancelar selección de CUIT → volver a ingresa CUIT
6. **5.C**: CUIT vacío → debe ir a CU03 (NO IMPLEMENTADO)
7. **9.A**: Deseleccionar items → volver y seleccionar nuevamente → facturar
8. **CANCELAR**: En cualquier momento → volver a home

