"use client";

import React from "react";
import { ThemeProvider, createTheme, Container, Paper, Typography, Grid, Chip, Divider, Box } from "@mui/material";
import { Person, Email, Phone, DirectionsCar, Build, EventAvailable, Description } from "@mui/icons-material";
import { ModalComponent } from "../../../components/ModalComponent";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useServiceContext } from "../../../context/ServiceContext";
import { formatDatetime } from "../../../utils/Formats";

const theme = createTheme({
   palette: {
      primary: {
         main: "#1976d2"
      },
      secondary: {
         main: "#dc004e"
      }
   }
});

// Datos de ejemplo de una solicitud de servicio
const solicitudServicio = {
   id: "SRV-2023-001",
   estado: "Pendiente",
   fechaSolicitud: "2023-12-01",
   cliente: {
      nombre: "Juan Pérez",
      email: "juan.perez@email.com",
      telefono: "+34 612 345 678"
   },
   vehiculo: {
      marca: "Toyota",
      modelo: "Corolla",
      año: "2020",
      placa: "ABC 123"
   },
   servicio: {
      tipo: "Revisión general",
      fecha: "2023-12-15",
      descripcion: "El vehículo presenta un ruido extraño al frenar y vibración al acelerar por encima de 80 km/h. Solicito revisión completa y diagnóstico."
   }
};

export default function RequestServiceCardInfo() {
   const { openCardInfo, setOpenCardInfo } = useGlobalContext();
   const { service } = useServiceContext();
   console.log("🚀 ~ RequestServiceCardInfo ~ service:", service);

   return (
      <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo} modalTitle={`SOLICITUD DE SERVICIO #${service?.folio}`}>
         {service == null || service.length < 1 ? (
            <p>CARGANDO INFORMACIÓN...</p>
         ) : (
            <ThemeProvider theme={theme}>
               <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h4" component="h1" gutterBottom>
                     Solicitud de Servicio
                  </Typography>
                  <Chip label={service.status} color="primary" variant="outlined" />
               </Box>
               <Typography variant="subtitle1" gutterBottom>
                  Folio: {service.folio} | Fecha de solicitud: {formatDatetime(service.created_at, true)}
               </Typography>
               <Divider sx={{ my: 3 }} />

               <Grid container spacing={3}>
                  <Grid item xs={12} md={6} display={"flex"} alignContent={"space-between"} sx={{ flexWrap: "wrap" }}>
                     <InfoSection
                        widthMd={12}
                        title="Información del Solicitante"
                        icon={<Person />}
                        items={[
                           { icon: <Person />, label: "Nombre", value: service.contact_name },
                           // { icon: <Email />, label: "Email", value: service.cliente.email },
                           { icon: <Phone />, label: "Teléfono", value: service.contact_phone }
                        ]}
                     />
                     <InfoSection
                        widthMd={12}
                        title="Detalles del Servicio"
                        icon={<Build />}
                        items={[
                           { label: "Tipo de Servicio", value: "Servicio" }
                           // { icon: <EventAvailable />, label: "Fecha Programada", value: service.servicio.fecha }
                        ]}
                     />
                  </Grid>

                  <InfoSection
                     title="Detalles del Vehículo"
                     icon={<DirectionsCar />}
                     items={[
                        { label: "No. Económico", value: service.stock_number },
                        { label: "Marca", value: service.brand },
                        { label: "Modelo", value: service.model },
                        { label: "Año", value: service.year },
                        { label: "Placa", value: service.plates },
                        { label: "Descripción", value: service.description }
                     ]}
                  />

                  {/* <Grid item xs={12} md={6}>
                     <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        Unidad
                     </Typography>
                     <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                           <img src={`${import.meta.env.VITE_HOST}/${service.img_preview}`} />
                        </Box>
                     </Paper>
                  </Grid> */}

                  <Grid item xs={12}>
                     <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Description /> Reportan que...
                     </Typography>
                     <Paper variant="outlined" sx={{ p: 2, mb: 1, bgcolor: "background.default" }}>
                        <Typography variant="body1">{service.pre_diagnosis}</Typography>
                     </Paper>
                  </Grid>
               </Grid>
            </ThemeProvider>
         )}
      </ModalComponent>
   );
}

function InfoSection({ title, icon, items, widthMd = 6 }) {
   return (
      <Grid item xs={12} md={widthMd}>
         <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {icon} {title}
         </Typography>
         <Paper variant="outlined" sx={{ p: 2 }}>
            {items.map((item, index) => (
               <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {item.icon && <Box sx={{ mr: 1 }}>{item.icon}</Box>}
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                     {item.label}:
                  </Typography>
                  <Typography variant="body1">{item.value}</Typography>
               </Box>
            ))}
         </Paper>
      </Grid>
   );
}
