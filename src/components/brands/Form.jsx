import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   Autocomplete,
   Avatar,
   Backdrop,
   Button,
   CircularProgress,
   Divider,
   FormControlLabel,
   FormLabel,
   Input,
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
import { useBrandContext } from "../../context/BrandContext";
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
import InputFileComponent, { setObjImg } from "../Form/InputFileComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const BrandForm = () => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   const {
      singularName,
      createBrand,
      updateBrand,
      formData,
      resetFormData,
      setFormData,
      textBtnSubmit,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      imgFile,
      setImgFile
   } = useBrandContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const ResetForm = async (resetForm = null) => {
      if (resetForm) await resetForm();
      await resetFormData();
      setImgFile([]);
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
         setLoadingAction(true);
         values.img_path = imgFile.length == 0 ? "" : imgFile[0].file;
         // console.log(values);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createBrand(values);
         else axiosResponse = await updateBrand(values);
         if (axiosResponse.status_code == 200) {
            await ResetForm(resetForm);
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
         setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = async (setValues, setFieldValue) => {
      try {
         setLoadingAction(true);
         setValues(formData);
         setObjImg(formData.img_path, setImgFile);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         ResetForm(resetForm);
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchema = Yup.object().shape({
      brand: Yup.string().trim().required("Nombre de la marca requerido")
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
                           id="brand"
                           name="brand"
                           label="Marca *"
                           type="text"
                           value={values.brand}
                           placeholder="Ingrese el nombre de la marca"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInputFormik(e, setFieldValue, "brand", true)}
                           // InputProps={{ }}
                           fullWidth
                           // disabled={values.id == 0 ? false : true}
                           // inputRef={(el) => (inputsRef.current[0] = el)}
                           // inputRef={inputRefBrand}
                           error={errors.brand && touched.brand}
                           helperText={errors.brand && touched.brand && errors.brand}
                        />
                     </Grid>
                     {/* Imagen */}
                     <Grid xs={12} md={12} sx={{ mb: 2 }}>
                        <InputFileComponent
                           idName="img_path"
                           label="Foto de la marca"
                           filePreviews={imgFile}
                           setFilePreviews={setImgFile}
                           error={errors.img_path}
                           touched={touched.img_path}
                           multiple={false}
                           accept={"image/*"}
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
export default BrandForm;
