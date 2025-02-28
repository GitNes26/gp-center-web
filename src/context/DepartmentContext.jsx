import { createContext, useContext, useEffect, useRef, useState } from "react";
// import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

import departamentos from "../assets/db/departamentos.json";
import departamentosSelectIndex from "../assets/db/departamentos-selectIndex.json";
import { Axios } from "./AuthContext";
export const dataDepartamentos = departamentos;
export const dataDepartamentosSelectIndex = departamentosSelectIndex;

const DepartmentContext = createContext();

const formDataInitialState = {
   id: 0,
   organismo: "",
   departamento: "",
   department_id: 0,
   director_id: 0
};

const prefix = "/cp/departamentos";
export default function DepartmentContextProvider({ children }) {
   const singularName = "Departamento"; //Escribirlo siempre letra Capital
   const pluralName = "Departamentos"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [departments, setDepartments] = useState([]);
   const [department, setDepartment] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [directorsHistory, setDirectorsHistory] = useState([]);
   const formikRef = useRef();

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetDepartment = () => {
      try {
         setDepartment(formDataInitialState);
      } catch (error) {
         console.log("Error en resetDepartment:", error);
         Toast.Error(error);
      }
   };

   const getDepartments = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/depDir`);
         // const axiosData = await Axios.get(`${prefix}`);

         // console.log("🚀 ~ getDepartments ~ axiosData:", axiosData);
         res.result.departments = axiosData.data.data.result;
         setDepartments(axiosData.data.data.result);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getDepartmentsSelectIndex = async () => {
      try {
         const res = CorrectRes;
         // const axiosData = await Axios.get(`${prefix}/selectIndex`);
         const axiosData = await Axios.get(`depDir/selectIndex`);
         // console.log("solicitud de departamentos", axiosData);
         res.result.departments = axiosData.data.data.result;
         // res.result.departments.unshift({ id: 0, label: "Selecciona una opción..." });
         setDepartments(axiosData.data.data.result);
         // console.log("departments", departments);

         // const axiosData = departamentosSelectIndex;
         // console.log("solicitud de departamentos", axiosData);
         // res.result.departments = axiosData.data.result;
         // // res.result.departments.unshift({ id: 0, label: "Selecciona una opción..." });
         // setDepartments(axiosData.data.result);
         // // console.log("departments", departments);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showDepartment = async (department_id) => {
      try {
         let res = CorrectRes;
         // const axiosData = await Axios.get(`${prefix}/${id}`);
         const axiosData = await Axios.get(`depDir/${department_id}`);
         // const axiosData = departamentos.data.result.find((i) => i.id == id);
         // console.log("🚀 ~ showDepartment ~ axiosData:", axiosData);
         res = axiosData.data.data.result;
         // console.log(res);
         setDepartment(res);
         setFormData(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showDepartmentDirector = async (department_id) => {
      try {
         let res = CorrectRes;
         // const axiosData = await Axios.get(`${prefix}/${id}`);
         // const axiosData = departamentos.data.result.find((i) => i.id == id);
         const axiosData = await Axios.get(`depDir/department/${department_id}`);
         // console.log("🚀 ~ showDepartment ~ axiosData:", axiosData);
         res = axiosData.data.data.result;
         // console.log(res);
         setDepartment(res);
         setFormData(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createDepartmentDirector = async (department) => {
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post("/create", department);
         const axiosData = await Axios.post("/depDir/create", department);
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

   const createDepartment = async (depDir) => {
      console.log("🚀 ~ createDepartment ~ depDir:", depDir);
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post("/create", depDir);
         const axiosData = await Axios.post("/depDir/create", depDir);
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
         const axiosData = await Axios.post("/update", department);
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
         const axiosData = await Axios.post(`/destroy/${id}`);
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
            resetDepartment,
            getDepartments,
            getDepartmentsSelectIndex,
            showDepartment,
            createDepartment,
            updateDepartment,
            deleteDepartment,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            formikRef,
            showDepartmentDirector,
            createDepartmentDirector,
            directorsHistory,
            setDirectorsHistory
         }}
      >
         {children}
      </DepartmentContext.Provider>
   );
}
export const useDepartmentContext = () => useContext(DepartmentContext);
