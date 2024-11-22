import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const VehicleContext = createContext();

const formDataInitialState = {
   id: 0,
   stock_number: "",
   brand_id: 0,
   brand: "Selecciona una opción...",
   model_id: 0,
   model: "Selecciona una opción...",
   year: "",
   registration_date: "",
   vehicle_status_id: 0,
   vehicle_status: "Selecciona una opción...",
   description: "",
   acceptable_license_type: "",

   img_preview: "",
   img_right: "",
   img_back: "",
   img_left: "",
   img_front: "",

   serial_number: "",
   img_serial_number: "",
   visible_serial_number: true,

   circulation_card: "",
   img_circulation_card: "",

   insurance_policy: "",
   img_insurance_policy: "",

   violated: "",

   plates: "",
   gasoline_code: "",
   initial_date: "",
   due_date: "",

   status: "",
   changePlates: false
};

export default function VehicleContextProvider({ children }) {
   const singularName = "Vehículo"; //Escribirlo siempre letra Capital
   const pluralName = "Vehículos"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [vehicles, setVehicles] = useState([]);
   const [vehicle, setVehicle] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [imgFile, setImgFile] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);

   const [dataList, setDataList] = useState([]);
   const [history, setHistory] = useState([]);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
         setImgFile(null);
         setImagePreview(null);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetVehicle = () => {
      try {
         setVehicle(formDataInitialState);
         setImgFile(null);
         setImagePreview(null);
      } catch (error) {
         console.log("Error en resetVehicle:", error);
         Toast.Error(error);
      }
   };

   const getHistory = async (vehicle_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/vehicleMovements/history/${vehicle_id}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         setHistory(res.result);
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

   const getVehicles = async () => {
      try {
         // setVehicle([]);
         const res = CorrectRes;
         const axiosData = await Axios.get(`/vehicles`);
         res.result.vehicles = axiosData.data.data.result;
         // console.log(res.result);
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
         setFormData(res.result);
         setVehicle(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showVehicleBy = async (searchBy, value) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/vehicles/${searchBy}/${value}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         // await setVehicle(res.result);
         // setFormData(res.result);
         setVehicle(res.result);
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
         const axiosData = await Axios.post("/vehicles", vehicle, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
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
         const axiosData = await Axios.post(`/vehicles/update/${vehicle.id}`, vehicle, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
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
         const axiosData = await Axios.post(`/vehicles/destroy/${id}`);
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
            resetVehicle,
            getVehicles,
            showVehicle,
            showVehicleBy,
            createVehicle,
            updateVehicle,
            deleteVehicle,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            imgFile,
            setImgFile,
            imagePreview,
            setImagePreview,
            dataList,
            setDataList,
            getHistory,
            history,
            setHistory
         }}
      >
         {children}
      </VehicleContext.Provider>
   );
}
export const useVehicleContext = () => useContext(VehicleContext);
