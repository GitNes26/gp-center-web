import { useState } from "react";
import Toast from "../utils/Toast";
import axios from "axios";

export const useGetCommunityByZip = async (
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
   // const [showLoading, setShowLoading] = useState(false);
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
