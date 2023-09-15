import { createContext, useContext, useEffect, useState } from "react";
import { Axios, useUserContext } from "./UserContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const RequestBecaContext = createContext();

const formDataInitialState = {
   id: 0,
   tutor_id: "",
   folio: "",
   tutor_full_name: "",
   tutor_phone: "",

   student_data_id: 0,
   curp: "",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   birthdate: "",
   gender: "MASCULINO",
   community_id: 0,
   zip: "",
   state: "",
   city: "",
   colony: "",

   street: "",
   num_ext: "",
   num_int: "",
   disability_id: "",

   school_id: "",
   grade: "",
   average: ""
};

const formData1InitialState = {
   id: 0,
   tutor_id: "",
   folio: "",
   tutor_full_name: "",
   tutor_phone: ""
};
const formData2InitialState = {
   id: 0,
   student_data_id: 0,
   curp: "",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   birthdate: "",
   gender: "MASCULINO",
   community_id: 0,
   zip: "",
   state: "",
   city: "",
   colony: "",

   street: "",
   num_ext: "",
   num_int: "",
   disability_id: ""
};
const formData3InitialState = {
   id: 0,
   school_id: "",
   grade: "",
   average: ""
};

export default function RequestBecaContextProvider({ children }) {
   const { user } = useUserContext();
   formDataInitialState.tutor_id = user.id;
   formData1InitialState.tutor_id = user.id;
   const [formTitle, setFormTitle] = useState("REGISTRAR BECA");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");
   // const [loading, setLoading] = useState(true);
   // const [loadingAction, setLoadingAction] = useState(false);

   const [requestBecas, setRequestBecas] = useState([]);
   const [requestBeca, setRequestBeca] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [formData1, setFormData1] = useState(formData1InitialState);
   const [formData2, setFormData2] = useState(formData2InitialState);
   const [formData3, setFormData3] = useState(formData3InitialState);
   const [openDialog, setOpenDialog] = useState(false);

   const toggleDrawer = (open) => (event) => {
      try {
         if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
         }
         setOpenDialog(open);
      } catch (error) {
         console.log("Error en toggleDrawer:", error);
      }
   };

   const resetFormData = () => {
      try {
         // console.log("a resetear forms");
         setFormData(formDataInitialState);
         setFormData1(formData1InitialState);
         setFormData2(formData2InitialState);
         setFormData3(formData3InitialState);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const fillFormData = (values) => {
      try {
         const newData = { ...formData };
         newData.id = values.id;
         newData.code = values.code;
         newData.requestBeca = values.requestBeca;
         newData.city = values.city;
         newData.colony = values.colony;
         newData.street = values.street;
         newData.phone = values.phone;
         newData.director = values.director;
         newData.loc_for = values.loc_for;
         newData.zone = values.zone;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const getRequestBecas = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/becas`);
         res.result.requestBecas = axiosData.data.data.result;
         setRequestBecas(axiosData.data.data.result);
         // console.log("requestBecas", requestBecas);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showRequestBeca = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/becas/${id}`);
         setOpenDialog(true);
         res = axiosData.data.data;
         // await setRequestBeca(res.result);
         // setFormData(res.result);
         fillFormData(res.result);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createRequestBeca = async (requestBeca) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/becas", requestBeca);
         res = axiosData.data.data;
         // getRequestBecas();
         return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateRequestBeca = async (requestBeca) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/becas", requestBeca);
         res = axiosData.data.data;
         console.log("el res", res);
         // getRequestBecas();
         return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteRequestBeca = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/becas/${id}`);
         // console.log("deleteRequestBeca() axiosData", axiosData.data);
         getRequestBecas();
         res = axiosData.data.data;
         // console.log("res", res);
         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   // useEffect(() => {
   //    // console.log("el useEffect de RequestBecaContext");
   //    // getRequestBecas();
   // });

   return (
      <RequestBecaContext.Provider
         value={{
            formTitle,
            setFormTitle,
            textBtnSubmit,
            setTextBtnSumbit,
            requestBecas,
            setRequestBecas,
            requestBeca,
            formData,
            setFormData,
            formData1,
            setFormData1,
            formData2,
            setFormData2,
            formData3,
            setFormData3,
            openDialog,
            setOpenDialog,
            toggleDrawer,
            resetFormData,
            fillFormData,
            getRequestBecas,
            showRequestBeca,
            createRequestBeca,
            updateRequestBeca,
            deleteRequestBeca
         }}
      >
         {children}
      </RequestBecaContext.Provider>
   );
}
export const useRequestBecaContext = () => useContext(RequestBecaContext);
