import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import sAlert from "../utils/sAlert";

export const UserContext = createContext();

export const Axios = axios;
// Axios.defaults.baseURL = import.meta.env.VITE_API;
Axios.defaults.baseURL = "http://127.0.0.1:8000/api/becas";
Axios.defaults.headers.common = {
   Accept: "application/json", //*/*
   "Content-Type": "application/json",
   Authorization: "Bearer "
};

export default function UserContextProvider({ children }) {
   // const [user, setUser] = useState(null);
   const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

   const register = async ({ username, email, password, role }) => {
      try {
         const { data } = await Axios.post(`/signup`, {
            username,
            email,
            password,
            role
         });
         // console.log("el data register:", data);
         if (data.data.status_code == 200) sAlert.Success(data.data.alert_text, 2500)
      } catch (error) {
         console.log(error);
         sAlert.Error("Parece que hay un error 🤔, intenta más tarde")
      }
   };

   const login = async ({ email, password }) => {
      setUser(null);
      try {
         const { data } = await Axios.post(`/login`, {
            email,
            password
         });

         if (data.data.status_code != 200 && !data.data.result.token) return alert("algo paso");
         localStorage.setItem("token", data.data.result.token);
         localStorage.setItem("user", JSON.stringify(data.data.result.user));
         setUser(JSON.parse(localStorage.getItem("user")));
         // setUser(data.data.result.user);
         return data.data;
      } catch (error) {
         console.log(error);
         sAlert.Error("Parece que hay un error 🤔, intenta más tarde")
      }
   };

   const loggedInCheck = async () => {
      const token = localStorage.getItem("token") || null;
      Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      // Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (token != null && user != null) {
         const { data } = await Axios.get(`users/${user.id}`); //es el id
         if (data.data.status_code != 200) setUser(null);
         else {
            localStorage.setItem("user", JSON.stringify(data.data.result));
            setUser(JSON.parse(localStorage.getItem("user")));
            // setUser(data.data.result);
         }
      }
   };

   useEffect(() => {
      // console.log("el useEffect de UserContext");
      const asyncCall = async () => await loggedInCheck();
      asyncCall();
   }, []);

   const logout = async () => {
      try {
         const { data } = await Axios.delete(`/logout/${user.id}`);

         localStorage.removeItem("token");
         localStorage.removeItem("user");
         setUser(null);
         return data.data;
      } catch (error) {
         console.log(error);
      }
   };

   // console.log("el user en el context: ", user);
   // if (user === null) return;

   // return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
   return <UserContext.Provider value={{ register, login, user, loggedInCheck, logout }}>{children}</UserContext.Provider>;
}
export const useUserContext = () => useContext(UserContext);

// export default UserContextProvider;
