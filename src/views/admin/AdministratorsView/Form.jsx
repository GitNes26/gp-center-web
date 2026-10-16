import * as Yup from "yup";
import { FormControlLabel, SwipeableDrawer, Switch, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import EmployeeFormFields, { UserAccessFields } from "../../../components/EmployeeFormFields";
import { FormikComponent } from "../../../components/Form/FormikComponents";
import { setObjImg } from "../../../components/Form/InputFileComponent";
import { useAdministratorContext } from "../../../context/AdministratorContext";
import { useEmployeeContext } from "../../../context/EmployeeContext";
import { useGlobalContext } from "../../../context/GlobalContext";
import useDebounce from "../../../hooks/useDebounce";
import { convertToFormData } from "../../../utils/Formats";
import Toast from "../../../utils/Toast";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const AdministratorForm = () => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer, cursorLoading } = useGlobalContext();
   const { getInfoEmployee } = useEmployeeContext();
   const {
      resetAdministrator,
      singularName,
      createAdministrator,
      updateAdministrator,
      formData,
      setFormData,
      resetFormData,
      textBtnSubmit,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      formikRef
   } = useAdministratorContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [newPasswordChecked, setNewPasswordChecked] = useState(true);
   const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(false);
   const [imgAvatar, setImgAvatar] = useState([]);

   const resetForm = async (resetFormik = null) => {
      if (resetFormik) await resetFormik();
      resetFormData();
      setImgAvatar([]);
   };

   const handleInputPayRoll = useDebounce(async (value, setFieldValue) => {
      if (String(value).length < 5) return;
      try {
         setLoadingAction(true);
         const response = await getInfoEmployee("employee_code", value);
         const employee = response?.result;
         if (!employee) {
            await setFieldValue("employee_code_exist", false);
            Toast.Error("El número de nómina no fue encontrado");
            return;
         }
         await setFieldValue("gpc_employee_id", employee.user_id);
         await setFieldValue("employee_code", employee.employee_code);
         await setFieldValue("employee_code_exist", true);
         await setFieldValue("department", employee.department_name);
         await setFieldValue("position_name", employee.position_name);
         await setFieldValue("name", employee.name);
         await setFieldValue("plast_name", employee.plast_name);
         await setFieldValue("mlast_name", employee.mlast_name);
         await setFieldValue("username", employee.username);
         await setFieldValue("email", employee.email);
         await setFieldValue("cellphone", employee.cellphone);
         employee.avatar && setObjImg(employee.avatar, setImgAvatar);
         Toast.Success("Número de nómina encontrado");
      } catch (error) {
         console.error(error);
         await setFieldValue("employee_code_exist", false);
         Toast.Error(error.response?.status === 500 ? "No fue posible consultar el número de nómina" : error);
      } finally {
         setLoadingAction(false);
      }
   }, 1500);

   const handleChangeCheckAdd = (event) => {
      const active = event.target.checked;
      localStorage.setItem("checkAdd", active);
      setCheckAdd(active);
      setColorLabelcheck(active ? "" : "#ccc");
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm: resetFormik }) => {
      try {
         setLoadingAction(true);
         const payload = { ...values, role_id: 2, avatar: imgAvatar.length === 0 ? "" : imgAvatar[0].file };
         setFormData(payload);
         const dataSend = await convertToFormData(payload);
         const axiosResponse = values.id == 0 ? await createAdministrator(dataSend) : await updateAdministrator(dataSend);
         if (axiosResponse.status_code == 200) {
            await resetForm(resetFormik);
            setTextBtnSumbit("AGREGAR");
            setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
            if (!checkAdd) setOpenDialog(false);
         }
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         Toast.Error(error);
      } finally {
         setSubmitting(false);
         setLoadingAction(false);
      }
   };

   const handleCancel = (resetFormik) => {
      resetForm(resetFormik);
      resetAdministrator();
      formikRef.current?.resetForm();
      setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      setOpenDialog(false);
   };

   const validationSchema = Yup.object().shape({
      username: Yup.string().trim().matches(/^[^@]*$/, 'No se permite el carácter "@"').required("Nombre de usuario requerido"),
      email: Yup.string().trim().email("Formato de correo no válido").required("Correo requerido"),
      password: newPasswordChecked && Yup.string().trim().min(6, "La contraseña debe tener mínimo 6 caracteres").required("Contraseña requerida"),
      employee_code: Yup.number().typeError("Solo números").required("Número de nómina requerido"),
      employee_code_exist: Yup.boolean().oneOf([true], "El número de nómina no existe"),
      department: Yup.string().trim().required("Departamento requerido"),
      position_name: Yup.string().trim().required("Puesto requerido"),
      name: Yup.string().trim().required("Nombre(s) requerido"),
      plast_name: Yup.string().trim().required("Apellido paterno requerido"),
      mlast_name: Yup.string().trim().required("Apellido materno requerido")
   });

   useEffect(() => {
      if (textBtnSubmit == "GUARDAR") {
         formikRef.current?.setValues(formData);
         formData.avatar && setObjImg(formData.avatar, setImgAvatar);
         setNewPasswordChecked(false);
         setCheckedShowSwitchPassword(true);
      } else {
         setNewPasswordChecked(true);
         setCheckedShowSwitchPassword(false);
      }
      setLoadingAction(false);
   }, [formData]);

   return (
      <SwipeableDrawer anchor="right" open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} className={cursorLoading ? "cursor-loading" : ""}>
         <Box role="presentation" p={3} pt={5} className="form">
            <Typography variant="h2" mb={3}>
               {formTitle}
               <FormControlLabel
                  sx={{ float: "right", color: colorLabelcheck }}
                  control={<Switch checked={checkAdd} onChange={handleChangeCheckAdd} />}
                  label="Seguir agregando"
               />
            </Typography>
            <FormikComponent
               initialValues={formData}
               validationSchema={validationSchema}
               onSubmit={onSubmit}
               textBtnSubmit={textBtnSubmit}
               formikRef={formikRef}
               handleCancel={handleCancel}
            >
               <EmployeeFormFields handleInputPayRoll={handleInputPayRoll} imgAvatar={imgAvatar} setImgAvatar={setImgAvatar} showGpcEmployeeId />
               <UserAccessFields
                  newPasswordChecked={newPasswordChecked}
                  setNewPasswordChecked={setNewPasswordChecked}
                  checkedShowSwitchPassword={checkedShowSwitchPassword}
               />
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};

export default AdministratorForm;
