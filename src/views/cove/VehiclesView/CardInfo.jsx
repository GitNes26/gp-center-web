import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useVehicleContext } from "../../../context/VehicleContext";
import { ModalComponent } from "../../../components/ModalComponent";
import { formatDatetime } from "../../../utils/Formats";

const HOST = import.meta.env.VITE_HOST;

// ─── Utilidades ───────────────────────────────────────────────────────────────

function contrastColor(hex = "#000000") {
   const h = hex.replace("#", "");
   const r = parseInt(h.slice(0, 2), 16);
   const g = parseInt(h.slice(2, 4), 16);
   const b = parseInt(h.slice(4, 6), 16);
   return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000" : "#fff";
}

function daysUntil(dateStr) {
   if (!dateStr) return null;
   return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function fmtDate(str) {
   if (!str) return null;
   return formatDatetime(str, false);
}

function buildInitials(name, paternal, maternal) {
   const parts = [name, paternal, maternal].filter(Boolean);
   if (!parts.length) return "?";
   return parts
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
}

// ─── Ángulos de fotos ─────────────────────────────────────────────────────────
const ANGLES = [
   { key: "img_preview", label: "General" },
   { key: "img_front", label: "Frente" },
   { key: "img_right", label: "Derecho" },
   { key: "img_back", label: "Trasera" },
   { key: "img_left", label: "Izquierdo" }
];

// ─── Galería: imagen principal grande + tira de ángulos vertical ──────────────
function VehicleGallery({ v, bg }) {
   const available = ANGLES.filter(({ key }) => v[key]);
   const [active, setActive] = useState(0);

   if (!available.length) return null;

   const current = available[active];

   return (
      <Box sx={{ display: "flex" }}>
         {/* Imagen principal */}
         <Box sx={{ flex: 1, position: "relative", bgcolor: `${bg}CC`, minWidth: 0, maxHeight: "350px" }}>
            <Box
               component="img"
               src={v[current.key]}
               alt={current.label}
               sx={{
                  width: "100%",
                  height: "350px",
                  objectFit: "contain",
                  display: "block"
               }}
            />
            {/* Etiqueta del ángulo activo */}
            <Box
               sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 10,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  fontSize: 10,
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  letterSpacing: 0.3,
                  pointerEvents: "none"
               }}
            >
               {current.label}
            </Box>
         </Box>

         {/* Tira vertical de ángulos */}
         <Box sx={{ width: 80, flexShrink: 0, display: "flex", flexDirection: "column" }}>
            {available.map(({ key, label }, i) => (
               <Box
                  key={key}
                  onClick={() => setActive(i)}
                  sx={{
                     flex: 1,
                     height: 200 / available.length,
                     cursor: "pointer",
                     position: "relative",
                     overflow: "hidden",
                     borderLeft: i === active ? "2px solid rgba(255,255,255,0.55)" : "0.5px solid rgba(255,255,255,0.1)",
                     borderBottom: i < available.length - 1 ? "0.5px solid rgba(255,255,255,0.07)" : "none",
                     bgcolor: i === active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
                     transition: "background 0.15s",
                     "&:hover": { bgcolor: "rgba(255,255,255,0.14)" }
                  }}
               >
                  <Box
                     component="img"
                     src={v[key]}
                     alt={label}
                     sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: i === active ? 1 : 0.65,
                        transition: "opacity 0.15s"
                     }}
                  />
                  {/* Label del ángulo */}
                  <Typography
                     sx={{
                        position: "absolute",
                        bottom: 3,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontSize: 8,
                        color: i === active ? "#fff" : "rgba(255,255,255,0.55)",
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                        pointerEvents: "none"
                     }}
                  >
                     {label}
                  </Typography>
               </Box>
            ))}
         </Box>
      </Box>
   );
}

