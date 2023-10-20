import { FormControl, InputLabel, TextField } from "@mui/material";
import { Box } from "@mui/system";
import propTypes from "prop-types";
import { useCallback, useState } from "react";
import Toast from "../../utils/Toast";
import { Field } from "formik";
import Dropzone, { useDropzone } from "react-dropzone";
import { Label } from "@mui/icons-material";

const InputFileComponent = ({
   idName,
   label,
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
   const [uploadProgress, setUploadProgress] = useState(0);
   const [filePreviews, setFilePreviews] = useState([]);

   const onDrop = useCallback((acceptedFiles) => {
      if (filePreviews.length > 0) {
         // Si ya hay una imagen, muestra un mensaje de error o notificación.
         Toast.Info("Solo se permite cargar una imagen.");
         return;
      }
      // Puedes manejar los archivos aceptados aquí y mostrar las vistas previas.
      acceptedFiles.forEach((file) => {
         const reader = new FileReader();

         reader.onload = (e) => {
            const preview = {
               file,
               dataURL: reader.result
            };
            setImgFile(preview.file);

            if (filePreviews.length > 0) {
               // Si ya hay una imagen, muestra un mensaje de error o notificación.
               Toast.Info("Solo se permite cargar una imagen.");
               return;
            }

            // setFilePreviews((prevPreviews) => [...prevPreviews, preview]);
            setFilePreviews([preview]);
            // setImagePreview(preview);
         };

         reader.readAsDataURL(file);
      });
   }, []);

   const simulateUpload = () => {
      // Simulamos la carga con un temporizador.
      setTimeout(() => {
         const progress = uploadProgress + 10;
         setUploadProgress(progress);

         if (progress < 100) {
            // Si no se ha alcanzado el 100% de progreso, simulamos más carga.
            simulateUpload();
         } else {
            // Cuando se completa la carga, restablecemos el progreso.
            setUploadProgress(0);
         }
      }, 1000);
   };
   const handleRemoveImage = (fileToRemove) => {
      // Filtra la lista de vistas previas para eliminar el archivo seleccionado.
      // console.log(filePreviews);
      // setFilePreviews((prevPreviews) => prevPreviews.filter((preview) => preview.file !== fileToRemove));
      setFilePreviews([]);
      // console.log(filePreviews);
   };

   const { getRootProps, getInputProps } = useDropzone({
      onDrop
   });

   // const handleChangeImg = (event) => {
   //    // if (event.target.files)
   //    const file = event.target.files[0]; // Obtenemos el primer archivo del campo de entrada
   //    setImgFile(file);

   //    if (file) {
   //       const reader = new FileReader();

   //       reader.onload = (e) => {
   //          setImagePreview(e.target.result);
   //       };

   //       reader.readAsDataURL(file);
   //    }
   // };

   return (
      <>
         <FormControl fullWidth sx={{}}>
            <InputLabel htmlFor={idName}>{label}</InputLabel>

            <Field name={idName} id={idName}>
               {({ field, form, meta }) => (
                  <div className="dropzone-container">
                     <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} multiple={false} />
                        <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos</p>

                        {/* Vista previa de la imagen */}
                        <aside className="file-preview">
                           {filePreviews.map((preview) => (
                              <div key={preview.file.name} className="preview-item">
                                 <img src={preview.dataURL} alt={preview.file.name} />
                                 <p>{preview.file.name}</p>
                                 <button
                                    className="remove-button"
                                    onClick={(e) => {
                                       e.preventDefault();
                                       handleRemoveImage(preview.file);
                                    }}
                                 >
                                    Eliminar
                                 </button>
                              </div>
                           ))}
                        </aside>
                     </div>
                  </div>
               )}
            </Field>
         </FormControl>
      </>
   );
};

const InputFileComponent1 = ({
   idName,
   label,
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

InputFileComponent.propTypes = {
   idName: propTypes.string.isRequired,
   label: propTypes.string.isRequired,
   placeholder: propTypes.string.isRequired,
   handleChange: propTypes.func.isRequired,
   handleBlur: propTypes.func.isRequired,
   inputProps: propTypes.object,
   setFieldValue: propTypes.func.isRequired,
   setImgFile: propTypes.func.isRequired,
   // imagePreview: propTypes.any.isRequired,
   setImagePreview: propTypes.func.isRequired,
   error: propTypes.any,
   touched: propTypes.any
};

export default InputFileComponent;
