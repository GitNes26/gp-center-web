import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Field } from "formik";
import Toast from "../../utils/Toast";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { handleInputFormik } from "../../utils/Formats";
import { useState } from "react";
import axios from "axios";
// import { useGetCommunityByZip } from "../../hooks/useGetCommunity";

export const getCommunityByZip = async (
   zip,
   setFieldValue,
   community_id = null,
   setDisabledState,
   setDisabledCity,
   setDisabledColony,
   setShowLoading,
   setDataStates,
   setDataCities,
   setDataColonies
) => {
   // const [disabledState, setDisabledState] = useState(true);
   // const [disabledCity, setDisabledCity] = useState(true);
   // const [disabledColony, setDisabledColony] = useState(true);
   // const [showLoading, setShowLoading ] = useState(false);
   // const [dataStates, setDataStates] = useState([]);
   // const [dataCities, setDataCities] = useState([]);
   // const [dataColonies, setDataColonies] = useState([]);

   try {
      setShowLoading(true);
      setDisabledState(true);
      setDisabledCity(true);
      setDisabledColony(true);
      let states = [];
      let cities = [];
      let colonies = [];
      setDataStates(states);
      setDataCities(cities);
      setDataColonies(colonies);
      setFieldValue("state", 0);
      setFieldValue("city", 0);
      setFieldValue("colony", 0);
      if (community_id) {
         const axiosMyCommunity = axios;
         const { data } = await axiosMyCommunity.get(`https://api.gomezpalacio.gob.mx/api/cp/colonia/${community_id}`);

         if (data.data.status_code != 200) return Toast.Error(data.data.alert_text);
         formData.zip = data.data.result.CodigoPostal;
         formData.state = data.data.result.Estado;
         formData.city = data.data.result.Municipio;
         formData.colony = community_id;
         await setFormData(formData);
         zip = formData.zip;
      }
      const axiosCommunities = axios;
      const axiosRes = await axiosCommunities.get(`https://api.gomezpalacio.gob.mx/api/cp/${zip}`);
      if (axiosRes.data.data.status_code != 200) return Toast.Error(axiosRes.data.data.alert_text);
      await axiosRes.data.data.result.map((d) => {
         states.push(d.Estado);
         cities.push(d.Municipio);
         colonies.push({ id: d.id, Colonia: d.Colonia });
      });
      states = [...new Set(states)];
      cities = [...new Set(cities)];
      colonies = [...new Set(colonies)];

      if (states.length == 0) {
         setShowLoading(false);
         return Toast.Info("No hay comunidades registradas con este C.P.");
      }
      if (states.length > 1) setDisabledState(false);
      if (cities.length > 1) setDisabledCity(false);
      if (colonies.length > 1) setDisabledColony(false);
      setDataStates(states);
      setDataCities(cities);
      setDataColonies(colonies);
      setFieldValue("zip", community_id ? formData.zip : zip);
      setFieldValue("state", community_id ? formData.state : states[0]);
      setFieldValue("city", community_id ? formData.city : cities[0]);
      setFieldValue("colony", community_id ? community_id : colonies[0]["id"]);
      setShowLoading(false);
   } catch (error) {
      console.log(error);
      Toast.Error(error);
      setShowLoading(false);
   }
};

/**
 * Estos Inputs, deben de estar dentro de Formik, validados con Yup y dentro de grillas
 * @param {*} param0
 * @returns community_id: int
 */