// ─── Hero completo ────────────────────────────────────────────────────────────
function VehicleHero({ v, bg, fg }) {
   return (
      <Box sx={{ bgcolor: bg }}>
         {/* Identidad */}
         <Box
            sx={{
               px: 2.5,
               pt: 2.25,
               display: "flex",
               justifyContent: "space-between",
               alignItems: "flex-start",
               gap: 1.5,
               flexWrap: "wrap",
               mb: 1.5
            }}
         >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
               {/* Logo de marca o iniciales */}
               {v.brand_img ? (
                  <Box
                     component="img"
                     src={v.brand_img}
                     alt={v.brand}
                     sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "contain",
                        bgcolor: "rgba(255,255,255,0.12)",
                        border: "0.5px solid rgba(255,255,255,0.2)",
                        p: 0.5,
                        flexShrink: 0
                     }}
                  />
               ) : (
                  <Box
                     sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.12)",
                        border: "0.5px solid rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 500,
                        color: `${fg}CC`,
                        flexShrink: 0
                     }}
                  >
                     {v.brand?.slice(0, 3) ?? "VH"}
                  </Box>
               )}

               <Box>
                  <Typography sx={{ fontSize: 9, letterSpacing: 2, color: `${fg}70`, textTransform: "uppercase", mb: 0.5 }}>
                     Ficha técnica · Unidad #{v.stock_number}
                  </Typography>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: fg, lineHeight: 1.1, mb: 0.3 }}>
                     {v.brand}
                     {v.model && v.model !== "Selecciona una opción..." ? ` ${v.model}` : ""}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: `${fg}99` }}>{[v.year, v.description?.split(/\r?\n/)[0]].filter(Boolean).join(" · ")}</Typography>
               </Box>
            </Box>

            {/* Badges */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.75, flexShrink: 0 }}>
               <Box
                  sx={{
                     display: "inline-flex",
                     alignItems: "center",
                     gap: 0.6,
                     px: 1.25,
                     py: 0.5,
                     borderRadius: "100px",
                     bgcolor: "rgba(255,255,255,0.14)",
                     color: fg,
                     fontSize: 10,
                     fontWeight: 600,
                     letterSpacing: 0.4,
                     textTransform: "uppercase"
                  }}
               >
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: v.active ? "#66ee99" : "#ff6b6b" }} />
                  {v.vehicle_status}
               </Box>

               {v.plates && (
                  <Box
                     sx={{
                        bgcolor: "rgba(255,255,255,0.11)",
                        border: "0.5px solid rgba(255,255,255,0.22)",
                        color: fg,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: 2,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 1,
                        fontFamily: "monospace"
                     }}
                  >
                     {v.plates}
                  </Box>
               )}
            </Box>
         </Box>

         {/* Nota de estado */}
         {v.vehicle_status_description && (
            <Box
               sx={{
                  mx: 2.5,
                  px: 1.5,
                  py: 0.85,
                  bgcolor: "rgba(255,255,255,0.07)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px 6px 0 0",
                  borderBottom: "none"
               }}
            >
               <Typography sx={{ fontSize: 11, color: `${fg}AA`, lineHeight: 1.5 }}>{v.vehicle_status_description}</Typography>
            </Box>
         )}

         {/* Galería */}
         <VehicleGallery v={v} bg={bg} />
      </Box>
   );
}

// ─── Primitivos ───────────────────────────────────────────────────────────────

function StatChip({ label, value, mono }) {
   if (value === null || value === undefined) return null;
   return (
      <Box sx={{ bgcolor: "grey.50", border: "0.5px solid", borderColor: "divider", borderRadius: 1.5, px: 1.5, py: 1.1 }}>
         <Typography sx={{ fontSize: 10, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.4, mb: 0.25 }}>{label}</Typography>
         <Typography sx={{ fontSize: 13, fontWeight: 600, fontFamily: mono ? "monospace" : undefined }}>{value}</Typography>
      </Box>
   );
}

function Group({ icon, title, iconBg, iconColor, children }) {
   return (
      <Box sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: "10px", overflow: "hidden", mb: 1.25 }}>
         <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1, bgcolor: "grey.50", borderBottom: "0.5px solid", borderColor: "divider" }}>
            <Box
               sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  bgcolor: iconBg,
                  color: iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 14
               }}
            >
               {icon}
            </Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.2 }}>{title}</Typography>
         </Box>
         <Box sx={{ px: 1.5, py: 0.25 }}>{children}</Box>
      </Box>
   );
}

