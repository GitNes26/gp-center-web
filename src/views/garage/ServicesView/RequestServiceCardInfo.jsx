// "use client";

// import React from "react";
// import { ThemeProvider, createTheme, Container, Paper, Typography, Grid, Chip, Divider, Box } from "@mui/material";
// import { Person, Email, Phone, DirectionsCar, Build, EventAvailable, Description } from "@mui/icons-material";
// import { ModalComponent } from "../../../components/ModalComponent";
// import { useGlobalContext } from "../../../context/GlobalContext";
// import { useServiceContext } from "../../../context/ServiceContext";
// import { formatDatetime } from "../../../utils/Formats";

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

// // Datos de ejemplo de una solicitud de servicio
// const solicitudServicio = {
//    id: "SRV-2023-001",
//    estado: "Pendiente",
//    fechaSolicitud: "2023-12-01",
//    cliente: {
//       nombre: "Juan Pérez",
//       email: "juan.perez@email.com",
//       telefono: "+34 612 345 678"
//    },
//    vehiculo: {
//       marca: "Toyota",
//       modelo: "Corolla",
//       año: "2020",
//       placa: "ABC 123"
//    },
//    servicio: {
//       tipo: "Revisión general",
//       fecha: "2023-12-15",
//       descripcion: "El vehículo presenta un ruido extraño al frenar y vibración al acelerar por encima de 80 km/h. Solicito revisión completa y diagnóstico."
//    }
// };

// export default function RequestServiceCardInfo() {
//    const { openCardInfo, setOpenCardInfo } = useGlobalContext();
//    const { service } = useServiceContext();
//    // console.log("🚀 ~ RequestServiceCardInfo ~ service:", service);

//    return (
//       <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo} modalTitle={`SOLICITUD DE SERVICIO #${service?.folio}`}>
//          {service == null || service.length < 1 ? (
//             <p>CARGANDO INFORMACIÓN...</p>
//          ) : (
//             <ThemeProvider theme={theme}>
//                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//                   <Typography variant="h4" component="h1" gutterBottom>
//                      Solicitud de Servicio
//                   </Typography>
//                   <Chip label={service.status} color="primary" variant="outlined" />
//                </Box>
//                <Typography variant="subtitle1" gutterBottom>
//                   Folio: {service.folio} | Fecha de solicitud: {formatDatetime(service.created_at, true)}
//                </Typography>
//                <Divider sx={{ my: 3 }} />

//                <Grid container spacing={3}>
//                   <Grid item xs={12} md={6} display={"flex"} alignContent={"space-between"} sx={{ flexWrap: "wrap" }}>
//                      <InfoSection
//                         widthMd={12}
//                         title="Información del Solicitante"
//                         icon={<Person />}
//                         items={[
//                            { icon: <Person />, label: "Nombre", value: service.contact_name },
//                            // { icon: <Email />, label: "Email", value: service.cliente.email },
//                            { icon: <Phone />, label: "Teléfono", value: service.contact_phone }
//                         ]}
//                      />
//                      <InfoSection
//                         widthMd={12}
//                         title="Detalles del Servicio"
//                         icon={<Build />}
//                         items={[
//                            { label: "Tipo de Servicio", value: "Servicio" }
//                            // { icon: <EventAvailable />, label: "Fecha Programada", value: service.servicio.fecha }
//                         ]}
//                      />
//                   </Grid>

//                   <InfoSection
//                      title="Detalles del Vehículo"
//                      icon={<DirectionsCar />}
//                      items={[
//                         { label: "No. Económico", value: service.stock_number },
//                         { label: "Marca", value: service.brand },
//                         { label: "Modelo", value: service.model },
//                         { label: "Año", value: service.year },
//                         { label: "Placa", value: service.plates },
//                         { label: "Descripción", value: service.description }
//                      ]}
//                   />

//                   {/* <Grid item xs={12} md={6}>
//                      <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         Unidad
//                      </Typography>
//                      <Paper variant="outlined" sx={{ p: 2 }}>
//                         <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                            <img src={`${import.meta.env.VITE_HOST}/${service.img_preview}`} />
//                         </Box>
//                      </Paper>
//                   </Grid> */}

