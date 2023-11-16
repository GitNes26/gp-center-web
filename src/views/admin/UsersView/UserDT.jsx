import { Fragment, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, Tooltip, Typography } from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";
import IconDelete from "../../../components/icons/IconDelete";

import { useUserContext } from "../../../context/UserContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";

const UserDT = () => {
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, users, showUser, deleteUser, setTextBtnSumbit, setFormTitle } = useUserContext();
   const [globalFilterFields, setGlobalFilterFields] = useState([]);

   // #region BodysTemplate
   const UserBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.username} <br /> {obj.email}
      </Typography>
   );
   const RoleBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.role}</Typography>;
   const InfoBodyTemplate = (obj) => (
      <Fragment>
         {obj["paternal_last_name"] == "No Aplica" ? (
            <Typography textAlign={"center"}>No Aplica</Typography>
         ) : (
            <Typography textAlign={"center"}>
               {obj.name} {obj.paternal_last_name} {obj.maternal_last_name} <br /> {formatPhone(obj.phone)}
            </Typography>
         )}
      </Fragment>
   );
   const AddressBodyTemplate = (obj) => (
      <Fragment>
         {obj.street == "No Aplica" ? (
            <Typography textAlign={"center"}>No Aplica</Typography>
         ) : (
            <Fragment>
               {obj.street} {obj.num_ext == "S/N" ? obj.num_ext : `# ${obj.num_ext}`}
            </Fragment>
         )}
      </Fragment>
   );
   const MoreInfoBodyTemplate = (obj) => (
      <Fragment>
         {obj.license_number == "No Aplica" ? (
            <Typography>No Aplica</Typography>
         ) : (
            <Typography>
               No. Licencia: <b>{obj.license_number}</b> <br />
               vence: <b>{formatDatetime(obj.license_due_date, false)}</b>
            </Typography>
         )}
      </Fragment>
   );
   // #endregion BodysTemplate

   const columns = [
      { field: "user", header: "Usuario", sortable: true, functionEdit: null, body: UserBodyTemplate, filterField: null },
      { field: "role", header: "Rol", sortable: true, functionEdit: null, body: RoleBodyTemplate, filterField: null },
      { field: "info", header: "Información Personal", sortable: true, functionEdit: null, body: InfoBodyTemplate, filterField: null },
      { field: "address", header: "Dirección", sortable: true, functionEdit: null, body: AddressBodyTemplate, filterField: null },
      { field: "more_info", header: "Más Información", sortable: true, functionEdit: null, body: MoreInfoBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showUser(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteUser(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const ButtonsAction = ({ id, name }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={"Editar Usuario"} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={"Eliminar Usuario"} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", users);
         await users.map((obj) => {
            // console.log(obj);
            let register = obj;
            register.actions = <ButtonsAction id={obj.id} name={obj.username} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(users[0]));
         // console.log("la data del charger", globalFilterFields);
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   useEffect(() => {
      setLoading(false);
   }, []);
   return <DataTableComponent columns={columns} data={data} headerFilters={false} />;
};
export default UserDT;
