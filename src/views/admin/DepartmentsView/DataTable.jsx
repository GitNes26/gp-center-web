import { Fragment, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Avatar, Box, Button, ButtonGroup, Tooltip, Typography } from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";
import IconDelete from "../../../components/icons/IconDelete";

import { useDepartmentContext } from "../../../context/DepartmentContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { formatDatetime } from "../../../utils/Formats";
import { useAuthContext } from "../../../context/AuthContext";
import SwitchComponent from "../../../components/SwitchComponent";
import { useDirectorContext } from "../../../context/DirectorContext";
import { IconCirclesRelation } from "@tabler/icons";

const DepartmentDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      department,
      departments,
      getDepartments,
      showDepartment,
      deleteDepartment,
      deleteMultiple,
      disEnableDepartment,
      resetFormData,
      resetDepartment,
      setTextBtnSumbit,
      setFormTitle,
      formikRef,
      showDepartmentDirector,
      setDirectorsHistory
   } = useDepartmentContext();
   // const { setDirectors } = useDirectorContext();
   const globalFilterFields = ["clave_org", "organismo", "departamento", "description"];

   // #region BodysTemplate
   const SelloBodyTemplate = (obj) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
         <Avatar
            sx={{ width: 56, height: 56 }}
            src={obj.img_sello !== null ? `${import.meta.env.VITE_HOST}/${obj.img_sello}` : ""}
            alt={`Sello de ${obj.departamento}`}
         />
      </Box>
   );
   const OrganismoBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>({obj.clave_org})</b> {obj.organismo}
      </Typography>
   );
   const DepartmentBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.departamento}</Typography>;
   const DirectorBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.director && (
            <>
               <b>{obj.director.payroll_number}</b>
               <br />
               {obj.director.full_name}
            </>
         )}
      </Typography>
   );
   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.activo ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );
   const CreatedAtBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.creado, true)}</Typography>;

   // #endregion BodysTemplate

   const columns = [
      { field: "Sello", header: "Sello", sortable: true, functionEdit: null, body: SelloBodyTemplate, filter: false, filterField: null },
      { field: "organismo", header: "Organismo", sortable: true, functionEdit: null, body: OrganismoBodyTemplate, filter: true, filterField: null },
      { field: "departamento", header: "Departamento", sortable: true, functionEdit: null, body: DepartmentBodyTemplate, filter: true, filterField: null },
      { field: "director", header: "Director", sortable: true, functionEdit: null, body: DirectorBodyTemplate, filter: true, filterField: null }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         { field: "activo", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filter: true, filterField: null },
         { field: "creado", header: "Registrado", sortable: true, functionEdit: null, body: CreatedAtBodyTemplate, filter: true, filterField: null }
      );

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetDepartment();
         // department.role = "Selecciona una opción...";
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickAttach = async (department_id) => {
      // console.log("🚀 ~ handleClickAttach ~ department_id:", department_id);
      try {
         setLoadingAction(true);
         setTextBtnSumbit("VINCULAR");
         setFormTitle(`VINCULAR DIRECTOR-${singularName.toUpperCase()}`);
         const res = await showDepartmentDirector(department_id);
         formikRef.current.setValues(res);
         setDirectorsHistory(res.directors);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         setLoadingAction(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      console.log("🚀 ~ handleClickEdit ~ id:", id);
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         const res = await showDepartment(id);
         formikRef.current.setValues(res);
         setDirectorsHistory(res.directors);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         setLoadingAction(false);
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

   const handleClickDeleteMultipleContinue = async (selectedData) => {
      try {
         let ids = selectedData.map((d) => d.id);
         // if (ids.length < 1) console.log("no hay registros");
         let msg = `¿Estas seguro de eliminar `;
         if (selectedData.length === 1) msg += `el departamento: ${selectedData[0].department}?`;
         else if (selectedData.length > 1) msg += `los siguientes departamentos: ${selectedData.map((d) => d.department)}?`;
         mySwal.fire(QuestionAlertConfig(msg)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteMultiple(ids);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, name, active) => {
      try {
         let axiosResponse;
         setTimeout(async () => {
            axiosResponse = await disEnableDepartment(id, !active);
            Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         }, 500);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const ButtonsAction = ({ id, name, active, obj }) => {
      // console.log("🚀 ~ ButtonsAction ~ obj:", obj)
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Vincular Director-${singularName}`} placement="top">
               <Button color="info" onClick={() => handleClickAttach(obj.id)}>
                  <IconCirclesRelation />
               </Button>
            </Tooltip>
            {/* <Tooltip title={`Editar ${singularName}`} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip> */}
            <Tooltip title={`Eliminar ${singularName}`} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip>
            {/* {auth.role_id == ROLE_SUPER_ADMIN && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)} sx={{}}>
                     <SwitchComponent checked={active} />
                  </Button>
               </Tooltip>
            )} */}
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", departments);
         await departments.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.department} active={obj.active} obj={obj} />;
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
   return (
      <DataTableComponent
         columns={columns}
         data={data}
         globalFilterFields={globalFilterFields}
         headerFilters={false}
         handleClickAdd={handleClickAdd}
         refreshTable={getDepartments}
         btnAdd={false}
         showGridlines={false}
         btnsExport={true}
         rowEdit={false}
         // handleClickDeleteContinue={handleClickDeleteContinue}
         // ELIMINAR MULTIPLES REGISTROS
         btnDeleteMultiple={false}
         // handleClickDeleteMultipleContinue={handleClickDeleteMultipleContinue}
         // PARA HACER FORMULARIO EN LA TABLA
         // AGREGAR
         // createData={createDepartment}
         // newRow={newRow}
         // EDITAR
         // setData={setDepartments}
         // updateData={updateDepartment}
      />
   );
};
export default DepartmentDT;
