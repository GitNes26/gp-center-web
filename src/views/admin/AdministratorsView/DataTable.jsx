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

import { useAdministratorContext } from "../../../context/AdministratorContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { formatDatetime, formatPhone } from "../../../utils/Formats";
import { useAuthContext } from "../../../context/AuthContext";
import SwitchComponent from "../../../components/SwitchComponent";

const AdministratorDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      administrator,
      administrators,
      getAdministrators,
      showAdministrator,
      deleteAdministrator,
      disEnableAdministrator,
      resetFormData,
      resetAdministrator,
      setTextBtnSumbit,
      setFormTitle
   } = useAdministratorContext();
   const globalFilterFields = ["username", "email", "phone", "role", "active", "created_at"];

   // #region BodysTemplate
   const AdministratorBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.username}</Typography>;
   const EmailBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.email}</Typography>;
   // const PhoneBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatPhone(obj.phone)}</Typography>;
   // const InfoBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.}</Typography>;
   const RoleBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.role}</Typography>;
   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );
   const CreatedAtBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.created_at, true)}</Typography>;

   // #endregion BodysTemplate

   const columns = [
      { field: "username", header: "Usuario", sortable: true, functionEdit: null, body: AdministratorBodyTemplate, filter: true, filterField: null },
      { field: "email", header: "Correo", sortable: true, functionEdit: null, body: EmailBodyTemplate, filter: true, filterField: null },
      // { field: "phone", header: "Teléfono", sortable: true, functionEdit: null, body: PhoneBodyTemplate, filter: true, filterField: null },
      { field: "role", header: "Rol", sortable: true, functionEdit: null, body: RoleBodyTemplate, filter: true, filterField: null }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filter: true, filterField: null },
         { field: "created_at", header: "Miembro desde", sortable: true, functionEdit: null, body: CreatedAtBodyTemplate, filter: true, filterField: null }
      );

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetAdministrator();
         // administrator.role = "Selecciona una opción...";
         resetFormData();
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
         await showAdministrator(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name, active) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteAdministrator(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, name, active) => {
      try {
         let axiosResponse;
         setTimeout(async () => {
            axiosResponse = await disEnableAdministrator(id, !active);
            Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         }, 500);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const ButtonsAction = ({ id, name, active }) => {
      return (
         <ButtonGroup variant="outlined">
            {auth.permissions.update && (
               <Tooltip title={`Editar ${singularName}`} placement="top">
                  <Button color="info" onClick={() => handleClickEdit(id)}>
                     <IconEdit />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.delete && (
               <Tooltip title={`Eliminar ${singularName}`} placement="top">
                  <Button color="error" onClick={() => handleClickDelete(id, name, active)}>
                     <IconDelete />
                  </Button>
               </Tooltip>
            )}
            {auth.role_id == ROLE_SUPER_ADMIN && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)} sx={{}}>
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
         // console.log("cargar listado", administrators);
         await administrators.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.username} active={obj.active} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(administrators[0]));
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
      <DataTableComponent
         columns={columns}
         data={data}
         globalFilterFields={globalFilterFields}
         headerFilters={false}
         handleClickAdd={handleClickAdd}
         rowEdit={false}
         refreshTable={getAdministrators}
      />
   );
};
export default AdministratorDT;
