import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const VehicleContext = createContext();

const formDataInitialState = {
   id: 0,
   stock_number: "",
   brand_id: 0,
   model_id: 0,
   year: "",
   registration_date: "",
   description: "",
   vehicle_status_id: 0,
   img_path: ""
};

export default function VehicleContextProvider({ children }) {
   const singularName = "Vehiculo"; //Escribirlo siempre letra Capital
   const pluralName = "Vehiculos"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [vehicles, setVehicles] = useState([]);
   const [vehicle, setVehicle] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   const fillFormData = (values) => {
      try {
         const newData = { ...formData };
         newData.id = values.id;
         newData.stock_number = values.stock_number;
         newData.brand_id = values.brand_id;
         newData.model_id = values.model_id;
         newData.year = values.year;
         newData.registration_date = values.registration_date;
         newData.description = values.description;
         newData.vehicle_status_id = values.vehicle_status_id;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   const getVehicles = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/vehicles`);
         res.result.vehicles = axiosData.data.data.result;
         setVehicles(axiosData.data.data.result);
         // console.log("vehicles", vehicles);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showVehicle = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/vehicles/${id}`);
         res = axiosData.data.data;
         // await setVehicle(res.result);
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

   const createVehicle = async (vehicle) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/vehicles", vehicle);
         res = axiosData.data.data;
         getVehicles();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateVehicle = async (vehicle) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/vehicles", vehicle);
         res = axiosData.data.data;
         getVehicles();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteVehicle = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/vehicles/${id}`);
         // console.log("deleteVehicle() axiosData", axiosData.data);
         getVehicles();
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
   //    console.log("el useEffect de VehicleContext");
   //    getVehicles();
   // });

   return (
      <VehicleContext.Provider
         value={{
            singularName,
            pluralName,
            vehicles,
            vehicle,
            formData,
            setFormData,
            resetFormData,
            getVehicles,
            showVehicle,
            createVehicle,
            updateVehicle,
            deleteVehicle,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </VehicleContext.Provider>
   );
}
export const useVehicleContext = () => useContext(VehicleContext);
