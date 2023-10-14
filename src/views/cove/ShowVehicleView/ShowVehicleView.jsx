import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import MainCard from "../../../ui-component/cards/MainCard";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { Axios } from "../../../context/AuthContext";

import { useEffect, useState } from "react";
import { useVehicleContext } from "../../../context/VehicleContext";
import { Avatar, Button, Card, CardContent, Chip, Grow, List, ListItem, ListItemIcon, OutlinedInput, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
// import bgGarage from "../../assets/images/bg-primary.jpg";
// import bgPrimary from "../../assets/images/fondo menú.jpg";
// import bgPlatform from "../../../assets/images/bg-auto.jpg";
import bgPlatform from "../../../assets/images/bg-primary.jpg";
import { Box } from "@mui/system";
import { drawerWidth } from "../../../config/store/constant";
import { Icon123, IconCalendarStats, IconCandle, IconNotebook } from "@tabler/icons";
import { shouldForwardProp } from "@mui/system";
import { useTheme } from "@emotion/react";
import { formatDatetime, handleInputStringCase } from "../../../utils/Formats";
import SearchInput from "../../../components/SearchInput";
import PlatesRegisters from "./PlatesRegisters";
import HistoryRegister from "./HIstoryRegister";
import { useVehiclePlateContext } from "../../../context/VehiclePlateContext";
import ModalAsig from "./ModalAsig";
import UserContextProvider from "../../../context/UserContext";
import IconBtnService from "../../../components/icons/IconBtnService";
import IconBtnAssign from "../../../components/icons/IconBtnAssign";
import IconBtnLoan from "../../../components/icons/IconBtnLoan";
import ModalService from "./ModalService";

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
   // width: 434,
   // marginLeft: 16,
   // paddingLeft: 16,
   // paddingRight: 16,
   "& input": {
      background: "transparent !important",
      paddingLeft: "4px !important"
   },
   [theme.breakpoints.down("lg")]: {
      width: 250
   },
   [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff"
   }
}));

const sizeBtns = 150;

