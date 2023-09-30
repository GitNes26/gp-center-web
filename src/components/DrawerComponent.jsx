import { Typography } from "@mui/material";
import { SwipeableDrawer } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../utils/Toast";
import { useGlobalContext } from "../context/GlobalContext";
import Paper from "@mui/material/Paper";

// ===========================================================================================
// ========================================== COMPONENTE =====================================
// ===========================================================================================

const DrawerComponent = ({ title, openDialog, setOpenDialog, anchor, content, bgColor }) => {
   const { setLoadingAction } = useGlobalContext();

   const toggleDrawer = (open) => (event) => {
      try {
         if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
         }
         setOpenDialog(open);
      } catch (error) {
         console.log("Error en toggleDrawer:", error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      try {
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, []);

   return (
      <SwipeableDrawer anchor={anchor || "right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
         <Box role="presentation" p={3} pt={5} className="drawer-max-width" sx={{ bgcolor: bgColor ? bgColor : "#E9ECEF" }}>
            <Typography variant="h2" mb={3}>
               {title}
            </Typography>
            <Paper sx={{ width: "100%", overflow: "hidden", bgcolor: bgColor ? bgColor : "whitesmoke" }}>{content}</Paper>
         </Box>
      </SwipeableDrawer>
   );
};
export default DrawerComponent;
