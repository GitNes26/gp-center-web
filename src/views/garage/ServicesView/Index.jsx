import ServiceForm from "./Form";
import ServiceDT from "./DataTable";

import { useEffect, useState } from "react";
import { useServiceContext } from "../../../context/ServiceContext";
import { Typography } from "@mui/material";
import Toast from "../../../utils/Toast";
import { gpcDark, ROLE_DIRECTOR, useGlobalContext } from "../../../context/GlobalContext";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import ModalService from "../../cove/ShowVehicleView/ModalService";
import RequestServiceCardInfo from "./RequestServiceCardInfo";
// import ModalService from "./ModalService";

const ServicesView = () => {
   const { status } = useParams();
   const { auth } = useAuthContext();
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, service, getServices, textBtnSubmit, setTextBtnSumbit } = useServiceContext();

   const [openService, setOpenService] = useState(false);
   const [showActionButtons, setShowActionButtons] = useState(true);

   useEffect(() => {
      try {
         setLoading(true);
         getServices(status);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [status]);

   return (
      <>
         {/* <Alert severity="success" sx={{ mb: 1 }} >
            <AlertTitle>Titulo</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={gpcDark} mb={2} textAlign={"center"}>
            {auth.role_id === ROLE_DIRECTOR ? "MIS SOLICITUDES".toUpperCase() : "LISTADO DE SOLICITUDES DE SERVICIO".toUpperCase()} <br />
            {status != null && (
               <Typography>
                  <b>STATUS: </b>
                  {status == "abiertas"
                     ? "ABIERTA"
                     : status == "aprobadas"
                       ? "APROBADA"
                       : status == "rechazadas"
                         ? "RECHAZADA"
                         : status == "en-revision"
                           ? "EN REVISIÓN"
                           : status == "cerradas"
                             ? "CERRADA"
                             : ""}
               </Typography>
            )}
         </Typography>
         <ServiceDT openService={openService} setOpenService={setOpenService} setShowActionButtons={setShowActionButtons} />
         {/* </MainCard> */}

         {/* <ServiceForm /> */}
         {openService && (
            <ModalService
               open={openService}
               setOpen={setOpenService}
               modalTitle={`SOLICITUD DE SERVICIO #${service.folio}`}
               obj={service}
               showActionButtons={showActionButtons}
            />
         )}

         <RequestServiceCardInfo />
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
