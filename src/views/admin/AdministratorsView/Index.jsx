import AdministratorForm from "./Form";
import AdministratorDT from "./DataTable";

import { CorrectRes, ErrorRes } from "../../../utils/Response";

import { useEffect } from "react";
import { useAdministratorContext } from "../../../context/AdministratorContext";
import { Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { gpcDark, useGlobalContext } from "../../../context/GlobalContext";

const AdministratorsView = () => {
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
         <Typography variant="h1" color={gpcDark} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         <AdministratorDT />
         {/* </MainCard> */}

         <AdministratorForm />
      </>
   );
};

export const loaderIndexAdministratorsView = async () => {
   try {
      const res = CorrectRes;
      // const axiosData = await Axios.get("/administrators");
      // res.result.administrators = axiosData.data.data.result;
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
