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
import { useModelContext } from "../../context/ModelContext";
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

const ModelForm = ({ dataBrands }) => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   const { singularName, createModel, updateModel, formData, setFormData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } = useModelContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

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
         if (values.id == 0) axiosResponse = await createModel(values);
         else axiosResponse = await updateModel(values);
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
      model: Yup.string().trim().required("Nombre del modelo requerido")
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
                     {/* Marca */}
                     <Grid xs={12} md={12} sx={{ mb: 2 }}>
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
                              onChange={handleChange}
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
                     <Grid xs={12} md={12} sx={{ mb: 2 }}>
                        <TextField
                           id="model"
                           name="model"
                           label="Modelo *"
                           type="text"
                           value={values.model}
                           placeholder="Ingrese el nombre del modelo"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInput(e, setFieldValue, "model", true)}
                           // InputProps={{ }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[0] = el)}
                           // inputRef={inputRefModel}
                           error={errors.model && touched.model}
                           helperText={errors.model && touched.model && errors.model}
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
export default ModelForm;
