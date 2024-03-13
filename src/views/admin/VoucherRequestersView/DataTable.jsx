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

import { useVoucherRequesterContext } from "../../../context/VoucherRequesterContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import { useAuthContext } from "../../../context/AuthContext";
import { formatPhone } from "../../../utils/Formats";

const VoucherRequesterDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      pluralName,
      voucherRequester,
      voucherRequesters,
      getVoucherRequesters,
      showVoucherRequester,
      deleteVoucherRequester,
      resetFormData,
      resetVoucherRequester,
      setTextBtnSumbit,
      setFormTitle
   } = useVoucherRequesterContext();
   const globalFilterFields = ["payroll_number", "username", "email", "phone", "department"];

   // #region BodysTemplate
   const AvatarBodyTemplate = (obj) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
         <Avatar sx={{ width: 56, height: 56 }} src={obj.avatar !== null ? `${import.meta.env.VITE_HOST}/${obj.avatar}` : ""} alt={obj.full_name} />
      </Box>
      // <Box textAlign={"center"}>{<img alt="Foto de Perfil" src={`${import.meta.env.VITE_HOST}/${obj.avatar}`} style={{ maxWidth: 100, maxHeight: 100 }} />}</Box>
   );
   const PayRollBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"bolder"}>
         {obj.payroll_number}
      </Typography>
   );
   const VoucherRequesterBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.username}</Typography>;
   const EmailBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.email}</Typography>;
   const PhoneBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatPhone(obj.phone)}</Typography>;
   const DepartmentBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.department}</Typography>;
   // const RoleBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.role}</Typography>;
   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );

   // #endregion BodysTemplate

   const columns = [
      { field: "avatar", header: "Foto", sortable: true, functionEdit: null, body: AvatarBodyTemplate, filterField: null },
      { field: "payroll_number", header: "No. Nómina", sortable: true, functionEdit: null, body: PayRollBodyTemplate, filterField: null },
      { field: "username", header: "Usuario", sortable: true, functionEdit: null, body: VoucherRequesterBodyTemplate, filterField: null },
      { field: "email", header: "Correo", sortable: true, functionEdit: null, body: EmailBodyTemplate, filterField: null },
      { field: "phone", header: "Teléfono", sortable: true, functionEdit: null, body: PhoneBodyTemplate, filterField: null },
      { field: "department", header: "Departamento", sortable: true, functionEdit: null, body: DepartmentBodyTemplate, filterField: null },
      // { field: "role", header: "Rol", sortable: true, functionEdit: null, body: RoleBodyTemplate, filterField: null },
      { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetVoucherRequester();
         voucherRequester.role = "Selecciona una opción...";
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
         await showVoucherRequester(id);
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
               const axiosResponse = await deleteVoucherRequester(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const ButtonsAction = ({ id, user_id, name }) => {
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
                  <Button color="error" onClick={() => handleClickDelete(user_id, name)}>
                     <IconDelete />
                  </Button>
               </Tooltip>
            )}
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", voucherRequesters);
         await voucherRequesters.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} user_id={obj.user_id} name={obj.username} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(voucherRequesters[0]));
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
         refreshTable={getVoucherRequesters}
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
export default VoucherRequesterDT;
