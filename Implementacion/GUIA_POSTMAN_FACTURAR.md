# 📋 INSTRUCCIONES PARA PROBAR EN POSTMAN

**Estado:** ✅ SERVIDOR CORRIENDO EN http://localhost:8080

---

## 🎯 ENDPOINT A PROBAR

### Crear Nueva Solicitud POST

```
Método: POST
URL: http://localhost:8080/api/facturas/generar
Content-Type: application/json
```

---

## 📦 BODY (JSON)

Copia yasta esto exactamente:

```json
{
  "estadiaId": 1,
  "cuitResponsable": "20-12345678-9",
  "incluirEstadia": true,
  "idsConsumosSeleccionados": []
}
```

### Desglose del Body:
- **estadiaId**: 1 → Estadia que existe en tu BD (estado=3, ya egresada)
- **cuitResponsable**: "20-12345678-9" → ResponsableDePago (PersonaFisica) que existe en la BD
- **incluirEstadia**: true → Incluir el monto de la estadía en la factura
- **idsConsumosSeleccionados**: [] → Array VACÍO (porque no tienes consumos en BD)

---

## ✅ RESPUESTA ESPERADA (Status 200 OK)

```json
{
  "id": 1,
  "nombre": "20-12345678-9",
  "tipo": "B",
  "cuit": "20-12345678-9",
  "monto": 500.0,
  "iva": 0.0,
  "total": 500.0,
  "fechaEmision": "2026-02-14T12:XX:XX",
  "estado": null,
  "impuestos": [],
  "estadia": {
    "id": 1,
    "estado": 3,
    "fechaIngreso": "2025-02-01",
    "fechaEgreso": "2025-02-10"
  },
  "responsableDePago": {
    "id": 2,
    "cuit": "20-12345678-9",
    "telefono": "2211234567"
  },
  "metodosDePago": [],
  "pagos": [],
  "notaCredito": null
}
```

---

## 🔴 SI OBTIENES ERROR 500

### Verifica en la consola del servidor (terminal PowerShell)

Deberías ver logs como estos:

```
[GestorFactura] === INICIANDO generarFactura ===
[GestorFactura] Request: estadiaId=1, cuitResponsable=20-12345678-9, incluirEstadia=true, idsConsumos=[]
[GestorFactura] Buscando estadía con ID: 1
[GestorFactura] ✓ Estadía encontrada: 1
[GestorFactura] Buscando responsable con CUIT: 20-12345678-9
[GestorFactura] ✓ Responsable encontrado: 20-12345678-9 (ID: 2)
[GestorFactura] ✓ Monto estadía calculatedo: 500.0
[GestorFactura] × Estadía no incluida en esta factura
[GestorFactura] ✓ Sin consumos seleccionados
[GestorFactura] SUBTOTAL: 500.0
[GestorFactura] Tipo factura: B, IVA: 0.0
[GestorFactura] TOTAL: 500.0
[GestorFactura] Creando entidad Factura...
[GestorFactura] ✓ Factura construida
[GestorFactura] Guardando factura en BD...
[GestorFactura] ✓ Factura guardada con ID: 1
[GestorFactura] === generarFactura completado exitosamente ===
```

### Posibles Errores:

| Error | Causa | Solución |
|-------|-------|----------|
| `Estadía no encontrada` | estadiaId no existe | Cambia a ID que sí exista (1, 2, 4, 5, 6, 7) |
| `No existe responsable de pago` | CUIT inválido o no existe | Verifica el CUIT en la BD |
| `Responsable de Pago no encontrado` | Campo null | Verifica que responsable exista en BD |
| `Connection refused` | Servidor no está corriendo | `mvn spring-boot:run` |

---

## 🚀 VARIACIONES PARA PROBAR

### Opción 1: CON CONSUMOS (Si agregas datos)
```json
{
  "estadiaId": 1,
  "cuitResponsable": "20-12345678-9",
  "incluirEstadia": true,
  "idsConsumosSeleccionados": [1, 2, 3]
}
```

### Opción 2: SIN ESTADÍA (Solo consumos)
```json
{
  "estadiaId": 1,
  "cuitResponsable": "20-12345678-9",
  "incluirEstadia": false,
  "idsConsumosSeleccionados": []
}
```

### Opción 3: CON OTRA RAZÓN SOCIAL
```json
{
  "estadiaId": 1,
  "cuitResponsable": "30-87654321-0",
  "incluirEstadia": true,
  "idsConsumosSeleccionados": []
}
```

---

## 📊 DATOS DE PRUEBA EN BD

### ResponsablesDePago Disponibles
```
┌──────────────────────────────────────────┐
│ ID │ DTYPE          │ CUIT          │ TEL  │
├────┼────────────────┼───────────────┼──────┤
│ 1  │ PERSONA_JURIDICA │ 30-87654321-0 │ 2217 │
│ 2  │ PERSONA_FISICA   │ 20-12345678-9 │ 2211 │
└────┴────────────────┴───────────────┴──────┘
```

### Estadías Disponibles
```
┌──────────────────────────────────────────┐
│ ID │ ESTADO │ FEC.INGRESO │ FEC.EGRESO │
├────┼────────┼─────────────┼────────────┤
│ 1  │ 3      │ 2025-02-01  │ 2025-02-10 │
│ 2  │ 3      │ 2025-02-16  │ 2025-02-19 │
│ 4  │ 0      │ 2025-04-10  │ 2025-04-15 │
│ 5  │ 0      │ 2025-03-01  │ 2025-03-05 │
│ 6  │ 0      │ 2025-03-12  │ 2025-03-14 │
│ 7  │ 0      │ 2025-02-13  │ 2025-02-14 │
└────┴────────┴─────────────┴────────────┘
```

### Consumos
```
❌ NO HAY CONSUMOS CARGADOS EN BD
   Esto es CORRECTO - la factura sin consumos es válida
```

---

## 🎬 PASOS EN POSTMAN

1. **Abre Postman**
2. **+ New Request** → POST
3. **URL:** `http://localhost:8080/api/facturas/generar`
4. **Headers:** `Content-Type: application/json` (automático)
5. **Body → raw → JSON** y pega el JSON del request
6. **Send**
7. **Mira Console (View → Show Postman Console)** si tienes logs
8. **Mira la terminal del servidor PowerShell** para ver los logs de GestorFactura

---

## ✨ RESULTADO FINAL

Si hiciste todo correctamente, deberías obtener:
- ✅ Status Code: **200 OK**
- ✅ Response Body: JSON con la factura creada
- ✅ Logs: "=== generarFactura completado exitosamente ==="

¡Eso significa que la factura se generó correctamente! 🎉

----

## 📝 NOTA IMPORTANTE

El **ÚNICO cambio requerido** que realizamos fue:

### 🔧 Archivo: `Factura.java`
- ❌ **Antes:** Completamente comentado (//...)
- ✅ **Ahora:** Clase funcional con Lombok @Data @Builder
- ✅ **Relaciones:** Correctamente anotadas con @OneToOne @ManyToOne
- ✅ **Builder:** Asigna todos los campos incluyendo estadia y responsableDePago

### 📊 Archivos Agregados con Logging
- `GestorFactura.java` → Método `generarFactura()` con logs en cada paso

---

**¡Ahora está listo para ENTREGAR!** 🚀
