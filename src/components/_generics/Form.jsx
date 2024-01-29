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
import { useGenericContext } from "../../context/GenericContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import Select2 from "react-select";
import { formatToLowerCase, formatToUpperCase, handleInputFormik } from "../../utils/Formats";
import { OutlinedInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { strengthColor, strengthIndicator } from "../../utils/password-strength";
import axios from "axios";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const GenericForm = () => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   const { generic, singularName, createGeneric, updateGeneric, formData, setFormData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } =
      useGenericContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const handleChangeSelect = (value, input, setFieldValue) => {
      try {
         if (!value) return;
         formData[input] = value ? value.id : 0;
         setFieldValue(input, value ? value.id : 0);
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
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createGeneric(values);
         else axiosResponse = await updateGeneric(values);
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
      generic: Yup.string().trim().required("Nombre de la marca requerido")
   });

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData, generic]);

   // const options = [
   // 	{ label: "The Godfather", id: 1 },
   // 	{ label: "Pulp Fiction", id: 2 },
   // ];
   const handleChangeSelectValue = (input, value, setValues) => {
      console.log(formData);
      console.log("el input->", input);
      console.log("el value->", value);
      formData[input] = value ? value.id : 0;
      console.log(formData);
      setValues(formData);
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
                        <TextField
                           id="generic"
                           name="generic"
                           label="Marca *"
                           type="text"
                           value={values.generic}
                           placeholder="Ingrese el nombre de la marca"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInputFormik(e, setFieldValue, "generic", true)}
                           // InputProps={{ }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[0] = el)}
                           // inputRef={inputRefGeneric}
                           error={errors.generic && touched.generic}
                           helperText={errors.generic && touched.generic && errors.generic}
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

                     {/* Divisor */}
                     <Grid xs={12}>
                        <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                     </Grid>

                     {/* Genero */}
                     <Grid xs={12} md={4} sx={{ mb: 1 }}>
                        <FormControl fullWidth sx={{ alignItems: "center" }}>
                           <FormLabel id="gender-label">Género</FormLabel>
                           <RadioGroup row aria-labelledby="gender-label" id="gender" name="gender" value={values.gender} onChange={handleChange} onBlur={handleBlur}>
                              <FormControlLabel value="MASCULINO" control={<Radio />} label="Masculino" />
                              <FormControlLabel value="FEMENINO" control={<Radio />} label="Femenino" />
                           </RadioGroup>
                           {touched.gender && errors.gender && showErrorInput(2, errors.gender, true)}
                        </FormControl>
                     </Grid>

                     {/* Rol */}
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        <FormControl fullWidth>
                           <Autocomplete
                              disablePortal
                              openOnFocus
                              id="role_id"
                              name="role_id"
                              label="Rol"
                              // labelId="role_id-label"
                              placeholder="Rol"
                              options={dataRoles}
                              getOptionLabel={(option) => option}
                              isOptionEqualToValue={(option, value) => option === value}
                              renderInput={(params) => <TextField {...params} label="Rol *" />}
                              // value={values.role_id}
                              onChange={(e, newValue) => {
                                 handleChange(e);
                                 handleChangeSelect(newValue, "role_id", setFieldValue);
                                 // handleChangeSelectValue("role_id", newValue, setValues);
                              }}
                              onBlur={handleBlur}
                              fullWidth
                              disabled={values.id == 0 ? false : true}
                              error={errors.role_id && touched.role_id}
                              defaultValue={generic ? generic.role : "Selecciona una opción..."}
                              value={generic ? generic.role : "Selecciona una opción..."}
                           />

                           {/* <InputLabel id="role_id-label">Rol *</InputLabel>
                           <Select
                              id="role_id"
                              name="role_id"
                              label="Rol"
                              labelId="role_id-label"
                              value={values.role_id}
                              placeholder="Rol"
                              onChange={(e) => {
                                 handleChange(e);
                                 handleChangeSelect(e.target.value);
                              }}
                              onBlur={handleBlur}
                              error={errors.role_id && touched.role_id}
                           >
                              <MenuItem value={0}>Selecciona una opción...</MenuItem>
                              {dataRoles &&
                                 dataRoles.map((d) => (
                                    <MenuItem key={d.value} value={d.value}>
                                       {d.text}
                                    </MenuItem>
                                 ))}
                           </Select> */}
                           {touched.role_id && errors.role_id && (
                              <FormHelperText error id="ht-role_id">
                                 {errors.role_id}
                              </FormHelperText>
                           )}
                        </FormControl>
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
export default GenericForm;
