import VoucherForm from "./Form";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { useParams } from "react-router";

import { Axios } from "../../../context/AuthContext";

import { useEffect, useLayoutEffect, useState } from "react";
import { useVoucherContext } from "../../../context/VoucherContext";
import { Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { gpcDark, useGlobalContext } from "../../../context/GlobalContext";
import VoucherDT from "./DataTable";
import ModalCancelComments from "./ModalCancelComments";
import ModalContentPDF from "./ModalContentPDF";
import ModalContentRecivedPDF from "./ModalContentRecivedPDF";
import { useVoucherRequesterContext } from "../../../context/VoucherRequesterContext";

const VouchersView = () => {
   const { status } = useParams();
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, voucher, getVouchers } = useVoucherContext();
   const [openForm, setOpenForm] = useState(false);
   const [openModalShowRequest, setOpenModalShowRequest] = useState(false);
   const [openModalShowRecived, setOpenModalShowRecived] = useState(false);
   const [openModalCancel, setOpenModalCancel] = useState(false);
   const [arrayData, setArrayData] = useState([]);
   const { getVoucherRequestersSelectIndex } = useVoucherRequesterContext();
   const [counterModalWarning, setCounterModalWarning] = useState(0);

   useEffect(() => {
      try {
         setLoading(true);
         getVouchers(status);
         getVoucherRequestersSelectIndex();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [voucher, status]);

   useLayoutEffect(() => {
      console.log("🚀 ~ useLayoutEffect ~ useLayoutEffect:", counterModalWarning);
      setCounterModalWarning(Number(counterModalWarning) + 1);
   }, []);

   return (
      <>
         {/* <Alert severity="warning" sx={{mb:1}}>
            <AlertTitle>Info</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         <Typography variant="h1" color={gpcDark} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         <VoucherDT
            setOpen={setOpenForm}
            setOpenModalRequest={setOpenModalShowRequest}
            setOpenModalShowRecived={setOpenModalShowRecived}
            setOpenModalCancel={setOpenModalCancel}
            setArrayData={setArrayData}
            currentStatus={status}
         />

         <VoucherForm open={openForm} setOpen={setOpenForm} setOpenModalCancel={setOpenModalCancel} currentStatus={status} />

         {/* <ModalShowRequest open={openModalShowRequest} setOpen={setOpenModalShowRequest} /> */}
         {openModalShowRequest && <ModalContentPDF open={openModalShowRequest} setOpen={setOpenModalShowRequest} arrayData={arrayData} setArrayData={setArrayData} />}
         {openModalShowRecived && <ModalContentRecivedPDF open={openModalShowRecived} setOpen={setOpenModalShowRecived} />}
         <ModalCancelComments open={openModalCancel} setOpen={setOpenModalCancel} currentStatus={status} />
         {counterModalWarning === 1 &&
            sAlert.Info(`⚠️AVISO IMPORTANTE⚠️ <br><br>
         <Typography variant="h3">DE ACUERDO AL CONTENIDO DEL OFICIO No. OM/CV-6499/2024 POR PERIODO VACACIONAL NO HAY ENTREGA DE VALES</Typography>
            `)}
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