function Row({ label, value, mono, valueColor, nullText, children }) {
   const isEmpty = value === null || value === undefined || value === "";
   if (isEmpty && !nullText && !children) return null;
   return (
      <Box sx={{ display: "flex", alignItems: "flex-start", py: 0.75, "&:not(:last-child)": { borderBottom: "0.5px solid", borderColor: "divider" } }}>
         <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 10, color: "text.secondary", lineHeight: 1.2, mb: 0.2 }}>{label}</Typography>
            {isEmpty && nullText ? (
               <Typography sx={{ fontSize: 12, color: "text.disabled", fontStyle: "italic" }}>{nullText}</Typography>
            ) : (
               value && (
                  <Typography
                     sx={{ fontSize: 12, fontWeight: 600, fontFamily: mono ? "monospace" : undefined, wordBreak: "break-all", color: valueColor || "text.primary" }}
                  >
                     {value}
                  </Typography>
               )
            )}
            {children}
         </Box>
      </Box>
   );
}

function DocLink({ href, label = "Ver PDF" }) {
   if (!href) return null;
   return (
      <Box
         component="a"
         href={href}
         target="_blank"
         rel="noopener noreferrer"
         sx={{ display: "inline-flex", alignItems: "center", gap: 0.3, fontSize: 11, fontWeight: 600, color: "primary.main", textDecoration: "none", mt: 0.25 }}
      >
         ↗ {label}
      </Box>
   );
}

// ─── Persona (director / conductor) ──────────────────────────────────────────
function PersonRow({ avatarSrc, name, paternal, maternal, department, cellphone, email, folio, dateLabel, date }) {
   const hasData = !!(name || paternal);
   const fullName = [name, paternal, maternal].filter(Boolean).join(" ");
   const ini = buildInitials(name, paternal, maternal);

   if (!hasData) {
      return (
         <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 1 }}>
            <Box
               sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "grey.100",
                  border: "0.5px dashed",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
               }}
            >
               <Typography sx={{ fontSize: 16, color: "text.disabled" }}>—</Typography>
            </Box>
            <Box>
               <Typography sx={{ fontSize: 12, color: "text.secondary", fontStyle: "italic" }}>Sin asignar</Typography>
               {folio && <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 0.25 }}>Folio: {folio}</Typography>}
            </Box>
         </Box>
      );
   }

   return (
      <Box sx={{ py: 0.75 }}>
         <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.75 }}>
            {avatarSrc ? (
               <Box component="img" src={avatarSrc} alt={fullName} sx={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            ) : (
               <Box
                  sx={{
                     width: 36,
                     height: 36,
                     borderRadius: "50%",
                     bgcolor: "#E6F1FB",
                     color: "#185FA5",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     fontSize: 12,
                     fontWeight: 700,
                     flexShrink: 0
                  }}
               >
                  {ini}
               </Box>
            )}
            <Box>
               <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{fullName}</Typography>
               {department && <Typography sx={{ fontSize: 10, color: "text.secondary" }}>{department}</Typography>}
            </Box>
         </Box>
         {folio && (
            <Typography sx={{ fontSize: 10, color: "text.secondary", mb: 0.25 }}>
               Folio: <strong>{folio}</strong>
            </Typography>
         )}
         {date && (
            <Typography sx={{ fontSize: 10, color: "text.secondary", mb: 0.25 }}>
               {dateLabel}: {fmtDate(date)}
            </Typography>
         )}
         {cellphone && <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.2 }}>Tel: {cellphone}</Typography>}
         {email && <Typography sx={{ fontSize: 11, color: "primary.main" }}>{email}</Typography>}
      </Box>
   );
}

