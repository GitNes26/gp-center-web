import { FormControl } from "@mui/material";
import { Field } from "formik";

import Typography from "@mui/material/Typography";

import { InputAdornment, OutlinedInput } from "@mui/material";
import { gpcDark, gpcLight } from "../../context/GlobalContext";
import { styled } from "@mui/material/styles";
import { shouldForwardProp } from "@mui/system";

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
   // width: 434,
   // marginLeft: 16,
   // paddingLeft: 16,
   // paddingRight: 16,
   "& input": {
      background: "#fff !important",
      paddingLeft: "10px !important"
   },
   [theme.breakpoints.down("lg")]: {
      width: 250
   },
   [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff"
   }
}));

const InputComponentv2 = ({
   idName,
   label,
   type = "text",
   value = null,
   placeholder,
   setFieldValue,
   onChange,
   onBlur,
   error,
   touched,
   showErrorInput = null,
   formData
}) => {
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
                  <OutlineInputStyle
                     type={type}
                     value={value}
                     placeholder={placeholder}
                     {...field}
                     fullWidth
                     onChange={(val) => {
                        form.setFieldValue(field.name, val);
                        // handleChangeBirthdate(date, form.setFieldValue);
                     }}
                     // onChange={handleChange}
                     // onBlur={handleBlur}
                     // InputProps={{ }}
                     // disabled={values.id == 0 ? false : true}
                     error={error && touched}
                     helperText={error && touched && error}
                     // onChange={(e) => handleChangeSearch(e.target.value)}
                     // onKeyUp={(e) => handleKeyUpSearch(e)}
                     startAdornment={
                        // <Tooltip title={""} placement={"top"}>
                        <InputAdornment position="start" sx={{ mx: 2 }}>
                           <Typography sx={{ color: gpcLight, fontWeight: "bolder", fontSize: 16 }}>{label}</Typography>
                           {/* <IconSearch stroke={2.5} size="1.5rem" color={theme.palette.grey[500]} /> */}
                        </InputAdornment>
                        // </Tooltip>
                     }
                     aria-describedby={"search-helper-text"}
                     inputProps={{ "aria-label": "weight" }}
                     sx={{ backgroundColor: gpcDark, m: 1 }}
                     // {...prop}
                  />
                  {/* {touched && error && (
                     <FormHelperText error id={`ht-${idName}`}>
                        {showErrorInput ? showErrorInput(2, error) : error}
                     </FormHelperText>
                  )} */}
               </>
            )}
         </Field>
      </FormControl>
   );
};

export default InputComponentv2;
