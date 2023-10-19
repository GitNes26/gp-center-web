import { Button, CircularProgress, Container, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";

// defaultTheme
import themes from "./themes";
import { useSelector } from "react-redux";
import { Backdrop } from "@mui/material";
import { useGlobalContext } from "./context/GlobalContext";
// import imgLoading from "./assets/images/logo-white.png";
import imgLoading from "./assets/images/logo.png";
import { height } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
   const customization = useSelector((state) => state.customization);
   const { loading, loadingAction } = useGlobalContext();

   return (
      <ThemeProvider theme={themes(customization)}>
         <CssBaseline />
         {/* <NavigationSroll> */}
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000000, backgroundColor: "#000000c0" }} open={loading}>
               <img className="loader" src={imgLoading} style={{ height: "20vh" }} />
               {/* <Typography variant="h1" sx={{ color: "#fff" }}>
               CARGANDO... <CircularProgress color="inherit" />
            </Typography> */}
            </Backdrop>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000000, backgroundColor: "#000000c0" }} open={loadingAction}>
               <img className="loader" src={imgLoading} style={{ height: "20vh" }} />

               {/* <Typography variant="h1" sx={{ color: "#fff" }}>
               CARGANDO... <CircularProgress color="inherit" />
            </Typography> */}
            </Backdrop>
            <RouterProvider router={router} />
         </LocalizationProvider>

         {/* </NavigationSroll> */}
      </ThemeProvider>
   );
};

export default App;
