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
import { formatDatetimeToSQL, handleInputFormik } from "../../../utils/Formats";
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
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import VoucherDetailDT from "./VoucherDetailDT";
import { useAsyncError } from "react-router-dom";
import { useVoucherDetailContext } from "../../../context/VoucherDetailContext";
import { useVoucherRequesterContext } from "../../../context/VoucherRequesterContext";
// import DialogComponent from "../../../components/DialogComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const VoucherForm = ({ open, setOpen, currentStatus }) => {
   const { auth } = useAuthContext();
   const [fullScreenDialog, setFullScreenDialog] = useState(false);
   const { voucherId, setVoucherId } = useVoucherDetailContext();
   const [enableRequesterExternal, setEnableRequesterExternal] = useState(false);

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
      setFormTitle,
      inAprobation,
      setInAprobation,
      inEdit,
      setInEdit,
      updateStatus
   } = useVoucherContext();
   const { getIndexByVoucher } = useVoucherDetailContext();
   const { showVehicleBy } = useVehicleContext();
   const { voucherRequesters, getVoucherRequestersSelectIndex } = useVoucherRequesterContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const [worker, setWorker] = useState(true);
   const [approveLess, setApproveLess] = useState(false);
   const mySwal = withReactContent(Swal);

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

   const handleBlurFoliatedVouchers = (e, setFieldValue, values) => {
      const foliated_vouchers = e.target.value;
      if (foliated_vouchers.length < 1) return Toast.Info("No has asignado ningún folio.");
      let approved_amount = 1;
      if (foliated_vouchers.includes("-")) {
         const range = foliated_vouchers.split("-");
         approved_amount = Number(range[1]) - Number(range[0]) + 1;
      }
      setFieldValue("approved_amount", approved_amount);
      // if (approved_amount > values.requested_amount) Toast.Warning("¡¡CUIDADO!! Estás asignando más vales de los solicitados");
      // else if (approved_amount < values.requested_amount) {
      //    sAlert.Warning(`ESTÁS POR ASIGNAR MENOS DE LOS VALES SOLICITADOS: <br/><br/>
      //    Asignados: <b>${approved_amount}<b/> <br/>
      //    Solicitados: <b>${values.requested_amount}<b/>`);
      // }
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm, setFieldValue }) => {
      try {
         // console.log("formData", formData);
         // console.log("values", values);
         values.id = voucherId;
         values.voucher_status = "ALTA";
         if (values.id < 1) {
            values.requested_by = enableRequesterExternal ? values.requested_by : auth.id;
            values.voucher_status = "CREADO";
            setTextBtnSumbit("FINALIZAR VALE");
         }
         values.requested_by = enableRequesterExternal ? values.requested_by : auth.id;
         values.requester_external = enableRequesterExternal ? auth.id : null;

         setFormData(values);
         setLoadingAction(true);
         let axiosResponse;
         if (inAprobation) {
            values.voucher_status = "APROBADA";
            values.approved_by = auth.id;
            values.approved_at = formatDatetimeToSQL(new Date());
            // return console.log("values", values);
            // if (values.approved_amount > values.requested_amount) return sAlert.Warning("NO PUEDES ASIGNAR MÁS DE LOS VALES SOLICITADOS");
            axiosResponse = await updateStatus(values, currentStatus);
         } else {
            // console.log("values", values);
            if (values.id == 0) axiosResponse = await createVoucher(values, currentStatus);
            else {
               if (textBtnSubmit === "FINALIZAR VALE") {
                  values.approved_amount = 0;
                  const voucherDetailsRes = await getIndexByVoucher(values.id);
                  if (voucherDetailsRes.result.voucherDetails.length == 0) {
                     values.voucher_status = "CREADO";
                     setLoadingAction(false);
                     return Toast.Error("Tienes que registrar mínimo un vehículo en la tabla");
                  }
               }
               axiosResponse = await updateVoucher(values, currentStatus);
            }
         }
         // if (axiosResponse.message == "duplicate") return Toast.Info("hola");
         if (axiosResponse.status_code == 200) {
            if (values.id < 1) {
               // console.log("axiosResponse", axiosResponse);
               setVoucherId(axiosResponse.result.id);
            } else if (values.id > 0) {
               ResetForm(resetForm);
               setTextBtnSumbit("CREAR VALE");
               setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
            }
         }
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // console.log(checkAdd);
         // console.log(axiosResponse.status_code);
         // console.log(values.id);
         if (["FINALIZAR VALE", "APROBAR"].includes(textBtnSubmit) && !checkAdd && axiosResponse.status_code == 200) {
            setOpen(false);
            setTimeout(() => {
               setOpen(false);
            }, 500);
         }
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
         setEnableRequesterExternal(formData.requester_external != null ? true : false);
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
         setInAprobation(false);
         setInEdit(false);
         setTimeout(() => {
            setOpen(false);
         }, 500);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchemas = () => {
      let validationSchema = Yup.object().shape({
         internal_folio: Yup.string().trim().required("Folio Interno requeridos"),
         letter_folio: inAprobation && Yup.string().trim().required("Prefijo requerida"),
         foliated_vouchers: inAprobation && Yup.string().trim().required("Vales Foliados requeridos"),
         // approved_amount: inAprobation && Yup.number("Solo números").min(0, "Mínimo").required("Cantidad Aprobada requerida"),
         // vehicle_plates: Yup.string().trim().required("Placas del vehículo requerido"),
         // requested_amount: Yup.number("Solo números").min(0, "Mínimo"),
         // payroll_number: Yup.number("Solo números"),
         // // payroll_number_exist: Yup.boolean().oneOf([true], "El Número de Nómina no existe."),
         // // department: Yup.string().trim().required("Departamento requerido"),
         // name: Yup.string().trim().required("Nombre(s) requerido"),
         // paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
         // maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
         // phone: Yup.string()
         //    .trim()
         //    .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
         //    .required("Número telefónico requerido"),
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
               maxWidth={"xl"}
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

                        {(inAprobation || inEdit) && (
                           <>
                              {/* Divisor */}
                              <Grid xs={12}>
                                 <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"}>
                                    ASIGNAR FOLIOS
                                 </Divider>
                              </Grid>
                              {/* Letra Vale */}
                              <Grid xs={12} md={2} sx={{ mb: 2 }}>
                                 <Tooltip title="Ingresa el prefijo del vale para control interno; S=SIMSA | C=CargoGAS">
                                    <TextField
                                       id="letter_folio"
                                       name="letter_folio"
                                       label="Prefijo Vale *"
                                       type="text"
                                       value={values.letter_folio}
                                       placeholder="S | C"
                                       onChange={handleChange}
                                       onBlur={(e) => {
                                          handleBlur(e);
                                          handleBlurFoliatedVouchers(e, setFieldValue, values, setSubmitting);
                                       }}
                                       onInput={(e) => handleInputFormik(e, setFieldValue, "letter_folio", true)}
                                       inputProps={{ maxLength: 1 }}
                                       fullWidth
                                       // disabled={values.id == 0 ? false : true}
                                       error={errors.letter_folio && touched.letter_folio}
                                       helperText={errors.letter_folio && touched.letter_folio && errors.letter_folio}
                                    />
                                 </Tooltip>
                              </Grid>
                              {/* Vales Foliados */}
                              <Grid xs={12} md={6} sx={{ mb: 2 }}>
                                 <Tooltip title="En caso de poner más de un folio, ingresarlos como si fuera un rango de folios, con guion medio; ej. 1-6">
                                    <TextField
                                       id="foliated_vouchers"
                                       name="foliated_vouchers"
                                       label="Vales Foliados *"
                                       type="text"
                                       value={values.foliated_vouchers}
                                       placeholder="1-6"
                                       onChange={handleChange}
                                       onBlur={(e) => {
                                          handleBlur(e);
                                          handleBlurFoliatedVouchers(e, setFieldValue, values, setSubmitting);
                                       }}
                                       // InputProps={{}}
                                       fullWidth
                                       // disabled={values.id == 0 ? false : true}
                                       error={errors.foliated_vouchers && touched.foliated_vouchers}
                                       helperText={errors.foliated_vouchers && touched.foliated_vouchers && errors.foliated_vouchers}
                                    />
                                 </Tooltip>
                              </Grid>
                              {/* Cantidad de Vales Aprobados */}
                              <Grid xs={12} md={4} sx={{ mb: 1 }}>
                                 <TextField
                                    id="approved_amount"
                                    name="approved_amount"
                                    label="Cantidad de Vales Aprobados *"
                                    type="number"
                                    value={values.approved_amount ?? 0}
                                    placeholder=""
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onInput={(e) => handleInputFormik(e, setFieldValue, "approved_amount", true)}
                                    inputProps={{ min: 0 }}
                                    fullWidth
                                    disabled={!inEdit}
                                    error={errors.approved_amount && touched.approved_amount}
                                    helperText={errors.approved_amount && touched.approved_amount && errors.approved_amount}
                                 />
                              </Grid>
                           </>
                        )}
                        {/* Divisor */}
                        <Grid xs={12}>
                           <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"}>
                              DATOS DE SOLICITUD
                           </Divider>
                        </Grid>

                        {/* Requisitor de Vale */}
                        {auth.permissions.more_permissions.includes("24@Solicitador Externo") && (
                           <>
                              {/* Switch para replaquear */}
                              <Grid xs={12} md={12} sx={{ mb: -2 }}>
                                 <FormControlLabel
                                    control={<Switch />}
                                    label="¿Solicitar vales por otro departamento?"
                                    checked={enableRequesterExternal}
                                    onChange={() => setEnableRequesterExternal(!enableRequesterExternal)}
                                 />
                              </Grid>
                              <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                 <Select2Component
                                    idName={"requested_by"}
                                    label={"Requisitor de Vale *"}
                                    valueLabel={values.requested_by_name}
                                    values={values}
                                    formData={formData}
                                    setFormData={setFormData}
                                    formDataLabel={"requested_by_name"}
                                    placeholder={"Selecciona una opción..."}
                                    options={voucherRequesters}
                                    fullWidth={true}
                                    handleChange={handleChange}
                                    // handleChangeValueSuccess={handleChangeRole}
                                    setValues={setValues}
                                    handleBlur={handleBlur}
                                    error={errors.requested_by}
                                    touched={touched.requested_by}
                                    disabled={!enableRequesterExternal}
                                    pluralName={"Solicitadores de Vales"}
                                    refreshSelect={getVoucherRequestersSelectIndex}
                                 />
                              </Grid>
                           </>
                        )}
                        {/* Folio Interno */}
                        <Grid xs={12} mdOffset={auth.permissions.more_permissions.includes("24@Solicitador Externo") ? 2 : 8} md={4} sx={{ mb: 1 }}>
                           <TextField
                              id="internal_folio"
                              name="internal_folio"
                              label="Folio Interno *"
                              type="text"
                              value={values.internal_folio}
                              placeholder="FI-01"
                              onChange={handleChange}
                              onBlur={(e) => {
                                 handleBlur(e);
                                 handleBlurFoliatedVouchers(e, setFieldValue, values, setSubmitting);
                              }}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "internal_folio", true)}
                              // InputProps={{}}
                              fullWidth
                              disabled={inAprobation}
                              error={errors.internal_folio && touched.internal_folio}
                              helperText={errors.internal_folio && touched.internal_folio && errors.internal_folio}
                           />
                        </Grid>
                        {/* Actividad */}
                        <Grid xs={12} md={12} sx={{ mb: 1 }}>
                           <Tooltip title={"No olvides describir la cantidad de LITROS a solicitar"}>
                              <TextField
                                 id="activity"
                                 name="activity"
                                 label="Actvidad *"
                                 type="text"
                                 value={values.activity}
                                 placeholder="actividad..."
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 // onInput={(e) => handleInputFormik(e, setFieldValue, "activity", false)}
                                 // inputProps={{ maxLength: 2 }}
                                 fullWidth
                                 multiline
                                 rows={3}
                                 disabled={inAprobation}
                                 error={errors.activity && touched.activity}
                                 helperText={errors.activity && touched.activity && errors.activity}
                              />
                           </Tooltip>
                        </Grid>
                        {/* Estatus del Vale */}
                        {/* {inEdit && (
                           <Grid xs={12} md={4} sx={{ mb: 1 }}>
                              <TextField
                                 id="voucher_status"
                                 name="voucher_status"
                                 label="Estatus del Vale"
                                 type="text"
                                 value={values.voucher_status}
                                 placeholder="ALTA"
                                 onChange={handleChange}
                                 onBlur={(e) => {
                                    handleBlur(e);
                                    // handleBlurStockNumber(e, setFieldValue, values);
                                 }}
                                 onInput={(e) => handleInputFormik(e, setFieldValue, "voucher_status", true)}
                                 // inputProps={{ maxLength: 2 }}
                                 fullWidth
                                 disabled={inAprobation}
                                 error={errors.voucher_status && touched.voucher_status}
                                 helperText={errors.voucher_status && touched.voucher_status && errors.voucher_status}
                              />
                           </Grid>
                        )} */}
                        {/* Vehículo */}
                        {/* <Grid xs={12} md={4} sx={{ mb: 1 }}>
                           <TextField
                              id="vehicle"
                              name="vehicle"
                              label="Vehículo"
                              type="text"
                              value={values.vehicle}
                              placeholder="FORD - FIESTA"
                              onChange={handleChange}
                              onBlur={(e) => {
                                 handleBlur(e);
                                 // handleBlurStockNumber(e, setFieldValue, values);
                              }}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "vehicle", true)}
                              // inputProps={{ maxLength: 2 }}
                              fullWidth
                              disabled={inAprobation}
                              error={errors.vehicle && touched.vehicle}
                              helperText={errors.vehicle && touched.vehicle && errors.vehicle}
                           />
                        </Grid> */}
                        {/* Placas del Vehículo */}
                        {/* <Grid xs={12} md={4} sx={{ mb: 1 }}>
                           <TextField
                              id="vehicle_plates"
                              name="vehicle_plates"
                              label="Placas del Vehículo *"
                              type="text"
                              value={values.vehicle_plates}
                              placeholder="XXX-00-00"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "vehicle_plates", true)}
                              // inputProps={{ maxLength: 2 }}
                              fullWidth
                              disabled={inAprobation}
                              error={errors.vehicle_plates && touched.vehicle_plates}
                              helperText={errors.vehicle_plates && touched.vehicle_plates && errors.vehicle_plates}
                           />
                        </Grid> */}
                        {/* Cantidad de Vales Solicitados */}
                        {/* <Grid xs={12} md={4} sx={{ mb: 1 }}>
                           <TextField
                              id="requested_amount"
                              name="requested_amount"
                              label="Cantidad de Vales Solicitados *"
                              type="number"
                              value={values.requested_amount}
                              placeholder="0"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "requested_amount", true)}
                              inputProps={{ min: 0 }}
                              fullWidth
                              disabled={inAprobation}
                              error={errors.requested_amount && touched.requested_amount}
                              helperText={errors.requested_amount && touched.requested_amount && errors.requested_amount}
                           />
                        </Grid> */}

                        {/* Divisor */}
                        {voucherId > 0 && (
                           <Grid xs={12}>
                              <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"}>
                                 DATOS DE LOS ACREDITADOS <br />
                                 <small>
                                    <i>No dejar ningun campo vacio</i>
                                 </small>
                              </Divider>
                              <VoucherDetailDT values={values} setFieldValue={setFieldValue} voucherId={voucherId} />
                           </Grid>
                        )}
                        {/* Número de Nómina */}
                        <Field
                           id="payroll_number_exist"
                           name="payroll_number_exist"
                           type="hidden"
                           value={values.payroll_number_exist}
                           onChange={handleChange}
                           onBlur={handleBlur}
                        />
                        {/* <Grid xs={12} md={4} sx={{ mb: 1 }}>
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
                              disabled={inAprobation}
                              // inputProps={{ maxLength: 11 }}
                              error={errors.payroll_number && touched.payroll_number}
                              helperText={errors.payroll_number && touched.payroll_number && errors.payroll_number}
                              // error={(errors.payroll_number && touched.payroll_number) || (errors.payroll_number_exist && touched.payroll_number_exist)}
                              // helperText={
                              //    (errors.payroll_number && touched.payroll_number && errors.payroll_number) ||
                              //    (errors.payroll_number_exist && touched.payroll_number_exist && errors.payroll_number_exist)
                              // }
                           />
                        </Grid> */}
                        {/* Departameto */}
                        {/* <Grid xs={12} md={8} sx={{ mb: 1 }}>
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
                        </Grid> */}
                        {/* Nombre */}
                        {/* <Grid xs={12} md={6} sx={{ mb: 2 }}>
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
                        </Grid> */}
                        {/* Apellido Paterno */}
                        {/* <Grid xs={12} md={6} sx={{ mb: 2 }}>
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
                        </Grid> */}
                        {/* Apellido Materno */}
                        {/* <Grid xs={12} md={6} sx={{ mb: 2 }}>
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
                        </Grid> */}
                        {/* Telefono */}
                        {/* <Grid xs={12} md={6} sx={{ mb: 1 }}>
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
                              disabled={inAprobation}
                              inputProps={{ maxLength: 10 }}
                              error={errors.phone && touched.phone}
                              helperText={errors.phone && touched.phone && errors.phone}
                           />
                        </Grid> */}
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
                     <Button type="reset" color="info" fullWidth={false} size="large" onClick={() => handleCancel(resetForm)}>
                        CERRAR
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
