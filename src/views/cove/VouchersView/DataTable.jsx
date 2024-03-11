import { Fragment, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, Chip, Tooltip, Typography } from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";
import IconDelete from "../../../components/icons/IconDelete";

import VoucherContextProvider, { useVoucherContext } from "../../../context/VoucherContext";
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
import { formatDatetime, formatDatetimeToSQL, formatPhone } from "../../../utils/Formats";
import { IconProgressCheck } from "@tabler/icons-react";
import { IconBan } from "@tabler/icons";
import ModalCancelComments from "./ModalCancelComments";

const VoucherDT = ({ setOpen }) => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      pluralName,
      formData,
      setFormData,
      voucher,
      setVoucher,
      vouchers,
      getVouchers,
      showVoucher,
      deleteVoucher,
      resetFormData,
      resetVoucher,
      setTextBtnSumbit,
      setFormTitle,
      setInAprobation,
      setInEdit,
      updateStatus
   } = useVoucherContext();
   const globalFilterFields = [
      "id",
      "foliated_vouchers",
      "vehicle",
      "vehicle_plates",
      "payroll_number",
      "name",
      "paternal_last_name",
      "maternal_last_name",
      "phone",
      "department",
      "activity",
      "requested_amount",
      "voucher_status",
      "approved_amount",
      "approved_by",
      "username_approved",
      "approved_at"
   ];
   const [openModalCancel, setOpenModalCancel] = useState(false);

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
         <b>{obj.vehicle ?? "---"}</b> <br />
         Placas: <b>{obj.vehicle_plates}</b>
      </Typography>
   );
   const RequestedByBodyTemplate = (obj) => {
      const full_name = `${obj.name} ${obj.paternal_last_name} ${obj.maternal_last_name}`;
      return (
         <Typography textAlign={"center"} fontWeight={"normal"}>
            N° Nómina: <b>{obj.payroll_number}</b> <br />
            Nombre: <b>{full_name}</b> <br />
            Tel: <b>{formatPhone(obj.phone)}</b>
         </Typography>
      );
   };
   const DepartmentBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.department}</Typography>;
   const ActivityBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.activity}</Typography>;
   const RequestAmountBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.requested_amount}</Typography>;
   const AprovedAmountBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         Cantidad: <b>{obj.approved_amount ?? 0}</b> <br />
         Por: <b>{obj.username_approved ?? "-"}</b> <br />
         El: <b>{formatDatetime(obj.approved_at, true)}</b>
      </Typography>
   );
   const StatusBodyTemplate = (obj) => {
      const bgColor = obj.voucher_status === "ALTA" ? "blue" : obj.voucher_status === "APROBADA" ? "green" : "red"; //red CANCELADO
      return (
         <Box textAlign={"center"}>
            <Chip
               sx={{
                  height: "25px",
                  "& .MuiChip-label": {
                     display: "block",
                     whiteSpace: "normal"
                  },
                  // borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bolder",
                  color: "#F3F3F3",
                  backgroundColor: bgColor
               }}
               label={obj.voucher_status}
            />
         </Box>
      );
   };
   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );

   // #endregion BodysTemplate

   const columns = [
      // { field: "avatar", header: "Foto", sortable: true, functionEdit: null, body: AvatarBodyTemplate, filterField: null },
      { field: "id", header: "ID", sortable: true, functionEdit: null, body: IdBodyTemplate, filterField: null },
      { field: "vehicle", header: "Vehículo", sortable: true, functionEdit: null, body: StockNumberBodyTemplate, filterField: null },

      { field: "payroll_number", header: "Solicitante", sortable: true, functionEdit: null, body: RequestedByBodyTemplate, filterField: null },
      { field: "department", header: "Departamento", sortable: true, functionEdit: null, body: DepartmentBodyTemplate, filterField: null },
      { field: "activity", header: "Actividad", sortable: true, functionEdit: null, body: ActivityBodyTemplate, filterField: null },
      { field: "requested_amount", header: "Cantidad Solicitada", sortable: true, functionEdit: null, body: RequestAmountBodyTemplate, filterField: null },
      { field: "approved_amount", header: "Aprobados", sortable: true, functionEdit: null, body: AprovedAmountBodyTemplate, filterField: null },
      { field: "foliated_vouchers", header: "Vales Foliados", sortable: true, functionEdit: null, body: FoliatedVouchersBodyTemplate, filterField: null },
      { field: "voucher_status", header: "Estatus", sortable: true, functionEdit: null, body: StatusBodyTemplate, filterField: null },
      { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetVoucher();
         resetFormData();
         setOpenDialog(true);
         setInAprobation(false);
         setTimeout(() => {
            setInAprobation(false);
            setOpen(true);
         }, 500);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickAssign = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("APROBAR");
         setFormTitle(`ASIGNAR FOLIOS Y APROBAR ${singularName.toUpperCase()}`);
         await showVoucher(id);
         setInAprobation(true);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickCancel = async (id, obj) => {
      try {
         await setVoucher(obj);
         setOpenModalCancel(true);
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
         setInEdit(true);
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
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar el vale #${name}`)).then(async (result) => {
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

   const ButtonsAction = ({ id, user_id, name, obj }) => {
      return (
         <ButtonGroup variant="outlined">
            {auth.permissions.more_permissions.includes("22@Aprobar") && obj.voucher_status === "ALTA" && (
               <Tooltip title={`Asignar y Aprobar ${singularName}`} placement="top">
                  <Button color="dark" onClick={() => handleClickAssign(id)}>
                     <IconProgressCheck />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.more_permissions.includes("22@Cancelar") && obj.voucher_status === "ALTA" && (
               <Tooltip title={`Cancelar ${singularName}`} placement="top">
                  <Button color="error" onClick={() => handleClickCancel(id, obj)}>
                     <IconBan />
                  </Button>
               </Tooltip>
            )}
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
            register.actions = <ButtonsAction id={obj.id} user_id={obj.user_id} name={obj.id} obj={obj} />;
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
   }, [voucher]);
   return (
      <>
         <DataTableComponent
            columns={columns}
            data={data}
            globalFilterFields={globalFilterFields}
            headerFilters={false}
            handleClickAdd={handleClickAdd}
            refreshTable={getVouchers}
            btnAdd={auth.permissions.create}
            titleBtnAdd="SOLICITAR VALE"
            setOpen={false}
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
         <VoucherContextProvider>
            <ModalCancelComments open={openModalCancel} setOpen={setOpenModalCancel} />
         </VoucherContextProvider>
      </>
   );
};
export default VoucherDT;
