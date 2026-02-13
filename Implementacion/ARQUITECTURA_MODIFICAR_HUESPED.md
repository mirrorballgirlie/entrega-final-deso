# Arquitectura - Modificar Huésped (Actualizado)

## Vista de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                     NAVEGADOR (Browser)                          │
│                      localhost:3000                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ HTTP Requests
                      │
        ┌─────────────┴────────────────┐
        │                              │
        ▼                              ▼
┌───────────────────┐        ┌──────────────────┐
│   Frontend        │        │  SessionStorage  │
│   Next.js/React   │        │  (Mock Data)     │
│ localhost:3000    │        │                  │
└────────┬──────────┘        └────────┬─────────┘
         │                           │
         │ Condicional (useMock?)    │
         │                           │
    ┌────┴───────────┬──────────────┘
    │                │
   NO               YES
    │                │
    ▼                │
┌──────────────────────────┐
│  Fetch API               │  sessionStorage.getItem()
│  GET/PUT/DELETE          │  sessionStorage.setItem()
│  http://localhost:8080   │
└────────┬─────────────────┘
         │
         │ HTTP (CORS)
         │
         ▼
┌──────────────────────────────────────────────┐
│        Backend (Spring Boot)                  │
│        localhost:8080                         │
│                                               │
│  ┌──────────────────────────────────────────┐│
│  │  HuespedController                        ││
│  │  • GET /{id}                              ││
│  │  • PUT /actualizar/{id}                   ││
│  │  • DELETE /baja/{id}                      ││
│  └────────────┬─────────────────────────────┘│
│               │                               │
│               ▼                               │
│  ┌──────────────────────────────────────────┐│
│  │  GestorHuesped                            ││
│  │  • loadHuespedFromBackend()                ││
│  │  • validateForm()                          ││
│  │  • actualizarHuesped()                     ││
│  │  • eliminarHuesped()                       ││
│  │  • Verifica doc duplicado                  ││
│  │  • Verifica estadías                       ││
│  └────────────┬─────────────────────────────┘│
│               │                               │
│               ▼                               │
│  ┌──────────────────────────────────────────┐│
│  │  Repository (JPA)                         ││
│  │  • HuespedRepository                       ││
│  │  • DireccionRepository                     ││
│  └────────────┬─────────────────────────────┘│
│               │                               │
│               ▼                               │
│  ┌──────────────────────────────────────────┐│
│  │  Database (H2 / MySQL)                    ││
│  │  • huesped                                 ││
│  │  • direccion                               ││
│  │  • estadia                                 ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

---

## Flujo de Datos - Modificación

### Paso 1: Cargar Datos
```
Browser                                Backend
   │                                      │
   ├─ GET /api/huespedes/1 ────────────>│
   │                          │           │
   │                          ▼           │
   │                  HuespedController   │
   │                  GestorHuesped       │
   │                  buscarPorId(1)      │
   │                          │           │
   │                          ▼           │
   │                  HuespedRepository   │
   │                  .findById(1)        │
   │                          │           │
   │                          ▼           │
   │                  Base de Datos       │
   │                          │           │
   │<─ JSON (HuespedDTO) ─────┘
   │
   ▼
ModificarHuespedManager.loadHuespedFromBackend()
   │
   ▼
formState = { id: 1, nombre: "JUAN", ... }
   │
   ▼
FormularioModificarHuesped renderiza con datos precargados
```

