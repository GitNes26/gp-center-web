# Instrucciones operativas de GP-CENTER-WEB

## Alcance y fuente de verdad

- Este repositorio es el SPA React/Vite de GP Center. La API hermana está en `../gpcenter-back`.
- Antes de cambiar arquitectura, dominio, rutas o permisos, consulta `CONTEXTO_SISTEMA.md` y valida ambos repositorios.
- Para crear, integrar, complementar o corregir páginas, sigue obligatoriamente `CREACION_DE_PAGINAS.md` y su matriz de integración.
- No uses como plantilla archivos con `copy`, `_ORi`, `ORIGINAL` u `OBSOLETO`; son legado hasta que se demuestre lo contrario.

## Convenciones de implementación

- Una pantalla CRUD vigente usa `src/views/<area>/<Entidad>View/{Index,DataTable,Form}.jsx`, un `src/context/<Entidad>Context.jsx`, registro en `src/routes/MainRoutes.jsx` y un menú backend cuya URL coincide exactamente.
- Usa MUI, Formik, Yup, los componentes compartidos y tokens de `src/themes`/`src/assets/scss`; no agregues otra librería de UI/tablas sin necesidad comprobada.
- Consume la API mediante `Axios` o `AxiosFiles` de `AuthContext`, con rutas relativas a `VITE_API`. Respeta el envelope `response.data.data`/`ObjResponse`.
- Mantén PascalCase para componentes/context providers y camelCase para hooks/funciones. Conserva los nombres `snake_case` que vienen de la BD/API.
- Envuelve una ruta solo con los Context que utiliza. No dupliques rutas ni providers.
- Toda acción visible debe considerar `auth.permissions`, pero esto no sustituye autorización de servidor.

## Integridad y seguridad

- No escribas secretos ni valores de `.env` en código o documentación.
- No introduzcas estado nuevo en `localStorage` si es sensible. El token existente es deuda técnica, no patrón de seguridad a ampliar.
- Todo endpoint nuevo/modificado debe tener validación y autorización correspondiente en `../gpcenter-back`.
- No agregues documentos operativos o datos personales a `public` ni al control de versiones.

## Verificación

- Ejecuta `npm test` y `npm run build` para cambios funcionales.
- Ejecuta ESLint sobre los archivos tocados. El lint global tiene miles de fallos heredados y no debe confundirse con una regresión del cambio.
- Para un módulo extremo a extremo, ejecuta también en backend `composer test` y `php artisan route:list --path=api`.
- Añade pruebas para transformaciones, validaciones, permisos y estados; la cobertura actual es mínima.
