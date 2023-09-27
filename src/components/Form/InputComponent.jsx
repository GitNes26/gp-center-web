const InputComponent = ({ idName, label, type, value, placeholder, inputProps = {}, fullWidth = true, handleChange, handleBlur }) => {
   return (
      <TextField
         id={idName}
         name={idName}
         label={label || ""}
         type={type || "text"}
         fullWidth={fullWidth}
         value={value}
         placeholder={placeholder || "Ingresa tu info"}
         inputProps={inputProps}
         onChange={handleChange}
         onBlur={handleBlur}
         // disabled={values.id == 0 ? false : true}
         error={errors.username && touched.username}
         helperText={errors.username && touched.username && errors.username}
      />
   );
};
