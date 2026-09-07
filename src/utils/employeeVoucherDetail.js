export const getEmployeeVoucherFields = (employee) => {
   const fields = {
      employee_code: employee?.employee_code,
      department: employee?.department_name ?? employee?.department ?? employee?.departamento,
      name: employee?.name ?? employee?.nombreE,
      plast_name: employee?.plast_name ?? employee?.apellidoP,
      mlast_name: employee?.mlast_name ?? employee?.apellidoM,
      cellphone: employee?.cellphone
   };

   return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== null && value !== undefined && value !== ""));
};

export const updateVoucherDetailEmployee = (details, rowKey, employee) => {
   const employeeFields = getEmployeeVoucherFields(employee);

   return details.map((detail) => (String(detail.key) === String(rowKey) ? { ...detail, ...employeeFields } : detail));
};

export const mergeEmployeeFieldsIntoVoucherDetail = (detail, employeeFields) => ({ ...detail, ...employeeFields });
