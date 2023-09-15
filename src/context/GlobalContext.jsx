import { useSnackbar } from "notistack";
import { createContext, useContext, useEffect, useState } from "react";
export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
   // #region Toast opcion2
   // const { enqueueSnackbar } = useSnackbar();
   // // const Success = (msg) => {
   // //    enqueueSnackbar(msg, { variant: "success", autoHideDuration: 2500, anchorOrigin: { horizontal: "right", vertical: "bottom" } });
   // // };
   // // const Error = (msg) => {
   // //    enqueueSnackbar(msg, { variant: "error", autoHideDuration: 2500, anchorOrigin: { horizontal: "right", vertical: "bottom" } });
   // // };
   // // const Info = (msg) => {
   // //    enqueueSnackbar(msg, { variant: "info", autoHideDuration: 2500, anchorOrigin: { horizontal: "right", vertical: "bottom" } });
   // // };
   // // const Warning = (msg) => {
   // //    enqueueSnackbar(msg, { variant: "warning", autoHideDuration: 2500, anchorOrigin: { horizontal: "right", vertical: "bottom" } });
   // // };
   // // const Default = (msg) => {
   // //    enqueueSnackbar(msg, { variant: "default", autoHideDuration: 2500, anchorOrigin: { horizontal: "right", vertical: "bottom" } });
   // // };
   // // const ToastG = {
   // //    Success,
   // //    Error,
   // //    Info,
   // //    Warning,
   // //    Default
   // // };
   // #endregion

   const [loading, setLoading] = useState(true);
   const [loadingAction, setLoadingAction] = useState(false);

   const [formTitle, setFormTitle] = useState("REGISTRAR OBJETO | EDITAR OBJETO");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR | GUARDAR");

   return (
      <GlobalContext.Provider value={{ loading, setLoading, loadingAction, setLoadingAction, formTitle, setFormTitle, textBtnSubmit, setTextBtnSumbit }}>
         {children}
      </GlobalContext.Provider>
   );
};
export const useGlobalContext = () => useContext(GlobalContext);
