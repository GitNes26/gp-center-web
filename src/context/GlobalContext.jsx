import { useSnackbar } from "notistack";
import { createContext, forwardRef, useContext, useEffect, useState } from "react";
import Toast from "../utils/Toast";
import axios from "axios";
import { Slide } from "@mui/material";
import { CorrectRes, ErrorRes } from "../utils/Response";

//mis colores
export const gpcLight = "#E9ECEF";
export const gpcDark = "#1E2126";
export const gpcDark100 = "#566173";
export const gpcDarkContrast = "#E9ECEF";
export const gpcBlue = "#1455CB";
export const gpcText = "#1455CB";
export const colorPrimaryMain = "#1455CB";
export const colorPrimaryDark = "#0c3f8b";
export const colorSecondaryMain = "#2E353B";
export const colorSecondaryDark = "#191d20";
export const colorSecondaryLight = "#E9ECEF";

export const ROLE_SUPER_ADMIN = 1;
export const ROLE_ADMIN = 2;
export const ROLE_ALMACEN = 3;
export const ROLE_MECHANIC = 4;
export const ROLE_DIRECTOR = 5;
export const ROLE_DRIVER = 6;
export const ROLE_ADMIN_VOUCHER = 7;
export const ROLE_VOUCHER_REQUESTER = 8;
export const ROLE_VOUCHER_SUPERVISOR = 9;

export const GlobalContext = createContext();

export const TransitionSlide = (direction = "up") =>
   forwardRef(function Transition(props, ref) {
      return <Slide direction={direction} ref={ref} {...props} />;
   });

const initialStateCounters = {
   vouchers: 0,
   vouchersCreated: 0,
   vouchersVoBo: 0,
   vouchersApproved: 0,
   vouchersCanceled: 0,
   services: 0,
   servicesOpened: 0,
   servicesApproved: 0,
   servicesInReviewed: 0,
   servicesClosed: 0
};

export const GlobalContextProvider = ({ children }) => {
   // const [loadLogo, setLoadLogo] = useState(true);
   const [load, setLoad] = useState(true);
   const [loadAction, setLoadAction] = useState(false);
   // const [loading, setLoading] = useState(true);
   // const [loadingAction, setLoadingAction] = useState(false);
   const [cursorLoading, setCursorLoading] = useState(false);
   const [openDialog, setOpenDialog] = useState(false);
   const [openCardInfo, setOpenCardInfo] = useState(false);
   const [bgImage, setBgImage] = useState("none");
   const [counters, setCounters] = useState(initialStateCounters);
   const [employees, setEmployees] = useState([]);

   const toggleDrawer =
      (open, setOpenSwiper = null) =>
      (event) => {
         try {
            if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
               return;
            }
            setOpenSwiper ? setOpenSwiper(open) : setOpenDialog(open);
         } catch (error) {
            console.log("Error en toggleDrawer:", error);
            Toast.Error(error);
         }
      };

   const setLoading = (show) => {
      if (show) {
         setLoad(true);
         // setLoadLogo(true);
      } else {
         setTimeout(() => {
            // setLoadLogo(false);
            // setTimeout(() => {
            setLoad(false);
            // }, 1500);
         }, 500);
      }
   };

   const setLoadingAction = (show) => {
      if (show) {
         setLoadAction(true);
         // setLoadLogo(true);
      } else {
         setTimeout(() => {
            // setLoadLogo(false);
            // setTimeout(() => {
            setLoadAction(false);
            // }, 1500);
         }, 500);
      }
   };

   const [formTitle, setFormTitle] = useState("REGISTRAR OBJETO | EDITAR OBJETO");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR | GUARDAR");

   // #region INPUTS-COMMUNITY-COMPONENT
   const [disabledState, setDisabledState] = useState(true);
   const [disabledCity, setDisabledCity] = useState(true);
   const [disabledColony, setDisabledColony] = useState(true);
   const [showLoading, setShowLoading] = useState(false);
   const [dataStates, setDataStates] = useState([]);
   const [dataCities, setDataCities] = useState([]);
   const [dataColonies, setDataColonies] = useState([]);
   const [dataColoniesComplete, setDataColoniesComplete] = useState([]);
   //#endregion INPUTS-COMMUNITY-COMPONENT

   const resetCounters = () => {
      setCounters(initialStateCounters);
   };

   const getEmployees = async () => {
      let res = CorrectRes;
      try {
         const axiosData = await axios.get(import.meta.env.VITE_API_RH_EMPLEADOS);
         console.log("🚀 ~ changeStatus ~ axiosData:", axiosData);
         res = axiosData.data.RESPONSE;

         const data = res.recordset;
         const dataSelectIndex = [];
         data.map((item) => {
            const obj = { id: 0, label: "" };
            obj.id = `${item.codigoEmpleado} - ${item.nombreE} ${item.apellidoP} ${item.apellidoM}`;
            obj.label = `${item.codigoEmpleado} - ${item.nombreE} ${item.apellidoP} ${item.apellidoM}`;
            dataSelectIndex.push(obj);
         });
         // console.log("🚀 ~ getEmployees ~ data:", data);
         // console.log("🚀 ~ getEmployees ~ dataSelectIndex:", dataSelectIndex);
         setEmployees(dataSelectIndex);

         return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   return (
      <GlobalContext.Provider
         value={{
            load,
            setLoad,
            loadAction,
            setLoadAction,
            // loading,
            setLoading,
            // loadingAction,
            openCardInfo,
            setOpenCardInfo,
            setLoadingAction,
            cursorLoading,
            setCursorLoading,
            openDialog,
            setOpenDialog,
            toggleDrawer,
            formTitle,
            setFormTitle,
            textBtnSubmit,
            setTextBtnSumbit,
            bgImage,
            setBgImage,
            disabledState,
            setDisabledState,
            disabledCity,
            setDisabledCity,
            disabledColony,
            setDisabledColony,
            showLoading,
            setShowLoading,
            dataStates,
            setDataStates,
            dataCities,
            setDataCities,
            dataColonies,
            setDataColonies,
            dataColoniesComplete,
            setDataColoniesComplete,
            counters,
            setCounters,
            resetCounters,
            getEmployees,
            employees,
            setEmployees
         }}
      >
         {children}
      </GlobalContext.Provider>
   );
};
export const useGlobalContext = () => useContext(GlobalContext);
