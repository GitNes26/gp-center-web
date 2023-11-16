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
import { useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { Box } from "@mui/system";

const VehicleDT = () => {
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, vehicles, showVehicle, deleteVehicle, setTextBtnSumbit, setFormTitle } = useVehicleContext();
   // const [globalFilterFields, setGlobalFilterFields] = useState([]);
   const globalFilterFields = ["stock_number", "plates", "vehicle_status", "serial_number", "circulation_card", "insurance_policy", "description"];

   // #region BodysTemplate
   const ImagePreviewBodyTemplate = (obj) => (
      <Box textAlign={"center"}>
         {<img alt="Vista previa del vehículo" src={`${import.meta.env.VITE_HOST}/${obj.img_preview}`} style={{ maxWidth: 100, maxHeight: 100 }} />}
      </Box>
   );
   const StockNumberBodyTemplate = (obj) => (
      <Typography textAlign={"center"} sx={{ fontWeight: "bolder" }}>
         {obj.stock_number}
      </Typography>
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
   // #endregion BodysTemplate

   const columns = [
      { field: "image_preview", header: "Vista Previa", sortable: false, functionEdit: null, body: ImagePreviewBodyTemplate, filterField: null },
      { field: "stock_number", header: "N° Económico", sortable: true, functionEdit: null, body: StockNumberBodyTemplate, filterField: null },
      { field: "plates", header: "Placas", sortable: true, functionEdit: null, body: PlatesBodyTemplate, filterField: null },
      { field: "status", header: "Estatus", sortable: true, functionEdit: null, body: StatusBodyTemplate, filterField: null },
      { field: "serial_number", header: "N° de Serie", sortable: true, functionEdit: null, body: SerialNumberBodyTemplate, filterField: null },
      { field: "circulation_card", header: "Tarjeta de Circulación", sortable: true, functionEdit: null, body: CirculationCardBodyTemplate, filterField: null },
      { field: "insurance_policy", header: "Poliza de Seguro", sortable: true, functionEdit: null, body: InsurancePolicyBodyTemplate, filterField: null },
      { field: "description", header: "Descripción", sortable: true, functionEdit: null, body: DescriptionBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

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
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
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

   const ButtonsAction = ({ id, name }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={"Editar Usuario"} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={"Eliminar Usuario"} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", vehicles);
         await vehicles.map((obj) => {
            // console.log(obj);
            let register = obj;
            register.actions = <ButtonsAction id={obj.id} name={obj.vehiclename} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(vehicles[0]));
         // console.log("la data del charger", globalFilterFields);
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
   return <DataTableComponent columns={columns} data={data} globalFilterFields={globalFilterFields} headerFilters={false} />;
};
export default VehicleDT;
