import ModelDT from "./DataTable";
import ModelForm from "./Form";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useModelContext } from "../../../context/ModelContext";
import { Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useBrandContext } from "../../../context/BrandContext";

const ModelsView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, model, getModels } = useModelContext();
   const { getBrandsSelectIndex } = useBrandContext();

   useEffect(() => {
      try {
         setLoading(true);
         getBrandsSelectIndex();
         getModels();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [model]);

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
         <ModelDT />
         {/* </MainCard> */}

         <ModelForm />
      </>
   );
};

export const loaderIndexModelsView = async () => {
   try {
      const res = CorrectRes;
      // const auth = JSON.parse(localStorage.getItem("auth"));

      // const axiosRoles = await Axios.get(`/roles/selectIndex/role_id/`);
      // res.result.roles = axiosRoles.data.data.result;
      // res.result.roles.unshift({ id: 0, label: "Selecciona una opción..." });
      // const axiosModels = await Axios.get("/models/selectIndex");
      // res.result.models = axiosModels.data.data.result;
      // res.result.models.unshift({ id: 0, label: "Selecciona una opción..." });
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

export default ModelsView;
