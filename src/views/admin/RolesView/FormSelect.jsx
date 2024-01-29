import { Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import Select2Component from "../../../components/Form/Select2Component";
import { useRoleContext } from "../../../context/RoleContext";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, ButtonGroup } from "@mui/material";

const FormSelect = () => {
   const { singularName, roles, createRole, updateRole, formData, setFormData, textBtnSubmit, resetFormData, setTextBtnSumbit, formTitle, setFormTitle, headerRoles } =
      useRoleContext();

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

   const handleChangeRole = (value2, setFieldValue) => {
      try {
         console.log("amanas", value2);
         // setIsAdmin(false);
         // setIsGarage(false);
         // const role_id = Number(value2.id);
         // setIsAdmin(role_id <= 2 ? true : false);
         // setIsGarage(role_id == 4 ? true : false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
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

   const handleModify = (setValues, setFieldValue) => {
      try {
         handleChangeType(formData.type);
         if (formData.description) formData.description == null && (formData.description = "");
         setValues(formData);
         // console.log(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         resetFormData();
         // setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // return console.log("values", values);
         if (!isItem) values.belongs_to = 0; //es role padre
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createRole(values);
         else axiosResponse = await updateRole(values);
         resetForm();
         resetFormData();
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
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

   const validationSchema = Yup.object().shape({
      role: Yup.string().trim().required("Menú requerido")
      // belongs_to: Yup.number().min(1, "Esta opción no es valida").required("Pertenencia requerida"),
      // url: Yup.string().trim().required("URL requerido"),
      // icon: Yup.string().trim().required("Icono requerido"),
      // order: Yup.number().required("Orden requerido")
   });

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null && formData.id > 0) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <>
         <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
               <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                  <Grid xs={12} md={12} sx={{ mb: 1 }}>
                     <Select2Component
                        idName={"id"}
                        label={"Rol *"}
                        valueLabel={values.role}
                        values={values}
                        formData={formData}
                        setFormData={setFormData}
                        formDataLabel={"role"}
                        placeholder={"Selecciona una opción..."}
                        options={roles}
                        fullWidth={true}
                        handleChange={handleChange}
                        handleChangeValueSuccess={handleChangeRole}
                        setValues={setValues}
                        handleBlur={handleBlur}
                        error={errors.id}
                        touched={touched.id}
                        disabled={false}
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
                        sx={{ mt: 1, display: "none" }}
                        onClick={() => handleReset(resetForm, setFieldValue, values.id)}
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
      </>
   );
};
export default FormSelect;
