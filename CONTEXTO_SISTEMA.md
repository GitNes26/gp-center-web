# Contexto integral de GP Center

> Fuente de verdad comprobada para desarrollo y mantenimiento. Última revisión: 2026-10-16 (America/Mexico_City).

## 1. Resumen ejecutivo y alcance

GP Center es un sistema web interno para administrar usuarios y permisos, el padrón vehicular, movimientos de unidades, servicios de taller y vales. El alcance revisado contiene dos repositorios hermanos:

- `GP-CENTER-WEB`: SPA React 18 + Vite 4, responsable de autenticación, navegación, formularios, tablas, documentos y flujos de usuario.
- `gpcenter-back`: API Laravel 12 + Sanctum, responsable de autenticación, reglas, persistencia, archivos, vistas SQL y respuestas JSON.

La API expone su dominio bajo `/api/gpCenter`. El frontend usa `VITE_API` como `baseURL` y conserva el token Sanctum y el usuario/permiso resuelto en `localStorage` (`src/context/AuthContext.jsx`). La base se configura por variables `DB_*`; Laravel declara SQLite como fallback, pero las migraciones de vistas y procedimientos usan SQL propio de MySQL, por lo que el sistema real se infiere como MySQL/MariaDB y no es portable a SQLite sin cambios.

No se inspeccionó infraestructura externa, datos productivos ni servicios fuera de las dos raíces. No se copiaron valores de `.env`, credenciales ni datos personales.

## 2. Arquitectura comprobada

