import * as Yup from "yup";
import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { Box, Button, Grid, MenuItem, TextField, Tooltip, Typography, CircularProgress } from "@mui/material";
import { IconDeviceFloppy, IconSend, IconCheck, IconX } from "@tabler/icons";

import { ModalComponent } from "../../../components/ModalComponent";
import { colorPrimaryDark, useGlobalContext } from "../../../context/GlobalContext";
import Toast from "../../../utils/Toast";
import ClockComponent from "../../../components/ClockComponent";
import sAlert from "../../../utils/sAlert";
import { useServiceContext } from "../../../context/ServiceContext";
import { useVehicleContext } from "../../../context/VehicleContext";
import { useMechanicContext } from "../../../context/MechanicContext";
import MaterialDT from "../../garage/ServicesView/MaterialDT";
import { formatDatetime } from "../../../utils/Formats";

// ─── Paleta de estados ────────────────────────────────────────────────────────
const STATUS_STYLE = {
   ABIERTA: { bg: "#FFF8E1", color: "#633806", dot: "#BA7517" },
   "EN REVISIÓN": { bg: "#E3F2FD", color: "#0C447C", dot: "#378ADD" },
   CERRADA: { bg: "#E8F5E9", color: "#27500A", dot: "#639922" },
   RECHAZADA: { bg: "#FFEBEE", color: "#791F1F", dot: "#E24B4A" }
};

function StatusPill({ status }) {
   const s = STATUS_STYLE[status] ?? { bg: "#F5F5F5", color: "#616161", dot: "#9E9E9E" };
   return (
      <Box
         sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            px: 1.25,
            py: 0.4,
            borderRadius: "100px",
            bgcolor: s.bg,
            color: s.color,
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.3
         }}
      >
         <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.dot, flexShrink: 0 }} />
         {status}
      </Box>
   );
}

// ─── Encabezado de sección (icono + título + línea) ──────────────────────────
function SectionHead({ iconEl, title, iconBg, iconColor }) {
   return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, mt: 0.5 }}>
         <Box
            sx={{
               width: 24,
               height: 24,
               borderRadius: "6px",
               bgcolor: iconBg,
               color: iconColor,
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               flexShrink: 0,
               fontSize: 14
            }}
         >
            {iconEl}
         </Box>
         <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3, color: "text.primary" }}>{title}</Typography>
         <Box sx={{ flex: 1, height: "0.5px", bgcolor: "divider" }} />
      </Box>
   );
}

// ─── Campo de solo lectura ────────────────────────────────────────────────────
function InfoChip({ label, value, mono, children }) {
   return (
      <Box sx={{ bgcolor: "grey.50", border: "0.5px solid", borderColor: "divider", borderRadius: 1.5, px: 1.5, py: 1 }}>
         <Typography sx={{ fontSize: 10, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5, mb: 0.3 }}>{label}</Typography>
         {value !== undefined && value !== null && <Typography sx={{ fontSize: 13, fontWeight: 600, fontFamily: mono ? "monospace" : undefined }}>{value}</Typography>}
         {children}
      </Box>
   );
}

// ─── Bloque de texto de solo lectura ─────────────────────────────────────────
function ReadBlock({ text, empty = "Sin registrar" }) {
   return (
      <Box sx={{ bgcolor: "grey.50", border: "0.5px solid", borderColor: "divider", borderRadius: 1.5, px: 1.5, py: 1.1 }}>
         <Typography sx={{ fontSize: 13, lineHeight: 1.7, color: text ? "text.primary" : "text.disabled", fontStyle: text ? "normal" : "italic" }}>
            {text || empty}
         </Typography>
      </Box>
   );
}

// ─── Input estilizado (igual al preview) ─────────────────────────────────────
const fieldSx = {
   "& .MuiOutlinedInput-root": {
      fontSize: 13,
      bgcolor: "grey.50",
      borderRadius: 1.5,
      "& fieldset": { borderWidth: "0.5px", borderColor: "divider" },
      "&:hover fieldset": { borderColor: "text.secondary" },
      "&.Mui-focused fieldset": { borderWidth: "1px" },
      "&.Mui-disabled": { opacity: 0.55 }
   },
   "& .MuiInputLabel-root": { fontSize: 12 }
};

