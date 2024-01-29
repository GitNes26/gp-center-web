import RoleForm from "./Form";
import RoleDT from "./DataTable";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useRoleContext } from "../../../context/RoleContext";
import { Alert, AlertTitle, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import Select2Component from "../../../components/Form/Select2Component";
import FormSelect from "./FormSelect";

const RolesView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, role, roles, getRoles, getRolesSelectIndex } = useRoleContext();

   useEffect(() => {
      try {
         setLoading(true);
         getRoles();
         getRolesSelectIndex();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [role]);

   return (
      <>
         {/* <Alert severity="success" sx={{ mb: 1 }} >
            <AlertTitle>Titulo</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={"#1E2126"} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         {/* </MainCard> */}
         <Grid container spacing={2}>
            <Grid xs={12} md={12} sx={{ mb: 3 }}>
               {/* Rol */}
               <Grid xs={12} md={6} sx={{ mb: 1 }}>
                  <FormSelect />
               </Grid>
            </Grid>
            <Grid xs={12} md={9} sx={{ mb: 3 }}>
               <RoleDT />
            </Grid>
         </Grid>
         <RoleForm />
      </>
   );
};

// export const RolesView = async () => {
//    try {
//       const res = CorrectRes;
//       const Roles = await Axios.get("/roles/selectIndex/role_id");
//       res.result.roles = Roles.data.data.result;
//       res.result.roles.unshift({ id: 0, label: "Selecciona una opción..." });
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

export default RolesView;
