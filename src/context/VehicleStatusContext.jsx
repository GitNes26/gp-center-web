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
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetVehicleStatus = () => {
      try {
         setVehicleStatus(formDataInitialState);
      } catch (error) {
         console.log("Error en resetVehicleStatus:", error);
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

   const getVehicleStatussSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/vehicleStatus/selectIndex`);
         // console.log("el selectedDeVehicleStatuss", axiosData);
         res.result.vehicleStatuss = axiosData.data.data.result;
         res.result.vehicleStatuss.unshift({ id: 0, label: "Selecciona una opción..." });
         setVehicleStatuss(axiosData.data.data.result);
         // console.log("vehicleStatus", vehicleStatus);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showVehicleStatus = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/vehicleStatus/${id}`);
         res = axiosData.data.data;
         await setVehicleStatus(res.result);
         setFormData(res.result);
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
         const axiosData = await Axios.post("/vehicleStatus/update", vehicleStatus);
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
         const axiosData = await Axios.post(`/vehicleStatus/destroy/${id}`);
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
            resetVehicleStatus,
            getVehicleStatuss,
            getVehicleStatussSelectIndex,
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