```text
Usuario
  -> SPA hash-router (`#/...`)
     -> Layout + menú dinámico por rol
     -> View/Index + Form + DataTable
     -> Context de dominio (estado y llamadas Axios)
        -> Bearer token /api/gpCenter/*
           -> route Laravel
           -> Controller + ObjResponse
           -> Eloquent sobre tablas/vistas SQL
           -> archivos en public/GPCenter (cuando aplica)
           -> JSON { data: { status_code, result, alert_* ... } }
```

### Frontend

| Capa | Responsabilidad | Evidencia |
|---|---|---|
| Arranque | Redux, tema, snackbar, contextos global/auth y RouterProvider | `src/main.jsx`, `src/App.jsx` |
| Rutas | Login en layout mínimo; aplicación en `/admin`; proveedores por pantalla | `src/routes/router.jsx`, `src/routes/MainRoutes.jsx` |
| Shell | Header, sidebar, navegación y personalización MUI | `src/layout/MainLayout/**` |
| Seguridad cliente | Axios, interceptores 401, token y permisos en `localStorage` | `src/context/AuthContext.jsx` |
| Estado de dominio | Un Context por agregado con CRUD y estado de drawer/formulario | `src/context/*Context.jsx` |
| Pantallas | Generalmente `Index.jsx`, `DataTable.jsx`, `Form.jsx`; auxiliares cuando el flujo crece | `src/views/admin/**`, `src/views/cove/**`, `src/views/garage/**` |
| UI compartida | tablas, drawer, formularios, alertas, formatos y PDF | `src/components/**`, `src/utils/**` |
| Diseño | Material UI, tema propio y SCSS/CSS global | `src/themes/**`, `src/assets/scss/**`, `src/index.css` |

### Backend

| Capa | Responsabilidad | Evidencia |
|---|---|---|
| Enrutamiento | Prefijo `api/gpCenter`; login/signup públicos y dominio autenticado con Sanctum | `routes/api.php`, `routes/gpcenter.routes.php` |
| Controladores | CRUD, búsquedas, transiciones y carga de archivos | `app/Http/Controllers/**` |
| Respuesta | Contrato de respuesta compartido | `app/Models/ObjResponse.php` |
| Persistencia | Modelos Eloquent para tablas y modelos de solo lectura para vistas `vw_*` | `app/Models/**` |
| Esquema | Tablas, vistas, procedimiento de historial y seeders | `database/migrations/**`, `database/seeders/**` |
| Integración central | Consulta de acceso y reenvío multipart a otro servicio | `app/Http/Middleware/VerifyCentralAccess.php`, `app/Services/RequestForwarderService.php` |

## 3. Módulos funcionales

### Administración e identidad

- Usuarios, empleados, roles, menús y permisos; vistas especializadas para administradores, mecánicos, directores, conductores y solicitadores.
- Roles activos sembrados: `1 SuperAdmin`, `2 Administrador`, `3 Encargado de Almacen`, `4 Mecánico`, `5 Director`, `6 Conductor`, `7 Admin. Control de Vales`, `8 Director-Solicitador` (`database/seeders/RoleSeeder.php`). Los roles 9–11 están comentados, aunque algunas vistas SQL aún los contemplan.
- Los permisos del rol se almacenan como listas de IDs de menú o el literal `todas`: lectura, creación, actualización, eliminación y permisos adicionales. El frontend obtiene el ID de la URL, calcula booleanos y controla acciones (`src/context/AuthContext.jsx`, `app/Http/Controllers/RoleController.php`).
- El menú es dato persistido, no una lista estática: jerarquía `belongs_to`, URL, icono Tabler, orden, contador y permisos adicionales (`database/migrations/2023_09_02_201720_create_menus_table.php`, `database/seeders/MenuSeeder.php`, `src/context/MenuContext.jsx`).

### Control vehicular (CoVe)

- Catálogos de marcas, modelos y estados; padrón de vehículos y placas.
- La pantalla inicial `/admin/:stock_number?` busca y presenta una unidad; reúne contextos de vehículo, placas, taller, movimientos, asignación/préstamo/entrega y personas (`src/routes/MainRoutes.jsx`, `src/views/cove/ShowVehicleView/**`).
- El historial se registra en `vehicle_movements_log`, con usuario que ejecuta, responsable, estado, km y referencia polimórfica manual (`table_assoc`, `table_assoc_register_id`). También existe `vw_vehicle_movements_log` y el procedimiento `sp_vehicle_history` (`database/migrations/2023_09_05_100001_create_vehicle_movements_log_table.php`, `database/migrations/2025_10_12_184200_create_sp_vehicle_history.php`).

### Taller y servicios

- Una solicitud vincula vehículo, contacto, prediagnóstico, mecánico, solicitante y actores/fechas de aprobación, revisión, rechazo y cierre (`database/migrations/2023_09_04_100010_create_services_table.php`).
- Estados persistidos: `ABIERTA`, `APROBADA`, `RECHAZADA`, `EN REVISIÓN`, `APROBADA POR CV`, `RECHAZADA POR CV`, `CERRADA`.
- `changeStatus` también registra movimiento vehicular y cambia/restaura su estado: por aprobar (7), servicio aprobado (8), en taller/servicio (5), o estado previo según la transición (`app/Http/Controllers/ServiceController.php`).
- Las listas filtradas se apoyan en vistas `vw_services_*`; el frontend traduce segmentos como `abiertas`, `aprobadas`, `en-revision`, etc. (`src/context/ServiceContext.jsx`, `database/migrations/2024_11_21_131731_create_vws_services.php`).
- Inventario, unidades, materiales por servicio y movimientos de inventario sí existen en migraciones, pero su API/UI operativa está incompleta o reutiliza pantallas no específicas.

### Vales

- Cabecera de vale + detalles; solicitante interno/externo, vehículo, oficio, folio, importes/combustible y trazabilidad según el esquema (`database/migrations/2023_09_03_165065_create_vouchers_table.php`, `...165066_create_voucher_details_table.php`).
- Estados: `CREADO`, `ALTA` (default), `VoBo`, `APROBADA`, `CANCELADA`.
- Al cambiar estado se registran actores/fechas correspondientes en `VoucherController::updateStatus`. Para rol 8, las listas se limitan a vales propios no externos; otros roles reciben la lista global (`app/Http/Controllers/VoucherController.php`).
- El frontend contiene generación/visualización PDF y filtros por estado (`src/views/cove/VouchersView/**`, `src/context/VoucherContext.jsx`).

## 4. Actores y permisos

| Actor | Responsabilidad comprobada | Restricción/alcance |
|---|---|---|
| SuperAdmin | Administración integral y roles | Seeder le asigna alcance amplio; falta autorización servidor por endpoint. |
| Administrador | Administración operativa | Rol persistido; la pantalla `/administradores` está duplicada en rutas frontend. |
| Encargado de almacén | Inventario/materiales | Rol y menú existen; ruta/pantalla específica de encargado no está implementada. |
| Mecánico | Revisión/diagnóstico/material/servicio | Vistas de mecánico y transiciones de servicio. |
| Director | Solicitudes y responsabilidad departamental | Se vincula a empleado/departamento; también puede ser solicitador. |
| Conductor | Responsable operativo de vehículo | Vista basada en usuario/empleado por rol. |
| Admin. de vales | Gestión de estados y documentos | Menús/permisos adicionales definen aprobar, cancelar, VoBo y generar. |
| Director-Solicitador | Crea/consulta sus vales | Backend filtra por `requested_by` y excluye externos. |
| API central (no humana) | Verificar acceso/receptar altas de empleados | Configurada, pero el middleware `verify.central` no está aplicado a las rutas revisadas. |

**Límite de seguridad comprobado:** todas las rutas de dominio están dentro de `auth:sanctum`, pero no se observan middleware/policies/gates que apliquen por endpoint los permisos de menú/CRUD. El frontend oculta/redirige según datos modificables en `localStorage`. Por tanto, autenticación sí está aplicada; autorización fina de servidor no queda comprobada.

## 5. Flujos extremo a extremo

### Inicio de sesión y navegación

1. Login envía credenciales a `POST /login` desde `AuthContext`.
2. Laravel valida usuario activo, crea token Sanctum y devuelve usuario/rol (`UserController::login`).
3. El frontend guarda token y usuario en `localStorage`; interceptores agregan `Authorization: Bearer` y limpian sesión ante 401.
4. `MenuContext` solicita menús por rol/lista de lectura, genera grupos/items dinámicos y sus contadores.
5. Al entrar a una URL, `validateAccessPage` obtiene el menú por URL, calcula permisos y puede redirigir a `page_index`.
6. Excepción: no se comprobó autorización equivalente en servidor.

### CRUD de catálogo (patrón de referencia: Marcas)

1. `MainRoutes` monta `BrandContextProvider` y `BrandsView`.
2. `Index.jsx` carga registros, presenta título y compone `DataTable` + `Form`.
3. `DataTable.jsx` controla lista y acciones según permisos; editar rellena el modelo y abre el drawer.
4. `Form.jsx` usa Formik + Yup, componentes MUI, formatos comunes, drawer y loading global.
5. `BrandContext.jsx` llama `GET/POST /brands...`, normaliza notificaciones y vuelve a cargar la lista.
6. `BrandController` usa `Brand`, `ObjResponse` y devuelve HTTP según `status_code`.

### Solicitud y ciclo de servicio

1. Desde una unidad se solicita servicio; backend rechaza vehículos en estados incompatibles (IDs 5, 7, 8).
2. Se crea la solicitud `ABIERTA` y queda “por aprobar”.
3. Control vehicular aprueba o rechaza; aprobar mueve la unidad a estado 8 y registra movimiento.
4. Mecánico inicia revisión (`EN REVISIÓN`), mueve la unidad a estado 5 y puede cargar material.
5. Existen estados de decisión de material por CV; al cerrar se restaura el estado vehicular previo y se registra el movimiento.
6. Excepciones se convierten en `ObjResponse::CatchResponse`; no se comprobó transacción atómica entre servicio, vehículo y movimiento.

### Ciclo de vale

1. Se crea cabecera en `ALTA` (o estado enviado) y se agregan detalles.
2. Los listados filtran por estado y, para rol 8, por solicitante autenticado.
3. `updateStatus` aplica `VoBo`, `APROBADA` o `CANCELADA` y sella actor/fecha/comentarios.
4. La UI permite documentos/PDF y acciones adicionales según permisos.
5. No se encontró una máquina de estados que impida saltos arbitrarios; el endpoint recibe el estado en la URL.

## 6. Datos y convenciones de base de datos

- Nombres de tablas en `snake_case`, plural salvo `inventory`, `service_material` y `vehicle_status`.
- IDs numéricos autoincrementales; varias entidades organizativas/empleados también usan identificadores externos/UUID.
- Patrón común: `active`, timestamps y `deleted_at` manual. Los modelos no muestran uso consistente del trait `SoftDeletes`; muchas bajas son lógicas controladas explícitamente.
- Catálogos: `roles`, `menus`, `brands`, `models`, `vehicle_status`, `measurement_units`, `inventory`.
- Identidad/organización: `users`, `employees`, `employee_details`, `departments`, `department_directors` y vistas de personas por rol.
- Vehículos: `vehicles`, `vehicle_plates`, `vehicle_movements_log` y vistas/procedimiento de detalle/historial.
- Taller: `services`, `service_material`, `inventory_records` y vistas por estado.
- Vales: `vouchers`, `voucher_details`, `vouchers_settings` y `vw_vouchers`.
- Los modelos de vistas se nombran `*View`; el modelo de modelos vehiculares se llama `mModel` para evitar colisión semántica.
- Antes de agregar una entidad: migración con FKs/índices/unicidad real, modelo con `$table`/`$fillable`, vista SQL solo si el listado requiere datos denormalizados, seeder si es catálogo estable, controlador y rutas alineadas exactamente con el Context.

## 7. Convenciones para crear una página o módulo

### Frontend (patrón vigente que debe conservarse)

1. Crear `src/views/<area>/<Entidad>View/` con `Index.jsx`, `DataTable.jsx`, `Form.jsx`; agregar componentes auxiliares solo si tienen una responsabilidad clara.
2. Crear `src/context/<Entidad>Context.jsx`: estado inicial, singular/plural, listado, modelo editable, banderas de drawer/dialog, CRUD y hook `use...Context`.
3. Registrar ruta en `src/routes/MainRoutes.jsx` y envolver solo los Context realmente requeridos. Evitar duplicar proveedores en padre/hijo.
4. Agregar menú en `MenuSeeder.php` con URL idéntica a la ruta, icono Tabler existente, jerarquía, orden, contador/permisos adicionales; migrar/sembrar conscientemente, sin depender de IDs accidentales.
5. En `Index`: cargar en `useEffect`, activar loading global, título MUI y composición tabla/formulario.
6. En `Form`: Formik + Yup, `SwipeableDrawer`/componentes compartidos, `LoadingButton`, formatos de `src/utils/Formats.js`, feedback mediante `Toast`/`sAlert` y permisos de `AuthContext`.
7. En tabla: reutilizar los componentes existentes adecuados; no copiar variantes `copy`, `_ORi` u `OBSOLETO`.
8. Usar `Axios`/`AxiosFiles` exportados por `AuthContext`, `VITE_API`, rutas relativas y el contrato `response.data.data`.
9. Mantener nombres: componentes/clases en PascalCase; hooks/funciones/variables en camelCase; endpoints y campos siguiendo el nombre persistido existente.
10. Añadir pruebas de transformación/negocio y ejecutar `npm test`, `npm run build` y lint focalizado. El lint global actualmente no es baseline válido.

### Backend

1. Migración y, si aplica, vista SQL; declarar restricciones de unicidad/FK en BD, no solo en UI.
2. Modelo singular PascalCase; `$table` cuando Laravel no pueda inferirlo; `$fillable` mínimo; modelo `*View` para consultas denormalizadas.
3. Controlador PascalCase con métodos coherentes (`index`, `selectIndex`, `show`, `create`/`createOrUpdate`, `update`, `destroy`). No introducir una tercera variante de rutas CRUD.
4. Registrar bajo el grupo Sanctum y aplicar autorización de servidor por permiso/rol.
5. Validar request en backend, usar transacción para cambios multientidad y devolver siempre el contrato `ObjResponse` con HTTP concordante.
6. Para archivos, validar MIME/tamaño, generar nombre servidor, almacenar fuera de rutas públicas si son documentos sensibles y no desactivar TLS en integraciones.
7. Añadir pruebas Feature del endpoint, autorización, validación y transición; ejecutar `composer test`, `php artisan route:list --path=api` y `vendor/bin/pint --test`.

### Diseño visual y composición

- Sistema base: MUI con Roboto; colores/tokens en `src/assets/scss/_themes-vars.module.scss`, paleta en `src/themes/palette.js`, tipografía en `src/themes/typography.js` y overrides en `src/themes/compStyleOverride.js`.
- Colores de marca accesibles mediante `palette.myColors` y constantes del `GlobalContext`; no agregar colores aislados si existe token.
- Formularios administrativos aparecen como drawer responsivo: ancho máximo 35vw, 50vw bajo 1500px, 80vw bajo 1040px y 95vw bajo 420px (`src/index.css`).
- Títulos de pantalla usan `Typography variant="h1"`, color de marca y alineación central. Feedback: backdrop global, Snackbar/Toast y SweetAlert.
- Se mezclan tablas PrimeReact/MUI/mui-datatables/ag-grid. Para módulos nuevos, partir del módulo funcional más cercano y no sumar otra biblioteca.
- Router con hash (`createHashRouter`) y URLs bajo `/admin`; el menú, la ruta y el seeder deben coincidir carácter por carácter.

## 8. Integraciones e infraestructura

- Sanctum: tokens personales en cabecera Bearer.
- Un servicio central se configura en `config/services.php`; `VerifyCentralAccess` consulta acceso por `system_code`, y `RequestForwarderService` reenvía formularios/archivos. Su aplicación efectiva es parcial/no comprobada.
- Archivos de vehículos y empleados se encuentran directamente en `gpcenter-back/public/GPCenter/**`; esto permite servirlos por URL pero mezcla artefactos operativos con el repositorio.
- Vite construye el SPA; Laravel conserva además su propio esqueleto Vite/Tailwind, sin evidencia de que sirva el SPA React.
- No se encontraron Docker/CI/CD ni definición de despliegue en el alcance.

## 9. Contradicciones, errores y riesgos

### Críticos/altos

1. **Autorización incompleta:** Sanctum autentica, pero permisos CRUD/menú se aplican visiblemente en cliente y no mediante policies/middleware de API. Un usuario autenticado podría intentar endpoints fuera de su UI.
2. **Rutas cliente-servidor divergentes:** entre otros, `AdministratorContext` y contextos de director/conductor llaman variantes `/users/*/role_id/*` no registradas; `ModelContext` pide `/models/selectIndex` pero backend expone `/models/brand/{brand_id}`; `RoleContext` usa `/roles/update` sin ID y `/roles/destoy`; `MenuContext` pide `/menus/counterOfMenus`; contextos de asignación/préstamo/entrega consumen rutas comentadas. Estos flujos no son confiables sin conciliación.
3. **Cambios de estado mediante GET:** servicios, activación/desactivación, bajas de empleados/mecánicos y otras mutaciones usan GET. Rompe semántica HTTP, habilita caché/prefetch accidental y dificulta CSRF/auditoría.
4. **Datos operativos en `public` y versionados:** hay documentos/imágenes de vehículos y empleados en `public/GPCenter`; pueden ser sensibles y agrandan el repositorio.
5. **TLS deshabilitado:** `RequestForwarderService` usa `verify => false` para HTTPS.

### Medios

6. `signup` está fuera de Sanctum; debe confirmarse si el registro público es intencional.
7. `MainRoutes.jsx` contiene `/administradores` dos veces, una coma suelta y numerosos proveedores anidados/duplicados.
8. La máquina de estados no valida claramente transiciones permitidas; los endpoints aceptan estado por path y no se observó transacción atómica en cambios multientidad.
9. Migraciones, modelos y controladores muestran legado/copia (`copy`, `_ORi`, `OBSOLETO`) y controladores sin rutas activas, lo que dificulta identificar código canónico.
10. README de ambos repositorios es esencialmente de plantilla y no describe instalación real, variables, BD o despliegue.
11. El build produce bundle JS principal de 6.38 MB (1.49 MB gzip) y activos de imagen de 17.4/21.5 MB; solo login/register están claramente lazy-loaded.
12. CSS genera advertencia de anidamiento inválido en un selector `input...`; un sourcemap de `RequestServiceCardInfo.jsx` tampoco resuelve ubicación.
13. El contrato de rutas CRUD es inconsistente (`POST destroy`, `GET delete`, `createOrUpdate`, rutas con/sin ID), elevando errores de integración.
14. La portabilidad declarada a SQLite contradice vistas/procedimientos SQL específicos y no hay prueba real de migración completa.

### Calidad y pruebas

- `npm test`: 4 pruebas pasan, limitadas a `employeeVoucherDetail`.
- `composer test`: 2 pruebas de ejemplo pasan; no cubren dominio, auth, BD ni API.
- `npm run build`: pasa con advertencias; bundle y activos muy grandes.
- `npm run lint`: falla con 2,759 errores y 151 advertencias, incluidos `no-undef`, imports sin uso, props sin validar y dependencias de hooks. Parte proviene de un plugin de partículas incluido en `src`, pero hay errores reales en código aplicativo.
- No se halló pipeline CI ni pruebas E2E.

## 10. Preguntas abiertas

1. ¿Qué motor/versión de BD usa cada ambiente y cuál es el procedimiento oficial para importar datos/vistas?
2. ¿GP Central es obligatorio en producción? ¿Cuál sistema es dueño de empleados/departamentos y qué ocurre si falla el reenvío?
3. ¿El alta pública (`signup`) y las rutas legacy comentadas deben conservarse?
4. ¿Cuáles transiciones de servicio y vale son legales por rol? El código define efectos, pero no una matriz completa de transición/autorización.
5. ¿Qué archivos de `public/GPCenter` son datos productivos que deben migrarse a almacenamiento privado?
6. ¿Hay módulos de becas, almacén, asignación, préstamo y entrega que deban reactivarse, o son legado a retirar?
7. ¿Cuál es el procedimiento de despliegue, URL pública, política de respaldos y observabilidad?

## 11. Mapa de evidencia

| Tema | Rutas principales |
|---|---|
| Dependencias/build | `GP-CENTER-WEB/package.json`, `gpcenter-back/composer.json`, `gpcenter-back/package.json` |
| Bootstrap frontend | `src/main.jsx`, `src/App.jsx` |
| Navegación/páginas | `src/routes/router.jsx`, `src/routes/MainRoutes.jsx`, `src/views/**` |
| Autenticación/permisos | `src/context/AuthContext.jsx`, `src/context/MenuContext.jsx`, `app/Http/Controllers/UserController.php`, `RoleController.php`, `MenuController.php` |
| API completa | `routes/api.php`, `routes/gpcenter.routes.php` |
| Respuestas | `app/Models/ObjResponse.php`, `src/utils/Response.js` |
| Persistencia | `database/migrations/**`, `app/Models/**` |
| Roles/menús | `database/seeders/RoleSeeder.php`, `database/seeders/MenuSeeder.php` |
| Vehículos | `VehicleController.php`, `VehicleMovementLogController.php`, `src/context/VehicleContext.jsx` |
| Taller | `ServiceController.php`, `src/context/ServiceContext.jsx`, `src/views/garage/ServicesView/**` |
| Vales | `VoucherController.php`, `VoucherDetailController.php`, `src/context/VoucherContext.jsx`, `src/views/cove/VouchersView/**` |
| Diseño | `src/themes/**`, `src/assets/scss/**`, `src/index.css`, `src/components/**` |
| Integración central | `config/services.php`, `VerifyCentralAccess.php`, `RequestForwarderService.php` |

## 12. Estado de esta revisión

Comprobado mediante lectura de manifiestos, rutas, contextos, vistas, controladores, modelos, migraciones y seeders; inventario de 135 rutas API; ejecución de pruebas y build. Las conclusiones sobre autorización, infraestructura y módulos incompletos están etiquetadas como límites o riesgos donde no existe evidencia suficiente.
