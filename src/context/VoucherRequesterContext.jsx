import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const VoucherRequesterContext = createContext();

const formDataInitialState = {
   id: 0,
   gpc_employee_id: 0,
   user_id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 0,
   avatar: "",
   cellphone: "",
   employee_code: "",
   // department_id: "",
   // department: "Selecciona una opción...",
   department: "",
   position_name: "",
   signature_image: "",
   seal_image: "",
   name: "",
   plast_name: "",
   mlast_name: "",
   employee_code_exist: false
};
const voucherRequesterInitialState = {
   id: 0,
   gpc_employee_id: 0,
   user_id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 0,
   role: "Selecciona una opción...",
   avatar: "",
   cellphone: "",
   employee_code: "",
   // department_id: "",
   // department: "Selecciona una opción...",
   department: "",
   position_name: "",
   signature_image: "",
   seal_image: "",
   name: "",
   plast_name: "",
   mlast_name: "",
   employee_code_exist: false
};

export default function VoucherRequesterContextProvider({ children }) {
   const { auth } = useAuthContext();

   const singularName = "Solicitador de Vales"; //Escribirlo siempre letra Capital
   const pluralName = "Solicitadores de Vales"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [voucherRequester, setVoucherRequester] = useState(voucherRequesterInitialState);
   const [voucherRequesters, setVoucherRequesters] = useState([]);
   const [formData, setFormData] = useState(formDataInitialState);
   const formikRef = useRef(null);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
         console.log("🚀 ~ resetFormData ~ formDataInitialState:", formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetVoucherRequester = () => {
      try {
         setVoucherRequester(voucherRequesterInitialState);
      } catch (error) {
         console.log("Error en resetVoucherRequester:", error);
         Toast.Error(error);
      }
   };

   const getVoucherRequesters = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/voucherRequesters`);
         res.result.voucherRequesters = axiosData.data.data.result;
         setVoucherRequesters(axiosData.data.data.result);
         // console.log("voucherRequesters", voucherRequesters);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showVoucherRequester = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/voucherRequesters/${id}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         res.result.zip = "";
         res.result.state = "Selecciona una opción...";
         res.result.city = "Selecciona una opción...";
         res.result.colony = "Selecciona una opción...";
         res.result.employee_code_exist = true;
         if (res.result.employee_code.length < 3) res.result.employee_code_exist = false;

         setVoucherRequester(res.result);
         setFormData(res.result);
         // console.log("showVoucherRequester", res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getVoucherRequestersSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/voucherRequesters/selectIndex`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.voucherRequesters = axiosData.data.data.result;
         res.result.voucherRequesters.unshift({ id: 0, label: "Selecciona una opción..." });
         setVoucherRequesters(axiosData.data.data.result);
         // console.log("voucherRequesters", voucherRequesters);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createVoucherRequester = async (voucherRequester) => {
      console.log("🚀 ~ createVoucherRequester ~ voucherRequester:", voucherRequester);
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post(`/users/create/5`, voucherRequester);
         const axiosData = await Axios.post(`/users/create/`, voucherRequester, {
            headers: {
               Accept: "application/json",
               "Content-Type": "multipart/form-data"
            }
         });
         // console.log(axiosData);
         res = axiosData.data.data;
         getVoucherRequesters();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateVoucherRequester = async (voucherRequester) => {
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post("/voucherRequesters/update", voucherRequester);
         // const axiosData = await Axios.post(`/users/update/${voucherRequester.user_id}`, voucherRequester);
         const axiosData = await Axios.post(`/users/update`, voucherRequester, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
         res = axiosData.data.data;
         getVoucherRequesters();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteVoucherRequester = async (user_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/users/destroy/${user_id}`);
         // console.log("deleteVoucherRequester() axiosData", axiosData.data);
         getVoucherRequesters();
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
   //    console.log("el useEffect de VoucherRequesterContext");
   //    getVoucherRequesters();
   // });

   return (
      <VoucherRequesterContext.Provider
         value={{
            singularName,
            pluralName,
            voucherRequesters,
            setVoucherRequesters,
            voucherRequester,
            setVoucherRequester,
            resetVoucherRequester,
            formData,
            setFormData,
            resetFormData,
            getVoucherRequesters,
            showVoucherRequester,
            getVoucherRequestersSelectIndex,
            createVoucherRequester,
            updateVoucherRequester,
            deleteVoucherRequester,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            formikRef
         }}
      >
         {children}
      </VoucherRequesterContext.Provider>
   );
}
export const useVoucherRequesterContext = () => useContext(VoucherRequesterContext);
