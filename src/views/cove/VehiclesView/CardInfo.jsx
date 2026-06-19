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

function initials(name, paternal, maternal) {
   const parts = [name, paternal, maternal].filter(Boolean);
   if (!parts.length) return "?";
   return parts
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
}

// ─── Fotos del vehículo ───────────────────────────────────────────────────────
const PHOTO_KEYS = [
   { key: "img_preview", label: "General" },
   { key: "img_front", label: "Frente" },
   { key: "img_right", label: "Derecho" },
   { key: "img_back", label: "Trasera" },
   { key: "img_left", label: "Izquierdo" }
];

function VehicleHero({ v, bg, fg }) {
   const photos = PHOTO_KEYS.filter(({ key }) => v[key]);
   const [active, setActive] = useState(0);

   return (
      <Box sx={{ bgcolor: bg }}>
         {/* Identidad superior */}
         <Box sx={{ px: 2.5, pt: 2.25, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1.5, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
               {v.brand_img && (
                  <Box
                     component="img"
                     src={`${HOST}/${v.brand_img}`}
                     alt={v.brand}
                     sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        objectFit: "contain",
                        bgcolor: "rgba(255,255,255,0.12)",
                        border: "0.5px solid rgba(255,255,255,0.2)",
                        p: 0.5,
                        flexShrink: 0
                     }}
                  />
               )}
               <Box>
                  <Typography sx={{ fontSize: 12, letterSpacing: 2, color: `${fg}`, textTransform: "uppercase", mb: 0.5 }}>
                     Ficha técnica · Unidad #{v.stock_number}
                  </Typography>
                  <Typography sx={{ fontSize: 21, fontWeight: 700, color: fg, lineHeight: 1.1, mb: 0.3 }}>
                     {v.brand}
                     {v.model && v.model !== "Selecciona una opción..." ? ` ${v.model}` : ""}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: `${fg}` }}>
                     {v.year} · {v.description?.split(/\r?\n/)[0] ?? ""}
                  </Typography>
               </Box>
            </Box>

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
                  mt: 1.5,
                  px: 1.5,
                  py: 0.85,
                  bgcolor: "rgba(255,255,255,0.07)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px 6px 0 0",
                  borderBottom: "none"
               }}
            >
               <Typography sx={{ fontSize: 11, color: `${fg} `, lineHeight: 1.5 }}>{v.vehicle_status_description}</Typography>
            </Box>
         )}

         {/* Tira de fotos */}
         {photos.length > 0 && (
            <Box sx={{ display: "flex", gap: 0.6, px: 2.5, pt: v.vehicle_status_description ? 0 : 1.5 }}>
               {photos.map(({ key, label }, i) => (
                  <Box key={key} sx={{ flex: 1, textAlign: "center" }}>
                     <Box
                        onClick={() => setActive(i)}
                        sx={{
                           height: 58,
                           borderRadius: "7px 7px 0 0",
                           cursor: "pointer",
                           bgcolor: i === active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                           border: i === active ? "0.5px solid rgba(255,255,255,0.4)" : "0.5px solid rgba(255,255,255,0.1)",
                           overflow: "hidden",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           transition: "background 0.15s",
                           "&:hover": { bgcolor: "rgba(255,255,255,0.16)" }
                        }}
                     >
                        <Box component="img" src={`${HOST}/${v[key]}`} alt={label} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                     </Box>
                     <Typography
                        sx={{
                           fontSize: 12,
                           color: `${fg}`,
                           fontWeight: i === active ? "bold" : "normal",
                           textTransform: "uppercase",
                           letterSpacing: 0.4,
                           mt: 0.4
                        }}
                     >
                        {label}
                     </Typography>
                  </Box>
               ))}
            </Box>
         )}
      </Box>
   );
}

// ─── Primitivos ───────────────────────────────────────────────────────────────

function StatChip({ label, value, mono }) {
   if (value === null || value === undefined) return null;
   return (
      <Box sx={{ bgcolor: "grey.50", border: "0.5px solid", borderColor: "divider", borderRadius: 1.5, px: 1.5, py: 1.1 }}>
         <Typography sx={{ fontSize: 10, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.4, mb: 0.25 }}>{label}</Typography>
         <Typography sx={{ fontSize: 14, fontWeight: 600, fontFamily: mono ? "monospace" : undefined }}>{value}</Typography>
      </Box>
   );
}

