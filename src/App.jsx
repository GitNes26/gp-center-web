import { Button, CircularProgress, Container, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";

// defaultTheme
import themes from "./themes";
import { useSelector } from "react-redux";
import { Backdrop } from "@mui/material";
import { useGlobalContext } from "./context/GlobalContext";

const App = () => {
   const customization = useSelector((state) => state.customization);
   const { loading, loadingAction } = useGlobalContext();

   return (
      <ThemeProvider theme={themes(customization)}>
         <CssBaseline />
         {/* <NavigationSroll> */}
         <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <Typography variant="h1" sx={{ color: "#fff" }}>
               CARGANDO... <CircularProgress color="inherit" />
            </Typography>
         </Backdrop>
         <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingAction}>
            <Typography variant="h1" sx={{ color: "#fff" }}>
               CARGANDO... <CircularProgress color="inherit" />
            </Typography>
         </Backdrop>

         <RouterProvider router={router} />
         {/* </NavigationSroll> */}
      </ThemeProvider>
   );
};

export default App;
