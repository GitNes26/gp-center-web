import PropTypes from "prop-types";
import { TransitionSlide, gpcDark, gpcLight } from "../context/GlobalContext";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

const DialogComponent = ({ children, open, setOpen, maxWidth = "md", fullWidth = true, directionSlide = "up", title, contentActions }) => {
   const handleClose = () => {
      setOpen(false);
   };
   return (
      <Dialog
         maxWidth={"md"}
         fullWidth
         open={open}
         TransitionComponent={() => TransitionSlide(directionSlide)}
         keepMounted
         onClose={handleClose}
         aria-describedby="alert-dialog-slide-description"
         sx={{ backgroundColor: "transparent" }}
      >
         <DialogTitle bgcolor={gpcDark}>
            <Typography sx={{ color: gpcLight }} variant="h1" component={"span"}>
               {title.toUpperCase()}
            </Typography>
         </DialogTitle>
         <DialogContent sx={{ maxHeight: "500px", my: 1 }}>{children}</DialogContent>
         <DialogActions sx={{ bgcolor: gpcDark }}>
            <Button variant="text" sx={{ color: gpcLight, fontSize: 16 }} onClick={handleClose}>
               Cerrar
            </Button>
         </DialogActions>
      </Dialog>
   );
};

// DialogComponent.propTypes = {};

export default DialogComponent;
