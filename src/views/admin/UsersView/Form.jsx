import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, Divider, FormControlLabel, InputLabel, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { handleInputFormik } from "../../../utils/Formats";
import { OutlinedInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { strengthColor, strengthIndicator } from "../../../utils/password-strength";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import DatePickerComponent from "../../../components/Form/DatePickerComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const UserForm = ({ dataRoles, dataDepartments }) => {
   // #region Boton de Contraseña
   const [showPassword, setShowPassword] = useState(false);
   const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(true);

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
   const { user, resetUser, singularName, createUser, updateUser, formData, setFormData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } = useUserContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [isAdmin, setIsAdmin] = useState(false);
   const [isGarage, setIsGarage] = useState(false);
   const [newPasswordChecked, setNewPasswordChecked] = useState(true);

   const handleChangeRole = (value2, setFieldValue) => {
      try {
         // console.log("amanas", value2);
         setIsAdmin(false);
         setIsGarage(false);
         const role_id = Number(value2.id);
         setIsAdmin(role_id <= 2 ? true : false);
         setIsGarage(role_id == 4 ? true : false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
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

         values.num_int = values.num_int === "" ? "S/N" : values.num_int;
         setFormData(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createUser(values);
         else axiosResponse = await updateUser(values);
         // if (axiosResponse.message == "duplicate") return Toast.Info("hola");
         if (axiosResponse.status_code == 200) {
            resetForm();
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
         resetForm();
         resetUser();
         user.role = "Selecciona una opción...";
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
               values,
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
         setIsAdmin(formData.role_id <= 2 ? true : false);
         setIsGarage(formData.role_id == 4 ? true : false);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         resetUser();
         user.role = "Selecciona una opción...";
         setStrength(0);
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchemas = () => {
      let validationSchema = Yup.object().shape({
         username: Yup.string().trim().required("Nombre de usario requerido"),
         email: Yup.string().trim().email("Formato de correo no valido").required("Correo requerido"),
         password: newPasswordChecked && Yup.string().trim().min(6, "La Contraseña debe de tener mínimo 6 caracteres").required("Contraseña requerida"),
         role_id: Yup.number().min(1, "Esta opción no es valida").required("Rol requerido"),
         phone: Yup.string()
            .trim()
            .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
            .required("Número telefónico requerido"),
         license_number: Yup.string().trim().required("Número de licencia requerido"),
         license_due_date: Yup.date().required("Fecha de vencimiento requerida"),
         payroll_number: Yup.number("Solo números"),
         department_id: Yup.number().min(1, "Esta opción no es valida").required("Departamento requerido"),

         name: Yup.string().trim().required("Nombre(s) requerido"),
         paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
         maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
         // community_id:  Yup.number().trim().required("Comunidad requerida"),
         street: Yup.string().trim().required("Calle/Av. requerida"),
         num_ext: Yup.string().trim().required("Número exterior requerido"),
         // num_int: Yup.string().trim().required("Número interior requerido"),

         zip: Yup.number("Solo numeros").required("Código Postal requerido"),
         state: Yup.string().trim().required("Estado requerido"),
         city: Yup.string().trim().required("Ciudad requerido"),
         colony: Yup.string().trim().required("Colonia requerido")
      });
      if (isAdmin)
         validationSchema = Yup.object().shape({
            username: Yup.string().trim().required("Nombre de usario requerido"),
            email: Yup.string().trim().email("Formato de correo no valido").required("Correo requerido"),
            password: newPasswordChecked && Yup.string().trim().min(6, "La Contraseña debe de tener mínimo 6 caracteres").required("Contraseña requerida"),
            role_id: Yup.number().min(1, "Esta opción no es valida").required("Rol requerido")
         });
      else if (isGarage)
         validationSchema = Yup.object().shape({
            username: Yup.string().trim().required("Nombre de usario requerido"),
            email: Yup.string().trim().email("Formato de correo no valido").required("Correo requerido"),
            password: newPasswordChecked && Yup.string().trim().min(6, "La Contraseña debe de tener mínimo 6 caracteres").required("Contraseña requerida"),
            role_id: Yup.number().min(1, "Esta opción no es valida").required("Rol requerido"),
            phone: Yup.string()
               .trim()
               .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
               .required("Número telefónico requerido"),
            name: Yup.string().trim().required("Nombre(s) requerido"),
            paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
            maternal_last_name: Yup.string().trim().required("Apellido Materno requerido")
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
      <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} className={cursorLoading ? "cursor-loading" : ""}>
         <Box role="presentation" p={3} pt={5} className="form">
            <Typography variant="h2" mb={3}>
               {formTitle}
               <FormControlLabel
                  sx={{ float: "right", color: colorLabelcheck }}
                  control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                  label="Seguir Agregando"
               />
            </Typography>

            {/* VALIDAR DEPENDIENDO DEL ROL ESCOGIDO */}
            <Formik initialValues={formData} validationSchema={validationSchemas()} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                  <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                     <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />
                     {/* Rol */}
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        <Select2Component
                           idName={"role_id"}
                           label={"Rol *"}
                           valueLabel={values.role}
                           values={values}
                           formData={formData}
                           setFormData={setFormData}
                           formDataLabel={"role"}
                           placeholder={"Selecciona una opción..."}
                           options={dataRoles}
                           fullWidth={true}
                           handleChange={handleChange}
                           handleChangeValueSuccess={handleChangeRole}
                           setValues={setValues}
                           handleBlur={handleBlur}
                           error={errors.role_id}
                           touched={touched.role_id}
                           disabled={false}
                        />
                     </Grid>
                     {/* Nombre de Usuario */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <TextField
                           id="username"
                           name="username"
                           label="Nombre de usuario *"
                           type="text"
                           value={values.username}
                           placeholder="Ingrese su nombre de usuario"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           // InputProps={{ }}
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
                           label="Correo Electrónico *"
                           type="email"
                           value={values.email}
                           placeholder="mi@correo.com"
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
                     {checkedShowSwitchPassword && (
                        <Grid xs={12} md={12} sx={{ mb: -2 }}>
                           <FormControlLabel
                              control={<Switch />}
                              label="Cambiar Contraseña"
                              checked={newPasswordChecked}
                              onChange={() => setNewPasswordChecked(!newPasswordChecked)}
                           />
                        </Grid>
                     )}
                     {/* Contraseña */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
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
                     </Grid>

                     {!isAdmin && (
                        <>
                           {/* Telefono */}
                           <Grid xs={12} md={4} sx={{ mb: 1 }}>
                              <TextField
                                 id="phone"
                                 name="phone"
                                 label="Número Telefónico *"
                                 type="phone"
                                 value={values.phone}
                                 placeholder="10 dígitos"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 // fullWidth
                                 inputProps={{ maxLength: 10 }}
                                 error={errors.phone && touched.phone}
                                 helperText={errors.phone && touched.phone && errors.phone}
                              />
                           </Grid>
                        </>
                     )}
                     {!isAdmin && !isGarage && (
                        <>
                           {/* Numero de Licencia */}
                           <Grid xs={12} md={4} sx={{ mb: 1 }}>
                              <TextField
                                 id="license_number"
                                 name="license_number"
                                 label="Número de Licencia *"
                                 type="text"
                                 value={values.license_number}
                                 placeholder="99999999999"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 // fullWidth
                                 inputProps={{ maxLength: 11 }}
                                 error={errors.license_number && touched.license_number}
                                 helperText={errors.license_number && touched.license_number && errors.license_number}
                              />
                           </Grid>
                           {/* Fecha de Vencimiento */}
                           <Grid xs={12} md={4} sx={{ mb: 3 }}>
                              <DatePickerComponent
                                 idName={"license_due_date"}
                                 label={"Fecha de Vencimiento *"}
                                 format={"DD/MM/YYYY"}
                                 value={values.license_due_date}
                                 setFieldValue={setFieldValue}
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 error={errors.license_due_date}
                                 touched={touched.license_due_date}
                                 showErrorInput={null}
                                 formData={formData}
                              />
                           </Grid>
                           {/* Divisor */}
                           <Grid xs={12}>
                              <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                           </Grid>
                           {/* Número de Nómina */}
                           <Grid xs={12} md={4} sx={{ mb: 1 }}>
                              <TextField
                                 id="payroll_number"
                                 name="payroll_number"
                                 label="Número de Nómina *"
                                 type="number"
                                 value={values.payroll_number}
                                 placeholder="99999"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 fullWidth
                                 // inputProps={{ maxLength: 11 }}
                                 error={errors.payroll_number && touched.payroll_number}
                                 helperText={errors.payroll_number && touched.payroll_number && errors.payroll_number}
                              />
                           </Grid>
                           {/* Departameto */}
                           <Grid xs={12} md={8} sx={{ mb: 1 }}>
                              <Select2Component
                                 idName={"department_id"}
                                 label={"Departameto *"}
                                 valueLabel={values.department}
                                 values={values}
                                 formData={formData}
                                 setFormData={setFormData}
                                 formDataLabel={"department"}
                                 placeholder={"Selecciona una opción..."}
                                 options={dataDepartments}
                                 fullWidth={true}
                                 handleChange={handleChange}
                                 // handleChangeValueSuccess={handleChangeRole}
                                 setValues={setValues}
                                 handleBlur={handleBlur}
                                 error={errors.department_id}
                                 touched={touched.department_id}
                                 disabled={false}
                              />
                           </Grid>
                           {/* Divisor */}
                           <Grid xs={12}>
                              <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                           </Grid>
                        </>
                     )}

                     {!isAdmin && (
                        <>
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
                                 // InputProps={{ }}
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
                                 // InputProps={{ }}
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
                                 // InputProps={{ }}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 error={errors.maternal_last_name && touched.maternal_last_name}
                                 helperText={errors.maternal_last_name && touched.maternal_last_name && errors.maternal_last_name}
                              />
                           </Grid>
                        </>
                     )}

                     {!isAdmin && !isGarage && (
                        <>
                           {/* Divisor */}
                           <Grid xs={12}>
                              <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                           </Grid>

                           <InputsCommunityComponent
                              formData={formData}
                              setFormData={setFormData}
                              values={values}
                              setValues={setValues}
                              setFieldValue={setFieldValue}
                              handleChange={handleChange}
                              handleBlur={handleBlur}
                              errors={errors}
                              touched={touched}
                           />
                        </>
                     )}

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
                        <Button type="reset" variant="outlined" color="error" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleCancel(resetForm)}>
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
                  </Grid>
               )}
            </Formik>
         </Box>
      </SwipeableDrawer>
   );
};
export default UserForm;
