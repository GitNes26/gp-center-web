import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { formatDatetime } from "../utils/Formats";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Typography } from "@mui/material";
import { Paper } from "@mui/material";
import { useEffect, useState } from "react";

export default function TableSimpleComponent({ title, titleTextAlign = "center", initRowsPerPage = 10, columns = [], rows = [] }) {
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(initRowsPerPage);

   const platesCurrent = (expired) => (expired ? "-" : <IconCircleCheckFilled style={{ color: "green" }} />);

   const columnsExample = [
      { id: "plates", label: "Placas", minWidth: 100, format: (value) => value.toUpperCase() },
      { id: "initial_date", label: "Fecha de Plaqueo", minWidth: 100, align: "center", format: (value) => formatDatetime(value, false) },
      { id: "due_date", label: "Fecha de Vencimiento", minWidth: 100, align: "center", format: (value) => formatDatetime(value, false) },
      { id: "expired", label: "Vigente", minWidth: 50, align: "center", format: (value) => platesCurrent(value) }
      // {
      //    id: "density",
      //    label: "Density",
      //    minWidth: 170,
      //    align: "right",
      //    format: (value) => value.toFixed(2)
      // }
   ];
   const rowsExample = [
      createData(1, "AAA-00-00", "2020-01-01", "2025-01-01"),
      createData(2, "AAA-00-01", "2020-01-01", "2025-01-01"),
      createData(3, "AAA-00-02", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01"),
      createData(4, "AAA-00-03", "2020-01-01", "2025-01-01")
   ];
   function createData(id, plates, initial_date, due_date, expired) {
      return { id, plates, initial_date, due_date, expired };
   }

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      console.log("🚀 ~ handleChangeRowsPerPage ~ event:", event)
      setRowsPerPage(+event.target.value);
      setPage(0);
   };

   useEffect(() => {
      try {
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, []);

   return (
      <Box role="presentation" p={0} pt={3} width={"100%"}>
         <Typography variant="h2" mb={2} textAlign={titleTextAlign}>
            {title}
         </Typography>
         <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: "50%" }} >
               <Table stickyHeader aria-label="sticky table" size="small">
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
                           <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                              {columns.map((column) => {
                                 const value = row[column.id];
                                 return (
                                    <TableCell key={column.id} align={column.align}>
                                       {column.format(value)}
                                       {/* {column.format && typeof value === "number" ? column.format(value) : value} */}
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
               rowsPerPageOptions={[5, 10, 25, 100]}
               component="div"
               count={rows.length}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={handleChangePage}
               onRowsPerPageChange={handleChangeRowsPerPage}
            />
         </Paper>
      </Box>
   );
}