function Group({ title, iconBg, iconColor, iconEl, children }) {
   return (
      <Box sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: "10px", overflow: "hidden", mb: 1.25 }}>
         <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1, bgcolor: "grey.50", borderBottom: "0.5px solid", borderColor: "divider" }}>
            <Box
               sx={{
                  width: 23,
                  height: 23,
                  borderRadius: "6px",
                  bgcolor: iconBg,
                  color: iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 13
               }}
            >
               {iconEl}
            </Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.2 }}>{title}</Typography>
         </Box>
         <Box sx={{ px: 1.5, py: 0.25 }}>{children}</Box>
      </Box>
   );
}

function Row({ label, value, mono, valueColor, children }) {
   if (!value && !children) return null;
   return (
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, py: 0.75, "&:not(:last-child)": { borderBottom: "0.5px solid", borderColor: "divider" } }}>
         <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 10, color: "text.secondary", lineHeight: 1.2, mb: 0.2 }}>{label}</Typography>
            {value && (
               <Typography
                  sx={{ fontSize: 12, fontWeight: 600, fontFamily: mono ? "monospace" : undefined, wordBreak: "break-all", color: valueColor || "text.primary" }}
               >
                  {value}
               </Typography>
            )}
            {children}
         </Box>
      </Box>
   );
}

function DocLink({ href }) {
   if (!href) return null;
   return (
      <Box
         component="a"
         href={`${HOST}/${href}`}
         target="_blank"
         rel="noopener noreferrer"
         sx={{ display: "inline-flex", alignItems: "center", gap: 0.3, fontSize: 11, fontWeight: 600, color: "primary.main", textDecoration: "none", mt: 0.25 }}
      >
         ↗ Ver PDF
      </Box>
   );
}

// ─── Persona (director / conductor) ──────────────────────────────────────────
function PersonRow({ avatarSrc, name, paternal, maternal, department, phone, email, folio }) {
   const hasData = !!(name || paternal);
   const fullName = [name, paternal, maternal].filter(Boolean).join(" ");
   const ini = initials(name, paternal, maternal);

   if (!hasData) {
      return (
         <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 1 }}>
            <Box
               sx={{
                  width: 34,
                  height: 34,
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
               <Box
                  component="img"
                  src={`${HOST}/${avatarSrc}`}
                  alt={fullName}
                  sx={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
               />
            ) : (
               <Box
                  sx={{
                     width: 34,
                     height: 34,
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
            <Typography sx={{ fontSize: 10, color: "text.secondary", mb: 0.2 }}>
               Folio: <strong>{folio}</strong>
            </Typography>
         )}
         {phone && <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.2 }}>Tel: {phone}</Typography>}
         {email && <Typography sx={{ fontSize: 11, color: "primary.main" }}>{email}</Typography>}
      </Box>
   );
}

