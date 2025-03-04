import { Button, ButtonGroup, IconButton, Tooltip, Typography } from "@mui/material";
import { useAuthContext } from "../../../context/AuthContext";
import { useGlobalContext } from "../../../context/GlobalContext";

// import IconEdit from "../../components/icons/IconEdit";
// import IconDelete from "../../components/icons/IconDelete";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import { formatCurrency } from "../../../utils/Formats";
import Toast from "../../../utils/Toast";

import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "@mui/icons-material";
import DataTableComponent from "../../../components/DataTableComponent";
import { useEffect, useState } from "react";

const MaterialDT = ({ serviceId, setFieldValue, values }) => {
   let { folio, pagina = 0 } = useParams();
   const [statuses] = useState(["EN STOCK", "STOCK BAJO", "AGOTADO"]);

   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const materials = [];
   // const {
   //    singularName,
   //    material,
   //    materials,
   //    setMaterials,
   //    getIndexByFolio,
   //    createMaterial,
   //    updateMaterial,
   //    deleteMaterial,
   //    disEnableMaterial,
   //    resetFormData,
   //    resetMaterial,
   //    setTextBtnSumbit,
   //    setFormTitle
   //    // setMonthlyIncome
   // } = useMaterialContext();
   const globalFilterFields = ["code", "description", "quantity", "stock", "active", "created_at"];

   // #region BodysTemplate
   const CodeBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.code ? obj.code : ""} </Typography>;
   const DescriptionBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.description ? obj.description.toUpperCase() : ""} </Typography>;
   const QuantityBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.quantity}</Typography>;
   const StockBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.stock}</Typography>;
   // #endregion BodysTemplate

   // #region BodysTemplateEditor
   const textEditor = (options) => <InputText type="text" value={options.value ? options.value : ""} onChange={(e) => options.editorCallback(e.target.value)} />;

   const textMayusEditor = (options) => (
      <InputText type="text" value={options.value ? options.value : ""} onChange={(e) => options.editorCallback(e.target.value.toUpperCase())} />
   );

   const numberEditor = (options) => <InputText type="number" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;

   const statusEditor = (options) => {
      return (
         <Dropdown
            value={options.value}
            options={statuses}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Selecciona un Estatus"
            itemTemplate={(option) => {
               return <Tag value={option} severity={getSeverity(option)}></Tag>;
            }}
         />
      );
   };

   const priceEditor = (options) => (
      <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="MXN" locale="es-MX" />
   );
   // #endregion BodysTemplateEditor

   const columns = [
      { field: "code", header: "Código", sortable: true, functionEdit: textMayusEditor, body: CodeBodyTemplate, filterField: null },
      { field: "description", header: "Material", sortable: true, functionEdit: textMayusEditor, body: DescriptionBodyTemplate, filterField: null },
      { field: "quantity", header: "Cantidad", sortable: true, functionEdit: numberEditor, body: QuantityBodyTemplate, filterField: null },
      { field: "stock", header: "Stock", sortable: true, functionEdit: numberEditor, body: StockBodyTemplate, filterField: null },
      { field: "min_stock", header: "Algo", sortable: true, functionEdit: numberEditor, body: StockBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         // resetMaterial();
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         // setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         // setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showMaterial(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDeleteMultipleContinue = async (selectedData) => {
      try {
         let ids = selectedData.map((d) => d.id);
         if (ids.length < 1) console.log("no hay registros");
         let msg = `¿Estas seguro de eliminar `;
         if (selectedData.length === 1) msg += `el material ${selectedData[0].code}?`;
         else if (selectedData.length > 1) msg += `los materiales ${selectedData.map((d) => d.code)}?`;
         mySwal.fire(QuestionAlertConfig(msg)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteMaterial(ids, folio);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const ButtonsAction = ({ id, name, active }) => {
      return (
         <ButtonGroup variant="outlined">
            {/* <Tooltip title={`Editar ${singularName}`} placement="top"> */}
            <IconButton color="info" onClick={() => handleClickEdit(id)}>
               {/* <IconEdit /> */}
            </IconButton>
            {/* </Tooltip> */}
            {/* <Tooltip title={`Eliminar ${singularName}`} placement="top"> */}
            <IconButton color="error" onClick={() => handleClickDelete(id, name)}>
               {/* <IconDelete /> */}
            </IconButton>
            {/* </Tooltip> */}
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", materials);
         materials.sort((a, b) => a.id - b.id);

         await materials.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.material} active={obj.active} />;
            data.push(register);

            // monthlyIncome += Number(obj.monthly_income);
         });
         // // console.log("monthlyIncome", monthlyIncome);
         // // console.log("values", values.monthly_income);
         // if (values.monthly_income != monthlyIncome + Number(values.extra_income)) {
         //    monthlyIncome += Number(values.extra_income);
         //    setFieldValue("monthly_income", monthlyIncome);
         // }
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   const newRow = {
      key: 0,
      service_id: serviceId,
      relationship: "",
      age: "",
      occupation: "",
      monthly_income: ""
   };

   useEffect(() => {
      // getIndexByFolio(folio);
      setLoading(false);
   }, []);

   return (
      <DataTableComponent
         idName="dtMaterials"
         columns={columns}
         data={data}
         // setData={setMaterials}
         globalFilterFields={globalFilterFields}
         headerFilters={false}
         handleClickAdd={handleClickAdd}
         rowEdit={true}
         // // onRowEditCompleteContinue={onRowEditCompleteContinue}
         // createData={createMaterial}
         // updateData={updateMaterial}
         btnAdd={true}
         newRow={newRow}
         btnDeleteMultiple={true}
         handleClickDeleteMultipleContinue={handleClickDeleteMultipleContinue}
         // refreshTable={(e) => getIndexByFolio(folio)}
         btnsExport={false}
      />
   );
};
export default MaterialDT;
