import { createContext, useContext, useEffect, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const MechanicContext = createContext();

const formDataInitialState = {
   id: 0,
   payroll_number: "",
   avatar: "",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   email: "",
   phone: "",
   active: active
};
const voucherRequesterInitialState = {
   id: 0,
   payroll_number: "",
   avatar: "",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   email: "",
   phone: "",
   active: active
};

export default function MechanicContextProvider({ children }) {
   const { auth } = useAuthContext();

   const singularName = "Mecánico"; //Escribirlo siempre letra Capital
   const pluralName = "Mecánicos"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [voucherRequester, setMechanic] = useState(voucherRequesterInitialState);
   const [mechanics, setMechanics] = useState([]);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetMechanic = () => {
      try {
         setMechanic(voucherRequesterInitialState);
      } catch (error) {
         console.log("Error en resetMechanic:", error);
         Toast.Error(error);
      }
   };

   const getMechanics = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/mechanics`);
         res.result.mechanics = axiosData.data.data.result;
         setMechanics(axiosData.data.data.result);
         // console.log("mechanics", mechanics);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showMechanic = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/mechanics/${id}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;

         setMechanic(res.result);
         setFormData(res.result);
         // console.log("showMechanic", res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getMechanicsSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/mechanics/selectIndex`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.mechanics = axiosData.data.data.result;
         res.result.mechanics.unshift({ id: 0, label: "Selecciona una opción..." });
         setMechanics(axiosData.data.data.result);
         // console.log("mechanics", mechanics);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createMechanic = async (voucherRequester) => {
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post(`/users/create/5`, voucherRequester);
         const axiosData = await Axios.post(`/mechanics/createOrUpdate/`, voucherRequester, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
         // console.log(axiosData);
         res = axiosData.data.data;
         getMechanics();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateMechanic = async (voucherRequester) => {
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post("/mechanics/update", voucherRequester);
         // const axiosData = await Axios.post(`/users/update/${voucherRequester.user_id}`, voucherRequester);
         const axiosData = await Axios.post(`/mechanics/createOrUpdate/${voucherRequester.id}`, voucherRequester, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
         res = axiosData.data.data;
         getMechanics();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteMechanic = async (user_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/mechanics/delete/${user_id}`);
         // console.log("deleteMechanic() axiosData", axiosData.data);
         getMechanics();
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
   //    console.log("el useEffect de MechanicContext");
   //    getMechanics();
   // });

   return (
      <MechanicContext.Provider
         value={{
            singularName,
            pluralName,
            mechanics,
            setMechanics,
            voucherRequester,
            setMechanic,
            resetMechanic,
            formData,
            setFormData,
            resetFormData,
            getMechanics,
            showMechanic,
            getMechanicsSelectIndex,
            createMechanic,
            updateMechanic,
            deleteMechanic,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </MechanicContext.Provider>
   );
}
export const useMechanicContext = () => useContext(MechanicContext);
