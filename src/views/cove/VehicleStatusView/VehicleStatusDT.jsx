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

import { useVehicleStatusContext } from "../../../context/VehicleStatusContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { Box } from "@mui/system";

const VehicleStatusDT = () => {
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, vehicleStatuss, getVehicleStatuss, showVehicleStatus, deleteVehicleStatus, setTextBtnSumbit, setFormTitle } =
      useVehicleStatusContext();
   const globalFilterFields = ["vehicle_status", "description"];

   // #region BodysTemplate
   const VehicleStatusBodyTemplate = (obj) => (
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
   const DescriptionBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.description}</Typography>;
   // #endregion BodysTemplate

   const columns = [
      { field: "vehicle_status", header: "Estatus del Vehículo", sortable: true, functionEdit: null, body: VehicleStatusBodyTemplate, filterField: null },
      { field: "description", header: "Descripción", sortable: false, functionEdit: null, body: DescriptionBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showVehicleStatus(id);
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
               const axiosResponse = await deleteVehicleStatus(id);
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
         // console.log("cargar listado", vehicleStatuss);
         await vehicleStatuss.map((obj) => {
            // console.log(obj);
            let register = obj;
            register.actions = <ButtonsAction id={obj.id} name={obj.vehicleStatus} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(vehicleStatuss[0]));
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
   return <DataTableComponent columns={columns} data={data} globalFilterFields={globalFilterFields} headerFilters={false} refreshTable={getVehicleStatuss} />;
};
export default VehicleStatusDT;
