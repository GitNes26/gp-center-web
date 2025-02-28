import UserForm from "./Form";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios, AxiosDepa } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useUserContext } from "../../../context/UserContext";
import { Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { gpcDark, useGlobalContext } from "../../../context/GlobalContext";
import UserDT from "./DataTable";
import { dataDepartamentosSelectIndex } from "../../../context/DepartmentContext";
import { removeDuplicates } from "../../../utils/Formats";

const UsersView = () => {
   const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, user, getUsers } = useUserContext();

   useEffect(() => {
      try {
         setLoading(true);
         getUsers();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [user]);

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
         <UserDT />
         {/* </MainCard> */}

         <UserForm dataRoles={result.roles} dataDepartments={result.departments} dataEmployees={result.employees} />
      </>
   );
};

export const loaderIndexUsersView = async () => {
   try {
      const res = CorrectRes;
      const auth = JSON.parse(localStorage.getItem("auth"));

      const axiosRoles = await Axios.get(`/roles/selectIndex/role_id/${auth.role_id}`);
      res.result.roles = axiosRoles.data.data.result;

      const axiosDepartments = await Axios.get("/depDir/selectIndex");
      res.result.departments = removeDuplicates(axiosDepartments.data.data.result);

      const axiosEmployees = await Axios.get(`/employees/selectIndex`);
      // console.log("🚀 ~ loaderIndexUsersView ~ axiosEmployees:", axiosEmployees);
      res.result.employees = axiosEmployees.data.data.result;

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
