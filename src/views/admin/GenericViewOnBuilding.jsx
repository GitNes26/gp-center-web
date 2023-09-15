import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import MainCard from "../../ui-component/cards/MainCard";
import SchoolTable from "../../components/schools/SchoolTable";
import SchoolForm from "../../components/schools/SchoolForm";

import { CorrectRes, ErrorRes } from "../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../context/UserContext";

import { useEffect } from "react";
import { useSchoolContext } from "../../context/SchoolContext";
import { Button } from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import sAlert from "../../utils/sAlert";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import TableComponent from "../../components/TableComponent";
import { formatPhone } from "../../utils/Formats";

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

const SchoolView = () => {
   const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { schools, getSchools, showSchool, deleteSchool, setOpenDialog, resetFormData, setTextBtnSumbit, setFormTitle } = useSchoolContext();
   // const { setTextBtnSumbit, setFormTitle } = useSchoolContext();

   //#region PARA LA TABLA
   const columns = ["Clave", "Nivel", "Escuela", "Dirección", "Director", "Tel", "Local", "Zona", "Acciones"];
   const convertDataContextToArray = (ButtonsAction) => {
      const data = [];
      schools.map((obj) => {
         const register = [];
         register.push(obj.code);
         register.push(obj.level);
         register.push(obj.school);
         register.push(obj.address);
         register.push(obj.director);
         register.push(formatPhone(obj.phone));
         register.push(obj.loc_for == "1" ? "LOCAL" : "FORANEA");
         register.push(obj.zone == "U" ? "URBANA" : "RURAL");
         register.push(<ButtonsAction id={obj.id} name={obj.school} />);
         data.push(register);
      });
      return data;
   };
   //#endregion PARA LA TABLA

   const handleClickAdd = () => {
      try {
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle("REGISTRAR ESCUELA");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      try {
         setLoading(true);
         getSchools();
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
            {/* <TableComponent
               title={"LISTA DE ESCUELAS"}
               objName={"Escuela"}
               columns={columns}
               showContext={showSchool}
               deleteContext={deleteSchool}
               convertDataContextToArray={convertDataContextToArray}
            /> */}
            {/* <SchoolTable /> */}
         </MainCard>

         <SchoolForm dataCities={result.cities} dataColonies={result.colonies} dataLevels={result.levels} />
      </>
   );
};

export const loaderIndexSchoolsView = async () => {
   try {
      const res = CorrectRes;
      // const axiosData = await Axios.get("/schools");
      // res.result.schools = axiosData.data.data.result;

      const axiosLevels = await Axios.get("/levels/selectIndex");
      res.result.levels = axiosLevels.data.data.result;
      const axiosCities = await Axios.get("/cities/selectIndex");
      res.result.cities = axiosCities.data.data.result;
      const axiosColonies = await Axios.get("/colonies/selectIndex");
      res.result.colonies = axiosColonies.data.data.result;
      // console.log(res);

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

export default SchoolView;
