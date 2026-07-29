import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import sAlert from "../utils/sAlert";
import { CorrectRes } from "../utils/Response";
import { ROLE_ADMIN_VOUCHER, ROLE_VOUCHER_SUPERVISOR, useGlobalContext } from "./GlobalContext";
import Toast from "../utils/Toast";

export const AuthContext = createContext();

export const Axios = axios;
Axios.defaults.baseURL = import.meta.env.VITE_API;
Axios.defaults.headers.common = {
   Accept: "application/json", //*/*
   "Content-Type": "application/json",
   Authorization: `Bearer ${localStorage.getItem("token") || ""}`
};
Axios.interceptors.request.use(
   (config) => {
      // const token = useAuthStore.getState().token;
      const token = localStorage.getItem("token") || "";
      config.headers = {
         Authorization: `Bearer ${token}`
      };
      // Puedes guardar meta info si quieres usarla luego
      config.meta = { startTime: new Date() };
      return config;
   },
   (error) => {
      console.error("🚀 ~ error:", error);
      if (error.response?.status === 401) {
         console.warn("⚠️ No autenticado, redirigiendo a login o cerrando sesión...");
         localStorage.removeItem("token"); // o dispatch logout, etc.
         // Redireccionar si aplica
         window.location.href = "/login";
      } else if (error.response?.status === 403) {
         console.warn("❌ No tienes permisos suficientes.");
      } else if (error.response?.status >= 500) {
         console.error("💥 Error del servidor.");
      }
      return Promise.reject(error);
   }
);
Axios.interceptors.response.use(
   (response) => {
      // Calcular tiempo de respuesta (si guardaste el meta)
      const end = new Date();
      if (response.config.meta?.startTime) {
         const diff = end - response.config.meta.startTime;
         console.log(`⏱️ ${response.config.url} → ${diff}ms`);
      }

      // Puedes transformar la data si lo deseas
      if (response.data?.result) {
         return response.data.result; // devolver solo lo útil
      }

      return response;
   },
   (error) => {
      const status = error?.response?.status;

      if (status === 401) {
         console.warn("⚠️ Sesión expirada. Cerrando sesión...");
         localStorage.removeItem("token");
         if (window.location.pathname !== "/login") {
            window.location.href = "/login";
         }
      } else if (status === 403) {
         console.warn("🚫 No tienes permisos suficientes.");
      } else if (status >= 500) {
         console.error("💥 Error interno del servidor:", error.response?.data);
      }

      return Promise.reject(error);
   }
);

export const AxiosFiles = axios.create({
   baseURL: import.meta.env.VITE_API,
   responseType: "json",
   withCredentials: true,
   headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data"
   }
});
AxiosFiles.interceptors.request.use(
   (config) => {
      // const token = useAuthStore.getState().token;
      const token = localStorage.getItem("token") || "";

      config.headers = {
         Authorization: `Bearer ${token}`,
         "Content-Type": "multipart/form-data"
      };
      // Puedes guardar meta info si quieres usarla luego
      config.meta = { startTime: new Date() };
      return config;
   },
   (error) => {
      console.error("🚀 ~ error:", error);
      // if (error.response?.status === 401) {
      //    console.warn("⚠️ No autenticado, redirigiendo a login o cerrando sesión...");
      //    localStorage.removeItem("token"); // o dispatch logout, etc.
      //    // Redireccionar si aplica
      //    window.location.href = "/login";
      // } else if (error.response?.status === 403) {
      //    console.warn("❌ No tienes permisos suficientes.");
      // } else if (error.response?.status >= 500) {
      //    console.error("💥 Error del servidor.");
      // }
      // return Promise.reject(error);
   }
);
AxiosFiles.interceptors.response.use(
   (response) => {
      // Calcular tiempo de respuesta (si guardaste el meta)
      // const end = new Date();
      // if (response.config.meta?.startTime) {
      //    const diff = end - response.config.meta.startTime;
      //    console.log(`⏱️ ${response.config.url} → ${diff}ms`);
      // }

      // Puedes transformar la data si lo deseas
      if (response.data?.result) {
         return response.data.result; // devolver solo lo útil
      }

      return response;
   },
   (error) => {
      const status = error?.response?.status;

      if (status === 401) {
         console.warn("⚠️ Sesión expirada. Cerrando sesión...");
         localStorage.removeItem("token");
         if (window.location.pathname !== "#/login") {
            window.location.href = "#/login";
         }
      } else if (status === 403) {
         console.warn("🚫 No tienes permisos suficientes.");
      } else if (status >= 500) {
         console.error("💥 Error interno del servidor:", error.response?.data);
      }

      return Promise.reject(error);
   }
);

