import * as Yup from "yup";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ModalComponent } from "../../../components/ModalComponent";
import { colorPrimaryDark, useGlobalContext } from "../../../context/GlobalContext";
import Toast from "../../../utils/Toast";
import { DatePickerComponent, DividerComponent, FormikComponent, InputComponent, Select2Component } from "../../../components/Form/FormikComponents";
import { useParams } from "react-router-dom";
import ClockComponent from "../../../components/ClockComponent";
import { Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import { useServiceContext } from "../../../context/ServiceContext";
import { useVehicleContext } from "../../../context/VehicleContext";
import { setPropsOriginals } from "../../../utils/Formats";
import UploadIcon from "@mui/icons-material/Upload";
import ServiceMaterialDT from "../../garage/ServicesView/ServiceMaterialDT";
import MaterialDT from "../../garage/ServicesView/MaterialDT";
import { IconDeviceFloppy } from "@tabler/icons";
import { useMechanicContext } from "../../../context/MechanicContext";

function ModalService({ open, setOpen, modalTitle, maxWidth, showActionButtons = true, obj = null }) {
   const { stock_number = 0, status = null } = useParams();

   const initialValues = {
      //variables para crear registro
      id: 0,
      folio: 0,
      vehicle_id: 0,
      contact_name: "",
      contact_cellphone: "",
      pre_diagnosis: "",
      final_diagnosis: "",
      evidence_img_path: null,

      stock_number: stock_number,
      km: 0,

      mechanic_id: 0,
      status: "",
      vehicle: "",
      requested_by: 0,
      requested_at: "",
      approved_by: 0,
      approved_at: "",
      rejected_by: 0,
      rejected_at: ""
   };

   const { setLoadingAction } = useGlobalContext();
   const { vehicle, showVehicle, showVehicleBy } = useVehicleContext();
   const { mechanics, getMechanicsSelectIndex } = useMechanicContext();
   const { /* formData, setFormData,  resetFormData,*/ service, showService, createService, updateService, updateReport, textBtnSubmit, setTextBtnSumbit, formikRef } =
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
         setLoadingAction(false);
         setSubmitting(false);
      } finally {
         setLoadingAction(false);
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

   const handleClickSaveFinalDiagnosis = async () => {
      try {
         const final_diagnosis = formikRef.current.values.final_diagnosis;
         if (final_diagnosis == null || final_diagnosis == "") return Toast.Info("No se ha escrito ningún diagnóstico.");
         const axiosResponse = await updateService(formikRef.current.values, status);
         Toast.Success("Diagnóstico guardado.");
      } catch (error) {
         console.log("🚀 ~ handleClickSaveFinalDiagnosis ~ error:", error);
         Toast.Error(error);
      }
   };

   const validationSchema = Yup.object().shape({
      stock_number: Yup.number("Solo números").required("Número de Inventario requerido"),
      contact_name: Yup.string().trim().required("Nombre de contacto requerido"),
      contact_cellphone: Yup.string()
         .trim()
         .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
         .required("Número telefónico requerido"),
      pre_diagnosis: Yup.string().trim().required("Pre diagnóstico requerido")
   });

   useEffect(() => {}, [formikRef]);

   useLayoutEffect(() => {
      // console.log("🚀 ~ useLayoutEffect ~ obj:", obj);
      // if (obj) setFormData(setPropsOriginals(formData, obj));
      if (obj) {
         setFormData(obj);
         getMechanicsSelectIndex();
      }
   }, [formikRef]);
   // console.log("🚀 ~ useLayoutEffect ~ formData:", formData);

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
            <InputComponent
               col={4}
               idName={"km"}
               label={"Kilometraje Actual *"}
               placeholder={"0"}
               type={"number"}
               styleInput={2}
               disabled={formData.folio > 0 ? true : false}
               size={formData.folio == 0 ? "medium" : "small"}
            />
            {formData.folio == 0 ? (
                <Grid container item sm={5} justifyContent={"end"}>
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

                  {formData.status !== "ABIERTA" && (
                     <InputComponent
                        col={7}
                        idName={"status"}
                        label={"Estatus de la Solicitud de Servicio"}
                        placeholder={"Estatus"}
                        textStyleCase={true}
                        styleInput={2}
                        disabled={true}
                        size="small"
                     />
                  )}

                  <DividerComponent title={"REPORTE"} fontWeight={"bolder"} mb={-1} mt={5} />
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
               disabled={formData.folio > 0 ? true : false}
               size="small"
            />

            <InputComponent
               col={5}
               idName={"contact_cellphone"}
               label={"Teléfono de Contacto *"}
               placeholder={"Ingresa un número telefónico a 10 dígitos"}
               textStyleCase={true}
               inputProps={{ maxLength: 10 }}
               styleInput={2}
               disabled={formData.folio > 0 ? true : false}
               size="small"
            />

            <InputComponent
               col={12}
               idName={"pre_diagnosis"}
               label={"Quiero reportar que... *"}
               placeholder={"Describa que fue lo que paso..."}
               textStyleCase={null}
               rows={3}
               styleInput={2}
               disabled={formData.folio > 0 ? true : false}
               size="small"
            />
            {/* SECCION DE REPORTE */}

            {formData.folio > 0 && (
               <>
                  {/* SECCION DE EVALUACION APROB/RECHA. */}
                  {formData.status !== "ABIERTA" && <DividerComponent title={"APROBADA POR"} fontWeight={"bolder"} mb={-1} mt={5} />}
                  {(formData.approved_by || formData.rejected_by) && (
                     <>
                        <InputComponent
                           col={6}
                           idName={formData.approved_by ? "approved_user" : formData.rejected_by ? "rejected_by" : ""}
                           label={"Usuario"}
                           placeholder={"Nombre de Usuario"}
                           styleInput={2}
                           disabled={true}
                           size="small"
                        />
                        <DatePickerComponent
                           col={6}
                           idName={formData.approved_at ? "approved_at" : formData.rejected_at ? "rejected_at" : ""}
                           label={"Fecha y Hora de Evaluación"}
                           format={"dddd d MMMM YYYY hh:mm a"}
                           disabled={true}
                           size="small"
                           marginBottom={0}
                        />
                     </>
                  )}
                  {/* SECCION DE EVALUACION APROB/RECHA. */}

                  {/* SECCION DE REVISIÓN. */}
                  {formData.status === "EN REVISIÓN" && (
                     <>
                        <DividerComponent title={"REVISIÓN"} fontWeight={"bolder"} mb={-1} mt={5} />
                        <Select2Component
                           col={8}
                           idName={"mechanic_id"}
                           label={"Mecánico"}
                           options={mechanics}
                           pluralName={"Mécanicos"}
                           refreshSelect={getMechanicsSelectIndex}
                           styleInput={2}
                           disabled={formData.status !== "EN REVISIÓN" ? true : false}
                        />
                        {/* <InputComponent
                           col={8}
                           idName={"reviewed_by"}
                           label={"Mecánico"}
                           placeholder={"Nombre del Mecánico"}
                           textStyleCase={true}
                           styleInput={2}
                           disabled={formData.status !== "EN REVISIÓN" ? true : false}
                           size="small"
                        /> */}
                        <DatePickerComponent
                           col={4}
                           idName={"reviewed_at"}
                           label={"Fecha y Hora de Evaluación"}
                           format={"dddd d MMMM YYYY hh:mm a"}
                           disabled={formData.status !== "EN REVISIÓN" ? true : false}
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
                           disabled={formData.status !== "EN REVISIÓN" ? true : false}
                           size="small"
                        />
                         <Grid container item sm={12} justifyContent={"end"} mt={-3} mr={2} mb={2}>
                           <Tooltip title="Guardar diagnóstico final" placement="left">
                              <Button variant="contained" onClick={handleClickSaveFinalDiagnosis}>
                                 <IconDeviceFloppy />
                                 &nbsp; Guardar
                              </Button>
                           </Tooltip>
                        </Grid>

                        <Grid container item sm={12} justifyContent={"center"}>
                           <Typography variant="h4">Cargar Material</Typography>
                        </Grid>
                        <Grid width={"100%"} xs={12} spacing={2} height={"67vh"} maxHeight={"67vh"} overflow={"auto"}>
                           <MaterialDT serviceId={1} setFieldValue={formikRef.setFieldValue} values={formikRef.values} />
                        </Grid>
                     </>
                  )}
                  {/* SECCION DE REVISIÓN. */}
               </>
            )}
         </FormikComponent>
      </ModalComponent>
   );
}

export default ModalService;
