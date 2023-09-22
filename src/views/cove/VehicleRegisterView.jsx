import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import MainCard from "../../ui-component/cards/MainCard";
import VehicleTable from "../../components/vehicles/Table";
import VehicleForm from "../../components/vehicles/Form";

import { CorrectRes, ErrorRes } from "../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../context/AuthContext";

import { useEffect } from "react";
import { useVehicleContext } from "../../context/VehicleContext";
import { Button, Card, TextField, Typography } from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import sAlert from "../../utils/sAlert";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import bgGarage from "../../assets/images/bg-primary.jpg";
import bgPlatform from "../../assets/images/bg-auto.jpg";
import { Box } from "@mui/system";
import ImgCar from "../../assets/images/auto.png";
import { drawerWidth } from "../../config/store/constant";

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

const VehiclesRegisterView = () => {
   const { result } = useLoaderData();
   const { setLoading, setOpenDialog, setBgImage } = useGlobalContext();
   const { singularName, vehicles, getVehicles, resetFormData, setTextBtnSumbit, setFormTitle } = useVehicleContext();

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

   useEffect(() => {
      try {
         console.log("registrarr");
         setBgImage("bgGarage");
         setLoading(true);
         getVehicles();
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, []);

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
            <Button variant="contained" fullWidth onClick={() => handleClickAdd()} sx={{ mb: 1 }}>
               <AddCircleOutlineOutlined sx={{ mr: 1 }}></AddCircleOutlineOutlined> AGREGAR
            </Button>

            <Box>
               <Typography color={"lightcyan"} fontSize={75}>
                  PLACAS
               </Typography>
               <TextField id="plates" />
            </Box>

            <Box sx={{}}>
               <img
                  src={ImgCar}
                  style={{ maxHeight: "550px", position: "absolute", left: `calc(38% - ${drawerWidth + 10}px)`, bottom: `calc(40% - ${drawerWidth + 20}px)` }}
               />
            </Box>
            {/* <VehicleTable /> */}
         </MainCard>

         <VehicleForm dataBrands={result.brands} dataVehicleStatus={result.vehicleStatus} />
      </>
   );
};

export const loaderIndexVehiclesRegisterView = async () => {
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

export default VehiclesRegisterView;
