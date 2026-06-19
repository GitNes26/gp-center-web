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

import { useVehicleContext } from "../../../context/VehicleContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { formatDatetime, sleep } from "../../../utils/Formats";
import { useAuthContext } from "../../../context/AuthContext";
import SwitchComponent from "../../../components/SwitchComponent";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { IconEye } from "@tabler/icons";
import VehicleCardInfo from "./CardInfo";

const VehicleDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog, openCardInfo, setOpenCardInfo } = useGlobalContext();
   const {
      singularName,
      vehicle,
      setVehicle,
      vehicles,
      getVehicles,
      showVehicle,
      deleteVehicle,
      deleteMultiple,
      disEnableVehicle,
      resetFormData,
      resetVehicle,
      setTextBtnSumbit,
      setFormTitle
   } = useVehicleContext();
   const globalFilterFields = [
      "stock_number",
      "brand",
      "model",
      "year",
      "plates",
      "shelter_to",
      "vehicle_status",
      "serial_number",
      "circulation_card",
      "insurance_policy",
      "description",
      "gasoline_code"
   ];
   const [vehicleShow, setVehicleShow] = useState(null);

   // #region BodysTemplate
   const ImagePreviewBodyTemplate = (obj) => (
      <Box textAlign={"center"}>
         <img alt="Vista previa del vehículo" src={`${import.meta.env.VITE_HOST}/${obj.img_preview}`} style={{ maxWidth: 100, maxHeight: 100 }} />
      </Box>
   );
   const InfoBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.brand} - {obj.model} {obj.year}
      </Typography>
   );
   const StockNumberBodyTemplate = (obj) => (
      <Tooltip title="Click para ver esta unidad en el buscador principal">
         <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
            <Link to={`/admin/${obj.stock_number}`} target="_blank">
               {obj.stock_number}
            </Link>
         </Typography>
      </Tooltip>
   );
   const PlatesBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.plates}
      </Typography>
   );
   const StatusBodyTemplate = (obj) => (
      <Box textAlign={"center"}>
         <Chip
            sx={{
               height: "auto",
               "& .MuiChip-label": {
                  display: "block",
                  whiteSpace: "normal"
               },
               fontSize: "16px",
               fontWeight: "bolder",
               color: obj.letter_black ? "#3E3E3E" : "#F3F3F3",
               backgroundColor: obj.bg_color
            }}
            label={obj.vehicle_status}
         />
      </Box>
   );
   const ShelterBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.shelter_to}
      </Typography>
   );
   const SerialNumberBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.serial_number}
      </Typography>
   );
   const CirculationCardBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.circulation_card}
      </Typography>
   );
   const InsurancePolicyBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.insurance_policy}
      </Typography>
   );
   const DescriptionBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.description}</Typography>;
   const GasolineCodeBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.gasoline_code}
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
      { field: "image_preview", header: "Vista Previa", sortable: false, functionEdit: null, body: ImagePreviewBodyTemplate, filter: false, filterField: null },
      { field: "info", header: "Info", sortable: true, functionEdit: null, body: InfoBodyTemplate, filter: false, filterField: null },
      { field: "stock_number", header: "N° Económico", sortable: true, functionEdit: null, body: StockNumberBodyTemplate, filter: true, filterField: null },
      { field: "plates", header: "Placas", sortable: true, functionEdit: null, body: PlatesBodyTemplate, filter: true, filterField: null },
      { field: "vehicle_status", header: "Estatus", sortable: true, functionEdit: null, body: StatusBodyTemplate, filter: true, filterField: null },
      { field: "shelter_to", header: "Resguardante en Korima", sortable: true, functionEdit: null, body: ShelterBodyTemplate, filter: true, filterField: null },
      { field: "serial_number", header: "N° de Serie", sortable: true, functionEdit: null, body: SerialNumberBodyTemplate, filter: true, filterField: null },
      {
         field: "circulation_card",
         header: "Tarjeta de Circulación",
         sortable: true,
         functionEdit: null,
         body: CirculationCardBodyTemplate,
         filter: true,
         filterField: null
      },
      {
         field: "insurance_policy",
         header: "Poliza de Seguro",
         sortable: true,
         functionEdit: null,
         body: InsurancePolicyBodyTemplate,
         filter: true,
         filterField: null
      },
      { field: "description", header: "Descripción", sortable: true, functionEdit: null, body: DescriptionBodyTemplate, filter: false, filterField: null },
      { field: "gasoline_code", header: "Código Gasolina", sortable: true, functionEdit: null, body: GasolineCodeBodyTemplate, filter: true, filterField: null }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filter: false, filterField: null },
         { field: "created_at", header: "Resgistrado", sortable: true, functionEdit: null, body: CreatedAtBodyTemplate, filter: false, filterField: null }
      );

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetVehicle();
         // vehicle.role = "Selecciona una opción...";
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickView = async (id) => {
      try {
         setLoadingAction(true);
         const res = await showVehicle(id);
         // setVehicleShow(res.result);
         await sleep(1500);
         setOpenCardInfo(true);
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
         await showVehicle(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar el vehículo con N° económico ${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteVehicle(id);
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
         if (selectedData.length === 1) msg += `el departamento: ${selectedData[0].vehicle}?`;
         else if (selectedData.length > 1) msg += `los siguientes departamentos: ${selectedData.map((d) => d.vehicle)}?`;
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

   const handleClickDisEnable = async (id, name, active) => {
      try {
         let axiosResponse;
         setTimeout(async () => {
            axiosResponse = await disEnableVehicle(id, !active);
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
            <Tooltip title={`Ver ${singularName}`} placement="top">
               <Button color="dark" onClick={() => handleClickView(id)}>
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
            {/* {auth.role_id == ROLE_SUPER_ADMIN && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)} sx={{}}>
                     <SwitchComponent checked={active} />
                  </Button>
               </Tooltip>
            )} */}
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", vehicles);
         await vehicles.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.stock_number} active={obj.active} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(vehicles[0]));
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
            refreshTable={getVehicles}
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
         <VehicleCardInfo vehicle={vehicleShow} />
      </>
   );
};
export default VehicleDT;
