import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const VehicleMovementLogContext = createContext();

const formDataInitialState = {
   id: 0,
   user_id: 0, // Quien realiza el movimiento
   vehicle_status_id: 0,
   vehicle_id: 0,
   active_user_id: 0, // Quien trae el vehículo
   km: 0,
   comments: "",
   valid: null,
   table_assoc: null,
   table_assoc_register_id: null,
   active: 1,
   created_at: ""
};

export default function VehicleMovementLogContextProvider({ children }) {
   const singularName = "Movimineto de Vehículo"; //Escribirlo siempre letra Capital
   const pluralName = "Movimientos de Vehículo"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [vehicleMovementsLog, setVehicleMovementsLog] = useState([]);
   const [vehicleMovementLog, setVehicleMovementLog] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetVehicleMovementLog = () => {
      try {
         setVehicleMovementLog(formDataInitialState);
      } catch (error) {
         console.log("Error en resetVehicleMovementLog:", error);
         Toast.Error(error);
      }
   };

   const getVehicleMovementsLog = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/vehicleMovementsLog`);
         res.result.vehicleMovementsLog = axiosData.data.data.result;
         setVehicleMovementsLog(axiosData.data.data.result);
         // console.log("vehicleMovementsLog", vehicleMovementsLog);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getVehicleMovementsLogSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/vehicleMovementsLog/selectIndex`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.vehicleMovementsLog = axiosData.data.data.result;
         res.result.vehicleMovementsLog.unshift({ id: 0, label: "Selecciona una opción..." });
         setVehicleMovementsLog(axiosData.data.data.result);
         // console.log("vehicleMovementsLog", vehicleMovementsLog);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showVehicleMovementLog = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/vehicleMovementsLog/${id}`);
         res = axiosData.data.data;
         // console.log(res);
         setVehicleMovementLog(res.result);
         setFormData(res.result);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createVehicleMovementLog = async (vehicleMovementLog) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/vehicleMovementsLog/create", vehicleMovementLog);
         res = axiosData.data.data;
         getVehicleMovementsLog();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateVehicleMovementLog = async (vehicleMovementLog) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/vehicleMovementsLog/update", vehicleMovementLog);
         res = axiosData.data.data;
         getVehicleMovementsLog();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteVehicleMovementLog = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/vehicleMovementsLog/destroy/${id}`);
         // console.log("deleteVehicleMovementLog() axiosData", axiosData.data);
         getVehicleMovementsLog();
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
   //    console.log("el useEffect de VehicleMovementLogContext");
   //    getVehicleMovementsLog();
   // });

   return (
      <VehicleMovementLogContext.Provider
         value={{
            singularName,
            pluralName,
            vehicleMovementsLog,
            vehicleMovementLog,
            formData,
            setFormData,
            resetFormData,
            resetVehicleMovementLog,
            getVehicleMovementsLog,
            getVehicleMovementsLogSelectIndex,
            showVehicleMovementLog,
            createVehicleMovementLog,
            updateVehicleMovementLog,
            deleteVehicleMovementLog,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </VehicleMovementLogContext.Provider>
   );
}
export const useVehicleMovementLogContext = () => useContext(VehicleMovementLogContext);
