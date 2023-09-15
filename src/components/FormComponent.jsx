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
import { useSchoolContext } from "../../context/SchoolContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import Select2 from "react-select";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

// EN DESARROLLO PARA HACERLO GENERICO

const FormComponent = ({ dataCities, dataColonies, dataLevels }) => {
   const { setLoadingAction } = useGlobalContext();
   const { createSchool, updateSchool, openDialog, setOpenDialog, toggleDrawer, formData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } =
      useSchoolContext();
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

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // return console.log(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createSchool(values);
         else axiosResponse = await updateSchool(values);
         resetForm();
         setTextBtnSumbit("AGREGAR");
         setFormTitle("REGISTRAR ESCUELA");
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
         // if (error.code === "auth/user-not-found") setErrors({ email: "Usuario no registrado" });
         // if (error.code === "auth/wrong-password") setErrors({ password: "Contraseña incorrecta" });
      } finally {
         setSubmitting(false);
      }
   };

   const handleReset = (resetForm, setFieldValue, id, code) => {
      try {
         resetForm();
         setFieldValue("id", id);
         setFieldValue("code", code);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = (setValues) => {
      try {
         setValues(formData);
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
   const options = [
      { label: "The Godfather", id: 1 },
      { label: "Pulp Fiction", id: 2 }
   ];

   const validationSchema = Yup.object().shape({
      code: Yup.string().trim().required("Clave de escuela requerida"),
      level_id: Yup.number().min(1, "Ésta opción no es valida").required("Nivel requerido"),
      school: Yup.string().trim().required("Nombre de escuela requerida"),
      city_id: Yup.string().trim().required("Ciudad requerido"),
      colony_id: Yup.string().trim().required("Colonia requerida"),
      address: Yup.string().trim().required("Dirección requerida"),
      phone: Yup.string()
         .trim()
         .matches("[0-9]{10}", "Formato invalido - teléfono a 10 digitos")
         .max(10, "Formato invalido - teléfono a 10 digitos")
         .required("Número telefónico requerido"),
      director: Yup.string().trim().required("Nombre del director requerido"),
      loc_for: Yup.string().required("Indica si la esculea esá dentro o fuera del municipio de Gomez Palacio"),
      zone: Yup.string().trim().required("Zona requerida")
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

   const selectedValues = useMemo(() => dataLevels.filter((v) => v.selected), [dataLevels]);
   const [isClearable, setIsClearable] = useState(true);
   const [isSearchable, setIsSearchable] = useState(true);
   const [isDisabled, setIsDisabled] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isRtl, setIsRtl] = useState(false);

   return (
      <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
         <Box role="presentation" p={3} pt={5} className="form">
            <Typography variant="h2" mb={3}>
               {/* {formData.id == 0 ? "REGISTRAR ESCUELA" : "EDITAR ESCUELA"} */}
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
                     {/* Codigo */}
                     <Grid xs={12} md={4} sx={{ mb: 3 }}>
                        <TextField
                           id="code"
                           name="code"
                           label="Código de la Escuela *"
                           type="text"
                           value={values.code}
                           placeholder="AS5D16A158"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           inputProps={{ maxLength: 10 }}
                           fullWidth
                           disabled={values.id == 0 ? false : true}
                           error={errors.code && touched.code}
                           helperText={errors.code && touched.code && errors.code}
                        />
                     </Grid>
                     {/* Nivel */}
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        <FormControl fullWidth>
                           {/* <Autocomplete
                              disablePortal
                              id="level_id"
                              name="level_id"
                              // componentName="level_id"
                              value={selectedValues}
                              
                              label="Nivel"
                              // labelId="level_id-label"
                              placeholder="Nivel"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.level_id && touched.level_id}
                              options={dataLevels}
                              getOptionLabel={(option) => option.text}
                              renderInput={(params) => <TextField {...params} label="Nivel *" />}
                              // value={"PRIMARIA"}
                           /> */}
                           {/* <Select2
                              id="level_id"
                              name="level_id"
                              label="Nivel"
                              components={<Select/>}
                              labelId="level_id-label"
                              value={values.level_id}
                              placeholder="Nivel"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.level_id && touched.level_id}
                              // className="basic-single"
                              // classNamePrefix="select"
                              // defaultValue={dataLevels[0]}
                              isDisabled={isDisabled}
                              isLoading={isLoading}
                              isClearable={isClearable}
                              isRtl={isRtl}
                              isSearchable={isSearchable}
                              getOptionLabel={(option) => option.text}
                              options={dataLevels}
                           />
                           {touched.level_id && errors.level_id && (
                              <FormHelperText error id="ht-level_id">
                                 {errors.level_id}
                              </FormHelperText>
                           )} */}
                           <InputLabel id="level_id-label">Nivel *</InputLabel>
                           <Select
                              id="level_id"
                              name="level_id"
                              label="Nivel"
                              labelId="level_id-label"
                              value={values.level_id}
                              placeholder="Nivel"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.level_id && touched.level_id}
                           >
                              <MenuItem value={-1}>Seleccione una opción...</MenuItem>
                              {dataLevels &&
                                 dataLevels.map((d) => (
                                    <MenuItem key={d.value} value={d.value}>
                                       {d.text}
                                    </MenuItem>
                                 ))}
                           </Select>
                           {touched.level_id && errors.level_id && (
                              <FormHelperText error id="ht-level_id">
                                 {errors.level_id}
                              </FormHelperText>
                           )}
                        </FormControl>
                     </Grid>
                     {/* Escuela */}
                     <Grid xs={12} md={12} sx={{ mb: 3 }}>
                        <TextField
                           id="school"
                           name="school"
                           label="Nombre de la Escuela *"
                           type="text"
                           value={values.school}
                           placeholder="Lazaro Cardenas del Rio"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           fullWidth
                           error={errors.school && touched.school}
                           helperText={errors.school && touched.school && errors.school}
                        />
                     </Grid>
                     {/* Ciduad */}
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        <FormControl fullWidth>
                           <InputLabel id="city_id-label">Ciudad *</InputLabel>
                           <Select
                              id="city_id"
                              name="city_id"
                              label="Ciudad"
                              labelId="city_id-label"
                              value={values.city_id}
                              placeholder="Ciudad"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.city_id && touched.city_id}
                           >
                              <MenuItem value={null} disabled>
                                 Seleccione una opción...
                              </MenuItem>
                              {dataCities &&
                                 dataCities.map((d) => (
                                    <MenuItem key={d.value} value={d.value}>
                                       {d.text}
                                    </MenuItem>
                                 ))}
                           </Select>
                           {touched.city_id && errors.city_id && (
                              <FormHelperText error id="ht-city_id">
                                 {errors.city_id}
                              </FormHelperText>
                           )}
                        </FormControl>
                     </Grid>
                     {/* Colonia */}
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        <FormControl fullWidth>
                           <InputLabel id="colony_id-label">Colonia *</InputLabel>
                           <Select
                              id="colony_id"
                              name="colony_id"
                              label="Colonia"
                              labelId="colony_id-label"
                              value={values.colony_id}
                              placeholder="Colonia"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.colony_id && touched.colony_id}
                           >
                              <MenuItem value={null} disabled>
                                 Seleccione una opción...
                              </MenuItem>
                              {dataColonies &&
                                 dataColonies.map((d) => (
                                    <MenuItem key={d.value} value={d.value}>
                                       {d.text}
                                    </MenuItem>
                                 ))}
                           </Select>
                           {touched.colony_id && errors.colony_id && (
                              <FormHelperText error id="ht-colony_id">
                                 {errors.colony_id}
                              </FormHelperText>
                           )}
                        </FormControl>
                        {/* <FormControl
                     fullWidth
                     error={Boolean(touched.phone && errors.phone)}
                     sx={{ height: "auto" }}
                     // sx={{ ...theme.typography.customInput }}
                  >
                     <Autocomplete
                        disablePortal
                        id="phone"
                        name="phone"
                        label="Colonia / Localidad"
                        defaultValue={{ label: values.phone }}
                        isOptionEqualToValue={(option, value) => option.id == value.id}
                        // onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        options={top100Films}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(_, value) => onChange(value)}
                        onInputChange={(event, value) => {
                           if (value && value.length >= 3) {
                              search(value).finally();
                           }
                        }}
                     />
                     {touched.phone && errors.phone && (
                        <FormHelperText error id="ht-phone">
                           {errors.phone}
                        </FormHelperText>
                     )}
                  </FormControl> */}
                     </Grid>
                     {/* Direccion */}
                     <Grid xs={12} md={12} sx={{ mb: 1 }}>
                        <TextField
                           id="address"
                           name="address"
                           label="Dirección de la escuela *"
                           type="text"
                           value={values.address}
                           placeholder="Lazaro Cardenas del Rio"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           fullWidth
                           error={errors.address && touched.address}
                           helperText={errors.address && touched.address && errors.address}
                        />
                     </Grid>
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
                           fullWidth
                           inputProps={{ maxLength: 10 }}
                           error={errors.phone && touched.phone}
                           helperText={errors.phone && touched.phone && errors.phone}
                        />
                     </Grid>
                     {/* Director */}
                     <Grid xs={12} md={8} sx={{ mb: 1 }}>
                        {/* <ReactInputMask mask={"(999)-999-99-99"} value={values.director} disabled={false} maskChar=" "> */}
                        <TextField
                           id="director"
                           name="director"
                           label="Nombre del director *"
                           type="text"
                           value={values.director}
                           placeholder="Lic. Nombre Completo"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           fullWidth
                           error={errors.director && touched.director}
                           helperText={errors.director && touched.director && errors.director}
                        />
                     </Grid>
                     {/* Local o Foraneo */}
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
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
                     </Grid>
                     {/* Zona */}
                     <Grid xs={12} md={6} sx={{ mb: 3 }}>
                        <FormControl fullWidth sx={{ alignItems: "center" }}>
                           <FormLabel id="zone-label">Zona</FormLabel>
                           <RadioGroup row aria-labelledby="zone-label" id="zone" name="zone" value={values.zone} onChange={handleChange} onBlur={handleBlur}>
                              <FormControlLabel value="U" control={<Radio />} label="Urbana" />
                              <FormControlLabel value="R" control={<Radio />} label="Rural" />
                           </RadioGroup>
                           {touched.zone && errors.zone && (
                              <FormHelperText error id="ht-zone">
                                 {errors.zone}
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
                        <Button
                           type="reset"
                           variant="outlined"
                           color="secondary"
                           fullWidth
                           size="large"
                           sx={{ mt: 1 }}
                           onClick={() => handleReset(resetForm, setFieldValue, values.id, values.code)}
                        >
                           LIMPIAR
                        </Button>
                        <Button type="reset" variant="outlined" color="error" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleCancel(resetForm)}>
                           CANCELAR
                        </Button>
                     </ButtonGroup>
                     <Button type="button" color="info" fullWidth id="btnModify" sx={{ mt: 1, display: "none" }} onClick={() => handleModify(setValues)}>
                        setValues
                     </Button>
                  </Grid>
               )}
            </Formik>
         </Box>
      </SwipeableDrawer>
   );
};
export default FormComponent;
