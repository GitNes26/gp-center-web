import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const EmployeeContext = createContext();

const formDataInitialState = {
   id: 0,
   user_id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 0,
   avatar: "",
   cellphone: "",
   license_number: "",
   license_type: "",
   license_due_date: "",
   img_lincense: "",
   employee_code: "",
   department_id: 0,
   // department: "Selecciona una opción...",
   department: "",
   signature_image: "",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   community_id: 0,
   street: "",
   num_ext: "",
   num_int: "",

   zip: "",
   state: 0,
   city: 0,
   colony: 0,
   employee_code_exist: false
};
const employeeInitialState = {
   id: 0,
   user_id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 0,
   role: "Selecciona una opción...",
   avatar: "",
   cellphone: "",
   license_number: "",
   license_type: "",
   license_due_date: "",
   img_lincense: "",
   employee_code: "",
   department_id: 0,
   // department: "Selecciona una opción...",
   department: "",
   signature_image: "",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   community_id: 0,
   street: "",
   num_ext: "",
   num_int: "",

   zip: "",
   state: "Selecciona una opción...",
   city: "Selecciona una opción...",
   colony: "Selecciona una opción...",
   employee_code_exist: false
};

export default function EmployeeContextProvider({ children }) {
   const { auth } = useAuthContext();

   const singularName = "Empleado"; //Escribirlo siempre letra Capital
   const pluralName = "Empleados"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [employee, setEmployee] = useState(employeeInitialState);
   const [employees, setEmployees] = useState([]);
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
   const resetEmployee = () => {
      try {
         setEmployee(employeeInitialState);
      } catch (error) {
         console.log("Error en resetEmployee:", error);
         Toast.Error(error);
      }
   };

   const getEmployees = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/employees`);
         res.result.employees = axiosData.data.result;
         setEmployees(axiosData.data.data.result);
         // console.log("employees", employees);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getEmployeesSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/employees/selectIndex`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.employees = axiosData.data.data.result;
         // res.result.employees.unshift({ id: 0, label: "Selecciona una opción..." });
         setEmployees(axiosData.data.data.result);
         // console.log("employees", employees);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showEmployee = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/employees/id/${id}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         // res.result.zip = "";
         // res.result.state = "Selecciona una opción...";
         // res.result.city = "Selecciona una opción...";
         // res.result.colony = "Selecciona una opción...";
         res.result.employee_code_exist = true;
         if (res.result.employee_code.length < 3) res.result.employee_code_exist = false;

         setEmployee(res.result);
         setFormData(res.result);
         // console.log("showEmployee", res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getInfoEmployee = async (field, value) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/employees/getBy/${field}/${value}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         // res.result.zip = "";
         // res.result.state = "Selecciona una opción...";
         // res.result.city = "Selecciona una opción...";
         // res.result.colony = "Selecciona una opción...";
         res.result.employee_code_exist = true;
         if (res.result.employee_code.length < 3) res.result.employee_code_exist = false;

         setEmployee(res.result);
         setFormData(res.result);
         // console.log("showEmployee", res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createEmployee = async (employee) => {
      // return console.log("🚀 ~ createEmployee ~ employee:", employee);
      employee.isEmployee = true;
      employee.objName = "Employee";
      employee.dir = "/employees";
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post(`/users/create/5`, employee);
         // const axiosData = await Axios.post(`/employees/create/user_id/${employee.user_id}`, employee, {
         // const axiosData = await Axios.post(`/users/create/employee`, employee, {
         const axiosData = await Axios.post(`/employees/create`, employee, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
         // console.log(axiosData);
         res = axiosData.data.data;
         getEmployees();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateEmployee = async (employee) => {
      employee.isEmployee = true;
      employee.objName = "Employee";
      employee.dir = "/employees";
      let res = CorrectRes;
      try {
         // const axiosData = await Axios.post(`/users/update/${employee.user_id}`, employee);
         // const axiosData = await Axios.post(`/users/update/role_id/5`, employee, {
         const axiosData = await Axios.post(`/employees/update/${employee.id}`, employee, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
         res = axiosData.data.data;
         getEmployees();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteEmployee = async (user_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/employees/destroy/${user_id}`);
         // console.log("deleteEmployee() axiosData", axiosData.data);
         getEmployees();
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
   const deleteMultiple = async (ids) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/employees/destroyMultiple`, { ids });
         // console.log("deleteMultiple() axiosData", axiosData.data);
         getUsers();
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
   const disEnableEmployee = async (id, active) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/employees/${id}/disEnable/${active ? "1" : "0"}`);
         // console.log("deleteUser() axiosData", axiosData.data);
         getEmployees();
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
   //    console.log("el useEffect de EmployeeContext");
   //    getEmployees();
   // });

   return (
      <EmployeeContext.Provider
         value={{
            singularName,
            pluralName,
            employees,
            setEmployees,
            employee,
            setEmployee,
            resetEmployee,
            formData,
            setFormData,
            resetFormData,
            getEmployees,
            showEmployee,
            getEmployeesSelectIndex,
            createEmployee,
            updateEmployee,
            deleteEmployee,
            deleteMultiple,
            disEnableEmployee,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            formikRef,
            getInfoEmployee
         }}
      >
         {children}
      </EmployeeContext.Provider>
   );
}
export const useEmployeeContext = () => useContext(EmployeeContext);
