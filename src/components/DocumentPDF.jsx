/**
 * PARA INSTALAR
 * npm i @react-pdf/renderer --save --legacy-peer-deps
 *
 * PASSAR ARCHIVOS
 * import RobotoBold from "../assets/fonts/Roboto-Bold.ttf";
 * import RobotoRegular from "../assets/fonts/Roboto-Regular.ttf";
 * import RobotoItalic from "../assets/fonts/Roboto-Italic.ttf";
 * import ProtestRiot from "../assets/fonts/ProtestRiot-Regular.ttf";
 *
 * SI NO SE CUENTA CON LOS SIGUEINTES...
 * INSTALAR
 * @tabler/icons
 * sweetalert2
 * sweetalert2-react-content
 *
 * PEDIR
 * import backgroundImage from "../assets/images/Oficio.jpg";
 * import sinFirma from "../assets/images/sinFirma.png";
 */

// // import logo from '../../assets/images/logo-gpd.png';
import { Document, Font, Image, PDFDownloadLink, Page, StyleSheet, Text, View, usePDF } from "@react-pdf/renderer";
// import backgroundImage from "../assets/images/Oficio.jpg";
// import firmademo from "../assets/images/FirmaDemo.png";
// import sinFirma from "../assets/images/sinFirma.png";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Typography from "@mui/material/Typography";
import { cloneElement, forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, IconButton, Toolbar, Tooltip } from "@mui/material";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { PDFViewer } from "@react-pdf/renderer";
import { IconDownload, IconWindowMaximize, IconWindowMinimize, IconX } from "@tabler/icons";
import { useAuthContext } from "../context/AuthContext";
import { colorPrimaryMain, colorSecondaryDark, colorSecondaryLight, gpcDark, gpcLight, useGlobalContext } from "../context/GlobalContext";
// import { formatDatetime } from "../utils/Formats";

// import RobotoBold from "../assets/fonts/Roboto-Bold.ttf";
// import RobotoRegular from "../assets/fonts/Roboto-Regular.ttf";
// import RobotoItalic from "../assets/fonts/Roboto-Italic.ttf";
// import ProtestRiot from "../assets/fonts/ProtestRiot-Regular.ttf";
// import BarlowRegular from "../assets/fonts/Barlow-Regular.ttf";
// import BarlowMedium from "../assets/fonts/Barlow-Medium.ttf";
// import BarlowBold from "../assets/fonts/Barlow-Bold.ttf";
// import Toast from "../utils/Toast";

// //#region FUENTES
// Font.register({
//    family: "Roboto-Bold",
//    src: RobotoBold
// });

// Font.register({
//    family: "Roboto-Regular",
//    src: RobotoRegular
// });
// Font.register({
//    family: "Roboto-Italic",
//    src: RobotoItalic
// });

// Font.register({
//    family: "Protest-Riot",
//    src: ProtestRiot
// });

// Font.register({
//    family: "Barlow-Regular",
//    src: BarlowRegular
// });

// Font.register({
//    family: "Barlow-Medium",
//    src: BarlowMedium
// });

// Font.register({
//    family: "Barlow-Bold",
//    src: BarlowBold
// });

// //#endregion

// //#region ESTILOS
// export const stylesPDF = StyleSheet.create({
//    body: {
//       paddingTop: 35,
//       paddingBottom: 65,
//       paddingHorizontal: 35
//    },
//    page: {
//       // flexDirection: "row",
//       paddingHorizontal: 35,
//       paddingTop: 100, //125,
//       paddingBottom: 160,
//       position: "absolute"
//       // left: 30,
//       // height: 540,
//       // width: "90%"
//       // backgroundColor: "#E4E4E4"
//    },
//    section: {
//       margin: 10
//    },
//    imageLogo: {
//       height: "1.30cm",
//       width: "auto",
//       objectFit: "contain",
//       marginVertical: 1
//    },
//    image: {
//       width: "30%",
//       marginVertical: 15,
//       marginHorizontal: 180
//    },
//    header: {
//       fontSize: 12,
//       marginTop: 10,
//       textAlign: "center",
//       color: "grey"
//    },
//    pageNumber: {
//       position: "absolute",
//       fontSize: 12,
//       bottom: 10,
//       left: 0,
//       right: 0,
//       textAlign: "center",
//       color: "grey"
//    },
//    subtitle: {
//       fontSize: 18,
//       margin: 12,
//       fontFamily: "Roboto-Bold"
//    },
//    title: {
//       fontSize: 18,
//       textAlign: "center",
//       fontFamily: "Roboto-Bold"
//    },
//    author: {
//       fontSize: 12,
//       textAlign: "center",
//       marginBottom: 20
//    },
//    division: {
//       fontSize: 15,
//       textAlign: "center",
//       fontFamily: "Roboto-Bold",
//       textDecoration: "underline"
//    },
//    apartado: {
//       fontFamily: "Roboto-Bold",
//       fontSize: 15
//    },
//    text: {
//       fontSize: 10,
//       color: "#000"
//    },
//    pageBody: {
//       position: "relative"
//    },
//    bgImage: {
//       width: "100%",
//       height: "100%"
//    },
//    viewBgImage: {
//       position: "absolute",
//       top: 0,
//       left: 25,
//       height: "148%",
//       width: "100%",
//       opacity: "0.75"
//    },
//    viewContainer: {
//       position: "absolute",
//       top: 125,
//       left: 30,
//       // height: 540,
//       width: "90%"
//    },

