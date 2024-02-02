import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Typography from "@mui/material/Typography";
import { forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { TextField } from "@mui/material";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import { useVehicleContext } from "../../../context/VehicleContext";
import Toast from "../../../utils/Toast";
import { formatDatetimeToSQL } from "../../../utils/Formats";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useLoanedVehicleContext } from "../../../context/LoanedVehicleContext";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalReturnLoan = ({ open, setOpen }) => {
   const mySwal = withReactContent(Swal);
   const { setLoadingAction } = useGlobalContext();
   const { vehicle, showVehicle, dataList, setDataList } = useVehicleContext();
   const { /* loanedVehicle, setLoanedVehicle, */ returnLoan } = useLoanedVehicleContext();
   const [showErrorKm, setShowErrorKm] = useState(false);
   const [formData, setFormData] = useState({
      vehicle_id: 0,
      assigned_vehicle_id: 0,
      delivery_km: 0,
      delivery_date: ""
   });

   const handleClose = () => {
      setOpen(false);
      setFormData({ ...formData, delivery_km: 0 });
   };

   const handleSubmit = async (e) => {
      try {
         e.preventDefault();
         if (formData.delivery_km < 0) setShowErrorKm(true);
         if (showErrorKm) return;

         setFormData({
            ...formData,
            vehicle_id: vehicle.id,
            assigned_vehicle_id: vehicle.ass_folio,
            delivery_date: formatDatetimeToSQL(new Date())
         });
         formData.vehicle_id = vehicle.id;
         formData.assigned_vehicle_id = vehicle.ass_folio;
         formData.delivery_date = formatDatetimeToSQL(new Date());

         mySwal
            .fire(QuestionAlertConfig(`Estas por devolver el prestamo del vehículo con N° económico ${vehicle.stock_number}`, "DEVOLVER", "CANCELAR", "info"))
            .then(async (result) => {
               if (result.isConfirmed) {
                  setLoadingAction(true);

                  // return console.log(formData);
                  const axiosResponse = await returnLoan(formData);
                  await showVehicle(vehicle.id);
                  setOpen(false);
                  setLoadingAction(false);
                  Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
                  setFormData({
                     vehicle_id: 0,
                     assigned_vehicle_id: 0,
                     delivery_km: 0,
                     delivery_date: ""
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
                  KILOMETRAJE DE LA DEVOLUCION DEL PRESTAMO
               </Typography>
            </DialogTitle>
            <DialogContent sx={{ pb: 0 }}>
               <form onSubmit={handleSubmit}>
                  <TextField
                     id="delivery_km"
                     name="delivery_km"
                     label="Kilometraje *"
                     type="number"
                     value={formData.delivery_km}
                     placeholder="Ingrese el km actual de la unidad..."
                     onChange={(e) => {
                        setFormData({
                           ...formData,
                           delivery_km: e.target.value
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

export default ModalReturnLoan;
