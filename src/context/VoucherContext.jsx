import { createContext, useContext, useEffect, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const VoucherContext = createContext();

const voucherInitialState = {
   id: 0,
   user_id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 0,
   role: "Selecciona una opción...",
   avatar: "",
   phone: "",
   license_number: "",
   license_type: "",
   license_due_date: "",
   img_lincense: "",
   payroll_number: "",
   // department_id: "",
   // department: "Selecciona una opción...",
   department: "",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   community_id: 0,
   street: "",
   num_ext: "",
   num_int: "",

   zip: "",
   state: "Selecciona una opción...",
   city: "Selecciona una opción...",
   colony: "Selecciona una opción...",
   payroll_number_exist: false
};

export default function VoucherContextProvider({ children }) {
   const { auth } = useAuthContext();

   const singularName = "Vale"; //Escribirlo siempre letra Capital
   const pluralName = "Vales"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [voucher, setVoucher] = useState(voucherInitialState);
   const [vouchers, setVouchers] = useState([]);
   const [formData, setFormData] = useState(voucherInitialState);

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

   const getVouchers = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/vouchers`);
         res.result.vouchers = axiosData.data.data.result;
         setVouchers(axiosData.data.data.result);
         // console.log("vouchers", vouchers);

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
         res.result.zip = "";
         res.result.state = "Selecciona una opción...";
         res.result.city = "Selecciona una opción...";
         res.result.colony = "Selecciona una opción...";
         res.result.payroll_number_exist = true;
         if (res.result.payroll_number.length < 3) res.result.payroll_number_exist = false;

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
         // const axiosData = await Axios.post(`/users/create/5`, voucher);
         const axiosData = await Axios.post(`/users/create/role_id/5`, voucher, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
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
         // const axiosData = await Axios.post("/vouchers/update", voucher);
         // const axiosData = await Axios.post(`/users/update/${voucher.user_id}`, voucher);
         const axiosData = await Axios.post(`/users/update/role_id/5`, voucher, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
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
         const axiosData = await Axios.post(`/users/destroy/${user_id}`);
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
            deleteVoucher,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </VoucherContext.Provider>
   );
}
export const useVoucherContext = () => useContext(VoucherContext);