//    folioDate: {
//       fontFamily: "Roboto-Bold",
//       fontSize: 12,
//       textAlign: "right"
//    },
//    dataTitlesLeft: {
//       fontSize: 12,
//       fontFamily: "Roboto-Bold",
//       fontWeight: "bold",
//       textAlign: "left",
//       marginBottom: 10
//    },
//    dataTitlesRigth: {
//       fontSize: 12,
//       fontFamily: "Roboto-Bold",
//       fontWeight: "bold",
//       textAlign: "right",
//       marginBottom: 10
//    },
//    messageBody: {
//       fontFamily: "Roboto-Regular",
//       fontSize: 11,
//       // height: 320,
//       // maxHeight: 320,
//       textAlign: "justify",
//       lineHeight: "1.5px"
//       // border: "1px solid black"
//       // backgroundColor: "red"
//       // marginBottom: 1
//       // paddingHorizontal: 35
//    },
//    bolder: { fontFamily: "Roboto-Bold" },
//    regular: { fontFamily: "Roboto-Regular" },
//    italic: { fontFamily: "Roboto-Italic" },
//    letterSpace: {
//       letterSpacing: 5
//    },
//    p: {
//       marginVertical: 10
//       // fontSize:16
//    },
//    right: { textAlign: "right" },
//    center: { marginHorizontal: "auto" },
//    centerAcross: { marginVertical: "auto" },
//    textCenter: {
//       textAlign: "center"
//    },
//    row: {
//       display: "flex",
//       flexDirection: "row"
//    },
//    column: {
//       flexDirection: "column"
//    },
//    borderBottom: {
//       borderBottom: "1px solid black"
//    },
//    dobleLine: {
//       borderBottom: "1px double black"
//    },
//    table: {
//       // backgroundColor: "green",
//       border: "2px solid black",
//       flexDirection: "row",
//       flexWrap: "wrap",
//       marginVertical: 5,
//       padding: 0
//       // textAlign: "center"
//    },
//    cell: {
//       border: "1px solid black",
//       flexWrap: "wrap",
//       fontSize: 10,
//       textAlign: "center",
//       justifyContent: "center",
//       padding: 5,
//       margin: "-.5 0 0 -0.5"
//    },
//    firmContainer: {
//       fontFamily: "Roboto-Bold",
//       textAlign: "center",
//       fontSize: 14,
//       maxHeight: 100,
//       fontWeight: "heavy",
//       position: "absolute",
//       justifyContent: "center",
//       width: "100%",
//       marginHorizontal: 35,
//       bottom: 95
//       // paddingVertical: 0,
//       // marginVertical: 0
//       // backgroundColor: "blue"
//    },
//    firma: {
//       width: "200px",
//       left: "50%",
//       transform: "translateX(-100%)",
//       marginBottom: -10,
//       opacity: "1",
//       filter: "contrast(2.75)"
//    },
//    containerStamp: {
//       border: "2px solid black",
//       width: "4.25cm",
//       height: "4.25cm"
//    },
//    stampInContainer: {
//       width: "4cm",
//       height: "4cm"
//    },
//    stamp: {
//       position: "absolute",
//       width: "4cm",
//       height: "4cm",
//       top: "25%", //"87%",
//       left: "21%",
//       transform: "translateX(-100%)"
//       // backgroundColor: "yellow"
//       // marginBottom: -10
//    },
//    containerDateStamp: {
//       position: "absolute",
//       transform: "translateX(-100%) rotate(-5deg)",
//       top: "25%", //"65%",
//       left: "95%"
//       // backgroundColor: "green",
//    },
//    dateStamp: {
//       position: "absolute",
//       width: "4.5cm",
//       height: "3.7cm"
//       // backgroundColor: "red"
//       // marginBottom: -10
//    },
//    dateStampText: {
//       position: "absolute",
//       fontFamily: "Barlow-Medium",
//       textAlign: "center",
//       fontSize: 12,
//       color: "#47464E",
//       width: "2.9cm",
//       top: 50,
//       left: -28,
//       transform: "translateX(50%)"
//       // backgroundColor: "yellow"
//    },
//    upperCase: {
//       textTransform: "uppercase"
//    },
//    lowerCase: {
//       textTransform: "lowercase"
//    },
//    capitalizeCase: {
//       textTransform: "capitalize"
//    }

//    // textContent: {
//    //     textAlign: "justify",
//    //     lineHeight: 1.5,
//    // }
// });
// //#endregion ESTILOS

