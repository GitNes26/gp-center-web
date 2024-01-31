import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const DeliveredVehicleContext = createContext();

const formDataInitialState = {
   id: 0,
   accident_folio: 0,
   assigned_vehicle_id: 0,
   reason: "",
   date: "",
   km_deliver: 0
};

export default function DeliveredVehicleContextProvider({ children }) {
   const singularName = "Devolución de Vehículo"; //Escribirlo siempre letra Capital
   const pluralName = "Devoluciones de Vehículo"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [deliveredVehicles, setDeliveredVehicles] = useState([]);
   const [deliveredVehicle, setDeliveredVehicle] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetDeliveredVehicle = () => {
      try {
         setDeliveredVehicle(formDataInitialState);
      } catch (error) {
         console.log("Error en resetDeliveredVehicle:", error);
         Toast.Error(error);
      }
   };

   const getDeliveredVehicles = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/deliveredVehicle`);
         res.result.deliveredVehicles = axiosData.data.data.result;
         setDeliveredVehicles(axiosData.data.data.result);
         // console.log("deliveredVehicles", deliveredVehicles);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getDeliveredVehiclesSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/deliveredVehicle/selectIndex`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.deliveredVehicles = axiosData.data.data.result;
         res.result.deliveredVehicles.unshift({ id: 0, label: "Selecciona una opción..." });
         setDeliveredVehicles(axiosData.data.data.result);
         // console.log("deliveredVehicles", deliveredVehicles);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showDeliveredVehicle = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/deliveredVehicle/${id}`);
         res = axiosData.data.data;
         // console.log(res);
         setDeliveredVehicle(res.result);
         setFormData(res.result);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createDeliveredVehicle = async (deliveredVehicle) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/deliveredVehicle/create", deliveredVehicle);
         res = axiosData.data.data;
         getDeliveredVehicles();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateDeliveredVehicle = async (deliveredVehicle) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/deliveredVehicle/update", deliveredVehicle);
         res = axiosData.data.data;
         getDeliveredVehicles();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteDeliveredVehicle = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/deliveredVehicle/destroy/${id}`);
         // console.log("deleteDeliveredVehicle() axiosData", axiosData.data);
         getDeliveredVehicles();
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
   //    console.log("el useEffect de DeliveredVehicleContext");
   //    getDeliveredVehicles();
   // });

   return (
      <DeliveredVehicleContext.Provider
         value={{
            singularName,
            pluralName,
            deliveredVehicles,
            deliveredVehicle,
            formData,
            setFormData,
            resetFormData,
            resetDeliveredVehicle,
            getDeliveredVehicles,
            getDeliveredVehiclesSelectIndex,
            showDeliveredVehicle,
            createDeliveredVehicle,
            updateDeliveredVehicle,
            deleteDeliveredVehicle,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </DeliveredVehicleContext.Provider>
   );
}
export const useDeliveredVehicleContext = () => useContext(DeliveredVehicleContext);
