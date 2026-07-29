import { Fragment, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, Tooltip, Typography } from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";
import IconDelete from "../../../components/icons/IconDelete";

import { useEmployeeContext } from "../../../context/EmployeeContext";
import EmployeeCardInfo from "./CardInfo";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { IconEye } from "@tabler/icons";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import { useAuthContext } from "../../../context/AuthContext";
import { formatPhone, sleep } from "../../../utils/Formats";
import { setObjImg } from "../../../components/Form/FormikComponents";
import SwitchComponent from "../../../components/SwitchComponent";

const EmployeeDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog, openCardInfo, setOpenCardInfo } = useGlobalContext();
   const {
      singularName,
      pluralName,
      employee,
      employees,
      getEmployees,
      showEmployee,
      deleteEmployee,
      disEnableEmployee,
      resetFormData,
      resetEmployee,
      setTextBtnSumbit,
      setFormTitle,
      formData,
      formikRef,
      getInfoEmployee
   } = useEmployeeContext();
   const globalFilterFields = ["employee_code", "full_name", "full_name_reverse", "cellphone", "license_number", "department_name"];

   // #region BodysTemplate
   const AvatarBodyTemplate = (obj) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
         <Avatar sx={{ width: 56, height: 56 }} src={obj.avatar !== null ? `${import.meta.env.VITE_API_GPC_ASSETS}/${obj.avatar}` : ""} alt={obj.full_name} />
      </Box>
      // <Box textAlign={"center"}>{<img alt="Foto de Perfil" src={`${import.meta.env.VITE_HOST}/${obj.avatar}`} style={{ maxWidth: 100, maxHeight: 100 }} />}</Box>
   );
   const PayRollBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"bolder"}>
         {obj.employee_code}
      </Typography>
   );
   const EmployeeBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.full_name}</Typography>;
   const DepartmentBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.department_name}</Typography>;
   const PhoneBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatPhone(obj.cellphone)}</Typography>;
   const LicenseBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.license_number}</Typography>;
   // const RoleBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.role}</Typography>;
   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );

   // #endregion BodysTemplate

   const columns = [
      { field: "avatar", header: "Foto", sortable: true, functionEdit: null, body: AvatarBodyTemplate, filter: false, filterField: null },
      { field: "employee_code", header: "No. Nómina", sortable: true, functionEdit: null, body: PayRollBodyTemplate, filter: true, filterField: null },
      { field: "full_name", header: "Nombre", sortable: true, functionEdit: null, body: EmployeeBodyTemplate, filter: true, filterField: null },
      { field: "department_name", header: "Departamento", sortable: true, functionEdit: null, body: DepartmentBodyTemplate, filter: true, filterField: null },
      { field: "cellphone", header: "Teléfono", sortable: true, functionEdit: null, body: PhoneBodyTemplate, filter: true, filterField: null },
      { field: "license_number", header: "No. Licencia", sortable: true, functionEdit: null, body: LicenseBodyTemplate, filter: true, filterField: null },
      // { field: "role", header: "Rol", sortable: true, functionEdit: null, body: RoleBodyTemplate, filter: true, filterField: null },
      { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filter: false, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetEmployee();
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
         const res = await showEmployee(id);
         console.log("🚀 ~ handleClickEdit ~ res:", res);
         formikRef.current.setValues(res.result);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         setLoadingAction(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         // CONSULTAR SI TIENEN UNA ASIGANACIÓN ACTIVA

         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteEmployee(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const handleClickDeleteMultipleContinue = async (selectedData) => {
      try {
         let ids = selectedData.map((d) => d.id);
         // if (ids.length < 1) console.log("no hay registros");
         let msg = `¿Estas seguro de eliminar `;
         if (selectedData.length === 1) msg += `a: ${selectedData[0].full_name}?`;
         else if (selectedData.length > 1) msg += `los siguientes usuarios: ${selectedData.map((d) => d.full_name)}?`;
         mySwal.fire(QuestionAlertConfig(msg)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteMultiple(ids);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, active) => {
      try {
         let axiosResponse;
         setTimeout(async () => {
            axiosResponse = await disEnableEmployee(id, !active);
            Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         }, 500);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickView = async (obj) => {
      try {
         setLoadingAction(true);
         const res = await getInfoEmployee("employee_code", obj.employee_code);
         setOpenCardInfo(true);
         await sleep(500);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const ButtonsAction = ({ id, name, active, obj }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Ver ${singularName}`} placement="top">
               <Button color="dark" onClick={() => handleClickView(obj)}>
                  <IconEye />
               </Button>
            </Tooltip>
            {auth.permissions.update && (
               <Tooltip title={`Editar ${singularName}`} placement="top">
                  <Button color="info" onClick={() => handleClickEdit(id)}>
                     <IconEdit />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.delete && (
               <Tooltip title={`Eliminar ${singularName}`} placement="top">
                  <Button color="error" onClick={() => handleClickDelete(id, name)}>
                     <IconDelete />
                  </Button>
               </Tooltip>
            )}
            {auth.role_id == ROLE_SUPER_ADMIN && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, active)} sx={{}}>
                     <SwitchComponent checked={active} />
                  </Button>
               </Tooltip>
            )}
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", employees);
         await employees.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.full_name} active={obj.active} obj={obj} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(employees[0]));
         // console.log("la data del formatData", globalFilterFields);
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   useEffect(() => {
      setLoading(false);
   }, []);
   return (
      <>
         <DataTableComponent
            columns={columns}
            data={data}
            globalFilterFields={globalFilterFields}
            headerFilters={true}
            handleClickAdd={handleClickAdd}
            refreshTable={getEmployees}
            btnAdd={auth.permissions.create}
            showGridlines={false}
            btnsExport={true}
            rowEdit={false}
            // handleClickDeleteContinue={handleClickDeleteContinue}
            // ELIMINAR MULTIPLES REGISTROS
            btnDeleteMultiple={false}
            // handleClickDeleteMultipleContinue={handleClickDeleteMultipleContinue}
            // PARA HACER FORMULARIO EN LA TABLA
            // AGREGAR
            // createData={createVehicle}
            // newRow={newRow}
            // EDITAR
            // setData={setVehicles}
            // updateData={updateVehicle}
         />
         {openCardInfo && <EmployeeCardInfo />}
      </>
   );
};
export default EmployeeDT;
