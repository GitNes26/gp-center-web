import { Field, Formik } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Fragment, forwardRef, useEffect, useState } from "react";
import { ButtonGroup, CircularProgress, ListItemButton, TextField } from "@mui/material";
import { useUserContext } from "../../../context/UserContext";
import { gpcDark, gpcLight, useGlobalContext } from "../../../context/GlobalContext";

import { InputAdornment, OutlinedInput } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@emotion/react";
import { shouldForwardProp } from "@mui/system";
import InputComponentv2 from "../../../components/Form/InputComponentv2";
import { useServiceContext } from "../../../context/ServiceContext";
import { LoadingButton } from "@mui/lab";
import Toast from "../../../utils/Toast";
import { formatDatetime, handleInputFormik } from "../../../utils/Formats";
import dayjs from "dayjs";
import { useVehicleContext } from "../../../context/VehicleContext";
import sAlert from "../../../utils/sAlert";

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
   // width: 434,
   // marginLeft: 16,
   // paddingLeft: 16,
   // paddingRight: 16,
   "& input": {
      background: "#fff !important",
      paddingLeft: "10px !important"
   },
   [theme.breakpoints.down("lg")]: {
      width: 250
   },
   [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff"
   }
}));

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

let dateTime;

const ModalService = ({ open, setOpen, stockNumber = null, idService = null, title = "SOLICITAR SERVICIO" }) => {
   const theme = useTheme();

   // const [open, setOpen] = useState(false);
   const { setLoadingAction, setDisabledState, setDisabledCity, setDisabledColony, cursorLoading } = useGlobalContext();
   const { users, getUsers } = useUserContext();
   const { vehicle, showVehicle, showVehicleBy } = useVehicleContext();
   const { formData, setFormData, resetFormData, service, showService, createService, updateReport, textBtnSubmit, setTextBtnSumbit } = useServiceContext();
   const [showLoading, setShowLoading] = useState(false);

   const handleClose = () => {
      setOpen(false);
   };

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

   const ItemUser = ({ full_name = "", department, email }) => {
      return (
         <>
            {/* <Divider variant="inset" component="li" /> */}
            <ListItemButton alignItems="flex-start">
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
      );
   };

   const ItemUserTest = ({ full_name = "", department, email }) => {
      return (
         <>
            <Grid xs={12} md={6} sx={{ mb: 2 }}>
               <OutlineInputStyle
                  id={"search"}
                  name={"search"}
                  type={"text"}
                  fullWidth
                  value={""}
                  // onChange={(e) => handleChangeSearch(e.target.value)}
                  // onKeyUp={(e) => handleKeyUpSearch(e)}
                  placeholder={"Buscar vehículo"}
                  startAdornment={
                     // <Tooltip title={""} placement={"top"}>
                     <InputAdornment position="start" sx={{ mx: 2 }}>
                        <Typography sx={{ color: gpcLight, fontWeight: "bolder", fontSize: 16 }}>N° Unidad</Typography>
                        {/* <IconSearch stroke={2.5} size="1.5rem" color={theme.palette.grey[500]} /> */}
                     </InputAdornment>
                     // </Tooltip>
                  }
                  aria-describedby={"search-helper-text"}
                  inputProps={{ "aria-label": "weight" }}
                  sx={{ backgroundColor: gpcDark, m: 1 }}
                  // {...prop}
               />
            </Grid>

            <InputComponentv2
               idName={"stock_number"}
               label={"N° Unidad"}
               placeholder={"Ingresa el N° Unidad"}
               type="number"
               formData={formData}
               onChange={handleChange}
               onBlur={handleBlur}
               setFieldValue={setFieldValue}
               value={values.stock_number}
               error={errors.stock_number}
               touched={touched.stock_number}
            />
         </>
      );
   };

   const handleBlurStockNumber = async (e, setFieldValue) => {
      if (e.target.value.length == 0) return Toast.Info("Ingresa un número unidad.");
      // if (e.key === "Enter" || e.keyCode === 13) {
      setShowLoading(true);
      // const searchBy = searchType == "number" ? "stock_number" : "plates";
      const searchBy = "stock_number";
      const res = await showVehicleBy(searchBy, e.target.value);
      setShowLoading(false);
      if (!res.result) return Toast.Info(res.alert_title);
      Toast.Success(res.alert_title);
      setFieldValue("vehicle_id", res.result.id);
   };

   const handleChangeStockNumber = (e) => {
      // console.log("change", e);
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm, setFieldValue }) => {
      try {
         if (!vehicle) return Toast.Warning("La unidad a ingresar debe estar registrada en CoVe.");
         // console.log("formData", formData);
         // console.log("values", values);
         // // values.community_id = values.colony_id;

         // // values.num_int = values.num_int === "" ? "S/N" : values.num_int;
         setFormData(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createService(values);
         else axiosResponse = await updateReport(values);
         // // if (axiosResponse.message == "duplicate") return Toast.Info("hola");
         if (axiosResponse.status_code == 200) {
            resetForm();
            resetFormData();
            setTextBtnSumbit("AGREGAR");
            // setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         }
         setSubmitting(false);
         setLoadingAction(false);
         sAlert.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon, true, null);
         showVehicle(vehicle.id);
         setOpen(false);
         // Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // if (!checkAdd && axiosResponse.status_code == 200) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
         Toast.Error(error);
      } finally {
         setSubmitting(false);
      }
   };

   const handleReset = (resetForm, setFieldValue, id) => {
      try {
         resetForm();
         // user.role = "Selecciona una opción...";
         // setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = async (values, setValues, setFieldValue) => {
      try {
         if (formData.description) formData.description == null && (formData.description = "");
         setValues(formData);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         // user.role = "Selecciona una opción...";
         // setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchema = Yup.object().shape({
      stock_number: Yup.number("Solo números").required("Número de Inventario requerido"),
      contact_name: Yup.string().trim().required("Nombre de contacto requerido"),
      contact_phone: Yup.string()
         .trim()
         .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
         .required("Número telefónico requerido"),
      pre_diagnosis: Yup.string().trim().required("Pre diagnostico requerido")
      // folio: "",
      // vehicle_id: 0,
      // final_diagnosis: null,
      // evidence_img_path: null,

      // year: Yup.number("Solo números")
      //    .min(1900, "El año esta fuera del rango permitido")
      //    .max(new Date().getFullYear() + 1, "El año esta fuera del rango permitido")
      //    .required("Año del modelo requerido")
      // // registration_date: "",
      // description: "",
      // brand: "",
      // model: "",
      // vehicle_status: "",
      // plates: "",
      // initial_date: "",
      // due_date: ""
   });

   setInterval(() => {
      dateTime = dayjs().format("DD-MM-YYYY hh:mm");
      formData.dateTime = dateTime;
      // console.log(dateTime);
   }, 60000);

   const handleShowService = async () => {
      console.log("hay servicio");
      await showService(idService);
   };

   useEffect(() => {
      if (stockNumber < 0) formData.stock_number = stockNumber;
      if (idService) handleShowService();
      // console.log(formData);
      // console.log("vehicle", vehicle);
   }, [formData, vehicle]);

   return (
      <div>
         {/* <Button variant="outlined" onClick={handleClickOpen}>
            Slide in alert dialog
         </Button> */}
         <Dialog
            maxWidth={"md"}
            fullWidth
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backgroundColor: "transparent" }}
         >
            <DialogTitle bgcolor={gpcDark}>
               <Typography sx={{ color: gpcLight }} variant="h1" component={"span"}>
                  {title.toUpperCase()}
               </Typography>
            </DialogTitle>
            <DialogContent sx={{ maxHeight: "500px", my: 1 }}>
               <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
                  {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                     <Grid container spacing={2} component={"form"} onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />
                        {/* N° Unidad */}
                        <Grid xs={12} md={6} sx={{ mb: 1 }}>
                           <InputComponentv2
                              idName={"stock_number"}
                              label={"N° Unidad"}
                              placeholder={"Ingresa el N° Unidad"}
                              type="number"
                              formData={formData}
                              onChange={(e) => {
                                 handleChange(e);
                                 handleChangeStockNumber(e);
                              }}
                              onBlur={(e) => {
                                 handleBlur(e);
                                 handleBlurStockNumber(e, setFieldValue, values);
                              }}
                              setFieldValue={setFieldValue}
                              value={values.stock_number}
                              error={errors.stock_number}
                              touched={touched.stock_number}
                           />
                           {showLoading && <CircularProgress disableShrink sx={{ position: "absolute", left: "35%", mt: 0, zIndex: 10 }} />}
                        </Grid>
                        {/* Fecha de Registro */}
                        <Grid xs={12} md={6} sx={{ mb: 1 }}>
                           <InputComponentv2
                              idName={"dateTime"}
                              label={"Fecha de Registro"}
                              placeholder={"Fecha de registro"}
                              type="text"
                              formData={formData}
                              // onChange={(e) => {
                              //    handleChange(e);
                              //    // handleChangeStockNumber(e);
                              // }}
                              disabled={true}
                              onBlur={handleBlur}
                              setFieldValue={setFieldValue}
                              value={values.dateTime}
                              error={errors.dateTime}
                              touched={touched.dateTime}
                           />
                        </Grid>
                        {/* Nombre de contacto */}
                        <Grid xs={12} md={7} sx={{ mb: 1 }}>
                           <InputComponentv2
                              idName={"contact_name"}
                              label={"Nombre de contacto"}
                              placeholder={"Ingresa un nombre a contactar"}
                              type="text"
                              formData={formData}
                              onChange={(e) => {
                                 handleChange(e);
                              }}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "contact_name", true)}
                              onBlur={handleBlur}
                              setFieldValue={setFieldValue}
                              disabled={vehicle ? false : true}
                              // sx={{ backgroundColor: "gray" }}
                              value={values.contact_name}
                              error={errors.contact_name}
                              touched={touched.contact_name}
                           />
                        </Grid>
                        {/* Telefono de contacto */}
                        <Grid xs={12} md={5} sx={{ mb: 1 }}>
                           <InputComponentv2
                              idName={"contact_phone"}
                              label={"Telefono de contacto"}
                              placeholder={"Ingresa un número telefonico"}
                              type="text"
                              formData={formData}
                              onChange={(e) => {
                                 handleChange(e);
                              }}
                              onBlur={handleBlur}
                              setFieldValue={setFieldValue}
                              disabled={vehicle ? false : true}
                              // sx={{ backgroundColor: "gray" }}
                              inputProps={{ maxLength: 10 }}
                              value={values.contact_phone}
                              error={errors.contact_phone}
                              touched={touched.contact_phone}
                           />
                        </Grid>
                        {/* Diagnostico inicial */}
                        <Grid xs={12} md={12} sx={{ mb: 1 }}>
                           <InputComponentv2
                              idName={"pre_diagnosis"}
                              label={"Diagnóstico inicial"}
                              placeholder={"Describe la falla que el conductor redacta"}
                              type="text"
                              formData={formData}
                              onChange={(e) => {
                                 handleChange(e);
                              }}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "pre_diagnosis", true)}
                              onBlur={handleBlur}
                              setFieldValue={setFieldValue}
                              disabled={vehicle ? false : true}
                              // sx={{ backgroundColor: gpcDark }}
                              multiline
                              rows={3}
                              value={values.pre_diagnosis}
                              error={errors.pre_diagnosis}
                              touched={touched.pre_diagnosis}
                           />
                        </Grid>
                        {/* 
                        <Grid xs={12} md={12} sx={{ mb: 1 }}>
                           <Divider sx={{ flexGrow: 1, my: 1, borderStyle: "dashed", borderBottomWidth: "thick", borderColor: gpcDark }} orientation="horizontal" />
                        </Grid> */}

                        {/* Diagnostico Final */}
                        {/* <Grid xs={12} md={12} sx={{ mb: 1 }}>
                           <InputComponentv2
                              idName={"final_diagnosis"}
                              label={"Diagnóstico Final"}
                              placeholder={"Describe la falla del diagnostico"}
                              type="text"
                              formData={formData}
                              onChange={(e) => {
                                 handleChange(e);
                              }}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "final_diagnosis", true)}
                              onBlur={handleBlur}
                              setFieldValue={setFieldValue}
                              multiline
                              rows={3}
                              value={values.final_diagnosis}
                              error={errors.final_diagnosis}
                              touched={touched.final_diagnosis}
                           />
                        </Grid> */}

                        <LoadingButton
                           type="submit"
                           disabled={isSubmitting}
                           loading={isSubmitting}
                           // loadingPosition="start"
                           variant="contained"
                           fullWidth
                           size="large"
                           // sx={{ bgcolor: gpcDark }}
                        >
                           {textBtnSubmit}
                        </LoadingButton>
                        <ButtonGroup variant="outlined" fullWidth>
                           {/* <Button
                              type="reset"
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              size="large"
                              sx={{ mt: 1 }}
                              onClick={() => handleReset(resetForm, setFieldValue, values.id)}
                           >
                              LIMPIAR
                           </Button> */}
                           {/* <Button type="reset" variant="outlined" color="error" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleCancel(resetForm)}>
                              CANCELAR
                           </Button> */}
                        </ButtonGroup>
                        <Button
                           type="button"
                           color="info"
                           fullWidth
                           id="btnModify"
                           sx={{ mt: 1, display: "none" }}
                           onClick={() => handleModify(values, setValues, setFieldValue)}
                        >
                           setValues
                        </Button>
                     </Grid>
                  )}
               </Formik>
            </DialogContent>
            <DialogActions sx={{ bgcolor: gpcDark }}>
               <Button variant="text" sx={{ color: gpcLight, fontSize: 16 }} onClick={handleClose}>
                  Cerrar
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

export default ModalService;
