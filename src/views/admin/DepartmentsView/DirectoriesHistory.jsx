import { Avatar, Box } from "@mui/material";
import { formatDatetime } from "../../../utils/Formats";
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TableSimpleComponent from "../../../components/TableSimpleComponent";
import ImageZoomComponent from "../../../components/ImageZoomComponent";
import sinFirma from "../../../assets/images/sinFirma.png";
import logo from "../../../assets/images/logo.png";

const DirectoriesHistory = ({ rows }) => {
   const platesCurrent = (active) => (active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />);

   const columns = [
      {
         id: "avatar",
         label: "Foto",
         minWidth: 100,
         format: (value) => <ImageZoomComponent imgUrl={value !== null ? `${import.meta.env.VITE_HOST}/${value}` : logo} width="25px" />
      },
      {
         id: "img_firm",
         label: "Firma",
         minWidth: 100,
         format: (value) => <ImageZoomComponent imgUrl={value !== null ? `${import.meta.env.VITE_HOST}/${value}` : sinFirma} width="25px" />
      },
      { id: "payroll_number", label: "No. Nómina", minWidth: 100, align: "center", format: (value) => <b>{value}</b> },
      { id: "full_name", label: "Director", minWidth: 100, align: "center", format: (value) => value.toUpperCase() },
      { id: "created_at", label: "Fecha de Registro", minWidth: 100, align: "center", format: (value) => formatDatetime(value, false) },
      { id: "relation_active", label: "Vigente", minWidth: 50, align: "center", format: (value) => platesCurrent(value) }
      // {
      //    id: "density",
      //    label: "Density",
      //    minWidth: 170,
      //    align: "right",
      //    format: (value) => value.toFixed(2)
      // }
   ];
   function createData(id, plates, initial_date, due_date, expired) {
      return { id, plates, initial_date, due_date, expired };
   }
   // const rows = [{ id: 1, avatar: null, img_firm: null, payroll_number: 191817, full_name: "Director numero uno", created_at: "2020-01-05", active: true }];

   useEffect(() => {
      try {
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, []);

   return <TableSimpleComponent title={"HISTORIAL DE DIRECTORES ASIGNADOS"} columns={columns} rows={rows} initRowsPerPage={5} />;
};
export default DirectoriesHistory;