// ─── Indicador de vigencia de seguro ─────────────────────────────────────────
function InsuranceBadge({ days }) {
   if (days === null) return null;
   const { text, color } =
      days < 0
         ? { text: `Venció hace ${Math.abs(days)} días`, color: "error.dark" }
         : days <= 30
           ? { text: `Por vencer · ${days} días`, color: "warning.dark" }
           : { text: `Vigente · ${days} días restantes`, color: "success.dark" };
   return <Typography sx={{ fontSize: 10, fontWeight: 600, color, mt: 0.25 }}>{text}</Typography>;
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function VehicleCardInfo({ vehicle: vehicleProp = null }) {
   const { openCardInfo, setOpenCardInfo } = useGlobalContext();
   const { vehicle: vehicleCtx } = useVehicleContext();
   const v = vehicleProp ?? vehicleCtx;

   if (!v) return null;

   const bg = v.bg_color || "#1976d2";
   const fg = contrastColor(bg);
   const days = daysUntil(v.due_date);

   // Departamento extraído de la descripción (2ª línea)
   const dept = v.description?.split(/\r?\n/)[1]?.replace("DEPARTAMENTO:", "").trim();

   // Swatch de color institucional
   const colorSwatch = v.bg_color ? (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.25 }}>
         <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: v.bg_color, border: "0.5px solid", borderColor: "divider", flexShrink: 0 }} />
         <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: "monospace" }}>{v.bg_color}</Typography>
      </Box>
   ) : null;

   return (
      <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo}>
         {/* ── Hero con galería mejorada ── */}
         <Box sx={{ mx: -3, mt: -3, mb: 2 }}>
            <VehicleHero v={v} bg={bg} fg={fg} />
         </Box>

         {/* ── Stats rápidas ── */}
         <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 0.9, mb: 2 }}>
            <StatChip label="Año" value={v.year} />
            <StatChip label="Licencia" value={v.acceptable_license_type} />
            <StatChip label="Cód. gasolina" value={v.gasoline_code} mono />
            <StatChip label="No. económico" value={v.stock_number} />
         </Box>

         {/* ── Grid 2 columnas ── */}
         <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 1.25 }}>
            {/* ── Columna izquierda ── */}
            <Box>
               <Group icon="🪪" title="Identificación" iconBg="#E6F1FB" iconColor="#185FA5">
                  <Row label="No. de serie" value={v.serial_number} mono>
                     {v.img_serial_number && <DocLink href={v.img_serial_number} label="Ver imagen" />}
                  </Row>
                  <Row label="Tarjeta de circulación" value={v.circulation_card}>
                     <DocLink href={v.img_circulation_card} />
                  </Row>
                  <Row label="Fecha de registro" value={fmtDate(v.registration_date)} />
                  {dept && <Row label="Departamento" value={dept} />}
               </Group>

               <Group icon="🛡" title="Seguro vehicular" iconBg="#E1F5EE" iconColor="#0F6E56">
                  <Row label="Póliza" value={v.insurance_policy} mono>
                     <DocLink href={v.img_insurance_policy} />
                  </Row>
                  <Row label="Vigencia" value={v.initial_date && v.due_date ? `${fmtDate(v.initial_date)} — ${fmtDate(v.due_date)}` : fmtDate(v.due_date)}>
                     <InsuranceBadge days={days} />
                  </Row>
               </Group>

               <Group icon="ℹ" title="Estado del registro" iconBg="#F1EFE8" iconColor="#5F5E5A">
                  <Row label="Activo en sistema" value={v.active ? "Activo" : "Inactivo"} valueColor={v.active ? "success.dark" : "error.dark"} />
                  <Row label="Multa / violación" value={v.violated} nullText="Sin registros" valueColor="error.dark" />
                  <Row label="Resguardo" value={v.shelter_to} nullText="No asignado" />
                  <Row label="Última actualización" value={fmtDate(v.updated_at)} />
               </Group>
            </Box>

            {/* ── Columna derecha ── */}
            <Box>
               <Group icon="👤" title="Director asignado" iconBg="#EEEDFE" iconColor="#534AB7">
                  <PersonRow
                     avatarSrc={v.dir_avatar}
                     name={v.dir_name}
                     paternal={v.dir_plast_name}
                     maternal={v.dir_mlast_name}
                     department={v.dir_department}
                     cellphone={v.dir_cellphone}
                     email={v.dir_email}
                     folio={v.ass_folio}
                     dateLabel="Asignado el"
                     date={v.ass_date}
                  />
               </Group>

               <Group icon="🚗" title="Conductor en préstamo" iconBg="#FAEEDA" iconColor="#854F0B">
                  <PersonRow
                     avatarSrc={v.dri_avatar}
                     name={v.dri_name}
                     paternal={v.dri_plast_name}
                     maternal={v.dri_mlast_name}
                     department={v.dri_department}
                     cellphone={v.dri_cellphone}
                     email={v.dri_email}
                     folio={v.loa_folio}
                     dateLabel="Préstamo desde"
                     date={v.dri_date}
                  />
               </Group>

               <Group icon="⚙" title="Datos operativos" iconBg="#F1EFE8" iconColor="#5F5E5A">
                  <Row label="Tipo de licencia requerida" value={v.acceptable_license_type} />
                  <Row label="Código de gasolina" value={v.gasoline_code} mono />
                  <Row label="Color institucional">{colorSwatch}</Row>
               </Group>
            </Box>
         </Box>
      </ModalComponent>
   );
}

