import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const AssignedVehicleContext = createContext();

const formDataInitialState = {
   id: 0,
   user_id: 0,
   vehicle_id: 0,
   date: ""
};

export default function AssignedVehicleContextProvider({ children }) {
   const singularName = "Asignación de Vehiculo"; //Escribirlo siempre letra Capital
   const pluralName = "Asignaciones de Vehiculo"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [assignedVehicles, setAssignedVehicles] = useState([]);
   const [assignedVehicle, setAssignedVehicle] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetAssignedVehicle = () => {
      try {
         setAssignedVehicle(formDataInitialState);
      } catch (error) {
         console.log("Error en resetAssignedVehicle:", error);
         Toast.Error(error);
      }
   };

   const getAssignedVehicles = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/assignedVehicle`);
         res.result.assignedVehicles = axiosData.data.data.result;
         setAssignedVehicles(axiosData.data.data.result);
         // console.log("assignedVehicles", assignedVehicles);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getAssignedVehiclesSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/assignedVehicle/selectIndex`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.assignedVehicles = axiosData.data.data.result;
         res.result.assignedVehicles.unshift({ id: 0, label: "Selecciona una opción..." });
         setAssignedVehicles(axiosData.data.data.result);
         // console.log("assignedVehicles", assignedVehicles);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showAssignedVehicle = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/assignedVehicle/${id}`);
         res = axiosData.data.data;
         // console.log(res);
         setAssignedVehicle(res.result);
         setFormData(res.result);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createAssignedVehicle = async (assignedVehicle) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/assignedVehicle/create", assignedVehicle);
         res = axiosData.data.data;
         getAssignedVehicles();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateAssignedVehicle = async (assignedVehicle) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/assignedVehicle/update", assignedVehicle);
         res = axiosData.data.data;
         getAssignedVehicles();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteAssignedVehicle = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/assignedVehicle/destroy/${id}`);
         // console.log("deleteAssignedVehicle() axiosData", axiosData.data);
         getAssignedVehicles();
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
   //    console.log("el useEffect de AssignedVehicleContext");
   //    getAssignedVehicles();
   // });

   return (
      <AssignedVehicleContext.Provider
         value={{
            singularName,
            pluralName,
            assignedVehicles,
            assignedVehicle,
            formData,
            setFormData,
            resetFormData,
            resetAssignedVehicle,
            getAssignedVehicles,
            getAssignedVehiclesSelectIndex,
            showAssignedVehicle,
            createAssignedVehicle,
            updateAssignedVehicle,
            deleteAssignedVehicle,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </AssignedVehicleContext.Provider>
   );
}
export const useAssignedVehicleContext = () => useContext(AssignedVehicleContext);
