import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import MainCard from "../../ui-component/cards/MainCard";
import VehicleTable from "../../components/vehicles/Table";
import VehicleForm from "../../components/vehicles/Form";

import { CorrectRes, ErrorRes } from "../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../context/AuthContext";

import { cloneElement, useEffect, useState } from "react";
import { useVehicleContext } from "../../context/VehicleContext";
import {
   Avatar,
   Button,
   ButtonBase,
   Card,
   CardContent,
   CardHeader,
   Chip,
   Drawer,
   FormControl,
   FormControlLabel,
   FormLabel,
   Grow,
   InputAdornment,
   InputLabel,
   List,
   ListItem,
   ListItemIcon,
   ListItemText,
   OutlinedInput,
   Popover,
   Radio,
   RadioGroup,
   TextField,
   Tooltip,
   Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import { AddCircleOutlineOutlined } from "@mui/icons-material";
import sAlert from "../../utils/sAlert";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import bgGarage from "../../assets/images/bg-primary.jpg";
import bgPlatform from "../../assets/images/bg-auto.jpg";
import bgPrimary from "../../assets/images/fondo menú.jpg";
import { Box, fontSize } from "@mui/system";
import ImgCar from "../../assets/images/auto.png";
import { drawerWidth } from "../../config/store/constant";
import { Icon123, IconCalendarStats, IconCandle, IconSearch } from "@tabler/icons";
import { display, shouldForwardProp } from "@mui/system";
import { useTheme } from "@emotion/react";
import { formatDatetime } from "../../utils/Formats";
import SearchInput from "../../components/SearchInput";
import PlatesRegisters from "../../components/vehicles/PlatesRegisters";
import TimeLineComponent from "../../components/TimeLineComponent";

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

const ShowVehicleView = () => {
   // const { result } = useLoaderData();
   const { setLoading, setOpenDialog, setBgImage } = useGlobalContext();
   const { singularName, vehicles, getVehicles, resetFormData, setTextBtnSumbit, setFormTitle, showVehicleBy, vehicle } = useVehicleContext();
   const theme = useTheme();
   const [search, setSearch] = useState("");
   const [searchType, setSearchType] = useState("number");
   const [classesImgVehicle, setClassesImgVehicle] = useState(null);
   const [growOn, setGrowOn] = useState(false);

   const handleClickAdd = () => {
      try {
         resetFormData();
         setOpenDialog(true);
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
         getVehicles();
         setLoading(false);
         document.querySelector("#search").focus();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [vehicle]);

   const Demo = styled("div")(({ theme }) => ({
      backgroundColor: theme.palette.background.paper
   }));

   const ComponentItem = ({ title, icon, text }) => {
      return (
         <ListItem>
            <ListItemIcon sx={{ mr: 2 }}>
               <Tooltip title={title} placement="left">
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
               position: "relative"
            }}
         >
            {/* <Button variant="contained" fullWidth onClick={() => handleClickAdd()} sx={{ mb: 1 }}>
               <AddCircleOutlineOutlined sx={{ mr: 1 }}></AddCircleOutlineOutlined> AGREGAR
            </Button> */}
            <Grid container spacing={2}>
               {/* PRIMER COLUMNA */}
               <Grid xs={12} md={3} sx={{ mb: 2 }}>
                  <SearchInput
                     idName={"search"}
                     search={search}
                     setSearch={setSearch}
                     searchType={searchType}
                     setSearchType={setSearchType}
                     handleKeyUpSearchSuccess={handleKeyUpSearchSuccess}
                  />
               </Grid>

               {/* COLUMNA CENTRAL */}
               <Grid xs={12} md={6} sx={{ mb: 2 }}>
                  {vehicle && (
                     <Grow in={growOn} style={{ transformOrigin: "0 0 0" }} {...(growOn ? { timeout: 1200 } : {})}>
                        <Card sx={{ backgroundColor: "transparent" }}>
                           <CardContent sx={{ color: "whitesmoke", textAlign: "center" }}>
                              <Typography variant={"h1"} sx={{ color: "whitesmoke" }}>
                                 PLACAS
                                 {vehicle && (
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
                                       {vehicle && vehicle.plates}
                                    </Paper>
                                 )}
                              </Typography>
                              <Box textAlign={"center"} mt={2}>
                                 {vehicle && (
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
                                 )}
                              </Box>
                           </CardContent>
                        </Card>
                     </Grow>
                  )}
               </Grid>

               {/* TERCER COLUMNA */}
               <Grid xs={12} md={3} sx={{ mb: 2 }}>
                  <Grid xs={12} md={2} sx={{ mb: 2 }}>
                     {vehicle && (
                        <Grow in={growOn} style={{ transformOrigin: "0 0 0" }} {...(growOn ? { timeout: 1500 } : {})}>
                           <Card>
                              <List>
                                 <ComponentItem title="No. Unidad" icon={<Icon123 />} text={vehicle.stock_number} />
                                 <ComponentItem title="Año" icon={<IconCandle />} text={vehicle.year} />
                                 <ComponentItem title="Fecha de registro" icon={<IconCalendarStats />} text={formatDatetime(vehicle.registration_date)} />
                              </List>
                           </Card>
                        </Grow>
                     )}
                  </Grid>
                  <Grid xs={12} md={2} sx={{ mb: 2 }}>
                     <Button variant="contained" fullWidth onClick={() => handleClickAdd()} sx={{ mb: 1 }}>
                        <Icon123 sx={{ mr: 1 }} /> VER PLAQUEOS
                     </Button>
                  </Grid>
               </Grid>
            </Grid>

            {/* IMAGEN INSIGNIA MARCA */}
            <Box className={`brand-container ${classesImgVehicle}`}>
               <img src={vehicle && `${import.meta.env.VITE_HOST}/${"GPCenter/brands/Ford-Logo.png"}`} style={{ maxHeight: "200px" }} />
               <Typography variant="h1" sx={{ color: "whitesmoke", fontSize: "60px" }}>
                  {vehicle && vehicle.model}
               </Typography>
            </Box>
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
                     bottom: `calc(40% - ${drawerWidth + 55}px)`,
                     zIndex: 0
                  }}
               />
            </Box>
            {/* <VehicleTable /> */}
         </MainCard>
         <MainCard
            sx={{
               // backgroundImage: `url(${bgPlatform})`,
               // backgroundPosition: "center",
               // backgroundSize: "cover",
               // backgroundRepeat: "no-repeat",
               // background: "rgb(7,14,24)";
               background: "linear-gradient(0deg, rgba(7,14,24,1) 0%, rgba(8,31,52,1) 100%)",
               // height: "103.5%",
               maxHeight: "103.5%",
               width: "103%",
               margin: "-12px",
               borderRadius: "12px",
               position: "relative"
            }}
         >
            <TimeLineComponent />
         </MainCard>

         <PlatesRegisters />
         {/* <VehicleForm dataBrands={result.brands} dataVehicleStatus={result.vehicleStatus} /> */}
      </>
   );
};

export const loaderIndexShowVehicleView = async () => {
   try {
      const res = CorrectRes;

      const axiosBrands = await Axios.get("/brands/selectIndex");
      res.result.brands = axiosBrands.data.data.result;
      // res.result.brands.unshift({ id: 0, label: "Seleccione una opción..." });
      const axiosStatus = await Axios.get("/vehicleStatus/selectIndex");
      res.result.vehicleStatus = axiosStatus.data.data.result;

      return res;
   } catch (error) {
      const res = ErrorRes;
      console.log(error);
      res.message = error;
      res.alert_text = error;
      sAlert.Error(error);
      return res;
   }
};

export default ShowVehicleView;
