import { Field, Formik } from "formik";
import * as Yup from "yup";

// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Grid, Button, Divider, FormControlLabel, InputLabel, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { handleInputFormik } from "../../../utils/Formats";
import { OutlinedInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { strengthColor, strengthIndicator } from "../../../utils/password-strength";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import DatePickerComponent from "../../../components/Form/DatePickerComponent";
import { useRoleContext } from "../../../context/RoleContext";
import { DividerComponent, FormikComponent, InputComponent, PasswordCompnent, Select2Component, SwitchComponent } from "../../../components/Form/FormikComponents";
import { useDepartmentContext } from "../../../context/DepartmentContext";
import { useEmployeeContext } from "../../../context/EmployeeContext";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const UserForm = ({ dataRoles, dataEmployees }) => {
   const {
      setLoadingAction,
      openDialog,
      setOpenDialog,
      toggleDrawer,
      cursorLoading
   } = useGlobalContext();
   const {
      resetFormData,
      resetUser,
      singularName,
      createUser,
      updateUser,
      formData,
      setFormData,
      textBtnSubmit,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      formikRef
   } = useUserContext();
   const { getRolesSelectIndex } = useRoleContext();
   const { getDepartmentsSelectIndex } = useDepartmentContext();
   const { getEmployeesSelectIndex } = useEmployeeContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [isAdmin, setIsAdmin] = useState(true);
   const [newPasswordChecked, setNewPasswordChecked] = useState(true);
   const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(false);

   const handleChangeRole = (idName, values) => {
      try {
         const role = values.label;
         setIsAdmin(role.includes("Admin") ? true : false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleChangeEmployee = (idName, values) => {
      try {
         const employeeSelected = values;
         const employee = dataEmployees.find((item) => item.id == employeeSelected.id);
         if (employee) {
            formikRef.current.setFieldValue("username", employee.username);
            formikRef.current.setFieldValue("email", employee.email);
            formikRef.current.setFieldValue("department_uuid", employee.department_uuid);
            formikRef.current.setFieldValue("department_name", employee.department_name);
         }
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

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // console.log("formData", formData);
         // console.log("values", values);
         // values.community_id = values.colony_id;
         values.change_password = newPasswordChecked;
         // values.num_int = values.num_int === "" ? "S/N" : values.num_int;
         setFormData(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createUser(values);
         else axiosResponse = await updateUser(values);
         // if (axiosResponse.message == "duplicate") return Toast.Info("hola");
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

   const handleModify = async () => {
      try {
         if (formData.community_id > 0) {
            // // setShowLoading(true);
            // getCommunity(
            //    formData.zip,
            //    setFieldValue,
            //    formData.community_id,
            //    formData,
            //    values,
            //    setFormData,
            //    setDisabledState,
            //    setDisabledCity,
            //    setDisabledColony,
            //    setShowLoading,
            //    setDataStates,
            //    setDataCities,
            //    setDataColonies,
            //    setDataColoniesComplete
            // );
         }
         if (formData.description) formData.description == null && (formData.description = "");
         // setIsAdmin(formData.includes("Admin") ? true : false);

         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         resetUser();
         resetFormData();
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchemas = () => {
      let validationSchema = Yup.object().shape({
         username: Yup.string()
            .trim()
            .matches(/^[^@]*$/, 'No se permite el carácter "@"')
            .required("Nombre de usario requerido"),
         email: Yup.string().trim().email("Formato de correo no valido").required("Correo requerido"),
         password: newPasswordChecked && Yup.string().trim().min(6, "La Contraseña debe de tener mínimo 6 caracteres").required("Contraseña requerida"),
         role_id: Yup.number().min(1, "Esta opción no es valida").required("Rol requerido")
         // department_id: Yup.number().min(1, "Esta opción no es valida").required("Departamento requerido")
      });
      return validationSchema;
   };

   useEffect(() => {
      try {
         // const btnModify = document.getElementById("btnModify");
         // if (btnModify != null) btnModify.click();

         if (textBtnSubmit == "GUARDAR") {
            setNewPasswordChecked(false);
            setCheckedShowSwitchPassword(true);
            handleModify();
         } else {
            setNewPasswordChecked(true);
            setCheckedShowSwitchPassword(false);
         }
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
            <FormikComponent
               key={"formikComponent"}
               initialValues={formData}
               validationSchema={validationSchemas()}
               onSubmit={onSubmit}
               textBtnSubmit={textBtnSubmit}
               formikRef={formikRef}
               handleCancel={handleCancel}
            >
               <Grid container spacing={2} mt={2}>
                  <InputComponent col={12} idName={"id"} label={"id"} placeholder={"el id"} hidden={true} />
                  <InputComponent col={12} idName={"department_uuid"} label={"department_uuid"} placeholder={"el id"} hidden={true} />
    
                  <DividerComponent title={"DATOS DE EMPLEADO"} />
                  <Select2Component
                     col={12}
                     idName={"gpc_employee_id"}
                     label={"Empleado"}
                     options={dataEmployees}
                     pluralName={"Empleados"}
                     refreshSelect={getEmployeesSelectIndex}
                     handleChangeValueSuccess={handleChangeEmployee}
                     required
                  />
                  <InputComponent
                     col={12}
                     idName={"department_name"}
                     label={"Departamento *"}
                     placeholder={"Nombre del departmaento"}
                     textStyleCase={false}
                     disabled={true}
                  />
                  <DividerComponent title={"DATOS DE USUARIO"} />
                  <InputComponent col={6} idName={"username"} label={"Nombre de Usuario *"} placeholder={"Ingrese el nombre de usuario"} textStyleCase={null} />
                  <InputComponent col={6} idName={"email"} label={"Correo Electrónico *"} placeholder={"mi@correo.com"} textStyleCase={false} />
                  <PasswordCompnent
                     col={6}
                     idName={"password"}
                     label={"Contraseña *"}
                     newPasswordChecked={newPasswordChecked}
                     setNewPasswordChecked={setNewPasswordChecked}
                     checkedShowSwitchPassword={checkedShowSwitchPassword}
                  />
                  <Select2Component
                     col={12}
                     idName={"role_id"}
                     label={"Rol *"}
                     options={dataRoles}
                     pluralName={"Roles"}
                     refreshSelect={getRolesSelectIndex}
                     handleChangeValueSuccess={handleChangeRole}
                  />
               </Grid>
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};
export default UserForm;
