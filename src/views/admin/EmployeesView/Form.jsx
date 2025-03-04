import * as Yup from "yup";

// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { FormControlLabel, Switch, Typography } from "@mui/material";
import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { useEmployeeContext } from "../../../context/EmployeeContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
// import DatePickerComponent from "../../../components/Form/DatePickerComponent";
import axios from "axios";
import { setObjImg } from "../../../components/Form/InputFileComponent";
import { validateImageRequired } from "../../../utils/Validations";
import {
   DatePickerComponent,
   DividerComponent,
   FileInputComponent,
   FormikComponent,
   InputComponent,
   PasswordCompnent,
   Select2Component
} from "../../../components/Form/FormikComponents";
import { useDepartmentContext } from "../../../context/DepartmentContext";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const EmployeeForm = () => {
   // const { departments } = useDepartmentContext();

   const {
      setLoadingAction,
      openDialog,
      setOpenDialog,
      toggleDrawer,
      setDisabledState,
      setDisabledCity,
      setDisabledColony,
      setShowLoading,
      setDataStates,
      setDataCities,
      setDataColonies,
      setDataColoniesComplete,
      cursorLoading
   } = useGlobalContext();
   const {
      employee,
      resetEmployee,
      singularName,
      createEmployee,
      updateEmployee,
      formData,
      setFormData,
      resetFormData,
      textBtnSubmit,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      formikRef
   } = useEmployeeContext();
   const { departments, getDepartmentsSelectIndex } = useDepartmentContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [newPasswordChecked, setNewPasswordChecked] = useState(true);
   const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(false);
   const [imgAvatar, setImgAvatar] = useState([]);
   const [imgLicense, setImgLicense] = useState([]);
   const [imgFirm, setImgFirm] = useState([]);

   const ResetForm = async (resetForm = null) => {
      if (resetForm) await resetForm();
      await resetFormData();
      setImgAvatar([]);
      setImgLicense([]);
      setImgFirm([]);
   };

   const handleChangeRole = (value2, setFieldValue) => {
      try {
         // console.log("amanas", value2);
         const role_id = Number(value2.id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleInputPayRoll = async (value, setFieldValue) => {
      try {
         if (value.length < 5) return;
         const axiosRH = axios;
         const { data } = await axiosRH.get(`${import.meta.env.VITE_API_RH}/${value}/infraesctruturagobmxpalaciopeticioninsegura`);
         // console.log("empleado", data.RESPONSE.recordset[0]);
         if (data.RESPONSE.recordset[0]) {
            const userFind = data.RESPONSE.recordset[0];
            Toast.Success(`Número de nómina encontrado`);
            await setFieldValue("name", userFind.nombreE);
            await setFieldValue("paternal_last_name", userFind.apellidoP);
            await setFieldValue("maternal_last_name", userFind.apellidoM);
            await setFieldValue("payroll_number_exist", true);
            await setFieldValue("department", userFind.departamento);
         } else {
            Toast.Error(`El Número de nómina no fue encontrado`);
            await setFieldValue("name", "");
            await setFieldValue("paternal_last_name", "");
            await setFieldValue("maternal_last_name", "");
            await setFieldValue("payroll_number_exist", false);
            await setFieldValue("department", "");
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
         // console.log("formData", formData);
         // console.log("values", values);
         // values.community_id = values.colony_id;
         values.avatar = imgAvatar.length == 0 ? "" : imgAvatar[0].file;
         values.img_license = imgLicense.length == 0 ? "" : imgLicense[0].file;
         values.img_firm = imgFirm.length == 0 ? "" : imgFirm[0].file;
         values.num_int = values.num_int === "" ? "S/N" : values.num_int;
         values.change_password = newPasswordChecked;
         // if (!validateImageRequired(values.img_license, "La foto de la licencia es requerida")) return;

         // return console.log("values", values.img_license);

         setFormData(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createEmployee(values);
         else axiosResponse = await updateEmployee(values);
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

   const handleReset = (resetForm, setFieldValue, id) => {
      try {
         ResetForm(resetForm);
         resetEmployee();
         // employee.role = "Selecciona una opción...";
         setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = async () => {
      try {
         console.log(formData);
         if (formData.community_id > 0) {
            // // setShowLoading(true);
            // getCommunity(
            //    formData.zip,
            //    setFieldValue,
            //    formData.community_id,
            //    formData,
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
         // setValues(formData);
         setObjImg(formData.avatar, setImgAvatar);
         setObjImg(formData.img_license, setImgLicense);
         setObjImg(formData.img_firm, setImgFirm);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const handleCancel = (resetForm) => {
      try {
         ResetForm(resetForm);
         resetEmployee();
         formikRef.current.resetForm();
         formikRef.current.setValues(formikRef.current.initialValues);
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         // setTextBtnSubmit("AGREGAR");
         // setIsEdit(false);
         // if (refreshSelect) refreshSelect();
         if (!checkAdd) setOpenDialog(false);
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchemas = () => {
      let validationSchema = Yup.object().shape({
         // department_id: Yup.number().min(1, "Esta opción no es valida").required("Departamento requerido"),
         phone: Yup.string()
            .trim()
            .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
            .notRequired(),
         // .required("Número telefónico requerido"),
         license_number: Yup.string().trim().notRequired(), //.required("Número de licencia requerido"),
         license_type: Yup.string().trim().notRequired(), //.required("Tipo de licencia requerido"),
         license_due_date: Yup.date().notRequired(), //.required("Fecha de vencimiento requerida"),
         // imgLicense: Yup.mixed().required("Debe seleccionar un archivo"),
         payroll_number: Yup.number("Solo números").test("payrollNumberExist", "El Número de Nómina no existe", (value) =>
            Boolean(formikRef.current.values.payroll_number_exist)
         ),
         // payroll_number_exist: Yup.boolean().oneOf([true], "El Número de Nómina no existe."),
         // department_id: Yup.number().min(1, "Esta opción no es valida").required("Departamento requerido"),
         department: Yup.string().trim().required("Departamento requerido"),

         name: Yup.string().trim().required("Nombre(s) requerido"),
         paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
         maternal_last_name: Yup.string().trim().required("Apellido Materno requerido")
         // community_id:  Yup.number().trim().required("Comunidad requerida"),
         // street: Yup.string().trim().required("Calle/Av. requerida"),
         // num_ext: Yup.string().trim().required("Número exterior requerido"),
         // // num_int: Yup.string().trim().required("Número interior requerido"),

         // zip: Yup.number("Solo numeros").required("Código Postal requerido"),
         // state: Yup.string().trim().required("Estado requerido"),
         // city: Yup.string().trim().required("Ciudad requerido"),
         // colony: Yup.string().trim().notOneOf(["Selecciona una opción..."], "Ésta opción no es valida").required("Colonia requerida")
      });
      return validationSchema;
   };

   useEffect(() => {
      try {
         // const btnModify = document.getElementById("btnModify");
         // if (btnModify != null) btnModify.click();
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
               <InputComponent col={12} idName={"id"} label={"id"} placeholder={"id"} hidden={true} />
               <FileInputComponent
                  idName="avatar"
                  label="Foto de Perfil"
                  filePreviews={imgAvatar}
                  setFilePreviews={setImgAvatar}
                  multiple={false}
                  accept={"image/*"}
                  fileSizeMax={3}
               />
               {/* <Select2Component
                  col={12}
                  idName={"department_id"}
                  label={"Departamento"}
                  options={departments}
                  pluralName={"Departamentos"}
                  refreshSelect={getDepartmentsSelectIndex}
                  required
               /> */}
               <InputComponent col={12} idName={"phone"} label={"Número Telefónico"} placeholder={"10 dígitos"} type={"phone"} inputProps={{ maxLength: 10 }} />
               <FileInputComponent
                  col="12"
                  idName="img_firm"
                  label="Foto Firma"
                  filePreviews={imgFirm}
                  setFilePreviews={setImgFirm}
                  multiple={false}
                  accept={"image/*"}
               />
               <DividerComponent orientation="horizontal" title={"DATOS PARA CONTROL VEHÍCULAR"} />
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
                  col="12"
                  idName="img_license"
                  label="Foto Licencia de Conducir"
                  filePreviews={imgLicense}
                  setFilePreviews={setImgLicense}
                  multiple={false}
                  accept={"image/*"}
               />
               <DividerComponent orientation="horizontal" title={"DATOS DE EMPLEADO"} />
               <InputComponent col={12} idName={"payroll_number_exist"} label={"Existe el numero de empleado?"} placeholder={""} hidden={true} />
               <InputComponent
                  col={4}
                  idName={"payroll_number"}
                  label={"Número de Nómina *"}
                  placeholder={"999999"}
                  type={"number"}
                  handleInputExtra={handleInputPayRoll}
                  // error={
                  //    (formikRef.current.errors.payroll_number && formikRef.current.touched.payroll_number) ||
                  //    (formikRef.current.errors.payroll_number_exist && formikRef.current.touched.payroll_number_exist)
                  // }
                  // helperText={
                  //    (formikRef.current.errors.payroll_number && formikRef.current.touched.payroll_number && formikRef.current.errors.payroll_number) ||
                  //    (formikRef.current.errors.payroll_number_exist && formikRef.current.touched.payroll_number_exist && formikRef.current.errors.payroll_number_exist)
                  // }
               />
               <InputComponent
                  col={8}
                  idName={"department"}
                  label={"Departamento *"}
                  placeholder={"Ingrese su departamento"}
                  textStyleCase={true}
                  // disabled={values.id == 0 ? false : true}
                  // InputProps={{ disabled: values.id == 0 ? false : true }}
               />
               {/* <Select2Component
                  col={12}
                  idName={"department_id"}
                  label={"Departamento *"}
                  options={departments}
                  pluralName={"Departamentos"}
                  refreshSelect={getDepartmentsSelectIndex}
                  // disabled={values.id == 0 ? false : true}
                  // InputProps={{ disabled: values.id == 0 ? false : true }}
               /> */}
               <InputComponent col={12} idName={"name"} label={"Nombre(s) *"} placeholder={"Ingresa tu(s) nombre(s)"} textStyleCase={true} disabled />
               <InputComponent
                  col={6}
                  idName={"paternal_last_name"}
                  label={"Apellido Paterno *"}
                  placeholder={"Ingresa tu primer apellido"}
                  textStyleCase={true}
                  disabled
               />
               <InputComponent
                  col={6}
                  idName={"maternal_last_name"}
                  label={"Apellido Materno *"}
                  placeholder={"Ingresa tu segundo apellido"}
                  textStyleCase={true}
                  disabled
               />

               {/* INPUTS DE COMUNIDAD */}
               {/* <InputsCommunityComponent formData={formData} setFormData={setFormData} columnsByTextField={3} /> */}
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};
export default EmployeeForm;
