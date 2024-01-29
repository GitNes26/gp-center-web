import VehicleDT from "./DataTable";
import VehicleForm from "./Form";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useVehicleContext } from "../../../context/VehicleContext";
import { Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useBrandContext } from "../../../context/BrandContext";
import { useModelContext } from "../../../context/ModelContext";
import { useVehicleStatusContext } from "../../../context/VehicleStatusContext";

const VehiclesView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, vehicle, getVehicles } = useVehicleContext();
   const { getBrandsSelectIndex } = useBrandContext();
   // const { getModelsSelectIndex } = useModelContext();
   const { getVehicleStatussSelectIndex } = useVehicleStatusContext();

   useEffect(() => {
      try {
         setLoading(true);
         getVehicles();
         getBrandsSelectIndex();
         // getModelsSelectIndex();
         getVehicleStatussSelectIndex();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [vehicle]);

   return (
      <>
         {/* <Alert severity="warning" sx={{mb:1}}>
            <AlertTitle>Info</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={"#1E2126"} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         <VehicleDT />
         {/* </MainCard> */}

         <VehicleForm />
      </>
   );
};

export const loaderIndexVehiclesView = async () => {
   try {
      const res = CorrectRes;
      // const auth = JSON.parse(localStorage.getItem("auth"));

      // const axiosRoles = await Axios.get(`/roles/selectIndex/role_id/`);
      // res.result.roles = axiosRoles.data.data.result;
      // res.result.roles.unshift({ id: 0, label: "Selecciona una opción..." });
      // const axiosVehicles = await Axios.get("/vehicles/selectIndex");
      // res.result.vehicles = axiosVehicles.data.data.result;
      // res.result.vehicles.unshift({ id: 0, label: "Selecciona una opción..." });
      // // console.log(res);

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

export default VehiclesView;
