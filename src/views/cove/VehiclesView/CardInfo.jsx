import React from "react";
import { Box, Card, CardContent, CardMedia, Typography, Grid, Paper, Divider, ThemeProvider, createTheme, styled } from "@mui/material";
import { DirectionsCar, Speed, LocalGasStation, Today, Scale, Settings, AttachMoney, EmojiEvents, Security, FlashOn } from "@mui/icons-material";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useVehicleContext } from "../../../context/VehicleContext";
import { ModalComponent } from "../../../components/ModalComponent";

// Crear un tema personalizado
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

// Componente estilizado para las tarjetas de características
const FeatureCard = styled(Paper)(({ theme }) => ({
   padding: theme.spacing(3),
   textAlign: "center",
   color: theme.palette.text.secondary,
   transition: "all 0.3s",
   "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows[4]
   }
}));

export default function VehicleCardInfo() {
   const { openCardInfo, setOpenCardInfo } = useGlobalContext();
   const { vehicle } = useVehicleContext();
   console.log("🚀 ~ VehicleCardInfo ~ vehicle:", vehicle);
   return (
      vehicle && (
         <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo}>
            <ThemeProvider theme={theme}>
               {/* <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", py: 8, px: 2 }}> */}
               <Card sx={{ maxWidth: 1200, margin: "auto", borderRadius: 4, overflow: "hidden" }}>
                  <CardMedia
                     component="img"
                     height="400"
                     image={`${import.meta.env.VITE_HOST}/${vehicle.img_preview}`}
                     sx={{ objectFit: "contain" }}
                     alt="Imagen del vehículo"
                  />
                  <CardContent sx={{ p: 4 }}>
                     <Typography variant="h3" component="h1" gutterBottom>
                        {vehicle.brand} - {vehicle.model} {vehicle.year}
                     </Typography>

                     <Grid container spacing={4}>
                        <InfoSection title="Especificaciones Generales" icon={<DirectionsCar />}>
                           <InfoItem label="Marca" value={vehicle.brand} />
                           <InfoItem label="Modelo" value={vehicle.model} />
                           <InfoItem label="Año" value={vehicle.year} />
                           {/* <InfoItem label="Tipo" value="Sedán de Lujo" /> */}
                           <br />
                           <Typography variant="p">{vehicle.description}</Typography>
                        </InfoSection>
                        <InfoSection title="Más Información" icon={<Settings />}>
                           <InfoItem label="Fecha de registro" value={vehicle.registration_date} />
                           <InfoItem label="Tipos de licencia" value={vehicle.acceptable_license_type} />
                           <InfoItem label="Número de serie" value={vehicle.serial_number} />
                           <InfoItem label="Tarjeta de circulación" value={vehicle.circulation_card} />
                           <InfoItem label="Póliza de seguro" value={vehicle.insurance_policy} />
                        </InfoSection>
                        {/* <InfoSection title="Motor y Rendimiento" icon={<Settings />}>
                           <InfoItem label="Motor" value="3.0L V6 Turbo" />
                           <InfoItem label="Potencia" value="350 HP @ 5,500 rpm" />
                           <InfoItem label="Torque" value="500 Nm @ 2,000-4,500 rpm" />
                           <InfoItem label="Transmisión" value="Automática 9 velocidades" />
                        </InfoSection>
                        <InfoSection title="Consumo y Emisiones" icon={<LocalGasStation />}>
                           <InfoItem label="Consumo ciudad" value="10.5 L/100km" />
                           <InfoItem label="Consumo carretera" value="7.2 L/100km" />
                           <InfoItem label="Emisiones CO2" value="180 g/km" />
                           <InfoItem label="Norma de emisiones" value="Euro 6d" />
                        </InfoSection>
                        <InfoSection title="Dimensiones y Capacidades" icon={<Scale />}>
                           <InfoItem label="Largo" value="5,050 mm" />
                           <InfoItem label="Ancho" value="1,960 mm" />
                           <InfoItem label="Alto" value="1,470 mm" />
                           <InfoItem label="Peso" value="1,850 kg" />
                        </InfoSection>  */}
                     </Grid>

                     <Divider sx={{ my: 6 }} />
                     {/* 
                     <Typography variant="h4" component="h2" gutterBottom align="center">
                        Características Destacadas
                     </Typography>

                     <Grid container spacing={3} sx={{ mt: 2 }}>
                        <FeatureItem icon={<Speed />} title="Velocidad Máxima" value="280 km/h" />
                        <FeatureItem icon={<FlashOn />} title="0-100 km/h" value="4.5 segundos" />
                        <FeatureItem icon={<Today />} title="Garantía" value="5 años o 100,000 km" />
                        <FeatureItem icon={<Security />} title="Seguridad" value="5 estrellas NCAP" />
                        <FeatureItem icon={<EmojiEvents />} title="Premios" value="Coche del Año 2023" />
                        <FeatureItem icon={<AttachMoney />} title="Precio Base" value="$65,000" />
                     </Grid> */}
                  </CardContent>
               </Card>
               {/* </Box> */}
            </ThemeProvider>
         </ModalComponent>
      )
   );
}

function InfoSection({ title, children, icon }) {
   return (
      <Grid item xs={12} md={6}>
         <Box sx={{ mb: 2 }}>
            <Typography variant="h5" component="h3" sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: "bolder" }}>
               {React.cloneElement(icon, { sx: { fontSize: 28 } })}
               {title}
            </Typography>
         </Box>
         <Paper elevation={2} sx={{ p: 2 }}>
            {children}
         </Paper>
      </Grid>
   );
}

function InfoItem({ label, value }) {
   return (
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5 }}>
         <Typography variant="body2" color="text.secondary">
            {label}
         </Typography>
         <Typography variant="body1">{value}</Typography>
      </Box>
   );
}

function FeatureItem({ icon, title, value }) {
   return (
      <Grid item xs={12} sm={6} md={4}>
         <FeatureCard elevation={2}>
            {React.cloneElement(icon, { sx: { fontSize: 40, color: "primary.main", mb: 1 } })}
            <Typography variant="h6" component="h3" gutterBottom>
               {title}
            </Typography>
            <Typography variant="h5" component="p" fontWeight="bold">
               {value}
            </Typography>
         </FeatureCard>
      </Grid>
   );
}
