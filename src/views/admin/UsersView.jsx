import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import MainCard from "../../ui-component/cards/MainCard";
import UserTable from "../../components/users/Table";
import UserForm from "../../components/users/Form";

import { CorrectRes, ErrorRes } from "../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../context/AuthContext";

import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
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

const UsersView = () => {
   const { result } = useLoaderData();
   const { setLoading, setOpenDialog } = useGlobalContext();
   const { singularName, user, setUser, users, getUsers, resetFormData, setTextBtnSumbit, setFormTitle } = useUserContext();

   const handleClickAdd = () => {
      try {
         setUser(null);
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
         getUsers();
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
            <UserTable />
         </MainCard>

         <UserForm dataRoles={result.roles} dataDepartments={result.departments} />
      </>
   );
};

export const loaderIndexUsersView = async () => {
   try {
      const res = CorrectRes;
      // const axiosData = await Axios.get("/users");
      // res.result.users = axiosData.data.data.result;

      const axiosRoles = await Axios.get("/roles/selectIndex");
      res.result.roles = axiosRoles.data.data.result;
      res.result.roles.unshift({ id: 0, label: "Seleccione una opción..." });
      const axiosDepartments = await Axios.get("/departments/selectIndex");
      res.result.departments = axiosDepartments.data.data.result;
      // res.result.departments.unshift({ id: 0, label: "Seleccione una opción..." });
      // const axiosColonies = await Axios.get("/colonies/selectIndex");
      // res.result.colonies = axiosColonies.data.data.result;
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

export default UsersView;
