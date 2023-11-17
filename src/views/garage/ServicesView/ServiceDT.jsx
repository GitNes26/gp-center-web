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

import { useServiceContext } from "../../../context/ServiceContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { Box } from "@mui/system";
import { formatPhone } from "../../../utils/Formats";
import { IconCircleCheck, IconEye, IconUpload } from "@tabler/icons";

const ServiceDT = () => {
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, services, getServices, showService, deleteService, setTextBtnSumbit, setFormTitle } = useServiceContext();
   const globalFilterFields = ["folio", "stock_number", "contact_name", "contact_phone", "pre_diagnosis", "status"];

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
   // #endregion BodysTemplate

   const columns = [
      { field: "folio", header: "Folio", sortable: true, functionEdit: null, body: FolioBodyTemplate, filterField: null },
      { field: "stock_number", header: "N° Económico", sortable: true, functionEdit: null, body: StockNumberBodyTemplate, filterField: null },
      { field: "contact_name", header: "Contacto", sortable: true, functionEdit: null, body: ContactBodyTemplate, filterField: null },
      { field: "pre_diagnosis", header: "Pre Diagnostico", sortable: false, functionEdit: null, body: PreDiagnosisBodyTemplate, filterField: null },
      { field: "status", header: "Estatus", sortable: true, functionEdit: null, body: StatusBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showService(id);
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
               const axiosResponse = await deleteService(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const ButtonsAction = ({ id, name }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Ver Solicitud de ${singularName}`} placement="top">
               <Button color="info" onClick={() => Toast.Info("Abrir modal")}>
                  <IconEye />
               </Button>
            </Tooltip>
            <Tooltip title={`Aceptar ${singularName}`} placement="top">
               <Button color="success" onClick={() => Toast.Success("Servicio Aceptado")}>
                  <IconCircleCheck />
               </Button>
            </Tooltip>
            <Tooltip title={`Cargar Material al ${singularName}`} placement="top">
               <Button color="success" onClick={() => Toast.Success("Cargar Material")}>
                  <IconUpload />
               </Button>
            </Tooltip>
            <Tooltip title={`Editar ${singularName}`} placement="top">
               <Button color="info" onClick={() => Toast.Default("Editar Info")} /* onClick={() => handleClickEdit(id)} */>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={`Eliminar ${singularName}`} placement="top">
               <Button color="error" onClick={() => Toast.Default("Eliminar Servicio")} /* onClick={() => handleClickDelete(id, name)} */>
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", services);
         await services.map((obj) => {
            // console.log(obj);
            let register = obj;
            register.actions = <ButtonsAction id={obj.id} name={obj.servicename} />;
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
   return <DataTableComponent columns={columns} data={data} globalFilterFields={globalFilterFields} headerFilters={false} refreshTable={getServices} />;
};
export default ServiceDT;
