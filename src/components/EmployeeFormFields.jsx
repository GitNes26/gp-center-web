import { InputComponent, DividerComponent, FileInputComponent, PasswordCompnent } from "./Form/FormikComponents";
import PropTypes from "prop-types";

export const EmployeeFormFields = ({
   handleInputPayRoll,
   imgAvatar,
   setImgAvatar,
   showGpcEmployeeId = true,
   showDividerEmployee = true,
   showAvatar = true,
   readonlyFields = true,
   showDepartment = true,
   showNameFields = true
}) => {
   return (
      <>
         <InputComponent col={12} idName={"id"} label={"id"} placeholder={"id"} hidden={true} />
         {showGpcEmployeeId && <InputComponent col={12} idName={"gpc_employee_id"} label={"gpc_employee_id"} placeholder={""} hidden={true} />}
         <InputComponent col={12} idName={"employee_code_exist"} label={"employee_code_exist"} placeholder={""} hidden={true} />

         {showDividerEmployee && <DividerComponent title={"DATOS DE EMPLEADO"} />}

         <InputComponent col={4} idName={"employee_code"} label={"Número de Nómina *"} placeholder={"999999"} type={"number"} handleInputExtra={handleInputPayRoll} />

         {showDepartment && (
            <>
               <InputComponent
                  col={8}
                  idName={"department"}
                  label={"Departamento *"}
                  placeholder={"Ingrese su departamento"}
                  textStyleCase={true}
                  disabled={readonlyFields}
               />
               <InputComponent col={12} idName={"position_name"} label={"Puesto *"} placeholder={"Ingrese su puesto"} textStyleCase={true} disabled={readonlyFields} />
            </>
         )}

         {showNameFields && (
            <>
               <InputComponent col={12} idName={"name"} label={"Nombre(s) *"} placeholder={"Ingresa tu(s) nombre(s)"} textStyleCase={true} disabled={readonlyFields} />
               <InputComponent
                  col={6}
                  idName={"plast_name"}
                  label={"Apellido Paterno *"}
                  placeholder={"Ingresa tu primer apellido"}
                  textStyleCase={true}
                  disabled={readonlyFields}
               />
               <InputComponent
                  col={6}
                  idName={"mlast_name"}
                  label={"Apellido Materno *"}
                  placeholder={"Ingresa tu segundo apellido"}
                  textStyleCase={true}
                  disabled={readonlyFields}
               />
            </>
         )}

         {showAvatar && (
            <FileInputComponent
               col={12}
               idName="avatar"
               label="Foto de Perfil"
               filePreviews={imgAvatar}
               setFilePreviews={setImgAvatar}
               multiple={false}
               accept={"image/*"}
            />
         )}
      </>
   );
};

export const UserAccessFields = ({ newPasswordChecked, setNewPasswordChecked, checkedShowSwitchPassword, cellphoneRequired = false }) => (
   <>
      <DividerComponent title={"DATOS DE ACCESO"} />
      <InputComponent col={6} idName={"username"} label={"Nombre de usuario"} placeholder={"Ingrese el nombre de usuario"} textStyleCase={null} required />
      <InputComponent col={6} idName={"email"} label={"Correo electrónico"} placeholder={"mi@correo.com"} textStyleCase={false} type={"email"} required />
      <PasswordCompnent
         col={6}
         idName={"password"}
         label={"Contraseña"}
         newPasswordChecked={newPasswordChecked}
         setNewPasswordChecked={setNewPasswordChecked}
         checkedShowSwitchPassword={checkedShowSwitchPassword}
         required
      />
      <InputComponent
         col={6}
         idName={"cellphone"}
         label={"Número telefónico"}
         placeholder={"10 dígitos"}
         type={"cellphone"}
         inputProps={{ maxLength: 10 }}
         required={cellphoneRequired}
      />
   </>
);

EmployeeFormFields.propTypes = {
   handleInputPayRoll: PropTypes.func.isRequired,
   imgAvatar: PropTypes.array.isRequired,
   setImgAvatar: PropTypes.func.isRequired,
   showGpcEmployeeId: PropTypes.bool,
   showDividerEmployee: PropTypes.bool,
   showAvatar: PropTypes.bool,
   readonlyFields: PropTypes.bool,
   showDepartment: PropTypes.bool,
   showNameFields: PropTypes.bool
};

UserAccessFields.propTypes = {
   newPasswordChecked: PropTypes.bool.isRequired,
   setNewPasswordChecked: PropTypes.func.isRequired,
   checkedShowSwitchPassword: PropTypes.bool.isRequired,
   cellphoneRequired: PropTypes.bool
};

export default EmployeeFormFields;
