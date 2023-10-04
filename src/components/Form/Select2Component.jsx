import { Autocomplete, FormControl, FormHelperText, TextField } from "@mui/material";
import Toast from "../../utils/Toast";

const Select2Component = ({
   idName,
   label,
   valueLabel,
   formDataProp,
   objProp,
   placeholder,
   options,
   fullWidth,
   handleChange,
   handleChangeValueSuccess,
   setFieldValue,
   handleBlur,
   error,
   touched,
   disabled = false
}) => {
   const isOptionEqualToValue = (option, value) => {
      if (option.label) {
         if (typeof value === "string") return option.label === value;
         else {
            // console.log(value);
            // value = option.label;
            // console.log(value);
            return option.id === value;
         }
      } else return option === value;
   };

   const handleChangeValue = (value, input, setFieldValue) => {
      try {
         // console.log("value del changeValue", value);
         if (!value) return (valueLabel = "Selecciona una opción...");
         formDataProp = value ? value.id : 0;
         objProp = value ? value.id : 0;
         setFieldValue(input, value ? value.id : 0);
         valueLabel = value.label; // repetir este paso afuera

         if (handleChangeValueSuccess) handleChangeValueSuccess(value); //en esta funcion
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   return (
      <FormControl fullWidth>
         <Autocomplete
            disablePortal
            openOnFocus
            id={idName}
            name={idName}
            label={label}
            placeholder={placeholder}
            options={options}
            // getOptionLabel={(option) => option.toString()}
            isOptionEqualToValue={isOptionEqualToValue}
            renderInput={(params) => <TextField {...params} label={label} />}
            onChange={(e, newValue) => {
               handleChange(e);
               handleChangeValue(newValue, idName, setFieldValue);
            }}
            onBlur={handleBlur}
            fullWidth={fullWidth || true}
            // disabled={values.id == 0 ? false : true}
            disabled={disabled}
            error={error && touched}
            defaultValue={valueLabel || "Selecciona una opción..."}
            value={valueLabel || "Selecciona una opción..."}
         />
         {touched && error && (
            <FormHelperText error id={`ht-${idName}`}>
               {error}
            </FormHelperText>
         )}
      </FormControl>
   );
};
export default Select2Component;
