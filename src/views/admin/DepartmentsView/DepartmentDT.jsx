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

import { useDepartmentContext } from "../../../context/DepartmentContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";

const DepartmentDT = () => {
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, departments, getDepartments, showDepartment, deleteDepartment, setTextBtnSumbit, setFormTitle } = useDepartmentContext();
   const globalFilterFields = ["department", "description"];

   // #region BodysTemplate
   const DepartmentBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.department}</Typography>;
   const DescriptionBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.description}</Typography>;

   // #endregion BodysTemplate

   const columns = [
      { field: "department", header: "Departamento", sortable: true, functionEdit: null, body: DepartmentBodyTemplate, filterField: null },
      { field: "description", header: "Descripción", sortable: false, functionEdit: null, body: DescriptionBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showDepartment(id);
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
               const axiosResponse = await deleteDepartment(id);
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
         // console.log("cargar listado", departments);
         await departments.map((obj) => {
            // console.log(obj);
            let register = obj;
            register.actions = <ButtonsAction id={obj.id} name={obj.department} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(departments[0]));
         // console.log("la data del formatData", globalFilterFields);
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
   return <DataTableComponent columns={columns} data={data} globalFilterFields={globalFilterFields} headerFilters={false} refreshTable={getDepartments} />;
};
export default DepartmentDT;