// const formDataInitial = {
//    directorFrom: "",
//    departmentFrom: "",
//    directorTo1: "",
//    departmentTo1: "",
//    directorTo2: "",
//    departmentTo2: "",
//    imgStamp: "",
//    imgDateStamp: "",
//    voucher: {
//       folio: "",
//       internal_folio: "",
//       date: null,
//       requesterWorkstation: "",
//       requesterFirm: sinFirma,
//       requesterName: "",
//       requesterStamp: null,
//       vobo_at: "",
//       activity: null,
//       table: null
//    }
// };

// // Componente que representa el documento OficioPDF
// export const DocumentPDF = ({ children, watermark = "Departamento Emisor", arrayFormData = [formDataInitial], isOfficialDoc = true, fileName }) => {
//    try {
//       const DocRef = useRef(null);
//       const DocPDF = (
//          <Document ref={DocRef}>
//             {arrayFormData.map((formData, i) => (
//                <Page size="LETTER" style={[stylesPDF.page]} wrap key={i}>
//                   {/* <View style={stylesPDF.pageBody}> */}
//                   <View style={stylesPDF.viewBgImage} fixed>
//                      <Text style={stylesPDF.header} fixed>
//                         ~ {watermark} ~
//                      </Text>
//                      {isOfficialDoc && <Image style={stylesPDF.bgImage} src={backgroundImage} />}
//                   </View>
//                   {isOfficialDoc ? (
//                      <>
//                         {/* <Image style={stylesPDF.stamp} src={formData.voucher.requesterStamp} />
//                   {formData.voucher.vobo_at != null && (
//                      <View style={stylesPDF.containerDateStamp}>
//                         <Image style={stylesPDF.dateStamp} src={formData.imgDateStamp} />
//                         <Text style={stylesPDF.dateStampText}>{formatDatetime(formData.voucher.vobo_at, false, "sello")}</Text>
//                      </View>
//                   )} */}
//                         <View style={stylesPDF.folioDate}>
//                            <Text>Folio: #{formData.voucher.folio}</Text>
//                            <Text>Folio Interno: {formData.voucher.internal_folio}</Text>
//                            <Text style={{ fontFamily: "Roboto-Regular" }}>
//                               Gómez Palacio, Dgo., {formData.voucher.date ? formatDatetime(formData.voucher.date, false, "lll") : "--/---/----"}
//                            </Text>
//                         </View>
//                         <View style={stylesPDF.dataTitlesLeft}>
//                            <Text style={stylesPDF.upperCase}>{formData.directorFrom}</Text>
//                            <Text style={stylesPDF.upperCase}>{formData.departmentFrom}</Text>
//                            <Text style={stylesPDF.letterSpace}>PRESENTE.- </Text>
//                         </View>
//                         {formData.directorTo2 != "" ? (
//                            <View style={stylesPDF.row}>
//                               <View style={stylesPDF.column}>
//                                  <View style={stylesPDF.dataTitlesLeft}>
//                                     <Text>CON ATENCIÓN A:</Text>
//                                     <Text style={stylesPDF.upperCase}>{formData.directorTo1}</Text>
//                                     <Text style={stylesPDF.upperCase}>{formData.departmentTo1}</Text>
//                                  </View>
//                               </View>
//                               <View style={[stylesPDF.column, { width: "100%" }]}>
//                                  <View style={stylesPDF.dataTitlesRigth}>
//                                     <Text> </Text>
//                                     <Text style={stylesPDF.upperCase}>{formData.directorTo2}</Text>
//                                     <Text style={stylesPDF.upperCase}>{formData.departmentTo2}</Text>
//                                  </View>
//                               </View>
//                            </View>
//                         ) : (
//                            <View style={stylesPDF.dataTitlesRigth}>
//                               <Text>CON ATENCIÓN A:</Text>
//                               <Text style={stylesPDF.upperCase}>{formData.directorTo1}</Text>
//                               <Text style={stylesPDF.upperCase}>{formData.departmentTo1}</Text>
//                            </View>
//                         )}
//                         {/* CUERPO DEL MENSAJE */}
//                         <View style={stylesPDF.messageBody} wrap>
//                            {arrayFormData.length > 1 ? formData.voucher.activity : children}
//                         </View>
//                         {formData.voucher.table}

