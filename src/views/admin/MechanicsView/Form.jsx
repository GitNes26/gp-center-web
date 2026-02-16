import { Field, Formik } from "formik";
import * as Yup from "yup";

// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Grid, Button, Divider, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { useMechanicContext } from "../../../context/MechanicContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { handleInputFormik } from "../../../utils/Formats";
import axios from "axios";
import InputFileComponent, { setObjImg } from "../../../components/Form/InputFileComponent";
import useDebounce from "../../../hooks/useDebounce";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const MechanicForm = () => {
   // const { departments } = useDepartmentContext();

   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer, cursorLoading } = useGlobalContext();
   const {
      resetMechanic,
      singularName,
      createMechanic,
      updateMechanic,
      formData,
      setFormData,
      resetFormData,
      textBtnSubmit,
      setTextBtnSumbit,
      formTitle,
      setFormTitle
   } = useMechanicContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [imgAvatar, setImgAvatar] = useState([]);

   const ResetForm = async (resetForm = null) => {
      if (resetForm) await resetForm();
      await resetFormData();
      setImgAvatar([]);
   };

   const handleInputPayRoll = useDebounce(async (e, setFieldValue) => {
      try {
         const value = e.target.value;
         if (value.length < 4) return;
         const axiosRH = axios;
         const { data } = await axiosRH.get(`${import.meta.env.VITE_API_RH}/${value}`);
         // console.log("🚀 ~ handleInputPayRoll ~ data:", data);
         const employee = data.data.result; //data.RESPONSE.recordset[0]

         if (employee) {
            Toast.Success(`Número de nómina encontrado`);
            await setFieldValue("name", employee.nombreE);
            await setFieldValue("paternal_last_name", employee.apellidoP);
            await setFieldValue("maternal_last_name", employee.apellidoM);
            // await setFieldValue("payroll_number_exist", true);
            // await setFieldValue("department", employee.departamento);
         } else {
            Toast.Error(`El Número de nómina no fue encontrado`);
            await setFieldValue("name", "");
            await setFieldValue("paternal_last_name", "");
            await setFieldValue("maternal_last_name", "");
            // await setFieldValue("payroll_number_exist", false);
            // await setFieldValue("department", "");
         }
      } catch (error) {
         console.log(error);
         if (error.response.status !== 500) Toast.Error(error);
         else {
            Toast.Error(`El Número de nómina no fue encontrado`);
            await setFieldValue("name", "");
            await setFieldValue("paternal_last_name", "");
            await setFieldValue("maternal_last_name", "");
            await setFieldValue("payroll_number_exist", false);
            await setFieldValue("department", "");
         }
      }
   }, 1000);

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
         // console.log("formData", formData);
         // console.log("values", values);
         values.avatar = imgAvatar.length == 0 ? "" : imgAvatar[0].file;

         // if (!validateImageRequired(values.img_license, "La foto de la licencia es requerida")) return;

         // return console.log("values", values.img_license);

         setFormData(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createMechanic(values);
         else axiosResponse = await updateMechanic(values);
         // if (axiosResponse.message == "duplicate") return Toast.Info("hola");
         if (axiosResponse.status_code == 200) {
            ResetForm(resetForm);
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

   const handleModify = async (values, setValues) => {
      try {
         console.log(formData);
         if (formData.description) formData.description == null && (formData.description = "");
         setValues(formData);
         setObjImg(formData.avatar, setImgAvatar);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         ResetForm(resetForm);
         resetMechanic();
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchemas = () => {
      let validationSchema = Yup.object().shape({
         payroll_number: Yup.number("Solo números").notRequired(),
         name: Yup.string().trim().required("Nombre(s) requerido"),
         paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
         maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
         email: Yup.string().trim().email("Formato de correo no valido").notRequired(),
         phone: Yup.string()
            .trim()
            .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
            .notRequired()
      });
      return validationSchema;
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
         <Box role="presentation" p={3} pt={5} className="form">
            <Typography variant="h2" mb={3}>
               {formTitle}
               <FormControlLabel
                  sx={{ float: "right", color: colorLabelcheck }}
                  control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                  label="Seguir Agregando"
               />
            </Typography>

            {/* VALIDAR DEPENDIENDO DEL ROL ESCOGIDO */}
            <Formik initialValues={formData} validationSchema={validationSchemas()} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                  <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                     <Grid container spacing={2} p={1} width={"100%"} maxHeight={"79vh"} overflow={"auto"}>
                        <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />

                        {/* Número de Nómina */}
                        <Field
                           id="payroll_number_exist"
                           name="payroll_number_exist"
                           type="hidden"
                           value={values.payroll_number_exist}
                           onChange={handleChange}
                           onBlur={handleBlur}
                        />

                        <Grid item xs={12} md={4} sx={{ mb: 1 }}>
                           <TextField
                              id="payroll_number"
                              name="payroll_number"
                              label="Número de Nómina"
                              type="number"
                              value={values.payroll_number}
                              placeholder="99999"
                              onChange={handleChange}
                              onInput={(e) => handleInputPayRoll(e, setFieldValue, values)}
                              onBlur={handleBlur}
                              fullWidth
                              // inputProps={{ maxLength: 11 }}
                              error={(errors.payroll_number && touched.payroll_number) || (errors.payroll_number_exist && touched.payroll_number_exist)}
                              helperText={
                                 (errors.payroll_number && touched.payroll_number && errors.payroll_number) ||
                                 (errors.payroll_number_exist && touched.payroll_number_exist && errors.payroll_number_exist)
                              }
                           />
                        </Grid>

                        {/* Nombre */}
                        <Grid item xs={12} md={12} sx={{ mb: 2 }}>
                           <TextField
                              id="name"
                              name="name"
                              label="Nombre(s) *"
                              type="text"
                              value={values.name}
                              placeholder="Ingrese tu(s) nombre(s)"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "name", true)}
                              // InputProps={{ disabled: true }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.name && touched.name}
                              helperText={errors.name && touched.name && errors.name}
                           />
                        </Grid>
                        {/* Apellido Paterno */}
                        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                           <TextField
                              id="paternal_last_name"
                              name="paternal_last_name"
                              label="Apellido Paterno *"
                              type="text"
                              value={values.paternal_last_name}
                              placeholder="Ingrese tu primer apellido"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "paternal_last_name", true)}
                              // InputProps={{ disabled: true }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.paternal_last_name && touched.paternal_last_name}
                              helperText={errors.paternal_last_name && touched.paternal_last_name && errors.paternal_last_name}
                           />
                        </Grid>
                        {/* Apellido Materno */}
                        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                           <TextField
                              id="maternal_last_name"
                              name="maternal_last_name"
                              label="Apellido Materno *"
                              type="text"
                              value={values.maternal_last_name}
                              placeholder="Ingrese tu segundo apellido"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "maternal_last_name", true)}
                              // InputProps={{ disabled: true }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.maternal_last_name && touched.maternal_last_name}
                              helperText={errors.maternal_last_name && touched.maternal_last_name && errors.maternal_last_name}
                           />
                        </Grid>

                        {/* Divisor */}
                        <Grid item xs={12}>
                           <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                        </Grid>

                        {/* Foto de Perfil */}
                        <Grid item xs={12} md={12} sx={{ mb: 2 }}>
                           <InputFileComponent
                              idName="avatar"
                              label="Foto de Perfil"
                              filePreviews={imgAvatar}
                              setFilePreviews={setImgAvatar}
                              error={errors.avatar}
                              touched={touched.avatar}
                              multiple={false}
                              accept={"image/*"}
                           />
                        </Grid>

                        {/* Correo Electronico */}
                        <Grid item xs={12} md={6} sx={{ mb: 1 }}>
                           <TextField
                              id="email"
                              name="email"
                              label="Correo Electrónico"
                              type="email"
                              value={values.email}
                              placeholder="mi@correo.com"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "email", false)}
                              // inputProps={{ maxLength: 2 }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.email && touched.email}
                              helperText={errors.email && touched.email && errors.email}
                           />
                        </Grid>

                        {/* Telefono */}
                        <Grid item xs={12} md={6} sx={{ mb: 1 }}>
                           <TextField
                              id="phone"
                              name="phone"
                              label="Número Telefónico"
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
                        onClick={() => handleModify(values, setValues, setFieldValue)}
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
export default MechanicForm;
