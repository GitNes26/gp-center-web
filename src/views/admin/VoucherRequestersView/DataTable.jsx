import { useEffect, useState } from "react";
import { useVoucherRequesterContext } from "../../../context/VoucherRequesterContext";
import { useGlobalContext } from "../../../context/GlobalContext";
import EmployeeDataTableBase from "../../../components/EmployeeDataTableBase";
import { useUserContext } from "../../../context/UserContext";
import { useEmployeeContext } from "../../../context/EmployeeContext";
import { useAuthContext } from "../../../context/AuthContext";
import Toast from "../../../utils/Toast";
import EmployeeCardInfo from "./CardInfo";
import { sleep } from "../../../utils/Formats";

const VoucherRequesterDT = () => {
   const { auth } = useAuthContext();
   const { setLoadingAction, setOpenDialog, openCardInfo, setOpenCardInfo } = useGlobalContext();
   const { disEnableUser } = useUserContext();
   const { getInfoEmployee } = useEmployeeContext();
   const {
      singularName,
      voucherRequesters,
      voucherRequester,
      setVoucherRequester,
      getVoucherRequesters,
      showVoucherRequester,
      resetFormData,
      resetVoucherRequester,
      setTextBtnSumbit,
      setFormTitle,
      formikRef
   } = useVoucherRequesterContext();
   // const [data, setData] = useState(null);

   const globalFilterFields = ["employee_code", "username", "email", "cellphone", "department"];

   const handleClickAdd = async () => {
      try {
         await resetVoucherRequester();
         await resetFormData();
         formikRef.current.setValues(formikRef.current.initialValues);
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickView = async (obj) => {
      try {
         setLoadingAction(true);
         const res = await getInfoEmployee("employee_code", obj.employee_code);
         setVoucherRequester(res.result);
         await sleep(500);
         // console.log("🚀 ~ handleClickView ~ voucherRequester:", voucherRequester);
         // setData(voucherRequester);
         setOpenCardInfo(true);
         setLoadingAction(false);
      } catch (error) {
         setLoadingAction(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showVoucherRequester(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         setLoadingAction(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, name, active) => {
      try {
         setTimeout(async () => {
            const axiosResponse = await disEnableUser(id, !active);
            Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            getVoucherRequesters();
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
      <>
         <EmployeeDataTableBase
            data={voucherRequesters}
            globalFilterFields={globalFilterFields}
            singularName={singularName}
            handleClickAdd={handleClickAdd}
            refreshTable={getVoucherRequesters}
            btnAdd={auth.permissions.create}
            handleClickEdit={handleClickEdit}
            showViewButton={true}
            handleClickView={handleClickView}
            showActiveToggle={true}
            showDeleteButton={false}
            activeTogglePermission={
               auth.permissions.more_permissions?.includes("Activar y Desactivar Solicitador de Vales") || auth.permissions.more_permissions?.includes("todas")
            }
            handleClickDisEnable={handleClickDisEnable}
         />
         {openCardInfo && <EmployeeCardInfo />}
      </>
   );
};
export default VoucherRequesterDT;
