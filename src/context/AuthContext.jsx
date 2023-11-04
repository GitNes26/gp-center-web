import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import sAlert from "../utils/sAlert";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const Axios = axios;
Axios.defaults.baseURL = import.meta.env.VITE_API;
Axios.defaults.headers.common = {
   Accept: "application/json", //*/*
   "Content-Type": "application/json",
   Authorization: `Bearer ${localStorage.getItem("token") || ""}`
};

export default function AuthContextProvider({ children }) {
   const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")) || null);
   const [permissionRead, setPermissionRead] = useState(false);

   const register = async ({ username, email, password, role }) => {
      try {
         const { data } = await Axios.post(`/signup`, {
            username,
            email,
            password,
            role
         });
         // console.log("el data register:", data);
         if (data.data.status_code == 200) sAlert.Success(data.data.alert_text, 2500);
      } catch (error) {
         console.log(error);
         sAlert.Error("Parece que hay un error 🤔, intenta más tarde");
      }
      return data.data;
   };

   const login = async ({ email, password }) => {
      setAuth(null);
      try {
         const { data } = await Axios.post(`/login`, {
            email,
            password
         });
         // console.log("data", data);

         if (data.data.status_code != 200 && !data.data.result.token) return alert("algo paso");
         localStorage.setItem("token", data.data.result.token);
         localStorage.setItem("auth", JSON.stringify(data.data.result.user));
         // setAuth(data.data.result.auth);
         setAuth(JSON.parse(localStorage.getItem("auth")));
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         return data.data;
      } catch (error) {
         console.log(error);
         sAlert.Error("Parece que hay un error 🤔, intenta más tarde");
      }
   };

   const loggedInCheck = async () => {
      const token = localStorage.getItem("token") || null;
      Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      // Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (token != null && auth != null) {
         const { data } = await Axios.get(`users/${auth.id}`); //es el id
         if (data.data.status_code != 200) setAuth(null);
         else {
            localStorage.setItem("auth", JSON.stringify(data.data.result));
            setAuth(JSON.parse(localStorage.getItem("auth")));
            // setAuth(data.data.result);
         }
      }
   };

   const logout = async () => {
      try {
         const { data } = await Axios.get(`/logout/${auth.id}`);

         localStorage.removeItem("token");
         localStorage.removeItem("auth");
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         setAuth(null);
         location.hash = "/login";
         return data.data;
      } catch (error) {
         console.log(error);
      }
   };

   const validateAccessPage = async () => {
      console.log("validateAccessPage->el auth", auth);
      try {
         if (auth === null) {
            console.log("al login");
            // const navigate = useNavigate();
            // navigate("/login");
            window.location.hash = "/login";
         }
         console.log("auth.read", auth.read);
         // #region VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
         const currentPath = location.hash.split("#").reverse()[0];
         console.log("currentPath", currentPath);
         let permission = false;
         let validatePermissions = false;
         if (auth.read !== "todas") validatePermissions = true;
         if (currentPath === "/admin") validatePermissions = false;

         if (validatePermissions) {
            console.log("a validar", currentPath);
            const dataPost = { url: currentPath };
            const ajaxResponse = await getIdByUrl(dataPost);
            // setPermissionRead(false);
            if (ajaxResponse.result !== null) {
               const pagesRead = auth.read.split(",");
               console.log(ajaxResponse.result.id);
               const idPage = ajaxResponse.result.id.toString();
               console.log("que pasa?");
               console.log(pagesRead);
               // permissionRead = pagesRead.includes(idPage) ? true : false;
               permission = pagesRead.includes(idPage) ? true : false;
               // setPermissionRead(pagesRead.includes(idPage) ? true : false);
            }
         } else {
            console.log("no necesita validacion");
            // permissionRead = true;
            permission = true;
            // setPermissionRead(true);
         }
         console.log("el permission", permission);
         if (permission) setPermissionRead(permission);
         console.log("el permissionRead", permissionRead);
         if (!permission) window.location.hash = "/admin";

         // #endregion VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
      } catch (error) {
         console.log(error);
      }
   };

   // useEffect(() => {
   //    // console.log("el useEffect de AuthContext");
   //    // const asyncCall = async () => await loggedInCheck();
   //    // asyncCall();
   // }, []);

   // console.log("el auth en el context: ", auth);
   // if (auth === null) return;

   return <AuthContext.Provider value={{ register, login, auth, loggedInCheck, logout, permissionRead, validateAccessPage }}>{children}</AuthContext.Provider>;
}
export const useAuthContext = () => useContext(AuthContext);
