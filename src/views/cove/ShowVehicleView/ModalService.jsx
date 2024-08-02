import * as Yup from "yup";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ModalComponent } from "../../../components/ModalComponent";
import { colorPrimaryDark, useGlobalContext } from "../../../context/GlobalContext";
import Toast from "../../../utils/Toast";
import { DatePickerComponent, DividerComponent, FormikComponent, InputComponent, Select2Component } from "../../../components/Form/FormikComponents";
import { useParams } from "react-router-dom";
import ClockComponent from "../../../components/ClockComponent";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import { useServiceContext } from "../../../context/ServiceContext";
import { useVehicleContext } from "../../../context/VehicleContext";
import { setPropsOriginals } from "../../../utils/Formats";
import UploadIcon from "@mui/icons-material/Upload";
import ServiceMaterialDT from "../../garage/ServicesView/ServiceMaterialDT";
import MaterialDT from "../../garage/ServicesView/MaterialDT";

function ModalService({ open, setOpen, modalTitle, maxWidth, showActionButtons = true, obj = null }) {
   const { stock_number = 0 } = useParams();

   const initialValues = {
      id: 0,
      vehicle_id: 0,
      stock_number: stock_number,
      contact_name: "",
      contact_phone: "",
      pre_diagnosis: "",

      folio: 0,
      status: "",
      vehicle: "",
      requested_user: "",
      requested_at: "",
      approved_user: "",
      approved_at: "",
      rejected_user: "",
      rejected_at: "",

      final_diagnosis: ""
   };

   const { setLoadingAction } = useGlobalContext();
   const { vehicle, showVehicle, showVehicleBy } = useVehicleContext();
   const { /* formData, setFormData,  resetFormData,*/ service, showService, createService, updateReport, textBtnSubmit, setTextBtnSumbit, formikRef } =
      useServiceContext();

   const [formData, setFormData] = useState(initialValues);

   const handleCancel = (resetForm) => {
      resetFormData(resetForm);
   };
   const resetFormData = (resetForm) => {
      try {
         if (resetForm) resetForm();
         setFormData(initialValues);
         setOpen(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
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
            resetFormData(resetForm);
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

   useEffect(() => {}, [formikRef]);

   useLayoutEffect(() => {
      console.log("🚀 ~ useLayoutEffect ~ obj:", obj);
      if (obj) setFormData(setPropsOriginals(formData, obj));
   }, [formikRef]);
   console.log("🚀 ~ useLayoutEffect ~ formData:", formData);

   return (
      <ModalComponent open={open} setOpen={setOpen} modalTitle={modalTitle} maxWidth={maxWidth} height={"65vh"}>
         <FormikComponent
            key={"formikComponent"}
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            textBtnSubmit={textBtnSubmit}
            formikRef={formikRef}
            handleCancel={handleCancel}
            maxHeight={"80%"}
            showActionButtons={showActionButtons}
         >
            <InputComponent col={12} idName={"id"} label={"ID"} placeholder={"ID"} textStyleCase={true} hidden={true} styleInput={2} />

            {/* SECCION DE SOLICITUD */}
            {formData.folio != 0 && <DividerComponent title={"DATOS DE SOLICITUD"} fontWeight={"bolder"} mb={-1} />}

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
               size={formData.folio == 0 ? "medium" : "small"}
            />
            {formData.folio == 0 ? (
               <Grid container sm={9} justifyContent={"end"}>
                  <ClockComponent stylesBox={{}} textColor={colorPrimaryDark} />
               </Grid>
            ) : (
               <>
                  <InputComponent
                     col={4}
                     idName={"folio"}
                     label={"Folio de Servicio"}
                     placeholder={"000"}
                     type={"number"}
                     styleInput={2}
                     disabled={true}
                     size="small"
                  />
                  <DatePickerComponent
                     col={5}
                     idName={"requested_at"}
                     label={"Fecha y Hora de Registro"}
                     format={"dddd d MMMM YYYY hh:mm a"}
                     disabled={true}
                     size="small"
                     marginBottom={0}
                  />
                  <InputComponent col={7} idName={"vehicle"} label={"Unidad"} placeholder={"FORD FOCUS 2020"} styleInput={2} disabled={true} size="small" />
                  <InputComponent
                     col={5}
                     idName={"requested_user"}
                     label={"Usuario Solicitante"}
                     placeholder={"Nombre de Usuario"}
                     styleInput={2}
                     disabled={true}
                     size="small"
                  />

                  <DividerComponent title={"REPORTE"} fontWeight={"bolder"} mb={-1} />
               </>
            )}
            {/* SECCION DE SOLICITUD */}

            {/* SECCION DE REPORTE */}
            <InputComponent
               col={7}
               idName={"contact_name"}
               label={"Nombre de Contacto *"}
               placeholder={"Ingresa un nombre para contactar"}
               textStyleCase={true}
               styleInput={2}
               disabled={!showActionButtons}
               size="small"
            />

            <InputComponent
               col={5}
               idName={"contact_phone"}
               label={"Teléfono de Contacto *"}
               placeholder={"Ingresa un número telefónico a 10 dígitos"}
               textStyleCase={true}
               inputProps={{ maxLength: 10 }}
               styleInput={2}
               disabled={!showActionButtons}
               size="small"
            />

            <InputComponent
               col={12}
               idName={"pre_diagnosis"}
               label={"Diagnóstico Inicial *"}
               placeholder={"Describa la falla en la unidad..."}
               textStyleCase={null}
               rows={3}
               styleInput={2}
               disabled={!showActionButtons}
               size="small"
            />
            {/* SECCION DE REPORTE */}

            {/* SECCION DE EVALUACION APROB/RECHA. */}
            <DividerComponent title={"EVALUACIÓN"} fontWeight={"bolder"} mb={-1} />
            <InputComponent
               col={4}
               idName={"status"}
               label={"Estatus de la Solicitu de Servicio"}
               placeholder={"Estatus"}
               textStyleCase={true}
               styleInput={2}
               disabled={true}
               size="small"
            />
            {formData.approved_user ||
               (formData.rejected_user && (
                  <>
                     <InputComponent
                        col={4}
                        idName={formData.approved_user ? "approved_user" : formData.rejected_user ? "rejected_user" : ""}
                        label={"Usuario Evaluador"}
                        placeholder={"Nombre de Usuario"}
                        styleInput={2}
                        disabled={true}
                        size="small"
                     />
                     <DatePickerComponent
                        col={4}
                        idName={formData.approved_at ? "approved_at" : formData.rejected_at ? "rejected_at" : ""}
                        label={"Fecha y Hora de Evaluación"}
                        format={"dddd d MMMM YYYY hh:mm a"}
                        disabled={true}
                        size="small"
                        marginBottom={0}
                     />
                  </>
               ))}
            {/* SECCION DE EVALUACION APROB/RECHA. */}

            {/* SECCION DE REVISIÓN. */}
            {!formData.reviewed_user && (
               <>
                  <DividerComponent title={"REVISIÓN"} fontWeight={"bolder"} mb={-1} />
                  <InputComponent
                     col={4}
                     idName={"reviewed_user"}
                     label={"Mecánico"}
                     placeholder={"Nombre del Mecánico"}
                     textStyleCase={true}
                     styleInput={2}
                     disabled={true}
                     size="small"
                  />
                  <InputComponent
                     col={4}
                     idName={"reviewed_user"}
                     label={"Usuario Evaluador"}
                     placeholder={"Nombre de Usuario"}
                     styleInput={2}
                     disabled={true}
                     size="small"
                  />
                  <DatePickerComponent
                     col={4}
                     idName={"reviewed_at"}
                     label={"Fecha y Hora de Evaluación"}
                     format={"dddd d MMMM YYYY hh:mm a"}
                     disabled={true}
                     size="small"
                     marginBottom={0}
                  />
                  <InputComponent
                     col={12}
                     idName={"final_diagnosis"}
                     label={"Diagnóstico Final *"}
                     placeholder={"Diagonistico del mecánico..."}
                     textStyleCase={null}
                     rows={3}
                     styleInput={2}
                     disabled={formData.status !== "EN REVISIÓN"}
                     size="small"
                  />

                  <Grid container sm={12} justifyContent={"center"}>
                     <Typography variant="h4">Cargar Material</Typography>
                  </Grid>
                  {/* <Select2Component col={3} idName={"code"} label={"Código"} options={[]} pluralName={"Materiales"} size="small" />
                  <InputComponent
                     col={4}
                     idName={"description"}
                     label={"Descripción del material"}
                     placeholder={"Material..."}
                     styleInput={2}
                     disabled={true}
                     size="small"
                  />
                  <InputComponent
                     col={2}
                     idName={"quantity"}
                     label={"Cantidad"}
                     placeholder={"999"}
                     styleInput={2}
                     disabled={formData.status !== "EN REVISIÓN"}
                     size="small"
                  />
                  <Grid item xs={12} md={1} sx={{ mb: 1, mt: 1 }}>
                     <Tooltip title="Cargar Material">
                        <IconButton onClick={() => Toast.Success("Cargando material")}>
                           <UploadIcon />
                        </IconButton>
                     </Tooltip>
                  </Grid>
                  <ServiceMaterialDT /> */}
                  <Grid width={"100%"} xs={12} spacing={2} height={"67vh"} maxHeight={"67vh"} overflow={"auto"}>
                     <Grid xs={12} container spacing={2}>
                        {/* LISTADO */}
                        <Grid xs={12} md={12} sx={{ mb: 3 }}>
                           <Typography variant="h2" mb={2}>
                              ¿Quienes viven actualmente con el alumno?
                           </Typography>
                           {/* <MaterialDT becaId={folio} setFieldValue={formik.setFieldValue} values={formik.values} /> */}
                        </Grid>
                     </Grid>
                  </Grid>
               </>
            )}

            {/* SECCION DE REVISIÓN. */}
         </FormikComponent>
      </ModalComponent>
   );
}

export default ModalService;
