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

   plates: "",
   initial_date: "",
   due_date: "",
   img_path: "",

   status: "",
   changePlates: false
};

export default function VehicleContextProvider({ children }) {
   const singularName = "Vehiculo"; //Escribirlo siempre letra Capital
   const pluralName = "Vehiculos"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [vehicles, setVehicles] = useState([]);
   const [vehicle, setVehicle] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [imgFile, setImgFile] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
         setImgFile(null);
         setImagePreview(null);
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

         newData.plates = values.plates;
         newData.initial_date = values.initial_date;
         newData.due_date = values.due_date;

         newData.status = values.status;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   const getVehicles = async () => {
      try {
         setVehicle([]);
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

   const showVehicleBy = async (searchBy, value) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/vehicles/${searchBy}/${value}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         // await setVehicle(res.result);
         // setFormData(res.result);
         setVehicle(res.result);
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
         const axiosData = await Axios.post(`/vehicles/${vehicle.id}`, vehicle, {
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
            setImagePreview
         }}
      >
         {children}
      </VehicleContext.Provider>
   );
}
export const useVehicleContext = () => useContext(VehicleContext);