// ─── Vista principal ──────────────────────────────────────────────────────────
export default function VehicleCardInfo({ vehicle = null }) {
   const { openCardInfo, setOpenCardInfo } = useGlobalContext();
   const { vehicle: vContext } = useVehicleContext();
   const v = vehicle ? vehicle : vContext;
   console.log("🚀 ~ VehicleCardInfo ~ v:", v);

   if (!v) return null;

   const bg = v.bg_color || "#1976d2";
   const fg = contrastColor(bg);

   const days = daysUntil(v.due_date);
   const insuranceLabel =
      days === null
         ? null
         : days < 0
           ? { text: `Venció hace ${Math.abs(days)} días`, color: "error.dark" }
           : days <= 30
             ? { text: `Por vencer · ${days} días`, color: "warning.dark" }
             : { text: `Vigente · ${days} días restantes`, color: "success.dark" };

   const dept = v.description?.split(/\r?\n/)[1]?.replace("DEPARTAMENTO:", "").trim();

   return (
      <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo}>
         {/* ── Hero ── */}
         <Box sx={{ mx: -3, mt: -3, mb: 2 }}>
            <VehicleHero v={v} bg={bg} fg={fg} />
         </Box>

         {/* ── Stats rápidas ── */}
         <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 0.9, mb: 2 }}>
            <StatChip label="Año" value={v.year} />
            <StatChip label="Licencia" value={v.acceptable_license_type} />
            <StatChip label="Cód. gasolina" value={v.gasoline_code} mono />
            <StatChip label="No. Económico" value={v.stock_number} />
         </Box>

         {/* ── Grid 2 columnas ── */}
         <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 1.25 }}>
            {/* Columna izquierda */}
            <Box>
               <Group title="Identificación" iconBg="#E6F1FB" iconColor="#185FA5" iconEl="🪪">
                  <Row label="No. de serie" value={v.serial_number} mono />
                  <Row label="Tarjeta de circulación" value={v.circulation_card}>
                     <DocLink href={v.img_circulation_card} />
                  </Row>
                  <Row label="Fecha de registro" value={fmtDate(v.registration_date)} />
                  {dept && <Row label="Departamento" value={dept} />}
               </Group>

               <Group title="Seguro vehicular" iconBg="#E1F5EE" iconColor="#0F6E56" iconEl="🛡">
                  <Row label="Póliza" value={v.insurance_policy} mono>
                     <DocLink href={v.img_insurance_policy} />
                  </Row>
                  <Row label="Vigencia" value={v.initial_date && v.due_date ? `${fmtDate(v.initial_date)} — ${fmtDate(v.due_date)}` : fmtDate(v.due_date)}>
                     {insuranceLabel && <Typography sx={{ fontSize: 10, fontWeight: 600, color: insuranceLabel.color, mt: 0.25 }}>{insuranceLabel.text}</Typography>}
                  </Row>
               </Group>
            </Box>

            {/* Columna derecha */}
            <Box>
               <Group title="Director asignado" iconBg="#EEEDFE" iconColor="#534AB7" iconEl="👤">
                  <PersonRow
                     avatarSrc={v.dir_avatar}
                     name={v.dir_name}
                     paternal={v.dir_paternal_last_name}
                     maternal={v.dir_maternal_last_name}
                     department={v.dir_department}
                     phone={v.dir_phone}
                     email={v.dir_email}
                     folio={v.ass_folio}
                  />
                  {v.ass_date && <Row label="Fecha de asignación" value={fmtDate(v.ass_date)} />}
               </Group>

               <Group title="Conductor en préstamo" iconBg="#FAEEDA" iconColor="#854F0B" iconEl="🚗">
                  <PersonRow
                     avatarSrc={v.dri_avatar}
                     name={v.dri_name}
                     paternal={v.dri_paternal_last_name}
                     maternal={v.dri_maternal_last_name}
                     department={v.dri_department}
                     phone={v.dri_phone}
                     email={v.dri_email}
                     folio={v.loa_folio}
                  />
               </Group>

               <Group title="Estado del registro" iconBg="#F1EFE8" iconColor="#5F5E5A" iconEl="ℹ">
                  <Row label="Activo en sistema" value={v.active ? "Activo" : "Inactivo"} valueColor={v.active ? "success.dark" : "error.dark"} />
                  <Row label="Multa" value={v.violated ?? "Sin registros"} valueColor={v.violated ? "error.dark" : "text.secondary"} />
                  <Row label="Última actualización" value={fmtDate(v.updated_at)} />
               </Group>
            </Box>
         </Box>
      </ModalComponent>
   );
}

// import React from "react";
// import { Box, Card, CardContent, CardMedia, Typography, Grid, Paper, Divider, ThemeProvider, createTheme, styled } from "@mui/material";
// import { DirectionsCar, Speed, LocalGasStation, Today, Scale, Settings, AttachMoney, EmojiEvents, Security, FlashOn } from "@mui/icons-material";
// import { useGlobalContext } from "../../../context/GlobalContext";
// import { useVehicleContext } from "../../../context/VehicleContext";
// import { ModalComponent } from "../../../components/ModalComponent";

// // Crear un tema personalizado
// const theme = createTheme({
//    palette: {
//       primary: {
//          main: "#1976d2"
//       },
//       secondary: {
//          main: "#dc004e"
//       }
//    }
// });

// // Componente estilizado para las tarjetas de características
// const FeatureCard = styled(Paper)(({ theme }) => ({
//    padding: theme.spacing(3),
//    textAlign: "center",
//    color: theme.palette.text.secondary,
//    transition: "all 0.3s",
//    "&:hover": {
//       transform: "translateY(-5px)",
//       boxShadow: theme.shadows[4]
//    }
// }));

// export default function VehicleCardInfo() {
//    const { openCardInfo, setOpenCardInfo } = useGlobalContext();
//    const { vehicle } = useVehicleContext();
//    console.log("🚀 ~ VehicleCardInfo ~ vehicle:", vehicle);
//    return (
//       vehicle && (
//          <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo}>
//             <ThemeProvider theme={theme}>
//                {/* <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", py: 8, px: 2 }}> */}
//                <Card sx={{ maxWidth: 1200, margin: "auto", borderRadius: 4, overflow: "hidden" }}>
//                   <CardMedia
//                      component="img"
//                      height="400"
//                      image={`${import.meta.env.VITE_HOST}/${vehicle.img_preview}`}
//                      sx={{ objectFit: "contain" }}
//                      alt="Imagen del vehículo"
//                   />
//                   <CardContent sx={{ p: 4 }}>
//                      <Typography variant="h3" component="h1" gutterBottom>
//                         {vehicle.brand} - {vehicle.model} {vehicle.year}
//                      </Typography>

