import { useEffect } from "react";
import { Typography } from "@mui/material";
import { useDriverContext } from "../../../context/DriverContext";
import { useGlobalContext } from "../../../context/GlobalContext";
import EmployeeDataTableBase from "../../../components/EmployeeDataTableBase";
import { useAuthContext } from "../../../context/AuthContext";
import Toast from "../../../utils/Toast";

const DriverDT = () => {
   const { auth } = useAuthContext();
   const { setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, drivers, getDrivers, showDriver, deleteDriver, resetFormData, resetDriver, setTextBtnSumbit, setFormTitle, formikRef } = useDriverContext();

   const globalFilterFields = ["employee_code", "username", "email", "cellphone", "license_number", "department", "director"];

   const LicenseBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.license_number}</Typography>;
   const DirectorBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.director}</Typography>;

   const extraColumns = [
      { field: "license_number", header: "No. Licencia", sortable: true, body: LicenseBodyTemplate, filter: true },
      { field: "director", header: "Director", sortable: true, body: DirectorBodyTemplate, filter: true }
   ];

   const handleClickAdd = () => {
      try {
         resetDriver();
         resetFormData();
         formikRef.current.setValues(formikRef.current.initialValues);
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showDriver(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (user_id, name) => {
      try {
         setLoadingAction(true);
         const axiosResponse = await deleteDriver(user_id);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      // nothing extra
   }, []);

   return (
      <EmployeeDataTableBase
         columns={extraColumns}
         data={drivers}
         globalFilterFields={globalFilterFields}
         singularName={singularName}
         handleClickAdd={handleClickAdd}
         refreshTable={getDrivers}
         btnAdd={auth.permissions.create}
         handleClickEdit={handleClickEdit}
         handleClickDelete={handleClickDelete}
      />
   );
};
export default DriverDT;
