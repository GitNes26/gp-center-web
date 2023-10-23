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
import InputFileComponent, { setObjImg } from "../Form/InputFileComponent";
import Select2Component from "../Form/Select2Component";
import DatePickerComponent from "../Form/DatePickerComponent";

// import Dropzone from "dropzone";
// import "dropzone/dist/dropzone.css"; // Importa los estilos de Dropzone

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const VehicleForm = ({ dataBrands, dataVehicleStatus }) => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer, cursorLoading } = useGlobalContext();
   const { singularName, createVehicle, updateVehicle, getVehicles, formData, setFormData, resetFormData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } =
      useVehicleContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const [changePlates, setChangePlates] = useState(false);
   const [dataModels, setDataModels] = useState([]);
   const [modifying, setModifying] = useState(false);
   const [imgPreview, setImgPreview] = useState([]);
   const [imgRight, setImgRight] = useState([]);
   const [imgBack, setImgBack] = useState([]);
   const [imgLeft, setImgLeft] = useState([]);
   const [imgFront, setImgFront] = useState([]);
   const [imgInsurancePolicy, setImgInsurancePolicy] = useState([]);

   const ResetForm = async (resetForm = null) => {
      if (resetForm) await resetForm();
      await resetFormData();
      setDataModels([]);
      setImgPreview([]);
      setImgRight([]);
      setImgBack([]);
      setImgLeft([]);
      setImgFront([]);
      setImgInsurancePolicy([]);
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

   const getModelsByBrand = async (valuesBrand, setFieldValue, valuesModel = null) => {
      try {
         formData.model_id = 0;
         formData.model = "Selecciona una opción...";
         setFieldValue("model_id", 0);
         setFieldValue("model", "Selecciona una opción...");
         setDataModels([]);
         const axiosModels = await Axios.get(`models/brand/${valuesBrand.id}`);
         const result = await axiosModels.data.data.result;
         result.unshift({ id: 0, label: "Selecciona una opción..." });
         if (result.length < 2) Toast.Info(`No hay modelos de la marca: ${valuesBrand.label}`);
         setDataModels(result);
         // formData.model_id = valuesModel == null ? 0 : valuesModel.id;
         // formData.model = valuesModel == null ? "Selecciona una opción..." : valuesModel.label;
         const model_id = valuesModel == null ? 0 : valuesModel.id;
         const model = valuesModel == null ? "Selecciona una opción..." : valuesModel.label;
         setFieldValue("model_id", model_id);
         setFieldValue("model", model);
         // setFormData(formData);
         // setValues(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleChangeBrands = async (value2, setFieldValue2) => {
      try {
         // console.log("cambio de brand - value2:", value2);
         if (typeof value2 === "object") getModelsByBrand(value2, setFieldValue2);
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

   // const handleChangeImg = (e, setFieldValue) => {
   //    const file = e.target.files[0]; // Obtenemos el primer archivo del campo de entrada
   //    setImgFile(file);
   // };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm, setFieldValue }) => {
      try {
         console.log("imgPreview", imgPreview);
         values.img_preview = imgPreview[0].file;
         values.img_right = imgRight[0].file;
         values.img_back = imgBack[0].file;
         values.img_left = imgLeft[0].file;
         values.img_front = imgFront[0].file;
         values.img_insurance_policy = imgInsurancePolicy[0].file;
         values.changePlates = changePlates ? 1 : 0;

         console.log("values", values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createVehicle(values);
         else axiosResponse = await updateVehicle(values);
         if (axiosResponse.status_code == 200) {
            await ResetForm(resetForm);
            setTextBtnSumbit("AGREGAR");
            setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         }
         // console.log("formData", formData);
         // console.log("values", values);
         setDataModels([]);
         getVehicles();
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
         setLoadingAction(false);
      }
   };

   const handleReset = async (resetForm, setFieldValue, id) => {
      try {
         await ResetForm(resetForm);
         setFieldValue("id", id);
         console.log(formData);
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
         const valuesBrnad = { id: formData.brand_id, label: formData.brand };
         const valuesModel = { id: formData.model_id, label: formData.model };
         await getModelsByBrand(valuesBrnad, setFieldValue, valuesModel);

         setObjImg(formData.img_preview, setImgPreview);
         setObjImg(formData.img_right, setImgRight);
         setObjImg(formData.img_back, setImgBack);
         setObjImg(formData.img_left, setImgLeft);
         setObjImg(formData.img_front, setImgFront);
         setObjImg(formData.img_insurance_policy, setImgInsurancePolicy);

         await handleChangeBrands(formData.brand_id, setFieldValue);
         setLoadingAction(false);
         // console.log(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = async (resetForm) => {
      try {
         await ResetForm(resetForm);
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

      // insurance_policy: Yup.string().trim().required("N° Póliza de Seguro requerida"),
      // insurance_policy_path: Yup.string().trim().required("Póliza de Seguro requerida, carga el documento indicado"),

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

         // setTimeout(() => {
         //    // Configura Dropzone
         //    const myDropzone = new Dropzone("#my-dropzone", { url: "/upload" });

         //    // Maneja eventos de Dropzone
         //    myDropzone.on("complete", (file) => {
         //       // Lógica para manejar la finalización de la carga
         //    });

         //    // Limpia la instancia de Dropzone cuando el componente se desmonta
         //    return () => {
         //       myDropzone.destroy();
         //    };
         // }, 5000);
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
                           // setFieldValue={setFieldValue}
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
                        <DatePickerComponent
                           idName={"registration_date"}
                           label={"Fecha de Registro *"}
                           format={"DD/MM/YYYY"}
                           value={values.registration_date}
                           setFieldValue={setFieldValue}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           error={errors.registration_date}
                           touched={touched.registration_date}
                           showErrorInput={null}
                           formData={formData}
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

                     {/* Imagen PREVIEW del vehículo */}
                     <Grid xs={12} md={12} sx={{ mb: 2 }}>
                        <InputFileComponent
                           idName="img_preview"
                           label="Foto PREVIEW del vehículo"
                           filePreviews={imgPreview}
                           setFilePreviews={setImgPreview}
                           error={errors.img_preview}
                           touched={touched.img_preview}
                           multiple={false}
                           accept={"image/*"}
                        />
                     </Grid>
                     {/* Poliza L. DERECHO del vehículo */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <InputFileComponent
                           idName="img_right"
                           label="Foto L. DERECHO del vehículo"
                           filePreviews={imgRight}
                           setFilePreviews={setImgRight}
                           error={errors.img_right}
                           touched={touched.img_right}
                           multiple={false}
                           accept={"image/*"}
                        />
                     </Grid>
                     {/* Poliza TRASERA del vehículo */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <InputFileComponent
                           idName="img_back"
                           label="Foto TRASERA del vehículo"
                           filePreviews={imgBack}
                           setFilePreviews={setImgBack}
                           error={errors.img_back}
                           touched={touched.img_back}
                           multiple={false}
                           accept={"image/*"}
                        />
                     </Grid>
                     {/* Poliza L. IZQUIERDO del vehículo */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <InputFileComponent
                           idName="img_left"
                           label="Foto L. IZQUIERDO del vehículo"
                           filePreviews={imgLeft}
                           setFilePreviews={setImgLeft}
                           error={errors.img_left}
                           touched={touched.img_left}
                           multiple={false}
                           accept={"image/*"}
                        />
                     </Grid>
                     {/* Poliza FRONTAL del vehículo */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <InputFileComponent
                           iidName="img_front"
                           label="Foto FRONTAL del vehículo"
                           filePreviews={imgFront}
                           setFilePreviews={setImgFront}
                           error={errors.img_front}
                           touched={touched.img_front}
                           multiple={false}
                           accept={"image/*"}
                        />
                     </Grid>

                     {/* Separador */}
                     <Grid xs={12}>
                        <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                     </Grid>

                     {/* N° Póliza de Seguro */}
                     <Grid xs={12} md={12} sx={{ mb: 2 }}>
                        <TextField
                           id="insurance_policy"
                           name="insurance_policy"
                           label="N° Póliza de Seguro"
                           type="text"
                           value={values.insurance_policy}
                           placeholder="Inserte el número de póliza del seguro"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInputFormik(e, setFieldValue, "insurance_policy", true)}
                           // inputProps={{ maxLength: 9 }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[1] = el)}
                           error={errors.insurance_policy && touched.insurance_policy}
                           helperText={errors.insurance_policy && touched.insurance_policy && errors.insurance_policy}
                        />
                     </Grid>

                     {/* Poliza de Seguro */}
                     <Grid xs={12} md={12} sx={{ mb: 2 }}>
                        <InputFileComponent
                           idName="img_insurance_policy"
                           label="Póliza de Seguro"
                           value={values.img_insurance_policy}
                           filePreviews={imgInsurancePolicy}
                           setFilePreviews={setImgInsurancePolicy}
                           error={errors.img_insurance_policy}
                           touched={touched.img_insurance_policy}
                           multiple={false}
                           accept={"image/*"}
                        />
                     </Grid>

                     {/* Separador */}
                     <Grid xs={12}>
                        <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                     </Grid>

                     {/* Switch para replaquear */}
                     {formData.id > 0 && (
                        <Grid xs={12} md={12} sx={{ mb: -2 }}>
                           <FormControlLabel control={<Switch />} label="Replaquear" checked={changePlates} onChange={() => setChangePlates(!changePlates)} />
                        </Grid>
                     )}
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
                        <DatePickerComponent
                           idName={"initial_date"}
                           label={"Fecha de Plaqueo *"}
                           format={"DD/MM/YYYY"}
                           value={values.initial_date}
                           setFieldValue={setFieldValue}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           error={errors.initial_date}
                           touched={touched.initial_date}
                           showErrorInput={null}
                           formData={formData}
                        />
                     </Grid>
                     {/* Fecha Expiracion de Placas */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <DatePickerComponent
                           idName={"due_date"}
                           label={"Fecha Expiración de Placas *"}
                           format={"DD/MM/YYYY"}
                           value={values.due_date}
                           setFieldValue={setFieldValue}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           error={errors.due_date}
                           touched={touched.due_date}
                           showErrorInput={null}
                           formData={formData}
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