const ShowVehicleView = () => {
   const { setLoading, setOpenDialog, setBgImage } = useGlobalContext();
   const { singularName, vehicles, getVehicles, resetFormData, setTextBtnSumbit, setFormTitle, showVehicleBy, vehicle } = useVehicleContext();
   const { vehiclePlates, setVehiclePlates, historyByVehicleId } = useVehiclePlateContext();

   const theme = useTheme();
   const [search, setSearch] = useState("");
   const [searchType, setSearchType] = useState("number");
   const [classesImgVehicle, setClassesImgVehicle] = useState(null);
   const [growOn, setGrowOn] = useState(false);
   const [openDialogPlates, setOpenDialogPlates] = useState(false);
   const [openDialogHistory, setOpenDialogHistory] = useState(false);
   const [openService, setOpenService] = useState(false);
   const [openAssign, setOpenAssign] = useState(false);
   const [openLoan, setOpenLoan] = useState(false);

   const handleClickViewPlates = async () => {
      try {
         // resetFormData();
         setVehiclePlates([]);
         if (vehicle == null) return Toast.Error("No hay unidad encotnrada");
         const axiosResponse = await historyByVehicleId(vehicle.id);
         // console.log(axiosResponse);
         setOpenDialogPlates(true);
         // setTextBtnSumbit("AGREGAR");
         // setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickViewHistory = () => {
      try {
         // resetFormData();
         setOpenDialogHistory(true);
         // setTextBtnSumbit("AGREGAR");
         // setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleKeyUpSearchSuccess = async (e) => {
      if (e.target.value.length == 0) return Toast.Info("Buscador vacio.");
      if (e.key === "Enter" || e.keyCode === 13) {
         setClassesImgVehicle("zoom-out");
         setGrowOn(false);
         setLoading(true);
         const searchBy = searchType == "number" ? "stock_number" : "plates";
         const res = await showVehicleBy(searchBy, search);
         setSearch("");
         setLoading(false);
         if (res.result.length == 0) return Toast.Info(res.alert_title);
         setTimeout(() => {
            setGrowOn(true);
            setClassesImgVehicle("zoom-in");
         }, 800);
      }
   };

   useEffect(() => {
      try {
         setLoading(true);
         setBgImage("bgGarage");
         // getVehicles();
         setLoading(false);
         document.querySelector("#search").focus();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [vehicle, vehiclePlates]);

   const Demo = styled("div")(({ theme }) => ({
      backgroundColor: theme.palette.background.paper
   }));

   const ComponentItem = ({ title, icon, text, ...prop }) => {
      return (
         <ListItem>
            <ListItemIcon sx={{ mr: 2 }}>
               <Tooltip title={title} placement="left" arrow>
                  <Avatar sx={{ backgroundColor: "#1F2227" }}>{icon}</Avatar>
               </Tooltip>
            </ListItemIcon>
            <Typography sx={{ fontSize: 20, fontWeight: "bolder" }}>{text}</Typography>
         </ListItem>
      );
   };

   return (
      <>
         {/* <Alert severity="warning" sx={{mb:1}}>
            <AlertTitle>Info</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         <MainCard
            sx={{
               backgroundImage: `url(${bgPlatform})`,
               backgroundPosition: "center",
               backgroundSize: "cover",
               backgroundRepeat: "no-repeat",
               height: "103.5%",
               maxHeight: "103.5%",
               width: "103%",
               margin: "-12px",
               borderRadius: "12px",
               position: "relative",
               overFlow: "hidden"
            }}
         >
            <Grid container spacing={2}>
               {/* PRIMER COLUMNA */}
               <Grid xs={12} md={3} sx={{ mb: 2 }}>
                  <SearchInput
                     idName={"search"}
                     search={search}
                     setSearch={setSearch}
                     searchType={searchType}
                     setSearchType={setSearchType}
                     onInput={(e) => handleInputStringCase(e, setSearch, true)}
                     handleKeyUpSearchSuccess={handleKeyUpSearchSuccess}
                  />
               </Grid>

               {/* COLUMNA CENTRAL */}
               {vehicle && (
                  <Grow in={growOn} style={{ transformOrigin: "250px 50px" }} {...(growOn ? { timeout: 1500 } : { timeout: 600 })}>
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <Card sx={{ backgroundColor: "transparent" }}>
                           <CardContent sx={{ color: "whitesmoke", textAlign: "center" }}>
                              <Typography variant={"h1"} sx={{ color: "whitesmoke" }}>
                                 PLACAS
                                 <Paper
                                    elevation={6}
                                    sx={{
                                       // background: "rgb(33,91,132)",
                                       background: "radial-gradient(circle, rgba(33,91,132,1) 0%, rgba(33,77,116,1) 100%)" || "rgb(33,91,132)",
                                       paddingBlock: 1,
                                       fontWeight: "bolder",
                                       fontSize: 40,
                                       color: "whitesmoke"
                                    }}
                                 >
                                    {vehicle.plates}
                                 </Paper>
                              </Typography>
                              <Box textAlign={"center"} mt={2}>
                                 <Chip
                                    sx={{
                                       height: "auto",
                                       "& .MuiChip-label": {
                                          display: "block",
                                          whiteSpace: "normal"
                                       },
                                       fontSize: "18px",
                                       fontWeight: "bolder",
                                       p: 1,
                                       // color: "#F3F3F3",
                                       color: vehicle.letter_black ? "#3E3E3E" : "#F3F3F3",
                                       backgroundColor: vehicle.bg_color
                                       // backgroundColor: "#3E3E3E"
                                    }}
                                    label={vehicle.vehicle_status}
                                 />
                              </Box>
                           </CardContent>
                        </Card>
                     </Grid>
                  </Grow>
               )}

               {/* TERCER COLUMNA */}
               {vehicle && (
                  <Grow in={growOn} style={{ transformOrigin: "0 0 0" }} {...(growOn ? { timeout: 1500 } : { timeout: 600 })}>
                     <Grid xs={12} md={3} sx={{ mb: 2 }}>
                        <Grid xs={12} md={12} sx={{ mb: 2 }}>
                           <Card>
                              <List>
                                 <ComponentItem title="No. Unidad" icon={<Icon123 />} text={vehicle.stock_number} />
                                 <ComponentItem title="Año" icon={<IconCandle />} text={vehicle.year} />
                                 <ComponentItem title="Fecha de registro" icon={<IconCalendarStats />} text={formatDatetime(vehicle.registration_date)} />
                              </List>
                           </Card>
                        </Grid>
                        <Grid xs={12} md={12} sx={{ mb: 2 }}>
                           <Button variant="contained" fullWidth onClick={() => handleClickViewPlates()} sx={{ mb: 1 }}>
                              <Icon123 sx={{ mr: 1 }} /> VER PLAQUEOS
                           </Button>
                        </Grid>
                        <Grid xs={12} md={12} sx={{ mb: 2 }}>
                           <Button variant="contained" fullWidth onClick={() => handleClickViewHistory()} sx={{ mb: 1 }}>
                              <IconNotebook sx={{ mr: 1 }} /> VER HISTORIAL
                           </Button>
                        </Grid>
                     </Grid>
                  </Grow>
               )}
            </Grid>

            {/* IMAGEN DEL VEHICULO */}
            <Box sx={{}}>
               <img
                  // src={ImgCar}
                  src={vehicle && `${import.meta.env.VITE_HOST}/${vehicle.img_path}`}
                  className={classesImgVehicle}
                  style={{
                     maxHeight: "550px",
                     position: "absolute",
                     left: `calc(38% - ${drawerWidth + 10}px)`,
                     bottom: `calc(50% - ${drawerWidth + 55}px)`,
                     zIndex: 0
                  }}
               />
            </Box>

            {/* IMAGEN INSIGNIA MARCA */}
            <Box className={`brand-container ${classesImgVehicle}`}>
               <img src={vehicle && `${import.meta.env.VITE_HOST}/${vehicle.img_brand}`} style={{ maxHeight: "100px" }} />
               <Typography variant="h1" sx={{ color: "whitesmoke", fontSize: "42px", textShadow: "2px 2px 4px rgba(0, 0, 0, 1)" }}>
                  {vehicle && vehicle.model}
               </Typography>
            </Box>

            {/* BOTONERA DE ACCIONES */}
            <Box
               sx={{
                  flexGrow: 1,
                  width: "70%",
                  position: "absolute",
                  left: `0`,
                  bottom: `0`,
                  mb: 1,
                  mx: 2,
                  zIndex: 0
               }}
            >
               <Grow in={growOn} style={{ transformOrigin: "250px 50px" }} {...(growOn ? { timeout: 1500 } : { timeout: 600 })}>
                  <Grid container spacing={3}>
                     <Grid xs alignItems={"center"}>
                        <Tooltip title={"Dar Servicio a esta unidad"} placement="top" arrow>
                           <Box textAlign={"center"}>
                              <IconBtnService onClick={() => setOpenService(true)} width={sizeBtns} height={sizeBtns} className={"btn-action"} />
                           </Box>
                        </Tooltip>
                     </Grid>
                     <Grid xs alignItems={"center"}>
                        <Tooltip title={"Asignar unidad"} placement="top" arrow>
                           <Box textAlign={"center"}>
                              <IconBtnAssign onClick={() => setOpenAssign(true)} width={sizeBtns} height={sizeBtns} className={"btn-action"} />
                           </Box>
                        </Tooltip>
                     </Grid>
                     <Grid xs alignItems={"center"}>
                        <Tooltip title={"Prestar unidad"} placement="top" arrow>
                           <Box textAlign={"center"}>
                              <IconBtnLoan onClick={() => setOpenLoan(true)} width={sizeBtns} height={sizeBtns} className={"btn-action"} />
                           </Box>
                        </Tooltip>
                     </Grid>
                  </Grid>
               </Grow>
            </Box>
         </MainCard>

         <UserContextProvider>
            <ModalService open={openService} setOpen={setOpenService} />
            <ModalAsig open={openAssign} setOpen={setOpenAssign} />
         </UserContextProvider>
         <PlatesRegisters openDialog={openDialogPlates} setOpenDialog={setOpenDialogPlates} />
         <HistoryRegister openDialog={openDialogHistory} setOpenDialog={setOpenDialogHistory} />
         {/* <VehicleForm dataBrands={result.brands} dataVehicleStatus={result.vehicleStatus} /> */}
      </>
   );
};

export default ShowVehicleView;
