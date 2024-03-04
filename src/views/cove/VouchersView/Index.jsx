import VoucherForm from "./Form";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect, useState } from "react";
import { useVoucherContext } from "../../../context/VoucherContext";
import { Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import VoucherDT from "./DataTable";

const VouchersView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, voucher, getVouchers } = useVoucherContext();
   const [openForm, setOpenForm] = useState(false);

   useEffect(() => {
      try {
         setLoading(true);
         getVouchers();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [voucher]);

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
         {/* <DataTableComponent /> */}
         <VoucherDT />
         {/* </MainCard> */}

         <VoucherForm open={openForm} setOpen={setOpenForm} />
      </>
   );
};

export const loaderIndexVouchersView = async () => {
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

export default VouchersView;
