import { useEffect } from "react";
import { Typography } from "@mui/material";
import { useDirectorContext } from "../../../context/DirectorContext";
import { useGlobalContext } from "../../../context/GlobalContext";
import EmployeeDataTableBase from "../../../components/EmployeeDataTableBase";
import { useAuthContext } from "../../../context/AuthContext";
import Toast from "../../../utils/Toast";

const DirectorDT = () => {
   const { auth } = useAuthContext();
   const { setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, directors, getDirectors, showDirector, deleteDirector, resetFormData, resetDirector, setTextBtnSumbit, setFormTitle, formikRef } =
      useDirectorContext();

   const globalFilterFields = ["employee_code", "username", "email", "cellphone", "license_number", "department"];

   const LicenseBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.license_number}</Typography>;

   const extraColumns = [{ field: "license_number", header: "No. Licencia", sortable: true, body: LicenseBodyTemplate, filter: true }];

   const handleClickAdd = () => {
      try {
         resetDirector();
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
         const res = await showDirector(id);
         formikRef.current.setValues(res.result);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         setLoadingAction(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (user_id, name) => {
      try {
         setLoadingAction(true);
         const axiosResponse = await deleteDirector(user_id);
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
         data={directors}
         globalFilterFields={globalFilterFields}
         singularName={singularName}
         handleClickAdd={handleClickAdd}
         refreshTable={getDirectors}
         btnAdd={auth.permissions.create}
         handleClickEdit={handleClickEdit}
         handleClickDelete={handleClickDelete}
      />
   );
};
export default DirectorDT;
