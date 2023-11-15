import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import IconEdit from "./icons/IconEdit";
import IconDelete from "./icons/IconDelete";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { QuestionAlertConfig } from "../utils/sAlert";
import Toast from "../utils/Toast";
import { useGlobalContext } from "../context/GlobalContext";

const muiCache = createCache({
   key: "mui-datatables",
   prepend: true
});

/**
 *
 * ========= INSTALACION =============
 * npm install --save ag-grid-community
 * npm install --save ag-grid-react
 *
 */

// /**
//  * Descripción de la funcion
//  * @param {*} title string
//  * @returns void
//  */
const DataTableComponent = ({ title, objName, columnDefs, rowData = [], showContext, deleteContext }) => {
   const gridRef = useRef(); // Optional - for accessing Grid's API
   // const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

   // Each Column Definition results in one Column.
   // const [columnDefs, setColumnDefs] = useState([{ field: "make", filter: true }, { field: "model", filter: true }, { field: "price" }]);

   // DefaultColDef sets props common to all Columns
   const defaultColDef = useMemo(() => ({
      sortable: true
   }));

   // Example of consuming Grid Event
   const cellClickedListener = useCallback((event) => {
      console.log("cellClicked", event);
   }, []);

   // Example load data from server
   useEffect(() => {
      // fetch("https://www.ag-grid.com/example-assets/row-data.json")
      //    .then((result) => result.json())
      //    .then((rowData) => console.log(rowData));
   }, []);

   // Example using Grid's API
   const buttonListener = useCallback((e) => {
      gridRef.current.api.deselectAll();
   }, []);

   return (
      <div>
         {/* Example using Grid's API */}
         {/* <button onClick={buttonListener}>Push Me</button> */}

         {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
         <div className="ag-theme-alpine" style={{ width: "auto", height: 500 }}>
            <AgGridReact
               ref={gridRef} // Ref for accessing Grid's API
               rowData={rowData} // Row Data for Rows
               columnDefs={columnDefs} // Column Defs for Columns
               defaultColDef={defaultColDef} // Default Column Properties
               animateRows={true} // Optional - set to 'true' to have rows animate when sorted
               rowSelection="multiple" // Options - allows click selection of rows
               onCellClicked={cellClickedListener} // Optional - registering for Grid Event
            />
         </div>
      </div>
   );

   const { setLoading, setLoadingAction, setTextBtnSumbit, setFormTitle } = useGlobalContext();

   const mySwal = withReactContent(Swal);

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${objName.toUpperCase()}`);
         await showContext(id);
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
               const axiosResponse = await deleteContext(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const options = {
      search: searchBtn,
      download: downloadBtn,
      print: printBtn,
      viewColumns: viewColumnBtn,
      filter: filterBtn,
      filterType: "dropdown",
      responsive,
      tableBodyHeight,
      tableBodyMaxHeight,
      onTableChange: (action, state) => {
         // console.log("onTableChange-action:", action);
         // console.dir("onTableChange-state:", state);
      }
   };

   // const columns = [{ name: "Clave", options: { filterOptions: { fullWidth: true } } }, "Title", "Location", "Acciones"];

   const ButtonsAction = ({ id, name }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Editar ${objName}`} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={`Eliminar ${objName}`} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   let data = [];
   const chargerData = async () => {
      try {
         data = await convertDataContextToArray(ButtonsAction);
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   chargerData();
   return (
      <>
         <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
               <MUIDataTable title={title} data={data} columns={columns} options={options} />
            </ThemeProvider>
         </CacheProvider>
      </>
   );
};
export default DataTableComponent;
