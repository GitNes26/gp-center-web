import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useState } from "react";
import { useVehicleStatusContext } from "../../../context/VehicleStatusContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { formatToLowerCase, formatToUpperCase, handleInputFormik } from "../../../utils/Formats";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const VehicleStatusForm = () => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   const { singularName, createVehicleStatus, updateVehicleStatus, formData, setFormData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } =
      useVehicleStatusContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   // const inputsRef = useRef([]);
   // const [doFocus, setdoFocus] = useState(false);
   // const inputRefVehicleStatus = useRef(null);
   // const inputRefDescription = useRef(null);

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
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createVehicleStatus(values);
         else axiosResponse = await updateVehicleStatus(values);
         if (axiosResponse.status_code == 200) {
            resetForm();
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
      vehicle_status: Yup.string().trim().required("Nombre del estatus requerido"),
      bg_color: Yup.string().trim().required("Color de Fondo requerido"),
      letter_black: Yup.bool().required("Color de Letra requerido")
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

   const showErrorAndFocusInput = (indexInputRef, msg, formHelperText = false) => {
      // Toast.Error(`Error en Sección ${section}: ${msg}`);
      // console.log(indexInputRef);
      // setFocusIn(indexInputRef);
      // console.log(focusIn);
      // setDoFocus(true);
      // if (doFocus) {
      //    if (inputsRef.current[focusIn]) {
      //       console.log("hay focusssss", inputsRef.current[focusIn]);
      //       inputsRef.current[focusIn].focus();
      //       setDoFocus(false);
      //    }
      // }
      // setdoFocus(true);
      // setTimeout(() => {
      //    if (doFocus) {
      //       inputsRef.current[indexInputRef].focus();
      //       setdoFocus(false);
      //    }
      // }, 500);
      if (formHelperText) {
         return (
            <FormHelperText error id="ht-disability_id">
               {msg}
            </FormHelperText>
         );
      }
      return msg;
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
                     {/* Estatus */}
                     <Grid xs={12} md={12} sx={{ mb: 2 }}>
                        <TextField
                           id="vehicle_status"
                           name="vehicle_status"
                           label="Estatus *"
                           type="text"
                           value={values.vehicle_status}
                           placeholder="Ingrese el estatus"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInputFormik(e, setFieldValue, "vehicle_status", true)}
                           // InputProps={{ }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[0] = el)}
                           // inputRef={inputRefVehicleStatus}
                           error={errors.vehicle_status && touched.vehicle_status}
                           helperText={errors.vehicle_status && touched.vehicle_status && errors.vehicle_status}
                        />
                     </Grid>
                     {/* Color de Fondo */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <TextField
                           id="bg_color"
                           name="bg_color"
                           label="Color de Fondo *"
                           type="color"
                           value={values.bg_color}
                           placeholder="Elija su color"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInputFormik(e, setFieldValue, "bg_color", true)}
                           // InputProps={{ }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[0] = el)}
                           // inputRef={inputRefVehicleStatus}
                           error={errors.bg_color && touched.bg_color}
                           helperText={errors.bg_color && touched.bg_color && errors.bg_color}
                        />
                     </Grid>
                     {/* Color de Letra */}
                     <Grid xs={12} md={6} sx={{ mb: 2 }}>
                        <FormControl fullWidth sx={{ alignItems: "center" }}>
                           <FormLabel id="letter_black-label">Color de Letra</FormLabel>
                           <RadioGroup
                              row
                              aria-labelledby="letter_black-label"
                              id="letter_black"
                              name="letter_black"
                              value={values.letter_black}
                              onChange={handleChange}
                              onBlur={handleBlur}
                           >
                              <FormControlLabel value={1} control={<Radio />} label="Negra" />
                              <FormControlLabel value={0} control={<Radio />} label="Blanca" />
                           </RadioGroup>
                           {touched.letter_black && errors.letter_black && (
                              <FormHelperText error id="ht-letter_black">
                                 {errors.letter_black}
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
                           placeholder="Inserte una breve descripción del estatus"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           // onInput={(e) => handleInputFormik(e, setFieldValue, "description", false)}
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
export default VehicleStatusForm;
