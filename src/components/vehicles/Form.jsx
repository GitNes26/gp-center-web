import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, Divider, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useState } from "react";
import { useVehicleContext } from "../../context/VehicleContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import { handleInputFormik } from "../../utils/Formats";
import { Axios } from "../../context/AuthContext";
import InputFileComponent from "../Form/InputFileComponent";
import Select2Component from "../Form/Select2Component";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const VehicleForm = ({ dataBrands, dataVehicleStatus }) => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer, cursorLoading } = useGlobalContext();
   const {
      singularName,
      createVehicle,
      updateVehicle,
      formData,
      setFormData,
      resetFormData,
      textBtnSubmit,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      imgFile,
      setImgFile,
      imagePreview,
      setImagePreview
   } = useVehicleContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const [changePlates, setChangePlates] = useState(false);
   const [dataModels, setDataModels] = useState([]);
   const [modifying, setModifying] = useState(false);

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

   const getModelsByBrand = async (valuesBrand, setValues, valuesModel = null) => {
      try {
         console.log(valuesBrand, valuesModel);
         formData.model_id = 0;
         formData.model = "Selecciona una opción...";
         setDataModels([]);
         const axiosModels = await Axios.get(`models/brand/${valuesBrand.id}`);
         const result = await axiosModels.data.data.result;
         result.unshift({ id: 0, label: "Selecciona una opción..." });
         if (result.length < 2) Toast.Info(`No hay modelos de la marca: ${valuesBrand.label}`);
         setDataModels(result);
         formData.model_id = valuesModel == null ? 0 : valuesModel.id;
         formData.model = valuesModel == null ? "Selecciona una opción..." : valuesModel.label;
         // setFormData(formData);
         // setValues(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleChangeBrands = async (value2, setValues2) => {
      try {
         console.log("cambio de brand - value2:", value2);
         if (typeof value2 === "object") getModelsByBrand(value2, setValues2);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleChangeYear = (e, setFieldValue) => {
      let inputValue = e.target.value;

      if (inputValue.length > 4) inputValue = inputValue.slice(0, 4);
      setFieldValue("year", inputValue);
   };

   const handleChangeImg = (e, setFieldValue) => {
      const file = e.target.files[0]; // Obtenemos el primer archivo del campo de entrada
      setImgFile(file);
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm, setFieldValue }) => {
      try {
         console.log("el imgFile", imgFile);
         values.imgFile = imgFile;
         values.changePlates = changePlates;
         console.log(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createVehicle(values);
         else axiosResponse = await updateVehicle(values);
         if (axiosResponse.status_code == 200) {
            resetForm();
            resetFormData();
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
         resetFormData();
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
         console.log(formData);
         if (formData.description) !formData.description && (formData.description = "");
         setValues(formData);
         console.log("editarrrr", formData);
         const valuesBrnad = { id: formData.brand_id, label: formData.brand };
         const valuesModel = { id: formData.model_id, label: formData.model };
         await getModelsByBrand(valuesBrnad, setValues, valuesModel);
         setImgFile(`${import.meta.env.VITE_HOST}/${formData.img_path}`);
         setImagePreview(`${import.meta.env.VITE_HOST}/${formData.img_path}`);
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
         resetFormData();
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
      <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} className={cursorLoading ? "cursor-loading" : ""}>
         <Box role="presentation" p={3} pt={5} className="drawer-max-width">
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
                        <Select2Component
                           idName={"brand_id"}
                           label={"Marca *"}
                           valueLabel={values.brand}
                           values={values}
                           formData={formData}
                           setFormData={setFormData}
                           formDataLabel={"brand"}
                           placeholder={"Selecciona una opción..."}
                           options={dataBrands}
                           fullWidth={true}
                           handleChange={handleChange}
                           handleChangeValueSuccess={handleChangeBrands}
                           setValues={setValues}
                           handleBlur={handleBlur}
                           error={errors.brand_id}
                           touched={touched.brand_id}
                           disabled={false}
                        />
                     </Grid>
                     {/* Modelo */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <Select2Component
                           idName={"model_id"}
                           label={"Modelo *"}
                           valueLabel={values.model}
                           values={values}
                           formData={formData}
                           setFormData={setFormData}
                           formDataLabel={"model"}
                           placeholder={"Selecciona una opción..."}
                           options={dataModels}
                           fullWidth={true}
                           handleChange={handleChange}
                           // handleChangeValueSuccess={handleChange...}
                           setValues={setValues}
                           handleBlur={handleBlur}
                           error={errors.model_id}
                           touched={touched.model_id}
                           disabled={dataModels.length < 2 ? true : false}
                        />
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
                        <Select2Component
                           idName={"vehicle_status_id"}
                           label={"Estatus del Vehículo *"}
                           valueLabel={values.vehicle_status}
                           values={values}
                           formData={formData}
                           setFormData={setFormData}
                           formDataLabel={"vehicle_status"}
                           placeholder={"Selecciona una opción..."}
                           options={dataVehicleStatus}
                           fullWidth={true}
                           handleChange={handleChange}
                           // handleChangeValueSuccess={handleChangeRole}
                           setValues={setValues}
                           handleBlur={handleBlur}
                           error={errors.vehicle_status_id}
                           touched={touched.vehicle_status_id}
                           disabled={false}
                        />
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
                     <Grid xs={12} md={12} sx={{ mb: 2 }}>
                        <InputFileComponent
                           idName="img_path"
                           label="Foto del vehículo"
                           // value={values.img_path}
                           placeholder=""
                           setImgFile={setImgFile}
                           imagePreview={imagePreview}
                           setImagePreview={setImagePreview}
                           handleChange={handleChange}
                           handleBlur={handleBlur}
                           setFieldValue={setFieldValue}
                           error={errors.img_path}
                           touched={touched.img_path}
                        />
                        {/* <TextField
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
                        /> */}
                     </Grid>

                     {/* Separador */}
                     <Grid xs={12}>
                        <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                     </Grid>

                     {/* Switch para replaquear */}
                     <Grid xs={12} md={12} sx={{ mb: -2 }}>
                        <FormControlLabel control={<Switch />} label="Replaquear" checked={changePlates} onChange={() => setChangePlates(!changePlates)} />
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
                           onInput={(e) => handleInputFormik(e, setFieldValue, "plates", true)}
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
