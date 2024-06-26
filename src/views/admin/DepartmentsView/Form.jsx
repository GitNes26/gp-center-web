import { Field, Formik } from "formik";
import * as Yup from "yup";

// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   Grid,
    Button, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useState } from "react";
import { useDepartmentContext } from "../../../context/DepartmentContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { formatToLowerCase, formatToUpperCase, handleInputFormik } from "../../../utils/Formats";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const DepartmentForm = () => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   const { singularName, createDepartment, updateDepartment, formData, setFormData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } =
      useDepartmentContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   // const inputsRef = useRef([]);
   // const [doFocus, setdoFocus] = useState(false);
   // const inputRefDepartment = useRef(null);
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
         if (values.id == 0) axiosResponse = await createDepartment(values);
         else axiosResponse = await updateDepartment(values);
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
      department: Yup.string().trim().required("Nombre del departamento requerido")
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
            </Typography>{" "}
            <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                  <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                     <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />
                     {/* Departamento */}
                     <Grid item xs={12} md={12} sx={{ mb: 2 }}>
                        <TextField
                           id="department"
                           name="department"
                           label="Nombre del Departamento *"
                           type="text"
                           value={values.department}
                           placeholder="Ingrese el nombre del department"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInputFormik(e, setFieldValue, "department", true)}
                           // InputProps={{ }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[0] = el)}
                           // inputRef={inputRefDepartment}
                           error={errors.department && touched.department}
                           helperText={errors.department && touched.department && showErrorAndFocusInput(0, errors.department, false)}
                        />
                     </Grid>
                     {/* Descripcion */}
                     <Grid item xs={12} md={12} sx={{ mb: 2 }}>
                        <TextField
                           id="description"
                           name="description"
                           label="Descripción"
                           type="text"
                           value={values.description}
                           placeholder="Inserte una breve descripción del department"
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
                           helperText={errors.description && touched.description && showErrorAndFocusInput(1, errors.description, false)}
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
export default DepartmentForm;
