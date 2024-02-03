import { FormControl, FormHelperText, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import propTypes from "prop-types";
import { useCallback, useState } from "react";
import Toast from "../../utils/Toast";
import { Field } from "formik";
import { useDropzone } from "react-dropzone";

// #region ESTILOS
// /* CONTENEDOR DE IMAGENES */
// .dropzone-container {
//    display: flex;
//    flex-direction: column;
//    align-items: center;
//    gap: 1rem;
//    width: 100%;
// }

// .dropzone {
//    border: 5px dashed #1455cb;
//    border-radius: 14px;
//    padding: 0.5rem;
//    text-align: center;
//    cursor: pointer;
//    width: 100%;
//    transition: all 0.3s ease-in-out;
// }
// .dropzone:hover {
//    border: 5px solid #1455cb;
//    background-color: #e9ecefb9;
// }

// .dropzone p {
//    font-size: 1rem;
// }

// .file-preview {
//    display: flex;
//    flex-wrap: wrap;
//    justify-content: center;
//    /* flex-direction: column; */
//    gap: 15px;
//    background-color: #e9ecef;
//    border-radius: 12px;
//    max-width: 100%;
//    overflow-x: auto;
//    /* margin-top: 5px; */
//    /* overflow-y: scroll; */
//    max-height: 350px;
// }
// .file-preview .preview-img {
//    max-width: 100px;
//    max-height: 100px;
//    object-fit: cover;
//    /* border: 1px solid #ddd; */
// }
// .file-preview .preview-pdf {
//    margin-top: 18px;
//    /* max-width: 100px;
//    max-height: 100px;
//    */
//    object-fit: cover;
//    /* border: 1px solid #ddd; */
// }

// .preview-item {
//    position: relative;
//    width: 95%; /*150px;*/
//    text-align: center;
// }

// .progress-bar {
//    width: 100%;
//    height: 10px;
//    background-color: #ddd;
// }

// .progress-bar-fill {
//    height: 100%;
//    background-color: #007bff;
// }

// .remove-button {
//    position: absolute;
//    width: 100%;
//    height: 100%;
//    top: 0%;
//    right: 0%;
//    background-color: transparent;
//    color: transparent; /* Color del icono de eliminar */
//    border: none;
//    border-radius: 12px;
//    font-weight: bolder;
//    cursor: pointer;
//    font-size: 20px;
//    transition: all 0.3s ease-in-out;
// }

// .remove-button:hover {
//    background-color: #777777a1; /* Color de fondo al pasar el ratón */
//    color: #e9ecef; /* Color del icono de eliminar al pasar el ratón */
// }

// .remove-pdf-button {
//    position: absolute;
//    width: 100%;
//    /* height: 100%; */
//    top: 0%;
//    right: 0%;
//    background-color: rgb(139, 19, 19);
//    color: whitesmoke; /* Color del icono de eliminar */
//    border: none;
//    border-radius: 12px 12px 0 0;
//    margin-bottom: 100px;
//    font-weight: bolder;
//    cursor: pointer;
//    font-size: 25px;
//    transition: all 0.3s ease-in-out;
// }
// /* CONTENEDOR DE IMAGENES */
// #endregion

export const setObjImg = (img, setImg) => {
   const imgObj = {
      file: {
         name: `${img}`
      },
      dataURL: `${import.meta.env.VITE_HOST}/${img}`
   };
   setImg([imgObj]);
};

/**
 * const [imgPreview, setImgPreview] = useState([]);
 * 
 * <InputFileComponent
      idName="img_path"
      label="Foto de la marca"
      filePreviews={imgFile}
      setFilePreviews={setImgFile}
      error={errors.img_path}
      touched={touched.img_path}
      multiple={false}
      accept={"image/*"}
   />
*
* ENVIAR (onSubmit) ----------> values.img_preview = imgPreview.length == 0 ? "" : imgPreview[0].file;
* MODIFICAR (handleModify) ---> setObjImg(formData.img_preview, setImgPreview);
* RESET ----------------------> setImgPreview([]);
*
*/
//  ===================================== COMPONENTE =====================================

const InputFileComponent = ({ idName, label, inputProps, filePreviews, setFilePreviews, error, touched, multiple, maxImages = -1, accept = null }) => {
   const [uploadProgress, setUploadProgress] = useState(0);
   // const [filePreviews, setFilePreviews] = useState([]);
   const [ttShow, setTtShow] = useState("");

   const validationQuantityImages = () => {
      if (multiple) {
         if (maxImages != -1) {
            if (filePreviews.length >= maxImages) {
               console.log("maxImages", maxImages);
               Toast.Info(`Solo se permiten cargar ${maxImages} imagenes.`);
               return false;
            }
         }
      } else {
         if (filePreviews.length >= 1) {
            Toast.Info(`Solo se permite cargar una imagen.`);
            return false;
         }
      }
      return true;
   };

   const onDrop = useCallback((acceptedFiles) => {
      setFilePreviews([]);
      // if (multiple) if (!validationQuantityImages()) return
      // Puedes manejar los archivos aceptados aquí y mostrar las vistas previas.
      acceptedFiles.forEach((file) => {
         const reader = new FileReader();

         reader.onload = async (e) => {
            const preview = {
               file,
               dataURL: reader.result
            };
            // if (multiple) if (!validationQuantityImages) return;

            // if (multiple) await setFilePreviews((prevPreviews) => [...prevPreviews, preview]);
            // else
            await setFilePreviews([preview]);
            // console.log(filePreviews);
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
   const handleRemoveImage = async (fileToRemove) => {
      // Filtra la lista de vistas previas para eliminar el archivo seleccionado.
      // console.log(filePreviews);
      // setFilePreviews((prevPreviews) => prevPreviews.filter((preview) => preview.file !== fileToRemove));
      await setFilePreviews([]);
      // console.log(filePreviews);
   };

   const { getRootProps, getInputProps } = useDropzone({
      onDrop
   });

   const handleMouseEnter = () => {
      setTtShow("tt_show");
   };
   const handleMouseLeave = () => {
      setTtShow("");
   };

   return (
      <>
         <FormControl fullWidth sx={{}}>
            <Typography variant="p" mb={1} sx={{ fontWeight: "bolder" }} htmlFor={idName}>
               {label}
            </Typography>

            <Field name={idName} id={idName}>
               {({ field, form }) => (
                  <>
                     <div className="dropzone-container">
                        <div {...getRootProps({ className: "dropzone" })}>
                           <input {...getInputProps()} multiple={multiple} accept={accept} />
                           <p style={{ display: filePreviews.length > 0 ? "none" : "block", fontStyle: "italic" }}>
                              Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos
                           </p>

                           {/* Vista previa de la imagen o PDF */}
                           <aside className="file-preview">
                              {filePreviews.map((preview) => (
                                 <div key={preview.file.name} className="preview-item">
                                    {preview.file.name.includes(".pdf") || preview.file.name.includes(".PDF") ? (
                                       <>
                                          <embed
                                             className="preview-pdf"
                                             src={preview.dataURL}
                                             type="application/pdf"
                                             width="100%"
                                             height="500px"
                                             onMouseEnter={handleMouseEnter}
                                             onMouseLeave={handleMouseLeave}
                                          />
                                          {preview.file.name !== "undefined" && (
                                             <embed
                                                className={`tooltip_imagen ${ttShow}`}
                                                src={preview.dataURL}
                                                type="application/pdf"
                                                width="50%"
                                                height="80%"
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                             />
                                          )}
                                          <button
                                             className="remove-pdf-button"
                                             onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveImage(preview.file);
                                             }}
                                          >
                                             Eliminar
                                          </button>
                                       </>
                                    ) : (
                                       <>
                                          <img className="preview-img" src={preview.dataURL} alt={preview.file.name} />
                                          {preview.file.name !== "undefined" && (
                                             <img
                                                width={"50%"}
                                                src={preview.dataURL}
                                                alt={preview.file.name}
                                                srcSet=""
                                                className={`tooltip_imagen ${ttShow}`}
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                             />
                                          )}
                                          <button
                                             className="remove-button"
                                             onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveImage(preview.file);
                                             }}
                                             onMouseEnter={handleMouseEnter}
                                             onMouseLeave={handleMouseLeave}
                                          >
                                             Eliminar
                                          </button>
                                       </>
                                    )}
                                 </div>
                              ))}
                           </aside>
                        </div>
                     </div>
                     {touched && error && (
                        <FormHelperText error id={`ht-${idName}`}>
                           {error}
                        </FormHelperText>
                     )}
                  </>
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
   inputProps: propTypes.object,
   // filePreviews: propTypes.any.isRequired,
   // setFilePreviews: propTypes.func.isRequired,
   error: propTypes.any,
   touched: propTypes.any,
   multiple: propTypes.bool,
   maxImages: propTypes.number
};

export default InputFileComponent;
