import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   Autocomplete,
   Backdrop,
   Button,
   CircularProgress,
   Divider,
   FormControlLabel,
   FormLabel,
   InputLabel,
   MenuItem,
   Radio,
   RadioGroup,
   Select,
   Switch,
   TextField,
   Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useMemo, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import Select2 from "react-select";
import { formatToLowerCase, formatToUpperCase } from "../../utils/Formats";
import { OutlinedInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { strengthColor, strengthIndicator } from "../../utils/password-strength";
import axios from "axios";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const UserForm = ({ dataRoles, dataDepartments }) => {
   // #region Boton de Contraseña
   const [showPassword, setShowPassword] = useState(false);
   const [checked, setChecked] = useState(true);

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

   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   const { singularName, createUser, updateUser, formData, setFormData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } = useUserContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [isAdmin, setIsAdmin] = useState(false);

   const [disabledState, setDisabledState] = useState(true);
   const [disabledCity, setDisabledCity] = useState(true);
   const [disabledColony, setDisabledColony] = useState(false);
   const [showLoading, setShowLoading] = useState(false);
   const [dataStates, setDataStates] = useState([]);
   const [dataCities, setDataCities] = useState([]);
   const [dataColonies, setDataColonies] = useState([]);

   // Función personalizada para comparar opciones y valores
   const customIsOptionEqualToValue = (option, value) => {
      // Personaliza la comparación según tus necesidades
      console.log("holaa ress: option->", option.value);
      console.log("holaa ress: value->", value);
      return option.value === value; // Por ejemplo, compara por el campo 'id'
   };

   const handleChangeRole = (value) => {
      try {
         setIsAdmin(false);
         const role_id = Number(value);
         setIsAdmin(role_id <= 2 ? true : false);
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
         // console.log(values);
         values.community_id = values.colony;

         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createUser(values);
         else axiosResponse = await updateUser(values);
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
         setStrength(0);
         setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = async (setValues, setFieldValue) => {
      try {
         setLoadingAction(true);
         if (formData.community_id > 0) await getCommunityByZip(formData.zip, setFieldValue, formData.community_id);
         setValues(formData);
         handleChangeRole(formData.role_id);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         setStrength(0);
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   // const options = [
   // 	{ label: "The Godfather", id: 1 },
   // 	{ label: "Pulp Fiction", id: 2 },
   // ];
   // const handleChangeR = (input, value, setValues) => {
   //    console.log(formData);
   //    console.log("el input->", input);
   //    console.log("el value->", value);
   //    formData[input] = value.id;
   //    console.log(formData);
   //    setValues(formData);
   // };

   const validationAdminSchema = Yup.object().shape({
      username: Yup.string().trim().required("Nombre de usario requerido"),
      email: Yup.string().trim().email("Formato de correo no valido").required("Correo requerido"),
      password: Yup.string().trim().min(6, "La Contraseña debe de tener mínimo 6 caracteres").required("Contraseña requerida"),
      role_id: Yup.number().min(1, "Esta opción no es valida").required("Rol requerido")
   });
   const validationSchema = Yup.object().shape({
      username: Yup.string().trim().required("Nombre de usario requerido"),
      email: Yup.string().trim().email("Formato de correo no valido").required("Correo requerido"),
      password: Yup.string().trim().min(6, "La Contraseña debe de tener mínimo 6 caracteres").required("Contraseña requerida"),
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

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   const handleInput = async (e, setFieldValue, input, toUpper = true) => {
      try {
         const newText = toUpper ? await formatToUpperCase(e) : await formatToLowerCase(e);
         setFieldValue(input, newText);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const getCommunityByZip = async (zip, setFieldValue, community_id = null) => {
      try {
         setShowLoading(true);
         setDisabledState(true);
         setDisabledCity(true);
         setDisabledColony(true);
         let states = [];
         let cities = [];
         let colonies = [];
         setDataStates(states);
         setDataCities(cities);
         setDataColonies(colonies);
         setFieldValue("state", 0);
         setFieldValue("city", 0);
         setFieldValue("colony", 0);
         if (community_id) {
            const axiosMyCommunity = axios;
            const { data } = await axiosMyCommunity.get(`https://api.gomezpalacio.gob.mx/api/cp/colonia/${community_id}`);

            if (data.data.status_code != 200) return Toast.Error(data.data.alert_text);
            formData.zip = data.data.result.CodigoPostal;
            formData.state = data.data.result.Estado;
            formData.city = data.data.result.Municipio;
            formData.colony = community_id;
            await setFormData(formData);
            zip = formData.zip;
         }
         const axiosCommunities = axios;
         const axiosRes = await axiosCommunities.get(`https://api.gomezpalacio.gob.mx/api/cp/${zip}`);
         if (axiosRes.data.data.status_code != 200) return Toast.Error(axiosRes.data.data.alert_text);
         await axiosRes.data.data.result.map((d) => {
            states.push(d.Estado);
            cities.push(d.Municipio);
            colonies.push({ id: d.id, Colonia: d.Colonia });
         });
         states = [...new Set(states)];
         cities = [...new Set(cities)];
         colonies = [...new Set(colonies)];

         if (states.length == 0) {
            setShowLoading(false);
            return Toast.Info("No hay comunidades registradas con este C.P.");
         }
         if (states.length > 1) setDisabledState(false);
         if (cities.length > 1) setDisabledCity(false);
         if (colonies.length > 1) setDisabledColony(false);
         setDataStates(states);
         setDataCities(cities);
         setDataColonies(colonies);
         setFieldValue("zip", community_id ? formData.zip : zip);
         setFieldValue("state", community_id ? formData.state : states[0]);
         setFieldValue("city", community_id ? formData.city : cities[0]);
         setFieldValue("colony", community_id ? community_id : colonies[0]["id"]);
         setShowLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
         setShowLoading(false);
      }
   };

   // const selectedValues = useMemo(() => dataRoles.filter((v) => v.selected), [
   // 	dataRoles,
   // ]);
   // const [isClearable, setIsClearable] = useState(true);
   // const [isSearchable, setIsSearchable] = useState(true);
   // const [isDisabled, setIsDisabled] = useState(false);
   // const [isLoading, setIsLoading] = useState(false);
   // const [isRtl, setIsRtl] = useState(false);

   return (
      <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
         <Box role="presentation" p={3} pt={5} className="form">
            <Typography variant="h2" mb={3}>
               {formTitle}
               <FormControlLabel
                  sx={{ float: "right", color: colorLabelcheck }}
                  control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                  label="Seguir Agregando"
               />
            </Typography>{" "}
            {/* VALIDAR DEPENDIENDO DEL ROL ESCOGIDO */}
            <Formik initialValues={formData} validationSchema={isAdmin ? validationAdminSchema : validationSchema} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                  <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                     <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />
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
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <TextField
                           id="email"
                           name="email"
                           label="Correo Electrónico *"
                           type="email"
                           value={values.email}
                           placeholder="mi@correo.com"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInput(e, setFieldValue, "email", false)}
                           // inputProps={{ maxLength: 2 }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           error={errors.email && touched.email}
                           helperText={errors.email && touched.email && errors.email}
                        />
                     </Grid>
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
                              // disabled={values.id == 0 ? false : true} DESHABILITAR CON UN CHECK
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

                     {/* Rol */}
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        <FormControl fullWidth>
                           {/* <Autocomplete
                              disablePortal
                              openOnFocus
                              id="role_id"
                              name="role_id"
                              label="Rol"
                              // labelId="role_id-label"
                              placeholder="Rol"
                              options={dataRoles}
                              // getOptionLabel={(option) => option.text}
                              // isOptionEqualToValue={customIsOptionEqualToValue}
                              renderInput={(params) => <TextField {...params} label="Rol *" />}
                              value={values.role_id}
                              // componentName="role_id"
                              onChange={(e, newValue) => {
                                 handleChange(e);
                                 handleChangeR("role_id", newValue, setValues);
                              }}
                              onBlur={handleBlur}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.role_id && touched.role_id}
                              // value={"PRIMARIA"}
                           /> */}
                           {/* <Select2
                              id="role_id"
                              name="role_id"
                              label="Rol"
                              components={<Select />}
                              labelId="role_id-label"
                              value={values.role_id}
                              placeholder="Rol"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.role_id && touched.role_id}
                              // className="basic-single"
                              // classNamePrefix="select"
                              // defaultValue={dataRoles[0]}
                              isDisabled={isDisabled}
                              isLoading={isLoading}
                              isClearable={isClearable}
                              isRtl={isRtl}
                              isSearchable={isSearchable}
                              getOptionLabel={(option) => option.text}
                              options={dataRoles}
                           /> */}
                           <InputLabel id="role_id-label">Rol *</InputLabel>
                           <Select
                              id="role_id"
                              name="role_id"
                              label="Rol"
                              labelId="role_id-label"
                              value={values.role_id}
                              placeholder="Rol"
                              onChange={(e) => {
                                 handleChange(e);
                                 handleChangeRole(e.target.value);
                              }}
                              onBlur={handleBlur}
                              error={errors.role_id && touched.role_id}
                           >
                              <MenuItem value={0}>Seleccione una opción...</MenuItem>
                              {dataRoles &&
                                 dataRoles.map((d) => (
                                    <MenuItem key={d.value} value={d.value}>
                                       {d.text}
                                    </MenuItem>
                                 ))}
                           </Select>
                           {touched.role_id && errors.role_id && (
                              <FormHelperText error id="ht-role_id">
                                 {errors.role_id}
                              </FormHelperText>
                           )}
                        </FormControl>
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
                              <TextField
                                 id="license_due_date"
                                 name="license_due_date"
                                 label="Fecha de Vencimiento *"
                                 type="date"
                                 value={values.license_due_date}
                                 placeholder=""
                                 // inputProps={{ maxLength: 10 }}
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 error={errors.license_due_date && touched.license_due_date}
                                 helperText={errors.license_due_date && touched.license_due_date && errors.license_due_date}
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
                              <FormControl fullWidth>
                                 <InputLabel id="role_id-label">Departameto *</InputLabel>
                                 <Select
                                    id="department_id"
                                    name="department_id"
                                    label="Departameto"
                                    labelId="department_id-label"
                                    value={values.department_id}
                                    placeholder="Departameto"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.department_id && touched.department_id}
                                 >
                                    <MenuItem value={-1}>Seleccione una opción...</MenuItem>
                                    {dataDepartments &&
                                       dataDepartments.map((d) => (
                                          <MenuItem key={d.value} value={d.value}>
                                             {d.text}
                                          </MenuItem>
                                       ))}
                                 </Select>
                                 {touched.department_id && errors.department_id && (
                                    <FormHelperText error id="ht-department_id">
                                       {errors.department_id}
                                    </FormHelperText>
                                 )}
                              </FormControl>
                           </Grid>

                           {/* Divisor */}
                           <Grid xs={12}>
                              <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                           </Grid>

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
                                 onInput={(e) => handleInput(e, setFieldValue, "name", true)}
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
                                 onInput={(e) => handleInput(e, setFieldValue, "paternal_last_name", true)}
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
                                 onInput={(e) => handleInput(e, setFieldValue, "maternal_last_name", true)}
                                 // InputProps={{ }}
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

                           {/* community_id */}
                           <Field id="community_id" name="community_id" type="hidden" value={values.community_id} onChange={handleChange} onBlur={handleBlur} />

                           {/* Comunidad */}
                           <Grid container spacing={2} sx={{ p: 1 }}>
                              {/* C.P. */}
                              <Grid xs={12} md={6} sx={{ mb: 2 }}>
                                 <TextField
                                    id="zip"
                                    name="zip"
                                    label="Código Postal *"
                                    type="number"
                                    value={values.zip}
                                    placeholder="35000"
                                    inputProps={{ maxLength: 5 }}
                                    onChange={handleChange}
                                    onBlur={(e) => {
                                       handleBlur(e);
                                       getCommunityByZip(e.target.value, setFieldValue);
                                    }}
                                    fullWidth
                                    // disabled={values.id == 0 ? false : true}
                                    error={errors.zip && touched.zip}
                                    helperText={errors.zip && touched.zip && errors.zip}
                                 />
                              </Grid>
                              {/* Estado */}
                              <Grid xs={12} md={6} sx={{ mb: 2 }}>
                                 <FormControl fullWidth>
                                    <InputLabel id="state-label">Estado</InputLabel>
                                    <Select
                                       id="state"
                                       name="state"
                                       label="Estado"
                                       labelId="state-label"
                                       value={values.state}
                                       placeholder="Estado"
                                       // readOnly={true}
                                       disabled={disabledState}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       error={errors.state && touched.state}
                                    >
                                       <MenuItem value={0} disabled>
                                          Seleccione una opción...
                                       </MenuItem>
                                       {dataStates &&
                                          dataStates.map((d, i) => (
                                             <MenuItem key={i} value={d}>
                                                {d}
                                             </MenuItem>
                                          ))}
                                    </Select>
                                    {touched.state && errors.state && errors.state}
                                 </FormControl>
                              </Grid>
                              {showLoading && <CircularProgress disableShrink sx={{ position: "absolute", left: "47%", mt: 7 }} />}
                              {/* Ciduad */}
                              <Grid xs={12} md={6} sx={{ mb: 2 }}>
                                 <FormControl fullWidth>
                                    <InputLabel id="city-label">Ciudad</InputLabel>
                                    <Select
                                       id="city"
                                       name="city"
                                       label="Ciudad"
                                       labelId="city-label"
                                       value={values.city}
                                       placeholder="Ciudad"
                                       // readOnly={true}
                                       disabled={disabledCity}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       error={errors.city && touched.city}
                                    >
                                       <MenuItem value={0} disabled>
                                          Seleccione una opción...
                                       </MenuItem>
                                       {dataCities &&
                                          dataCities.map((d, i) => (
                                             <MenuItem key={i} value={d}>
                                                {d}
                                             </MenuItem>
                                          ))}
                                    </Select>
                                    {touched.city && errors.city && errors.city}
                                 </FormControl>
                              </Grid>
                              {/* Colonia */}
                              <Grid xs={12} md={6} sx={{ mb: 2 }}>
                                 <FormControl fullWidth>
                                    <InputLabel id="colony-label">Colonia</InputLabel>
                                    <Select
                                       id="colony"
                                       name="colony"
                                       label="Colonia"
                                       labelId="colony-label"
                                       value={values.colony}
                                       placeholder="Colonia"
                                       // readOnly={true}
                                       disabled={disabledColony}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       error={errors.colony && touched.colony}
                                    >
                                       <MenuItem value={0} disabled>
                                          Seleccione una opción...
                                       </MenuItem>
                                       {dataColonies &&
                                          dataColonies.map((d, i) => (
                                             <MenuItem key={i} value={d.id}>
                                                {d.Colonia}
                                             </MenuItem>
                                          ))}
                                    </Select>
                                    {touched.colony && errors.colony && errors.colony}
                                 </FormControl>
                              </Grid>
                           </Grid>
                           {/* Calle */}
                           <Grid xs={12} md={8} sx={{ mb: 2 }}>
                              <TextField
                                 id="street"
                                 name="street"
                                 label="Calle *"
                                 type="text"
                                 value={values.street}
                                 placeholder="Calle de las Garzas"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 onInput={(e) => handleInput(e, setFieldValue, "street", true)}
                                 error={errors.street && touched.street}
                                 helperText={errors.street && touched.street && errors.street}
                              />
                           </Grid>
                           {/* No. Ext. */}
                           <Grid xs={12} md={2} sx={{ mb: 2 }}>
                              <TextField
                                 id="num_ext"
                                 name="num_ext"
                                 label="No. Ext. *"
                                 type="text"
                                 value={values.num_ext}
                                 placeholder="S/N"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 fullWidth
                                 onInput={(e) => handleInput(e, setFieldValue, "num_ext", true)}
                                 // disabled={values.id == 0 ? false : true}
                                 error={errors.num_ext && touched.num_ext}
                                 helperText={errors.num_ext && touched.num_ext && errors.num_ext}
                              />
                           </Grid>
                           {/* No. Int. */}
                           <Grid xs={12} md={2} sx={{ mb: 2 }}>
                              <TextField
                                 id="num_int"
                                 name="num_int"
                                 label="No. Int."
                                 type="text"
                                 value={values.num_int}
                                 placeholder="S/N"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 fullWidth
                                 onInput={(e) => handleInput(e, setFieldValue, "num_int", true)}
                                 // disabled={values.id == 0 ? false : true}
                                 error={errors.num_int && touched.num_int}
                                 helperText={errors.num_int && touched.num_int && errors.num_int}
                              />
                           </Grid>

                           {/* Local o Foraneo */}
                           {/* <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        <FormControl fullWidth sx={{ alignItems: "center" }}>
                           <FormLabel id="loc_for-label">Ubicacion de escuela</FormLabel>
                           <RadioGroup
                              row
                              aria-labelledby="loc_for-label"
                              id="loc_for"
                              name="loc_for"
                              value={values.loc_for}
                              onChange={handleChange}
                              onBlur={handleBlur}
                           >
                              <FormControlLabel value="1" control={<Radio />} label="Local" />
                              <FormControlLabel value="0" control={<Radio />} label="Foranea" />
                           </RadioGroup>
                           {touched.loc_for && errors.loc_for && (
                              <FormHelperText error id="ht-loc_for">
                                 {errors.loc_for}
                              </FormHelperText>
                           )}
                        </FormControl>
                           </Grid> */}
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
                        <Button
                           type="reset"
                           variant="outlined"
                           color="secondary"
                           fullWidth
                           size="large"
                           sx={{ mt: 1 }}
                           onClick={() => handleReset(resetForm, setFieldValue, values.id)}
                        >
                           LIMPIAR
                        </Button>
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
                        onClick={() => handleModify(setValues, setFieldValue)}
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
