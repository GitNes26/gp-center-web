import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";
import dayjs from "dayjs";

const ServiceContext = createContext();

const formDataInitialState = {
   id: 0,
   folio: "",
   vehicle_id: 0,
   contact_name: "",
   contact_cellphone: "",
   pre_diagnosis: "",
   final_diagnosis: null,

   status: "",
   // evidence_img_path: null,

   requested_by: "",
   requested_at: "",

   approved_by: "",
   approved_at: "",

   mechanic_id: 0,
   reviewed_at: "",

   rejected_by: 0,
   rejected_at: "",

   closed_at: "",

   stock_number: "",
   year: "",
   registration_date: "",
   description: "",
   brand: "",
   model: "",

   vehicle_status: "",
   // bg_color: "",
   // letter_black: 0,

   plates: "",
   initial_date: "",
   due_date: "",

   dateTime: ""
};

export default function ServiceContextProvider({ children }) {
   const { auth, counterOfMenus } = useAuthContext();
   if (auth.role_id === 4) formDataInitialState.mechanic_id = auth.id;
   const singularName = "Servicio"; //Escribirlo siempre letra Capital
   const pluralName = "Servicios"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("SOLICITAR");

   const [services, setServices] = useState([]);
   const [service, setService] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [imgFile, setImgFile] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);
   const formikRef = useRef();

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
         // const newData = { ...formData };
         // newData.id = values.id;
         // newData.stock_number = values.stock_number;
         // newData.brand_id = values.brand_id;
         // newData.model_id = values.model_id;
         // newData.year = values.year;
         // newData.registration_date = values.registration_date;
         // newData.description = values.description;
         // newData.service_status_id = values.service_status_id;

         // newData.plates = values.plates;
         // newData.initial_date = values.initial_date;
         // newData.due_date = values.due_date;

         // newData.status = values.status;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   const changeStatus = async (serviceId, status, statusCurrent = null) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.get(`/services/${serviceId}/changeStatus/${status}`);
         // console.log("🚀 ~ changeStatus ~ axiosData:", axiosData);
         res = axiosData.data.data;
         getServices(statusCurrent);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const loadMaterial = async (serviceId, requestMaterial, statusCurrent = null) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.get(`/services/${serviceId}/loadMaterial/${Boolean(requestMaterial)}`);
         // console.log("🚀 ~ changeStatus ~ axiosData:", axiosData);
         res = axiosData.data.data;
         getServices(statusCurrent);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const getServices = async (status = null) => {
      try {
         setService([]);
         const res = CorrectRes;
         let pathApi = `/services`;
         // let counterName = "requestAll";
         if (status != null) {
            // console.log("getRequestBecas()->status", status);
            let filterStatus;
            if (status == "abiertas") filterStatus = "ABIERTA";
            else if (status == "aprobadas") filterStatus = "APROBADA";
            else if (status == "rechazadas") filterStatus = "RECHAZADA";
            else if (status == "en-revision") filterStatus = "EN REVISIÓN";
            else if (status == "cerradas") filterStatus = "CERRADA";
            pathApi = `/services/status/${filterStatus}`;
         }
         const axiosData = await Axios.get(pathApi);
         res.result.services = axiosData.data.data.result;
         // console.log(res.result);
         setServices(axiosData.data.data.result);
         // console.log("services", services);
         await counterOfMenus();

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showService = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/services/${id}`);
         res = axiosData.data.data;
         // await setService(res.result);
         setFormData(res.result);
         setService(res.result);
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

   const showServiceBy = async (searchBy, value) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/services/${searchBy}/${value}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         // await setService(res.result);
         // setFormData(res.result);
         setService(res.result);
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

   const createService = async (service) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(
            "/services",
            service
            // , {
            //    headers: {
            //       "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            //    }
            // }
         );
         res = axiosData.data.data;
         getServices();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateService = async (service, statusCurrent) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(
            `/services/update/${service.id}`,
            service
            // , {
            //    headers: {
            //       "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            //    }
            // }
         );
         res = axiosData.data.data;
         getServices(statusCurrent);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteService = async (id, statusCurrent) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/services/destroy/${id}`);
         // console.log("deleteService() axiosData", axiosData.data);
         getServices(statusCurrent);
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
   //    console.log("el useEffect de ServiceContext");
   //    getServices();
   // });

   return (
      <ServiceContext.Provider
         value={{
            singularName,
            pluralName,
            services,
            service,
            setService,
            formData,
            setFormData,
            resetFormData,
            getServices,
            showService,
            showServiceBy,
            createService,
            updateService,
            deleteService,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            imgFile,
            setImgFile,
            imagePreview,
            setImagePreview,
            formikRef,
            changeStatus,
            loadMaterial
         }}
      >
         {children}
      </ServiceContext.Provider>
   );
}
export const useServiceContext = () => useContext(ServiceContext);
