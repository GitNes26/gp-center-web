import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import PropTypes, { string } from "prop-types";

const InputFileComponent = ({
   idName,
   label,
   value,
   placeholder,
   handleChange,
   handleBlur,
   inputProps,
   setFieldValue,
   setImgFile,
   imagePreview,
   setImagePreview,
   error,
   touched
}) => {
   // const [imagePreview, setImagePreview] = useState(null);

   const handleChangeImg = (event) => {
      // if (event.target.files)
      const file = event.target.files[0]; // Obtenemos el primer archivo del campo de entrada
      setImgFile(file);

      if (file) {
         const reader = new FileReader();

         reader.onload = (e) => {
            setImagePreview(e.target.result);
         };

         reader.readAsDataURL(file);
      }
   };

   return (
      <>
         <TextField
            id={idName}
            name={idName}
            label={label}
            type="file"
            // value={value}
            placeholder={placeholder}
            onChange={(e) => {
               handleChange(e);
               handleChangeImg(e, setFieldValue);
            }}
            onBlur={handleBlur}
            variant="standard"
            inputProps={inputProps}
            fullWidth
            // disabled={values.id == 0 ? false : true}
            // inputRef={(el) => (inputsRef.current[0] = el)}
            // inputRef={inputRefVehicle}
            error={error && touched}
            helperText={error && touched && error}
         />

         {/* Vista previa de la imagen */}
         <Box textAlign={"center"} sx={{ bgcolor: "#E9ECEF", borderRadius: "0  0 12px 12px" }}>
            {imagePreview && <img alt="Vista previa de la imagen" src={imagePreview} style={{ maxWidth: 250, maxHeight: 250 }} />}
         </Box>
      </>
   );
};

InputFileComponent.PropTypes = {
   idName: PropTypes.string.isRequired,
   label: PropTypes.string.isRequired,
   value: PropTypes.any,
   placeholder: PropTypes.string.isRequired,
   handleChange: PropTypes.func.isRequired,
   handleBlur: PropTypes.func.isRequired,
   inputProps: PropTypes.object,
   setFieldValue: PropTypes.func.isRequired,
   setImgFile: PropTypes.func.isRequired,
   imagePreview: PropTypes.string.isRequired,
   setImagePreview: PropTypes.func.isRequired,
   error: PropTypes.any,
   touched: PropTypes.any
};

export default InputFileComponent;