//                   <Grid item xs={12}>
//                      <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Description /> Reportan que...
//                      </Typography>
//                      <Paper variant="outlined" sx={{ p: 2, mb: 1, bgcolor: "background.default" }}>
//                         <Typography variant="body1">{service.pre_diagnosis}</Typography>
//                      </Paper>
//                   </Grid>
//                </Grid>
//             </ThemeProvider>
//          )}
//       </ModalComponent>
//    );
// }

// function InfoSection({ title, icon, items, widthMd = 6 }) {
//    return (
//       <Grid item xs={12} md={widthMd}>
//          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             {icon} {title}
//          </Typography>
//          <Paper variant="outlined" sx={{ p: 2 }}>
//             {items.map((item, index) => (
//                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                   {item.icon && <Box sx={{ mr: 1 }}>{item.icon}</Box>}
//                   <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
//                      {item.label}:
//                   </Typography>
//                   <Typography variant="body1">{item.value}</Typography>
//                </Box>
//             ))}
//          </Paper>
//       </Grid>
//    );
// }

"use client";

import React from "react";
import { Box, Typography, Divider, Chip, Grid, Paper, Avatar } from "@mui/material";
import { Person, Phone, DirectionsCar, Build, Description, ConfirmationNumber, CalendarToday, Tag, SpeedRounded } from "@mui/icons-material";
import { ModalComponent } from "../../../components/ModalComponent";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useServiceContext } from "../../../context/ServiceContext";
import { formatDatetime } from "../../../utils/Formats";

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_MAP = {
   Pendiente: { bg: "#FFF8E1", color: "#E65100", dot: "#FFA726" },
   "En proceso": { bg: "#E3F2FD", color: "#0D47A1", dot: "#42A5F5" },
   Completado: { bg: "#E8F5E9", color: "#1B5E20", dot: "#66BB6A" },
   Cancelado: { bg: "#FFEBEE", color: "#B71C1C", dot: "#EF5350" }
};

function StatusChip({ status }) {
   const s = STATUS_MAP[status] || { bg: "#F5F5F5", color: "#616161", dot: "#9E9E9E" };
   return (
      <Box
         component="span"
         sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.5,
            borderRadius: "100px",
            bgcolor: s.bg,
            color: s.color,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.3,
            textTransform: "uppercase"
         }}
      >
         <Box
            sx={{
               width: 7,
               height: 7,
               borderRadius: "50%",
               bgcolor: s.dot,
               flexShrink: 0
            }}
         />
         {status}
      </Box>
   );
}

