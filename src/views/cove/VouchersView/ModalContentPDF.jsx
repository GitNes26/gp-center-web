import Slide from "@mui/material/Slide";

import { forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { Text, View } from "@react-pdf/renderer";
import { ModalPDF, stylesPDF } from "../../../components/DocumentPDF";
import { useVoucherContext } from "../../../context/VoucherContext";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalContentPDF = ({ open, setOpen, formTitle = "titulo" }) => {
   const { auth } = useAuthContext();
   const { voucher } = useVoucherContext();
   const [formData, setFormData] = useState({
      folio: "",
      date: "--/--/----",
      directorFrom: "C. ING. RODRIGO DE LA TORRE VALLE",
      departmentFrom: "OFICIAL MAYOR",
      directorTo: "LIC. MAURICIO GUERRERO FELIX",
      departmentTo: " JEFE DE DEPARTAMENTO DE CONTROL VEHICULAR",
      workstationFirm: "JEFE DE DEPARTAMENTO DE SERVICIOS GENERALES",
      imgFirm: null,
      directorFirm: "C. FERNANDO ANTONIO LAVIN GONZALEZ"
   });

   useEffect(() => {
      console.log("estoy en el modal", voucher);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", drivers);
      formData.folio = voucher.id;
      formData.date = voucher.created_at;
   }, [voucher]);

   return (
      <ModalPDF open={open} setOpen={setOpen} formTitle={"SOLICITUD DE VALES"} watermark={"Control Vehícular"} formData={formData}>
         <Text style={stylesPDF.p}>
            {voucher.activity ??
               "En virtud del desempeño de las actividades dentro de este Departamento de Servicios Generales, se realizan diferentes diligencias relativas a visitar a todos los centros foráneos para la supervisión del personal, así como ir constantemente a la bodega general de Tepepan; Las cuales son efectuadas en vehículos particulares debido a que no se cuenta con suficientes vehículos oficiales, motivo por el cual se tiene justificado solicitar vales semanales de gasolina, para los siguientes vehículos."}
         </Text>
         <View style={[stylesPDF.table, stylesPDF.center]}>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>CANTIDAD</Text>
               <Text style={stylesPDF.cell}>{voucher.approved_amount ?? "-"}</Text>
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>VALES</Text>
               <Text style={stylesPDF.cell}>{voucher.foliated_vouchers ?? "-"}</Text>
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>VEHÍCULO</Text>
               <Text style={stylesPDF.cell}>{voucher.vehicle}</Text>
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>PALCAS</Text>
               <Text style={stylesPDF.cell}>{voucher.vehicle_plates}</Text>
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>EMPLEADO</Text>
               <Text style={stylesPDF.cell}>{voucher.requested_fullname}</Text>
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}># NÓMINA</Text>
               <Text style={stylesPDF.cell}>{voucher.payroll_number}</Text>
            </View>
         </View>

         <Text style={stylesPDF.p}>Sin más por el momento me despido de usted quedando a sus órdenes para cualquier duda o aclaración.</Text>
      </ModalPDF>
   );
};

export default ModalContentPDF;
