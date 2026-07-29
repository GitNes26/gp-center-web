import { useEffect } from "react";
import { useMechanicContext } from "../../../context/MechanicContext";
import { useGlobalContext, ROLE_SUPER_ADMIN } from "../../../context/GlobalContext";
import EmployeeDataTableBase from "../../../components/EmployeeDataTableBase";
import { useAuthContext } from "../../../context/AuthContext";
import Toast from "../../../utils/Toast";

const MechanicDT = () => {
   const { auth } = useAuthContext();
   const { setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      mechanics,
      getMechanics,
      showMechanic,
      deleteMechanic,
      disEnableMechanic,
      resetFormData,
      resetMechanic,
      setTextBtnSumbit,
      setFormTitle,
      formikRef
   } = useMechanicContext();

   const globalFilterFields = ["employee_code", "full_name", "email", "cellphone"];

   const handleClickAdd = () => {
      try {
         resetMechanic();
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
         await showMechanic(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         setLoadingAction(true);
         const axiosResponse = await deleteMechanic(id);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, name, active) => {
      try {
         setTimeout(async () => {
            const axiosResponse = await disEnableMechanic(id, !active);
            Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         }, 500);
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
         data={mechanics}
         globalFilterFields={globalFilterFields}
         singularName={singularName}
         handleClickAdd={handleClickAdd}
         refreshTable={getMechanics}
         btnAdd={auth.permissions.create}
         handleClickEdit={handleClickEdit}
         handleClickDelete={handleClickDelete}
         showActiveToggle={true}
         activeTogglePermission={auth.role_id === ROLE_SUPER_ADMIN}
         handleClickDisEnable={handleClickDisEnable}
         useFullName={true}
         showDepartmentColumn={false}
         deleteWithUserId={false}
      />
   );
};
export default MechanicDT;
