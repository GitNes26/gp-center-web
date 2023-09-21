import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const VehicleStatusContext = createContext();

const formDataInitialState = {
   id: 0,
   vehicle_status: "",
   bd_color: "#d9d9d9",
   letter_black: 0,
   description: ""
};

export default function VehicleStatusContextProvider({ children }) {
   const singularName = "Estatus"; //Escribirlo siempre letra Capital
   const pluralName = "Estatus de Vehiculo"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [vehicleStatuss, setVehicleStatuss] = useState([]);
   const [vehicleStatus, setVehicleStatus] = useState(null);
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
         newData.vehicle_status = values.vehicle_status;
         newData.bg_color = values.bg_color;
         newData.letter_black = values.letter_black;
         newData.description = values.description;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   const getVehicleStatuss = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/vehicleStatus`);
         res.result.vehicleStatuss = axiosData.data.data.result;
         setVehicleStatuss(axiosData.data.data.result);
         // console.log("vehicleStatuss", vehicleStatuss);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showVehicleStatus = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/vehicleStatus/${id}`);
         res = axiosData.data.data;
         // await setVehicleStatus(res.result);
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

   const createVehicleStatus = async (vehicleStatus) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/vehicleStatus", vehicleStatus);
         res = axiosData.data.data;
         getVehicleStatuss();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateVehicleStatus = async (vehicleStatus) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/vehicleStatus", vehicleStatus);
         res = axiosData.data.data;
         getVehicleStatuss();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteVehicleStatus = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/vehicleStatus/${id}`);
         // console.log("deleteVehicleStatus() axiosData", axiosData.data);
         getVehicleStatuss();
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
   //    console.log("el useEffect de VehicleStatusContext");
   //    getVehicleStatuss();
   // });

   return (
      <VehicleStatusContext.Provider
         value={{
            singularName,
            pluralName,
            vehicleStatuss,
            vehicleStatus,
            formData,
            setFormData,
            resetFormData,
            getVehicleStatuss,
            showVehicleStatus,
            createVehicleStatus,
            updateVehicleStatus,
            deleteVehicleStatus,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </VehicleStatusContext.Provider>
   );
}
export const useVehicleStatusContext = () => useContext(VehicleStatusContext);
