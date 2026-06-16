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
import { useGlobalContext } from "../../../context/GlobalContext";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalContentPDF = ({ open, setOpen, formTitle = "titulo", arrayData = [], setArrayData }) => {
   const { auth } = useAuthContext();
   const { setLoadingAction } = useGlobalContext();
   const { voucher, vouchers } = useVoucherContext();
   const { getVouchersDetails, voucherDetails } = useVoucherDetailContext();
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
         vobo_at: null,
         activity: null,
         table: null
      }
   });

   const init = async () => {
      // console.log("🚀 ~ init ~ arrayData:", arrayData);
      // setLoadingAction(true);
      if (arrayData.length > 1) {
         // console.log("muchos arrays");
         // const arrayFD = [];
         // setArrayData(arrayFD);
         // const axiosVouchersDetails = await getVouchersDetails();
         // const vouchersDetails = axiosVouchersDetails.result.voucherDetails;
         // console.log("🚀 ~ init ~ vouchersDetails:", vouchersDetails);
         // await arrayData.map((voucher) => {
         //    const dataVoucher = formData;
         //    console.log("🚀 ~ arrayData.map ~ voucher.id:", voucher);
         //    const voucherDetails = vouchersDetails.filter((item) => item.voucher_id == voucher.id);
         //    console.log("🚀 ~ arrayData.map ~ voucherDetails:", voucherDetails);
         //    dataVoucher.voucher.folio = voucher.id;
         //    dataVoucher.voucher.internal_folio = voucher.internal_folio;
         //    dataVoucher.voucher.date = voucher.created_at;
         //    dataVoucher.voucher.requesterWorkstation = voucher.workstation;
         //    dataVoucher.voucher.requesterFirm = voucher.img_firm ? `${import.meta.env.VITE_HOST}/${voucher.img_firm}` : null;
         //    dataVoucher.voucher.requesterName = voucher.requested_role_id === 7 ? dataVoucher.directorFrom : voucher.requested_fullname;
         //    dataVoucher.voucher.requesterStamp = voucher.img_stamp ? `${import.meta.env.VITE_HOST}/${voucher.img_stamp}` : null;
         //    dataVoucher.voucher.vobo_at = voucher.vobo_at;
         //    dataVoucher.voucher.activity = <Text style={stylesPDF.p}>{voucher.activity}</Text>;
         //    dataVoucher.voucher.table = (
         //       <View style={[stylesPDF.table, stylesPDF.center]} wrap={false}>
         //          <View style={stylesPDF.column}>
         //             <Text style={[stylesPDF.cell, stylesPDF.bolder]}>VEHÍCULO</Text>
         //             {voucherDetails.map((vd) => (
         //                <Text style={stylesPDF.cell}>{vd.vehicle}</Text>
         //             ))}
         //          </View>
         //          <View style={stylesPDF.column}>
         //             <Text style={[stylesPDF.cell, stylesPDF.bolder]}>PLACAS</Text>
         //             {voucherDetails.map((vd) => (
         //                <Text style={stylesPDF.cell}>{vd.vehicle_plates}</Text>
         //             ))}
         //          </View>
         //          <View style={stylesPDF.column}>
         //             <Text style={[stylesPDF.cell, stylesPDF.bolder]}>EMPLEADO</Text>
         //             {voucherDetails.map((vd) => (
         //                <Text style={stylesPDF.cell}>{vd.creditor_fullname}</Text>
         //             ))}
         //          </View>
         //          <View style={stylesPDF.column}>
         //             <Text style={[stylesPDF.cell, stylesPDF.bolder]}># NÓMINA</Text>
         //             {voucherDetails.map((vd) => (
         //                <Text style={stylesPDF.cell}>{vd.payroll_number}</Text>
         //             ))}
         //          </View>
         //       </View>
         //    );
         //    console.log("🚀 ~ awaitdata.map ~ dataVoucher:", dataVoucher);
         //    arrayFD.push(dataVoucher);
         // });
         // setArrayData(arrayFD);
      } else {
         // console.log("solo soy un formData");
         formData.voucher.folio = voucher.id;
         formData.voucher.internal_folio = voucher.internal_folio;
         formData.voucher.date = voucher.created_at;
         formData.voucher.requesterWorkstation = voucher.workstation;
         formData.voucher.requesterFirm = voucher.img_firm ? `${import.meta.env.VITE_HOST}/${voucher.img_firm}` : null;
         formData.voucher.requesterName = voucher.requested_role_id === 7 ? formData.directorFrom : voucher.requested_fullname;
         formData.voucher.requesterStamp = voucher.img_stamp ? `${import.meta.env.VITE_HOST}/${voucher.img_stamp}` : null;
         formData.voucher.vobo_at = voucher.vobo_at;
         formData.voucher.table = voucherDetails;
         //          formData.voucher.table = (
         //             <View style={[stylesPDF.table, stylesPDF.center]} wrap={false}>
         //                {/* <View style={stylesPDF.column}>
         // <Text style={[stylesPDF.cell, stylesPDF.bolder]}>CANTIDAD</Text>
         // {voucherDetails.map((vd) => (
         //    <Text style={stylesPDF.cell}>{vd.requested_amount ?? "-"}</Text>
         //    ))}
         //    </View> */}
         //                {/* <View style={stylesPDF.column}>
         // <Text style={[stylesPDF.cell, stylesPDF.bolder]}>VALES</Text>
         // <Text style={stylesPDF.cell}>{voucher.foliated_vouchers ? `${voucher.letter_folio} ${voucher.foliated_vouchers}` : "-"}</Text>
         // </View> */}
         //                <View style={stylesPDF.column}>
         //                   <Text style={[stylesPDF.cell, stylesPDF.bolder]}>VEHÍCULO</Text>
         //                   {voucherDetails.map((vd) => (
         //                      <Text style={stylesPDF.cell}>{vd.vehicle}</Text>
         //                   ))}
         //                </View>
         //                <View style={stylesPDF.column}>
         //                   <Text style={[stylesPDF.cell, stylesPDF.bolder]}>PLACAS</Text>
         //                   {voucherDetails.map((vd) => (
         //                      <Text style={stylesPDF.cell}>{vd.vehicle_plates}</Text>
         //                   ))}
         //                </View>
         //                <View style={stylesPDF.column}>
         //                   <Text style={[stylesPDF.cell, stylesPDF.bolder]}>EMPLEADO</Text>
         //                   {voucherDetails.map((vd) => (
         //                      <Text style={stylesPDF.cell}>{vd.creditor_fullname}</Text>
         //                   ))}
         //                </View>
         //                <View style={stylesPDF.column}>
         //                   <Text style={[stylesPDF.cell, stylesPDF.bolder]}># NÓMINA</Text>
         //                   {voucherDetails.map((vd) => (
         //                      <Text style={stylesPDF.cell}>{vd.payroll_number}</Text>
         //                   ))}
         //                </View>
         //             </View>
         //          );
      }
      // console.log("estoy en el useLayoutEffect final", formData);
      setLoadingAction(false);
   };

   useEffect(() => {
      // console.log("estoy en el modal", voucher);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", voucher);
      // console.log("estoy en el useLayoutEffect final", voucherDetails);
      init();
   }, [voucher, arrayData]);

   return (
      <ModalPDF
         open={open}
         setOpen={setOpen}
         formTitle={"OFICIO DE VALES"}
         fileName={`OFICIO DE VALES #${voucher?.id} ${voucher.requested_department}.pdf`}
         watermark={"Control Vehícular"}
         arrayFormData={arrayData.length > 1 ? arrayData : [formData]}
      >
         <Text style={stylesPDF.p}>{voucher.activity}</Text>

         {/* <Text style={stylesPDF.p}>Sin más por el momento me despido de usted quedando a sus órdenes KCpara cualquier duda o aclaración.</Text> */}
      </ModalPDF>
   );
};

export default ModalContentPDF;
