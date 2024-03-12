import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Typography from "@mui/material/Typography";
import { forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { FormControlLabel, IconButton, Switch, TextField, Toolbar, Tooltip } from "@mui/material";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { formatDatetimeToSQL } from "../../../utils/Formats";
import { gpcDark, gpcLight, useGlobalContext } from "../../../context/GlobalContext";
import { useVoucherContext } from "../../../context/VoucherContext";
import { useAuthContext } from "../../../context/AuthContext";
import { PDFViewer, Text, View } from "@react-pdf/renderer";
import { ModalFormatPDF, RequestPDF, stylesPDF } from "../../../components/RequestPDF";
import { IconWindowMaximize, IconWindowMinimize, IconX } from "@tabler/icons";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalContentPDF = ({ open, setOpen, formTitle = "titulo" }) => {
   const { auth } = useAuthContext();
   const [formData, setFormDAta] = useState({
      folioInt: "",
      date: "--/--/----",
      directorFrom: "C. ING. RODRIGO DE LA TORRE VALLE",
      departmentFrom: "OFICIAL MAYOR",
      directorTo: "LIC. MAURICIO GUERRERO FELIX",
      departmentTo: " JEFE DE DEPARTAMENTO DE CONTROL VEHICULAR",
      workstationFirm: "JEFE DE DEPARTAMENTO DE SERVICIOS GENERALES",
      // imgFirm: firmademo,
      directorFirm: "C. FERNANDO ANTONIO LAVIN GONZALEZ"
   });

   useEffect(() => {
      // console.log("estoy en el modal", voucher);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", drivers);
   }, []);

   return (
      <ModalFormatPDF open={open} setOpen={setOpen} formTitle={"ALGUN TITULO"} formData={formData}>
         <Text style={stylesPDF.p}>
            En virtud del desempeño de las actividades dentro de este Departamento de Servicios Generales, se realizan diferentes diligencias relativas a visitar a
            todos los centros foráneos para la supervisión del personal, así como ir constantemente a la bodega general de Tepepan; Las cuales son efectuadas en
            vehículos particulares debido a que no se cuenta con suficientes vehículos oficiales, motivo por el cual se tiene justificado solicitar vales semanales de
            gasolina, para los siguientes vehículos.
         </Text>
         <View style={[stylesPDF.table, stylesPDF.center]}>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>VEHÍCULO</Text>
               <Text style={stylesPDF.cell}>FORD - FIESTA 2022</Text>
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>PALCAS</Text>
               <Text style={stylesPDF.cell}>FRS-05-00</Text>
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>EMPLEADO</Text>
               <Text style={stylesPDF.cell}>TRABAJADOR 1</Text>
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}># NÓMINA</Text>
               <Text style={stylesPDF.cell}>9999</Text>
            </View>
         </View>

         <Text style={stylesPDF.p}>Sin más por el momento me despido de usted quedando a sus órdenes para cualquier duda o aclaración.</Text>
      </ModalFormatPDF>
   );
};

export default ModalContentPDF;
