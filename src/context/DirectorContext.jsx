import { createContext, useContext, useEffect, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const DirectorContext = createContext();

const formDataInitialState = {
   id: 0,
   user_id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 0,
   avatar: "",
   phone: "",
   license_number: "",
   license_due_date: "",
   img_lincense: "",
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
const directorInitialState = {
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
   license_due_date: "",
   img_lincense: "",
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
   state: "Selecciona una opción...",
   city: "Selecciona una opción...",
   colony: "Selecciona una opción..."
};

export default function DirectorContextProvider({ children }) {
   const { auth } = useAuthContext();

   const singularName = "Director"; //Escribirlo siempre letra Capital
   const pluralName = "Directores"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [director, setDirector] = useState(directorInitialState);
   const [directors, setDirectors] = useState([]);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetDirector = () => {
      try {
         setDirector(directorInitialState);
      } catch (error) {
         console.log("Error en resetDirector:", error);
         Toast.Error(error);
      }
   };

   const getDirectors = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/directors`);
         res.result.directors = axiosData.data.data.result;
         setDirectors(axiosData.data.data.result);
         // console.log("directors", directors);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showDirector = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/directors/${id}`);
         console.log("axiosData", axiosData);
         res = axiosData.data.data;
         res.result.zip = "";
         res.result.state = "Selecciona una opción...";
         res.result.city = "Selecciona una opción...";
         res.result.colony = "Selecciona una opción...";
         setDirector(res.result);
         setFormData(res.result);
         // console.log("showDirector", res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getDirectorsSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/directors/selectIndex`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.directors = axiosData.data.data.result;
         res.result.directors.unshift({ id: 0, label: "Selecciona una opción..." });
         setDirectors(axiosData.data.data.result);
         // console.log("directors", directors);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createDirector = async (director) => {
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post(`/users/create/5`, director);
         const axiosData = await Axios.post(`/users/create/role_id/5`, director, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
         // console.log(axiosData);
         res = axiosData.data.data;
         getDirectors();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateDirector = async (director) => {
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post("/directors/update", director);
         // const axiosData = await Axios.post(`/users/update/${director.user_id}`, director);
         const axiosData = await Axios.post(`/users/update/role_id/5`, director, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
         res = axiosData.data.data;
         getDirectors();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteDirector = async (user_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/users/destroy/${user_id}`);
         // console.log("deleteDirector() axiosData", axiosData.data);
         getDirectors();
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
   //    console.log("el useEffect de DirectorContext");
   //    getDirectors();
   // });

   return (
      <DirectorContext.Provider
         value={{
            singularName,
            pluralName,
            directors,
            setDirectors,
            director,
            setDirector,
            resetDirector,
            formData,
            setFormData,
            resetFormData,
            getDirectors,
            showDirector,
            getDirectorsSelectIndex,
            createDirector,
            updateDirector,
            deleteDirector,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </DirectorContext.Provider>
   );
}
export const useDirectorContext = () => useContext(DirectorContext);