// ─── Single field row ─────────────────────────────────────────────────────────
function FieldRow({ icon, label, value }) {
   if (!value) return null;
   return (
      <Box
         sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            py: 1,
            "&:not(:last-child)": {
               borderBottom: "1px solid",
               borderColor: "divider"
            }
         }}
      >
         <Box
            sx={{
               mt: 0.2,
               color: "primary.main",
               opacity: 0.7,
               flexShrink: 0,
               "& .MuiSvgIcon-root": { fontSize: 17 }
            }}
         >
            {icon}
         </Box>
         <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", lineHeight: 1.2, mb: 0.2 }}>
               {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary", lineHeight: 1.4 }}>
               {value}
            </Typography>
         </Box>
      </Box>
   );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ icon, title, children, accentColor = "#1976d2" }) {
   return (
      <Paper
         elevation={0}
         sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
            height: "100%"
         }}
      >
         {/* Header */}
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               gap: 1,
               px: 2,
               py: 1.25,
               bgcolor: `${accentColor}08`,
               borderBottom: "1px solid",
               borderColor: "divider"
            }}
         >
            <Box
               sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 1.5,
                  bgcolor: `${accentColor}18`,
                  color: accentColor,
                  "& .MuiSvgIcon-root": { fontSize: 17 }
               }}
            >
               {icon}
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13, color: "text.primary", letterSpacing: 0.2 }}>
               {title}
            </Typography>
         </Box>

         {/* Body */}
         <Box sx={{ px: 2, py: 1 }}>{children}</Box>
      </Paper>
   );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RequestServiceCardInfo() {
   const { openCardInfo, setOpenCardInfo } = useGlobalContext();
   const { service } = useServiceContext();

   if (!service || service.length < 1) {
      return (
         <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo} modalTitle="SOLICITUD DE SERVICIO">
            <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
               <Typography>Cargando información…</Typography>
            </Box>
         </ModalComponent>
      );
   }

   return (
      <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo} modalTitle={`Solicitud #${service?.folio}`}>
         {/* ── Header ── */}
         <Box
            sx={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "flex-start",
               mb: 3,
               gap: 2,
               flexWrap: "wrap"
            }}
         >
            <Box>
               <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2, mb: 0.5 }}>
                  Solicitud de Servicio
               </Typography>
               <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                     <ConfirmationNumber sx={{ fontSize: 14, color: "text.secondary" }} />
                     <Typography variant="body2" color="text.secondary">
                        Folio <strong>{service.folio}</strong>
                     </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                     <CalendarToday sx={{ fontSize: 13, color: "text.secondary" }} />
                     <Typography variant="body2" color="text.secondary">
                        {formatDatetime(service.created_at, true)}
                     </Typography>
                  </Box>
               </Box>
            </Box>
            <StatusChip status={service.status} />
         </Box>

         <Divider sx={{ mb: 3 }} />

         {/* ── Grid sections ── */}
         <Grid container spacing={2.5}>
            {/* Solicitante */}
            <Grid item xs={12} sm={6}>
               <SectionCard icon={<Person />} title="Solicitante" accentColor="#1976d2">
                  <FieldRow icon={<Person />} label="Nombre" value={service.contact_name} />
                  <FieldRow icon={<Phone />} label="Teléfono" value={service.contact_phone} />
               </SectionCard>
            </Grid>

            {/* Tipo de servicio */}
            <Grid item xs={12} sm={6}>
               <SectionCard icon={<Build />} title="Servicio" accentColor="#7B1FA2">
                  <FieldRow icon={<Build />} label="Tipo" value="Servicio" />
               </SectionCard>
            </Grid>

            {/* Vehículo */}
            <Grid item xs={12}>
               <SectionCard icon={<DirectionsCar />} title="Detalles del Vehículo" accentColor="#0288D1">
                  <Grid container spacing={0}>
                     <Grid item xs={12} sm={6}>
                        <FieldRow icon={<Tag />} label="No. Económico" value={service.stock_number} />
                        <FieldRow icon={<DirectionsCar />} label="Marca" value={service.brand} />
                        <FieldRow icon={<SpeedRounded />} label="Modelo" value={service.model} />
                     </Grid>
                     <Grid item xs={12} sm={6}>
                        <FieldRow icon={<CalendarToday />} label="Año" value={service.year} />
                        <FieldRow icon={<Tag />} label="Placa" value={service.plates} />
                        <FieldRow icon={<Description />} label="Descripción" value={service.description} />
                     </Grid>
                  </Grid>
               </SectionCard>
            </Grid>

            {/* Pre-diagnóstico */}
            <Grid item xs={12}>
               <SectionCard icon={<Description />} title="Reportan que…" accentColor="#F57C00">
                  <Box
                     sx={{
                        mt: 0.5,
                        p: 2,
                        borderRadius: 1.5,
                        bgcolor: "grey.50",
                        border: "1px solid",
                        borderColor: "divider"
                     }}
                  >
                     <Typography
                        variant="body2"
                        sx={{
                           lineHeight: 1.7,
                           color: service.pre_diagnosis ? "text.primary" : "text.disabled",
                           fontStyle: service.pre_diagnosis ? "normal" : "italic"
                        }}
                     >
                        {service.pre_diagnosis || "Sin diagnóstico previo registrado."}
                     </Typography>
                  </Box>
               </SectionCard>
            </Grid>
         </Grid>
      </ModalComponent>
   );
}
