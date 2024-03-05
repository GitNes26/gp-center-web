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

import { useVoucherContext } from "../../../context/VoucherContext";
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

const VoucherDT = ({ setOpen }) => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, voucher, vouchers, getVouchers, showVoucher, deleteVoucher, resetFormData, resetVoucher, setTextBtnSumbit, setFormTitle } =
      useVoucherContext();
   const globalFilterFields = ["id", "payroll_number", "username", "email", "phone", "license_number", "department"];

   // #region BodysTemplate
   const AvatarBodyTemplate = (obj) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
         <Avatar sx={{ width: 56, height: 56 }} src={obj.avatar !== null ? `${import.meta.env.VITE_HOST}/${obj.avatar}` : ""} alt={obj.full_name} />
      </Box>
      // <Box textAlign={"center"}>{<img alt="Foto de Perfil" src={`${import.meta.env.VITE_HOST}/${obj.avatar}`} style={{ maxWidth: 100, maxHeight: 100 }} />}</Box>
   );
   const IdBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"bolder"}>
         {obj.id}
      </Typography>
   );
   const FoliatedVouchersBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"bolder"}>
         {obj.foliated_vouchers}
      </Typography>
   );
   const StockNumberBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"normal"}>
         N° Económico: <b>{obj.stock_number}</b> <br />
         Placas: <b>{obj.vehicle_plates}</b>
      </Typography>
   );
   const ApplicantBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"normal"}>
         N° Nómina: <b>{obj.payroll_number}</b> <br />
         Nombre:
         <b>
            {obj.name} {obj.paternal_last_name} {obj.maternal_last_name}
         </b>
      </Typography>
   );
   const VoucherBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.username}</Typography>;
   const PhoneBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatPhone(obj.phone)}</Typography>;
   const DepartmentBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.department}</Typography>;
   const ActivityBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.activity}</Typography>;
   const QuantityBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.quantity}</Typography>;
   // const RoleBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.role}</Typography>;
   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );

   // #endregion BodysTemplate

   const columns = [
      // { field: "avatar", header: "Foto", sortable: true, functionEdit: null, body: AvatarBodyTemplate, filterField: null },
      { field: "id", header: "ID", sortable: true, functionEdit: null, body: IdBodyTemplate, filterField: null },
      { field: "foliated_vouchers", header: "Vales Foliados", sortable: true, functionEdit: null, body: FoliatedVouchersBodyTemplate, filterField: null },
      { field: "stock_number", header: "Vehículo", sortable: true, functionEdit: null, body: StockNumberBodyTemplate, filterField: null },

      { field: "payroll_number", header: "Solicitante", sortable: true, functionEdit: null, body: ApplicantBodyTemplate, filterField: null },
      { field: "phone", header: "Teléfono", sortable: true, functionEdit: null, body: PhoneBodyTemplate, filterField: null },
      { field: "department", header: "Departamento", sortable: true, functionEdit: null, body: DepartmentBodyTemplate, filterField: null },
      { field: "activity", header: "Actividad", sortable: true, functionEdit: null, body: ActivityBodyTemplate, filterField: null },
      { field: "quantity", header: "Cantidad de vales", sortable: true, functionEdit: null, body: QuantityBodyTemplate, filterField: null },
      // { field: "role", header: "Rol", sortable: true, functionEdit: null, body: RoleBodyTemplate, filterField: null },
      { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetVoucher();
         voucher.role = "Selecciona una opción...";
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
         await showVoucher(id);
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
               const axiosResponse = await deleteVoucher(id);
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
         // console.log("cargar listado", vouchers);
         await vouchers.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} user_id={obj.user_id} name={obj.username} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(vouchers[0]));
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
         refreshTable={getVouchers}
         btnAdd={auth.permissions.create}
         titleBtnAdd="SOLICITAR VALE"
         setOpen={setOpen}
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
export default VoucherDT;
