import * as Yup from "yup";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { colorPrimaryDark, useGlobalContext } from "../../../context/GlobalContext";
import { useVehicleContext } from "../../../context/VehicleContext";
import { useServiceContext } from "../../../context/ServiceContext";
import Toast from "../../../utils/Toast";
import sAlert from "../../../utils/sAlert";
import { ModalComponent } from "../../../components/ModalComponent";
import { FormikComponent, InputComponent } from "../../../components/Form/FormikComponents";
import ClockComponent from "../../../components/ClockComponent";

function ModalService({ open, setOpen, modalTitle, maxWidth }) {
   const { stock_number = 0 } = useParams();

   const initialValues = {
      id: 0,
      vehicle_id: 0,
      stock_number: stock_number,
      contact_name: "",
      contact_phone: "",
      pre_diagnosis: ""
   };

   const { setLoadingAction } = useGlobalContext();
   const { vehicle, showVehicle, showVehicleBy } = useVehicleContext();
   const { /* formData, setFormData,  resetFormData,*/ service, showService, createService, updateReport, textBtnSubmit, setTextBtnSumbit, formikRef } =
      useServiceContext();

   // const formikRef = useRef();
   const [formData, setFormData] = useState(initialValues);

   const handleCancel = (resetForm) => {
      try {
         if (resetForm) resetForm();
         resetFormData();
         setOpen(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const resetFormData = () => {
      setFormData(initialValues);
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // if (!vehicle) return Toast.Warning("La unidad a ingresar debe estar registrada en CoVe.");
         const res = await showVehicleBy("stock_number", stock_number);
         values.vehicle_id = res.result.id;

         // return console.log("values", values);

         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createService(values);
         else axiosResponse = await updateReport(values);

         if (axiosResponse.status_code === 200) {
            resetForm();
            resetFormData();
         }
         setSubmitting(false);
         setLoadingAction(false);
         sAlert.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon, true, null);
         showVehicle(vehicle.id);
         setOpen(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const handleBlurStockNumber = async (e, setFieldValue) => {
      console.log("en el Blur");
      if (e.target.value.length == 0) return Toast.Info("Ingresa un número unidad.");
      // if (e.key === "Enter" || e.keyCode === 13) {
      setShowLoading(true);
      // const searchBy = searchType == "number" ? "stock_number" : "plates";
      const searchBy = "stock_number";
      const res = await showVehicleBy(searchBy, e.target.value);
      setShowLoading(false);
      if (!res.result) return Toast.Info(res.alert_title);
      Toast.Success(res.alert_title);
      setFieldValue("vehicle_id", res.result.id);
   };
   const handleChangeStockNumber = async (e) => {
      // console.log("en el change");
      if (e.target.value.length == 0) return Toast.Info("Ingresa un número unidad.");
      // if (e.key === "Enter" || e.keyCode === 13) {
      setShowLoading(true);
      // const searchBy = searchType == "number" ? "stock_number" : "plates";
      const searchBy = "stock_number";
      const res = await showVehicleBy(searchBy, e.target.value);
      setShowLoading(false);
      if (!res.result) return Toast.Info(res.alert_title);
      Toast.Success(res.alert_title);
      setFieldValue("vehicle_id", res.result.id);
   };

   const validationSchema = Yup.object().shape({
      stock_number: Yup.number("Solo números").required("Número de Inventario requerido"),
      contact_name: Yup.string().trim().required("Nombre de contacto requerido"),
      contact_phone: Yup.string()
         .trim()
         .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
         .required("Número telefónico requerido"),
      pre_diagnosis: Yup.string().trim().required("Pre diagnostico requerido")
   });

   useEffect(() => {}, []);

   return (
      <ModalComponent open={open} setOpen={setOpen} modalTitle={modalTitle} maxWidth={maxWidth} height={"65vh"}>
         <FormikComponent
            key={"formikComponent"}
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            textBtnSubmit={"SOLICITAR"}
            formikRef={formikRef}
            handleCancel={handleCancel}
            maxHeight={"80%"}
         >
            <InputComponent col={12} idName={"id"} label={"ID"} placeholder={"ID"} textStyleCase={true} hidden={true} styleInput={2} />

            <InputComponent
               col={3}
               idName={"stock_number"}
               label={"N° Económico"}
               placeholder={"Ingresa el N° Unidad"}
               type={"number"}
               disabled={true}
               handleChangeExtra={handleChangeStockNumber}
               // handleBlurExtra={handleBlurStockNumber}
               styleInput={2}
            />
            <Grid container sm={9} justifyContent={"end"}>
               <ClockComponent stylesBox={{}} textColor={colorPrimaryDark} />
            </Grid>
            {/* <DatePickerComponent col={6} idName={"dateTime"} label={"Fecha y Hora de Registro"} format={"dddd d MMMM YYYY hh:mm a"} disabled={true} styleInput={2} /> */}

            <InputComponent
               col={7}
               idName={"contact_name"}
               label={"Nombre de contacto"}
               placeholder={"Ingresa un nombre para contactar"}
               textStyleCase={true}
               // disabled={vehicle ? false : true}
               styleInput={2}
            />

            <InputComponent
               col={5}
               idName={"contact_phone"}
               label={"Teléfono de contacto"}
               placeholder={"Ingresa un número telefónico a 10 dígitos"}
               textStyleCase={true}
               inputProps={{ maxLength: 10 }}
               styleInput={2}
            />

            <InputComponent
               col={12}
               idName={"pre_diagnosis"}
               label={"Diagnóstico inicial *"}
               placeholder={"Describa la falla en la unidad..."}
               textStyleCase={null}
               rows={6}
               styleInput={2}
            />
         </FormikComponent>
      </ModalComponent>
   );
}

export default ModalService;
