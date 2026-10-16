# Creación y modificación de páginas en GP Center

Esta guía define el flujo obligatorio para crear, integrar, complementar o corregir una página o módulo sin duplicar componentes, Contexts, funciones, propiedades, rutas ni estructuras existentes.

La fuente funcional y arquitectónica general sigue siendo `CONTEXTO_SISTEMA.md`. Este documento convierte ese contexto en una lista de decisiones y verificaciones de implementación.

## 1. Regla principal: primero integrar, después crear

Antes de crear cualquier archivo:

1. Identifica el módulo funcional y la entidad de base de datos involucrada.
2. Busca una implementación existente con `rg` en:
   - `src/routes/MainRoutes.jsx`;
   - `src/views/**`;
   - `src/context/**`;
   - `src/components/**`;
   - `src/utils/**`;
   - `../gpcenter-back/routes/gpcenter.routes.php`;
   - `../gpcenter-back/app/Http/Controllers/**`;
   - `../gpcenter-back/app/Models/**`;
   - `../gpcenter-back/database/migrations/**`.
3. Comprueba si la necesidad se resuelve modificando una página, componente, función o endpoint existente.
4. Crea una pieza nueva únicamente cuando tenga una responsabilidad distinta, reutilizable o necesaria para conservar una separación clara.

No usar como referencia archivos con `copy`, `ORIGINAL`, `_ORi` u `OBSOLETO`. No copiar una pantalla completa para cambiar únicamente títulos, campos o endpoints.

## 2. Clasificar el cambio

### Corrección puntual

Modifica el archivo propietario del comportamiento. No agregues un Context, componente o utilidad para una condición usada una sola vez y fácil de entender.

### Ampliación de página existente

Conserva la ruta, View y Context existentes. Agrega campos y acciones en el modelo de estado, validación Formik/Yup, payload, controlador y persistencia que ya pertenecen al módulo.

### Nueva página sobre un dominio existente

Reutiliza el Context y endpoints existentes si representan el mismo agregado. Crea otra View solo cuando la navegación, presentación o flujo sea realmente diferente.

### Nuevo módulo o agregado

Solo este caso justifica normalmente una cadena nueva de migración/modelo/controlador/rutas/Context/View/menú.

## 3. Elegir la pantalla de referencia

Selecciona el módulo activo más cercano por comportamiento, no solo por apariencia:

- CRUD simple de catálogo: `src/views/cove/BrandsView/**` y `src/context/BrandContext.jsx`.
- Entidad con relaciones/selectores: `ModelsView`, `VehiclesView` o `UsersView`.
- Gestión de personas/roles: `EmployeesView`, `MechanicsView`, `VoucherRequestersView`.
- Flujo con estados y acciones: `garage/ServicesView/**`.
- Maestro-detalle/documentos: `cove/VouchersView/**`.
- Consulta consolidada de vehículo: `cove/ShowVehicleView/**`.

No mezcles patrones de varios módulos sin explicar qué responsabilidad aporta cada uno.

## 4. Flujo frontend

### 4.1 Ruta y navegación

1. Define o modifica la ruta en `src/routes/MainRoutes.jsx`.
2. Importa en la parte superior de `MainRoutes.jsx` el Provider de cada Context que la página consume. Usa el export real del archivo, por ejemplo:

   ```jsx
   import VehicleContextProvider from "../context/VehicleContext";
   import BrandContextProvider from "../context/BrandContext";
   ```

3. Envuelve el componente de la página con esos Providers dentro de la propiedad `element`. El Provider propietario del módulo debe quedar próximo a la página; los Providers de catálogos o dependencias se agregan únicamente cuando un componente realmente usa sus hooks:

   ```jsx
   {
      path: "cove/vehiculos",
      element: (
         <VehicleContextProvider>
            <BrandContextProvider>
               <VehiclesView />
            </BrandContextProvider>
         </VehicleContextProvider>
      )
   }
   ```

