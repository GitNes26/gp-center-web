import { Fragment, createFactory, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";
import IconDelete from "../../../components/icons/IconDelete";

import { useVoucherDetailContext } from "../../../context/VoucherDetailContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { formatCurrency, formatDatetime, formatPhone } from "../../../utils/Formats";
import { getEmployeeVoucherFields, mergeEmployeeFieldsIntoVoucherDetail, updateVoucherDetailEmployee } from "../../../utils/employeeVoucherDetail";
import { useAuthContext } from "../../../context/AuthContext";
import { useEmployeeContext } from "../../../context/EmployeeContext";
import useDebounce from "../../../hooks/useDebounce";
import SwitchComponent from "../../../components/SwitchComponent";
import { useParams } from "react-router-dom";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "@mui/icons-material";
import axios from "axios";

export let monthlyIncome = 0;

const VoucherDetailDT = ({ voucherId, setFieldValue, values }) => {
   let { folio } = useParams();

   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { getInfoEmployee } = useEmployeeContext();
   const [employeeFieldsByRow, setEmployeeFieldsByRow] = useState({});
   const {
      singularName,
      voucherDetails,
      setVoucherDetails,
      getIndexByVoucher,
      showVoucherDetail,
      createVoucherDetail,
      updateVoucherDetail,
      deleteVoucherDetail,
      resetFormData,
      setTextBtnSumbit,
      setFormTitle
      // setMonthlyIncome
   } = useVoucherDetailContext();
   const globalFilterFields = [
      "id",
      "voucher_id",
      "vehicle",
      "vehicle_plates",
      "employee_code",
      "name",
      "plast_name",
      "mlast_name",
      // "acreditor_fullname",
      "cellphone",
      // "requested_amount",
      "active",
      "created_at"
   ];

   // #region BodysTemplate
   const getEditorValue = (options) => employeeFieldsByRow[options.rowData.key]?.[options.field] ?? options.value ?? "";

   const VehicleBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.vehicle ?? "-"} </Typography>;
   const VehiclePlatesBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.vehicle_plates ?? "-"} </Typography>;
   const PayrollBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.employee_code}</Typography>;
   const DepartmentBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.department}</Typography>;
   const NameBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.name}</Typography>;
   const PaternalBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.plast_name}</Typography>;
   const MaternalBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.mlast_name}</Typography>;
   const PhoneBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.cellphone ? formatPhone(obj.cellphone, true) : "-"}</Typography>;
   // const AmountTemplate = (obj) => <Typography textAlign={"center"}>{obj.requested_amount}</Typography>;
   // #endregion BodysTemplate

   // #region BodysTemplateEditor
   const handleEditorValueChange = (e, options) => {
      const newValue = e.target.value;
      const updatedProducts = [...voucherDetails];
      const rowIndex = options.rowIndex;

      // Actualiza el valor de la columna 1
      updatedProducts[rowIndex][options.field] = newValue;

      // // Aquí se realiza la búsqueda del objeto correspondiente y se actualizan las demás columnas
      const correspondingData = findCorrespondingData(newValue); // Implementa esta función

      if (correspondingData) {
         updatedProducts[rowIndex] = { ...updatedProducts[rowIndex], ...correspondingData };
      }

      setProducts(updatedProducts);
      options.editorCallback(newValue);
   };

   const findCorrespondingData = (value) => {
      console.log("🚀 ~ findCorrespondingData ~ value:", value);
      // Implementa la lógica para encontrar los datos correspondientes
      // Ejemplo:
      const data = {
         value1: { name: "Product 1", inventoryStatus: "INSTOCK", price: 100 },
         value2: { name: "Product 2", inventoryStatus: "LOWSTOCK", price: 150 }
      };
      return data[value] || null;
   };

   const textMayusEditor = (options) => {
      return (
         <InputText
            type="text"
            value={getEditorValue(options).toUpperCase()}
            onChange={(e) => {
               options.editorCallback(e.target.value.toUpperCase());
               // if (options.field === "employee_code") handleEditorValueChange(e, options);
            }}
            data-field-name={options.field}
            data-field-key={options.rowData.key}
         />
      );
   };

   const numberEditor = (options) => (
      <InputText
         type="number"
         value={options.value}
         onChange={(e) => options.editorCallback(e.target.value)}
         data-field-name={options.field}
         data-field-key={options.rowData.key}
      />
   );

   const handleChangePhone = (e, options) => {
      const value = e.target.value;
      // console.log(value);
      // console.log(options);
   };
   const cellphoneEditor = (options) => (
      <InputText
         type="text"
         value={getEditorValue(options)}
         placeholder="10 dígitos"
         onChange={(e) => {
            if (!/^\d*$/.test(e.target.value) || e.target.value.length > 10) return;
            options.editorCallback(e.target.value);
            // handleChangePhone(e, options);
         }}
         maxLength={10}
         data-field-name={options.field}
         data-field-key={options.rowData.key}
      />
   );

   // const statusEditor = (options) => {
   //    return (
   //       <Dropdown
   //          value={options.value}
   //          options={statuses}
   //          onChange={(e) => options.editorCallback(e.value)}
   //          placeholder="Select a Status"
   //          itemTemplate={(option) => {
   //             return <Tag value={option} severity={getSeverity(option)}></Tag>;
   //          }}
   //       />
   //    );
   // };

   const priceEditor = (options) => (
      <InputNumber
         value={options.value}
         onValueChange={(e) => options.editorCallback(e.value)}
         mode="currency"
         currency="MXN"
         locale="es-MX"
         data-field-name={options.field}
         data-field-key={options.rowData.key}
      />
   );
   // const addRow = () => {
   //    console.log("addRow - data", data);
   //    const newRow = {
   //       id: data.length + 1,
   //       voucher_id: 1,
   //       relationship: "",
   //       age: 0,
   //       occupation: "",
   //       monthly_income: 0,
   //       actions: "asa"
   //       // finished: false
   //    };

   //    let _data = [...data];
   //    console.log("_data", _data);
   //    // let { newData, index } = e;

   //    // _data[index] = newData;
   //    _data.push(newRow);

   //    setVoucherDetails(_data);

   //    // setData(newRow);
   //    console.log(data);
   // };
   // const onRowEditCompleteContinue = async (newData) => {
   //    delete newData.actions;
   //    console.log("onRowEditCompleteContinue -> newData", newData);
   //    const ajaxResponse = await updateVoucherDetail(newData);
   //    console.log(ajaxResponse);
   //    // console.log(e);
   //    // let _products = [...data];
   //    // let { newData, index } = e;
   //    // _products[index] = newData;
   //    // setData(_products);
   // };
   // #endregion BodysTemplateEditor

   // #Region BodysTemplatesFunctionEditor
   const handleInputPayRoll = useDebounce(async (value, rowKey) => {
      const employeeCode = String(value ?? "").trim();

      if (employeeCode === "0" || employeeCode.length < 5) return;

      try {
         setLoadingAction(true);
         const res = await getInfoEmployee("employee_code", employeeCode);
         const employee = res?.result;

         if (!employee) {
            Toast.Error("El Número de nómina no fue encontrado");
            return;
         }

         const employeeFields = getEmployeeVoucherFields(employee);
         setEmployeeFieldsByRow((currentFields) => ({ ...currentFields, [rowKey]: employeeFields }));
         setVoucherDetails((currentDetails) => updateVoucherDetailEmployee(currentDetails, rowKey, employee));
         Toast.Success("Número de nómina encontrado");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      } finally {
         setLoadingAction(false);
      }
   }, 1500);

   const PayrollBodyTemplateEditor = (options) => {
      return (
         <Tooltip title="Si no es empleado poner el N° 0">
            <InputText
               type="number"
               value={getEditorValue(options)}
               onChange={(e) => {
                  options.editorCallback(e.target.value);
                  handleInputPayRoll(e.target.value, options.rowData.key);
               }}
            />
         </Tooltip>
      );
   };

   const handleRowEditCompleteContinue = (newData) => {
      const employeeFields = employeeFieldsByRow[newData.key] ?? {};
      setEmployeeFieldsByRow((currentFields) => {
         const nextFields = { ...currentFields };
         delete nextFields[newData.key];
         return nextFields;
      });
      return mergeEmployeeFieldsIntoVoucherDetail(newData, employeeFields);
   };
   // #endregion BodysTemplatesFunctionEditor

   const columns = [
      { field: "vehicle", header: "VEHÍCULO", sortable: true, functionEdit: textMayusEditor, body: VehicleBodyTemplate, filter: true, filterField: null },
      { field: "vehicle_plates", header: "PLACAS", sortable: true, functionEdit: textMayusEditor, body: VehiclePlatesBodyTemplate, filter: true, filterField: null },
      {
         field: "employee_code",
         header: "N° NÓMINA",
         sortable: true,
         functionEdit: PayrollBodyTemplateEditor,
         body: PayrollBodyTemplate,
         filter: true,
         filterField: null
      },
      { field: "department", header: "DEPARTAMENTO", sortable: true, functionEdit: textMayusEditor, body: DepartmentBodyTemplate, filter: true, filterField: null },
      { field: "name", header: "NOMBRE", sortable: true, functionEdit: textMayusEditor, body: NameBodyTemplate, filter: true, filterField: null },
      {
         field: "plast_name",
         header: "A. PATERNO",
         sortable: true,
         functionEdit: textMayusEditor,
         body: PaternalBodyTemplate,
         filter: true,
         filterField: null
      },
      {
         field: "mlast_name",
         header: "A. MATERNO",
         sortable: true,
         functionEdit: textMayusEditor,
         body: MaternalBodyTemplate,
         filter: true,
         filterField: null
      },
      { field: "cellphone", header: "TELÉFONO", sortable: true, functionEdit: cellphoneEditor, body: PhoneBodyTemplate, filter: true, filterField: null }
      // { field: "requested_amount", header: "CANTIDAD VALES", sortable: true, functionEdit: numberEditor, body: AmountTemplate, filter: true, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         // resetVoucherDetail();
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showVoucherDetail(id);
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
         if (selectedData.length === 1) msg += `al acreditado: ${selectedData[0].creditor_fullname}?`;
         else if (selectedData.length > 1) msg += `a los acreditados: ${selectedData.map((d) => d.creditor_fullname)}?`;
         mySwal.fire(QuestionAlertConfig(msg)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteVoucherDetail(ids, folio);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", voucherDetails);
         voucherDetails.sort((a, b) => a.id - b.id);
         monthlyIncome = 0;

         await voucherDetails.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.voucherDetail} active={obj.active} />;
            data.push(register);

            monthlyIncome += Number(obj.monthly_income);
         });
         // console.log("monthlyIncome", monthlyIncome);
         // console.log("values", values.monthly_income);
         // if (values.monthly_income != monthlyIncome + Number(values.extra_income)) {
         // monthlyIncome += Number(values.extra_income);
         // setFieldValue("monthly_income", monthlyIncome);
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
      voucher_id: voucherId,
      vehicle: "",
      vehicle_plates: "",
      creditor_fullname: "",
      department: ""
   };

   useEffect(() => {
      getIndexByVoucher(voucherId);
      setLoading(false);
   }, []);

   return (
      <DataTableComponent
         idName="dtVoucherDetails"
         columns={columns}
         data={data}
         setData={setVoucherDetails}
         globalFilterFields={globalFilterFields}
         headerFilters={false}
         handleClickAdd={handleClickAdd}
         rowEdit={values.voucher_status === "CREADO" ? true : false}
         // onRowEditCompleteContinue={onRowEditCompleteContinue}
         onRowEditCompleteContinue={handleRowEditCompleteContinue}
         createData={createVoucherDetail}
         updateData={updateVoucherDetail}
         btnAdd={values.voucher_status === "CREADO" ? true : false}
         titleBtnAdd={"ACREDITADO"}
         newRow={newRow}
         btnDeleteMultiple={values.voucher_status === "CREADO" ? true : false}
         handleClickDeleteMultipleContinue={handleClickDeleteMultipleContinue}
         refreshTable={() => getIndexByVoucher(voucherId)}
         btnsExport={false}
      />
   );
};
export default VoucherDetailDT;