//                         {/* CUERPO DEL MENSAJE */}
//                         <View style={stylesPDF.firmContainer} wrap={false}>
//                            <Image style={stylesPDF.stamp} src={formData.voucher.requesterStamp} />
//                            {formData.voucher.vobo_at != null && (
//                               <View style={stylesPDF.containerDateStamp}>
//                                  <Image style={stylesPDF.dateStamp} src={formData.imgDateStamp} />
//                                  <Text style={stylesPDF.dateStampText}>{formatDatetime(formData.voucher.vobo_at, false, "sello")}</Text>
//                               </View>
//                            )}
//                            <Text style={[stylesPDF.letterSpace, { fontSize: 10 }]}>ATENTAMENTE: </Text>
//                            <Text style={stylesPDF.upperCase}>{formData.voucher.requesterWorkstation}</Text>
//                            <Image style={[stylesPDF.firma]} src={formData.voucher.requesterFirm ?? formDataInitial.requesterFirm} />
//                            <Text style={{ paddingBottom: 4 }}>______________________________________</Text>
//                            <Text style={stylesPDF.upperCase}>{formData.voucher.requesterName} </Text>
//                         </View>
//                      </>
//                   ) : (
//                      <View style={stylesPDF.viewContainer}>
//                         {/* CUERPO DEL MENSAJE */}
//                         <View style={stylesPDF.messageBody}>{arrayFormData.length > 1 ? formData.voucher.activity : children}</View>
//                         {/* CUERPO DEL MENSAJE */}
//                      </View>
//                   )}

//                   <Text style={stylesPDF.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
//                   {/* </View> */}
//                </Page>
//             ))}
//          </Document>
//       );
//       // useLayoutEffect(() => {
//       //    console.log("🚀 ~ DocumentPDF ~ DocPDF:", DocPDF);
//       //    console.log("🚀 ~ DocumentPDF ~ DocRef:", DocRef);
//       // }, [DocRef]);
//       return DocPDF;
//       // return <ShowPDF DocPDF={DocPDF} />;
//    } catch (error) {
//       console.log("🚀 ~ DocumentPDF ~ error:", error);
//       Toast.Error(error);
//    }
// };

// const ShowPDF = ({ DocPDF }) => {
//    const [instance, updateInstance] = usePDF({ document: DocPDF });

//    // if (instance.loading) return <div>Loading ...</div>;

//    // if (instance.error) return <div>Something went wrong: {error}</div>;

//    return (
//       <a href={instance.url} download="test.pdf">
//          Download
//       </a>
//    );
// };

// import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import backgroundImage from "../assets/images/Oficio.jpg";
import selloRecibido from "../assets/images/SEELO-Control-Vehicular-Recibido.png";
import sinFirma from "../assets/images/sinFirma.png";
import { formatDatetime } from "../utils/Formats";

import BarlowRegular from "../assets/fonts/Barlow-Regular.ttf";
import BarlowMedium from "../assets/fonts/Barlow-Medium.ttf";
import BarlowBold from "../assets/fonts/Barlow-Bold.ttf";
import RobotoBold from "../assets/fonts/Roboto-Bold.ttf";
import RobotoRegular from "../assets/fonts/Roboto-Regular.ttf";
import RobotoItalic from "../assets/fonts/Roboto-Italic.ttf";

// ─── Registro de fuentes ──────────────────────────────────────────────────────
Font.register({ family: "Roboto-Bold", src: RobotoBold });
Font.register({ family: "Roboto-Regular", src: RobotoRegular });
Font.register({ family: "Roboto-Italic", src: RobotoItalic });
Font.register({ family: "Barlow-Regular", src: BarlowRegular });
Font.register({ family: "Barlow-Medium", src: BarlowMedium });
Font.register({ family: "Barlow-Bold", src: BarlowBold });

