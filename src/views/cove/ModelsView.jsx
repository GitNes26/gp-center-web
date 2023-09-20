import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import MainCard from "../../ui-component/cards/MainCard";
import ModelTable from "../../components/models/Table";
import ModelForm from "../../components/models/Form";

import { CorrectRes, ErrorRes } from "../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../context/AuthContext";

import { useEffect } from "react";
import { useModelContext } from "../../context/ModelContext";
import { Button } from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import sAlert from "../../utils/sAlert";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

const ModelsView = () => {
   const { result } = useLoaderData();
   const { setLoading, setOpenDialog } = useGlobalContext();
   const { singularName, models, getModels, resetFormData, setTextBtnSumbit, setFormTitle } = useModelContext();

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
         setLoading(true);
         getModels();
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

         <MainCard /* title="Listado Escuelas" */>
            <Button variant="contained" fullWidth onClick={() => handleClickAdd()} sx={{ mb: 1 }}>
               <AddCircleOutlineOutlined sx={{ mr: 1 }}></AddCircleOutlineOutlined> AGREGAR
            </Button>
            <ModelTable />
         </MainCard>

         <ModelForm dataBrands={result.brands} />
      </>
   );
};

export const loaderIndexModelsView = async () => {
   try {
      const res = CorrectRes;

      const axiosBrands = await Axios.get("/brands/selectIndex");
      res.result.brands = axiosBrands.data.data.result;
      // res.result.brands.unshift({ id: 0, label: "Seleccione una opción..." });
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