const InputsCommunityComponent = ({ formData, setFormData, values, setFieldValue, handleChange, handleBlur, errors, touched, getCommunityByZip }) => {
   const [disabledState, setDisabledState] = useState(true);
   const [disabledCity, setDisabledCity] = useState(true);
   const [disabledColony, setDisabledColony] = useState(true);
   const [showLoading, setShowLoading] = useState(false);
   const [dataStates, setDataStates] = useState([]);
   const [dataCities, setDataCities] = useState([]);
   const [dataColonies, setDataColonies] = useState([]);

   // handleGetCommunityByZip = async (zip, setFieldValue, community_id = null) => {
   //    try {
   //       getCommunityByZip(zip, setFieldValue, community_id);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //       setShowLoading(false);
   //    }
   // };

   return (
      <>
         {/* community_id */}
         <Field id="community_id" name="community_id" type="hidden" value={values.community_id} onChange={handleChange} onBlur={handleBlur} />
         {/* Comunidad */}
         <Grid container spacing={2} xs={12} sx={{ p: 1 }}>
            {/* C.P. */}
            <Grid xs={12} md={6} sx={{ mb: 2 }}>
               <TextField
                  id="zip"
                  name="zip"
                  label="Código Postal *"
                  type="number"
                  value={values.zip}
                  placeholder="35000"
                  inputProps={{ maxLength: 5 }}
                  onChange={handleChange}
                  onBlur={async (e) => {
                     handleBlur(e);
                     await getCommunityByZip(
                        e.target.value,
                        setFieldValue,
                        setDisabledState,
                        setDisabledCity,
                        setDisabledColony,
                        setShowLoading,
                        setDataStates,
                        setDataCities,
                        setDataColonies
                     );
                  }}
                  fullWidth
                  // disabled={values.id == 0 ? false : true}
                  error={errors.zip && touched.zip}
                  helperText={errors.zip && touched.zip && errors.zip}
               />
            </Grid>
            {/* Estado */}
            <Grid xs={12} md={6} sx={{ mb: 2 }}>
               <FormControl fullWidth>
                  <InputLabel id="state-label">Estado</InputLabel>
                  <Select
                     id="state"
                     name="state"
                     label="Estado"
                     labelId="state-label"
                     value={values.state}
                     placeholder="Estado"
                     // readOnly={true}
                     disabled={disabledState}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     error={errors.state && touched.state}
                  >
                     <MenuItem value={0} disabled>
                        Seleccione una opción...
                     </MenuItem>
                     {dataStates &&
                        dataStates.map((d, i) => (
                           <MenuItem key={i} value={d}>
                              {d}
                           </MenuItem>
                        ))}
                  </Select>
                  {touched.state && errors.state && errors.state}
               </FormControl>
            </Grid>
            {showLoading && <CircularProgress disableShrink sx={{ position: "absolute", left: "47%", mt: 7 }} />}
            {/* Ciduad */}
            <Grid xs={12} md={6} sx={{ mb: 2 }}>
               <FormControl fullWidth>
                  <InputLabel id="city-label">Ciudad</InputLabel>
                  <Select
                     id="city"
                     name="city"
                     label="Ciudad"
                     labelId="city-label"
                     value={values.city}
                     placeholder="Ciudad"
                     // readOnly={true}
                     disabled={disabledCity}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     error={errors.city && touched.city}
                  >
                     <MenuItem value={0} disabled>
                        Seleccione una opción...
                     </MenuItem>
                     {dataCities &&
                        dataCities.map((d, i) => (
                           <MenuItem key={i} value={d}>
                              {d}
                           </MenuItem>
                        ))}
                  </Select>
                  {touched.city && errors.city && errors.city}
               </FormControl>
            </Grid>
            {/* Colonia */}
            <Grid xs={12} md={6} sx={{ mb: 2 }}>
               <FormControl fullWidth>
                  <InputLabel id="colony-label">Colonia</InputLabel>
                  <Select
                     id="colony"
                     name="colony"
                     label="Colonia"
                     labelId="colony-label"
                     value={values.colony}
                     placeholder="Colonia"
                     // readOnly={true}
                     disabled={disabledColony}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     error={errors.colony && touched.colony}
                  >
                     <MenuItem value={0} disabled>
                        Seleccione una opción...
                     </MenuItem>
                     {dataColonies &&
                        dataColonies.map((d, i) => (
                           <MenuItem key={i} value={d.id}>
                              {d.Colonia}
                           </MenuItem>
                        ))}
                  </Select>
                  {touched.colony && errors.colony && errors.colony}
               </FormControl>
            </Grid>
         </Grid>
         {/* Calle */}
         <Grid xs={12} md={8} sx={{ mb: 2 }}>
            <TextField
               id="street"
               name="street"
               label="Calle *"
               type="text"
               value={values.street}
               placeholder="Calle de las Garzas"
               onChange={handleChange}
               onBlur={handleBlur}
               fullWidth
               // disabled={values.id == 0 ? false : true}
               onInput={(e) => handleInputFormik(e, setFieldValue, "street", true)}
               error={errors.street && touched.street}
               helperText={errors.street && touched.street && errors.street}
            />
         </Grid>
         {/* No. Ext. */}
         <Grid xs={12} md={2} sx={{ mb: 2 }}>
            <TextField
               id="num_ext"
               name="num_ext"
               label="No. Ext. *"
               type="text"
               value={values.num_ext}
               placeholder="S/N"
               onChange={handleChange}
               onBlur={handleBlur}
               fullWidth
               onInput={(e) => handleInputFormik(e, setFieldValue, "num_ext", true)}
               // disabled={values.id == 0 ? false : true}
               error={errors.num_ext && touched.num_ext}
               helperText={errors.num_ext && touched.num_ext && errors.num_ext}
            />
         </Grid>
         {/* No. Int. */}
         <Grid xs={12} md={2} sx={{ mb: 2 }}>
            <TextField
               id="num_int"
               name="num_int"
               label="No. Int."
               type="text"
               value={values.num_int}
               placeholder="S/N"
               onChange={handleChange}
               onBlur={handleBlur}
               fullWidth
               onInput={(e) => handleInputFormik(e, setFieldValue, "num_int", true)}
               // disabled={values.id == 0 ? false : true}
               error={errors.num_int && touched.num_int}
               helperText={errors.num_int && touched.num_int && errors.num_int}
            />
         </Grid>
      </>
   );
};

export default InputsCommunityComponent;
