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
import { useMemo, useRef, useState } from "react";
import { useVehicleContext } from "../../context/VehicleContext";
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
import { Axios } from "../../context/AuthContext";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const VehicleForm = ({ dataBrands, dataVehicleStatus }) => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   const { singularName, createVehicle, updateVehicle, formData, setFormData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } = useVehicleContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const [dataModels, setDataModels] = useState([]);
   const [imageFile, setImageFile] = useState(null);

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
         console.log("el imageFile", imageFile);
         values.imgFile = imageFile;
         console.log(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createVehicle(values);
         else axiosResponse = await updateVehicle(values);
         if (axiosResponse.status_code == 200) {
            resetForm();
            setTextBtnSumbit("AGREGAR");
            setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         }
         setDataModels([]);
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
         setDataModels([]);
         setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = async (setValues, setFieldValue) => {
      try {
         setLoadingAction(true);
         if (!formData.description) formData.description = "";
         setValues(formData);
         await handleChangeBrands(formData.brand_id, setFieldValue);
         setFieldValue("model_id", formData.model_id);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchema = Yup.object().shape({
      stock_number: Yup.number("Solo números").required("Número de Inventario requerido"),
      brand_id: Yup.number("Esta opción no es valida").min(1, "Esta opción no es valida").required("Marca requerida"),
      model_id: Yup.number("Esta opción no es valida").min(1, "Esta opción no es valida").required("Modelo requerido"),
      year: Yup.number("Solo números")
         .min(1900, "El año esta fuera del rango permitido")
         .max(new Date().getFullYear() + 1, "El año esta fuera del rango permitido")
         .required("Año del modelo requerido"),
      registration_date: Yup.date("Fecha invalida").required("Fecha de registro requerida"),
      vehicle_status_id: Yup.number("Esta opción no es valida").required("Nombre de la marca requerido"),

      plates: Yup.string()
         .trim()
         .matches(/^[A-Z]{3}-[0-9]{2}-[0-9]{2}$/, "Formato invalido: XXX-00-00")
         .required("Placas requeridas"),
      initial_date: Yup.date().required("Fecha de Alta de Placas requerida"),
      due_date: Yup.date().required("Fecha de Vencimiento de Placas requerida")
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

   const showErrorAndFocusInput = (indexInputRef, msg, formHelperText = false) => {
      if (formHelperText) {
         return (
            <FormHelperText error id="ht-disability_id">
               {msg}
            </FormHelperText>
         );
      }
      return msg;
   };

   const handleChangeBrands = async (brand_id, setFieldValue) => {
      setDataModels([]);
      setFieldValue("model_id", 0);
      const axiosModels = await Axios.get(`models/brand/${brand_id}`);
      const response = axiosModels.data.data.result;
      if (response.length == 0) return;
      setDataModels(response);
   };

   const handleChangeYear = (e, setFieldValue) => {
      let inputValue = e.target.value;

      if (inputValue.length > 4) inputValue = inputValue.slice(0, 4);
      setFieldValue("year", inputValue);
   };

   const handleChangeImg = (e, setFieldValue) => {
      const file = e.target.files[0]; // Obtenemos el primer archivo del campo de entrada
      setImageFile(file);
   };

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
            </Typography>
            <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                  <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                     <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />
                     {/* No. Inventario */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <TextField
                           id="stock_number"
                           name="stock_number"
                           label="No. Inventario *"
                           type="number"
                           value={values.stock_number}
                           placeholder="Ingrese el número de inventario"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           // onInput={(e) => handleInput(e, setFieldValue, "stock_number", true)}
                           // InputProps={{ }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[0] = el)}
                           // inputRef={inputRefVehicle}
                           error={errors.stock_number && touched.stock_number}
                           helperText={errors.stock_number && touched.stock_number && errors.stock_number}
                        />
                     </Grid>
                     {/* Marca */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <FormControl fullWidth>
                           {/* <Autocomplete
                              disablePortal
                              openOnFocus
                              id="brand_id"
                              name="brand_id"
                              label="Marca"
                              // labelId="brand_id-label"
                              placeholder="Marca"
                              options={dataBrands}
                              // getOptionLabel={(option) => option.text}
                              // isOptionEqualToValue={customIsOptionEqualToValue}
                              renderInput={(params) => <TextField {...params} label="Marca *" />}
                              value={values.brand_id}
                              // componentName="brand_id"
                              onChange={(e, newValue) => {
                                 handleChange(e);
                                 handleChangeR("brand_id", newValue, setValues);
                              }}
                              onBlur={handleBlur}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.brand_id && touched.brand_id}
                              // value={"PRIMARIA"}
                           /> */}
                           {/* <Select2
                              id="brand_id"
                              name="brand_id"
                              label="Marca"
                              components={<Select />}
                              labelId="brand_id-label"
                              value={values.brand_id}
                              placeholder="Marca"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.brand_id && touched.brand_id}
                              // className="basic-single"
                              // classNamePrefix="select"
                              // defaultValue={dataBrands[0]}
                              isDisabled={isDisabled}
                              isLoading={isLoading}
                              isClearable={isClearable}
                              isRtl={isRtl}
                              isSearchable={isSearchable}
                              getOptionLabel={(option) => option.text}
                              options={dataBrands}
                           /> */}
                           <InputLabel id="brand_id-label">Marca *</InputLabel>
                           <Select
                              id="brand_id"
                              name="brand_id"
                              label="Marca"
                              labelId="brand_id-label"
                              value={values.brand_id}
                              placeholder="Marca"
                              onChange={(e) => {
                                 handleChange(e);
                                 handleChangeBrands(e.target.value, setFieldValue);
                              }}
                              onBlur={handleBlur}
                              error={errors.brand_id && touched.brand_id}
                           >
                              <MenuItem value={0}>Seleccione una opción...</MenuItem>
                              {dataBrands &&
                                 dataBrands.map((d) => (
                                    <MenuItem key={d.value} value={d.value}>
                                       {d.text}
                                    </MenuItem>
                                 ))}
                           </Select>
                           {touched.brand_id && errors.brand_id && (
                              <FormHelperText error id="ht-brand_id">
                                 {errors.brand_id}
                              </FormHelperText>
                           )}
                        </FormControl>
                     </Grid>
                     {/* Modelo */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <FormControl fullWidth>
                           {/* <Autocomplete
                              disablePortal
                              openOnFocus
                              id="model_id"
                              name="model_id"
                              label="Modelo"
                              // labelId="model_id-label"
                              placeholder="Modelo"
                              options={dataModels}
                              // getOptionLabel={(option) => option.text}
                              // isOptionEqualToValue={customIsOptionEqualToValue}
                              renderInput={(params) => <TextField {...params} label="Modelo *" />}
                              value={values.model_id}
                              // componentName="model_id"
                              onChange={(e, newValue) => {
                                 handleChange(e);
                                 handleChangeR("model_id", newValue, setValues);
                              }}
                              onBlur={handleBlur}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.model_id && touched.model_id}
                              // value={"PRIMARIA"}
                           /> */}
                           {/* <Select2
                              id="model_id"
                              name="model_id"
                              label="Modelo"
                              components={<Select />}
                              labelId="model_id-label"
                              value={values.model_id}
                              placeholder="Modelo"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.model_id && touched.model_id}
                              // className="basic-single"
                              // classNamePrefix="select"
                              // defaultValue={dataModels[0]}
                              isDisabled={isDisabled}
                              isLoading={isLoading}
                              isClearable={isClearable}
                              isRtl={isRtl}
                              isSearchable={isSearchable}
                              getOptionLabel={(option) => option.text}
                              options={dataModels}
                           /> */}
                           <InputLabel id="model_id-label">Modelo *</InputLabel>
                           <Select
                              id="model_id"
                              name="model_id"
                              label="Modelo"
                              labelId="model_id-label"
                              value={values.model_id}
                              placeholder="Modelo"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={dataModels.length == 0 ? true : false}
                              error={errors.model_id && touched.model_id}
                           >
                              <MenuItem value={0}>Seleccione una opción...</MenuItem>
                              {dataModels &&
                                 dataModels.map((d) => (
                                    <MenuItem key={d.value} value={d.value}>
                                       {d.text}
                                    </MenuItem>
                                 ))}
                           </Select>
                           {touched.model_id && errors.model_id && (
                              <FormHelperText error id="ht-model_id">
                                 {errors.model_id}
                              </FormHelperText>
                           )}
                        </FormControl>
                     </Grid>
                     {/* Año */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <TextField
                           id="year"
                           name="year"
                           label="Año *"
                           type="number"
                           value={values.year}
                           placeholder="Ingrese el año del modelo (YYYY)"
                           onChange={(e) => {
                              handleChange(e);
                              handleChangeYear(e, setFieldValue);
                           }}
                           onBlur={handleBlur}
                           // onInput={(e) => handleInput(e, setFieldValue, "year", true)}
                           inputProps={{
                              maxLength: 4, // Limita la entrada a 4 caracteres
                              min: 1900, // Establece el valor mínimo permitido (puedes ajustarlo según tus necesidades)
                              max: new Date().getFullYear() + 1
                           }}
                           // inputProps={{ maxLength: 4, pattern: /^[0-9]{4}$/ }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[0] = el)}
                           // inputRef={inputRefVehicle}
                           error={errors.year && touched.year}
                           helperText={errors.year && touched.year && errors.year}
                        />
                     </Grid>
                     {/* Fecha de Registro */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <TextField
                           id="registration_date"
                           name="registration_date"
                           label="Fecha de Registro"
                           type="date"
                           value={values.registration_date}
                           placeholder="Inserte la fecha de registro"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           // onInput={(e) => handleInput(e, setFieldValue, "registration_date", false)}
                           // inputProps={{ maxLength: 1500 }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[1] = el)}
                           error={errors.registration_date && touched.registration_date}
                           helperText={errors.registration_date && touched.registration_date && errors.registration_date}
                        />
                     </Grid>
                     {/* Estatus */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <FormControl fullWidth>
                           {/* <Autocomplete
                              disablePortal
                              openOnFocus
                              id="vehicle_status_id"
                              name="vehicle_status_id"
                              label="Estatus"
                              // labelId="vehicle_status_id-label"
                              placeholder="Estatus"
                              options={dataVehicleStatus}
                              // getOptionLabel={(option) => option.text}
                              // isOptionEqualToValue={customIsOptionEqualToValue}
                              renderInput={(params) => <TextField {...params} label="Estatus *" />}
                              value={values.vehicle_status_id}
                              // componentName="vehicle_status_id"
                              onChange={(e, newValue) => {
                                 handleChange(e);
                                 handleChangeR("vehicle_status_id", newValue, setValues);
                              }}
                              onBlur={handleBlur}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.vehicle_status_id && touched.vehicle_status_id}
                              // value={"PRIMARIA"}
                           /> */}
                           {/* <Select2
                              id="vehicle_status_id"
                              name="vehicle_status_id"
                              label="Estatus"
                              components={<Select />}
                              labelId="vehicle_status_id-label"
                              value={values.vehicle_status_id}
                              placeholder="Estatus"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.vehicle_status_id && touched.vehicle_status_id}
                              // className="basic-single"
                              // classNamePrefix="select"
                              // defaultValue={dataVehicleStatus[0]}
                              isDisabled={isDisabled}
                              isLoading={isLoading}
                              isClearable={isClearable}
                              isRtl={isRtl}
                              isSearchable={isSearchable}
                              getOptionLabel={(option) => option.text}
                              options={dataVehicleStatus}
                           /> */}
                           <InputLabel id="vehicle_status_id-label">Estatus *</InputLabel>
                           <Select
                              id="vehicle_status_id"
                              name="vehicle_status_id"
                              label="Estatus"
                              labelId="vehicle_status_id-label"
                              value={values.vehicle_status_id}
                              placeholder="Estatus"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.vehicle_status_id && touched.vehicle_status_id}
                           >
                              <MenuItem value={0}>Seleccione una opción...</MenuItem>
                              {dataVehicleStatus &&
                                 dataVehicleStatus.map((d) => (
                                    <MenuItem
                                       key={d.value}
                                       value={d.value} /* <sx={{ backgroundColor: d.bg_color, color: d.letter_black ? "#3E3E3E" : "#F3F3F3" }}> */
                                    >
                                       {d.text}
                                    </MenuItem>
                                 ))}
                           </Select>
                           {touched.vehicle_status_id && errors.vehicle_status_id && (
                              <FormHelperText error id="ht-vehicle_status_id">
                                 {errors.vehicle_status_id}
                              </FormHelperText>
                           )}
                        </FormControl>
                     </Grid>
                     {/* Descripcion */}
                     <Grid xs={12} md={12} sx={{ mb: 2 }}>
                        <TextField
                           id="description"
                           name="description"
                           label="Descripción"
                           type="text"
                           value={values.description}
                           placeholder="Inserte una breve descripción de la marca"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           // onInput={(e) => handleInput(e, setFieldValue, "description", false)}
                           inputProps={{ maxLength: 1500 }}
                           fullWidth
                           multiline
                           rows={3}
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[1] = el)}
                           error={errors.description && touched.description}
                           helperText={errors.description && touched.description && errors.description}
                        />
                     </Grid>

                     {/* Imagen */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <TextField
                           id="img_path"
                           name="img_path"
                           label="Foto del Vehículo *"
                           type="file"
                           value={values.img_path}
                           placeholder="Ingrese el número de inventario"
                           onChange={(e) => {
                              handleChange(e);
                              handleChangeImg(e, setFieldValue);
                           }}
                           onBlur={handleBlur}
                           // onInput={(e) => handleInput(e, setFieldValue, "img_path", true)}
                           // InputProps={{ }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[0] = el)}
                           // inputRef={inputRefVehicle}
                           error={errors.img_path && touched.img_path}
                           helperText={errors.img_path && touched.img_path && errors.img_path}
                        />
                     </Grid>

                     {/* Separador */}
                     <Grid xs={12}>
                        <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                     </Grid>

                     {/* Placas */}
                     <Grid xs={12} md={12} sx={{ mb: 2 }}>
                        <TextField
                           id="plates"
                           name="plates"
                           label="Placas"
                           type="text"
                           value={values.plates}
                           placeholder="Inserte las placas del vehículo"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInput(e, setFieldValue, "plates", true)}
                           inputProps={{ maxLength: 9 }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[1] = el)}
                           error={errors.plates && touched.plates}
                           helperText={errors.plates && touched.plates && errors.plates}
                        />
                     </Grid>
                     {/* Fecha de Plaqueo */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <TextField
                           id="initial_date"
                           name="initial_date"
                           label="Fecha de Plaqueo"
                           type="date"
                           value={values.initial_date}
                           placeholder=""
                           onChange={handleChange}
                           onBlur={handleBlur}
                           // onInput={(e) => handleInput(e, setFieldValue, "initial_date", false)}
                           // inputProps={{ maxLength: 1500 }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[1] = el)}
                           error={errors.initial_date && touched.initial_date}
                           helperText={errors.initial_date && touched.initial_date && errors.initial_date}
                        />
                     </Grid>
                     {/* Fecha Expiracion de Placas */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <TextField
                           id="due_date"
                           name="due_date"
                           label="Fecha Expiración de Placas"
                           type="date"
                           value={values.due_date}
                           placeholder=""
                           onChange={handleChange}
                           onBlur={handleBlur}
                           // onInput={(e) => handleInput(e, setFieldValue, "due_date", false)}
                           // inputProps={{ maxLength: 1500 }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[1] = el)}
                           error={errors.due_date && touched.due_date}
                           helperText={errors.due_date && touched.due_date && errors.due_date}
                        />
                     </Grid>

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
export default VehicleForm;
