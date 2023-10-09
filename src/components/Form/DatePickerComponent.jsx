import { FormControl, FormHelperText } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Field } from "formik";

const DatePickerComponent = ({ idName, label, format = "DD/MM/YYYY", value, setFieldValue, onChange, onBlur, error, touched, showErrorInput, formData }) => {
   const handleChangeBirthdate = (date, setFieldValue) => {
      // console.log("valor del datePicker en daysjs", date);
      const birthdate = dayjs(date).format("YYYY-MM-DD");
      formData.birthdate = birthdate;
      setFieldValue("birthdate", formData.birthdate);
   };

   return (
      <FormControl fullWidth sx={{}}>
         <Field name={idName} id={idName}>
            {({ field, form, meta }) => (
               <>
                  <DatePicker
                     label={label}
                     format={format}
                     inputVariant="outlined"
                     fullWidth
                     {...field}
                     value={dayjs(field.value) || null}
                     onChange={(date) => {
                        form.setFieldValue(field.name, date);
                        handleChangeBirthdate(date, form.setFieldValue);
                     }}
                     // disabled={values.id == 0 ? false : true}
                     error={error && touched}
                  />
                  {touched && error && (
                     <FormHelperText error id={`ht-${idName}`}>
                        {showErrorInput(2, error)}
                     </FormHelperText>
                  )}
               </>
            )}
         </Field>
      </FormControl>
   );
};

export default DatePickerComponent;
