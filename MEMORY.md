# Memoria durable de GP Center

- Producto interno para administración, control vehicular, taller/servicios y vales.
- Frontend: React 18 + Vite 4 + MUI, hash router, Context por dominio, Formik/Yup y Axios.
- Backend hermano: `../gpcenter-back`, Laravel 12/PHP 8.2, Sanctum y API bajo `/api/gpCenter`.
- Persistencia efectiva depende de SQL con vistas/procedimientos compatibles con MySQL; SQLite es solo fallback de configuración y no está validado para el esquema completo.
- Patrón canónico de pantalla: ruta + ContextProvider + `views/<area>/<Entidad>View/{Index,DataTable,Form}.jsx` + endpoint/modelo/migración + menú sembrado con URL idéntica.
- Guía operativa obligatoria para crear o modificar páginas: `CREACION_DE_PAGINAS.md`; exige buscar/reutilizar antes de crear y trazar UI → Context → API → BD → respuesta.
- Roles activos sembrados: SuperAdmin, Administrador, Encargado de Almacen, Mecánico, Director, Conductor, Admin. Control de Vales y Director-Solicitador.
- Estados de servicio: ABIERTA, APROBADA, RECHAZADA, EN REVISIÓN, APROBADA POR CV, RECHAZADA POR CV, CERRADA.
- Estados de vale: CREADO, ALTA, VoBo, APROBADA, CANCELADA.
- Riesgos pendientes: autorización fina solo comprobada en cliente, endpoints frontend/backend divergentes, mutaciones por GET, archivos operativos en `public`, TLS deshabilitado en forwarder, legado duplicado, cobertura mínima y lint global fallido.
- Verificación 2026-10-16: frontend 4 pruebas pasan; backend 2 pruebas de ejemplo pasan; build frontend pasa con advertencias y bundle grande; 135 rutas API inventariadas.
- Fuente extensa: `CONTEXTO_SISTEMA.md`.
