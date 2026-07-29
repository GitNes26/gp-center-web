import Slide from "@mui/material/Slide";
import { forwardRef, useLayoutEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { Image, Text, View } from "@react-pdf/renderer";
import { ModalPDF, stylesPDF } from "../../../components/DocumentPDF";
import { useVoucherContext } from "../../../context/VoucherContext";
import { useVoucherDetailContext } from "../../../context/VoucherDetailContext";
import GPLogo from "../../../assets/images/icon.png";
import GPEscudo from "../../../assets/images/escudo-gpd.png";
import { formatDatetime } from "../../../utils/Formats";

// ─── Paleta institucional 2025-2028 ──────────────────────────────────────────
const C = {
   guinda: "#9B2242",
   guindaDark: "#651D32",
   grisCool: "#474C55",
   gris: "#727372",
   grisClaro: "#B8B6AF",
   negro: "#130D0E",
   guindaLight: "#F5E8EC",
   white: "#FFFFFF"
};

// ─── Estilos compactos para media carta horizontal (216 × 140 mm) ────────────
const S = {
   // ── Encabezado ──
   header: {
      flexDirection: "row",
      backgroundColor: C.guinda,
      borderBottomWidth: 2.5,
      borderBottomColor: C.guindaDark,
      borderBottomStyle: "solid"
   },
   hdrLogos: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: C.guindaDark,
      paddingHorizontal: 8,
      paddingVertical: 5,
      gap: 5
   },
   hdrLogo: {
      height: 22,
      width: "auto",
      objectFit: "contain"
   },
   hdrTitle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5
   },
   hdrTitleText: {
      fontFamily: "Roboto-Bold",
      fontSize: 6.5,
      color: C.white,
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: 0.3,
      lineHeight: 1.5
   },
   hdrFolio: {
      backgroundColor: C.guindaDark,
      paddingHorizontal: 8,
      paddingVertical: 5,
      alignItems: "flex-end",
      justifyContent: "center",
      gap: 3
   },
   hdrFolioLbl: {
      fontFamily: "Roboto-Regular",
      fontSize: 5.5,
      color: "rgba(255,255,255,0.55)",
      textTransform: "uppercase",
      letterSpacing: 0.8
   },
   hdrFolioVal: {
      fontFamily: "Roboto-Bold",
      fontSize: 9,
      color: C.white,
      letterSpacing: 0.4
   },

   // ── Cuerpo ──
   body: {
      paddingHorizontal: 10,
      paddingTop: 7,
      paddingBottom: 6
   },

   // ── Fila de metadatos ──
   metaRow: {
      flexDirection: "row",
      gap: 5,
      marginBottom: 6
   },
   metaBox: {
      flex: 1,
      backgroundColor: C.guindaLight,
      borderWidth: 0.5,
      borderColor: "#D4A0B0",
      borderStyle: "solid",
      borderRadius: 2,
      paddingHorizontal: 6,
      paddingVertical: 4
   },
   metaLbl: {
      fontFamily: "Roboto-Regular",
      fontSize: 5.5,
      color: C.guindaDark,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 1
   },
   metaVal: {
      fontFamily: "Roboto-Bold",
      fontSize: 8,
      color: C.negro
   },

   // ── Separador de sección ──
   sepLabel: {
      fontFamily: "Roboto-Bold",
      fontSize: 6,
      color: C.guinda,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginBottom: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: "#D4A0B0",
      borderBottomStyle: "solid",
      paddingBottom: 2
   },

   // ── Tarjetas de cantidades ──
   qtyRow: {
      flexDirection: "row",
      gap: 5,
      marginBottom: 6
   },
   qtyCard: {
      flex: 1,
      borderWidth: 0.5,
      borderColor: "#D4A0B0",
      borderStyle: "solid",
      borderRadius: 2,
      overflow: "hidden"
   },
   qtyHead: {
      backgroundColor: C.guinda,
      paddingHorizontal: 3,
      paddingVertical: 3,
      fontFamily: "Roboto-Bold",
      fontSize: 5.5,
      color: C.white,
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: 0.3
   },
   qtyBody: {
      paddingVertical: 5,
      paddingHorizontal: 3,
      alignItems: "center"
   },
   qtyVal: {
      fontFamily: "Roboto-Bold",
      fontSize: 15,
      color: C.guindaDark,
      textAlign: "center",
      lineHeight: 1
   },
   qtyValSm: {
      fontFamily: "Roboto-Bold",
      fontSize: 9,
      color: C.guindaDark,
      textAlign: "center"
   },
   qtyUnit: {
      fontFamily: "Roboto-Regular",
      fontSize: 5.5,
      color: C.gris,
      textAlign: "center",
      marginTop: 1
   },

   // ── Referencia ──
   refBox: {
      backgroundColor: "#FAFAFA",
      borderWidth: 0.5,
      borderColor: C.grisClaro,
      borderStyle: "solid",
      borderRadius: 2,
      paddingHorizontal: 6,
      paddingVertical: 4,
      marginBottom: 5
   },
   refLbl: {
      fontFamily: "Roboto-Regular",
      fontSize: 5.5,
      color: C.gris,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 1
   },
   refVal: {
      fontFamily: "Roboto-Bold",
      fontSize: 9.5,
      color: C.guinda,
      letterSpacing: 0.3
   },

   // ── Firmas ──
   sigRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 5
   },
   sigBox: {
      flex: 1,
      borderWidth: 0.5,
      borderColor: C.grisClaro,
      borderStyle: "solid",
      borderRadius: 2,
      padding: 5
   },
   sigLbl: {
      fontFamily: "Roboto-Regular",
      fontSize: 5.5,
      color: C.gris,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      marginBottom: 2
   },
   sigArea: {
      height: 28,
      borderBottomWidth: 0.5,
      borderBottomColor: C.grisCool,
      borderBottomStyle: "solid",
      justifyContent: "flex-end",
      marginBottom: 3
   },
   sigImage: {
      width: 90,
      height: 26,
      alignSelf: "center",
      objectFit: "contain",
      filter: "contrast(2.5)"
   },
   sigName: {
      fontFamily: "Roboto-Bold",
      fontSize: 6.5,
      color: C.negro,
      textAlign: "center"
   },
   sigDept: {
      fontFamily: "Roboto-Regular",
      fontSize: 6,
      color: C.gris,
      textAlign: "center",
      marginTop: 1
   },

   // ── Fila inferior: sello + observaciones ──
   bottomRow: {
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start"
   },
   stampBlock: {
      alignItems: "center",
      width: 180
   },
   stampBox: {
      width: 180,
      height: 56,
      borderWidth: 1.5,
      borderColor: "#D4A0B0",
      borderStyle: "dashed",
      borderRadius: 2,
      justifyContent: "center",
      alignItems: "center"
   },
   stampImg: {
      width: 180,
      height: 52,
      objectFit: "contain"
   },
   stampLbl: {
      fontFamily: "Roboto-Regular",
      fontSize: 5.5,
      color: C.gris,
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: 0.4,
      marginTop: 3
   },
   obsBlock: {
      flex: 1
   },
   obsLbl: {
      fontFamily: "Roboto-Bold",
      fontSize: 6,
      color: C.guinda,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginBottom: 15,
      borderBottomWidth: 0.5,
      borderBottomColor: "#D4A0B0",
      borderBottomStyle: "solid",
      paddingBottom: 2
   },
   obsLine: {
      borderBottomWidth: 0.5,
      borderBottomColor: "#D0D0D0",
      borderBottomStyle: "solid",
      marginBottom: 15
   },

   // ── Pie ──
   footer: {
      backgroundColor: C.grisCool,
      paddingHorizontal: 10,
      paddingVertical: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
   },
   footerTxt: {
      fontFamily: "Roboto-Regular",
      fontSize: 5.5,
      color: "rgba(255,255,255,0.6)",
      letterSpacing: 0.3
   }
};

