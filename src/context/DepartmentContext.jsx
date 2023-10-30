import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const DepartmentContext = createContext();

const formDataInitialState = {
   id: 0,
   department: "",
   description: ""
};

export default function DepartmentContextProvider({ children }) {
   const singularName = "Departamento"; //Escribirlo siempre letra Capital
   const pluralName = "Departamentos"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [departments, setDepartments] = useState([]);
   const [department, setDepartment] = useState(null);
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
         newData.department = values.department;
         newData.description = values.description;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   const getDepartments = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/departments`);
         res.result.departments = axiosData.data.data.result;
         setDepartments(axiosData.data.data.result);
         // console.log("departments", departments);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showDepartment = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/departments/${id}`);
         res = axiosData.data.data;
         // await setDepartment(res.result);
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

   const createDepartment = async (department) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/departments", department);
         res = axiosData.data.data;
         getDepartments();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateDepartment = async (department) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/departments/update", department);
         res = axiosData.data.data;
         getDepartments();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteDepartment = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/departments/destroy/${id}`);
         // console.log("deleteDepartment() axiosData", axiosData.data);
         getDepartments();
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
   //    console.log("el useEffect de DepartmentContext");
   //    getDepartments();
   // });

   return (
      <DepartmentContext.Provider
         value={{
            singularName,
            pluralName,
            departments,
            department,
            formData,
            setFormData,
            resetFormData,
            getDepartments,
            showDepartment,
            createDepartment,
            updateDepartment,
            deleteDepartment,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </DepartmentContext.Provider>
   );
}
export const useDepartmentContext = () => useContext(DepartmentContext);