// import React, { useState } from "react";
// import { Box, Typography } from "@mui/material";
// import { useGlobalContext } from "../../../context/GlobalContext";
// import { useVehicleContext } from "../../../context/VehicleContext";
// import { ModalComponent } from "../../../components/ModalComponent";
// import { formatDatetime } from "../../../utils/Formats";

// const HOST = import.meta.env.VITE_HOST;

// // ─── Utilidades ───────────────────────────────────────────────────────────────

// function contrastColor(hex = "#000000") {
//    const h = hex.replace("#", "");
//    const r = parseInt(h.slice(0, 2), 16);
//    const g = parseInt(h.slice(2, 4), 16);
//    const b = parseInt(h.slice(4, 6), 16);
//    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000" : "#fff";
// }

// function daysUntil(dateStr) {
//    if (!dateStr) return null;
//    return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
// }

// function fmtDate(str) {
//    if (!str) return null;
//    return formatDatetime(str, false);
// }

// function initials(name, paternal, maternal) {
//    const parts = [name, paternal, maternal].filter(Boolean);
//    if (!parts.length) return "?";
//    return parts
//       .slice(0, 2)
//       .map((p) => p[0].toUpperCase())
//       .join("");
// }

// // ─── Fotos del vehículo ───────────────────────────────────────────────────────
// const PHOTO_KEYS = [
//    { key: "img_preview", label: "General" },
//    { key: "img_front", label: "Frente" },
//    { key: "img_right", label: "Derecho" },
//    { key: "img_back", label: "Trasera" },
//    { key: "img_left", label: "Izquierdo" }
// ];

// function VehicleHero({ v, bg, fg }) {
//    const photos = PHOTO_KEYS.filter(({ key }) => v[key]);
//    const [active, setActive] = useState(0);

//    return (
//       <Box sx={{ bgcolor: bg }}>
//          {/* Identidad superior */}
//          <Box sx={{ px: 2.5, pt: 2.25, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1.5, flexWrap: "wrap" }}>
//             <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
//                {v.brand_img && (
//                   <Box
//                      component="img"
//                      src={`${HOST}/${v.brand_img}`}
//                      alt={v.brand}
//                      sx={{
//                         width: 38,
//                         height: 38,
//                         borderRadius: "50%",
//                         objectFit: "contain",
//                         bgcolor: "rgba(255,255,255,0.12)",
//                         border: "0.5px solid rgba(255,255,255,0.2)",
//                         p: 0.5,
//                         flexShrink: 0
//                      }}
//                   />
//                )}
//                <Box>
//                   <Typography sx={{ fontSize: 12, letterSpacing: 2, color: `${fg}`, textTransform: "uppercase", mb: 0.5 }}>
//                      Ficha técnica · Unidad #{v.stock_number}
//                   </Typography>
//                   <Typography sx={{ fontSize: 21, fontWeight: 700, color: fg, lineHeight: 1.1, mb: 0.3 }}>
//                      {v.brand}
//                      {v.model && v.model !== "Selecciona una opción..." ? ` ${v.model}` : ""}
//                   </Typography>
//                   <Typography sx={{ fontSize: 13, color: `${fg}` }}>
//                      {v.year} · {v.description?.split(/\r?\n/)[0] ?? ""}
//                   </Typography>
//                </Box>
//             </Box>

