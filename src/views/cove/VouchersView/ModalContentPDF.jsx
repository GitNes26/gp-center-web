import Slide from "@mui/material/Slide";

import { forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { Text, View } from "@react-pdf/renderer";
import { ModalPDF, stylesPDF } from "../../../components/DocumentPDF";
import { useVoucherContext } from "../../../context/VoucherContext";
import { useVoucherDetailContext } from "../../../context/VoucherDetailContext";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalContentPDF = ({ open, setOpen, formTitle = "titulo" }) => {
   const { auth } = useAuthContext();
   const { voucher } = useVoucherContext();
   const { voucherDetails } = useVoucherDetailContext();
   const [formData, setFormData] = useState({
      folio: "",
      internal_folio: "",
      date: "--/--/----",
      directorFrom: "LIC. MAURICIO GUERRERO FELIX",
      departmentFrom: "JEFE DE DEPARTAMENTO DE CONTROL VEHICULAR",
      directorTo: "C. ING. RODRIGO DE LA TORRE VALLE",
      departmentTo: "OFICIAL MAYOR",
      workstationFirm: "JEFE DE DEPARTAMENTO DE SERVICIOS GENERALES",
      imgFirm: null,
      directorFirm: "C. FERNANDO ANTONIO LAVIN GONZALEZ"
   });

   useEffect(() => {
      // console.log("estoy en el modal", voucher);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", voucher);
      formData.folio = voucher.id;
      formData.internal_folio = voucher.internal_folio;
      formData.date = voucher.created_at;
      formData.workstationFirm = voucher.workstation;
      formData.imgFirm = voucher.img_firm ? `${import.meta.env.VITE_HOST}/${voucher.img_firm}` : null;
      formData.directorFirm = voucher.requested_role_id === 7 ? "LIC. MAURICIO GUERRERO FELIX" : voucher.requested_fullname;
      // console.log("estoy en el useLayoutEffect final", formData);
      // console.log("estoy en el useLayoutEffect final", voucherDetails);
   }, [voucher]);

   return (
      <ModalPDF open={open} setOpen={setOpen} formTitle={"OFICIO DE VALES"} watermark={"Control Vehícular"} formData={formData}>
         <Text style={stylesPDF.p}>{voucher.activity}</Text>
         <View style={[stylesPDF.table, stylesPDF.center]}>
            {/* <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>CANTIDAD</Text>
               {voucherDetails.map((vd) => (
                  <Text style={stylesPDF.cell}>{vd.requested_amount ?? "-"}</Text>
               ))}
            </View> */}
            {/* <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>VALES</Text>
               <Text style={stylesPDF.cell}>{voucher.foliated_vouchers ? `${voucher.letter_folio} ${voucher.foliated_vouchers}` : "-"}</Text>
            </View> */}
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>VEHÍCULO</Text>
               {voucherDetails.map((vd) => (
                  <Text style={stylesPDF.cell}>{vd.vehicle}</Text>
               ))}
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>PLACAS</Text>
               {voucherDetails.map((vd) => (
                  <Text style={stylesPDF.cell}>{vd.vehicle_plates}</Text>
               ))}
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}>EMPLEADO</Text>
               {voucherDetails.map((vd) => (
                  <Text style={stylesPDF.cell}>{vd.creditor_fullname}</Text>
               ))}
            </View>
            <View style={stylesPDF.column}>
               <Text style={[stylesPDF.cell, stylesPDF.bolder]}># NÓMINA</Text>
               {voucherDetails.map((vd) => (
                  <Text style={stylesPDF.cell}>{vd.payroll_number}</Text>
               ))}
            </View>
         </View>

         <Text style={stylesPDF.p}>Sin más por el momento me despido de usted quedando a sus órdenes para cualquier duda o aclaración.</Text>
      </ModalPDF>
   );
};

export default ModalContentPDF;