// ─── Estado inicial ───────────────────────────────────────────────────────────
const DIRECTOR_FROM = "LIC. LUIS ALAN CARDOZA DE LA GARZA";
const WORKSTATION_FROM = "JEFE DE DEPARTAMENTO DE CONTROL VEHICULAR";

const initFormData = () => ({
   directorFrom: DIRECTOR_FROM,
   departmentFrom: WORKSTATION_FROM,
   directorTo1: "C. ING. RODRIGO DE LA TORRE VALLE",
   departmentTo1: "OFICIAL MAYOR",
   directorTo2: "LIC. CARLOS GARCIA GONZALEZ",
   departmentTo2: "TESORERIA MUNICIPAL",
   imgStamp: `${import.meta.env.VITE_HOST}/GPCenter/vouchersSettings/SELLO-Control-Vehicular.png`,
   imgDateStamp: `${import.meta.env.VITE_HOST}/GPCenter/vouchersSettings/SELLO-Control-Vehicular-Recibido.png`,
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

// ─── Componente ───────────────────────────────────────────────────────────────
const ModalContentRecivedPDF = ({ open, setOpen }) => {
   const { auth } = useAuthContext();
   const { voucher } = useVoucherContext();
   const { voucherDetails } = useVoucherDetailContext();
   const [formData, setFormData] = useState(initFormData);

   useLayoutEffect(() => {
      if (!voucher) return;
      setFormData((prev) => ({
         ...prev,
         voucher: {
            ...prev.voucher,
            folio: voucher.id,
            internal_folio: voucher.internal_folio,
            date: voucher.created_at,
            requesterWorkstation: voucher.workstation,
            requesterFirm: voucher.signature_image ? `${import.meta.env.VITE_API_GPC_ASSETS}/${voucher.signature_image}` : null,
            requesterName: voucher.requested_role_id === 7 ? DIRECTOR_FROM : voucher.requested_fullname,
            requesterStamp: voucher.seal_image ? `${import.meta.env.VITE_API_GPC_ASSETS}/${voucher.seal_image}` : null,
            viewed_at: voucher.viewed_at
         }
      }));
   }, [voucher]);

   if (!voucher) return null;

   const proveedor = voucher.letter_folio != null && voucher.letter_folio === "S" ? "SIMSA" : "CARGO GAS";

   return (
      // Tamaño: HALF_LETTER en landscape (216 × 140 mm)
      // Pasa este size y orientation al ModalPDF/DocumentPDF según tu implementación.
      // Si ModalPDF acepta props `size` y `orientation`, úsalos así:
      //   size="HALF_LETTER" orientation="landscape"
      // Si no los acepta, modifica ModalPDF para pasarlos a <Page>.
      <ModalPDF
         open={open}
         setOpen={setOpen}
         formTitle="RECIBO DE VALES"
         watermark="Control Vehicular"
         arrayFormData={[formData]}
         isOfficialDoc={false}
         pageSize="HALF_LETTER"
         pageOrientation="landscape"
      >
         {/* ══════════════════════════════════════════
          ENCABEZADO
      ══════════════════════════════════════════ */}
         <View style={S.header}>
            <View style={S.hdrLogos}>
               <Image style={S.hdrLogo} src={GPEscudo} />
               <Image style={[S.hdrLogo, { height: 15 }]} src={GPLogo} />
            </View>

            <View style={S.hdrTitle}>
               <Text style={S.hdrTitleText}>
                  Formato de recepción de vales de combustible{"\n"}
                  Ayuntamiento de Gómez Palacio · Administración 2025–2028
               </Text>
            </View>

            <View style={S.hdrFolio}>
               <Text style={S.hdrFolioLbl}>Folio</Text>
               <Text style={S.hdrFolioVal}>#{formData.voucher.folio}</Text>
               {/* <Text style={[S.hdrFolioLbl, { marginTop: 3 }]}>Folio int.</Text> */}
               {/* <Text style={S.hdrFolioVal}>{formData.voucher.internal_folio}</Text> */}
            </View>
         </View>

         {/* ══════════════════════════════════════════
          CUERPO
      ══════════════════════════════════════════ */}
         <View style={S.body}>
            {/* Datos generales */}
            <View style={S.metaRow}>
               <View style={[S.metaBox, { flex: 1.6 }]}>
                  <Text style={S.metaLbl}>Dependencia</Text>
                  <Text style={S.metaVal}>{voucher.requested_department?.toUpperCase() ?? "—"}</Text>
               </View>
               <View style={[S.metaBox, { flex: 0.7 }]}>
                  <Text style={S.metaLbl}>Proveedor</Text>
                  <Text style={S.metaVal}>{proveedor}</Text>
               </View>
               <View style={[S.metaBox, { flex: 0.8 }]}>
                  <Text style={S.metaLbl}>Fecha</Text>
                  <Text style={S.metaVal}>{formatDatetime(new Date(), false)}</Text>
               </View>
            </View>

            {/* Cantidades */}
            <Text style={S.sepLabel}>Cantidades autorizadas</Text>
            <View style={S.qtyRow}>
               <View style={S.qtyCard}>
                  <Text style={S.qtyHead}>Vales</Text>
                  <View style={S.qtyBody}>
                     <Text style={S.qtyVal}>{voucher.approved_amount}</Text>
                     <Text style={S.qtyUnit}>piezas</Text>
                  </View>
               </View>

               <View style={S.qtyCard}>
                  <Text style={S.qtyHead}>Litros</Text>
                  <View style={S.qtyBody}>
                     <Text style={S.qtyVal}>{voucher.approved_liters}</Text>
                     <Text style={S.qtyUnit}>litros</Text>
                  </View>
               </View>

               <View style={S.qtyCard}>
                  <Text style={S.qtyHead}>Combustible</Text>
                  <View style={S.qtyBody}>
                     <Text style={[S.qtyValSm, { marginTop: 3 }]}>{voucher.approved_combustible}</Text>
                     <Text style={[S.qtyUnit, { marginTop: 3 }]}>tipo</Text>
                  </View>
               </View>

               <View style={S.qtyCard}>
                  <Text style={S.qtyHead}>Núm. folios</Text>
                  <View style={S.qtyBody}>
                     <Text style={[S.qtyValSm, { fontSize: 7.5, marginTop: 3, fontFamily: "Roboto-Regular" }]}>{voucher.foliated_vouchers}</Text>
                     <Text style={[S.qtyUnit, { marginTop: 3 }]}>rango</Text>
                  </View>
               </View>
            </View>

            {/* Referencia */}
            <View style={S.refBox}>
               <Text style={S.refLbl}>Solicitud en oficio número (Folio interno)</Text>
               <Text style={S.refVal}>{formData.voucher.internal_folio}</Text>
            </View>

            {/* Firmas */}
            <View style={S.sigRow}>
               {/* Receptor */}
               <View style={S.sigBox}>
                  <Text style={S.sigLbl}>Recibió conforme</Text>
                  <View style={S.sigArea} />
                  <Text style={S.sigName}>________________________________</Text>
                  <Text style={S.sigDept}>Nombre y firma</Text>
               </View>

               {/* Autorizador */}
               <View style={S.sigBox}>
                  <Text style={S.sigLbl}>Autorizó entrega</Text>
                  <View style={S.sigArea}>{formData.voucher.requesterFirm && <Image style={S.sigImage} src={formData.voucher.requesterFirm} />}</View>
                  <Text style={S.sigName}>{formData.voucher.requesterName}</Text>
                  <Text style={S.sigDept}>{formData.voucher.requesterWorkstation}</Text>
               </View>
            </View>

            {/* Sello + Observaciones */}
            <View style={S.bottomRow}>
               <View style={S.stampBlock}>
                  <View style={S.stampBox}>{formData.voucher.requesterStamp ? <Image style={S.stampImg} src={formData.voucher.requesterStamp} /> : null}</View>
                  <Text style={S.stampLbl}>Sello de recibido</Text>
               </View>

               <View style={S.obsBlock}>
                  <Text style={S.obsLbl}>Observaciones</Text>
                  <View style={S.obsLine} />
                  <View style={S.obsLine} />
                  <View style={S.obsLine} />
               </View>
            </View>
         </View>

         {/* ══════════════════════════════════════════
          PIE
      ══════════════════════════════════════════ */}
         <View style={S.footer}>
            <Text style={S.footerTxt}>Control Vehicular · Ayuntamiento de Gómez Palacio</Text>
            <Text style={S.footerTxt}>Hoja 1 / 1</Text>
         </View>
      </ModalPDF>
   );
};

export default ModalContentRecivedPDF;

/** TAMAÑO COMPLETO */
// import Slide from "@mui/material/Slide";
// import { forwardRef, useLayoutEffect, useState } from "react";
// import { useAuthContext } from "../../../context/AuthContext";
// import { Image, Text, View } from "@react-pdf/renderer";
// import { ModalPDF, stylesPDF } from "../../../components/DocumentPDF";
// import { useVoucherContext } from "../../../context/VoucherContext";
// import { useVoucherDetailContext } from "../../../context/VoucherDetailContext";
// import GPLogo from "../../../assets/images/icon.png";
// import GPEscudo from "../../../assets/images/escudo-gpd.png";
// import { formatDatetime } from "../../../utils/Formats";

// // ─── Paleta institucional 2025-2028 ──────────────────────────────────────────
// const C = {
//    guinda: "#9B2242",
//    guindaDark: "#651D32",
//    grisCool: "#474C55",
//    gris: "#727372",
//    grisClaro: "#B8B6AF",
//    negro: "#130D0E",
//    guindaLight: "#F5E8EC", // tint suave para fondos
//    white: "#FFFFFF"
// };

// // ─── Estilos del recibo ───────────────────────────────────────────────────────
// const S = {
//    // ── Layout base ──
//    page: {
//       paddingHorizontal: 0,
//       paddingTop: 0,
//       paddingBottom: 0
//    },

//    // ── Encabezado ──
//    header: {
//       flexDirection: "row",
//       backgroundColor: C.guinda,
//       borderBottomWidth: 3,
//       borderBottomColor: C.guindaDark,
//       borderBottomStyle: "solid"
//    },
//    headerLogos: {
//       flexDirection: "row",
//       alignItems: "center",
//       backgroundColor: C.guindaDark,
//       paddingHorizontal: 12,
//       paddingVertical: 8,
//       gap: 8
//    },
//    headerLogo: {
//       height: 30,
//       width: "auto",
//       objectFit: "contain"
//    },
//    headerTitleBlock: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       paddingHorizontal: 14,
//       paddingVertical: 8
//    },
//    headerTitle: {
//       fontFamily: "Roboto-Bold",
//       fontSize: 8.5,
//       color: C.white,
//       textAlign: "center",
//       textTransform: "uppercase",
//       letterSpacing: 0.4,
//       lineHeight: 1.5
//    },
//    headerFolioBlock: {
//       backgroundColor: C.guindaDark,
//       paddingHorizontal: 12,
//       paddingVertical: 8,
//       alignItems: "flex-end",
//       justifyContent: "center"
//    },
//    headerFolioLabel: {
//       fontFamily: "Roboto-Regular",
//       fontSize: 7,
//       color: "rgba(255,255,255,0.55)",
//       textTransform: "uppercase",
//       letterSpacing: 1,
//       marginBottom: 1
//    },
//    headerFolioValue: {
//       fontFamily: "Roboto-Bold",
//       fontSize: 12,
//       color: C.white,
//       letterSpacing: 0.5
//    },

//    // ── Cuerpo ──
//    body: {
//       paddingHorizontal: 18,
//       paddingTop: 12,
//       paddingBottom: 12
//    },

//    // ── Título de sección ──
//    sectionTitle: {
//       fontFamily: "Roboto-Bold",
//       fontSize: 7.5,
//       color: C.guinda,
//       textTransform: "uppercase",
//       letterSpacing: 1.5,
//       marginBottom: 6,
//       marginTop: 10,
//       borderBottomWidth: 0.5,
//       borderBottomColor: "#D4A0B0",
//       borderBottomStyle: "solid",
//       paddingBottom: 3
//    },

//    // ── Fila de metadatos ──
//    metaRow: {
//       flexDirection: "row",
//       gap: 8,
//       marginBottom: 10
//    },
//    metaBox: {
//       flex: 1,
//       backgroundColor: C.guindaLight,
//       borderWidth: 0.5,
//       borderColor: "#D4A0B0",
//       borderStyle: "solid",
//       borderRadius: 4,
//       padding: 7
//    },
//    metaLabel: {
//       fontFamily: "Roboto-Regular",
//       fontSize: 7,
//       color: C.guindaDark,
//       textTransform: "uppercase",
//       letterSpacing: 0.8,
//       marginBottom: 2
//    },
//    metaValue: {
//       fontFamily: "Roboto-Bold",
//       fontSize: 10,
//       color: C.negro
//    },

//    // ── Tarjetas de cantidades ──
//    qtyRow: {
//       flexDirection: "row",
//       gap: 8,
//       marginBottom: 10
//    },
//    qtyCard: {
//       flex: 1,
//       borderWidth: 0.5,
//       borderColor: "#D4A0B0",
//       borderStyle: "solid",
//       borderRadius: 4,
//       overflow: "hidden"
//    },
//    qtyCardHead: {
//       backgroundColor: C.guinda,
//       paddingHorizontal: 6,
//       paddingVertical: 4,
//       fontFamily: "Roboto-Bold",
//       fontSize: 7.5,
//       color: C.white,
//       textAlign: "center",
//       textTransform: "uppercase",
//       letterSpacing: 0.4
//    },
//    qtyCardBody: {
//       paddingVertical: 8,
//       paddingHorizontal: 6,
//       alignItems: "center"
//    },
//    qtyCardValue: {
//       fontFamily: "Roboto-Bold",
//       fontSize: 20,
//       color: C.guindaDark,
//       textAlign: "center",
//       lineHeight: 1
//    },
//    qtyCardValueSm: {
//       fontFamily: "Roboto-Bold",
//       fontSize: 12,
//       color: C.guindaDark,
//       textAlign: "center"
//    },
//    qtyCardUnit: {
//       fontFamily: "Roboto-Regular",
//       fontSize: 7,
//       color: C.gris,
//       textAlign: "center",
//       marginTop: 2
//    },

//    // ── Referencia documental ──
//    refBox: {
//       backgroundColor: "#FAFAFA",
//       borderWidth: 0.5,
//       borderColor: C.grisClaro,
//       borderStyle: "solid",
//       borderRadius: 3,
//       padding: 7,
//       marginBottom: 10
//    },
//    refLabel: {
//       fontFamily: "Roboto-Regular",
//       fontSize: 7,
//       color: C.gris,
//       textTransform: "uppercase",
//       letterSpacing: 0.5,
//       marginBottom: 2
//    },
//    refValue: {
//       fontFamily: "Roboto-Bold",
//       fontSize: 11,
//       color: C.guinda,
//       letterSpacing: 0.3
//    },

//    // ── Firmas ──
//    sigRow: {
//       flexDirection: "row",
//       gap: 12,
//       marginBottom: 10
//    },
//    sigBox: {
//       flex: 1,
//       borderWidth: 0.5,
//       borderColor: C.grisClaro,
//       borderStyle: "solid",
//       borderRadius: 4,
//       padding: 8
//    },
//    sigBoxLabel: {
//       fontFamily: "Roboto-Regular",
//       fontSize: 7,
//       color: C.gris,
//       textTransform: "uppercase",
//       letterSpacing: 0.5,
//       marginBottom: 4
//    },
//    sigArea: {
//       height: 50,
//       borderBottomWidth: 0.5,
//       borderBottomColor: C.grisCool,
//       borderBottomStyle: "solid",
//       marginBottom: 4,
//       justifyContent: "flex-end"
//    },
//    sigImage: {
//       width: 120,
//       height: 45,
//       alignSelf: "center",
//       objectFit: "contain",
//       opacity: 1,
//       filter: "contrast(2.5)"
//    },
//    sigLine: {
//       fontFamily: "Roboto-Bold",
//       fontSize: 8,
//       color: C.negro,
//       textAlign: "center"
//    },
//    sigDept: {
//       fontFamily: "Roboto-Regular",
//       fontSize: 7,
//       color: C.gris,
//       textAlign: "center",
//       marginTop: 1
//    },

//    // ── Fila sello + observaciones ──
//    bottomRow: {
//       flexDirection: "row",
//       gap: 12,
//       marginBottom: 10,
//       alignItems: "flex-start"
//    },
//    stampBlock: {
//       alignItems: "center",
//       width: 90
//    },
//    stampContainer: {
//       width: 85,
//       height: 85,
//       borderWidth: 1.5,
//       borderColor: "#D4A0B0",
//       borderStyle: "dashed",
//       borderRadius: 4,
//       justifyContent: "center",
//       alignItems: "center"
//    },
//    stampImage: {
//       width: 80,
//       height: 80,
//       objectFit: "contain"
//    },
//    stampLabel: {
//       fontFamily: "Roboto-Regular",
//       fontSize: 7,
//       color: C.gris,
//       textAlign: "center",
//       textTransform: "uppercase",
//       letterSpacing: 0.5,
//       marginTop: 4
//    },
//    obsBlock: {
//       flex: 1
//    },
//    obsLabel: {
//       fontFamily: "Roboto-Regular",
//       fontSize: 7,
//       color: C.gris,
//       textTransform: "uppercase",
//       letterSpacing: 0.5,
//       marginBottom: 4
//    },
//    obsArea: {
//       height: 65,
//       backgroundColor: "#FAFAFA",
//       borderWidth: 0.5,
//       borderColor: C.grisClaro,
//       borderStyle: "solid",
//       borderRadius: 3,
//       padding: 6
//    },
//    obsLine: {
//       borderBottomWidth: 0.5,
//       borderBottomColor: "#D0D0D0",
//       borderBottomStyle: "solid",
//       marginBottom: 10
//    },

//    // ── Pie de página ──
//    footer: {
//       backgroundColor: C.grisCool,
//       paddingHorizontal: 18,
//       paddingVertical: 5,
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginTop: "auto"
//    },
//    footerText: {
//       fontFamily: "Roboto-Regular",
//       fontSize: 7,
//       color: "rgba(255,255,255,0.6)",
//       letterSpacing: 0.3
//    }
// };

// // ─── Valor inicial del formulario ─────────────────────────────────────────────
// const formDataInitial = {
//    directorFrom: "LIC. LUIS ALAN CARDOZA DE LA GARZA",
//    departmentFrom: "JEFE DE DEPARTAMENTO DE CONTROL VEHICULAR",
//    directorTo1: "C. ING. RODRIGO DE LA TORRE VALLE",
//    departmentTo1: "OFICIAL MAYOR",
//    directorTo2: "LIC. CARLOS GARCIA GONZALEZ",
//    departmentTo2: "TESORERIA MUNICIPAL",
//    imgStamp: "",
//    imgDateStamp: "",
//    voucher: {
//       folio: "",
//       internal_folio: "",
//       date: "--/--/----",
//       requesterWorkstation: "",
//       requesterFirm: null,
//       requesterName: "",
//       requesterStamp: null,
//       viewed_at: null
//    }
// };

// // ─── Componente principal ─────────────────────────────────────────────────────
// const ModalContentRecivedPDF = ({ open, setOpen }) => {
//    const { auth } = useAuthContext();
//    const { voucher } = useVoucherContext();
//    const { voucherDetails } = useVoucherDetailContext();

//    const [formData, setFormData] = useState({ ...formDataInitial });

//    useLayoutEffect(() => {
//       if (!voucher) return;
//       setFormData((prev) => ({
//          ...prev,
//          voucher: {
//             ...prev.voucher,
//             folio: voucher.id,
//             internal_folio: voucher.internal_folio,
//             date: voucher.created_at,
//             requesterWorkstation: voucher.workstation,
//             requesterFirm: voucher.signature_image ? `${import.meta.env.VITE_API_GPC_ASSETS}/${voucher.signature_image}` : null,
//             requesterName: voucher.requested_role_id === 7 ? formDataInitial.directorFrom : voucher.requested_fullname,
//             requesterStamp: voucher.seal_image ? `${import.meta.env.VITE_API_GPC_ASSETS}/${voucher.seal_image}` : null,
//             viewed_at: voucher.viewed_at
//          }
//       }));
//    }, [voucher]);

//    if (!voucher) return null;

//    const proveedor = voucher.letter_folio === "S" ? "SIMSA" : "CARGO GAS";

//    return (
//       <ModalPDF open={open} setOpen={setOpen} formTitle="RECIBO DE VALES" watermark="Control Vehicular" arrayFormData={[formData]} isOfficialDoc={false}>
//          {/* ═══════════════════════════════════════════════════════════
//           ENCABEZADO CON LOGOS + TÍTULO + FOLIO
//       ═══════════════════════════════════════════════════════════ */}
//          <View style={S.header}>
//             {/* Logos institucionales */}
//             <View style={S.headerLogos}>
//                <Image style={S.headerLogo} src={GPEscudo} />
//                <Image style={[S.headerLogo, { height: 15 }]} src={GPLogo} />
//             </View>

//             {/* Título central */}
//             <View style={S.headerTitleBlock}>
//                <Text style={S.headerTitle}>
//                   Formato de recepción de vales de combustible{"\n"}
//                   Ayuntamiento de Gómez Palacio · Administración 2022–2025
//                </Text>
//             </View>

//             {/* Bloque de folios */}
//             <View style={S.headerFolioBlock}>
//                <Text style={S.headerFolioLabel}>Folio</Text>
//                <Text style={S.headerFolioValue}>#{formData.voucher.folio}</Text>
//                <Text style={[S.headerFolioLabel, { marginTop: 5 }]}>Folio interno</Text>
//                <Text style={S.headerFolioValue}>{formData.voucher.internal_folio}</Text>
//             </View>
//          </View>

//          {/* ═══════════════════════════════════════════════════════════
//           CUERPO
//       ═══════════════════════════════════════════════════════════ */}
//          <View style={S.body}>
//             {/* ── Datos generales ── */}
//             <Text style={S.sectionTitle}>Datos generales</Text>
//             <View style={S.metaRow}>
//                <View style={S.metaBox}>
//                   <Text style={S.metaLabel}>Dependencia solicitante</Text>
//                   <Text style={S.metaValue}>{voucher.requested_department?.toUpperCase() ?? "—"}</Text>
//                </View>
//                <View style={S.metaBox}>
//                   <Text style={S.metaLabel}>Proveedor</Text>
//                   <Text style={S.metaValue}>{proveedor}</Text>
//                </View>
//                <View style={S.metaBox}>
//                   <Text style={S.metaLabel}>Fecha de recepción</Text>
//                   <Text style={S.metaValue}>{formatDatetime(new Date(), false)}</Text>
//                </View>
//             </View>

//             {/* ── Cantidades autorizadas ── */}
//             <Text style={S.sectionTitle}>Cantidades autorizadas</Text>
//             <View style={S.qtyRow}>
//                <View style={S.qtyCard}>
//                   <Text style={S.qtyCardHead}>Vales</Text>
//                   <View style={S.qtyCardBody}>
//                      <Text style={S.qtyCardValue}>{voucher.approved_amount}</Text>
//                      <Text style={S.qtyCardUnit}>piezas</Text>
//                   </View>
//                </View>

//                <View style={S.qtyCard}>
//                   <Text style={S.qtyCardHead}>Litros</Text>
//                   <View style={S.qtyCardBody}>
//                      <Text style={S.qtyCardValue}>{voucher.approved_liters}</Text>
//                      <Text style={S.qtyCardUnit}>litros</Text>
//                   </View>
//                </View>

//                <View style={S.qtyCard}>
//                   <Text style={S.qtyCardHead}>Combustible</Text>
//                   <View style={S.qtyCardBody}>
//                      <Text style={S.qtyCardValueSm}>{voucher.approved_combustible}</Text>
//                      <Text style={S.qtyCardUnit}>tipo</Text>
//                   </View>
//                </View>

//                <View style={S.qtyCard}>
//                   <Text style={S.qtyCardHead}>Núm. de folios</Text>
//                   <View style={S.qtyCardBody}>
//                      <Text style={[S.qtyCardValueSm, { fontSize: 10 }]}>{voucher.foliated_vouchers}</Text>
//                      <Text style={S.qtyCardUnit}>rango</Text>
//                   </View>
//                </View>
//             </View>

//             {/* ── Referencia documental ── */}
//             <Text style={S.sectionTitle}>Referencia documental</Text>
//             <View style={S.refBox}>
//                <Text style={S.refLabel}>Solicitud en oficio número</Text>
//                <Text style={S.refValue}>{formData.voucher.internal_folio}</Text>
//             </View>

//             {/* ── Acuse de recibo ── */}
//             <Text style={S.sectionTitle}>Acuse de recibo</Text>
//             <View style={S.sigRow}>
//                {/* Firma del receptor */}
//                <View style={S.sigBox}>
//                   <Text style={S.sigBoxLabel}>Recibió conforme</Text>
//                   <View style={S.sigArea} />
//                   <Text style={S.sigLine}>____________________________________</Text>
//                   <Text style={[S.sigDept, { marginTop: 2 }]}>Nombre y firma</Text>
//                </View>

//                {/* Firma del autorizador */}
//                <View style={S.sigBox}>
//                   <Text style={S.sigBoxLabel}>Autorizó entrega</Text>
//                   <View style={S.sigArea}>{formData.voucher.requesterFirm && <Image style={S.sigImage} src={formData.voucher.requesterFirm} />}</View>
//                   <Text style={S.sigLine}>{formData.voucher.requesterName}</Text>
//                   <Text style={S.sigDept}>{formData.voucher.requesterWorkstation}</Text>
//                </View>
//             </View>

//             {/* ── Sello + Observaciones ── */}
//             <View style={S.bottomRow}>
//                <View style={S.stampBlock}>
//                   <View style={S.stampContainer}>{formData.voucher.requesterStamp ? <Image style={S.stampImage} src={formData.voucher.requesterStamp} /> : null}</View>
//                   <Text style={S.stampLabel}>Sello de recibido</Text>
//                </View>

//                <View style={S.obsBlock}>
//                   <Text style={S.obsLabel}>Observaciones</Text>
//                   <View style={S.obsArea}>
//                      <View style={S.obsLine} />
//                      <View style={S.obsLine} />
//                      <View style={S.obsLine} />
//                   </View>
//                </View>
//             </View>
//          </View>

//          {/* ═══════════════════════════════════════════════════════════
//           PIE DE PÁGINA
//       ═══════════════════════════════════════════════════════════ */}
//          <View style={S.footer}>
//             <Text style={S.footerText}>Control Vehicular · Ayuntamiento de Gómez Palacio</Text>
//             <Text style={S.footerText}>Página 1 de 1</Text>
//          </View>
//       </ModalPDF>
//    );
// };

// export default ModalContentRecivedPDF;
