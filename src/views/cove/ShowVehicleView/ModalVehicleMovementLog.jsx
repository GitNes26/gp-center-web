import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Fragment, forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { Box, ButtonGroup, Grid, ListItemButton, TextField } from "@mui/material";
import SearchInput from "../../../components/SearchInput";
import { useDirectorContext } from "../../../context/DirectorContext";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import { useVehicleContext } from "../../../context/VehicleContext";
import Toast from "../../../utils/Toast";
import { useVehicleMovementLogContext } from "../../../context/VehicleMovementLogContext";
import { formatDatetimeToSQL, searcher } from "../../../utils/Formats";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useAuthContext } from "../../../context/AuthContext";
import { FormikComponent, InputComponent } from "../../../components/Form/FormikComponents";
import { Formik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

function stringToColor(string) {
   let hash = 0;
   let i;

   /* eslint-disable no-bitwise */
   for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
   }

   let color = "#";

   for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
   }
   /* eslint-enable no-bitwise */

   return color;
}

function stringAvatar(name) {
   const letters = name.length < 3 ? "?" : `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`;

   return {
      sx: {
         bgcolor: stringToColor(name)
      },
      children: letters
   };
}

const ItemUser = ({ id, full_name = "", department, email, handleClick, readOnly = false }) => {
   return !readOnly ? (
      <>
         {/* <Divider variant="inset" component="li" /> */}
         <ListItemButton alignItems="flex-start" onClick={() => handleClick(id, full_name)}>
            <ListItemAvatar>
               <Avatar {...stringAvatar(full_name)} />
            </ListItemAvatar>
            <ListItemText
               primary={<Typography variant="h4">{full_name}</Typography>}
               secondary={
                  <Fragment>
                     <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                        {department}
                     </Typography>
                     — {email}
                  </Fragment>
               }
            />
         </ListItemButton>
         <Divider variant="inset" component="li" sx={{ marginLeft: "0px;" }} />
      </>
   ) : (
      <Box sx={{ display: "flex" }}>
         <ListItemAvatar>
            <Avatar {...stringAvatar(full_name)} />
         </ListItemAvatar>
         <ListItemText
            primary={<Typography variant="h4">{full_name}</Typography>}
            secondary={
               <Fragment>
                  <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                     {department}
                  </Typography>
                  <br /> {email}
               </Fragment>
            }
         />
      </Box>
   );
};

