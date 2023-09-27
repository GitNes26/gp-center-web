import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   Autocomplete,
   Backdrop,
   Button,
   CircularProgress,
   Divider,
   FormControlLabel,
   FormLabel,
   InputLabel,
   MenuItem,
   Radio,
   RadioGroup,
   Select,
   Switch,
   TextField,
   Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { useVehicleContext } from "../../context/VehicleContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import Select2 from "react-select";
import { formatDatetime, formatToLowerCase, formatToUpperCase } from "../../utils/Formats";
import { OutlinedInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { strengthColor, strengthIndicator } from "../../utils/password-strength";
import axios from "axios";
import { Axios } from "../../context/AuthContext";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
   { id: "plates", label: "Placas", minWidth: 170, format: (value) => value.toUpperCase() },
   { id: "initial_date", label: "Fecha de Plaqueo", minWidth: 100, format: (value) => formatDatetime(value, true) },
   { id: "due_date", label: "Fecha de Vencimiento", minWidth: 100, format: (value) => formatDatetime(value, true) }
   // {
   //    id: "density",
   //    label: "Density",
   //    minWidth: 170,
   //    align: "right",
   //    format: (value) => value.toFixed(2)
   // }
];

// function createData(name, code, population, size) {
//    const density = population / size;
//    return { name, code, population, size, density };
// }
function createData(plates, initial_date, due_date) {
   return { plates, initial_date, due_date };
}

const rows = [
   createData("AAA-00-00", "2020-01-01","2025-01-01"),
   createData("AAA-00-01", "2020-01-01","2025-01-01"),
   createData("AAA-00-02", "2020-01-01","2025-01-01"),
   createData("AAA-00-03", "2020-01-01","2025-01-01"),
];

const PlatesRegisters = () => {
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   const { singularName, formData, setFormData } = useVehicleContext();
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
   };

   const handleChangeCheckAdd = (e) => {
      try {
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm, setFieldValue }) => {
      try {
         console.log("el imageFile", imageFile);
         values.imgFile = imageFile;
         console.log(values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createVehicle(values);
         else axiosResponse = await updateVehicle(values);
         if (axiosResponse.status_code == 200) {
            resetForm();
            setTextBtnSumbit("AGREGAR");
            setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         }
         setDataModels([]);
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         if (!checkAdd && axiosResponse.status_code == 200) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
         Toast.Error(error);
      } finally {
         setSubmitting(false);
      }
   };

   useEffect(() => {
      try {
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
         <Box role="presentation" p={3} pt={5} className="form">
            <Typography variant="h2" mb={3}>
               {"REGISTRO DE PLAQUEO"}
            </Typography>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
               <TableContainer sx={{ maxHeight: "50%" }}>
                  <Table stickyHeader aria-label="sticky table">
                     <TableHead>
                        <TableRow>
                           {columns.map((column) => (
                              <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                 {column.label}
                              </TableCell>
                           ))}
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                           return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row.plates}>
                                 {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                       <TableCell key={column.id} align={column.align}>
                                          {column.format && typeof value === "number" ? column.format(value) : value}
                                       </TableCell>
                                    );
                                 })}
                              </TableRow>
                           );
                        })}
                     </TableBody>
                  </Table>
               </TableContainer>
               <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
               />
            </Paper>
         </Box>
      </SwipeableDrawer>
   );
};
export default PlatesRegisters;
