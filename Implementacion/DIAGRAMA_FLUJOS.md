# DIAGRAMA DE FLUJOS - CU07 "Facturar Checkout"

## 🔄 Flujo Principal

```
┌─────────────────────────────────────────────────────────┐
│ INICIO - CU07 FACTURAR CHECKOUT                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │ 1. Mostrar formulario                │
        │    - Número de habitación            │
        │    - Hora de salida                  │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │ 2. Actor completa campos e ingresa   │
        │    - GET /api/estadias/...           │
        │    - GET /api/facturas/buscar-ocupan│
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │ 3. Mostrar grilla de ocupantes       │
        │    - Listar todos los que viven en   │
        │      la habitación                   │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │ 4. Actor selecciona responsable      │
        │    - Ocupante directo O              │
        │    - TERCERO                         │
        └──────────────────────────────────────┘
                           │
                           ▼
              ┌────────────┴────────────┐
              │                         │
         ¿Ocupante?            ¿Tercero?
              │                         │
              ▼ Sí                      ▼ Sí
    ┌──────────────────┐    ┌──────────────────────┐
    │ 5.A: Verificar   │    │ 5.B: Solicitar CUIT  │
    │ edad >= 18       │    │ - Mostrar input      │
    │GET .../verificar│    │ - GET /responsables  │
    │    -mayor/{id}  │    │   dePago?cuit=...    │
    └──────────────────┘    │ - Mostrar razón      │
         │                  │   social             │
         ├─ Sí (Mayor)──┐   └──────────────────────┘
         │              │              │
         │          ┌───┴──────────────┤
         │          │                  │
         ▼          │            ¿CUIT vacío?
    ┌──────────┐   │              │
    │ Continuar│   │          ¿Sí? ▼
    │ (OK)     │   │         ┌──────────────┐
    └──────────┘   │         │ 5.C: Ejecutar│
                   │         │ CU03 Alta    │
                   │         │ Responsable  │
                   │         │ (TODO)       │
                   │         └──────────────┘
                   │              │
                   ├──ConfirmarCUIT
                   │
                   ▼
    ┌──────────────────────────────────────────┐
    │ 6. Mostrar valores a facturar:           │
    │    - Valor estadia                       │
    │    - Consumos pendientes (con subtotal)  │
    │    - Total (con IVA si aplica)           │
    │    - Tipo de factura (A o B)             │
    │    GET /api/facturas/{id}/valor-estadia │
    │    GET /api/facturas/{id}/items-pending │
    └──────────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────┐
    │ 7. Actor selecciona items a facturar     │
    │    - Marca/desmarca checkbox por item    │
    │    - Actualiza total automáticamente     │
    └──────────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────┐
    │ 8. Actor presiona ACEPTAR                │
    └──────────────────────────────────────────┘
         │
         ├─ ¿Todos items seleccionados?
         │
    ┌────┴────────────────┐
    │                     │
 Sí (Todos)          No (Algunos)
    │                     │
    ▼                     ▼
GENERAR             Volver a 6
FACTURA             (Deseleccionar)
POST /api/          (Flujo 9.A)
facturas/generar
    │
    ▼
┌──────────────────────────────────────┐
│ 9. Actualizar BD:                    │
│    - Crear Factura (pendiente pago)  │
│    - Marcar consumos facturado=true  │
│    - Actualizar Estadia              │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ 10. Redirige a HOME                  │
│     FIN - CU COMPLETADO              │
└──────────────────────────────────────┘
```

---

## ⚠️ Flujo Alternativo 3.A - Validación de Campos

```
            Paso 3: Completar formulario
                    │
                    ▼
        ┌────────────────────────────┐
        │ ¿Campos válidos?           │
        └────────────────────────────┘
           │                  │
        SÍ │                  │ NO
           │                  │
           ▼                  ▼
        Continuar        ┌──────────────────┐
        (paso 4)         │ 3.A.1: Mostrar   │
                         │ error detallado: │
                         │ - Faltante o     │
                         │   incorrecto     │
                         │ - Poner foco en  │
                         │   primer error   │
                         │ 3.A.2: Volver    │
                         │ a paso 3         │
                         └──────────────────┘
```

