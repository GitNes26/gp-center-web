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

import { useMechanicContext } from "../../../context/MechanicContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import { useAuthContext } from "../../../context/AuthContext";
import { formatPhone } from "../../../utils/Formats";
import SwitchComponent from "../../../components/SwitchComponent";

const MechanicDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, mechanics, getMechanics, showMechanic, deleteMechanic, disEnableMechanic, resetFormData, resetMechanic, setTextBtnSumbit, setFormTitle } =
      useMechanicContext();
   const globalFilterFields = ["payroll_number", "full_name", "email", "phone"];

   // #region BodysTemplate
   const AvatarBodyTemplate = (obj) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
         <Avatar sx={{ width: 56, height: 56 }} src={obj.avatar !== null ? `${import.meta.env.VITE_HOST}/${obj.avatar}` : ""} alt={obj.full_name} />
      </Box>
      // <Box textAlign={"center"}>{<img alt="Foto de Perfil" src={`${import.meta.env.VITE_HOST}/${obj.avatar}`} style={{ maxWidth: 100, maxHeight: 100 }} />}</Box>
   );
   const PayRollBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"bolder"}>
         {obj.payroll_number ?? "No asignado"}
      </Typography>
   );
   const MechanicBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.full_name}</Typography>;
   const EmailBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.email}</Typography>;
   const PhoneBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatPhone(obj.phone)}</Typography>;
   // const RoleBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.role}</Typography>;
   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );

   // #endregion BodysTemplate

   const columns = [
      { field: "avatar", header: "Foto", sortable: true, functionEdit: null, body: AvatarBodyTemplate, filter: false, filterField: null },
      { field: "payroll_number", header: "No. Nómina", sortable: true, functionEdit: null, body: PayRollBodyTemplate, filter: true, filterField: null },
      { field: "name_full", header: "Nombre", sortable: true, functionEdit: null, body: MechanicBodyTemplate, filter: true, filterField: null },
      { field: "email", header: "Correo", sortable: true, functionEdit: null, body: EmailBodyTemplate, filter: true, filterField: null },
      { field: "phone", header: "Teléfono", sortable: true, functionEdit: null, body: PhoneBodyTemplate, filter: true, filterField: null },
      // { field: "role", header: "Rol", sortable: true, functionEdit: null, body: RoleBodyTemplate, filter: true, filterField: null },
      { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filter: false, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetMechanic();
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
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteMechanic(id);
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
            axiosResponse = await disEnableMechanic(id, !active);
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
                  <Button color="error" onClick={() => handleClickDelete(id, name)}>
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
         // console.log("cargar listado", mechanics);
         await mechanics.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.full_name} active={obj.active} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(mechanics[0]));
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
         headerFilters={true}
         handleClickAdd={handleClickAdd}
         refreshTable={getMechanics}
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
   );
};
export default MechanicDT;