//                      <Grid container spacing={4}>
//                         <InfoSection title="Especificaciones Generales" icon={<DirectionsCar />}>
//                            <InfoItem label="Marca" value={vehicle.brand} />
//                            <InfoItem label="Modelo" value={vehicle.model} />
//                            <InfoItem label="Año" value={vehicle.year} />
//                            {/* <InfoItem label="Tipo" value="Sedán de Lujo" /> */}
//                            <br />
//                            <Typography variant="p">{vehicle.description}</Typography>
//                         </InfoSection>
//                         <InfoSection title="Más Información" icon={<Settings />}>
//                            <InfoItem label="Fecha de registro" value={vehicle.registration_date} />
//                            <InfoItem label="Tipos de licencia" value={vehicle.acceptable_license_type} />
//                            <InfoItem label="Número de serie" value={vehicle.serial_number} />
//                            <InfoItem label="Tarjeta de circulación" value={vehicle.circulation_card} />
//                            <InfoItem label="Póliza de seguro" value={vehicle.insurance_policy} />
//                         </InfoSection>
//                         {/* <InfoSection title="Motor y Rendimiento" icon={<Settings />}>
//                            <InfoItem label="Motor" value="3.0L V6 Turbo" />
//                            <InfoItem label="Potencia" value="350 HP @ 5,500 rpm" />
//                            <InfoItem label="Torque" value="500 Nm @ 2,000-4,500 rpm" />
//                            <InfoItem label="Transmisión" value="Automática 9 velocidades" />
//                         </InfoSection>
//                         <InfoSection title="Consumo y Emisiones" icon={<LocalGasStation />}>
//                            <InfoItem label="Consumo ciudad" value="10.5 L/100km" />
//                            <InfoItem label="Consumo carretera" value="7.2 L/100km" />
//                            <InfoItem label="Emisiones CO2" value="180 g/km" />
//                            <InfoItem label="Norma de emisiones" value="Euro 6d" />
//                         </InfoSection>
//                         <InfoSection title="Dimensiones y Capacidades" icon={<Scale />}>
//                            <InfoItem label="Largo" value="5,050 mm" />
//                            <InfoItem label="Ancho" value="1,960 mm" />
//                            <InfoItem label="Alto" value="1,470 mm" />
//                            <InfoItem label="Peso" value="1,850 kg" />
//                         </InfoSection>  */}
//                      </Grid>

//                      <Divider sx={{ my: 6 }} />
//                      {/*
//                      <Typography variant="h4" component="h2" gutterBottom align="center">
//                         Características Destacadas
//                      </Typography>

//                      <Grid container spacing={3} sx={{ mt: 2 }}>
//                         <FeatureItem icon={<Speed />} title="Velocidad Máxima" value="280 km/h" />
//                         <FeatureItem icon={<FlashOn />} title="0-100 km/h" value="4.5 segundos" />
//                         <FeatureItem icon={<Today />} title="Garantía" value="5 años o 100,000 km" />
//                         <FeatureItem icon={<Security />} title="Seguridad" value="5 estrellas NCAP" />
//                         <FeatureItem icon={<EmojiEvents />} title="Premios" value="Coche del Año 2023" />
//                         <FeatureItem icon={<AttachMoney />} title="Precio Base" value="$65,000" />
//                      </Grid> */}
//                   </CardContent>
//                </Card>
//                {/* </Box> */}
//             </ThemeProvider>
//          </ModalComponent>
//       )
//    );
// }

// function InfoSection({ title, children, icon }) {
//    return (
//       <Grid item xs={12} md={6}>
//          <Box sx={{ mb: 2 }}>
//             <Typography variant="h5" component="h3" sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: "bolder" }}>
//                {React.cloneElement(icon, { sx: { fontSize: 28 } })}
//                {title}
//             </Typography>
//          </Box>
//          <Paper elevation={2} sx={{ p: 2 }}>
//             {children}
//          </Paper>
//       </Grid>
//    );
// }

// function InfoItem({ label, value }) {
//    return (
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5 }}>
//          <Typography variant="body2" color="text.secondary">
//             {label}
//          </Typography>
//          <Typography variant="body1">{value}</Typography>
//       </Box>
//    );
// }

// function FeatureItem({ icon, title, value }) {
//    return (
//       <Grid item xs={12} sm={6} md={4}>
//          <FeatureCard elevation={2}>
//             {React.cloneElement(icon, { sx: { fontSize: 40, color: "primary.main", mb: 1 } })}
//             <Typography variant="h6" component="h3" gutterBottom>
//                {title}
//             </Typography>
//             <Typography variant="h5" component="p" fontWeight="bold">
//                {value}
//             </Typography>
//          </FeatureCard>
//       </Grid>
//    );
// }
