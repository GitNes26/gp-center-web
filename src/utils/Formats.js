import moment from "moment";
import Toast from "./Toast";
moment.locale("es-mx");

//#region /** FECHAS - FORMATEADO */
function validateRangeDates(action, input_initial_date, input_final_date) {
   let current_date = new Date();
   yesterday = new Date(current_date.setDate(current_date.getDate() - 1));
   yesterday = new Date(yesterday.setHours(23, 59, 59));
   yesterday = yesterday.getTime();

   date1 = new Date(input_initial_date.val());
   date1 = new Date(date1.setDate(date1.getDate() + 1));
   date1 = new Date(date1.setHours(0, 0, 0));
   data_date1 = new Date(date1).getTime();

   date2 = new Date(input_final_date.val());
   date2 = new Date(date2.setDate(date2.getDate() + 1));
   date2 = new Date(date2.setHours(11, 59, 59));
   data_date2 = new Date(date2).getTime();

   if (action == "create") {
      if (data_date1 <= yesterday) {
         showToast("warning", "No puedes publicar con fecha anterior a hoy.");
         input_initial_date.focus();
         return false;
      }
   }
   if (data_date1 > data_date2) {
      showToast("warning", "Rango de fechas inválido.");
      input_final_date.focus();
      return false;
   }
   return true;
}

function binaryDateTimeFormat(the_date) {
   let date = new Date(parseInt(the_date.substr(6)));
   let datetime = moment(date).format("MM-DD-YYYY h:mm:ss a");
   // let datetime = new Intl.DateTimeFormat("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric', hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).format(date);

   return datetime;
}

export function formatDatetime(the_date, long_format = true, format = null) {
   moment.locale("es-mx");

   if (the_date == null) return "Sin Fecha";
   let date = new Date(the_date);
   let datetime;

   if (the_date.length <= 10) {
      date = new Date(date.setDate(date.getDate() + 1));
      datetime = moment(date).format("DD-MM-YYYY");
      // console.log("formaaatFecha", the_date, "-->", datetime);
      return datetime;
      // return datetime = new Intl.DateTimeFormat("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric'}).format(date);
   }

   date = new Date(the_date);
   let formato = long_format ? "DD-MM-YYYY h:mm:ss a" : "DD-MM-YYYY";
   datetime = moment(date).locale("es-mx").format(formato);
   if (["LL", "LLL", "ll", "lll", "sello"].includes(format)) {
      let mounth = datetime.split("-")[1];
      const mounths = {
         "01": format == "LL" ? "-ENE-" : format == "LLL" ? "-ENERO-" : format == "ll" ? " de ene de " : format == "lll" ? " de enero de " : " ENE ",
         "02": format == "LL" ? "-FEB-" : format == "LLL" ? "-FEBRERO-" : format == "ll" ? " de feb de " : format == "lll" ? " de febrero de " : " FEB ",
         "03": format == "LL" ? "-MAR-" : format == "LLL" ? "-MARZO-" : format == "ll" ? " de mar de " : format == "lll" ? " de marzo de " : " MAR ",
         "04": format == "LL" ? "-ABR-" : format == "LLL" ? "-ABRIL-" : format == "ll" ? " de abr de " : format == "lll" ? " de abril de " : " ABR ",
         "05": format == "LL" ? "-MAY-" : format == "LLL" ? "-MAYO-" : format == "ll" ? " de may de " : format == "lll" ? " de mayo de " : " MAY ",
         "06": format == "LL" ? "-JUN-" : format == "LLL" ? "-JUNIO-" : format == "ll" ? " de jun de " : format == "lll" ? " de junio de " : " JUN ",
         "07": format == "LL" ? "-JUL-" : format == "LLL" ? "-JULIO-" : format == "ll" ? " de jul de " : format == "lll" ? " de julio de " : " JUL ",
         "08": format == "LL" ? "-AGO-" : format == "LLL" ? "-AGOSTO-" : format == "ll" ? " de ago de " : format == "lll" ? " de agosto de " : " AGO ",
         "09": format == "LL" ? "-SEP-" : format == "LLL" ? "-SEPTIEMBRE-" : format == "ll" ? " de sep de " : format == "lll" ? " de septiembre de " : " SEP ",
         10: format == "LL" ? "-OCT-" : format == "LLL" ? "-OCTUBRE-" : format == "ll" ? " de oct de " : format == "lll" ? " de octubre de " : " OCT ",
         11: format == "LL" ? "-NOV-" : format == "LLL" ? "-NOVIEMBRE-" : format == "ll" ? " de nov de " : format == "lll" ? " de noviembre de " : " NOV ",
         12: format == "LL" ? "-DIC-" : format == "LLL" ? "-DICIEMBRE-" : format == "ll" ? " de dic de " : format == "lll" ? " de diciembre de " : " DIC "
      };
      const mounthNumber = datetime.split("-")[1];

      datetime = datetime.replace(`-${mounthNumber}-`, `${mounths[mounthNumber]}`);
   }
   // console.log(datetime);
   return datetime;
   // return datetime = new Intl.DateTimeFormat("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric', hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).format(date);
}

export function formatDatetimeToSQL(the_date) {
   let datetime = moment(the_date).format("YYYY-MM-DDThh:mm:ss");
   return datetime;
}
//#endregion /** FECHAS - FORMATEADO */

export function formatCurrency(amount, MX = true, show_currency = true) {
   let divisa = "MXN";
   let total = new Intl.NumberFormat("es-MX").format(amount);
   if (!MX) {
      divisa = "USD";
      total = new Intl.NumberFormat("en-US").format(amount);
   }

   if (!total.includes(".")) total += ".00";
   let decimales = total.split(".").reverse();
   if (decimales[0].length == 1) total += "0";
   if (amount == 0) total == "0.00";
   show_currency ? (total = `$${total} ${divisa}`) : (total = `$${total}`);

   return total;
}
export function formatearCantidadDeRenglones(tds) {
   $.each(tds, function (i, elemento) {
      let td = $(elemento);
      let cantidad = td.text();
      let cantidad_formateada = formatCurrency(cantidad);
      td.html(`${cantidad_formateada}`);
   });
}

export function formatPhone(phone) {
   return `(${phone.slice(0, 3)})${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(-2)}`;
}

export function formatToLowerCase(event) {
   const newText = event.target.value.toLowerCase();
   return newText;
}
export function formatToUpperCase(event) {
   const newText = event.target.value.toUpperCase();
   return newText;
}

export const handleInputFormik = async (e, setFieldValue, input, toUpper = true) => {
   try {
      const newText = toUpper ? await formatToUpperCase(e) : await formatToLowerCase(e);
      setFieldValue(input, newText);
   } catch (error) {
      console.log(error);
      Toast.Error(error);
   }
};
export const handleInputStringCase = async (e, setState, toUpper = true) => {
   try {
      const newText = toUpper ? await formatToUpperCase(e) : await formatToLowerCase(e);
      setState(newText);
   } catch (error) {
      console.log(error);
      Toast.Error(error);
   }
};
