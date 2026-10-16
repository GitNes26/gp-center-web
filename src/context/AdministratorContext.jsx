import { createContext, useContext, useRef, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";
import PropTypes from "prop-types";

const AdministratorContext = createContext();

const formDataInitialState = {
   id: 0,
   gpc_employee_id: 0,
   user_id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 2,
   avatar: "",
   cellphone: "",
   employee_code: "",
   department: "",
   position_name: "",
   name: "",
   plast_name: "",
   mlast_name: "",
   employee_code_exist: false
};
const administratorInitialState = {
   id: 0,
   gpc_employee_id: 0,
   user_id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 2,
   role: "Administrador",
   avatar: "",
   cellphone: "",
   employee_code: "",
   department: "",
   position_name: "",
   name: "",
   plast_name: "",
   mlast_name: "",
   employee_code_exist: false
};

export default function AdministratorContextProvider({ children }) {
   const singularName = "Administrador"; //Escribirlo siempre letra Capital
   const pluralName = "Administradores"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [administrator, setAdministrator] = useState(administratorInitialState);
   const [administrators, setAdministrators] = useState([]);
   const [formData, setFormData] = useState(formDataInitialState);
   const formikRef = useRef(null);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetAdministrator = () => {
      try {
         setAdministrator(administratorInitialState);
      } catch (error) {
         console.log("Error en resetAdministrator:", error);
         Toast.Error(error);
      }
   };

   const getAdministrators = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/users/by/role_id/2`);
         res.result.administrators = axiosData.data.data.result;
         setAdministrators(axiosData.data.data.result);
         // console.log("administrators", administrators);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showAdministrator = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/users/${id}`);
         res = axiosData.data.data;
         res.result.employee_code_exist = true;
         setAdministrator(res.result);
         setFormData(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createAdministrator = async (administrator) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(`/users/create`, administrator, { headers: { "Content-Type": "multipart/form-data" } });
         // console.log(axiosData);
         res = axiosData.data.data;
         getAdministrators();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateAdministrator = async (administrator) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/users/update", administrator, { headers: { "Content-Type": "multipart/form-data" } });
         res = axiosData.data.data;
         getAdministrators();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteAdministrator = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/users/destroy/${id}`);
         // console.log("deleteAdministrator() axiosData", axiosData.data);
         getAdministrators();
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
   //    console.log("el useEffect de AdministratorContext");
   //    getAdministrators();
   // });

   return (
      <AdministratorContext.Provider
         value={{
            singularName,
            pluralName,
            administrator,
            administrators,
            setAdministrator,
            resetAdministrator,
            formData,
            setFormData,
            resetFormData,
            getAdministrators,
            showAdministrator,
            createAdministrator,
            updateAdministrator,
            deleteAdministrator,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            formikRef
         }}
      >
         {children}
      </AdministratorContext.Provider>
   );
}
AdministratorContextProvider.propTypes = { children: PropTypes.node.isRequired };
export const useAdministratorContext = () => useContext(AdministratorContext);