//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.75, flexShrink: 0 }}>
//                <Box
//                   sx={{
//                      display: "inline-flex",
//                      alignItems: "center",
//                      gap: 0.6,
//                      px: 1.25,
//                      py: 0.5,
//                      borderRadius: "100px",
//                      bgcolor: "rgba(255,255,255,0.14)",
//                      color: fg,
//                      fontSize: 10,
//                      fontWeight: 600,
//                      letterSpacing: 0.4,
//                      textTransform: "uppercase"
//                   }}
//                >
//                   <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: v.active ? "#66ee99" : "#ff6b6b" }} />
//                   {v.vehicle_status}
//                </Box>
//                {v.plates && (
//                   <Box
//                      sx={{
//                         bgcolor: "rgba(255,255,255,0.11)",
//                         border: "0.5px solid rgba(255,255,255,0.22)",
//                         color: fg,
//                         fontSize: 13,
//                         fontWeight: 700,
//                         letterSpacing: 2,
//                         px: 1.25,
//                         py: 0.5,
//                         borderRadius: 1,
//                         fontFamily: "monospace"
//                      }}
//                   >
//                      {v.plates}
//                   </Box>
//                )}
//             </Box>
//          </Box>

//          {/* Nota de estado */}
//          {v.vehicle_status_description && (
//             <Box
//                sx={{
//                   mx: 2.5,
//                   mt: 1.5,
//                   px: 1.5,
//                   py: 0.85,
//                   bgcolor: "rgba(255,255,255,0.07)",
//                   border: "0.5px solid rgba(255,255,255,0.1)",
//                   borderRadius: "6px 6px 0 0",
//                   borderBottom: "none"
//                }}
//             >
//                <Typography sx={{ fontSize: 11, color: `${fg} `, lineHeight: 1.5 }}>{v.vehicle_status_description}</Typography>
//             </Box>
//          )}

//          {/* Tira de fotos */}
//          {photos.length > 0 && (
//             <Box sx={{ display: "flex", gap: 0.6, px: 2.5, pt: v.vehicle_status_description ? 0 : 1.5 }}>
//                {photos.map(({ key, label }, i) => (
//                   <Box key={key} sx={{ flex: 1, textAlign: "center" }}>
//                      <Box
//                         onClick={() => setActive(i)}
//                         sx={{
//                            height: 58,
//                            borderRadius: "7px 7px 0 0",
//                            cursor: "pointer",
//                            bgcolor: i === active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
//                            border: i === active ? "0.5px solid rgba(255,255,255,0.4)" : "0.5px solid rgba(255,255,255,0.1)",
//                            overflow: "hidden",
//                            display: "flex",
//                            alignItems: "center",
//                            justifyContent: "center",
//                            transition: "background 0.15s",
//                            "&:hover": { bgcolor: "rgba(255,255,255,0.16)" }
//                         }}
//                      >
//                         <Box component="img" src={`${HOST}/${v[key]}`} alt={label} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                      </Box>
//                      <Typography
//                         sx={{
//                            fontSize: 12,
//                            color: `${fg}`,
//                            fontWeight: i === active ? "bold" : "normal",
//                            textTransform: "uppercase",
//                            letterSpacing: 0.4,
//                            mt: 0.4
//                         }}
//                      >
//                         {label}
//                      </Typography>
//                   </Box>
//                ))}
//             </Box>
//          )}
//       </Box>
//    );
// }

// // ─── Primitivos ───────────────────────────────────────────────────────────────

// function StatChip({ label, value, mono }) {
//    if (value === null || value === undefined) return null;
//    return (
//       <Box sx={{ bgcolor: "grey.50", border: "0.5px solid", borderColor: "divider", borderRadius: 1.5, px: 1.5, py: 1.1 }}>
//          <Typography sx={{ fontSize: 10, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.4, mb: 0.25 }}>{label}</Typography>
//          <Typography sx={{ fontSize: 14, fontWeight: 600, fontFamily: mono ? "monospace" : undefined }}>{value}</Typography>
//       </Box>
//    );
// }

// function Group({ title, iconBg, iconColor, iconEl, children }) {
//    return (
//       <Box sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: "10px", overflow: "hidden", mb: 1.25 }}>
//          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1, bgcolor: "grey.50", borderBottom: "0.5px solid", borderColor: "divider" }}>
//             <Box
//                sx={{
//                   width: 23,
//                   height: 23,
//                   borderRadius: "6px",
//                   bgcolor: iconBg,
//                   color: iconColor,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0,
//                   fontSize: 13
//                }}
//             >
//                {iconEl}
//             </Box>
//             <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.2 }}>{title}</Typography>
//          </Box>
//          <Box sx={{ px: 1.5, py: 0.25 }}>{children}</Box>
//       </Box>
//    );
// }

