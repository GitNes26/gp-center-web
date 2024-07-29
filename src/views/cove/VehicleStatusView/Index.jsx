import VehicleStatusDT from "./DataTable";
import VehicleStatusForm from "./Form";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useVehicleStatusContext } from "../../../context/VehicleStatusContext";
import { Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { gpcDark, useGlobalContext } from "../../../context/GlobalContext";

const VehicleStatusView = () => {
   // const { result } = useLoaderData();
   const { setLoading, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, vehicleStatus, getVehicleStatuss, resetFormData, setTextBtnSumbit, setFormTitle } = useVehicleStatusContext();

   useEffect(() => {
      try {
         setLoading(true);
         getVehicleStatuss();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [vehicleStatus]);

   return (
      <>
         {/* <Alert severity="warning" sx={{mb:1}}>
            <AlertTitle>Info</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={gpcDark} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         {/* <DataTableComponent /> */}
         <VehicleStatusDT />
         {/* </MainCard> */}

         <VehicleStatusForm />
      </>
   );
};

export const loaderIndexVehicleStatusView = async () => {
   try {
      const res = CorrectRes;
      // const auth = JSON.parse(localStorage.getItem("auth"));

      // const axiosRoles = await Axios.get(`/roles/selectIndex/role_id/`);
      // res.result.roles = axiosRoles.data.data.result;
      // res.result.roles.unshift({ id: 0, label: "Selecciona una opción..." });
      // const axiosVehicleStatuss = await Axios.get("/vehicleStatuss/selectIndex");
      // res.result.vehicleStatuss = axiosVehicleStatuss.data.data.result;
      // res.result.vehicleStatuss.unshift({ id: 0, label: "Selecciona una opción..." });
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

export default VehicleStatusView;