const initialValues = {
   id: 0,
   // user_id: 0, // usuario que realiza el movimiento
   vehicle_status_id: 0,
   vehicle_id: 0,
   active_user_id: 0, // usuario responsable de la unidad
   km: 0,
   comments: "",
   // valid: null,
   // table_assoc: null,
   // table_assoc_register_id: null,
   // active: true,
   created_at: ""
};
const ModalVehicleMovementLog = ({
   open,
   setOpen,
   movement = "Assign",
   vehicleStatusId,
   modalTitle,
   textBtnSubmit,
   dataListResponsibles,
   getDataListResponsibles
}) => {
   const mySwal = withReactContent(Swal);
   const [search, setSearch] = useState("");
   const { setLoadingAction } = useGlobalContext();
   // const { dataListResponsibles, getDataListResponsibles } = useDirectorContext();
   const { vehicle, showVehicle, dataList, setDataList } = useVehicleContext();
   const { createVehicleMovementLog } = useVehicleMovementLogContext();
   const [closeList, setCloseList] = useState(false);
   const [formData, setFormData] = useState(initialValues);

   const handleClose = () => {
      setOpen(false);
      setCloseList(false);
      setSearch("");
      setFormData(initialValues);
   };
   const handleCancel = (resetForm) => {
      try {
         resetForm();
         setCloseList(false);
         setSearch("");
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickResponsible = (obj) => {
      setFormData({
         ...formData,
         // user_id: auth.id,
         vehicle_id: vehicle.id,
         active_user_id: obj.user_id,
         itemSelected: {
            full_name: obj.full_name,
            department: obj.department,
            email: obj.email
         }
      });
      setCloseList(true);
      setSearch("");
   };

   const validationSchema = Yup.object().shape({
      km: Yup.string().trim(),
      comments: Yup.string().trim()
   });
   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // return console.log(values);
         // setLoadingAction(true);
         values.vehicle_status_id = vehicleStatusId;
         values.movement = movement;
         // values.created_at = formatDatetimeToSQL(new Date());

         mySwal
            .fire(
               QuestionAlertConfig(
                  `Estas por ${textBtnSubmit.toLowerCase()} el vehículo con N° económico ${vehicle.stock_number} a ${formData.itemSelected.full_name}`,
                  textBtnSubmit,
                  "CANCELAR",
                  "info"
               )
            )
            .then(async (result) => {
               if (result.isConfirmed) {
                  setLoadingAction(true);
                  const axiosResponse = await createVehicleMovementLog(values, vehicleStatusId, formData.vehicle_id, movement);
                  await showVehicle(vehicle.id);
                  setCloseList(true);
                  setOpen(false);
                  setLoadingAction(false);
                  Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
                  setSearch("");
                  setFormData(initialValues);
               }
            });
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
         Toast.Error(error);
      } finally {
         setSubmitting(false);
      }
   };

   const handleKeyUpSearchSuccess = async (e) => {
      try {
         setCloseList(false);
         setDataList(dataListResponsibles);
         const value = e.target.value;
         if (value.length == 0) return setDataList(dataListResponsibles);
         // const filter1 = await dataListResponsibles.filter((d) => d.email.toUpperCase().includes(value.toUpperCase()));
         // const filter2 = await dataListResponsibles.filter((d) => d.department.toUpperCase().includes(value.toUpperCase()));
         // const filter3 = await dataListResponsibles.filter((d) => d.full_name.toUpperCase().includes(value.toUpperCase()));
         // const result = [];
         // result.push(...filter1);
         // result.push(...filter2);
         // result.push(...filter3);
         // const data = [...new Set(result)];
         const data = await searcher(dataListResponsibles, value);
         setDataList(data);
         // setDataList(dataListResponsibles.filter((d) => d.department.toUpperCase().includes(value.toUpperCase())));
      } catch (error) {
         console.log(error);
         Toast.Error(error);
         setLoading(false);
      }
   };

   useEffect(() => {
      // console.log("estoy en el modal", dataListResponsibles);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", dataListResponsibles);
      getDataListResponsibles();
   }, []);

   return (
      <div>
         {/* <Button variant="outlined" onClick={handleClickOpen}>
            Slide in alert dialog
         </Button> */}
         <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backgroundColor: "transparent" }}
         >
            <DialogTitle>
               <Typography variant="h3" component={"p"} textAlign={"center"}>
                  {modalTitle}
               </Typography>

               <SearchInput
                  idName="search"
                  search={search}
                  setSearch={setSearch}
                  placeholder={"Buscar director"}
                  titleTooltip={"Buscar por Departamento"}
                  handleKeyUpSearchSuccess={handleKeyUpSearchSuccess}
                  showOptions={false}
               />
            </DialogTitle>
            <DialogContent sx={{ maxHeight: "500px" }}>
               {!closeList ? (
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                     <DialogContentText id="alert-dialog-slide-description" component={"div"}>
                        {dataList.length > 0 ? (
                           dataList.map((obj) => {
                              return (
                                 <ItemUser
                                    key={obj.id}
                                    id={obj.user_id}
                                    full_name={obj.full_name}
                                    department={obj.department}
                                    email={obj.email}
                                    handleClick={() => handleClickResponsible(obj)}
                                 />
                              );
                           })
                        ) : (
                           <Typography>No se encontraron registros o coincidencias</Typography>
                        )}
                     </DialogContentText>
                  </List>
               ) : (
                  <FormikComponent
                     key={"formikComponent"}
                     initialValues={formData}
                     validationSchema={validationSchema}
                     onSubmit={onSubmit}
                     textBtnSubmit={textBtnSubmit}
                     showActionButtons={false}
                     // formikRef={formikRef}
                     handleCancel={handleCancel}
                  >
                     <Grid item xs={12} md={12} sx={{ my: 2 }}>
                        <ItemUser
                           key={"key-item"}
                           id={formData.user_id}
                           full_name={formData.itemSelected.full_name}
                           department={formData.itemSelected.department}
                           email={formData.itemSelected.email}
                           readOnly={true}
                        />
                     </Grid>
                     {/* <InputComponent col={12} idName={"vehicle_status_id"} label={"vehicle_status_id"} hidden={true} value={vehicleStatusId} /> */}
                     {/* <InputComponent col={12} idName={"movement"} label={"movement"} hidden={true} value={movement} /> */}

                     <InputComponent col={12} idName={"km"} label={"Kilometraje"} type={"number"} />
                     <InputComponent col={12} idName={"comments"} label={"Comentarios"} placeholder={"(Opcional)"} rows={3} />
                     <Button type="submit">ACEPTAR</Button>
                  </FormikComponent>
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Cerrar</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

export default ModalVehicleMovementLog;