4. Si la página necesita varios Contexts, importa y monta todos los necesarios una sola vez. Antes de agregarlos, busca si un ancestro de la ruta o el layout ya proporciona alguno; no dupliques Providers en padre e hijo.
5. Verifica que cada llamada `use<Entidad>Context()` ejecutada por la página, sus formularios, tablas o componentes auxiliares tenga un Provider correspondiente por encima en el árbol de `MainRoutes.jsx`.
6. No importes Contexts que la página no consume y no uses un Provider como sustituto de pasar una prop local sencilla.
7. Usa una URL bajo `/admin` coherente con el área funcional.
8. Comprueba que no exista ya la misma ruta y que no haya segmentos ambiguos.
9. Registra la misma URL, carácter por carácter, en `MenuSeeder.php` si debe aparecer en el menú.
10. Si usa permisos o contador, define el permiso adicional y endpoint real; no inventes nombres que el backend no expone.

#### Comprobación de Contexts en la ruta

Antes de terminar, realiza esta correspondencia:

| Uso en la página o descendientes | Requisito en `MainRoutes.jsx` |
|---|---|
| `useVehicleContext()` | importar y montar `VehicleContextProvider` |
| `useBrandContext()` | importar y montar `BrandContextProvider` |
| `useModelContext()` | importar y montar `ModelContextProvider` |
| Cualquier otro `use<Entidad>Context()` | importar y montar el Provider exportado por ese Context |

`AuthContextProvider` y `GlobalContextProvider` ya se montan en `src/main.jsx`; no deben repetirse por página. `MenuContextProvider` ya envuelve `MainLayout` en `MainRoutes.jsx`; solo debe anidarse de nuevo si existe una necesidad comprobada del módulo.

### 4.2 Estructura de una página CRUD

La estructura usual es:

```text
src/views/<area>/<Entidad>View/
  Index.jsx       composición y carga inicial
  DataTable.jsx   listado, filtros y acciones
  Form.jsx        captura, validación y envío
```

Archivos adicionales se justifican únicamente para una responsabilidad independiente, por ejemplo un modal complejo, detalle maestro o documento. Un componente pequeño usado una sola vez puede permanecer en su archivo propietario.

### 4.3 Context de dominio

Crear `src/context/<Entidad>Context.jsx` solo si no existe un propietario adecuado del estado y las operaciones.

El Context puede concentrar:

- estado inicial de la entidad;
- listado y registro seleccionado;
- apertura/cierre de drawer o diálogo si son parte del flujo compartido;
- carga, consulta, creación, actualización, baja y activación;
- recarga del listado después de una mutación;
- nombres singular/plural usados por la página.

No colocar en Context:

- estado visual usado por un único componente;
- valores derivados que pueden calcularse durante render;
- copias de props existentes;
- llamadas de otro dominio que ya tienen Context propietario;
- funciones idénticas con nombres distintos.

Antes de agregar una propiedad al modelo inicial, comprueba que sea uno de estos casos:

- campo persistido o aceptado por la API;
- valor requerido por validación o presentación;
- dato derivado documentado que no se envía accidentalmente al backend.

### 4.4 Index

`Index.jsx` debe ser pequeño y responsable de:

- obtener operaciones del Context;
- ejecutar la carga inicial;
- mostrar título y composición principal;
- conectar tabla, formulario y auxiliares.

Evita duplicar lógica CRUD, payloads o validaciones dentro de `Index.jsx`. Revisa dependencias de `useEffect`; no suprimas advertencias sin justificar por qué la función es estable.

### 4.5 Formulario

- Usa Formik y Yup, siguiendo los componentes existentes de `src/components/Form/**` cuando correspondan.
- Mantén una sola fuente de valores: Formik para campos editables; no dupliques cada campo en `useState`.
- Usa `setFieldValue` únicamente cuando el componente no pueda trabajar con `handleChange`.
- Reutiliza formatos y validaciones de `src/utils/Formats.js` y `src/utils/Validations.js`.
- Construye `FormData` solo si hay archivos. Para JSON normal usa el objeto validado.
- El payload debe contener exclusivamente los campos esperados por la API.
- Al crear/actualizar correctamente: notifica, recarga, resetea y cierra según el patrón del módulo.
- No agregues props que el componente puede obtener de su Context o derivar de `values`.

### 4.6 Tabla y acciones

