import { useEffect } from "react";
import { Button, ButtonGroup, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import IconEdit from "./icons/IconEdit";
import IconDelete from "./icons/IconDelete";
import { IconEye } from "@tabler/icons";
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import { useAuthContext } from "../context/AuthContext";
import { useGlobalContext } from "../context/GlobalContext";
import DataTableComponent from "./DataTableComponent";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { QuestionAlertConfig } from "../utils/sAlert";
import SwitchComponent from "./SwitchComponent";
import { formatPhone } from "../utils/Formats";

const mySwal = withReactContent(Swal);

export const EmployeeDataTableBase = ({
   columns: extraColumns = [],
   data: rawData,
   globalFilterFields,
   singularName,
   handleClickAdd,
   refreshTable,
   btnAdd = true,
   handleClickEdit,
   handleClickDelete,
   handleClickDisEnable,
   handleClickView,
   showViewButton = false,
   showActiveToggle = false,
   showDeleteButton = true,
   activeTogglePermission = false,
   useFullName = false,
   showDepartmentColumn = true,
   deleteWithUserId = true,
   renderActions,
   ...tableProps
}) => {
   const { auth } = useAuthContext();
   const { setLoading } = useGlobalContext();

   const AvatarBodyTemplate = (obj) => (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
         <Avatar sx={{ width: 56, height: 56 }} src={obj.avatar ? `${obj.avatar}` : ""} alt={obj.full_name} />
      </Box>
   );

   const PayRollBodyTemplate = (obj) => (
      <Typography textAlign={"center"} fontWeight={"bolder"}>
         {obj.employee_code ?? "No asignado"}
      </Typography>
   );

   const NameBodyTemplate = (obj) => <Typography textAlign={"center"}>{useFullName ? obj.full_name : obj.username}</Typography>;

   const EmailBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.email}</Typography>;
   const PhoneBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatPhone(obj.cellphone)}</Typography>;
   const DepartmentBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.department}</Typography>;

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );

   const baseColumns = [
      { field: "avatar", header: "Foto", sortable: true, body: AvatarBodyTemplate, filter: false },
      { field: "employee_code", header: "No. Nómina", sortable: true, body: PayRollBodyTemplate, filter: true },
      { field: useFullName ? "full_name" : "username", header: useFullName ? "Nombre" : "Usuario", sortable: true, body: NameBodyTemplate, filter: true },
      { field: "email", header: "Correo", sortable: true, body: EmailBodyTemplate, filter: true },
      { field: "cellphone", header: "Teléfono", sortable: true, body: PhoneBodyTemplate, filter: false },
      ...(showDepartmentColumn ? [{ field: "department", header: "Departamento", sortable: true, body: DepartmentBodyTemplate, filter: true }] : []),
      { field: "active", header: "Activo", sortable: true, body: ActiveBodyTemplate, filter: false }
   ];

   const columns = [...baseColumns, ...extraColumns];

   const handleDeleteConfirm = (id, name) => {
      mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
         if (result.isConfirmed && handleClickDelete) {
            handleClickDelete(id, name);
         }
      });
   };

   const showToggle = showActiveToggle && (typeof activeTogglePermission === "function" ? activeTogglePermission(auth) : activeTogglePermission);

   const DefaultActions = ({ id, user_id, name, active, obj }) => {
      return (
         <ButtonGroup variant="outlined">
            {showViewButton && handleClickView && (
               <Tooltip title={`Ver ${singularName}`} placement="top">
                  <Button color="dark" onClick={() => handleClickView(obj)}>
                     <IconEye />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.update && handleClickEdit && (
               <Tooltip title={`Editar ${singularName}`} placement="top">
                  <Button color="info" onClick={() => handleClickEdit(id)}>
                     <IconEdit />
                  </Button>
               </Tooltip>
            )}
            {auth.permissions.delete && handleClickDelete && showDeleteButton && (
               <Tooltip title={`Eliminar ${singularName}`} placement="top">
                  <Button color="error" onClick={() => handleDeleteConfirm(deleteWithUserId ? user_id : id, name)}>
                     <IconDelete />
                  </Button>
               </Tooltip>
            )}
            {showToggle && handleClickDisEnable && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)}>
                     <SwitchComponent checked={active} />
                  </Button>
               </Tooltip>
            )}
         </ButtonGroup>
      );
   };

   const ActionsComponent = renderActions || DefaultActions;

   const data = [];
   const formatData = () => {
      if (rawData && rawData.length > 0) {
         rawData.forEach((obj) => {
            data.push({
               ...obj,
               key: obj.id,
               actions: <ActionsComponent id={obj.id} user_id={obj.user_id} name={obj.username || obj.full_name} active={obj.active} obj={obj} />
            });
         });
      }
      setLoading(false);
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
         headerFilters={true}
         handleClickAdd={handleClickAdd}
         refreshTable={refreshTable}
         btnAdd={btnAdd}
         showGridlines={false}
         btnsExport={true}
         rowEdit={false}
         btnDeleteMultiple={false}
         {...tableProps}
      />
   );
};

export default EmployeeDataTableBase;
