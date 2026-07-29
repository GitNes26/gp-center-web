import { InputComponent, DividerComponent, FileInputComponent } from "./Form/FormikComponents";

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

export default EmployeeFormFields;