- Reutiliza la solución de tabla ya usada por el módulo vecino; no introduzcas otra biblioteca.
- Mantén columnas y plantillas dentro de la tabla si no se reutilizan.
- Obtén permisos desde `AuthContext`; la UI debe ocultar/deshabilitar acciones no permitidas.
- Una acción debe llamar a una función real del Context y a un endpoint registrado.
- Confirma identidad: usa `id`, UUID u otra clave según el contrato real; no alternes claves por conveniencia visual.
- Después de mutar, actualiza el estado de forma única: recarga o actualización local, no ambas sin necesidad.

### 4.7 Diseño

- Usa MUI y los tokens del tema existente.
- No declares colores de marca repetidos en componentes si existe token en `src/themes` o `GlobalContext`.
- Conserva el patrón de título con `Typography`, drawer responsivo y feedback global.
- Reutiliza `Toast`, `sAlert`, loaders y botones existentes.
- Valida escritorio, tablet y móvil; los drawers siguen los anchos definidos en `src/index.css`.
- No agregues estilos globales para resolver un caso local.

## 5. Flujo backend y base de datos

### 5.1 Antes de modificar la BD

1. Confirma si el campo ya existe en tabla, vista o modelo.
2. Determina quién es dueño del dato: GP Center o el sistema central.
3. Revisa dependencias en vistas SQL, procedimiento, seeders y archivos.
4. Define nulabilidad, default, unicidad, índice, FK y comportamiento de baja.
5. Nunca edites una migración ya ejecutada como único mecanismo de cambio; crea una migración incremental cuando corresponda.

### 5.2 Modelo

- Nombre singular PascalCase; tabla `snake_case`.
- Declara `$table` cuando la inferencia de Laravel no sea suficiente.
- Agrega a `$fillable` solo campos asignables desde el flujo autorizado.
- Usa un modelo `*View` para vistas SQL de lectura, sin hacer escrituras sobre la vista.
- No crees un modelo si el dato no tiene persistencia/consulta propia.

### 5.3 Controlador

- Reutiliza el controlador del agregado.
- Mantén los métodos existentes: `index`, `selectIndex`, `show`, `create` o `createOrUpdate`, `update`, `destroy`.
- Valida tipos, obligatoriedad, relaciones, archivos, unicidad y reglas de estado en el servidor.
- Autoriza la acción en servidor por rol/permiso. El permiso de React no es suficiente.
- Usa transacción cuando una acción cambia más de una tabla o combina estado, movimiento y archivo.
- Devuelve `ObjResponse` con `status_code`, resultado y mensajes coherentes.
- No devuelvas excepciones, consultas ni rutas internas al cliente en producción.

### 5.4 Ruta API

- Registra bajo `/api/gpCenter` y `auth:sanctum`, salvo login u otra excepción confirmada.
- Usa GET para lectura, POST para creación, PUT/PATCH para actualización y DELETE para baja cuando sea posible.
- No agregues otra ruta de mutación mediante GET.
- Evita rutas que colisionen entre `{id}` y búsquedas dinámicas.
- La ruta escrita en el Context debe existir exactamente en `routes/gpcenter.routes.php`.

### 5.5 Menús, roles y permisos

Si la página es navegable:

1. Agrega/actualiza el registro en `database/seeders/MenuSeeder.php`.
2. Verifica `belongs_to`, `order`, URL, icono, `read_only`, contador y permisos adicionales.
3. No reutilices IDs ocupados ni supongas que el ID será estable sin revisar la estrategia del seeder.
4. Actualiza roles/permiso inicial solo con una decisión funcional confirmada.
5. Implementa el mismo permiso en la API, no únicamente en botones.

## 6. Matriz mínima de integración

Antes de considerar terminada una página, debe poder trazarse lo siguiente:

| Capa | Evidencia requerida |
|---|---|
| Navegación | Ruta React única y, si aplica, menú con la misma URL |
| Composición | `MainRoutes.jsx` importa y monta todos los Context providers consumidos; `Index` monta tabla/formulario sin Providers duplicados |
| Estado | Context existente o nuevo con propietario claro |
| Validación | Yup para UX y validación Laravel para seguridad/integridad |
| API | Método y URL del Context coinciden con `route:list` |
| Respuesta | Manejo del envelope `data`/`ObjResponse` y errores 401/403/422/500 |
| Persistencia | Campo/relación/restricción existe en migración y modelo |
| Permiso | Control visual y autorización de servidor |
| Diseño | Tema/componentes existentes y responsive comprobado |
| Calidad | Pruebas, build y lint focalizado |

Si falta una fila, el flujo no está integrado completamente.

## 7. Control de piezas innecesarias

Antes de agregar cualquier elemento, responde:

### Archivo

- ¿Tiene una responsabilidad distinta?
- ¿Reduce complejidad o solo mueve pocas líneas?
- ¿Ya existe un archivo propietario?
- ¿Se reutilizará o necesita pruebas aisladas?

### Función

- ¿La operación ya existe en Context, utilidad o componente?
- ¿El nombre expresa un comportamiento diferente?
- ¿Evita duplicación real?
- ¿Recibe solo los argumentos necesarios?

### Prop o estado

- ¿El hijo no puede obtenerlo de Context o derivarlo?
- ¿Cambia durante la vida del componente? Si no cambia, no es estado.
- ¿Es fuente de verdad o copia de otro valor?
- ¿Su actualización provoca render necesario?

### Endpoint

- ¿No existe una operación equivalente?
- ¿Pertenece al controlador correcto?
- ¿Tiene método HTTP, validación y autorización correctos?
- ¿El frontend realmente lo consume?

### Campo de BD

- ¿Es un hecho persistente y no un valor calculable?
- ¿Tiene dueño, tipo, restricciones y ciclo de vida definidos?
- ¿Requiere actualizar vistas, seeders, serialización, formularios o reportes?

Si no hay una respuesta clara, no crear la pieza todavía; ampliar la implementación existente o registrar la ambigüedad.

## 8. Flujo específico para modificar o corregir

1. Reproduce o identifica la evidencia exacta del problema.
2. Sigue el dato desde UI → Context → ruta → controlador → modelo/BD → respuesta → UI.
3. Corrige en la capa propietaria de la causa, no en varias capas con parches compensatorios.
4. Conserva el contrato existente cuando sea válido; si cambia, actualiza consumidores, pruebas y documentación juntos.
5. Busca todas las referencias del símbolo, endpoint, campo o estado antes de renombrar/eliminar.
6. Elimina imports, estado, props y código muerto que el mismo cambio deje obsoletos, sin iniciar refactors ajenos.
7. No edites ni reviertas cambios del usuario que no pertenezcan al objetivo.
8. Verifica el flujo feliz, validación, error, permisos y estados vacíos.

## 9. Verificación obligatoria

### Frontend

```powershell
npm test
npm run build
npx eslint <archivos-modificados>
```

El lint global tiene deuda heredada; cualquier archivo nuevo debe quedar limpio y los archivos modificados no deben adquirir errores nuevos.

### Backend

```powershell
composer test
php artisan route:list --path=api
vendor/bin/pint --test
```

Además:

- agrega pruebas Feature para endpoint, validación, autorización y transición;
- no ejecutes migraciones destructivas sobre datos reales sin revisar el ambiente;
- comprueba MySQL/MariaDB cuando intervengan vistas o procedimientos.

### Revisión manual mínima

- usuario con permiso y usuario sin permiso;
- alta, edición, validación y baja/desactivación;
- listado vacío, carga, error de API y sesión expirada;
- datos largos/nulos y relaciones inexistentes;
- escritorio y móvil;
- archivos válidos, inválidos y demasiado grandes cuando aplique.

## 10. Criterio de terminado

Una página o modificación queda terminada cuando:

- el flujo completo está conectado y comprobado;
- no existen rutas, props, estados o funciones sin consumidor;
- no duplica una solución canónica existente;
- frontend y backend coinciden en nombres, métodos, payload y respuesta;
- BD garantiza las restricciones críticas;
- permisos se aplican en UI y API;
- diseño y responsive respetan el sistema actual;
- pruebas relevantes pasan y los riesgos restantes quedan documentados.
