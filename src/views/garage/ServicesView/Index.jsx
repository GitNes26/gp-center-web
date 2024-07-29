import ServiceForm from "./Form";
import ServiceDT from "./DataTable";

import { useEffect } from "react";
import { useServiceContext } from "../../../context/ServiceContext";
import { Typography } from "@mui/material";
import Toast from "../../../utils/Toast";
import { gpcDark, useGlobalContext } from "../../../context/GlobalContext";

const ServicesView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, school, getServices } = useServiceContext();

   useEffect(() => {
      try {
         setLoading(true);
         getServices();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [school]);

   return (
      <>
         {/* <Alert severity="success" sx={{ mb: 1 }} >
            <AlertTitle>Titulo</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={gpcDark} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         <ServiceDT />
         {/* </MainCard> */}

         <ServiceForm />
      </>
   );
};

// export const loaderIndexServicesView = async () => {
//    try {
//       const res = CorrectRes;
//       const axiosLevels = await Axios.get("/levels/selectIndex");
//       res.result.levels = axiosLevels.data.data.result;
//       res.result.levels.unshift({ id: 0, label: "Selecciona una opción..." });
//       // // console.log(res);

//       return res;
//    } catch (error) {
//       const res = ErrorRes;
//       console.log(error);
//       res.message = error;
//       res.alert_text = error;
//       sAlert.Error(error);
//       return res;
//    }
// };

export default ServicesView;
