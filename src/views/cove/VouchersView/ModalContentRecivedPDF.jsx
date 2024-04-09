import Slide from "@mui/material/Slide";

import { forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { Canvas, Image, Text, View } from "@react-pdf/renderer";
import { ModalPDF, stylesPDF } from "../../../components/DocumentPDF";
import { useVoucherContext } from "../../../context/VoucherContext";
import { useVoucherDetailContext } from "../../../context/VoucherDetailContext";
// import imgStamp from "../../../assets/images/SELLO-Control-Vehicular.png";
import GPLogo from "../../../assets/images/logo-gpd.png";
import GPEscudo from "../../../assets/images/escudo-gpd.png";
import { formatDatetime } from "../../../utils/Formats";
import { margin } from "@mui/system";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalContentRecivedPDF = ({ open, setOpen, formTitle = "titulo" }) => {
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
         viewed_at: null
      }
   });

   useEffect(() => {
      // console.log("estoy en el modal", voucher);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el ModalContentRecivedPDF-> useLayoutEffect", voucher);
      formData.voucher.folio = voucher.id;
      formData.voucher.internal_folio = voucher.internal_folio;
      formData.voucher.date = voucher.created_at;
      formData.voucher.requesterWorkstation = voucher.workstation;
      formData.voucher.requesterFirm = voucher.img_firm ? `${import.meta.env.VITE_HOST}/${voucher.img_firm}` : null;
      formData.voucher.requesterName = voucher.requested_role_id === 7 ? formData.directorFrom : voucher.requested_fullname;
      formData.voucher.requesterStamp = voucher.img_stamp ? `${import.meta.env.VITE_HOST}/${voucher.img_stamp}` : null;
      formData.voucher.viewed_at = voucher.viewed_at;

      // console.log("estoy en el useLayoutEffect final", formData);
      // console.log("estoy en el useLayoutEffect final", voucherDetails);
   }, [voucher]);

   return (
      <ModalPDF open={open} setOpen={setOpen} formTitle={"RECIBO DE VALES"} watermark={"Control Vehícular"} formData={formData} isOfficialDoc={false}>
         <View style={[stylesPDF.table, { height: 2000 }]}>
            {/* ENCABEZADO */}
            <View style={[stylesPDF.row, stylesPDF.dobleLine]}>
               <View style={stylesPDF.column}>
                  <View style={[stylesPDF.row]}>
                     <Image style={[stylesPDF.imageLogo, { marginRight: 10 }]} src={GPEscudo}></Image>
                     <Image style={stylesPDF.imageLogo} src={GPLogo}></Image>
                  </View>
               </View>
               <View style={[stylesPDF.column, stylesPDF.textCenter, { width: "78%" }]}>
                  <Text style={[stylesPDF.bolder, { verticalAlign: "sub" }]}>
                     FORMATO DE RECEPCIÓN PARA VALES DE COMBUSTIBLE A DIRECCIONES DEL AYUNTAMIENTO DE GÓMEZ PALACIO 2022-2025
                  </Text>
               </View>
            </View>
            {/* SECCION 1 */}
            <View style={[stylesPDF.row, { marginTop: 20, marginHorizontal: 20 }]}>
               {/* DERECHA */}
               <View style={[stylesPDF.row, { width: "70%", marginRight: 10 }]}>
                  <View style={[stylesPDF.column, { marginRight: 5 }]}>
                     <Text style={[stylesPDF.bolder, stylesPDF.right, { verticalAlign: "sub" }]}>DEPENDENCIA</Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right, { verticalAlign: "sub" }]}>CANTIDAD</Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right, { marginVertical: 2 }]}> </Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right, { verticalAlign: "sub" }]}>NO. FOLIOS</Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right, { verticalAlign: "sub" }]}>PROVEEDOR</Text>
                  </View>
                  <View style={[stylesPDF.column, { marginRight: 15 }]}>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub", width: "600%" }]}>
                        {voucher.requested_department.toUpperCase()}
                     </Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub" }]}>{voucher.approved_amount}</Text>
                     <Text style={[stylesPDF.bolder]}>VALES</Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub", width: "600%" }]}>{voucher.foliated_vouchers}</Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub", width: "600%" }]}>
                        {voucher.letter_folio != null && voucher.letter_folio == "S" ? "SIMSA" : "CARGO GAS"}
                     </Text>
                  </View>
                  <View style={[stylesPDF.column, { marginRight: 15 }]}>
                     <Text style={[stylesPDF.regular]}> </Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub" }]}> </Text>
                     <Text style={[stylesPDF.bolder]}>LITROS</Text>
                  </View>
                  <View style={[stylesPDF.column, { marginRight: 15 }]}>
                     <Text style={[stylesPDF.regular]}> </Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub" }]}> </Text>
                     <Text style={[stylesPDF.bolder]}>COMBUSTIBLE</Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right]}> </Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right]}> </Text>
                  </View>
               </View>
               {/* IZQUEIRDA */}
               <View style={[stylesPDF.row, { width: "30%" }]}>
                  <View style={[stylesPDF.column, { marginRight: 5 }]}>
                     <Text style={[stylesPDF.bolder]}>FECHA</Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right]}> </Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right]}> </Text>
                  </View>
                  <View style={[stylesPDF.column]}>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom]}>{`${formatDatetime(formData.voucher.date, false)}`}</Text>
                     <Text style={[stylesPDF.regular]}> </Text>
                     <Text style={[stylesPDF.regular]}> </Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right]}> </Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right]}> </Text>
                  </View>
               </View>
            </View>
            {/* SECCION 2 */}
            <View style={[stylesPDF.row, { marginTop: 2, marginHorizontal: 20 }]}>
               {/* DERECHA */}
               <View style={[stylesPDF.row, { width: "70%", marginRight: 10 }]}>
                  <View style={[stylesPDF.column, { marginRight: 5 }]}>
                     <Text style={[stylesPDF.bolder, stylesPDF.right, { verticalAlign: "sub" }]}> </Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right, { verticalAlign: "sub" }]}>FIRMA</Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right, { verticalAlign: "sub" }]}>NOMBRE</Text>
                     <Text style={[stylesPDF.bolder, stylesPDF.right, { verticalAlign: "sub" }]}>OBSERVACIONES</Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub", width: "315%" }]}>
                        SOLICITUD EN OFICIO <Text style={[stylesPDF.bolder, { verticalAlign: "sub" }]}>{voucher.internal_folio}</Text>
                     </Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub", width: "315%" }]}> </Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub", width: "315%" }]}> </Text>
                  </View>
                  <View style={[stylesPDF.column, { marginRight: 15 }]}>
                     <Text style={[stylesPDF.regular, { verticalAlign: "sub" }]}> </Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub", width: 200 }]}> </Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub", width: 200 }]}> </Text>
                     <Text style={[stylesPDF.regular, stylesPDF.borderBottom, { verticalAlign: "sub", width: 200 }]}> </Text>
                  </View>
               </View>
               {/* IZQUIERDA */}
               <View style={[stylesPDF.row, { width: "30%" }]}>
                  <View style={[stylesPDF.column, { marginRight: 5 }]}>
                     <Text style={[stylesPDF.bolder]}>SELLO DE RECIBIDO</Text>
                     <View style={stylesPDF.containerStamp}>
                        <Image style={stylesPDF.stampInContainer} src={formData.voucher.requesterStamp}></Image>
                     </View>
                  </View>
               </View>
            </View>
         </View>
      </ModalPDF>
   );
};

export default ModalContentRecivedPDF;