function Field({ label, name, formik, type = "text", multiline, rows, disabled, inputProps, select, children, placeholder }) {
   const hasError = formik.touched[name] && Boolean(formik.errors[name]);
   return (
      <TextField
         fullWidth
         size="small"
         label={label}
         name={name}
         type={type}
         value={formik.values[name] ?? ""}
         onChange={formik.handleChange}
         onBlur={formik.handleBlur}
         error={hasError}
         helperText={hasError ? formik.errors[name] : undefined}
         multiline={multiline}
         rows={rows}
         disabled={disabled}
         inputProps={inputProps}
         select={select}
         placeholder={placeholder}
         sx={fieldSx}
      >
         {children}
      </TextField>
   );
}

// ─── Valores iniciales ────────────────────────────────────────────────────────
const INIT = {
   id: 0,
   folio: 0,
   vehicle_id: 0,
   contact_name: "",
   contact_cellphone: "",
   pre_diagnosis: "",
   final_diagnosis: "",
   stock_number: 0,
   km: 0,
   mechanic_id: 0,
   status: "",
   vehicle: "",
   requested_user: "",
   requested_at: "",
   approved_user: "",
   approved_at: "",
   rejected_at: ""
};

const validationSchema = Yup.object({
   stock_number: Yup.number().required("Número de inventario requerido"),
   contact_name: Yup.string().trim().required("Nombre de contacto requerido"),
   contact_cellphone: Yup.string()
      .trim()
      .matches(/^[0-9]{10}$/, "10 dígitos requeridos")
      .required("Teléfono requerido"),
   pre_diagnosis: Yup.string().trim().required("Pre-diagnóstico requerido")
});

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ModalService({ open, setOpen, modalTitle, maxWidth, obj = null }) {
   const { stock_number = 0, status = null } = useParams();
   const { setLoadingAction } = useGlobalContext();
   const { vehicle, showVehicle, showVehicleBy } = useVehicleContext();
   const { mechanics, getMechanicsSelectIndex } = useMechanicContext();
   const { createService, updateService, updateReport } = useServiceContext();

   const [vehicleInfo, setVehicleInfo] = useState(null);
   const [submitting, setSubmitting] = useState(false);

   const formik = useFormik({
      enableReinitialize: true,
      initialValues: obj ?? { ...INIT, stock_number },
      validationSchema,
      onSubmit: async (values, { resetForm }) => {
         try {
            setSubmitting(true);
            setLoadingAction(true);
            const res = await showVehicleBy("stock_number", values.stock_number);
            values.vehicle_id = res.result?.id;

            const axiosResponse = values.id === 0 ? await createService(values) : await updateReport(values);

            if (axiosResponse.status_code === 200) {
               resetForm();
               setOpen(false);
            }
            sAlert.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon, true, null);
            showVehicle(vehicle?.id);
         } catch (err) {
            Toast.Error(err.message);
         } finally {
            setSubmitting(false);
            setLoadingAction(false);
         }
      }
   });

   const isNew = formik.values.folio === 0;
   const isReview = formik.values.status === "EN REVISIÓN";

   useLayoutEffect(() => {
      if (obj) {
         formik.setValues(obj);
         getMechanicsSelectIndex();
      }
   }, [obj]);

   const handleSaveFinalDiagnosis = async () => {
      if (!formik.values.final_diagnosis) return Toast.Info("Escribe el diagnóstico antes de guardar.");
      await updateService(formik.values, status);
      Toast.Success("Diagnóstico guardado.");
   };

   const handleCancel = () => {
      formik.resetForm();
      setOpen(false);
   };

   // ── Render ─────────────────────────────────────────────────────────────────
   return (
      <ModalComponent open={open} setOpen={setOpen} modalTitle={modalTitle} maxWidth={maxWidth} height="65vh">
         <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* ══ Contenido scrollable ══ */}
            <Box sx={{ flex: 1, overflow: "auto", px: 0.5, pb: 1 }}>
               {/* ── MODO NUEVA SOLICITUD ─────────────────────────────────── */}
               {isNew && (
                  <>
                     {/* Reloj */}
                     <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                        <ClockComponent textColor={colorPrimaryDark} />
                     </Box>

                     {/* Unidad */}
                     <SectionHead iconEl="🚗" title="Unidad" iconBg="#E6F1FB" iconColor="#185FA5" />
                     <Grid container spacing={1.5} mb={2}>
                        <Grid item xs={4}>
                           <Field label="N° económico *" name="stock_number" type="number" formik={formik} disabled placeholder="1168" />
                        </Grid>
                        <Grid item xs={4}>
                           <Field label="Kilometraje actual *" name="km" type="number" formik={formik} placeholder="0" />
                        </Grid>
                        {vehicleInfo && (
                           <Grid item xs={12}>
                              <Box
                                 sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.25,
                                    bgcolor: "#E6F1FB",
                                    border: "0.5px solid #B5D4F4",
                                    borderRadius: 1.5,
                                    px: 1.5,
                                    py: 1
                                 }}
                              >
                                 <Box
                                    sx={{
                                       width: 30,
                                       height: 30,
                                       borderRadius: 1,
                                       bgcolor: "#185FA5",
                                       display: "flex",
                                       alignItems: "center",
                                       justifyContent: "center",
                                       flexShrink: 0,
                                       fontSize: 15
                                    }}
                                 >
                                    🚗
                                 </Box>
                                 <Box>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0C447C" }}>
                                       {vehicleInfo.brand} {vehicleInfo.model} {vehicleInfo.year}
                                    </Typography>
                                    <Typography sx={{ fontSize: 11, color: "#185FA5" }}>
                                       Placa {vehicleInfo.plates} · Eco. {vehicleInfo.stock_number}
                                    </Typography>
                                 </Box>
                              </Box>
                           </Grid>
                        )}
                     </Grid>

                     {/* Contacto */}
                     <SectionHead iconEl="👤" title="Contacto" iconBg="#EEEDFE" iconColor="#534AB7" />
                     <Grid container spacing={1.5} mb={2}>
                        <Grid item xs={7}>
                           <Field label="Nombre de contacto *" name="contact_name" formik={formik} placeholder="Nombre completo" />
                        </Grid>
                        <Grid item xs={5}>
                           <Field label="Teléfono *" name="contact_cellphone" formik={formik} placeholder="10 dígitos" inputProps={{ maxLength: 10 }} />
                        </Grid>
                     </Grid>

                     {/* Reporte */}
                     <SectionHead iconEl="📋" title="Reporte" iconBg="#FAEEDA" iconColor="#854F0B" />
                     <Field
                        label="Quiero reportar que… *"
                        name="pre_diagnosis"
                        formik={formik}
                        multiline
                        rows={4}
                        placeholder="Describa detalladamente el problema observado en la unidad…"
                     />
                  </>
               )}

               {/* ── MODO VER / GESTIONAR REPORTE ────────────────────────── */}
               {!isNew && (
                  <>
                     {/* Chips de resumen */}
                     <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 1, mb: 2 }}>
                        <InfoChip label="Folio" value={`#${formik.values.folio}`} mono />
                        <InfoChip label="N° económico" value={formik.values.stock_number} />
                        <InfoChip label="Unidad" value={formik.values.vehicle} />
                        <InfoChip label="Estado">
                           <StatusPill status={formik.values.status} />
                        </InfoChip>
                     </Box>

                     {/* Quién solicitó / aprobó */}
                     <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 2 }}>
                        <Box sx={{ bgcolor: "grey.50", border: "0.5px solid", borderColor: "divider", borderRadius: 1.5, px: 1.5, py: 1 }}>
                           <Typography sx={{ fontSize: 10, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5, mb: 0.25 }}>Solicitó</Typography>
                           <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{formik.values.requested_user || "—"}</Typography>
                           {formik.values.requested_at && (
                              <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}>{formatDatetime(formik.values.requested_at, true)}</Typography>
                           )}
                        </Box>
                        <Box sx={{ bgcolor: "grey.50", border: "0.5px solid", borderColor: "divider", borderRadius: 1.5, px: 1.5, py: 1 }}>
                           <Typography sx={{ fontSize: 10, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5, mb: 0.25 }}>
                              {formik.values.approved_by ? "Aprobó" : formik.values.rejected_by ? "Rechazó" : "Evaluó"}
                           </Typography>
                           <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{formik.values.approved_user || "—"}</Typography>
                           {(formik.values.approved_at || formik.values.rejected_at) && (
                              <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}>
                                 {formatDatetime(formik.values.approved_at || formik.values.rejected_at, true)}
                              </Typography>
                           )}
                        </Box>
                     </Box>

                     {/* Datos de la solicitud */}
                     <SectionHead iconEl="📄" title="Datos de solicitud" iconBg="#E6F1FB" iconColor="#185FA5" />
                     <Grid container spacing={1.5} mb={2}>
                        <Grid item xs={3}>
                           <Field label="Folio" name="folio" formik={formik} disabled />
                        </Grid>
                        <Grid item xs={3}>
                           <Field label="N° económico" name="stock_number" formik={formik} disabled />
                        </Grid>
                        <Grid item xs={3}>
                           <Field label="Kilometraje" name="km" formik={formik} disabled />
                        </Grid>
                        {formik.values.status !== "ABIERTA" && (
                           <Grid item xs={3}>
                              <Field label="Estatus" name="status" formik={formik} disabled />
                           </Grid>
                        )}
                        <Grid item xs={7}>
                           <Field label="Unidad" name="vehicle" formik={formik} disabled />
                        </Grid>
                        <Grid item xs={5}>
                           <Field label="Usuario solicitante" name="requested_user" formik={formik} disabled />
                        </Grid>
                     </Grid>

                     {/* Contacto */}
                     <SectionHead iconEl="👤" title="Contacto" iconBg="#EEEDFE" iconColor="#534AB7" />
                     <Grid container spacing={1.5} mb={2}>
                        <Grid item xs={7}>
                           <Field label="Nombre de contacto" name="contact_name" formik={formik} disabled />
                        </Grid>
                        <Grid item xs={5}>
                           <Field label="Teléfono" name="contact_cellphone" formik={formik} disabled />
                        </Grid>
                     </Grid>

                     {/* Pre-diagnóstico */}
                     <SectionHead iconEl="📋" title="Reporte del solicitante" iconBg="#FAEEDA" iconColor="#854F0B" />
                     <Box mb={2}>
                        <ReadBlock text={formik.values.pre_diagnosis} empty="Sin pre-diagnóstico registrado." />
                     </Box>

                     {/* Revisión — solo EN REVISIÓN */}
                     {isReview && (
                        <>
                           <SectionHead iconEl="🔧" title="Revisión · mecánico asignado" iconBg="#E1F5EE" iconColor="#0F6E56" />
                           <Grid container spacing={1.5} mb={1.5}>
                              <Grid item xs={8}>
                                 <Field label="Mecánico" name="mechanic_id" formik={formik} select>
                                    {mechanics?.map((m) => (
                                       <MenuItem key={m.value} value={m.value} sx={{ fontSize: 13 }}>
                                          {m.label}
                                       </MenuItem>
                                    ))}
                                 </Field>
                              </Grid>
                              <Grid item xs={4}>
                                 <Field label="Fecha de revisión" name="reviewed_at" type="datetime-local" formik={formik} />
                              </Grid>
                              <Grid item xs={12}>
                                 <Field
                                    label="Diagnóstico final *"
                                    name="final_diagnosis"
                                    formik={formik}
                                    multiline
                                    rows={3}
                                    placeholder="Diagnóstico del mecánico…"
                                 />
                              </Grid>
                           </Grid>

                           <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                              <Tooltip title="Guardar diagnóstico final" placement="left">
                                 <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleSaveFinalDiagnosis}
                                    startIcon={<IconDeviceFloppy size={16} />}
                                    sx={{ fontSize: 12, textTransform: "none", borderRadius: 1.5, borderWidth: "0.5px" }}
                                 >
                                    Guardar diagnóstico
                                 </Button>
                              </Tooltip>
                           </Box>

                           {/* Materiales */}
                           <SectionHead iconEl="🔩" title="Material utilizado" iconBg="#F1EFE8" iconColor="#5F5E5A" />
                           <Box sx={{ height: "42vh", overflow: "auto", border: "0.5px solid", borderColor: "divider", borderRadius: 1.5 }}>
                              <MaterialDT serviceId={formik.values.id} setFieldValue={formik.setFieldValue} values={formik.values} />
                           </Box>
                        </>
                     )}
                  </>
               )}
            </Box>

            {/* ══ Barra de acciones fija abajo ══ */}
            <Box
               sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  pt: 1.5,
                  mt: 1,
                  borderTop: "0.5px solid",
                  borderColor: "divider"
               }}
            >
               <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancel}
                  startIcon={<IconX size={15} />}
                  sx={{ fontSize: 12, textTransform: "none", borderRadius: 1.5, borderWidth: "0.5px", color: "text.secondary" }}
               >
                  Cancelar
               </Button>

               <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : isNew ? <IconSend size={15} /> : <IconCheck size={15} />}
                  sx={{ fontSize: 12, textTransform: "none", borderRadius: 1.5 }}
               >
                  {isNew ? "Enviar solicitud" : "Guardar cambios"}
               </Button>
            </Box>
         </Box>
      </ModalComponent>
   );
}
