import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Divider,
   FormControlLabel,
   InputLabel,
   Slide,
   Switch,
   TextField,
   Toolbar,
   Tooltip,
   Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { forwardRef, useState } from "react";
import { useVoucherContext } from "../../../context/VoucherContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { TransitionSlide, gpcDark, gpcLight, useGlobalContext } from "../../../context/GlobalContext";
import { handleInputFormik } from "../../../utils/Formats";
import { OutlinedInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { strengthColor, strengthIndicator } from "../../../utils/password-strength";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import DatePickerComponent from "../../../components/Form/DatePickerComponent";
import axios from "axios";
import InputFileComponent, { setObjImg } from "../../../components/Form/InputFileComponent";
import { validateImageRequired } from "../../../utils/Validations";
import { IconWindowMaximize, IconWindowMinimize, IconX } from "@tabler/icons";
import { useVehicleContext } from "../../../context/VehicleContext";
import { useAuthContext } from "../../../context/AuthContext";
// import DialogComponent from "../../../components/DialogComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const VoucherForm = ({ open, setOpen }) => {
   const { auth } = useAuthContext();
   const [fullScreenDialog, setFullScreenDialog] = useState(false);

   const {
      setLoadingAction,
      openDialog,
      setOpenDialog,
      toggleDrawer,
      setDisabledState,
      setDisabledCity,
      setDisabledColony,
      setShowLoading,
      setDataStates,
      setDataCities,
      setDataColonies,
      setDataColoniesComplete,
      cursorLoading
   } = useGlobalContext();
   const {
      voucher,
      resetVoucher,
      singularName,
      createVoucher,
      updateVoucher,
      formData,
      setFormData,
      resetFormData,
      textBtnSubmit,
      setTextBtnSumbit,
      formTitle,
      setFormTitle
   } = useVoucherContext();
   const { showVehicleBy } = useVehicleContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const [worker, setWorker] = useState(true);

   const handleClose = () => {
      setOpen(false);
   };

   const ResetForm = async (resetForm = null) => {
      if (resetForm) await resetForm();
      resetVoucher();
      await resetFormData();
   };

   const handleBlurStockNumber = async (e, setFieldValue) => {
      if (e.target.value.length == 0) return setFieldValue("vehicle_plates", ""); /*  Toast.Info("Ingresa un número unidad."); */
      const searchBy = "stock_number";
      const res = await showVehicleBy(searchBy, e.target.value);
      // console.log(res);
      // setShowLoading(false);
      if (!res.result) return Toast.Info(res.alert_title);
      Toast.Success(res.alert_title);
      setFieldValue("vehicle_plates", res.result.plates);
      // setFieldValue("vehicle_id", res.result.id);
   };

   const handleInputPayRoll = async (e, setFieldValue, values) => {
      try {
         const value = e.target.value;
         if (value == "0") {
            await setFieldValue("name", "");
            await setFieldValue("paternal_last_name", "");
            await setFieldValue("maternal_last_name", "");
            await setFieldValue("payroll_number_exist", false);
            await setFieldValue("department", "");
            return setWorker(false);
         } else setWorker(true);
         if (value.length < 5) return;
         const axiosRH = axios;
         const { data } = await axiosRH.get(`${import.meta.env.VITE_API_RH}/${value}/infraesctruturagobmxpalaciopeticioninsegura`);
         // console.log("empleado", data.RESPONSE.recordset[0]);
         if (data.RESPONSE.recordset[0]) {
            const userFind = data.RESPONSE.recordset[0];
            Toast.Success(`Número de nómina encontrado`);
            await setFieldValue("name", userFind.nombreE);
            await setFieldValue("paternal_last_name", userFind.apellidoP);
            await setFieldValue("maternal_last_name", userFind.apellidoM);
            await setFieldValue("payroll_number_exist", true);
            await setFieldValue("department", userFind.departamento);
         } else {
            Toast.Error(`El Número de nómina no fue encontrado`);
            await setFieldValue("name", "");
            await setFieldValue("paternal_last_name", "");
            await setFieldValue("maternal_last_name", "");
            await setFieldValue("payroll_number_exist", false);
            await setFieldValue("department", "");
         }
      } catch (error) {
         console.log(error);
         if (error.response.status !== 500) Toast.Error(error);
         else {
            Toast.Error(`El Número de nómina no fue encontrado`);
            await setFieldValue("name", "");
            await setFieldValue("paternal_last_name", "");
            await setFieldValue("maternal_last_name", "");
            await setFieldValue("payroll_number_exist", false);
            await setFieldValue("department", "");
         }
      }
   };

   const handleChangeCheckAdd = (e) => {
      try {
         const active = e.target.checked;
         localStorage.setItem("checkAdd", active);
         setCheckAdd(active);
         setColorLabelcheck("");
         if (!active) setColorLabelcheck("#ccc");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm, setFieldValue }) => {
      try {
         // console.log("formData", formData);
         // console.log("values", values);

         if (values.id < 1) {
            values.user_id = auth.id;
            values.voucher_status = "ALTA";
         }
         values.quantity = 1;
         if (values.foliated_vouchers.includes("-")) {
            const range = values.foliated_vouchers.split("-");
            values.quantity = Number(range[1]) - Number(range[0]) + 1;
         }
         setFormData(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createVoucher(values);
         else axiosResponse = await updateVoucher(values);
         // if (axiosResponse.message == "duplicate") return Toast.Info("hola");
         if (axiosResponse.status_code == 200) {
            ResetForm(resetForm);
            setTextBtnSumbit("AGREGAR");
            setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         }
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         if (!checkAdd && axiosResponse.status_code == 200) setOpen(false);
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
         ResetForm(resetForm);
         resetVoucher();
         setFieldValue("id", id);
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
         setOpen(true);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         ResetForm(resetForm);
         resetVoucher();
         setOpen(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchemas = () => {
      let validationSchema = Yup.object().shape({
         foliated_vouchers: Yup.string().trim().required("Vales Foliados requeridos"),
         vehicle_plates: Yup.string().trim().required("Placas del vehículo requerido"),

         payroll_number: Yup.number("Solo números"),
         // payroll_number_exist: Yup.boolean().oneOf([true], "El Número de Nómina no existe."),
         department: Yup.string().trim().required("Departamento requerido"),
         name: Yup.string().trim().required("Nombre(s) requerido"),
         paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
         maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
         phone: Yup.string()
            .trim()
            .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
            .required("Número telefónico requerido"),
         activity: Yup.string().trim().required("Actividad requerida")
      });
      return validationSchema;
   };

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <Formik initialValues={formData} validationSchema={validationSchemas()} onSubmit={onSubmit}>
         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
            <Dialog
               open={open}
               TransitionComponent={Transition}
               keepMounted
               maxWidth={"md"}
               fullWidth
               onClose={handleClose}
               aria-describedby="alert-dialog-slide-description"
               sx={{ backgroundColor: "transparent" }}
               fullScreen={fullScreenDialog}
               component={"form"}
               onSubmit={handleSubmit}
            >
               <DialogTitle sx={{ backgroundColor: gpcDark, color: gpcLight }}>
                  <Toolbar>
                     <Typography variant="h2" mb={0} color={gpcLight} sx={{ ml: 2, flex: 1 }}>
                        {formTitle}
                        <FormControlLabel
                           sx={{ float: "right", color: colorLabelcheck }}
                           control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                           label="Seguir Agregando"
                        />
                     </Typography>
                     {/* <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
                  {"title"}
               </Typography> */}
                     {/* <Tooltip title={`Exportar Reporte a PDF`} placement="top">
                  <IconButton color="inherit" onClick={() => downloadPDF("reportPaper")}>
                     <IconFileTypePdf color="red" />
                  </IconButton>
               </Tooltip>
               <Tooltip title={`Imprimir Reporte`} placement="top">
                  <IconButton color="inherit" onClick={() => printContent("reportPaper")}>
                     <IconPrinter />
                  </IconButton>
               </Tooltip> */}
                     <Tooltip title={fullScreenDialog ? `Minimizar ventana` : `Maximizar ventana`} placement="top">
                        <IconButton color="inherit" onClick={() => setFullScreenDialog(!fullScreenDialog)}>
                           {fullScreenDialog ? <IconWindowMinimize /> : <IconWindowMaximize />}
                        </IconButton>
                     </Tooltip>
                     <Tooltip title={`Cerrar ventana`} placement="top">
                        <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
                           <IconX />
                        </IconButton>
                     </Tooltip>
                  </Toolbar>
               </DialogTitle>
               <DialogContent sx={{ maxHeight: fullScreenDialog ? "100vh" : "65vh" }}>
                  <Box role="presentation" pt={3} px={3}>
                     {/* VALIDAR DEPENDIENDO DEL ROL ESCOGIDO */}
                     <Grid container spacing={2}>
                        <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />

                        {/* Vales Foliados */}
                        <Grid xs={12} md={12} sx={{ mb: 2 }}>
                           <Tooltip title="En caso de poner más de un folio, ingresarlos como si fuera un rango de folios, con guion medio; ej. 1-6">
                              <TextField
                                 id="foliated_vouchers"
                                 name="foliated_vouchers"
                                 label="Vales Foliados *"
                                 type="text"
                                 value={values.foliated_vouchers}
                                 placeholder="1-6"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 // InputProps={{}}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 error={errors.foliated_vouchers && touched.foliated_vouchers}
                                 helperText={errors.foliated_vouchers && touched.foliated_vouchers && errors.foliated_vouchers}
                              />
                           </Tooltip>
                        </Grid>
                        {/* N° Económico */}
                        <Grid xs={12} md={6} sx={{ mb: 1 }}>
                           <TextField
                              id="stock_number"
                              name="stock_number"
                              label="N° Económico"
                              type="number"
                              value={values.stock_number}
                              placeholder="1"
                              onChange={handleChange}
                              onBlur={(e) => {
                                 handleBlur(e);
                                 handleBlurStockNumber(e, setFieldValue, values);
                              }}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "stock_number", false)}
                              // inputProps={{ maxLength: 2 }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.stock_number && touched.stock_number}
                              helperText={errors.stock_number && touched.stock_number && errors.stock_number}
                           />
                        </Grid>
                        {/* Placas del Vehículo */}
                        <Grid xs={12} md={6} sx={{ mb: 1 }}>
                           <TextField
                              id="vehicle_plates"
                              name="vehicle_plates"
                              label="Placas del Vehículo *"
                              type="text"
                              value={values.vehicle_plates}
                              placeholder="xxx-00-00"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "vehicle_plates", true)}
                              // inputProps={{ maxLength: 2 }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.vehicle_plates && touched.vehicle_plates}
                              helperText={errors.vehicle_plates && touched.vehicle_plates && errors.vehicle_plates}
                           />
                        </Grid>

                        {/* Divisor */}
                        <Grid xs={12}>
                           <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"}>
                              DATOS DEL SOLICITANTE
                           </Divider>
                        </Grid>
                        {/* Número de Nómina */}
                        <Field
                           id="payroll_number_exist"
                           name="payroll_number_exist"
                           type="hidden"
                           value={values.payroll_number_exist}
                           onChange={handleChange}
                           onBlur={handleBlur}
                        />
                        <Grid xs={12} md={4} sx={{ mb: 1 }}>
                           <TextField
                              id="payroll_number"
                              name="payroll_number"
                              label="Número de Nómina"
                              type="number"
                              value={values.payroll_number}
                              placeholder="99999"
                              onChange={handleChange}
                              onInput={(e) => handleInputPayRoll(e, setFieldValue, values)}
                              onBlur={handleBlur}
                              fullWidth
                              // inputProps={{ maxLength: 11 }}
                              error={errors.payroll_number && touched.payroll_number}
                              helperText={errors.payroll_number && touched.payroll_number && errors.payroll_number}
                              // error={(errors.payroll_number && touched.payroll_number) || (errors.payroll_number_exist && touched.payroll_number_exist)}
                              // helperText={
                              //    (errors.payroll_number && touched.payroll_number && errors.payroll_number) ||
                              //    (errors.payroll_number_exist && touched.payroll_number_exist && errors.payroll_number_exist)
                              // }
                           />
                        </Grid>
                        {/* Departameto */}
                        <Grid xs={12} md={8} sx={{ mb: 1 }}>
                           <TextField
                              id="department"
                              name="department"
                              label="Departamento"
                              type="text"
                              value={values.department}
                              placeholder="Ingresa tu departamento"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "department", true)}
                              InputProps={{ disabled: worker }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.department && touched.department}
                              helperText={errors.department && touched.department && errors.department}
                           />
                        </Grid>
                        {/* Nombre */}
                        <Grid xs={12} md={6} sx={{ mb: 2 }}>
                           <TextField
                              id="name"
                              name="name"
                              label="Nombre(s) *"
                              type="text"
                              value={values.name}
                              placeholder="Ingrese tu(s) nombre(s)"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "name", true)}
                              InputProps={{ disabled: worker }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.name && touched.name}
                              helperText={errors.name && touched.name && errors.name}
                           />
                        </Grid>
                        {/* Apellido Paterno */}
                        <Grid xs={12} md={6} sx={{ mb: 2 }}>
                           <TextField
                              id="paternal_last_name"
                              name="paternal_last_name"
                              label="Apellido Paterno *"
                              type="text"
                              value={values.paternal_last_name}
                              placeholder="Ingrese tu primer apellido"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "paternal_last_name", true)}
                              InputProps={{ disabled: worker }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.paternal_last_name && touched.paternal_last_name}
                              helperText={errors.paternal_last_name && touched.paternal_last_name && errors.paternal_last_name}
                           />
                        </Grid>
                        {/* Apellido Materno */}
                        <Grid xs={12} md={6} sx={{ mb: 2 }}>
                           <TextField
                              id="maternal_last_name"
                              name="maternal_last_name"
                              label="Apellido Materno *"
                              type="text"
                              value={values.maternal_last_name}
                              placeholder="Ingrese tu segundo apellido"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "maternal_last_name", true)}
                              InputProps={{ disabled: worker }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.maternal_last_name && touched.maternal_last_name}
                              helperText={errors.maternal_last_name && touched.maternal_last_name && errors.maternal_last_name}
                           />
                        </Grid>
                        {/* Telefono */}
                        <Grid xs={12} md={6} sx={{ mb: 1 }}>
                           <TextField
                              id="phone"
                              name="phone"
                              label="Número Telefónico *"
                              type="phone"
                              value={values.phone}
                              placeholder="10 dígitos"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              fullWidth
                              inputProps={{ maxLength: 10 }}
                              error={errors.phone && touched.phone}
                              helperText={errors.phone && touched.phone && errors.phone}
                           />
                        </Grid>

                        {/* Divisor */}
                        <Grid xs={12}>
                           <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                        </Grid>
                        {/* Actividad */}
                        <Grid xs={12} md={12} sx={{ mb: 1 }}>
                           <TextField
                              id="activity"
                              name="activity"
                              label="Actvidad *"
                              type="text"
                              value={values.activity}
                              placeholder="actividad..."
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "activity", false)}
                              // inputProps={{ maxLength: 2 }}
                              fullWidth
                              multiline
                              rows={3}
                              // disabled={values.id == 0 ? false : true}
                              error={errors.activity && touched.activity}
                              helperText={errors.activity && touched.activity && errors.activity}
                           />
                        </Grid>

                        {/*<InputsCommunityComponent
                        formData={formData}
                        setFormData={setFormData}
                        values={values}
                        setValues={setValues}
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                     /> */}
                     </Grid>
                  </Box>
               </DialogContent>
               <DialogActions sx={{ paddingInline: 3 }}>
                  <ButtonGroup variant="contained" fullWidth>
                     <LoadingButton
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        // loadingPosition="start"
                        variant="contained"
                        fullWidth
                        size="large"
                     >
                        {textBtnSubmit}
                     </LoadingButton>
                     <Button type="reset" color="error" fullWidth={false} size="large" onClick={() => handleCancel(resetForm)}>
                        CANCELAR
                     </Button>
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
                  {/* <Button onClick={handleClose} sx={{ color: gpcLight }}>
                     Cerrar
                  </Button> */}
               </DialogActions>
            </Dialog>
         )}
      </Formik>
   );
};
export default VoucherForm;
