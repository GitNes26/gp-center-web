import * as Yup from "yup";
import { FormControlLabel, Switch, Typography } from "@mui/material";
import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { useVoucherRequesterContext } from "../../../context/VoucherRequesterContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { setObjImg } from "../../../components/Form/InputFileComponent";
import {
   FormikComponent,
   InputComponent,
   PasswordCompnent,
   FileInputComponent,
   DividerComponent,
   DatePickerComponent
} from "../../../components/Form/FormikComponents";
import EmployeeFormFields from "../../../components/EmployeeFormFields";
import { useEmployeeContext } from "../../../context/EmployeeContext";
import useDebounce from "../../../hooks/useDebounce";
import { convertToFormData } from "../../../utils/Formats";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const VoucherRequesterForm = () => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer, cursorLoading } = useGlobalContext();
   const { getInfoEmployee } = useEmployeeContext();
   const {
      voucherRequester,
      resetVoucherRequester,
      singularName,
      createVoucherRequester,
      updateVoucherRequester,
      formData,
      setFormData,
      resetFormData,
      textBtnSubmit,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      formikRef
   } = useVoucherRequesterContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [newPasswordChecked, setNewPasswordChecked] = useState(true);
   const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(false);
   const [imgAvatar, setImgAvatar] = useState([]);
   const [signatureImage, setSignatureImage] = useState([]);
   const [imgLicense, setImgLicense] = useState([]);
   const [sealImage, setSealImage] = useState([]);

   const ResetForm = async (resetForm = null) => {
      if (resetForm) await resetForm();
      await resetFormData();
      setImgAvatar([]);
      setImgLicense([]);
      setSignatureImage([]);
      setSealImage([]);
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
            employee.avatar && setObjImg(employee.avatar, setImgAvatar);
            employee.signature_image && setObjImg(employee.signature_image, setSignatureImage);
            employee.seal_image && setObjImg(employee.seal_image, setSealImage);
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
         // else {
         //    Toast.Error(`El Número de nómina no fue encontrado`);
         //    await setFieldValue("name", "");
         //    await setFieldValue("plast_name", "");
         //    await setFieldValue("mlast_name", "");
         //    await setFieldValue("employee_code_exist", false);
         //    await setFieldValue("department", "");
         // }
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
         setFormData(values);
         setLoadingAction(true);

         values.role_id = 8; // ID de Director-VoucherRequester
         values.avatar = imgAvatar.length == 0 ? "" : imgAvatar[0].file;
         values.img_license = imgLicense.length == 0 ? "" : imgLicense[0].file;
         values.signature_image = signatureImage.length == 0 ? "" : signatureImage[0].file;
         values.seal_image = sealImage.length == 0 ? "" : sealImage[0].file;
         // console.log("🚀 ~ onSubmit ~ sealImage:", sealImage);
         // console.log("🚀 ~ onSubmit ~ values:", values);
         // values.img_license = imgLicense.length == 0 ? "" : imgLicense[0].file;
         // values.num_int = values.num_int === "" ? "S/N" : values.num_int;

         // console.log("🚀 ~ onSubmit ~ values:", values);
         const dataSend = await convertToFormData(values);
         // console.log("🚀 ~ onSubmit ~ dataSend:", dataSend);
         // setLoadingAction(false);
         // return;
         let axiosResponse;

         if (values.id == 0) axiosResponse = await createVoucherRequester(dataSend);
         else axiosResponse = await updateVoucherRequester(dataSend);
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
         setObjImg(formData.signature_image, setSignatureImage);
         setObjImg(formData.seal_image, setSealImage);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         ResetForm(resetForm);
         resetVoucherRequester();
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
         employee_code: Yup.number("Solo números"),
         employee_code_exist: Yup.boolean().oneOf([true], "El Número de Nómina no existe."),
         department: Yup.string().trim().required("Departamento requerido"),
         name: Yup.string().trim().required("Nombre(s) requerido"),
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
               <EmployeeFormFields handleInputPayRoll={handleInputPayRoll} imgAvatar={imgAvatar} setImgAvatar={setImgAvatar} showGpcEmployeeId={true} />
               <InputComponent col={6} idName={"username"} label={"Nombre de usuario"} placeholder={"Ingrese su nombre de usuario"} textStyleCase={null} required />
               <InputComponent col={6} idName={"email"} label={"Correo Electrónico"} placeholder={"mi@correo.com"} textStyleCase={false} type={"email"} required />
               <PasswordCompnent
                  col={6}
                  idName={"password"}
                  label={"Contraseña"}
                  newPasswordChecked={newPasswordChecked}
                  setNewPasswordChecked={setNewPasswordChecked}
                  checkedShowSwitchPassword={checkedShowSwitchPassword}
                  required
               />
               <InputComponent col={6} idName={"cellphone"} label={"Número Telefónico"} placeholder={"10 dígitos"} type={"cellphone"} inputProps={{ maxLength: 10 }} />
               <DividerComponent title={"FIRMA Y SELLO"} />
               <FileInputComponent
                  col={12}
                  idName="signature_image"
                  label="Foto Firma"
                  filePreviews={signatureImage}
                  setFilePreviews={setSignatureImage}
                  multiple={false}
                  accept={"image/*"}
               />
               <FileInputComponent
                  col={12}
                  idName="seal_image"
                  label="Foto Sello del Departamento"
                  filePreviews={sealImage}
                  setFilePreviews={setSealImage}
                  multiple={false}
                  accept={"image/*"}
               />

               <DividerComponent title={"DATOS PARA CONTROL VEHÍCULAR"} />
               <InputComponent col={4} idName={"license_number"} label={"Número de Licencia"} placeholder={"99999999999"} inputProps={{ maxLength: 11 }} />
               <InputComponent
                  col={4}
                  idName={"license_type"}
                  label={"Tipo de Licencia"}
                  placeholder={"A | B | C"}
                  textStyleCase={true}
                  inputProps={{ maxLength: 1 }}
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
export default VoucherRequesterForm;