// function Row({ label, value, mono, valueColor, children }) {
//    if (!value && !children) return null;
//    return (
//       <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, py: 0.75, "&:not(:last-child)": { borderBottom: "0.5px solid", borderColor: "divider" } }}>
//          <Box sx={{ minWidth: 0, flex: 1 }}>
//             <Typography sx={{ fontSize: 10, color: "text.secondary", lineHeight: 1.2, mb: 0.2 }}>{label}</Typography>
//             {value && (
//                <Typography
//                   sx={{ fontSize: 12, fontWeight: 600, fontFamily: mono ? "monospace" : undefined, wordBreak: "break-all", color: valueColor || "text.primary" }}
//                >
//                   {value}
//                </Typography>
//             )}
//             {children}
//          </Box>
//       </Box>
//    );
// }

// function DocLink({ href }) {
//    if (!href) return null;
//    return (
//       <Box
//          component="a"
//          href={`${HOST}/${href}`}
//          target="_blank"
//          rel="noopener noreferrer"
//          sx={{ display: "inline-flex", alignItems: "center", gap: 0.3, fontSize: 11, fontWeight: 600, color: "primary.main", textDecoration: "none", mt: 0.25 }}
//       >
//          ↗ Ver PDF
//       </Box>
//    );
// }

// // ─── Persona (director / conductor) ──────────────────────────────────────────
// function PersonRow({ avatarSrc, name, paternal, maternal, department, cellphone, email, folio }) {
//    const hasData = !!(name || paternal);
//    const fullName = [name, paternal, maternal].filter(Boolean).join(" ");
//    const ini = initials(name, paternal, maternal);

//    if (!hasData) {
//       return (
//          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 1 }}>
//             <Box
//                sx={{
//                   width: 34,
//                   height: 34,
//                   borderRadius: "50%",
//                   bgcolor: "grey.100",
//                   border: "0.5px dashed",
//                   borderColor: "divider",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0
//                }}
//             >
//                <Typography sx={{ fontSize: 16, color: "text.disabled" }}>—</Typography>
//             </Box>
//             <Box>
//                <Typography sx={{ fontSize: 12, color: "text.secondary", fontStyle: "italic" }}>Sin asignar</Typography>
//                {folio && <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 0.25 }}>Folio: {folio}</Typography>}
//             </Box>
//          </Box>
//       );
//    }

//    return (
//       <Box sx={{ py: 0.75 }}>
//          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.75 }}>
//             {avatarSrc ? (
//                <Box
//                   component="img"
//                   src={`${HOST}/${avatarSrc}`}
//                   alt={fullName}
//                   sx={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
//                />
//             ) : (
//                <Box
//                   sx={{
//                      width: 34,
//                      height: 34,
//                      borderRadius: "50%",
//                      bgcolor: "#E6F1FB",
//                      color: "#185FA5",
//                      display: "flex",
//                      alignItems: "center",
//                      justifyContent: "center",
//                      fontSize: 12,
//                      fontWeight: 700,
//                      flexShrink: 0
//                   }}
//                >
//                   {ini}
//                </Box>
//             )}
//             <Box>
//                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{fullName}</Typography>
//                {department && <Typography sx={{ fontSize: 10, color: "text.secondary" }}>{department}</Typography>}
//             </Box>
//          </Box>
//          {folio && (
//             <Typography sx={{ fontSize: 10, color: "text.secondary", mb: 0.2 }}>
//                Folio: <strong>{folio}</strong>
//             </Typography>
//          )}
//          {cellphone && <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.2 }}>Tel: {cellphone}</Typography>}
//          {email && <Typography sx={{ fontSize: 11, color: "primary.main" }}>{email}</Typography>}
//       </Box>
//    );
// }

// // ─── Vista principal ──────────────────────────────────────────────────────────
// export default function VehicleCardInfo({ vehicle = null }) {
//    const { openCardInfo, setOpenCardInfo } = useGlobalContext();
//    const { vehicle: vContext } = useVehicleContext();
//    const v = vehicle ? vehicle : vContext;
//    console.log("🚀 ~ VehicleCardInfo ~ v:", v);

//    if (!v) return null;

//    const bg = v.bg_color || "#1976d2";
//    const fg = contrastColor(bg);

