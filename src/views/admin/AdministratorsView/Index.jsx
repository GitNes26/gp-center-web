import AdministratorForm from "./Form";
import AdministratorDT from "./DataTable";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useAdministratorContext } from "../../../context/AdministratorContext";
import { Alert, AlertTitle, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";

const AdministratorsView = () => {
   const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, administrator, getAdministrators } = useAdministratorContext();

   useEffect(() => {
      try {
         setLoading(true);
         getAdministrators();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [administrator]);

   return (
      <>
         {/* <Alert severity="success" sx={{ mb: 1 }} >
            <AlertTitle>Titulo</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={"#1E2126"} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         <AdministratorDT />
         {/* </MainCard> */}

         <AdministratorForm dataRoles={result.roles} />
      </>
   );
};

export const loaderIndexAdministratorsView = async () => {
   try {
      const res = CorrectRes;
      // const axiosData = await Axios.get("/administrators");
      // res.result.administrators = axiosData.data.data.result;
      const auth = JSON.parse(localStorage.getItem("auth"));

      const axiosRoles = await Axios.get(`/roles/selectIndex/${auth.role_id}`);
      // console.log(axiosRoles.data.data);
      res.result.roles = axiosRoles.data.data.result;
      res.result.roles.unshift({ id: 0, label: "Selecciona una opción..." });
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

export default AdministratorsView;
