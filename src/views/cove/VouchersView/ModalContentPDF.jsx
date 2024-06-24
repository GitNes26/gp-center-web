import Slide from "@mui/material/Slide";

import { forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { Canvas, Image, Text, View } from "@react-pdf/renderer";
import { ModalPDF, stylesPDF } from "../../../components/DocumentPDF";
import { useVoucherContext } from "../../../context/VoucherContext";
import { useVoucherDetailContext } from "../../../context/VoucherDetailContext";
// import imgStamp from "../../../assets/images/SELLO-Control-Vehicular.png";
import GPLogo from "../../../assets/images/logo-gpd.png";
import { cutLinesPDF, formatDatetime } from "../../../utils/Formats";
const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalContentPDF = ({ open, setOpen, formTitle = "titulo" }) => {
   const { auth } = useAuthContext();
   const { voucher } = useVoucherContext();
   const { voucherDetails } = useVoucherDetailContext();
   const [formData, setFormData] = useState({
      directorFrom: "LIC. MAURICIO GUERRERO FELIX",
      departmentFrom: "JEFE DE DEPARTAMENTO DE CONTROL VEHICULAR",
      directorTo1: "C. ING. RODRIGO DE LA TORRE VALLE",
      departmentTo1: "OFICIAL MAYOR",
      directorTo2: "LIC. CARLOS GARCIA GONZALEZ",
      departmentTo2: "TESORERIA MUNICIPAL",
      imgStamp: `${import.meta.env.VITE_HOST}/${"GPCenter/vouchersSettings/SELLO-Control-Vehicular-2022-2025.png"}`,
      imgDateStamp: `${import.meta.env.VITE_HOST}/${"GPCenter/vouchersSettings/SELLO-Control-Vehicular-Recibido-2022-2025.png"}`,
      voucher: {
         folio: "",
         internal_folio: "",
         date: "--/--/----",
         requesterWorkstation: "",
         requesterFirm: null,
         requesterName: "",
         requesterStamp: null,
         vobo_at: null
      }
   });
   const [rows, setRows] = useState([]);
   const [brekPage, setBreakPage] = useState(false);
   const [table, setTable] = useState();

   useEffect(() => {
      setRows(cutLinesPDF(voucher.activity));
      // console.log("estoy en el modal", voucher);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", voucher);
      formData.voucher.folio = voucher.id;
      formData.voucher.internal_folio = voucher.internal_folio;
      formData.voucher.date = voucher.created_at;
      formData.voucher.requesterWorkstation = voucher.workstation;
      formData.voucher.requesterFirm = voucher.img_firm ? `${import.meta.env.VITE_HOST}/${voucher.img_firm}` : null;
      formData.voucher.requesterName = voucher.requested_role_id === 7 ? formData.directorFrom : voucher.requested_fullname;
      formData.voucher.requesterStamp = voucher.img_stamp ? `${import.meta.env.VITE_HOST}/${voucher.img_stamp}` : null;
      formData.voucher.vobo_at = voucher.vobo_at;
      formData.table = (
         <View style={[stylesPDF.table, stylesPDF.center]} wrap={false}>
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
      );
      // console.log("estoy en el useLayoutEffect final", formData);
      // console.log("estoy en el useLayoutEffect final", voucherDetails);
   }, [voucher]);

   return (
      <ModalPDF open={open} setOpen={setOpen} formTitle={"OFICIO DE VALES"} watermark={"Control Vehícular"} formData={formData}>
         <Text style={stylesPDF.p}>{voucher.activity}</Text>
         {/* <Image style={stylesPDF.sello} src={formData.imgStamp} /> */}

         {/* {rows.map((row,i) =>{ */}
         {/* <Text style={stylesPDF.p}> */}
         {/* {rows.map((row, i) => row + "\n")} */}
         {/* </Text> */}
         {/* })} */}

         {/* <Text style={stylesPDF.p}>Sin más por el momento me despido de usted quedando a sus órdenes KCpara cualquier duda o aclaración.</Text> */}
      </ModalPDF>
   );
};

export default ModalContentPDF;
