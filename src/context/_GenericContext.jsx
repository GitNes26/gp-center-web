import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const GenericContext = createContext();

const formDataInitialState = {
   id: 0,
   generic: "",
   description: ""
};

export default function GenericContextProvider({ children }) {
   const singularName = "Marca"; //Escribirlo siempre letra Capital
   const pluralName = "Marcas"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [generics, setGenerics] = useState([]);
   const [generic, setGeneric] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };

   const fillFormData = (values) => {
      try {
         const newData = { ...formData };
         newData.id = values.id;
         newData.generic = values.generic;
         newData.description = values.description;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   const getGenerics = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/generics`);
         res.result.generics = axiosData.data.data.result;
         setGenerics(axiosData.data.data.result);
         // console.log("generics", generics);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showGeneric = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/generics/${id}`);
         res = axiosData.data.data;
         // await setGeneric(res.result);
         // setFormData(res.result);
         fillFormData(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createGeneric = async (generic) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/generics", generic);
         res = axiosData.data.data;
         getGenerics();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateGeneric = async (generic) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/generics", generic);
         res = axiosData.data.data;
         getGenerics();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteGeneric = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/generics/delete${id}`);
         // console.log("deleteGeneric() axiosData", axiosData.data);
         getGenerics();
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
   //    console.log("el useEffect de GenericContext");
   //    getGenerics();
   // });

   return (
      <GenericContext.Provider
         value={{
            singularName,
            pluralName,
            generics,
            generic,
            formData,
            setFormData,
            resetFormData,
            getGenerics,
            showGeneric,
            createGeneric,
            updateGeneric,
            deleteGeneric,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </GenericContext.Provider>
   );
}
export const useGenericContext = () => useContext(GenericContext);
