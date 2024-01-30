import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const ModelContext = createContext();

const formDataInitialState = {
   id: 0,
   brand_id: 0,
   brand: "Selecciona una opción...",
   model: "",
   description: ""
};

export default function ModelContextProvider({ children }) {
   const singularName = "Modelo"; //Escribirlo siempre letra Capital
   const pluralName = "Modelos"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [models, setModels] = useState([]);
   const [model, setModel] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };
   const resetModel = () => {
      try {
         setModel(formDataInitialState);
      } catch (error) {
         console.log("Error en fillModel:", error);
         Toast.Error(error);
      }
   };

   const getModels = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/models`);
         res.result.models = axiosData.data.data.result;
         setModels(axiosData.data.data.result);
         // console.log("models", models);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getModelsSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/models/selectIndex`);
         // console.log("el selectedDeModels", axiosData);
         res.result.models = axiosData.data.data.result;
         res.result.models.unshift({ id: 0, label: "Selecciona una opción..." });
         setModels(axiosData.data.data.result);
         // console.log("models", models);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showModel = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/models/${id}`);
         res = axiosData.data.data;
         await setModel(res.result);
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

   const createModel = async (model) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/models", model);
         res = axiosData.data.data;
         getModels();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateModel = async (model) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/models/update", model);
         res = axiosData.data.data;
         getModels();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteModel = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/models/destroy/${id}`);
         // console.log("deleteModel() axiosData", axiosData.data);
         getModels();
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
   //    console.log("el useEffect de ModelContext");
   //    getModels();
   // });

   return (
      <ModelContext.Provider
         value={{
            singularName,
            pluralName,
            models,
            model,
            formData,
            setFormData,
            resetFormData,
            resetModel,
            getModels,
            getModelsSelectIndex,
            showModel,
            createModel,
            updateModel,
            deleteModel,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </ModelContext.Provider>
   );
}
export const useModelContext = () => useContext(ModelContext);
