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
// import DialogComponent from "../../../components/DialogComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const VoucherForm = ({ open, setOpen }) => {
   // #region Boton de Contraseña
   const [showPassword, setShowPassword] = useState(false);
   const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(true);
   const [fullScreenDialog, setFullScreenDialog] = useState(false);

   const [strength, setStrength] = useState(0);
   const [level, setLevel] = useState();
   const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const changePassword = (value) => {
      const temp = strengthIndicator(value);
      setStrength(temp);
      setLevel(strengthColor(temp));
   };
   // #endregion Boton de Contraseña

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
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [newPasswordChecked, setNewPasswordChecked] = useState(true);
   const [imgLicense, setImgLicense] = useState([]);
   const [imgAvatar, setImgAvatar] = useState([]);

   const handleClose = () => {
      setOpen(false);
   };

   const ResetForm = async (resetForm = null) => {
      if (resetForm) await resetForm();
      await resetFormData();
      setImgAvatar([]);
      setImgLicense([]);
   };

   const handleChangeRole = (value2, setFieldValue) => {
      try {
         // console.log("amanas", value2);
         const role_id = Number(value2.id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleInputPayRoll = async (e, setFieldValue, values) => {
      try {
         const value = e.target.value;
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
         // values.community_id = values.colony_id;
         values.avatar = imgAvatar.length == 0 ? "" : imgAvatar[0].file;
         values.img_license = imgLicense.length == 0 ? "" : imgLicense[0].file;
         values.num_int = values.num_int === "" ? "S/N" : values.num_int;

         if (!validateImageRequired(values.img_license, "La foto de la licencia es requerida")) return;

         // return console.log("values", values.img_license);

         setFormData(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createVoucher(values);
         else axiosResponse = await updateVoucher(values);
         // if (axiosResponse.message == "duplicate") return Toast.Info("hola");
         if (axiosResponse.status_code == 200) {
            ResetForm(resetForm);
            setStrength(0);
            setTextBtnSumbit("AGREGAR");
            setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         }
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         if (!checkAdd && axiosResponse.status_code == 200) setOpenDialog(false);
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
         voucher.role = "Selecciona una opción...";
         setStrength(0);
         setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = async (values, setValues, setFieldValue) => {
      try {
         if (formData.community_id > 0) {
            // setShowLoading(true);
            getCommunity(
               formData.zip,
               setFieldValue,
               formData.community_id,
               formData,
               setFormData,
               setDisabledState,
               setDisabledCity,
               setDisabledColony,
               setShowLoading,
               setDataStates,
               setDataCities,
               setDataColonies,
               setDataColoniesComplete
            );
         }
         if (formData.description) formData.description == null && (formData.description = "");
         setValues(formData);
         setObjImg(formData.avatar, setImgAvatar);
         setObjImg(formData.img_license, setImgLicense);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         ResetForm(resetForm);
         resetVoucher();
         voucher.role = "Selecciona una opción...";
         setStrength(0);
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchemas = () => {
      let validationSchema = Yup.object().shape({
         username: Yup.string()
            .trim()
            .matches(/^[^@]*$/, 'No se permite el carácter "@"')
            .required("Nombre de usario requerido"),
         email: Yup.string().trim().email("Formato de correo no valido").required("Correo requerido"),
         password: newPasswordChecked && Yup.string().trim().min(6, "La Contraseña debe de tener mínimo 6 caracteres").required("Contraseña requerida"),
         // role_id: Yup.number().min(1, "Esta opción no es valida").required("Rol requerido"),
         phone: Yup.string()
            .trim()
            .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
            .required("Número telefónico requerido"),
         license_number: Yup.string().trim().required("Número de licencia requerido"),
         license_type: Yup.string().trim().required("Tipo de licencia requerido"),
         license_due_date: Yup.date().required("Fecha de vencimiento requerida"),
         // imgLicense: Yup.mixed().required("Debe seleccionar un archivo"),
         payroll_number: Yup.number("Solo números"),
         payroll_number_exist: Yup.boolean().oneOf([true], "El Número de Nómina no existe."),
         // department_id: Yup.number().min(1, "Esta opción no es valida").required("Departamento requerido"),
         department: Yup.string().trim().required("Departamento requerido"),

         name: Yup.string().trim().required("Nombre(s) requerido"),
         paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
         maternal_last_name: Yup.string().trim().required("Apellido Materno requerido")
         // community_id:  Yup.number().trim().required("Comunidad requerida"),
         // street: Yup.string().trim().required("Calle/Av. requerida"),
         // num_ext: Yup.string().trim().required("Número exterior requerido"),
         // // num_int: Yup.string().trim().required("Número interior requerido"),

         // zip: Yup.number("Solo numeros").required("Código Postal requerido"),
         // state: Yup.string().trim().required("Estado requerido"),
         // city: Yup.string().trim().required("Ciudad requerido"),
         // colony: Yup.string().trim().notOneOf(["Selecciona una opción..."], "Ésta opción no es valida").required("Colonia requerida")
      });
      return validationSchema;
   };

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
         if (textBtnSubmit == "GUARDAR") {
            setNewPasswordChecked(false);
            setCheckedShowSwitchPassword(true);
         } else {
            setNewPasswordChecked(true);
            setCheckedShowSwitchPassword(false);
         }
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

                        {/* <Field id="role_id" name="role_id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} /> */}
                        {/* Nombre de Usuario */}
                        <Grid xs={12} md={6} sx={{ mb: 2 }}>
                           <TextField
                              id="username"
                              name="username"
                              label="Vales Foliados *"
                              type="text"
                              value={values.username}
                              placeholder="1-6"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              // InputProps={{}}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.username && touched.username}
                              helperText={errors.username && touched.username && errors.username}
                           />
                        </Grid>
                        {/* Correo Electronico */}
                        <Grid xs={12} md={6} sx={{ mb: 1 }}>
                           <TextField
                              id="email"
                              name="email"
                              label="N° Económico"
                              type="number"
                              value={values.email}
                              placeholder="1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "email", false)}
                              // inputProps={{ maxLength: 2 }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.email && touched.email}
                              helperText={errors.email && touched.email && errors.email}
                           />
                        </Grid>
                        {/* Correo Electronico */}
                        <Grid xs={12} md={6} sx={{ mb: 1 }}>
                           <TextField
                              id="email"
                              name="email"
                              label="Placas del vehículo *"
                              type="text"
                              value={values.email}
                              placeholder="1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "email", false)}
                              // inputProps={{ maxLength: 2 }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.email && touched.email}
                              helperText={errors.email && touched.email && errors.email}
                           />
                        </Grid>

                        {/* Switch para mostrar el cambiar contraseña */}
                        {/* {checkedShowSwitchPassword && (
                           <Grid xs={12} md={12} sx={{ mb: -2 }}>
                              <FormControlLabel
                                 control={<Switch />}
                                 label="Cambiar Contraseña"
                                 checked={newPasswordChecked}
                                 onChange={() => setNewPasswordChecked(!newPasswordChecked)}
                              />
                           </Grid>
                        )} */}
                        {/* Contraseña */}
                        {/* <Grid xs={12} md={6} sx={{ mb: 2 }}>
                           <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                              <InputLabel htmlFor="password">Contraseña *</InputLabel>
                              <OutlinedInput
                                 id="password"
                                 name="password"
                                 label="Contraseña *"
                                 type={showPassword ? "text" : "password"}
                                 value={values.password}
                                 placeholder="Ingrese su contraseña, minimo 6 dígitos"
                                 onBlur={handleBlur}
                                 onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                 }}
                                 endAdornment={
                                    <InputAdornment position="end">
                                       <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowPassword}
                                          onMouseDown={handleMouseDownPassword}
                                          edge="end"
                                          size="large"
                                       >
                                          {showPassword ? <Visibility /> : <VisibilityOff />}
                                       </IconButton>
                                    </InputAdornment>
                                 }
                                 inputProps={{}}
                                 fullWidth
                                 disabled={newPasswordChecked ? false : true} // DESHABILITAR CON UN CHECK
                                 // disabled={values.id == 0 ? false : true}
                                 error={errors.password && touched.password}
                              />
                              {touched.password && errors.password && (
                                 <FormHelperText error id="ht-password">
                                    {errors.password}
                                 </FormHelperText>
                              )}
                           </FormControl>
                           {strength !== 0 && (
                              <FormControl fullWidth>
                                 <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                       <Grid>
                                          <Box
                                             style={{ backgroundColor: level?.color }}
                                             sx={{
                                                width: 85,
                                                height: 8,
                                                borderRadius: "7px"
                                             }}
                                          />
                                       </Grid>
                                       <Grid>
                                          <Typography variant="subtitle1" fontSize="0.75rem">
                                             {level?.label}
                                          </Typography>
                                       </Grid>
                                    </Grid>
                                 </Box>
                              </FormControl>
                           )}
                        </Grid> */}

                        {/* Divisor */}
                        <Grid xs={12}>
                           <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
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
                              error={(errors.payroll_number && touched.payroll_number) || (errors.payroll_number_exist && touched.payroll_number_exist)}
                              helperText={
                                 (errors.payroll_number && touched.payroll_number && errors.payroll_number) ||
                                 (errors.payroll_number_exist && touched.payroll_number_exist && errors.payroll_number_exist)
                              }
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

                        {/* Departameto */}
                        <Grid xs={12} md={8} sx={{ mb: 1 }}>
                           <TextField
                              id="department"
                              name="department"
                              label="Departamento *"
                              type="text"
                              value={values.department}
                              placeholder="Ingresa tu departamento"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "department", true)}
                              InputProps={{ disabled: true }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.department && touched.department}
                              helperText={errors.department && touched.department && errors.department}
                           />
                           {/* <Select2Component
                           idName={"department_id"}
                           label={"Departameto *"}
                           valueLabel={values.department}
                           values={values}
                           formData={formData}
                           setFormData={setFormData}
                           formDataLabel={"department"}
                           placeholder={"Selecciona una opción..."}
                           options={departments}
                           fullWidth={true}
                           handleChange={handleChange}
                           // handleChangeValueSuccess={handleChangeRole}
                           setValues={setValues}
                           handleBlur={handleBlur}
                           error={errors.department_id}
                           touched={touched.department_id}
                           disabled={false}
                        /> */}
                        </Grid>
                        {/* Divisor */}
                        {/* <Grid xs={12}>
                        <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                     </Grid> */}

                        {/* Nombre */}
                        <Grid xs={12} md={12} sx={{ mb: 2 }}>
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
                              InputProps={{ disabled: true }}
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
                              InputProps={{ disabled: true }}
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
                              InputProps={{ disabled: true }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.maternal_last_name && touched.maternal_last_name}
                              helperText={errors.maternal_last_name && touched.maternal_last_name && errors.maternal_last_name}
                           />
                        </Grid>
                        {/* Divisor */}
                        <Grid xs={12}>
                           <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                        </Grid>
                        {/* Correo Electronico */}
                        <Grid xs={12} md={12} sx={{ mb: 1 }}>
                           <TextField
                              id="email"
                              name="email"
                              label="Actvidad *"
                              type="text"
                              value={values.email}
                              placeholder="1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "email", false)}
                              // inputProps={{ maxLength: 2 }}
                              fullWidth
                              multiline
                              rows={3}
                              // disabled={values.id == 0 ? false : true}
                              error={errors.email && touched.email}
                              helperText={errors.email && touched.email && errors.email}
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
