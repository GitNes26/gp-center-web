// import logo from '../../assets/images/logo-gpd.png';
import { Document, Page, StyleSheet, View } from "@react-pdf/renderer";
import backgroundImage from "../assets/images/Oficio.jpg";
// import firmademo from "../../assets/images/FirmaDemo.png";

//#region FUENTES
Font.register({
   family: "Roboto-bold",
   src: "/src/assets/fonts/Roboto-Bold.ttf"
});

Font.register({
   family: "Roboto-Regular",
   src: "/src/assets/fonts/Roboto-Regular.ttf"
});
Font.register({
   family: "Roboto-Italic",
   src: "/src/assets/fonts/Roboto-Italic.ttf"
});

Font.register({
   family: "Protest-Riot",
   src: "/src/assets/fonts/ProtestRiot-Regular.ttf"
});

//#endregion

// Crear estilos
const styles = StyleSheet.create({
   body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35
   },
   page: {
      flexDirection: "row"
      // backgroundColor: '#E4E4E4',
   },
   section: {
      margin: 10
   },
   image: {
      width: "30%",
      mmarginVertical: 15,
      marginHorizontal: 180
   },
   header: {
      fontSize: 12,
      marginTop: 10,
      textAlign: "center",
      color: "grey"
   },
   pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 10,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey"
   },
   subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: "Roboto-bold"
   },
   title: {
      fontSize: 18,
      textAlign: "center",
      fontFamily: "Roboto-bold"
   },
   author: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 20
   },
   division: {
      fontSize: 15,
      textAlign: "center",
      fontFamily: "Roboto-bold",
      textDecoration: "underline"
   },
   apartado: {
      fontFamily: "Roboto-bold",
      fontSize: 15
   },
   text: {
      fontSize: 10,
      color: "#000"
   },
   pageBody: {
      position: "relative"
   },
   image2: {
      width: "100%",
      height: "100%"
   },
   viewBgImage: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%"
      // opacity: "0.5"
   },
   viewContainer: {
      position: "absolute",
      top: 125,
      left: 30,
      // height: 540,
      width: "90%"
   },
   firmacontainer: {
      textAlign: "center",
      fontSize: 13,
      height: 150,
      fontWeight: "heavy",
      marginLeft: 30
   },
   cuerpomensaje: {
      fontSize: 11,
      height: 300,
      textAlign: "justify",
      paddingHorizontal: 35
   },
   firma: {
      width: "70%",
      left: "60"
   },
   foliofecha: {
      fontSize: 12,
      textAlign: "right"
   },
   departamento: {
      fontSize: 12
   }

   // textContent: {
   //     textAlign: "justify",
   //     lineHeight: 1.5,
   // }
});

// Componente que representa el documento OficioPDF
export const RequestPDF = ({ formData }) => {
   return (
      <Document>
         {/* <Page size="A4" style={styles.body} wrap>
                
            </Page> */}
         <Page size="LETTER" style={styles.page} wrap>
            {/* <View style={styles.pageBody}> */}
            <View style={styles.viewBgImage}>
               <Text style={styles.header} fixed>
                  ~ Secretaría Particular ~
               </Text>
               <Image style={styles.image2} src={backgroundImage} />
            </View>
            <View style={styles.viewContainer}>
               {/* <Image style={styles.image} src={logo}></Image> */}
               {/* <Text style={styles.title}>Solicitud Ciudadana</Text>
                    <Text style={styles.author}>Sec. Particular</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                        <Text style={styles.author}><Text style={{ fontFamily: 'Roboto-bold', textDecoration: 'underline' }}>Fecha de Solicitud:</Text> {formData.fecha_solicitud}</Text>
                        <Text style={styles.author}><Text style={{ fontFamily: 'Roboto-bold', textDecoration: 'underline' }}>Folio:</Text> {formData.id}</Text>
                    </View> */}

               <View style={styles.foliofecha}>
                  <Text style={{ fontFamily: "Roboto-bold" }}>{formData.folio}</Text>
                  <Text style={{ fontFamily: "Roboto-Regular" }}>Gómez Palacio, Dgo., {formData.fecha_solicitud}</Text>
               </View>

               <View style={styles.departamento}>
                  <Text style={{ fontFamily: "Roboto-bold" }}>{formData.director}</Text>
                  <Text style={{ fontFamily: "Roboto-bold", marginBottom: 15 }}>{formData.department}</Text>
                  <Text style={{ fontFamily: "Roboto-bold", marginBottom: 15 }}>P R E S E N T E.- </Text>
                  <Text style={{ fontFamily: "Roboto-Regular", marginBottom: 15 }}>
                     Me permito enviar a la consideración del área a su cargo, el siguiente apunte recibido en el Despacho de la Presidenta Municipal Juana Leticia
                     Herrera Ale, como sigue:{" "}
                  </Text>
               </View>

               <View style={{ flexDirection: "row", marginBottom: 20 }}>
                  <Text style={{ fontFamily: "Roboto-bold", fontSize: 12, marginRight: 15 }}>Remite:</Text>
                  <View style={{ flexDirection: "column" }}>
                     <Text style={{ fontFamily: "Roboto-Regular", fontSize: 12 }}>Folio: {formData.id}</Text>
                     <Text style={{ fontFamily: "Roboto-Regular", fontSize: 12 }}>
                        Nombre: {formData.nombre} {formData.app} {formData.apm}
                     </Text>
                     <Text style={{ fontFamily: "Roboto-Regular", fontSize: 12 }}>Empresa: {formData.cargo}</Text>
                     <Text style={{ fontFamily: "Roboto-Regular", fontSize: 12 }}>Teléfono: {formData.telefono}</Text>
                  </View>
               </View>

               <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontFamily: "Roboto-bold", fontSize: 12, marginRight: 15 }}>Asunto:</Text>
                  <View style={{ flexDirection: "column", width: 600 }}>
                     <Text style={{ fontFamily: "Roboto-Regular", fontSize: 12 }}>{formData.observaciones}</Text>
                  </View>
               </View>

               <View style={{ marginTop: 50 }}>
                  <Text style={{ fontFamily: "Roboto-bold", fontSize: 12 }}>Instrucción:</Text>
                  <Text style={{ fontFamily: "Roboto-Regular", fontSize: 12 }}>{formData.tipo_documento}</Text>
               </View>

               <View style={{ marginTop: 50, flexDirection: "row" }}>
                  <Text style={{ fontFamily: "Roboto-bold", fontSize: 12, marginRight: 20 }}>Requiere respuesta:</Text>
                  <Text style={{ fontFamily: "Roboto-Regular", fontSize: 12 }}>SI</Text>
               </View>

               <View>
                  <Text style={{ fontFamily: "Roboto-Regular", fontSize: 12, marginBottom: 12 }}>Sin otro particular, agradeciendo la atención al presente.</Text>
               </View>

               <View style={styles.firmacontainer}>
                  <Text style={{ fontFamily: "Roboto-bold", fontSize: 16 }}>A T E N T A M E N T E: </Text>
                  <Text style={{ fontFamily: "Roboto-bold", fontSize: 14 }}>COORDINADORA DE SECRETARÍA PARTICULAR </Text>
                  <Image style={styles.firma} src={firmademo} />
                  <Text>______________________________________</Text>
                  <Text style={{ fontFamily: "Roboto-bold", fontSize: 14 }}>C.P. VERÓNICA BEERNAERT VANEGAS </Text>
               </View>
            </View>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
            {/* </View> */}
         </Page>
      </Document>
   );
};
