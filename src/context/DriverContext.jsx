import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const DriverContext = createContext();

const formDataInitialState = {
   id: 0,
   user_id: 0,
   username: "",
   email: "",
   password: "",
   // director_id: 0,
   // director: "Selecciona una opción...",
   role_id: 0,
   avatar: "",
   cellphone: "",
   license_number: "",
   license_type: "",
   license_due_date: "",
   img_lincense: "",
   employee_code: "",
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
   state: 0,
   city: 0,
   colony: 0,
   employee_code_exist: false
};
const driverInitialState = {
   id: 0,
   user_id: 0,
   username: "",
   email: "",
   password: "",
   // director_id: 0,
   // director: "Selecciona una opción...",
   role_id: 0,
   role: "Selecciona una opción...",
   avatar: "",
   cellphone: "",
   license_number: "",
   license_type: "",
   license_due_date: "",
   img_lincense: "",
   employee_code: "",
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
   employee_code_exist: false
};

export default function DriverContextProvider({ children }) {
   const { auth } = useAuthContext();

   const singularName = "Conductor"; //Escribirlo siempre letra Capital
   const pluralName = "Conductores"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [driver, setDriver] = useState(driverInitialState);
   const [drivers, setDrivers] = useState([]);
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
   const resetDriver = () => {
      try {
         setDriver(driverInitialState);
      } catch (error) {
         console.log("Error en resetDriver:", error);
         Toast.Error(error);
      }
   };

   const getDrivers = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/drivers`);
         // console.log("getDrivers", axiosData);
         res.result.drivers = axiosData.data.data.result;
         setDrivers(axiosData.data.data.result);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showDriver = async (id) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.get(`/drivers/${id}`);
         // console.log(axiosData);
         res = axiosData.data.data;
         res.result.zip = "";
         res.result.state = "Selecciona una opción...";
         res.result.city = "Selecciona una opción...";
         res.result.colony = "Selecciona una opción...";
         res.result.employee_code_exist = true;
         if (res.result.employee_code.length < 3) res.result.employee_code_exist = false;

         setDriver(res.result);
         setFormData(res.result);
         // console.log("showDriver", res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createDriver = async (driver) => {
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post(`/users/create/5`, driver);
         const axiosData = await Axios.post(`/users/create/role_id/6`, driver, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
         // console.log(axiosData);
         res = axiosData.data.data;
         getDrivers();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateDriver = async (driver) => {
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post(`/users/update/${driver.user_id}`, driver);
         const axiosData = await Axios.post(`/users/update/role_id/6`, driver, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
         res = axiosData.data.data;
         getDrivers();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteDriver = async (user_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/users/destroy/${user_id}`);
         // console.log("deleteDriver() axiosData", axiosData.data);
         getDrivers();
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
   //    console.log("el useEffect de DriverContext");
   //    getDrivers();
   // });

   return (
      <DriverContext.Provider
         value={{
            singularName,
            pluralName,
            drivers,
            driver,
            setDriver,
            resetDriver,
            formData,
            setFormData,
            resetFormData,
            getDrivers,
            showDriver,
            createDriver,
            updateDriver,
            deleteDriver,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            formikRef
         }}
      >
         {children}
      </DriverContext.Provider>
   );
}
export const useDriverContext = () => useContext(DriverContext);
