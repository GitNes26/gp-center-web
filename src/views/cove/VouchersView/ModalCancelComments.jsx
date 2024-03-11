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
import Toast from "../../../utils/Toast";
import { formatDatetimeToSQL } from "../../../utils/Formats";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useVoucherContext } from "../../../context/VoucherContext";
import { useAuthContext } from "../../../context/AuthContext";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalCancelComments = ({ open, setOpen }) => {
   const { auth } = useAuthContext();
   const mySwal = withReactContent(Swal);
   const { setLoadingAction } = useGlobalContext();
   const { voucher } = useVoucherContext();
   const [showErrorComments, setShowErrorComments] = useState(false);
   const [formData, setFormData] = useState({
      id: 0,
      voucher_status: "CANCELADA",
      canceled_by: auth.id,
      canceled_comments: "",
      canceled_at: ""
   });

   const handleClose = () => {
      setOpen(false);
      setFormData({ ...formData, id: 0, voucher_status: "CANCELADA", canceled_by: auth.id, canceled_comments: "", canceled_at: "" });
   };

   const handleSubmit = async (e) => {
      try {
         console.log("el valeeee", voucher);
         e.preventDefault();
         if (formData.canceled_comments.length < 0) setShowErrorComments(true);
         if (showErrorComments) return;

         setFormData({
            ...formData,
            id: voucher.id,
            voucher_status: "CANCELADA",
            canceled_by: auth.id,
            canceled_at: formatDatetimeToSQL(new Date())
         });
         formData.id = voucher.id;
         formData.voucher_status = "CANCELADA";
         formData.canceled_by = auth.id;
         formData.canceled_at = formatDatetimeToSQL(new Date());

         mySwal.fire(QuestionAlertConfig(`Estas seguro de CANCELAR el vale #${voucher.id}`, "CANCELAR", "NO CANCELAR")).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);

               return console.log(formData);
               const axiosResponse = await updateStatus(formData);
               setOpen(false);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
               setFormData({
                  id: 0,
                  voucher_status: "CANCELADA",
                  canceled_by: auth.id,
                  canceled_comments: "",
                  canceled_at: ""
               });
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      // console.log("estoy en el modal", voucher);
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
                  MOTIVO DE CANCELACIÓN
               </Typography>
            </DialogTitle>
            <DialogContent sx={{ pb: 0 }}>
               <form onSubmit={handleSubmit}>
                  <TextField
                     id="canceled_comments"
                     name="canceled_comments"
                     label="Comentarios de cancelación *"
                     type="text"
                     value={formData.canceled_comments}
                     placeholder="Ingrese comentarios..."
                     onChange={(e) => {
                        setFormData({
                           ...formData,
                           canceled_comments: e.target.value
                        });
                        setShowErrorComments(false);
                        if (Number(e.target.value.length) < 0) setShowErrorComments(true);
                     }}
                     InputProps={{ step: "01" }}
                     fullWidth
                     sx={{ mt: 3 }}
                  />
                  {showErrorComments && (
                     <Typography color={"red"} variant="subtitle2">
                        Los comentarios son requeridos.
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

export default ModalCancelComments;
