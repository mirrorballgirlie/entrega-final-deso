# GUÍA DE TESTING RÁPIDO - CU07 Facturar Checkout

## 🚀 Setup Inicial

### Backend
```bash
cd gestion-hotelera/

# Asegurar que el servidor está corriendo en puerto 8080
# Verificar: http://localhost:8080/api/estadias/...
```

### Frontend
```bash
cd frontend/tpgestionhotelera-frontend/

# Cambiar a modo REAL en FacturarCheckoutManager.tsx
const USE_MOCK = false;  // ← Línea 12

# Ejecutar servidor Next.js
npm run dev
```

---

## ✅ Test Checklist Minimalista

### Test 1: Flujo Completo (5 minutos)

1. **Abrir** `http://localhost:3000/facturar-checkout`
2. **Ingresar**:
   - Habitación: `101` (o una ocupada)
   - Hora: `10:30`
3. **Verificar**: Se carga lista de ocupantes
4. **Seleccionar**: Ocupante mayor de edad (Juan Pérez)
5. **Verificar**: Se muestran items (estadia + consumos)
6. **Marcar**: Todos los items
7. **Click**: ACEPTAR
8. **Verificar**: 
   - POST a `/api/facturas/generar` se ejecuta
   - Alert de éxito
   - Redirige a `/home`

**Resultado esperado**: ✅ Factura generada

---

### Test 2: Validación de Menor de Edad (3 minutos)

1. **Abrir** `http://localhost:3000/facturar-checkout`
2. **Completar** formulario (habitación + hora)
3. **Seleccionar**: "Ana Gómez" (17 años - MENOR)
4. **Click**: ACEPTAR

**Resultado esperado**: 
- Alert rojo: "La persona seleccionada es menor de edad..."
- Permite reseleccionar otro ocupante ✅

---

### Test 3: Búsqueda de Tercero por CUIT (4 minutos)

1. **Abrir** `http://localhost:3000/facturar-checkout`
2. **Completar** formulario
3. **Seleccionar**: "TERCERO"
4. **Ingresar** CUIT: `20123456789` (o válido del sistema)
5. **Verificar**: Se muestra "Razón social: ACME S.A." (o similar)
6. **Click**: ACEPTAR
7. **Verificar**: Se muestra factura tipo "A" (RI)

**Resultado esperado**: ✅ Tercero encontrado y facturado

---

### Test 4: CUIT No Encontrado (2 minutos)

1. **Abrir** formulario de CUIT
2. **Ingresar**: CUIT inválido `12345678901`
3. **Click**: ACEPTAR

**Resultado esperado**: 
- Alert: "CUIT no encontrado"
- Permite reintentar ✅

---

### Test 5: Items No Seleccionados (3 minutos)

1. **Llegar** a modal de factura
2. **Desmarcar** algún item (ej: Sauna)
3. **Click**: ACEPTAR

**Resultado esperado**:
- Modal se cierra
- Regresa a listado de ocupantes
- Permite seleccionar nuevamente sin reiniciar ✅

---

### Test 6: Validación de Campos (2 minutos)

**Escenario 1**: Dejar habitación vacía
- Click BUSCAR
- **Esperado**: Error "Número de habitación faltante" ✅

**Escenario 2**: Ingresar hora futura
- Habitación: `101`, Hora: `23:59` (si es antes)
- Click BUSCAR
- **Esperado**: Error "La hora no puede ser futura" ✅

---

## 🔍 Validaciones en Browser Console

Abrir **DevTools** (F12) → **Network** para ver requests:

### Request 1: Obtener ocupantes
```
GET /api/facturas/buscar-ocupantes?habitacion=101&salida=2025-02-13
Response: [{ id: 1, nombre: "Juan", ... }]  ✅
```

### Request 2: Verificar mayor de edad
```
GET /api/facturas/verificar-mayor/2
Response: false  ✅ (para menor)
```

