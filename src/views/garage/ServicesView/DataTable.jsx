import { useEffect, useState } from "react";
import { Button, ButtonGroup, Tooltip, Typography } from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";
import IconDelete from "../../../components/icons/IconDelete";

import { useServiceContext } from "../../../context/ServiceContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled, IconSettingsSearch, IconSquareRoundedCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { formatDatetime, formatPhone, includesInArray } from "../../../utils/Formats";
import { useAuthContext } from "../../../context/AuthContext";
import { IconEye, IconThumbDown } from "@tabler/icons";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { IconThumbUpFilled } from "@tabler/icons-react";
import { useParams } from "react-router-dom";

const ServiceDT = ({ openService, setOpenService, setShowActionButtons }) => {
   const { status } = useParams();
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      services,
      setService,
      getServices,
      showService,
      deleteService,
      formData,
      resetFormData,
      setTextBtnSumbit,
      setFormTitle,
      formikRef,
      changeStatus
   } = useServiceContext();
   const globalFilterFields = ["folio", "stock_number", "contact_name", "contact_phone", "pre_diagnosis", "status"];
   // const [openService, setOpenService] = useState(false);
   const [objService, setObjService] = useState(null);

   // #region BodysTemplate
   const FolioBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         #{obj.folio}
      </Typography>
   );
   const StockNumberBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.stock_number}
      </Typography>
   );
   const ContactBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.contact_name} - {formatPhone(obj.contact_phone)}
      </Typography>
   );
   const PreDiagnosisBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.pre_diagnosis}</Typography>;
   const StatusBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.status}
      </Typography>
   );
   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );
   const CreatedAtBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.created_at, true)}</Typography>;
   // #endregion BodysTemplate

   const columns = [
      { field: "folio", header: "Folio", sortable: true, functionEdit: null, body: FolioBodyTemplate, filter: true, filterField: null },
      { field: "stock_number", header: "N° Económico", sortable: true, functionEdit: null, body: StockNumberBodyTemplate, filter: true, filterField: null },
      { field: "contact_name", header: "Contacto", sortable: true, functionEdit: null, body: ContactBodyTemplate, filter: true, filterField: null },
      { field: "pre_diagnosis", header: "Pre Diagnóstico", sortable: true, functionEdit: null, body: PreDiagnosisBodyTemplate, filter: true, filterField: null },
      { field: "status", header: "Estatus", sortable: true, functionEdit: null, body: StatusBodyTemplate, filter: true, filterField: null }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filterField: null },
         { field: "created_at", header: "Fecha de registro", sortable: true, functionEdit: null, body: CreatedAtBodyTemplate, filterField: null }
      );

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetFormData();
         formikRef.current.resetForm();
         setOpenDialog(true);
         setOpenService(true);
         // console.log("klasdklasdl");
         setTextBtnSumbit("SOLICITAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         setOpenDialog(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         const axiosResponse = await showService(id);

         if (formData.description) formData.description == null && (formData.description = "");
         formikRef.current.setValues(axiosResponse.result);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         setOpenDialog(false);
         setLoadingAction(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, folio) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar la Solicitud de Servicio con folio #${folio}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteService(id, status);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   // const handleClickDisEnable = async (id, name, active) => {
   //    try {
   //       let axiosResponse;
   //       setTimeout(async () => {
   //          axiosResponse = await DisEnableUser(id, !active);
   //          Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
   //       }, 500);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //    }
   // };

   const handleClickShowRequest = (id, folio, obj) => {
      Toast.Info("Solicitud: Folio " + folio);
      setShowActionButtons(false);
      setTextBtnSumbit("SOLICITAR");
      setObjService(obj);
      setService(obj);
      setOpenService(true);
   };
   const handleClickChangeStatus = async (id, newStatus) => {
      try {
         setLoadingAction(true);
         const axiosResponse = await changeStatus(id, newStatus, status);

         // formikRef.current.setValues(axiosResponse.result);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
      } catch (error) {
         setLoadingAction(false);
         console.log("🚀 ~ handleClickApprove ~ error:", error);
         Toast.Error(error);
      }
   };

   const ButtonsAction = ({ id, folio, obj }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Ver Solicitud de ${singularName} #${folio}`} placement="top">
               <Button color="dark" onClick={() => handleClickShowRequest(id, folio, obj)}>
                  <IconEye />
               </Button>
            </Tooltip>
            {includesInArray(auth.permissions.more_permissions, ["Aprobar Servicio", "todas"]) && obj.status === "ABIERTA" && (
               <Tooltip title={`Aprobar ${singularName} #${folio}`} placement="top">
                  <Button color="primary" onClick={() => handleClickChangeStatus(id, "APROBADA")}>
                     <IconThumbUpFilled />
                  </Button>
               </Tooltip>
            )}
            {includesInArray(auth.permissions.more_permissions, ["Rechazar Servicio", "todas"]) && obj.status === "ABIERTA" && (
               <Tooltip title={`Rechazar ${singularName} #${folio}`} placement="top">
                  <Button color="primary" onClick={() => handleClickChangeStatus(id, "RECHAZADA")}>
                     <IconThumbDown />
                  </Button>
               </Tooltip>
            )}
            {includesInArray(auth.permissions.more_permissions, ["Revisar Unidad", "todas"]) && obj.status === "APROBADA" && (
               <Tooltip title={`Iniciar Revisión a ${singularName} #${folio}`} placement="top">
                  <Button color="error" onClick={() => handleClickChangeStatus(id, "EN REVISIÓN")}>
                     <IconSettingsSearch />
                  </Button>
               </Tooltip>
            )}
            {includesInArray(auth.permissions.more_permissions, ["Cargar Material", "todas"]) && obj.status === "EN REVISIÓN" && (
               <Tooltip title={`Cargar Material al ${singularName} #${folio}`} placement="top">
                  <Button color="error" onClick={() => handleClickLoadMaterial(id, folio, obj)}>
                     <FileUploadIcon />
                  </Button>
               </Tooltip>
            )}
            {includesInArray(auth.permissions.more_permissions, ["Cerrar Servicio", "todas"]) && obj.status === "EN REVISIÓN" && (
               <Tooltip title={`Cerrar ${singularName} #${folio}`} placement="top">
                  <Button color="error" onClick={() => handleClickChangeStatus(id, "CERRADA")}>
                     <IconSquareRoundedCheckFilled />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.update && (
               <Tooltip title={`Editar ${singularName} #${folio}`} placement="top">
                  <Button color="info" onClick={() => handleClickEdit(id)}>
                     <IconEdit />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.delete && (
               <Tooltip title={`Eliminar ${singularName} #${folio}`} placement="top">
                  <Button color="error" onClick={() => handleClickDelete(id, folio)}>
                     <IconDelete />
                  </Button>
               </Tooltip>
            )}
            {/* {auth.role_id == ROLE_SUPER_ADMIN && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)} sx={{}}>
                     <SwitchIOSComponent checked={active} />
                  </Button>
               </Tooltip>
            )} */}
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", services);
         await services.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} folio={obj.folio} obj={obj} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(services[0]));
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
         btnAdd={false /* auth.permissions.create */}
         handleClickAdd={handleClickAdd}
         rowEdit={false}
         refreshTable={() => getServices(status)}
      />
   );
};
export default ServiceDT;
