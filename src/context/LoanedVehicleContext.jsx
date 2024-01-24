import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const LoanedVehicleContext = createContext();

const formDataInitialState = {
   id: 0,
   user_id: 0,
   vehicle_id: 0,
   date: ""
};

export default function LoanedVehicleContextProvider({ children }) {
   const singularName = "Prestamo de Vehículo"; //Escribirlo siempre letra Capital
   const pluralName = "Prestaciones de Vehículo"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [loanedVehicles, setLoanedVehicles] = useState([]);
   const [loanedVehicle, setLoanedVehicle] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetLoanedVehicle = () => {
      try {
         setLoanedVehicle(formDataInitialState);
      } catch (error) {
         console.log("Error en resetLoanedVehicle:", error);
         Toast.Error(error);
      }
   };

   const getLoanedVehicles = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/loanedVehicle`);
         res.result.loanedVehicles = axiosData.data.data.result;
         setLoanedVehicles(axiosData.data.data.result);
         // console.log("loanedVehicles", loanedVehicles);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getLoanedVehiclesSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/loanedVehicle/selectIndex`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.loanedVehicles = axiosData.data.data.result;
         res.result.loanedVehicles.unshift({ id: 0, label: "Selecciona una opción..." });
         setLoanedVehicles(axiosData.data.data.result);
         // console.log("loanedVehicles", loanedVehicles);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showLoanedVehicle = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/loanedVehicle/${id}`);
         res = axiosData.data.data;
         // console.log(res);
         setLoanedVehicle(res.result);
         setFormData(res.result);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createLoanedVehicle = async (loanedVehicle) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/loanedVehicle/create", loanedVehicle);
         res = axiosData.data.data;
         getLoanedVehicles();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateLoanedVehicle = async (loanedVehicle) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/loanedVehicle/update", loanedVehicle);
         res = axiosData.data.data;
         getLoanedVehicles();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteLoanedVehicle = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/loanedVehicle/destroy/${id}`);
         // console.log("deleteLoanedVehicle() axiosData", axiosData.data);
         getLoanedVehicles();
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
   //    console.log("el useEffect de LoanedVehicleContext");
   //    getLoanedVehicles();
   // });

   return (
      <LoanedVehicleContext.Provider
         value={{
            singularName,
            pluralName,
            loanedVehicles,
            loanedVehicle,
            formData,
            setFormData,
            resetFormData,
            resetLoanedVehicle,
            getLoanedVehicles,
            getLoanedVehiclesSelectIndex,
            showLoanedVehicle,
            createLoanedVehicle,
            updateLoanedVehicle,
            deleteLoanedVehicle,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </LoanedVehicleContext.Provider>
   );
}
export const useLoanedVehicleContext = () => useContext(LoanedVehicleContext);
