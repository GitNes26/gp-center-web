import { createContext, useContext, useEffect, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const AdministratorContext = createContext();

const formDataInitialState = {
   id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 0,
   phone: "",
   license_number: "",
   license_due_date: "",
   payroll_number: "",
   department_id: "",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   community_id: 0,
   street: "",
   num_ext: "",
   num_int: "",

   zip: "",
   state: 0,
   city: 0,
   colony: 0
};
const administratorInitialState = {
   id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 0,
   role: "Selecciona una opción...",
   phone: "",
   license_number: "",
   license_due_date: "",
   payroll_number: "",
   department_id: "",
   department: "Selecciona una opción...",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   community_id: 0,
   street: "",
   num_ext: "",
   num_int: "",

   zip: "",
   state: 0,
   city: 0,
   colony: 0
};

export default function AdministratorContextProvider({ children }) {
   const { auth } = useAuthContext();

   const singularName = "Administrador"; //Escribirlo siempre letra Capital
   const pluralName = "Administradores"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [administrator, setAdministrator] = useState(administratorInitialState);
   const [administrators, setAdministrators] = useState([]);
   const [formData, setFormData] = useState(formDataInitialState);

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
         setAdministrator(res.result);
         setFormData(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createAdministrator = async (administrator) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(`/users/create/2`, administrator);
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
         const axiosData = await Axios.post("/users/update", administrator);
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
            setFormTitle
         }}
      >
         {children}
      </AdministratorContext.Provider>
   );
}
export const useAdministratorContext = () => useContext(AdministratorContext);
