import { createContext, useContext, useRef, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";
import PropTypes from "prop-types";

const MechanicContext = createContext();

const formDataInitialState = {
   id: 0,
   gpc_employee_id: 0,
   user_id: 0,
   username: "",
   password: "",
   role_id: 4,
   employee_code: "",
   employee_code_exist: false,
   avatar: "",
   department: "",
   position_name: "",
   name: "",
   plast_name: "",
   mlast_name: "",
   email: "",
   cellphone: "",
   active: true
};
const voucherRequesterInitialState = {
   id: 0,
   gpc_employee_id: 0,
   user_id: 0,
   username: "",
   password: "",
   role_id: 4,
   employee_code: "",
   employee_code_exist: false,
   avatar: "",
   department: "",
   position_name: "",
   name: "",
   plast_name: "",
   mlast_name: "",
   email: "",
   cellphone: "",
   active: true
};

export default function MechanicContextProvider({ children }) {
   const singularName = "Mecánico"; //Escribirlo siempre letra Capital
   const pluralName = "Mecánicos"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [voucherRequester, setMechanic] = useState(voucherRequesterInitialState);
   const [mechanics, setMechanics] = useState([]);
   const [formData, setFormData] = useState(formDataInitialState);
   const formikRef = useRef(null);

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
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showMechanic = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/mechanics/id/${id}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         res.result.employee_code_exist = true;

         setMechanic(res.result);
         setFormData(res.result);
         // console.log("showMechanic", res);

         return res;
      } catch (error) {
         const res = ErrorRes;
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
         // res.result.mechanics.unshift({ id: 0, label: "Selecciona una opción..." });
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
         const axiosData = await Axios.post(`/users/create`, voucherRequester, {
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
         const axiosData = await Axios.post(`/users/update`, voucherRequester, {
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
         const axiosData = await Axios.get(`/mechanics/delete/${user_id}`);
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

   const disEnableMechanic = async (id, active) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`mechanics/disEnable/${id}/${active ? "reactivar" : "desactivar"}`);
         // console.log("deleteUser() axiosData", axiosData.data);
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
            disEnableMechanic,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            formikRef
         }}
      >
         {children}
      </MechanicContext.Provider>
   );
}
MechanicContextProvider.propTypes = { children: PropTypes.node.isRequired };
export const useMechanicContext = () => useContext(MechanicContext);
