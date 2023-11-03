import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const MenuContext = createContext();

const formDataInitialState = {
   id: 0,
   menu: "",
   caption: "",
   type: "",
   belongs_to: 0,
   url: "",
   icon: "",
   order: 0,
   show_counter: false
};

export default function MenuContextProvider({ children }) {
   const singularName = "Menú"; //Escribirlo siempre letra Capital
   const pluralName = "Menús"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [menus, setMenus] = useState([]);
   const [menu, setMenu] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };

   const getIdByUrl = async (dataPost) => {
      try {
         // setMenu([]);
         let res = CorrectRes;
         const axiosData = await Axios.post(`/menus/getIdByUrl`, dataPost);
         res = axiosData.data.data;
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const MenusByRole = async (role_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/menus/MenusByRole/${role_id}`);
         res = axiosData.data.data;
         // await setMenu(res.result);
         setMenu(res.result);
         // fillFormData(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   // #region CRUD

   const getMenus = async () => {
      try {
         // setMenu([]);
         const res = CorrectRes;
         const axiosData = await Axios.get(`/menus`);
         res.result.menus = axiosData.data.data.result;
         // console.log(res.result);
         setMenus(axiosData.data.data.result);
         // console.log("menus", menus);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showMenu = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/menus/${id}`);
         res = axiosData.data.data;
         // await setMenu(res.result);
         setFormData(res.result);
         setMenu(res.result);
         // fillFormData(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showMenuBy = async (searchBy, value) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/menus/${searchBy}/${value}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         // await setMenu(res.result);
         // setFormData(res.result);
         setMenu(res.result);
         // fillFormData(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createMenu = async (menu) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/menus", menu);
         res = axiosData.data.data;
         getMenus();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateMenu = async (menu) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(`/menus/update/${menu.id}`, menu);
         res = axiosData.data.data;
         getMenus();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteMenu = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/menus/destroy/${id}`);
         // console.log("deleteMenu() axiosData", axiosData.data);
         getMenus();
         res = axiosData.data.data;
         // console.log("res", res);
         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };
   // #endregion CRUD

   // useEffect(() => {
   //    console.log("el useEffect de MenuContext");
   //    getMenus();
   // });

   return (
      <MenuContext.Provider
         value={{
            singularName,
            pluralName,
            menus,
            menu,
            formData,
            setFormData,
            resetFormData,
            getMenus,
            showMenu,
            MenusByRole,
            getIdByUrl,
            createMenu,
            updateMenu,
            deleteMenu,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </MenuContext.Provider>
   );
}
export const useMenuContext = () => useContext(MenuContext);
