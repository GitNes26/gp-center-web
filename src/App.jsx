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
   const { load, loadAction } = useGlobalContext();

   // <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100000 }} open={load}>
   //          <div className={`container-loader ${loadLogo ? "entrada" : "salida"}`} style={{ zIndex: (theme) => theme.zIndex.drawer + 100000 }}>
   //             <Box className="box-logo">
   //                <img src={logo} alt="LogoGPD" width={"300vw"} />
   //                <Typography variant="h1" sx={{ color: "#fff" }}>
   //                   CARGANDO... <CircularProgress color="inherit" />
   //                </Typography>
   //             </Box>
   //          </div>
   //       </Backdrop>
   //       <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100000 }} open={loadAction}>
   //          <div className="container-blur" style={{ zIndex: (theme) => theme.zIndex.drawer + 100000 }}>HOLA
   //          </div>
   //          <div className={`container-loader-action ${loadLogo ? "entrada" : "salida"}`} style={{ zIndex: (theme) => theme.zIndex.drawer + 100000 }}>
   //             <Box className="box-logo">
   //                <img src={logo} alt="LogoGPD" width={"300vw"} />
   //                <Typography variant="h1" sx={{ color: "#fff" }}>
   //                   CARGANDO... <CircularProgress color="inherit" />
   //                </Typography>
   //             </Box>
   //          </div>
   //       </Backdrop>

   return (
      <ThemeProvider theme={themes(customization)}>
         <CssBaseline />
         {/* <NavigationSroll> */}
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000000, backgroundColor: "#000000c0" }} open={load}>
               <img className="loader" src={imgLoading} style={{ height: "20vh" }} />
               {/* <Typography variant="h1" sx={{ color: "#fff" }}>
               CARGANDO... <CircularProgress color="inherit" />
            </Typography> */}
            </Backdrop>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000000, backgroundColor: "#000000c0" }} open={loadAction}>
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
