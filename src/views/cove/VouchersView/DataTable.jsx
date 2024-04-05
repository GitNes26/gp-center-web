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
import { ROLE_ADMIN_VOUCHER, ROLE_VOUCHER_SUPERVISOR, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import { useAuthContext } from "../../../context/AuthContext";
import { formatDatetime, formatDatetimeToSQL, formatPhone } from "../../../utils/Formats";
import { IconProgressCheck } from "@tabler/icons-react";
import { IconBan, IconCheckbox, IconEye, IconFileInvoice, IconTicket } from "@tabler/icons";
import ModalCancelComments from "./ModalCancelComments";
import { useVoucherDetailContext } from "../../../context/VoucherDetailContext";

const VoucherDT = ({ setOpen, setOpenModalRequest, setOpenModalCancel }) => {
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
      seenVoucher,
      updateStatus
   } = useVoucherContext();
   const { getIndexByVoucher, voucherId, setVoucherId, resetVoucherDetails } = useVoucherDetailContext();
   const globalFilterFields = [
      "id",
      "internal_folio",
      "letter_folio",
      "foliated_vouchers",
      // "vehicle",
      // "vehicle_plates",
      // "payroll_number",
      // "name",
      // "paternal_last_name",
      // "maternal_last_name",
      "requested_fullname",
      "requested_department",
      "requested_payroll_number",
      "requested_phone",
      "activity",
      // "requested_amount",
      "voucher_status",
      "approved_amount",
      "approved_by",
      "username_approved",
      "approved_at",
      "canceled_by",
      "username_canceled",
      "canceled_at",
      "canceled_comments",
      "created_at",
      "creditor_fullname",
      "username_viewed",
      "viewed_by",
      "viewed_at"
   ];

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
   const InternalFolioBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"bolder"}>
         {obj.internal_folio}
      </Typography>
   );
   const FoliatedVouchersBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"bolder"}>
         {obj.letter_folio} {obj.foliated_vouchers}
      </Typography>
   );
   const StockNumberBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"normal"}>
         <b>{obj.vehicle ?? "---"}</b> <br />
         Placas: <b>{obj.vehicle_plates}</b>
      </Typography>
   );
   const RequestedByBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"normal"}>
         N° Nómina: <b>{obj.requested_payroll_number}</b> <br />
         Nombre: <b>{obj.requested_fullname}</b> <br />
         Tel: <b>{obj.requested_phone && formatPhone(obj.requested_phone)}</b>
      </Typography>
   );
   const DepartmentBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.requested_department}</Typography>;
   const ActivityBodyTemplate = (obj) => <Typography textAlign={"center"}>{`${obj.activity.slice(0, 100)}...`}</Typography>;
   const RequestAmountBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"bolder"}>
         {obj.requested_amount}
      </Typography>
   );
   const RequestDateBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.created_at, true)}</Typography>;
   const AprovedBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         Cantidad: <b>{obj.approved_amount ?? 0}</b> <br />
         Por: <b>{obj.username_approved ?? "-"}</b> <br />
         El: <b>{formatDatetime(obj.approved_at, true)}</b>
      </Typography>
   );
   const CanceledBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         Por: <b>{obj.username_canceled ?? "-"}</b> <br />
         El: <b>{formatDatetime(obj.canceled_at, true)}</b>
         <p>{obj.canceled_comments}</p>
      </Typography>
   );
   const ViewedBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         Por: <b>{obj.username_viewed ?? "-"}</b> <br />
         El: <b>{formatDatetime(obj.viewed_at, true)}</b>
      </Typography>
   );
   const StatusBodyTemplate = (obj) => {
      const bgColor =
         obj.voucher_status === "CREADO"
            ? "gray"
            : obj.voucher_status === "ALTA"
            ? "blue"
            : obj.voucher_status === "VoBo"
            ? "#50897A"
            : obj.voucher_status === "APROBADA"
            ? "green"
            : "red"; //red CANCELADO
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
      { field: "id", header: "Folio", sortable: true, functionEdit: null, body: IdBodyTemplate, filterField: null },
      { field: "internal_folio", header: "Folio Interno", sortable: true, functionEdit: null, body: InternalFolioBodyTemplate, filterField: null },

      { field: "requested_fullname", header: "Solicitante", sortable: true, functionEdit: null, body: RequestedByBodyTemplate, filterField: null },
      { field: "department", header: "Departamento", sortable: true, functionEdit: null, body: DepartmentBodyTemplate, filterField: null },
      { field: "activity", header: "Actividad", sortable: true, functionEdit: null, body: ActivityBodyTemplate, filterField: null },
      // { field: "vehicle", header: "Vehículo", sortable: true, functionEdit: null, body: StockNumberBodyTemplate, filterField: null },
      // { field: "requested_amount", header: "Cantidad Solicitada", sortable: true, functionEdit: null, body: RequestAmountBodyTemplate, filterField: null },
      { field: "created_at", header: "Solicitado", sortable: true, functionEdit: null, body: RequestDateBodyTemplate, filterField: null },
      { field: "foliated_vouchers", header: "Vales Foliados", sortable: true, functionEdit: null, body: FoliatedVouchersBodyTemplate, filterField: null },
      { field: "approved_amount", header: "Aprobados", sortable: true, functionEdit: null, body: AprovedBodyTemplate, filterField: null },
      { field: "canceled_amount", header: "Cancelado", sortable: true, functionEdit: null, body: CanceledBodyTemplate, filterField: null },
      { field: "viewed_by", header: "Visto", sortable: true, functionEdit: null, body: ViewedBodyTemplate, filterField: null },

      { field: "voucher_status", header: "Estatus", sortable: true, functionEdit: null, body: StatusBodyTemplate, filterField: null },
      { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetVoucher();
         resetFormData();
         resetVoucherDetails();
         setVoucherId(0);
         setOpenDialog(true);
         setInAprobation(false);
         setTimeout(() => {
            setInAprobation(false);
            setOpen(true);
         }, 500);
         setTextBtnSumbit("CREAR VALE");
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
         setVoucherId(id);
         await showVoucher(id);
         await getIndexByVoucher(id);
         setInAprobation(true);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickVoBo = async (obj) => {
      try {
         setLoadingAction(true);
         // console.log(obj);
         if (obj.vobo_by < 1) {
            const data = {
               id: obj.id,
               voucher_status: "VoBo",
               vobo_by: auth.id,
               vobo_at: formatDatetimeToSQL(new Date())
            };
            // console.log(data);
            await updateStatus(data);
         }
         setInAprobation(false);
         setInEdit(false);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickGenerateVocuher = async (id, obj) => {
      try {
         await setVoucher(obj);
         await getIndexByVoucher(obj.id);
         setOpenModalRequest(true);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickShow = async (id, obj) => {
      try {
         setInAprobation(false);
         if (auth.role_id === ROLE_VOUCHER_SUPERVISOR && obj.viewed_by < 1) {
            // console.log("checar visto");
            const data = {
               id: obj.id,
               viewed_by: auth.id,
               viewed_at: formatDatetimeToSQL(new Date())
            };
            // console.log("checar visto->data", data);

            await seenVoucher(data);
         }
         await setVoucher(obj);
         await getIndexByVoucher(obj.id);
         setOpenModalRequest(true);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickCancel = async (id, obj) => {
      try {
         setInAprobation(false);
         await setVoucher(obj);
         if (auth.role_id === ROLE_VOUCHER_SUPERVISOR) {
            mySwal.fire(QuestionAlertConfig(`Estas seguro de CANCELAR el vale #${id}`, "CANCELAR", "NO CANCELAR")).then(async (result) => {
               if (result.isConfirmed) {
                  setLoadingAction(true);

                  // return console.log(formData);
                  const axiosResponse = await updateStatus({
                     id: id,
                     voucher_status: "CANCELADA",
                     canceled_by: auth.id,
                     canceled_comments: "VoBo Rechazado.",
                     canceled_at: formatDatetimeToSQL(new Date())
                  });
                  setLoadingAction(false);
                  Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
               }
            });
         } else setOpenModalCancel(true);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEditCREADO = async (id) => {
      try {
         setLoadingAction(true);
         setInAprobation(false);
         setTextBtnSumbit("FINALIZAR VALE");
         setFormTitle(`FINALIZAR ${singularName.toUpperCase()}`);
         // setInEdit(true);
         setVoucherId(id);
         await showVoucher(id);
         await getIndexByVoucher(id);
         setOpenDialog(true);
         setLoadingAction(false);
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
         await getIndexByVoucher(id);
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
            <Tooltip title={`Ver Oficio #${id}`} placement="top">
               <Button color="dark" onClick={() => handleClickShow(id, obj)}>
                  <IconEye />
               </Button>
            </Tooltip>
            {obj.voucher_status === "CREADO" && auth.role_id != ROLE_VOUCHER_SUPERVISOR && (
               <Tooltip title={`Finalizar ${singularName}`} placement="top">
                  <Button color="dark" onClick={() => handleClickEditCREADO(id)}>
                     <IconEdit />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.more_permissions.includes("24@VoBo") && obj.voucher_status === "ALTA" && (
               <Tooltip title={`Dar Visto Bueno al ${singularName} #${id}`} placement="top">
                  <Button color="error" onClick={() => handleClickVoBo(obj)}>
                     <IconCheckbox />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.more_permissions.includes("24@Aprobar Vale") && obj.voucher_status === "VoBo" && (
               <Tooltip title={`Asignar y Aprobar ${singularName}`} placement="top">
                  <Button color="secondary" onClick={() => handleClickAssign(id)}>
                     <IconProgressCheck />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.more_permissions.includes("24@Generar Vale") && obj.voucher_status === "APROBADA" && (
               <Tooltip title={`Generar Formato de Recepción de ${singularName}`} placement="top">
                  <Button color="secondary" onClick={() => handleClickGenerateVocuher(id)}>
                     <IconFileInvoice />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.more_permissions.includes("24@Cancelar Vale") && !["APROBADA", "CANCELADA"].includes(obj.voucher_status) && (
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
         await vouchers.map(async (obj, index) => {
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
         {/* <VoucherContextProvider>
         </VoucherContextProvider> */}
      </>
   );
};
export default VoucherDT;
