import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Fragment, forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { ListItemButton, TextField } from "@mui/material";
import SearchInput from "../../../components/SearchInput";
import { useDriverContext } from "../../../context/DriverContext";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import { useVehicleContext } from "../../../context/VehicleContext";
import Toast from "../../../utils/Toast";
import { useDeliveredVehicleContext } from "../../../context/DeliveredVehicleContext";
import { formatDatetimeToSQL } from "../../../utils/Formats";
import { useGlobalContext } from "../../../context/GlobalContext";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalDeliver = ({ open, setOpen }) => {
   // const [open, setOpen] = useState(false);
   const mySwal = withReactContent(Swal);
   const { setLoadingAction } = useGlobalContext();
   const { vehicle, showVehicle, dataList, setDataList } = useVehicleContext();
   const { /* loanedVehicle, setDeliveredVehicle, */ createDeliveredVehicle } = useDeliveredVehicleContext();
   const [showErrorReason, setShowErrorReason] = useState(false);
   const [showErrorKm, setShowErrorKm] = useState(false);
   const [formData, setFormData] = useState({
      accident_folio: 0,
      assigned_vehicle_id: 0,
      reason: "",
      date: "",
      km_deliver: 0
   });

   const handleClose = () => {
      setOpen(false);
      setFormData({ ...formData, reason: "", km_deliver: 0 });
   };

   const handleSubmit = (e) => {
      try {
         e.preventDefault();
         if (formData.reason.length < 1) setShowErrorReason(true);
         if (formData.km_deliver < 0) setShowErrorKm(true);
         if (showErrorReason) return;
         if (showErrorKm) return;

         setFormData({
            ...formData,
            assigned_vehicle_id: vehicle.ass_folio,
            // full_name: full_name,
            date: formatDatetimeToSQL(new Date())
         });
         formData.assigned_vehicle_id = vehicle.ass_folio;
         formData.date = formatDatetimeToSQL(new Date());

         mySwal
            .fire(QuestionAlertConfig(`Estas por terminar la asignación el vehículo con N° económico ${vehicle.stock_number}`, "TERMINAR", "CANCELAR", "info"))
            .then(async (result) => {
               if (result.isConfirmed) {
                  setLoadingAction(true);

                  // return console.log(formData);
                  const axiosResponse = await createDeliveredVehicle(formData);
                  await showVehicle(vehicle.id);
                  setOpen(false);
                  setLoadingAction(false);
                  Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
                  setFormData({
                     accident_folio: 0,
                     assigned_vehicle_id: 0,
                     reason: "",
                     date: "",
                     km_deliver: 0
                  });
               }
            });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      // console.log("estoy en el modal", drivers);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", drivers);
   }, []);

   return (
      <div>
         {/* FORMULARIO COMPLEMENTARIO */}
         <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backgroundColor: "transparent" }}
         >
            <DialogTitle>
               <Typography variant="h4" component={"p"} textAlign={"center"}>
                  RAZÓN DE LA DEVOLUCION DE UNIDAD Y KILOMETRAJE
               </Typography>
            </DialogTitle>
            <DialogContent sx={{ pb: 0 }}>
               <form onSubmit={handleSubmit}>
                  <TextField
                     id="reason"
                     name="reason"
                     label="Razón *"
                     type="text"
                     value={formData.reason}
                     placeholder="Ingrese la razón del prestamo..."
                     onChange={(e) => {
                        setFormData({
                           ...formData,
                           reason: e.target.value
                        });
                        setShowErrorReason(false);
                        if (e.target.value.length < 1) setShowErrorReason(true);
                     }}
                     // InputProps={{ }}
                     multiline={true}
                     fullWidth
                     sx={{ mt: 1 }}
                  />
                  {showErrorReason && (
                     <Typography color={"red"} variant="subtitle2">
                        La razón es requerida.
                     </Typography>
                  )}
                  <TextField
                     id="km_deliver"
                     name="km_deliver"
                     label="Kilometraje *"
                     type="number"
                     value={formData.km_deliver}
                     placeholder="Ingrese el km actual de la unidad..."
                     onChange={(e) => {
                        setFormData({
                           ...formData,
                           km_deliver: e.target.value
                        });
                        setShowErrorKm(false);
                        if (Number(e.target.value) < 0) setShowErrorKm(true);
                     }}
                     InputProps={{ step: "01" }}
                     fullWidth
                     sx={{ mt: 3 }}
                  />
                  {showErrorKm && (
                     <Typography color={"red"} variant="subtitle2">
                        El Kilometraje es requerido.
                     </Typography>
                  )}
                  <Button type="submit">ACEPTAR</Button>
               </form>
            </DialogContent>
            <DialogActions sx={{ my: 0, pt: 0 }}>
               <Button onClick={handleClose}>Cerrar</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

export default ModalDeliver;