### Validaciones en Paso 3

| Campo | Validación | Error |
|-------|-----------|-------|
| Número habitación | No vacío | "Número de habitación faltante" |
| Número habitación | Existe | "La habitación no existe" |
| Número habitación | Ocupada | "La habitación está ocupada" |
| Hora salida | No vacía | "Hora de salida faltante" |
| Hora salida | No futura | "La hora no puede ser futura" |

---

## 👤 Flujo Alternativo 5.A - Verificar Menor de Edad

```
            Seleccionar ocupante (paso 5)
                    │
                    ▼
        ┌────────────────────────────┐
        │ Hacer click ACEPTAR        │
        └────────────────────────────┘
                    │
    ┌───────────────┴───────────────┐
    │                               │
 MOCK mode                      REAL mode
    │                               │
    ▼                               ▼
Validar edad        GET /api/facturas/
localmente          verificar-mayor/{id}
    │                               │
    ├─ edad < 18             ├─ Retorna false
    │   ▼                         │
    │ ERROR: "La              ▼
    │ persona es menor"       ERROR: "La
    │ Limpiar seccion         persona es menor"
    │ Permitir reseleccionar  Limpiar selección
    │ (Volver a paso 5)       Permitir reseleccionar
    │
    ├─ edad >= 18
    │   ▼
    │ OK - Continuar
    │ (paso 6)
```

---

## 💼 Flujo Alternativo 5.B - Facturar a Tercero

```
        Seleccionar "TERCERO" (paso 5)
                    │
                    ▼
    ┌──────────────────────────────┐
    │ 5.B: Mostrar input CUIT      │
    │ ¿CUIT está vacío?            │
    └──────────────────────────────┘
         │                    │
      SÍ │ (Vacío)        NO □ (Completo)
         │                    │
         ▼                    ▼
    5.C Ejecutar      GET /responsablesdepago
    CU03 (TODO)       ?cuit={cuitIngresado}
         │                    │
         │              ┌─────┴─────┐
         │              │           │
         │          Encontrado  No Encontrado
         │              │           │
         │              ▼           ▼
         │         Mostrar       Alert:
         │         razón social  "CUIT no encontrado"
         │         Botones:      Reintentar
         │         - ACEPTAR
         │         - CANCELAR
         │              │
         ├──────────────┤
         │              │
    ▼    │
┌──────┐ │
│Crear │ │
│nuevo │ │
│resp. │ │
│      │ │
│(CU03)│ │
└──────┘ │
    │    │
    └────┤
         │
    ┌────┴──────────────┐
    │                   │
 ¿Click?         Click CANCELAR
 - ACEPTAR       │
    │            ▼
    ▼        Volver a 5.B.1
 Continuar   o limpiar selección
 (paso 6)    (Volver a paso 5)
```

---

## 🧮 Flujo Alternativo 9.A - Items No Seleccionados

```
        Paso 7: Actor selecciona items
                    │
                    ▼
        ┌───────────────────────────┐
        │ Click ACEPTAR             │
        └───────────────────────────┘
         │                       │
    Todos      ¿Estado de items?
    selectos       │
         │         │
    ┌────┴─────────┤
    │              │
   SÍ          NO (Algunos
    │         sin seleccionar)
    │              │
    ▼              ▼
GENERAR      ┌──────────────────┐
FACTURA      │ 9.A: Items NO    │
POST /api/   │ seleccionados    │
facturas/    │ - Cerrar modal   │
generar      │ - Volver a paso 7│
   │         │ - Permitir       │
   ▼         │   reseleccionar  │
ÉXITO        │ - Intentar de    │
(continuar)  │   nuevo          │
             └──────────────────┘
                    │
                    ▼
            Reseleccionar items
                    │
                    ▼
            Volver a paso 7
                    │
                    ├── Si ahora todos OK → GENERAR
                    └── Si aún falta alguno → Repeate
```

