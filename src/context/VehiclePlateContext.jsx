import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const VehiclePlateContext = createContext();

const formDataInitialState = {
   id: 0,
   vehicle_id: "",
   plates: 0,
   initial_date: 0,
   due_date: "",
   expired: ""
};

export default function VehiclePlateContextProvider({ children }) {
   const singularName = "Placa del Vehiculo"; //Escribirlo siempre letra Capital
   const pluralName = "Placas del vehiculo"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [vehiclePlates, setVehiclePlates] = useState([]);
   const [vehiclePlate, setVehiclePlate] = useState(null);
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
         newData.vehicle_id = values.vehicle_id;
         newData.plates = values.platesd;
         newData.initial_date = values.initial_date;
         newData.due_date = values.due_date;
         newData.expired = values.expired;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   //#region ======================== CRUD =====================
   const getVehiclePlates = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/vehiclesPlates`);
         res.result.vehiclePlates = axiosData.data.data.result;
         setVehiclePlates(axiosData.data.data.result);
         // console.log("vehiclePlates", vehiclePlates);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showVehiclePlate = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/vehiclesPlates/${id}`);
         res = axiosData.data.data;
         // await setVehiclePlate(res.result);
         setFormData(res.result);
         setVehiclePlate(res.result);
         // fillFormData(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createVehiclePlate = async (vehiclePlate) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/vehiclesPlates", vehiclePlate);
         res = axiosData.data.data;
         getVehiclePlates();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateVehiclePlate = async (vehiclePlate) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put(`/vehiclesPlates/${vehiclePlate.id}`, vehiclePlate);
         res = axiosData.data.data;
         getVehiclePlates();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteVehiclePlate = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/vehiclesPlates/${id}`);
         // console.log("deleteVehiclePlate() axiosData", axiosData.data);
         getVehiclePlates();
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
   //#endregion ======================== CRUD =====================

   const historyByVehicleId = async (vehicle_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/vehiclesPlates/history/${vehicle_id}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         setVehiclePlates(res.result);
         // fillFormData(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   // useEffect(() => {
   //    console.log("el useEffect de VehiclePlateContext");
   //    getVehiclePlates();
   // });

   return (
      <VehiclePlateContext.Provider
         value={{
            singularName,
            pluralName,
            vehiclePlates,
            setVehiclePlates,
            vehiclePlate,
            formData,
            setFormData,
            resetFormData,
            getVehiclePlates,
            showVehiclePlate,
            createVehiclePlate,
            updateVehiclePlate,
            deleteVehiclePlate,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            historyByVehicleId
         }}
      >
         {children}
      </VehiclePlateContext.Provider>
   );
}
export const useVehiclePlateContext = () => useContext(VehiclePlateContext);
