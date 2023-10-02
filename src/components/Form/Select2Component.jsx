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
   touched
}) => {
   const isOptionEqualToValue = (option, value) => {
      // console.log("option", option);
      // console.log("value", value);
      return option.label === value;
   };

   const handleChangeValue = (value, input, setFieldValue) => {
      try {
         if (!value) return (valueLabel = "Seleccione una opción...");
         formDataProp = value ? value.id : 0;
         objProp = value ? value.id : 0;
         setFieldValue(input, value ? value.id : 0);
         valueLabel = value.label; // repetir este paso afuera

         handleChangeValueSuccess(value);
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
            isOptionEqualToValue={isOptionEqualToValue}
            renderInput={(params) => <TextField {...params} label={label} />}
            onChange={(e, newValue) => {
               handleChange(e);
               handleChangeValue(newValue, idName, setFieldValue);
            }}
            onBlur={handleBlur}
            fullWidth={fullWidth || true}
            // disabled={values.id == 0 ? false : true}
            error={error && touched}
            defaultValue={valueLabel || "Seleccione una opción..."}
            value={valueLabel || "Seleccione una opción..."}
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
