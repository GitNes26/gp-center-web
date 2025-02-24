import { Field, Formik } from "formik";
import * as Yup from "yup";

// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Grid, Button, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useState } from "react";
import { useDepartmentContext } from "../../../context/DepartmentContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { formatToLowerCase, formatToUpperCase, handleInputFormik } from "../../../utils/Formats";
import { FormikComponent, InputComponent, Select2Component } from "../../../components/Form/FormikComponents";
import { useDirectorContext } from "../../../context/DirectorContext";
import DirectoriesHistory from "./DirectoriesHistory";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const DepartmentForm = () => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   const {
      singularName,
      createDepartment,
      updateDepartment,
      formData,
      setFormData,
      textBtnSubmit,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      formikRef,
      createDepartmentDirector,
      directorsHistory
   } = useDepartmentContext();
   const { directors, getDirectorsSelectIndex } = useDirectorContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   // const inputsRef = useRef([]);
   // const [doFocus, setdoFocus] = useState(false);
   // const inputRefDepartment = useRef(null);
   // const inputRefDescription = useRef(null);
   const [rows, setRows] = useState([]);

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
         // return console.log(values);
         setLoadingAction(true);
         values.department_id = values.id;
         let axiosResponse = await createDepartmentDirector(values);
         // if (values.id == 0) axiosResponse = await createDepartment(values);
         // else axiosResponse = await updateDepartment(values);
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

   const handleReset = (resetForm, setFieldValue, id) => {
      try {
         resetForm();
         setFieldValue("id", id);
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

   const validationSchema = Yup.object().shape({
      // id: Yup.string().trim().required("Departamento requerido"),
      director_id: Yup.string().trim().required("Director requerido")
   });

   useEffect(() => {
      try {
         setRows(
            directorsHistory.map((i) => {
               return {
                  id: i.relation_id,
                  avatar: i.avatar,
                  img_firm: i.img_firm,
                  payroll_number: i.payroll_number,
                  full_name: i.full_name,
                  created_at: i.created_at,
                  relation_active: i.relation_active
               };
            })
         );

         // const btnModify = document.getElementById("btnModify");
         // if (btnModify != null) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   const showErrorAndFocusInput = (indexInputRef, msg, formHelperText = false) => {
      // Toast.Error(`Error en Sección ${section}: ${msg}`);
      // console.log(indexInputRef);
      // setFocusIn(indexInputRef);
      // console.log(focusIn);
      // setDoFocus(true);
      // if (doFocus) {
      //    if (inputsRef.current[focusIn]) {
      //       console.log("hay focusssss", inputsRef.current[focusIn]);
      //       inputsRef.current[focusIn].focus();
      //       setDoFocus(false);
      //    }
      // }
      // setdoFocus(true);
      // setTimeout(() => {
      //    if (doFocus) {
      //       inputsRef.current[indexInputRef].focus();
      //       setdoFocus(false);
      //    }
      // }, 500);
      if (formHelperText) {
         return (
            <FormHelperText error id="ht-disability_id">
               {msg}
            </FormHelperText>
         );
      }
      return msg;
   };

   return (
      <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
         <Box role="presentation" p={3} pt={5} className="form" sx={{ "max-width": "50vw" }}>
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
               validationSchema={validationSchema}
               onSubmit={onSubmit}
               textBtnSubmit={textBtnSubmit}
               formikRef={formikRef}
               handleCancel={handleCancel}
            >
               <InputComponent col={12} idName={"id"} label={"id"} placeholder={"id"} hidden={true} />
               <InputComponent col={6} idName={"organismo"} label={"Organismo"} placeholder={"Organismo correspondinete"} disabled={true} />
               <InputComponent col={6} idName={"departamento"} label={"Departamento"} placeholder={"Nombre del departamento"} disabled={true} />
               <InputComponent col={12} idName={"department_id"} label={"department_id"} placeholder={"ingresar el id del departamento"} hidden={true} />
               <Select2Component
                  col={12}
                  idName={"director_id"}
                  label={"Director Actual *"}
                  options={directors}
                  pluralName={"Directores"}
                  refreshSelect={getDirectorsSelectIndex}
               />

               <DirectoriesHistory rows={rows} />
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};
export default DepartmentForm;
