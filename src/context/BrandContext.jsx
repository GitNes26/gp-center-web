import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const BrandContext = createContext();

const formDataInitialState = {
   id: 0,
   brand: "",
   description: ""
};

export default function BrandContextProvider({ children }) {
   const singularName = "Marca"; //Escribirlo siempre letra Capital
   const pluralName = "Marcas"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [brands, setBrands] = useState([]);
   const [brand, setBrand] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   const fillFormData = (values) => {
      try {
         const newData = { ...formData };
         newData.id = values.id;
         newData.brand = values.brand;
         newData.description = values.description;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   const getBrands = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/brands`);
         res.result.brands = axiosData.data.data.result;
         setBrands(axiosData.data.data.result);
         // console.log("brands", brands);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showBrand = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/brands/${id}`);
         res = axiosData.data.data;
         // await setBrand(res.result);
         // setFormData(res.result);
         fillFormData(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createBrand = async (brand) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/brands", brand);
         res = axiosData.data.data;
         getBrands();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateBrand = async (brand) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/brands", brand);
         res = axiosData.data.data;
         getBrands();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteBrand = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/brands/${id}`);
         // console.log("deleteBrand() axiosData", axiosData.data);
         getBrands();
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

   // useEffect(() => {
   //    console.log("el useEffect de BrandContext");
   //    getBrands();
   // });

   return (
      <BrandContext.Provider
         value={{
            singularName,
            pluralName,
            brands,
            brand,
            formData,
            setFormData,
            resetFormData,
            getBrands,
            showBrand,
            createBrand,
            updateBrand,
            deleteBrand,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </BrandContext.Provider>
   );
}
export const useBrandContext = () => useContext(BrandContext);
