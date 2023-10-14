import { Formik } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Fragment, forwardRef, useEffect } from "react";
import { ButtonGroup, ListItemButton, TextField } from "@mui/material";
import { useUserContext } from "../../../context/UserContext";
import { gpcDark, gpcLight, useGlobalContext } from "../../../context/GlobalContext";

import { InputAdornment, OutlinedInput } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@emotion/react";
import { shouldForwardProp } from "@mui/system";
import InputComponentv2 from "../../../components/Form/InputComponentv2";
import { useServiceContext } from "../../../context/ServiceContext";
import { LoadingButton } from "@mui/lab";
import Toast from "../../../utils/Toast";

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
   // width: 434,
   // marginLeft: 16,
   // paddingLeft: 16,
   // paddingRight: 16,
   "& input": {
      background: "#fff !important",
      paddingLeft: "10px !important"
   },
   [theme.breakpoints.down("lg")]: {
      width: 250
   },
   [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff"
   }
}));

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalService = ({ open, setOpen }) => {
   const theme = useTheme();

   // const [open, setOpen] = useState(false);
   const { setLoadingAction, setDisabledState, setDisabledCity, setDisabledColony, setShowLoading, cursorLoading } = useGlobalContext();
   const { users, getUsers } = useUserContext();
   const { formData, setFormData, resetFormData, service, createService, textBtnSubmit, setTextBtnSumbit } = useServiceContext();

   const handleClose = () => {
      setOpen(false);
   };

   function stringToColor(string) {
      let hash = 0;
      let i;

      /* eslint-disable no-bitwise */
      for (i = 0; i < string.length; i += 1) {
         hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = "#";

      for (i = 0; i < 3; i += 1) {
         const value = (hash >> (i * 8)) & 0xff;
         color += `00${value.toString(16)}`.slice(-2);
      }
      /* eslint-enable no-bitwise */

      return color;
   }

   function stringAvatar(name) {
      const letters = name.length < 3 ? "?" : `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`;

      return {
         sx: {
            bgcolor: stringToColor(name)
         },
         children: letters
      };
   }

   const ItemUser = ({ full_name = "", department, email }) => {
      return (
         <>
            {/* <Divider variant="inset" component="li" /> */}
            <ListItemButton alignItems="flex-start">
               <ListItemAvatar>
                  <Avatar {...stringAvatar(full_name)} />
               </ListItemAvatar>
               <ListItemText
                  primary={<Typography variant="h4">{full_name}</Typography>}
                  secondary={
                     <Fragment>
                        <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                           {department}
                        </Typography>
                        — {email}
                     </Fragment>
                  }
               />
            </ListItemButton>
            <Divider variant="inset" component="li" sx={{ marginLeft: "0px;" }} />
         </>
      );
   };

   const ItemUserTest = ({ full_name = "", department, email }) => {
      return (
         <>
            <Grid xs={12} md={6} sx={{ mb: 2 }}>
               <OutlineInputStyle
                  id={"search"}
                  name={"search"}
                  type={"text"}
                  fullWidth
                  value={""}
                  // onChange={(e) => handleChangeSearch(e.target.value)}
                  // onKeyUp={(e) => handleKeyUpSearch(e)}
                  placeholder={"Buscar vehículo"}
                  startAdornment={
                     // <Tooltip title={""} placement={"top"}>
                     <InputAdornment position="start" sx={{ mx: 2 }}>
                        <Typography sx={{ color: gpcLight, fontWeight: "bolder", fontSize: 16 }}>N° Unidad</Typography>
                        {/* <IconSearch stroke={2.5} size="1.5rem" color={theme.palette.grey[500]} /> */}
                     </InputAdornment>
                     // </Tooltip>
                  }
                  aria-describedby={"search-helper-text"}
                  inputProps={{ "aria-label": "weight" }}
                  sx={{ backgroundColor: gpcDark, m: 1 }}
                  // {...prop}
               />
            </Grid>

            <InputComponentv2
               idName={"stock_number"}
               label={"N° Unidad"}
               placeholder={"Ingresa el N° Unidad"}
               type="number"
               formData={formData}
               onChange={handleChange}
               onBlur={handleBlur}
               setFieldValue={setFieldValue}
               value={values.stock_number}
               error={errors.stock_number}
               touched={touched.stock_number}
            />
         </>
      );
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm, setFieldValue }) => {
      try {
         console.log("formData", formData);
         console.log("values", values);
         // // values.community_id = values.colony_id;

         // // values.num_int = values.num_int === "" ? "S/N" : values.num_int;
         // setFormData(values);
         // setLoadingAction(true);
         // let axiosResponse;
         // if (values.id == 0) axiosResponse = await createUser(values);
         // else axiosResponse = await updateUser(values);
         // // if (axiosResponse.message == "duplicate") return Toast.Info("hola");
         // if (axiosResponse.status_code == 200) {
         //    resetForm();
         //    setStrength(0);
         //    setTextBtnSumbit("AGREGAR");
         //    setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         // }
         // setSubmitting(false);
         // setLoadingAction(false);
         // Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // if (!checkAdd && axiosResponse.status_code == 200) setOpenDialog(false);
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
         // user.role = "Selecciona una opción...";
         setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = async (values, setValues, setFieldValue) => {
      try {
         if (formData.description) formData.description == null && (formData.description = "");
         setValues(formData);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         // user.role = "Selecciona una opción...";
         // setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchema = Yup.object().shape({
      stock_number: Yup.number("Solo números").required("Número de Inventario requerido")
   });
   // const validationSchema = Yup.object().shape({
   //    // contact_name: Yup.string().trim().required("Nombre de contacto requerido"),
   //    // contact_phone: Yup.string()
   //    //    .trim()
   //    //    .matches(/^[0-9]{10}$/, "Formato invalido - teléfono a 10 dígitos")
   //    //    .required("Número telefónico requerido"),
   //    // pre_diagnosis: Yup.string().trim().required("Pre diagnostico requerido"),
   //    stock_number: Yup.number("Solo números").required("Número de Inventario requerido")
   //    // folio: "",
   //    // vehicle_id: 0,
   //    // final_diagnosis: null,
   //    // evidence_img_path: null,

   //    // year: Yup.number("Solo números")
   //    //    .min(1900, "El año esta fuera del rango permitido")
   //    //    .max(new Date().getFullYear() + 1, "El año esta fuera del rango permitido")
   //    //    .required("Año del modelo requerido")
   //    // // registration_date: "",
   //    // description: "",
   //    // brand: "",
   //    // model: "",
   //    // vehicle_status: "",
   //    // plates: "",
   //    // initial_date: "",
   //    // due_date: ""
   // });

   useEffect(() => {
      console.log(formData);
   }, [formData]);

   return (
      <div>
         {/* <Button variant="outlined" onClick={handleClickOpen}>
            Slide in alert dialog
         </Button> */}
         <Dialog
            maxWidth={"md"}
            fullWidth
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backgroundColor: "transparent" }}
         >
            <DialogTitle bgcolor={gpcDark}>
               <Typography sx={{ color: gpcLight }} variant="h1">
                  {"REGISTRAR SERVICIO".toUpperCase()}
               </Typography>
            </DialogTitle>
            <DialogContent sx={{ maxHeight: "500px", my: 1 }}>
               <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
                  {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                     <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                        {/* <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} /> */}
                        <Grid xs={12} md={6} sx={{ mb: 2 }}>
                           {/* Nombre de Usuario */}
                           <TextField
                              id="stock_number"
                              name="stock_number"
                              label="N° Unidad *"
                              type="number"
                              value={values.stock_number}
                              placeholder="Ingresa el N° Unidad"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              // InputProps={{ }}
                              fullWidth
                              // disabled={values.id == 0 ? false : true}
                              error={errors.stock_number && touched.stock_number}
                              helperText={errors.stock_number && touched.stock_number && errors.stock_number}
                           />
                        </Grid>
                        <LoadingButton
                           type="submit"
                           disabled={isSubmitting}
                           loading={isSubmitting}
                           // loadingPosition="start"
                           variant="contained"
                           fullWidth
                           size="large"
                        >
                           {textBtnSubmit}
                        </LoadingButton>
                        <ButtonGroup variant="outlined" fullWidth>
                           <Button
                              type="reset"
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              size="large"
                              sx={{ mt: 1 }}
                              onClick={() => handleReset(resetForm, setFieldValue, values.id)}
                           >
                              LIMPIAR
                           </Button>
                           <Button type="reset" variant="outlined" color="error" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleCancel(resetForm)}>
                              CANCELAR
                           </Button>
                        </ButtonGroup>
                        <Button
                           type="button"
                           color="info"
                           fullWidth
                           id="btnModify"
                           sx={{ mt: 1, display: "none" }}
                           onClick={() => handleModify(values, setValues, setFieldValue)}
                        >
                           setValues
                        </Button>
                     </Grid>
                  )}
               </Formik>
            </DialogContent>
            <DialogActions sx={{ bgcolor: gpcDark }}>
               <Button variant="text" sx={{ color: gpcLight, fontSize: 16 }} onClick={handleClose}>
                  Cerrar
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

export default ModalService;
