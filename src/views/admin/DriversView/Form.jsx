import * as Yup from "yup";
import { FormControlLabel, Switch, Typography } from "@mui/material";
import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { useDriverContext } from "../../../context/DriverContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { setObjImg } from "../../../components/Form/InputFileComponent";
import {
   FormikComponent,
   InputComponent,
   FileInputComponent,
   DividerComponent,
   DatePickerComponent
} from "../../../components/Form/FormikComponents";
import EmployeeFormFields, { UserAccessFields } from "../../../components/EmployeeFormFields";
import { useEmployeeContext } from "../../../context/EmployeeContext";
import useDebounce from "../../../hooks/useDebounce";
import { convertToFormData } from "../../../utils/Formats";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const DriverForm = () => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer, cursorLoading } = useGlobalContext();
   const { getInfoEmployee } = useEmployeeContext();
   const {
      resetDriver,
      singularName,
      createDriver,
      updateDriver,
      formData,
      setFormData,
      resetFormData,
      textBtnSubmit,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      formikRef
   } = useDriverContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [newPasswordChecked, setNewPasswordChecked] = useState(true);
   const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(false);
   const [imgLicense, setImgLicense] = useState([]);
   const [imgAvatar, setImgAvatar] = useState([]);

   const ResetForm = async (resetForm = null) => {
      if (resetForm) await resetForm();
      await resetFormData();
      setImgAvatar([]);
      setImgLicense([]);
   };

   const handleInputPayRoll = useDebounce(async (value, setFieldValue) => {
      try {
         if (value.length < 5) return;
         setLoadingAction(true);
         ResetForm();
         const res = await getInfoEmployee("employee_code", value);
         const employee = res.result;
         if (employee) {
            Toast.Success(`Número de nómina encontrado`);
            await setFieldValue("gpc_employee_id", employee.user_id);
            await setFieldValue("employee_code", employee.employee_code);
            await setFieldValue("name", employee.name);
            await setFieldValue("plast_name", employee.plast_name);
            await setFieldValue("mlast_name", employee.mlast_name);
            await setFieldValue("employee_code_exist", true);
            await setFieldValue("department", employee.department_name);
            await setFieldValue("position_name", employee.position_name);
            employee.avatar && setObjImg(employee.avatar, setImgAvatar, import.meta.env.VITE_API_GPC_ASSETS);
            await setFieldValue("username", employee.username);
            await setFieldValue("email", employee.email);
            await setFieldValue("cellphone", employee.cellphone);
         } else {
            Toast.Error(`El Número de nómina no fue encontrado`);
         }
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         if (error.response?.status !== 500) Toast.Error(error);
         else {
            Toast.Error(`El Número de nómina no fue encontrado`);
            await setFieldValue("name", "");
            await setFieldValue("plast_name", "");
            await setFieldValue("mlast_name", "");
            await setFieldValue("employee_code_exist", false);
            await setFieldValue("department", "");
         }
      }
   }, 1500);

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
         const payload = {
            ...values,
            role_id: 6,
            avatar: imgAvatar.length == 0 ? "" : imgAvatar[0].file,
            img_license: imgLicense.length == 0 ? "" : imgLicense[0].file
         };
         setFormData(payload);
         setLoadingAction(true);
         const dataSend = await convertToFormData(payload);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createDriver(dataSend);
         else axiosResponse = await updateDriver(dataSend);
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

   const handleModify = async () => {
      try {
         if (formData.description) formData.description == null && (formData.description = "");
         formikRef.current.setValues(formData);
         setObjImg(formData.avatar, setImgAvatar);
         setObjImg(formData.img_license, setImgLicense);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         ResetForm(resetForm);
         resetDriver();
         formikRef.current.resetForm();
         formikRef.current.setValues(formikRef.current.initialValues);
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         if (!checkAdd) setOpenDialog(false);
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
         cellphone: Yup.string()
            .trim()
            .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
            .required("Número telefónico requerido"),
         license_number: Yup.string().trim().required("Número de licencia requerido"),
         license_type: Yup.string().trim().required("Tipo de licencia requerido"),
         license_due_date: Yup.date().required("Fecha de vencimiento requerida"),
         employee_code: Yup.number("Solo números"),
         employee_code_exist: Yup.boolean().oneOf([true], "El Número de Nómina no existe."),
         department: Yup.string().trim().required("Departamento requerido"),
         name: Yup.string().trim().required("Nombre(s) requerido"),
         position_name: Yup.string().trim().required("Puesto requerido"),
         plast_name: Yup.string().trim().required("Apellido Paterno requerido"),
         mlast_name: Yup.string().trim().required("Apellido Materno requerido")
      });
      return validationSchema;
   };

   useEffect(() => {
      try {
         if (textBtnSubmit == "GUARDAR") {
            handleModify();
            setNewPasswordChecked(false);
            setCheckedShowSwitchPassword(true);
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

            <FormikComponent
               key={"formikComponent"}
               initialValues={formData}
               validationSchema={validationSchemas()}
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
                  cellphoneRequired
               />
               <DividerComponent title={"DATOS DE LICENCIA"} />
               <InputComponent col={4} idName={"license_number"} label={"Número de Licencia"} placeholder={"99999999999"} inputProps={{ maxLength: 11 }} required />
               <InputComponent
                  col={4}
                  idName={"license_type"}
                  label={"Tipo de Licencia"}
                  placeholder={"A | B | C"}
                  textStyleCase={true}
                  inputProps={{ maxLength: 1 }}
                  required
               />
               <DatePickerComponent col={4} idName={"license_due_date"} label={"Fecha de Vencimiento"} format={"DD/MM/YYYY"} />
               <FileInputComponent
                  col={12}
                  idName="img_license"
                  label="Foto Licencia de Conducir"
                  filePreviews={imgLicense}
                  setFilePreviews={setImgLicense}
                  multiple={false}
                  accept={"image/*"}
               />
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};
export default DriverForm;
