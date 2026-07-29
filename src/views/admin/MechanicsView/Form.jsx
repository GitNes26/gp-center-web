import * as Yup from "yup";
import { FormControlLabel, Switch, Typography } from "@mui/material";
import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { useMechanicContext } from "../../../context/MechanicContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { setObjImg } from "../../../components/Form/InputFileComponent";
import { FormikComponent, InputComponent, FileInputComponent } from "../../../components/Form/FormikComponents";
import EmployeeFormFields from "../../../components/EmployeeFormFields";
import { useEmployeeContext } from "../../../context/EmployeeContext";
import useDebounce from "../../../hooks/useDebounce";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const MechanicForm = () => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer, cursorLoading } = useGlobalContext();
   const { getInfoEmployee } = useEmployeeContext();
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
      setFormTitle,
      formikRef
   } = useMechanicContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [imgAvatar, setImgAvatar] = useState([]);

   const ResetForm = async (resetForm = null) => {
      if (resetForm) await resetForm();
      await resetFormData();
      setImgAvatar([]);
   };

   const handleInputPayRoll = useDebounce(async (value, setFieldValue) => {
      try {
         if (value.length < 4) return;
         setLoadingAction(true);
         ResetForm();
         const res = await getInfoEmployee("employee_code", value);
         const employee = res.result;
         if (employee) {
            Toast.Success(`Número de nómina encontrado`);
            await setFieldValue("name", employee.name);
            await setFieldValue("paternal_last_name", employee.plast_name);
            await setFieldValue("maternal_last_name", employee.mlast_name);
            await setFieldValue("employee_code_exist", true);
            employee.avatar && setObjImg(employee.avatar, setImgAvatar, import.meta.env.VITE_API_GPC_ASSETS);
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
            await setFieldValue("paternal_last_name", "");
            await setFieldValue("maternal_last_name", "");
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
         values.avatar = imgAvatar.length == 0 ? "" : imgAvatar[0].file;

         setFormData(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createMechanic(values);
         else axiosResponse = await updateMechanic(values);
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
         employee_code: Yup.number("Solo números").notRequired(),
         name: Yup.string().trim().required("Nombre(s) requerido"),
         paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
         maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
         email: Yup.string().trim().email("Formato de correo no valido").notRequired(),
         cellphone: Yup.string()
            .trim()
            .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
            .notRequired()
      });
      return validationSchema;
   };

   useEffect(() => {
      try {
         if (textBtnSubmit == "GUARDAR") {
            handleModify();
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
               <EmployeeFormFields
                  handleInputPayRoll={handleInputPayRoll}
                  imgAvatar={imgAvatar}
                  setImgAvatar={setImgAvatar}
                  showGpcEmployeeId={false}
                  readonlyFields={false}
                  showDepartment={false}
               />
               <InputComponent col={6} idName={"email"} label={"Correo Electrónico"} placeholder={"mi@correo.com"} textStyleCase={false} type={"email"} />
               <InputComponent col={6} idName={"cellphone"} label={"Número Telefónico"} placeholder={"10 dígitos"} type={"cellphone"} inputProps={{ maxLength: 10 }} />
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};
export default MechanicForm;
