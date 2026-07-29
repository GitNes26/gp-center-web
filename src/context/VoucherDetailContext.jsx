import { createContext, useContext, useEffect, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const VoucherDetailContext = createContext();

const voucherInitialState = {
   id: 0,
   vehicle: "",
   vehicle_plates: "",
   // requested_amount: 0,
   employee_code: "",
   department: "",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   cellphone: "",
   employee_code_exist: false,

   creditor_fullname: ""
};

export default function VoucherDetailContextProvider({ children }) {
   const { auth } = useAuthContext();

   const singularName = "Detalle Vale"; //Escribirlo siempre letra Capital
   const pluralName = "Detalles Vale"; //Escribirlo siempre letra Capital
   const [voucherId, setVoucherId] = useState(0);

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [voucherDetail, setVoucherDetail] = useState(voucherInitialState);
   const [voucherDetails, setVoucherDetails] = useState([]);
   const [formData, setFormData] = useState(voucherInitialState);

   const [inAprobation, setInAprobation] = useState(false);
   const [inEdit, setInEdit] = useState(false);

   const resetFormData = () => {
      try {
         setFormData(voucherInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetVoucherDetail = () => {
      try {
         setVoucherDetail(voucherInitialState);
      } catch (error) {
         console.log("Error en resetVoucherDetail:", error);
         Toast.Error(error);
      }
   };
   const resetVoucherDetails = () => {
      try {
         setVoucherDetails([]);
      } catch (error) {
         console.log("Error en resetVoucherDetails:", error);
         Toast.Error(error);
      }
   };

   const getVouchersDetails = async () => {
      try {
         setVoucherDetails([]);
         const res = CorrectRes;
         const axiosData = await Axios.get(`/voucherDetails`);
         // console.log("getVouchersDetails() -> axiosData", axiosData.data.data.result);
         res.result.voucherDetails = axiosData.data.data.result;
         setVoucherDetails(axiosData.data.data.result);
         // console.log("voucherDetails", voucherDetails);

         // console.log("🚀 ~ getVouchersDetails ~ res:", res)
         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getIndexByVoucher = async (voucher_id) => {
      try {
         setVoucherDetails([]);
         const res = CorrectRes;
         const axiosData = await Axios.get(`/voucherDetails/voucher_id/${voucher_id}`);
         // console.log("getIndexByVoucher() -> axiosData", axiosData.data.data.result);
         res.result.voucherDetails = axiosData.data.data.result;
         setVoucherDetails(axiosData.data.data.result);
         // console.log("voucherDetails", voucherDetails);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showVoucherDetail = async (voucher_id) => {
      try {
         setVoucherDetails([]);
         const res = CorrectRes;
         // console.log("getFamilies() ejecutado... voucher_id", voucher_id);
         const axiosData = await Axios.get(`/voucherDetails/id/${voucher_id}`);
         // console.log("getIndexByFolio() -> axiosData", axiosData.data.data.result);
         res.result.voucherDetails = axiosData.data.data.result;
         setVoucherDetails(axiosData.data.data.result);
         // console.log("voucherDetails", voucherDetails);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createVoucherDetail = async (voucherDetail) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(`/voucherDetails/create`, voucherDetail);
         // console.log(axiosData);
         res = axiosData.data.data;
         getIndexByVoucher(voucherDetail.voucher_id);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateVoucherDetail = async (voucherDetail) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(`/voucherDetails/update/${voucherDetail.id}`, voucherDetail);

         res = axiosData.data.data;
         getIndexByVoucher(voucherDetail.voucher_id);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteVoucherDetail = async (ids, voucher_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/voucherDetails/destroy`, { ids });
         console.log("deleteVoucherDetail() axiosData", axiosData.data);
         res = axiosData.data.data;
         getIndexByVoucher(voucher_id);
         // console.log("res", res);
         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   // useEffect(() => {
   //    console.log("el useEffect de VoucherDetailContext");
   //    getVouchersDetails();
   // });

   return (
      <VoucherDetailContext.Provider
         value={{
            singularName,
            pluralName,
            voucherDetail,
            setVoucherDetail,
            voucherDetails,
            setVoucherDetails,
            resetVoucherDetail,
            formData,
            setFormData,
            resetFormData,
            resetVoucherDetails,
            getIndexByVoucher,
            showVoucherDetail,
            createVoucherDetail,
            updateVoucherDetail,
            deleteVoucherDetail,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            inAprobation,
            inEdit,
            setInEdit,
            setInAprobation,
            voucherId,
            setVoucherId,
            getVouchersDetails
         }}
      >
         {children}
      </VoucherDetailContext.Provider>
   );
}
export const useVoucherDetailContext = () => useContext(VoucherDetailContext);