export const AxiosDepa = axios.create({
   baseURL: import.meta.env.VITE_API_DEPA,
   responseType: "json",
   headers: { Accept: "application/json", "Content-Type": "application/json" }
});

export const AxiosGPCentral = axios.create({
   baseURL: import.meta.env.VITE_API_GPC,
   responseType: "json",
   headers: { Accept: "application/json", "Content-Type": "application/json" }
});

export const AxiosGPCentralAssets = axios.create({
   baseURL: import.meta.env.VITE_API_GPC_ASSETS,
   responseType: "json",
   headers: { Accept: "application/json", "Content-Type": "application/json" }
});

export let idPage = 0;
const AuthinitialStatate = {
   id: null,
   username: "",
   email: "",
   email_verified_at: null,
   role_id: null,
   active: null,
   created_at: "",
   updated_at: null,
   deleted_at: null,
   role: "",
   read: false,
   create: false,
   update: false,
   delete: false,
   more_permissions: [],
   permissions: {
      read: false,
      create: false,
      update: false,
      delete: false,
      more_permissions: []
   }
};

export default function AuthContextProvider({ children }) {
   const { counters, setCounters, resetCounters } = useGlobalContext();
   const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")) || AuthinitialStatate);
   const [permissionRead, setPermissionRead] = useState(false);
   // const [idPage, setIdPage] = useState(0);

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
         return data.data;
      } catch (error) {
         console.log(error);
         sAlert.Error("Parece que hay un error 🤔, intenta más tarde");
         return error;
      }
   };

   const login = async ({ email, password }) => {
      setAuth(null);
      try {
         let postData = {
            email,
            password
         };
         if (!email.includes("@"))
            postData = {
               username: email,
               password
            };
         // return console.log(postData);
         const { data } = await Axios.post(`/login`, postData);
         // console.log("data", data);

         if (data.data.result.token === null) sAlert.Customizable(data.data.alert_text, data.data.alert_icon, true, false);
         localStorage.setItem("token", data.data.result.token);
         if (data.data.result.user != null)
            data.data.result.user.permissions = {
               read: false,
               create: false,
               update: false,
               delete: false,
               more_permissions: []
            };
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

   const logout = async (status = null) => {
      try {
         if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("auth");
            const token = localStorage.getItem("token") || null;
            Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            setAuth(null);
            location.hash = "/login";
            return;
         }
         const { data } = await Axios.get(`/logout`);

         localStorage.removeItem("token");
         localStorage.removeItem("auth");
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         setAuth(null);
         location.hash = "/login";
         return data.data;
      } catch (error) {
         console.log(error);
         localStorage.removeItem("token");
         localStorage.removeItem("auth");
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         setAuth(null);
         location.hash = "/login";
      }
   };

   const counterOfMenus = async () => {
      let res = CorrectRes;
      try {
         await resetCounters();
         // console.log("counterofMenus");
         // const axiosData = await Axios.get(`counters/counterOfMenus`);
         // res = await axiosData.data.data;
         const filterCounters = { ...counters };
         const newCounters = { ...counters };

         if (auth.id === null) {
            setCounters(newCounters);
            return;
         }

         newCounters.vouchers = 0;
         const vouchersData = await Axios.get(`/vouchers`);
         res.result.vouchers = vouchersData.data.data.result;
         const servicesData = await Axios.get(`/services`);
         res.result.services = servicesData.data.data.result;
         // console.log("vouchersData", res.result);
         // console.log("servicesData", res.result);
         // console.log("vouchersData", res.result.length);

         //#region SECCION DE VOUCHERS
         filterCounters.vouchers = await res.result.vouchers.filter((data) => ["CREADO", "ALTA", "VoBo", "APROBADA", "CANCELADA"].includes(data.voucher_status));
         newCounters.vouchers = filterCounters.vouchers.length;

         filterCounters.vouchersCreated = await res.result.vouchers.filter((data) => ["CREADO", "ALTA"].includes(data.voucher_status));
         newCounters.vouchersCreated = filterCounters.vouchersCreated.length;

         filterCounters.vouchersVoBo = await res.result.vouchers.filter((data) => ["VoBo"].includes(data.voucher_status));
         newCounters.vouchersVoBo = filterCounters.vouchersVoBo.length;

         filterCounters.vouchersApproved = await res.result.vouchers.filter((data) => ["APROBADA"].includes(data.voucher_status));
         newCounters.vouchersApproved = filterCounters.vouchersApproved.length;

         filterCounters.vouchersCanceled = await res.result.vouchers.filter((data) => ["CANCELADA"].includes(data.voucher_status));
         newCounters.vouchersCanceled = filterCounters.vouchersCanceled.length;
         //#endregion SECCION DE VOUCHERS

         //#region SECCION DE SERVICIOS
         filterCounters.services = await res.result.services;
         newCounters.services = filterCounters.services.length;

         filterCounters.servicesOpened = await res.result.services.filter((data) => ["ABIERTA"].includes(data.status));
         newCounters.servicesOpened = filterCounters.servicesOpened.length;

         filterCounters.servicesApproved = await res.result.services.filter((data) => ["APROBADA"].includes(data.status));
         newCounters.servicesApproved = filterCounters.servicesApproved.length;

         filterCounters.servicesInReviewed = await res.result.services.filter((data) => ["EN REVISIÓN"].includes(data.status));
         newCounters.servicesInReviewed = filterCounters.servicesInReviewed.length;

         filterCounters.servicesRejected = await res.result.services.filter((data) => ["RECHAZADA"].includes(data.status));
         newCounters.servicesRejected = filterCounters.servicesRejected.length;

         filterCounters.servicesClosed = await res.result.services.filter((data) => ["CERRADA"].includes(data.status));
         newCounters.servicesClosed = filterCounters.servicesClosed.length;
         //#endregion SECCION DE SERVICIOS

         // console.log("newCounters", newCounters);
         setCounters(newCounters);
         // console.log(counters);
         // return res;
      } catch (error) {
         console.log(error);
         // res.message = error;
         // res.alert_text = error;
         // Toast.Error(error);
      }
   };

   const validateAccessPage = async (updateAuth = false) => {
      // console.log("validateAccessPage->el auth", auth);
      try {
         console.log("auth.antes", auth);
         if (auth === null || auth.id === null) {
            // console.log("al login");
            window.location.hash = "/login";
            return;
         }
         if (updateAuth) await updatePermissionsAuth(auth.id);

         // console.log("auth.despues", auth);
         // #region VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
         const currentPath = location.hash.split("#").reverse()[0];
         const dataPost = { url: currentPath };
         let menu = null;
         const { data } = await Axios.post(`/menus/getIdByUrl`, dataPost);
         menu = data.data.result;
         let pagesRead;
         let idPage;
         if (menu !== null) {
            if (auth.read === undefined) return logout(401);
            idPage = menu;
            pagesRead = auth.read.split(",");
            // console.log(menu.id);
            idPage = menu.id.toString();
            // console.log(pagesRead);
         }

         // console.log("currentPath", currentPath);
         let permission = false; // tengo permiso para estar en esta pagina?
         let validatePermissions = false; // voy a validar el permiso??? es decir, si estoy auth y no tengo en "read"=todas
         const permissions = {
            read: false,
            create: false,
            update: false,
            delete: false,
            more_permissions: []
         };
         // console.log("QUE TRA DE PERMISOS EL AUTH - 1", auth);
         if (auth.read !== "todas") validatePermissions = true;
         if (currentPath === "/admin") validatePermissions = false;

         if (menu) {
            permissions.read = auth.read === "todas" ? true : auth.read.split(",").includes(idPage) ? true : false;
            permissions.create = auth.create === "todas" ? true : auth.create === null ? false : auth.create.split(",").includes(idPage) ? true : false;
            permissions.update = auth.update === "todas" ? true : auth.update === null ? false : auth.update.split(",").includes(idPage) ? true : false;
            permissions.delete = auth.delete === "todas" ? true : auth.delete === null ? false : auth.delete.split(",").includes(idPage) ? true : false;
            permissions.more_permissions = auth.more_permissions === "todas" ? ["todas"] : auth.more_permissions === null ? [] : auth.more_permissions.split(",");

            // PASAR PERMISOS AL AUTH
            auth.permissions = permissions;
         }

         // console.log("QUE TRA DE PERMISOS EL AUTH - 2", auth);

         // console.log("auth Antes", auth);
         // if (location.hash.split("/").length <= 3) {
         //    console.log("conservar los mismos valores del auth");
         //    setAuth(JSON.parse(localStorage.getItem("auth")));
         //    console.log("auth Despues", auth);
         // }

         if (validatePermissions) {
            // console.log("validatePermissions?", menu);
            // console.log("data/getIdByUrl", data);
            if (menu !== null) {
               if (auth.read === undefined) return logout(401);
               permission = pagesRead.includes(idPage) ? true : false;
            } else {
               if (location.hash.split("/").length >= 3) permission = true;
            }
         } else {
            // console.log("no necesita validacion");
            permission = true;
         }
         // console.log("el permission", permission);
         if (permission) setPermissionRead(permission);
         localStorage.setItem("auth", JSON.stringify(auth));
         // console.log("el permissionRead", permissionRead);
         // console.log(location.hash.split("/"));
         if (!permission) {
            console.log("sigue entrando");
            if (location.hash.split("/").length <= 3) {
               // console.log("y tengo menos de 3 slash");
               window.location.hash = auth.page_index;
            }
         }
         // console.log("como quedo el permission?", permission);
         // console.log("auth al final", auth);

         // #endregion VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
      } catch (error) {
         console.log(error);
         if (error.response.status === 401) logout(error.response.status);
      }
   };

   const changePasswordAuth = async ({ password, new_password }) => {
      try {
         const postData = {
            password,
            new_password
         };
         // console.log(postData);
         const { data } = await Axios.post(`/users/changePasswordAuth`, postData);
         // console.log("el data register:", data);
         if (data.data.status_code == 200 && data.data.alert_icon == "success") sAlert.Success(data.data.alert_text, null);
         return data.data;
      } catch (error) {
         console.log(error);
         sAlert.Error("Parece que hay un error, intenta más tarde");
         return error;
      }
   };

   const updatePermissionsAuth = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/users/${id}`);
         res = axiosData.data.data;
         res.result.permissions = {
            read: auth.permissions.read,
            create: auth.permissions.create,
            update: auth.permissions.update,
            delete: auth.permissions.delete,
            more_permissions: auth.permissions.more_permissions ?? []
         };
         // console.log(res);
         localStorage.setItem("auth", JSON.stringify(res.result));
         // setAuth(data.data.result.auth);
         setAuth(JSON.parse(localStorage.getItem("auth")));

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
         return res;
      }
   };

   useEffect(() => {
      // validateAccessPage();
      counterOfMenus();
   }, []);

   // console.log("el auth en el context: ", auth);
   // if (auth === null) return;

   return (
      <AuthContext.Provider value={{ register, login, auth, loggedInCheck, logout, permissionRead, validateAccessPage, changePasswordAuth, counterOfMenus }}>
         {children}
      </AuthContext.Provider>
   );
}
export const useAuthContext = () => useContext(AuthContext);
