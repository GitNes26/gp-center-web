import { Autocomplete, FormControl, FormHelperText, TextField } from "@mui/material";
import Toast from "../../utils/Toast";
import { useEffect } from "react";

const Select2Component = ({
   idName,
   label,
   valueLabel,
   values,
   formData,
   setFormData,
   formDataLabel,
   placeholder,
   options,
   fullWidth,
   handleChange,
   handleChangeValueSuccess,
   setValues,
   handleBlur,
   error,
   touched,
   disabled = false
   // inputref = null
}) => {
   const isOptionEqualToValue = (option, value) => {
      // console.log("option", option);
      // console.log("value", value);
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

   const handleChangeValue = async (value, setValues) => {
      try {
         if (!value) return (valueLabel = "Selecciona una opción...");
         valueLabel = value.label; // repetir este paso afuera
         values[idName] = value.id;
         values[formDataLabel] = value.label;
         console.log("values", values);
         console.log("formData", formData);
         await setFormData(values);
         await setValues(formData);
         console.log("formData", formData);

         if (handleChangeValueSuccess) handleChangeValueSuccess(value, setValues); //en esta funcion
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      // console.log("useEffect");
   }, [valueLabel]);

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
               handleChangeValue(newValue, setValues);
            }}
            onBlur={handleBlur}
            fullWidth={fullWidth || true}
            // disabled={values.id == 0 ? false : true}
            disabled={disabled}
            // inputRef={inputref}
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