// ─── Paleta institucional ─────────────────────────────────────────────────────
const COLOR = {
   darkNavy: "#1E090F", //"#0D1F3C", // encabezados principales
   midBlue: "#37131C", //"#1A4080", // líneas y acentos
   lightBlue: "#B3314B", //"#E8EFF8", // fondo de celdas de cabecera de tabla
   tableRow: "#EBCDD425", //"#F4F7FB", // fondo de filas alternas
   borderGray: "#EBCDD4", // bordes de tabla
   bodyText: "#1A1A2E", // texto corrido
   mutedText: "#3D424A", //"#5A6378", // etiquetas y notas
   white: "#FFFFFF"
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
export const stylesPDF = StyleSheet.create({
   // ── Página ──
   page: {
      paddingHorizontal: 42,
      paddingTop: 100,
      paddingBottom: 170,
      position: "absolute"
   },

   imageLogo: {
      height: "1.30cm",
      width: "auto",
      objectFit: "contain",
      marginVertical: 1
   },

   // ── Fondo y watermark ──
   viewBgImage: {
      position: "absolute",
      top: 0,
      left: 25,
      height: "148%",
      width: "100%",
      opacity: 0.78
   },
   bgImage: { width: "100%", height: "100%" },
   watermarkText: {
      fontSize: 8,
      textAlign: "center",
      color: COLOR.mutedText,
      fontFamily: "Barlow-Regular",
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 4
   },

   // ── Folio / fecha ──
   folioBlock: {
      flexDirection: "column",
      alignItems: "flex-end",
      marginBottom: 10
   },
   folioLine: {
      fontFamily: "Barlow-Bold",
      fontSize: 9,
      color: COLOR.darkNavy,
      letterSpacing: 0.5
   },
   folioDate: {
      fontFamily: "Barlow-Regular",
      fontSize: 9,
      color: COLOR.mutedText,
      marginTop: 2
   },

   // ── Línea decorativa ──
   accentBar: {
      height: 2.5,
      backgroundColor: COLOR.midBlue,
      marginBottom: 10,
      borderRadius: 1
   },
   thinRule: {
      height: 0.6,
      backgroundColor: COLOR.borderGray,
      marginVertical: 8
   },

   // ── Destinatario / remitente ──
   headerBlock: {
      marginBottom: 10
   },
   sectionLabel: {
      fontFamily: "Barlow-Bold",
      fontSize: 7.5,
      color: COLOR.midBlue,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginBottom: 2
   },
   recipientName: {
      fontFamily: "Roboto-Bold",
      fontSize: 11,
      color: COLOR.darkNavy,
      textTransform: "uppercase"
   },
   recipientDept: {
      fontFamily: "Roboto-Regular",
      fontSize: 10,
      color: COLOR.bodyText,
      textTransform: "uppercase"
   },
   presenteTag: {
      fontFamily: "Barlow-Bold",
      fontSize: 10,
      color: COLOR.darkNavy,
      letterSpacing: 4,
      marginTop: -5,
      marginBottom: 2
   },

   // ── Fila CON ATENCIÓN A (dos columnas) ──
   row: { flexDirection: "row" },
   col: { flexDirection: "column" },
   halfLeft: { flex: 1 },
   halfRight: { flex: 1, alignItems: "flex-end" },

   // ── Asunto / cuerpo ──
   subjectLine: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8
   },
   subjectLabel: {
      fontFamily: "Barlow-Bold",
      fontSize: 9,
      color: COLOR.midBlue,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginRight: 6
   },
   subjectText: {
      fontFamily: "Barlow-Medium",
      fontSize: 9,
      color: COLOR.bodyText,
      flex: 1
   },

   messageBody: {
      fontFamily: "Roboto-Regular",
      fontSize: 10.5,
      color: COLOR.bodyText,
      textAlign: "justify",
      lineHeight: 1.65
   },
   bolder: { fontFamily: "Roboto-Bold" },
   italic: { fontFamily: "Roboto-Italic" },
   p: { marginVertical: 7 },

   // ── Tabla de vales ──
   tableWrapper: {
      marginVertical: 12,
      borderRadius: 3,
      overflow: "hidden",
      border: `1px solid ${COLOR.borderGray}`
   },
   tableHeader: {
      flexDirection: "row",
      backgroundColor: COLOR.midBlue,
      paddingVertical: 5
   },
   tableHeaderCell: {
      fontFamily: "Barlow-Bold",
      fontSize: 8.5,
      color: COLOR.white,
      textAlign: "center",
      letterSpacing: 0.5,
      textTransform: "uppercase"
   },
   tableRow: {
      flexDirection: "row",
      borderTop: `0.5px solid ${COLOR.borderGray}`
   },
   tableRowAlt: {
      backgroundColor: COLOR.tableRow
   },
   tableCell: {
      fontFamily: "Barlow-Regular",
      fontSize: 9,
      color: COLOR.bodyText,
      textAlign: "center",
      paddingVertical: 5,
      paddingHorizontal: 4
   },
   tableCellLeft: {
      textAlign: "left",
      paddingLeft: 8
   },
   tableTotalRow: {
      flexDirection: "row",
      borderTop: `1.5px solid ${COLOR.midBlue}`,
      backgroundColor: COLOR.lightBlue,
      paddingVertical: 5
   },
   tableTotalLabel: {
      fontFamily: "Barlow-Bold",
      fontSize: 9,
      color: COLOR.darkNavy,
      textAlign: "right",
      paddingRight: 8
   },
   tableTotalValue: {
      fontFamily: "Barlow-Bold",
      fontSize: 9,
      color: COLOR.darkNavy,
      textAlign: "center"
   },

   // ── Bloque de firma ──
   firmContainer: {
      position: "absolute",
      bottom: 120,
      left: 42,
      right: 42,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      border: "1 solid black"
   },
   firmBlock: {
      alignItems: "center",
      width: "100%",
      border: "1 solid red"
   },
   firmBlockWide: {
      alignItems: "center",
      left: 0,
      width: "100%",
      border: "1 solid blue"
   },
   atentamenteTag: {
      fontFamily: "Barlow-Bold",
      fontSize: 7.5,
      color: COLOR.midBlue,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 2
   },
   firmImage: {
      width: 140,
      height: 80,
      // marginBottom: -8,
      opacity: 1,
      filter: "contrast(2.5)"
   },
   firmLine: {
      borderBottom: `1px solid ${COLOR.darkNavy}`,
      width: "80%",
      marginBottom: 3
   },
   firmName: {
      fontFamily: "Roboto-Bold",
      fontSize: 9,
      color: COLOR.darkNavy,
      textTransform: "uppercase",
      textAlign: "center"
   },
   firmTitle: {
      fontFamily: "Barlow-Regular",
      fontSize: 8.5,
      color: COLOR.mutedText,
      textTransform: "uppercase",
      textAlign: "center",
      marginTop: 1
   },

   // ── Sello Departamento ──
   stampDepartment: {
      position: "absoulte",
      transform: "translateX(-100%) rotate(-5deg)",
      top: "-5%", //"65%",
      left: "55%",
      alignItems: "center",
      justifyContent: "center"
   },

   // ── Sello ──
   stampBlock: {
      position: "absoulte",
      transform: "translateX(-100%) rotate(-5deg)",
      top: "-5%", //"65%",
      left: "75%",
      alignItems: "center",
      justifyContent: "center"
   },
   stampImage: {
      width: "4.5cm", // "3.8cm",
      height: "3.7cm" // "3.8cm"
   },
   dateStampText: {
      fontFamily: "Barlow-Medium",
      fontSize: 12,
      fontWeight: "bold",
      color: COLOR.mutedText,
      textAlign: "center",
      marginTop: -55
   },

   // ── Pie de página ──
   pageNumber: {
      position: "absolute",
      fontSize: 8,
      bottom: 14,
      left: 0,
      right: 0,
      textAlign: "center",
      color: COLOR.mutedText,
      fontFamily: "Barlow-Regular",
      letterSpacing: 1
   },
   confidentialBand: {
      position: "absolute",
      bottom: 52,
      left: 42,
      right: 42,
      height: 0.5,
      backgroundColor: COLOR.borderGray
   }
});