//    const days = daysUntil(v.due_date);
//    const insuranceLabel =
//       days === null
//          ? null
//          : days < 0
//            ? { text: `Venció hace ${Math.abs(days)} días`, color: "error.dark" }
//            : days <= 30
//              ? { text: `Por vencer · ${days} días`, color: "warning.dark" }
//              : { text: `Vigente · ${days} días restantes`, color: "success.dark" };

//    const dept = v.description?.split(/\r?\n/)[1]?.replace("DEPARTAMENTO:", "").trim();

//    return (
//       <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo}>
//          {/* ── Hero ── */}
//          <Box sx={{ mx: -3, mt: -3, mb: 2 }}>
//             <VehicleHero v={v} bg={bg} fg={fg} />
//          </Box>

//          {/* ── Stats rápidas ── */}
//          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 0.9, mb: 2 }}>
//             <StatChip label="Año" value={v.year} />
//             <StatChip label="Licencia" value={v.acceptable_license_type} />
//             <StatChip label="Cód. gasolina" value={v.gasoline_code} mono />
//             <StatChip label="No. Económico" value={v.stock_number} />
//          </Box>

//          {/* ── Grid 2 columnas ── */}
//          <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 1.25 }}>
//             {/* Columna izquierda */}
//             <Box>
//                <Group title="Identificación" iconBg="#E6F1FB" iconColor="#185FA5" iconEl="🪪">
//                   <Row label="No. de serie" value={v.serial_number} mono />
//                   <Row label="Tarjeta de circulación" value={v.circulation_card}>
//                      <DocLink href={v.img_circulation_card} />
//                   </Row>
//                   <Row label="Fecha de registro" value={fmtDate(v.registration_date)} />
//                   {dept && <Row label="Departamento" value={dept} />}
//                </Group>

//                <Group title="Seguro vehicular" iconBg="#E1F5EE" iconColor="#0F6E56" iconEl="🛡">
//                   <Row label="Póliza" value={v.insurance_policy} mono>
//                      <DocLink href={v.img_insurance_policy} />
//                   </Row>
//                   <Row label="Vigencia" value={v.initial_date && v.due_date ? `${fmtDate(v.initial_date)} — ${fmtDate(v.due_date)}` : fmtDate(v.due_date)}>
//                      {insuranceLabel && <Typography sx={{ fontSize: 10, fontWeight: 600, color: insuranceLabel.color, mt: 0.25 }}>{insuranceLabel.text}</Typography>}
//                   </Row>
//                </Group>
//             </Box>

//             {/* Columna derecha */}
//             <Box>
//                <Group title="Director asignado" iconBg="#EEEDFE" iconColor="#534AB7" iconEl="👤">
//                   <PersonRow
//                      avatarSrc={v.dir_avatar}
//                      name={v.dir_name}
//                      paternal={v.dir_plast_name}
//                      maternal={v.dir_mlast_name}
//                      department={v.dir_department}
//                      cellphone={v.dir_cellphone}
//                      email={v.dir_email}
//                      folio={v.ass_folio}
//                   />
//                   {v.ass_date && <Row label="Fecha de asignación" value={fmtDate(v.ass_date)} />}
//                </Group>

//                <Group title="Conductor en préstamo" iconBg="#FAEEDA" iconColor="#854F0B" iconEl="🚗">
//                   <PersonRow
//                      avatarSrc={v.dri_avatar}
//                      name={v.dri_name}
//                      paternal={v.dri_plast_name}
//                      maternal={v.dri_mlast_name}
//                      department={v.dri_department}
//                      cellphone={v.dri_cellphone}
//                      email={v.dri_email}
//                      folio={v.loa_folio}
//                   />
//                </Group>

//                <Group title="Estado del registro" iconBg="#F1EFE8" iconColor="#5F5E5A" iconEl="ℹ">
//                   <Row label="Activo en sistema" value={v.active ? "Activo" : "Inactivo"} valueColor={v.active ? "success.dark" : "error.dark"} />
//                   <Row label="Multa" value={v.violated ?? "Sin registros"} valueColor={v.violated ? "error.dark" : "text.secondary"} />
//                   <Row label="Última actualización" value={fmtDate(v.updated_at)} />
//                </Group>
//             </Box>
//          </Box>
//       </ModalComponent>
//    );
// }