### Request 3: Obtener valor estadia
```
GET /api/facturas/101/valor-estadia
Response: 50000  ✅
```

### Request 4: Obtener consumos
```
GET /api/facturas/101/items-pendientes
Response: [{ id: 5, nombre: "Minibar", ..., subtotal: 10000 }]  ✅
```

### Request 5: Generar factura
```
POST /api/facturas/generar
{
  "estadiaId": 1,
  "cuitResponsable": "20123456789",
  "incluirEstadia": true,
  "idsConsumosSeleccionados": [5, 6]
}
Response: { id: 10, monto: 60000, ... }  ✅
```

---

## 🐛 Si Algo Falla

### Error: "No existe estadía activa"
- ✅ Usar habitación que esté ocupada
- ✅ Verificar fecha de salida sea hoy

### Error: "404 Not Found" en URLs
- ✅ Revisar que FacturarController tiene `@RequestMapping("/api/facturas")`
- ✅ Backend corriendo en puerto 8080
- ✅ URL en frontend tiene `/api/facturas/` (verificar en Network tab)

### Consumos no se muestran
- ✅ Verificar que existan consumos con `facturado = false`
- ✅ Query en backend: `findPendientesByEstadiaId` correcto

### POST falla con 400 Bad Request
- ✅ Verificar estructura de `GenerarFacturaRequest`
- ✅ RevDatos: `estadiaId`, `cuitResponsable`, `incluirEstadia`, `idsConsumosSeleccionados`

### Backend error: "Responsable no encontrado"
- ✅ CUIT debe existir en tabla `responsableDePago`
- ✅ Si es nuevo, primero ejecutar CU03 (Alta)

---

## 📊 Datos de Prueba Sugeridos

### Habitaciones
- `101` - Ocupada (con Juan Pérez, edad 35)
- `203` - Ocupada (con Ana Gómez, edad 17)
- `302` - Ocupada (con consumos varios)

### Consumos Activos
- Minibar: $10.000
- Sauna: $5.000
- Room Service: $8.000

### CUITs Válidos
- `20123456789` - ACME S.A. (Persona Jurídica, RI)
- `30712345678` - Juan Pérez (Persona Física)

### Estadía Base
- Valor por noche: $50.000
- Duración: 1 noche (ajustar en BD según necesidad)
- Monto total sin consumos: $50.000

---

## ⏱️ Tiempo Total Estimado: 20 minutos

- Test 1 (Completo): 5 min
- Test 2 (Menor): 3 min
- Test 3 (Tercero): 4 min
- Test 4 (CUIT inválido): 2 min
- Test 5 (Items): 3 min
- Test 6 (Validación): 2 min
- **Buffer**: 1 min

---

## ✨ Success Criteria

✅ **Test EXITOSO si**:
1. Flujo completo genera factura sin errores
2. Menor de edad muestra error
3. Búsqueda de CUIT funciona
4. Items no seleccionados permiten reintento
5. Todas las URLs están correctas (Network tab)
6. Consumos marcados como `facturado = true` en BD

❌ **Test FALLIDO si**:
- POST retorna error 404 o 400
- URLs no tienen `/api/facturas`
- Consumos no se actualizan en BD
- Modal se cierra sin generar factura

---

## 🎬 Demo Flow (Guión)

```
1. Abrir app → Navegar a "Facturar Checkout"
2. Ingresar: Hab 101, Hora 10:30
3. Mostrar: Lista de ocupantes cargada
4. Seleccionar: Juan Pérez (ocupante OK)
5. Mostrar: Modal con items (estadia $50K + mini bar $10K)
6. Marcar: Todos
7. Click: ACEPTAR
8. Esperar: POST ejecuta
9. Verificar: "Factura confirmada ✔"
10. Redirige: a HOME
11. Backend: Consumos marcados como pagados
```

**Tiempo de demo**: ~3 minutos