// ─── Valor por defecto ─────────────────────────────────────────────────────────
const formDataInitial = {
   directorFrom: "",
   departmentFrom: "",
   directorTo1: "",
   departmentTo1: "",
   directorTo2: "",
   departmentTo2: "",
   imgStamp: "",
   imgDateStamp: "",
   voucher: {
      folio: "",
      internal_folio: "",
      date: null,
      requesterWorkstation: "",
      requesterFirm: sinFirma,
      requesterName: "",
      requesterStamp: null,
      vobo_at: "",
      activity: null,
      table: null
   }
};

// ─── Sub-componentes ───────────────────────────────────────────────────────────

/** Bloque destinatario (acepta alineación izquierda o derecha) */
function RecipientBlock({ label, name, dept, align = "left" }) {
   const isRight = align === "right";
   return (
      <View style={[stylesPDF.headerBlock, isRight && { alignItems: "flex-end" }]}>
         <Text style={stylesPDF.sectionLabel}>{label}</Text>
         <Text style={stylesPDF.recipientName}>{name}</Text>
         <Text style={stylesPDF.recipientDept}>{dept}</Text>
      </View>
   );
}

/** Tabla de vales de gasolina */
export function FuelVouchersTable({ rows = [], colWidths }) {
   // colWidths: array de % p.e. ["8%","22%","18%","18%","14%","10%","10%"]
   const W = colWidths ?? ["10%", "25%", "15%", "35%", "15%"];
   // const headers = ["#", "Unidad", "Placa", "No. Económico", "Operador", "Tipo Combustible", "Litros", "Importe"];
   const headers = ["#", "Unidad", "Placa", "Empleado", "No. Nómina"];
   // const totalLitros = rows.reduce((a, r) => a + (parseFloat(r.litros) || 0), 0).toFixed(2);
   // const totalImporte = rows.reduce((a, r) => a + (parseFloat(r.importe) || 0), 0).toFixed(2);

   return (
      <View style={stylesPDF.tableWrapper}>
         {/* Cabecera */}
         <View style={stylesPDF.tableHeader}>
            {headers.map((h, i) => (
               <Text key={i} style={[stylesPDF.tableHeaderCell, { width: W[i] }]}>
                  {h}
               </Text>
            ))}
         </View>

         {/* Filas */}
         {rows.map((row, i) => (
            <View key={i} style={[stylesPDF.tableRow, i % 2 === 1 && stylesPDF.tableRowAlt]}>
               <Text style={[stylesPDF.tableCell, { width: W[0] }]}>{i + 1}</Text>
               <Text style={[stylesPDF.tableCell, stylesPDF.tableCellLeft, { width: W[1] }]}>{row.vehicle}</Text>
               <Text style={[stylesPDF.tableCell, { width: W[2] }]}>{row.vehicle_plates}</Text>
               <Text style={[stylesPDF.tableCell, stylesPDF.tableCellLeft, { width: W[3] }]}>{`${row?.creditor_fullname ?? ""}`}</Text>
               <Text style={[stylesPDF.tableCell, { width: W[4] }]}>{row.employee_code}</Text>
               {/* <Text style={[stylesPDF.tableCell, { width: W[4] }]}>{row.tipoCombustible}</Text>
               <Text style={[stylesPDF.tableCell, { width: W[5] }]}>{row.litros}</Text>
               <Text style={[stylesPDF.tableCell, { width: W[6] }]}>${row.importe}</Text> */}
            </View>
         ))}

         {/* Totales */}
         {/* <View style={stylesPDF.tableTotalRow}>
            <Text style={[stylesPDF.tableTotalLabel, { width: `${parseInt(W[0]) + parseInt(W[1]) + parseInt(W[2]) + parseInt(W[3]) + parseInt(W[4])}%`, flex: 1 }]}>
               TOTALES:
            </Text>
            <Text style={[stylesPDF.tableTotalValue, { width: W[5] }]}>{totalLitros} L</Text>
            <Text style={[stylesPDF.tableTotalValue, { width: W[6] }]}>${totalImporte}</Text>
         </View> */}
      </View>
   );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export const DocumentPDF = ({
   children,
   watermark = "Departamento Emisor",
   arrayFormData = [formDataInitial],
   isOfficialDoc = true,
   asunto = "SOLICITUD DE VALES DE GASOLINA"
}) => {
   console.log("🚀 ~ DocumentPDF ~ arrayFormData:", arrayFormData);
   try {
      return (
         <Document>
            {arrayFormData.map((formData, i) => (
               <Page size="LETTER" style={stylesPDF.page} wrap key={i}>
                  {/* ── Fondo institucional ── */}
                  <View style={stylesPDF.viewBgImage} fixed>
                     <Text style={stylesPDF.watermarkText}>{watermark}</Text>
                     {isOfficialDoc && <Image style={stylesPDF.bgImage} src={backgroundImage} />}
                  </View>
                  {isOfficialDoc && (
                     <>
                        {/* ── Folio y fecha ── */}
                        <View style={stylesPDF.folioBlock}>
                           <Text style={stylesPDF.folioLine}>
                              FOLIO: {formData.voucher.folio}
                              {"  "}|{"  "}INT: {formData.voucher.internal_folio}
                           </Text>
                           <Text style={stylesPDF.folioDate}>
                              Gómez Palacio, Dgo.{"  "}
                              {formData.voucher.date ? formatDatetime(formData.voucher.date, false, "lll") : "— / — / ——"}
                           </Text>
                        </View>
                        {/* ── Barra azul decorativa ── */}
                        <View style={stylesPDF.accentBar} />
                        {/* ── Remitente ── */}
                        <RecipientBlock label="" name={formData.directorFrom} dept={formData.departmentFrom} />
                        <Text style={stylesPDF.presenteTag}>P R E S E N T E.-</Text>
                        <View style={stylesPDF.thinRule} />
                        {/* ── Destinatario(s) ── */}
                        {/* {formData.directorTo2 ? (
                           <View style={stylesPDF.row}>
                              <View style={[stylesPDF.col, stylesPDF.halfLeft]}>
                                 <RecipientBlock label="Con atención a:" name={formData.directorTo1} dept={formData.departmentTo1} />
                              </View>
                              <View style={[stylesPDF.col, stylesPDF.halfRight]}>
                                 <RecipientBlock label=" " name={formData.directorTo2} dept={formData.departmentTo2} align="right" />
                              </View>
                           </View>
                        ) : (
                           <RecipientBlock label="Con atención a:" name={formData.directorTo1} dept={formData.departmentTo1} align="right" />
                        )} */}
                        {/* ── Asunto ── */}
                        {/* <View style={stylesPDF.thinRule} />
                        <View style={stylesPDF.subjectLine}>
                           <Text style={stylesPDF.subjectLabel}>ASUNTO:</Text>
                           <Text style={stylesPDF.subjectText}>{asunto}</Text>
                        </View>
                        <View style={stylesPDF.thinRule} /> */}
                     </>
                  )}
                  {/* ── Cuerpo del mensaje ── */}
                  <View style={stylesPDF.messageBody} wrap>
                     {arrayFormData.length > 1 ? formData.voucher.activity : children}
                  </View>
                  {/* ── Tabla de vales (si se provee) ── */}
                  {formData.voucher.table && (
                     <FuelVouchersTable
                        rows={formData.voucher.table}
                        // rows={[
                        //    { unidad: "Pick-up GPC-4821", economico: "ECO-001", operador: "J. Martínez" }
                        // { unidad: "Pick-up GPC-4821", economico: "ECO-001", operador: "J. Martínez", tipoCombustible: "Magna", litros: 50, importe: 620 }
                        // ...más filas
                        // ]}
                     />
                  )}
                  {/* ── Línea de corte ── */}
                  <View style={stylesPDF.confidentialBand} fixed />
                  {isOfficialDoc && (
                     <>
                        {/* ── Bloque de firma ── */}
                        <View style={stylesPDF.firmContainer} wrap={false}>
                           {/* Sello (izquierda) */}
                           {formData.voucher.vobo_at && (
                              <View style={stylesPDF.stampBlock}>
                                 <Image style={stylesPDF.stampImage} src={selloRecibido} />
                                 {formData.voucher.vobo_at && <Text style={stylesPDF.dateStampText}>{formatDatetime(formData.voucher.vobo_at, false, "sello")}</Text>}
                              </View>
                           )}

                           {/* Firma (derecha o centrada si no hay sello) */}
                           <View style={!formData.voucher.vobo_at ? stylesPDF.firmBlock : stylesPDF.firmBlockWide}>
                              <Text style={stylesPDF.atentamenteTag}>A T E N T A M E N T E</Text>
                              {/* <Text>{formData.voucher.requesterFirm}</Text> */}
                              <Image style={stylesPDF.firmImage} src={formData.voucher.requesterFirm ?? sinFirma} />
                              <View style={stylesPDF.firmLine} />
                              <Text style={stylesPDF.firmName}>{formData.voucher.requesterName}</Text>
                              <Text style={stylesPDF.firmTitle}>{formData.voucher.requesterWorkstation}</Text>
                           </View>
                            {/* Sello departamento (derecha) */}
                            {formData.voucher.requesterStamp && (
                               <View style={stylesPDF.stampDepartment}>
                                  <Image style={stylesPDF.stampImage} src={formData.voucher.requesterStamp} />
                               </View>
                            )}
                        </View>
                     </>
                  )}
                  {/* ── Número de página ── */}
                  <Text
                     style={stylesPDF.pageNumber}
                     render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}   ·   Documento Confidencial`}
                     fixed
                  />
               </Page>
            ))}
         </Document>
      );
   } catch (error) {
      console.error("DocumentPDF error:", error);
      return null;
   }
};

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="down" ref={ref} {...props} />;
});
export const ModalPDF = ({ children, open, setOpen, formTitle = "titulo", watermark, arrayFormData, isOfficialDoc = true, fileName }) => {
   const { auth } = useAuthContext();
   const [fullScreenDialog, setFullScreenDialog] = useState(false);
   const { setLoadingAction } = useGlobalContext();

   const handleClose = () => {
      setOpen(false);
   };

   useEffect(() => {
      // console.log("estoy en el modal", voucher);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", drivers);
      // console.log("estoy en el useLayoutEffect", arrayFormData);
   }, []);

   return (
      <div>
         <Dialog
            open={open}
            TransitionComponent={Transition}
            maxWidth={"lg"}
            keepMounted
            fullWidth
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backgroundColor: "transparent" }}
            fullScreen={fullScreenDialog}
         >
            <DialogTitle my={0} py={0} sx={{ backgroundColor: gpcDark, color: gpcLight }}>
               <Toolbar sx={{ py: 0 }}>
                  <Typography variant="h2" my={0} py={0} color={gpcLight} sx={{ ml: 2, flex: 1, py: 0, pt: 0, pb: 0, padding: "0px 24px !important" }}>
                     {formTitle}
                  </Typography>
                  {/* <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
                  {"title"}
               </Typography> */}
                  {/* <Tooltip title={`Exportar Reporte a PDF`} placement="top">
                  <IconButton color="inherit" onClick={() => downloadPDF("reportPaper")}>
                     <IconFileTypePdf color="red" />
                  </IconButton>
               </Tooltip>
               <Tooltip title={`Imprimir Reporte`} placement="top">
                  <IconButton color="inherit" onClick={() => printContent("reportPaper")}>
                     <IconPrinter />
                  </IconButton>
               </Tooltip> */}
                   <Tooltip title={`Exportar Reporte a PDF`} placement="top">
                      <PDFDownloadLink
                         document={
                            <DocumentPDF watermark={watermark} arrayFormData={arrayFormData} isOfficialDoc={isOfficialDoc}>
                               {children}
                            </DocumentPDF>
                         }
                         fileName={fileName && fileName}
                         style={{ textDecoration: "none", marginTop: "10px" }}
                      >
                         <Button
                            style={{
                               backgroundColor: colorSecondaryLight,
                               color: colorSecondaryDark,
                               borderRadius: "8px",
                               paddingInline: 10,
                               border: "none",
                               cursor: "pointer",
                               fontWeight: "bolder",
                               fontSize: "12px",
                               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                               transition: "background-color 0.3s ease",
                               marginTop: -10
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colorPrimaryMain)}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = colorSecondaryLight)}
                         >
                            <IconDownload /> &nbsp; Descargar PDF
                         </Button>
                      </PDFDownloadLink>
                   </Tooltip>
                  <Tooltip title={fullScreenDialog ? `Minimizar ventana` : `Maximizar ventana`} placement="top">
                     <IconButton color="inherit" onClick={() => setFullScreenDialog(!fullScreenDialog)}>
                        {fullScreenDialog ? <IconWindowMinimize /> : <IconWindowMaximize />}
                     </IconButton>
                  </Tooltip>
                  <Tooltip title={`Cerrar ventana`} placement="top">
                     <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
                        <IconX />
                     </IconButton>
                  </Tooltip>
               </Toolbar>
            </DialogTitle>
            <DialogContent sx={{ pb: 0, height: "90vh" }}>
               <PDFViewer width={"100%"} height={"99%"}>
                  <DocumentPDF watermark={watermark} arrayFormData={arrayFormData} isOfficialDoc={isOfficialDoc} fileName={fileName}>
                     {children}
                  </DocumentPDF>
               </PDFViewer>
            </DialogContent>
         </Dialog>
      </div>
   );
};
