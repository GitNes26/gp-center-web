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
   FormControl,
   FormControlLabel,
   FormLabel,
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
import { Box, fontSize } from "@mui/system";
import ImgCar from "../../assets/images/auto.png";
import { drawerWidth } from "../../config/store/constant";
import { Icon123, IconAdjustmentsHorizontal, IconBadgeTm, IconBoxModel2, IconCalendarStats, IconCandle, IconSearch } from "@tabler/icons";
import { display, shouldForwardProp } from "@mui/system";
import { useTheme } from "@emotion/react";
import { formatDatetime } from "../../utils/Formats";

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
const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
   ...theme.typography.commonAvatar,
   ...theme.typography.mediumAvatar,
   background: theme.palette.secondary.light,
   color: theme.palette.secondary.dark,
   "&:hover": {
      background: theme.palette.secondary.dark,
      color: theme.palette.secondary.light
   }
}));

const ShowVehicleView = () => {
   // const { result } = useLoaderData();
   const { setLoading, setOpenDialog, setBgImage } = useGlobalContext();
   const { singularName, vehicles, getVehicles, resetFormData, setTextBtnSumbit, setFormTitle, showVehicleBy, vehicle } = useVehicleContext();
   const theme = useTheme();
   const [search, setSearch] = useState("");
   const [searchType, setSearchType] = useState("number");

   const handleClickAdd = () => {
      try {
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleChangeSearch = (value) => {
      setSearch(value);
   };

   const handleChangeSearchBy = (value) => {
      console.log("handleChangeSearchBy", value);
      setSearchType(value);
      setSearch("");
      // setTypeInputSearch(value);
   };
   const handleKeyUpSearch = async (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
         setLoading(true);
         const searchBy = searchType == "number" ? "stock_number" : "plates";
         const res = await showVehicleBy(searchBy, search);
         console.log(res);
         if (res.result.length == 0) Toast.Info(res.alert_title);
         setLoading(false);
      }
   };

   useEffect(() => {
      try {
         setLoading(true);
         setBgImage("bgGarage");
         getVehicles();
         console.log(vehicle);
         setLoading(false);
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
                  <Card sx={{ backgroundColor: "transparent" }}>
                     <CardContent>
                        {/* <InputLabel id="search-label" sx={{ marginBottom: 2 }}>
                        Buscar Vehículo
                     </InputLabel> */}
                        <Tooltip title={"Presiona ENTER para comenzar la busqueda"} placement="top">
                           <OutlineInputStyle
                              id="search"
                              name="search"
                              type={searchType}
                              fullWidth
                              value={search}
                              onChange={(e) => handleChangeSearch(e.target.value)}
                              onKeyUp={(e) => handleKeyUpSearch(e)}
                              placeholder="Buscar vehículo"
                              startAdornment={
                                 <InputAdornment position="start">
                                    <IconSearch stroke={2.5} size="1.5rem" color={theme.palette.grey[500]} />
                                 </InputAdornment>
                              }
                              aria-describedby="search-helper-text"
                              inputProps={{ "aria-label": "weight" }}
                              sx={{}}
                           />
                        </Tooltip>

                        <FormControl fullWidth sx={{ color: "whitesmoke", alignItems: "center" }}>
                           {/* <FormLabel id="searchType-label" sx={{ color: "whitesmoke" }}>
                           Buscar por
                        </FormLabel> */}
                           <RadioGroup
                              row
                              aria-labelledby="searchType-label"
                              id="searchType"
                              name="searchType"
                              value={searchType}
                              onChange={(e) => handleChangeSearchBy(e.target.value)}
                           >
                              <FormControlLabel value={"number"} control={<Radio />} label="No. de Unidad" />
                              <FormControlLabel value={"text"} control={<Radio />} label="Placas" />
                           </RadioGroup>
                        </FormControl>
                     </CardContent>
                  </Card>
               </Grid>

               {/* COLUMNA CENTRAL */}
               <Grid xs={12} md={6} sx={{ mb: 2 }}>
                  <Card sx={{ backgroundColor: "transparent" }}>
                     <CardContent sx={{ color: "whitesmoke", textAlign: "center" }}>
                        <Typography variant={"h1"} sx={{ color: "whitesmoke" }}>
                           PLACAS
                           {vehicle && (
                              <Paper
                                 elevation={6}
                                 sx={{
                                    background: "rgb(33,91,132)",
                                    background: "radial-gradient(circle, rgba(33,91,132,1) 0%, rgba(33,77,116,1) 100%)",
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
               </Grid>

               {/* TERCER COLUMNA */}
               <Grid xs={12} md={3} sx={{ mb: 2 }}>
                  <Grid xs={12} md={2} sx={{ mb: 2 }}>
                     <Card>
                        {vehicle ? (
                           <List>
                              <ComponentItem title="No. Unidad" icon={<Icon123 />} text={vehicle.stock_number} />
                              <ComponentItem title="Marca" icon={<IconBadgeTm />} text={vehicle.brand} />
                              <ComponentItem title="Modelo" icon={<IconBoxModel2 />} text={vehicle.model} />
                              <ComponentItem title="Año" icon={<IconCandle />} text={vehicle.year} />
                              <ComponentItem title="Fecha de registro" icon={<IconCalendarStats />} text={formatDatetime(vehicle.registration_date)} />
                           </List>
                        ) : (
                           <List>
                              <ComponentItem title="No. Unidad" icon={<Icon123 />} text={"000"} />
                              <ComponentItem title="Marca" icon={<IconBadgeTm />} text={"Marca"} />
                              <ComponentItem title="Modelo" icon={<IconBoxModel2 />} text={"Modelo"} />
                              <ComponentItem title="Año" icon={<IconCandle />} text={"0000"} />
                              <ComponentItem title="Fecha" icon={<IconCalendarStats />} text={formatDatetime("2023-01-01")} />
                           </List>
                        )}
                     </Card>
                  </Grid>
               </Grid>
            </Grid>

            {/* IMAGEN DEL VEHICULO */}
            <Box sx={{}}>
               <img
                  src={ImgCar}
                  style={{
                     maxHeight: "550px",
                     position: "absolute",
                     left: `calc(38% - ${drawerWidth + 10}px)`,
                     bottom: `calc(40% - ${drawerWidth + 20}px)`,
                     zIndex: 0
                  }}
               />
            </Box>
            {/* <VehicleTable /> */}
         </MainCard>

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
