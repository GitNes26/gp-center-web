import { createContext, useContext, useEffect, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";
import { useGlobalContext } from "./GlobalContext";

const VoucherContext = createContext();

const voucherInitialState = {
   id: 0,
   requested_by: 0,
   internal_folio: "",
   letter_folio: "",
   foliated_vouchers: "",
   // vehicle: "",
   // vehicle_plates: "",
   // requested_amount: 0,
   workstation: "",
   img_firm: "",

   // payroll_number: "",
   // department: "",
   // name: "",
   // paternal_last_name: "",
   // maternal_last_name: "",
   // phone: "",
   // payroll_number_exist: false,

   activity: "",
   voucher_status: "",

   vobo_by: "",
   vobo_at: "",
   viewed_by: "",
   viewed_at: "",
   approved_by: "",
   approved_amount: 0,
   approved_at: "",
   canceled_by: "",
   canceled_comments: "",
   canceled_at: "",

   creditor_fullname: ""
};

export default function VoucherContextProvider({ children }) {
   const { auth, counterOfMenus } = useAuthContext();

   const singularName = "Vale"; //Escribirlo siempre letra Capital
   const pluralName = "Vales"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("CREAR VALE");

   const [voucher, setVoucher] = useState(voucherInitialState);
   const [vouchers, setVouchers] = useState([]);
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
   const resetVoucher = () => {
      try {
         setVoucher(voucherInitialState);
      } catch (error) {
         console.log("Error en resetVoucher:", error);
         Toast.Error(error);
      }
   };

   const seenVoucher = async (voucher) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(`/vouchers/seenVoucher/${voucher.id}`, voucher);
         // console.log(axiosData);
         res = axiosData.data.data;
         getVouchers();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const getVouchers = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/vouchers`);
         res.result.vouchers = axiosData.data.data.result;
         setVouchers(axiosData.data.data.result);
         // setCounters({ ...counters, vouchers: axiosData.data.data.result.length });
         // console.log("vouchers", vouchers);
         counterOfMenus();
         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showVoucher = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/vouchers/${id}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         // res.result.payroll_number_exist = true;
         // if (res.result.payroll_number.length < 3) res.result.payroll_number_exist = false;

         setVoucher(res.result);
         setFormData(res.result);
         // console.log("showVoucher", res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getVouchersSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/vouchers/selectIndex`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.vouchers = axiosData.data.data.result;
         res.result.vouchers.unshift({ id: 0, label: "Selecciona una opción..." });
         setVouchers(axiosData.data.data.result);
         // console.log("vouchers", vouchers);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createVoucher = async (voucher) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(`/vouchers/create`, voucher);
         // console.log(axiosData);
         res = axiosData.data.data;
         getVouchers();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateVoucher = async (voucher) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(`/vouchers/update/${voucher.id}`, voucher);

         res = axiosData.data.data;
         getVouchers();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateStatus = async (voucher) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(`/vouchers/updateStatus/id/${voucher.id}/voucher_status/${voucher.voucher_status}`, voucher);

         res = axiosData.data.data;
         getVouchers();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteVoucher = async (user_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/vouchers/destroy/${user_id}`);
         // console.log("deleteVoucher() axiosData", axiosData.data);
         getVouchers();
         res = axiosData.data.data;
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
   //    console.log("el useEffect de VoucherContext");
   //    getVouchers();
   // });

   return (
      <VoucherContext.Provider
         value={{
            singularName,
            pluralName,
            vouchers,
            setVouchers,
            voucher,
            setVoucher,
            resetVoucher,
            formData,
            setFormData,
            resetFormData,
            getVouchers,
            showVoucher,
            getVouchersSelectIndex,
            createVoucher,
            updateVoucher,
            updateStatus,
            deleteVoucher,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            inAprobation,
            inEdit,
            setInEdit,
            setInAprobation,
            seenVoucher
         }}
      >
         {children}
      </VoucherContext.Provider>
   );
}
export const useVoucherContext = () => useContext(VoucherContext);
