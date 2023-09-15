import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./UserContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const LevelContext = createContext();

const formDataInitialState = {
   id: 0,
   level: ""
};

export default function LevelContextProvider({ children }) {
   const [formTitle, setFormTitle] = useState("REGISTRAR ESCUELA");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");
   // const [loading, setLoading] = useState(true);
   // const [loadingAction, setLoadingAction] = useState(false);

   const [levels, setLevels] = useState([]);
   const [level, setLevel] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
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
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };

   const fillFormData = (values) => {
      try {
         const newData = { ...formData };
         newData.id = values.id;
         newData.level = values.level;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const getLevels = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/levels`);
         res.result.levels = axiosData.data.data.result;
         setLevels(axiosData.data.data.result);
         // console.log("levels", levels);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showLevel = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/levels/${id}`);
         setOpenDialog(true);
         res = axiosData.data.data;
         // await setLevel(res.result);
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

   const createLevel = async (level) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/levels", level);
         res = axiosData.data.data;
         getLevels();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateLevel = async (level) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/levels", level);
         res = axiosData.data.data;
         getLevels();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteLevel = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/levels/${id}`);
         // console.log("deleteLevel() axiosData", axiosData.data);
         getLevels();
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
   //    console.log("el useEffect de LevelContext");
   //    getLevels();
   // });

   return (
      <LevelContext.Provider
         value={{
            levels,
            level,
            formData,
            resetFormData,
            getLevels,
            showLevel,
            createLevel,
            updateLevel,
            deleteLevel,
            openDialog,
            setOpenDialog,
            toggleDrawer,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </LevelContext.Provider>
   );
}
export const useLevelContext = () => useContext(LevelContext);
