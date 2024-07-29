import VoucherRequesterForm from "./Form";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useVoucherRequesterContext } from "../../../context/VoucherRequesterContext";
import { Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { gpcDark, useGlobalContext } from "../../../context/GlobalContext";
import VoucherRequesterDT from "./DataTable";
import { useDepartmentContext } from "../../../context/DepartmentContext";

const VoucherRequestersView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, voucherRequester, getVoucherRequesters } = useVoucherRequesterContext();
   // const { getDepartmentsSelectIndex } = useDepartmentContext();

   useEffect(() => {
      try {
         setLoading(true);
         getVoucherRequesters();
         // getDepartmentsSelectIndex();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [voucherRequester]);

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
         <VoucherRequesterDT />
         {/* </MainCard> */}

         <VoucherRequesterForm />
      </>
   );
};

export const loaderIndexVoucherRequestersView = async () => {
   try {
      const res = CorrectRes;
      // const auth = JSON.parse(localStorage.getItem("auth"));

      // const axiosRoles = await Axios.get(`/roles/selectIndex/role_id/${auth.role_id}`);
      // res.result.roles = axiosRoles.data.data.result;
      // res.result.roles.unshift({ id: 0, label: "Selecciona una opción..." });
      // const axiosDepartments = await Axios.get("/departments/selectIndex");
      // res.result.departments = axiosDepartments.data.data.result;
      // res.result.departments.unshift({ id: 0, label: "Selecciona una opción..." });
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

export default VoucherRequestersView;