### Paso 2: Actualizar Datos
```
Usuario modifica: "maria" en input nombre
   │
   ▼
handleChange({ target: { name: "nombre", value: "maria" } })
   │
   ▼
setForm({ ...form, nombre: "maria" })
   │
   ▼
FormularioModificarHuesped re-renderiza
Input muestra "maria"
   │
   ▼
Usuario presiona "Siguiente"
   │
   ▼
onSubmit()
   │
   ├─ validateForm() → Verifica campos obligatorios
   │     │
   │     ├─ Validación OK → Continúa
   │     └─ Validación FAIL → setErrors({ nombre: "..." }), return
   │
   ▼
createHuespedDTO()
   │
   ├─ Convierte a MAYÚSCULAS: "maria" → "MARIA"
   │
   ├─ Estructura DTO:
   │  {
   │    "nombre": "MARIA",
   │    "apellido": "PÉREZ",
   │    "direccion": { ... }
   │  }
   │
   ▼
fetch(PUT /actualizar/1)
   │
   ▼
Browser                              Backend
   │                                   │
   ├─ PUT /actualizar/1 ─────────────>│
   │   (HuespedDTO)                   │
   │                        │          │
   │                        ▼          │
   │                HuespedController  │
   │                actualizarHuesped()│
   │                        │          │
   │                        ▼          │
   │                GestorHuesped      │
   │                .actualizarHuesped(│
   │                        │          │
   │                        ▼          │
   │                Verifica doc       │
   │                duplicado          │
   │                        │          │
   │    ┌─────────┬────────┘           │
   │    │         │                    │
   │   Dup      OK                     │
   │    │         │                    │
   │    │         ▼                    │
   │    │     Actualiza                │
   │    │     campos de Huesped        │
   │    │         │                    │
   │    │         ▼                    │
   │    │     Update Dirección         │
   │    │         │                    │
   │    │         ▼                    │
   │    │     .save()                  │
   │    │         │                    │
   │    │         ▼                    │
   │    │     Base de Datos            │
   │    │    UPDATE huesped SET ...    │
   │    │         │                    │
   │<───┤─ 400 Error ────────────────┤
   │    │ "documento ya existe"        │
   │    │         │                    │
   │    └──────>  │         OK         │
   │             ▼          │          │
   │        Popup   ────────┤─────────┘
   │    "Documento existe"   │
   │    [Aceptar] [Corregir] │
   │             │           │
   │             │           ▼
   │             │       200 OK
   │             │       {Huesped}
   │             │           │
   │             └─────────┬─┘
   │
   ▼
Frontend recibe respuesta
   │
   ├─ Si error de doc duplicado: setPopupDocExists(true)
   │
   └─ Si OK: 
       setShowToast(true)
       setTimeout(() => router.push("/home"), 1500)
```

---

## Flujo de Datos - Eliminación

```
Usuario presiona "BORRAR"
   │
   ▼
handleDeleteClick() → setPopupDelete(true)
   │
   ▼
Popup: "¿Desea borrar al huésped? [Si] [No]"
   │
   ▼
Usuario: "Si"
   │
   ▼
confirmDeleteStep1()
   │
   ├─ setPopupDelete(false)
   │
   ├─ setPopupDeleteConfirm(true)
   │   "Los datos del huésped [nombre] [apellido]..."
   │
   ▼
Usuario: "ELIMINAR"
   │
   ▼
deleteGuest()
   │
   ▼
Browser                            Backend
   │                                 │
   ├─ DELETE /baja/1 ──────────────>│
   │                     │           │
   │                     ▼           │
   │            HuespedController   │
   │            eliminarHuesped()   │
   │                     │           │
   │                     ▼           │
   │            GestorHuesped       │
   │            .eliminarHuesped()  │
   │                     │           │
   │                     ├─ Busca de huésped
   │                     │           │
   │                     ├─ Verifica:
   │                     │   huesped.getEstadias()
   │                     │   isEmpty()?
   │                     │           │
   │    ┌────────────────┤           │
   │    │                │           │
   │   SI             NO │           │
   │    │                ▼           │
   │    │           IllegalStateException
   │    │           "Tiene estadías"
   │    │                │           │
   │<───┤─ 400 Error ────┤<──────────┤
   │    │ "No se puede   │           │
   │    │  eliminar"     │           │
   │    │                │           │
   │    └────────────────┤           │
   │                     ▼           │
   │                .delete()        │
   │                     │           │
   │                     ▼           │
   │               Base de Datos     │
   │              DELETE FROM ...    │
   │                     │           │
   │<─ 200 OK ───────────┘
   │ "Eliminado"
   │
   ▼
Frontend:
   │
   ├─ Si error (400): setPopupCannotDelete(true)
   │     Popup: "No puede ser eliminado..."
   │     PRESIONE CUALQUIER TECLA
   │
   └─ Si éxito (200):
       setShowToast(true)
       "Los datos del huésped ... han sido eliminados"
       setTimeout(() => router.push("/home"), 2000)
```

