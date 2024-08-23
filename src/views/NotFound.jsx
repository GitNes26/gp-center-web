import { Button, Container, Typography } from "@mui/material";
import Icon404 from "../components/icons/Icon404";
import { Link, useRouteError } from "react-router-dom";
import { HomeTwoTone } from "@mui/icons-material";
import { useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Box } from "@mui/system";
import ImgNotFound from "../assets/images/404.jpg";

const NotFound = () => {
   const { setLoading, setLoadingAction } = useGlobalContext();

   const error = useRouteError();
   console.log(error);
   // alert(error);
   let errorText = "",
      errorDetail = "",
      errorStack = "",
      srcImg = ImgNotFound;
   if (error) {
      errorDetail = error.data;
      errorStack = error.statusText;
      if (error.error) {
         errorDetail = error.error.message;
         errorStack = error.error.stack;
      }
   }

   useEffect(() => {
      setLoading(false);
   }, []);

   switch (error.status) {
      case 404:
         errorText = "¡La página que está buscando fue movida, eliminada, renombrada o podría no existir nunca!";
         srcImg = ImgNotFound;
         break;
      case 403:
         break;

      default:
         errorText = "¡La página que está buscando fue movida, eliminada, renombrada o podría no existir nunca!";
         srcImg = ImgNotFound;
         break;
   }

   return (
      <Box sx={{ textAlign: "center", height: "100vh", width: "100%", backgroundImage: `url(${srcImg})`, backgroundPosition: "center", backgroundSize: "cover" }}>
         {/* <img src={srcImg} width={"50%"} /> */}
         {/* <Typography variant="h1" mt={3} sx={{ fontWeight: "900" }} textTransform={"uppercase"}>
            Algo está mal
         </Typography>
         <Typography variant="body1" sx={{ width: "35%", textAlign: "center", mx: "auto", my: 3 }}>
            {errorText}
         </Typography> */}
         {/* <Typography variant="h6" sx={{ width: "75%", textAlign: "center", mx: "auto", mb: 3 }}>
            {errorDetail} <br />
            {errorStack}
         </Typography> */}
         <Button variant="contained" fullWidth size="large" sx={{ fontWeight: "bolder" }} component={Link} to="/" startIcon={<HomeTwoTone />}>
            REGRESAR AL INICIO
         </Button>
      </Box>
   );
};
export default NotFound;