---

## 📤 Solicitudes HTTP

### 1. GET - Obtener ocupantes
```
GET http://localhost:8080/api/facturas/buscar-ocupantes
    ?habitacion=101
    &salida=2025-02-13

Response (200 OK):
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "documento": "30123456",
    "fechaNacimiento": "1990-01-15"
  }
]
```

### 2. GET - Verificar mayor de edad
```
GET http://localhost:8080/api/facturas/verificar-mayor/1

Response (200 OK):
true  // o false
```

### 3. GET - Obtener valor de estadía
```
GET http://localhost:8080/api/facturas/1/valor-estadia

Response (200 OK):
50000.0  // monto en pesos
```

### 4. GET - Obtener consumos pendientes
```
GET http://localhost:8080/api/facturas/1/items-pendientes

Response (200 OK):
[
  {
    "id": 5,
    "nombre": "Minibar",
    "cantidad": 2,
    "precio": 5000,
    "subtotal": 10000
  }
]
```

### 5. POST - Generar factura
```
POST http://localhost:8080/api/facturas/generar
Content-Type: application/json

{
  "estadiaId": 1,
  "cuitResponsable": "30123456789",
  "incluirEstadia": true,
  "idsConsumosSeleccionados": [5, 6]
}

Response (200 OK):
{
  "id": 10,
  "nombre": "Juan Pérez",
  "tipo": "B",
  "cuit": "30123456789",
  "monto": 60000,
  "iva": 0,
  "total": 60000
}
```

### 6. GET - Buscar responsable por CUIT
```
GET http://localhost:8080/responsablesdepago?cuit=20123456789

Response (200 OK):
[
  {
    "id": 2,
    "cuit": "20123456789",
    "telefono": "1123456789",
    "personaJuridica": {
      "nombreRazonSocial": "ACME S.A.",
      "razonSocial": "PERSONA_JURIDICA"
    }
  }
]
```

---

## 🎯 Estados y Transiciones

### Estados del Modal de Factura

```
┌─────────────────────────────────────┐
│ CERRADO                             │
│ (No visible)                        │
└────────────────────┬────────────────┘
                     │
          Aceptar responsable
                     │
                     ▼
┌─────────────────────────────────────┐
│ ABIERTO - Listar Items              │
│ ═════════════════════════════════════ │
│ ☑ Estadia: $50.000                  │
│ ☑ Minibar: $10.000                  │
│ ☑ Sauna: $5.000                     │
│ [ ACEPTAR ]  [ CANCELAR ]           │
└────────────────────┬────────────────┘
         │
    ┌────┴──────────────┐
    │                   │
 Algunos SIN         Todos SIN
 seleccionar         seleccionar
    │                │
    ├─ Cierra │
    │        │
    ▼        ▼
CERRADO   ERROR?
(Vuelve
a paso 6)
    │
    └─ POST
       Generar
       Factura
```

---

## ✅ Checklist de Validación

- [ ] **URLs correctas** - Todas apuntan a `/api/facturas/...`
- [ ] **DTOs transformados** - HuespedDTO → Ocupante
- [ ] **Cálculos correctos** - subtotal = cantidad × precio
- [ ] **Mayor de edad** - Verifica edad correctamente
- [ ] **Items pendientes** - Muestra todos los no facturados
- [ ] **POST genera factura** - Crea registro con id correcto
- [ ] **Consumos marcados** - `facturado = true` después de generar
- [ ] **Flujo 9.A** - Vuelve sin limpiar selección
- [ ] **Cancelar** - Regresa a home en cualquier momento
- [ ] **CUIT no encontrado** - Muestra alert y permite reintentar