---

## Estructura de Archivos Modificados

```
✅ MODIFICADO

frontend/tpgestionhotelera-frontend/
├── app/
│   └── modificar-huesped/
│       └── page.tsx                 ← Actualizado para aceptar params
│
└── components/
    ├── Manager/
    │   └── ModificarHuespedManager.tsx  ← REESCRITO (conexión HTTP)
    │
    └── Formularios/
        └── FormularioModificarHuesped/
            └── index.tsx             ← Mantiene compatibilidad

gestion-hotelera/src/main/java/com/.../
├── controller/
│   └── HuespedController.java        ← (Sin cambios, ya estaba bien)
│
├── gestores/
│   └── GestorHuesped.java            ← Actualizado (validación doc duplicado)
│
├── modelo/
│   ├── Huesped.java                  ← (Sin cambios)
│   └── Direccion.java                ← (Sin cambios)
│
├── dto/
│   ├── HuespedDTO.java               ← (Sin cambios)
│   └── DireccionDTO.java             ← (Sin cambios)
│
└── repository/
    ├── HuespedRepository.java        ← (Sin cambios)
    └── DireccionRepository.java      ← (Sin cambios)
```

---

## Factory Pattern DTO

```
Frontend Form Data               Backend DTO
┌──────────────────┐            ┌──────────────────┐
│ form: {          │ ─PUT──────>│ HuespedDTO {     │
│   id: 1,         │            │   id: 1,         │
│   nombre: "juan",│ Conversión│   nombre: "JUAN",│
│   ...            │   +       │   ...            │
│ }                │ Validación│ }                │
└──────────────────┘            └──────────────────┘
                                        │
                                        ▼
                                   Entity Mapping
                                        │
                                        ▼
                                ┌──────────────────┐
                                │ Huesped {        │
                                │   id: 1,         │
                                │   nombre: "JUAN",│
                                │   ...            │
                                │   direccion: {..}│
                                │ }                │
                                └──────────────────┘
```

---

## Estados del Component

```
ModificarHuespedManager State Management

┌─────────────────────────────────────┐
│ form                                 │
│ └─ GuestData (datos del huésped)    │
├─────────────────────────────────────┤
│ errors                               │
│ └─ { [field]: string } (mensajes)   │
├─────────────────────────────────────┤
│ popupCancel                          │
│ │ popupDocExists                     │
│ │ popupDelete                        │
│ │ popupDeleteConfirm                 │
│ │ popupCannotDelete                  │
│ └─ Estados de popups                │
├─────────────────────────────────────┤
│ toastMsg                             │
│ showToast                            │
│ └─ Toast notifications              │
├─────────────────────────────────────┤
│ isLoading                            │
│ └─ Spinner mientras fetch            │
└─────────────────────────────────────┘
```

---

## Query Parameters Soportados

```
URL: http://localhost:3000/modificar-huesped

Parámetro    Tipo      Valor            Efecto
────────────────────────────────────────────────────────────────
id           number    1-N              ID del huésped a cargar
mock         boolean   true/false       Usa sessionStorage en lugar
                                        del backend

Ejemplos:
────────────────────────────────────────────────────────────────
?id=1
    └─ Carga huésped 1 desde backend

?id=1&mock=true
    └─ Carga huésped 1 desde sessionStorage

?mock=true
    └─ sessionStorage pero sin huésped específico (error)

(sin parámetros)
    └─ No carga nada, form vacío
```

---

## Integración con Otros Componentes

```
BuscarHuespedManager
    │
    ├─ Click en huésped
    │
    ▼
router.push("/modificar-huesped?id=123")
    │
    ▼
page.tsx (modificar-huesped)
    │
    ├─ useSearchParams() → { id: "123" }
    │
    ▼
ModificarHuespedManager
    │
    ├─ huespedId = 123
    │
    ├─ useEffect(() => {
    │     fetch("/api/huespedes/123")
    │   })
    │
    ▼
FormularioModificarHuesped
    │
    ▼
Toast + Redirect "/home"
```

