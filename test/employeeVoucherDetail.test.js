import test from "node:test";
import assert from "node:assert/strict";
import { getEmployeeVoucherFields, mergeEmployeeFieldsIntoVoucherDetail, updateVoucherDetailEmployee } from "../src/utils/employeeVoucherDetail.js";

test("obtiene los campos de empleado y conserva valores vacíos fuera de la respuesta", () => {
   assert.deepEqual(getEmployeeVoucherFields({ employee_code: "12345", department_name: "Sistemas", name: "Ana", cellphone: null }), {
      employee_code: "12345",
      department: "Sistemas",
      name: "Ana"
   });
});

test("acepta los nombres de campos alternativos de Recursos Humanos", () => {
   assert.deepEqual(getEmployeeVoucherFields({ nombreE: "Luis", apellidoP: "Pérez", apellidoM: "López", departamento: "Obras" }), {
      department: "Obras",
      name: "Luis",
      plast_name: "Pérez",
      mlast_name: "López"
   });
});

test("actualiza únicamente la fila cuya clave coincide", () => {
   const details = [
      { key: 1, employee_code: "0", name: "" },
      { key: 2, employee_code: "", name: "" }
   ];

   assert.deepEqual(updateVoucherDetailEmployee(details, 2, { employee_code: "12345", name: "Ana" }), [
      { key: 1, employee_code: "0", name: "" },
      { key: 2, employee_code: "12345", name: "Ana" }
   ]);
});

test("fusiona los datos autocompletados antes de guardar la fila", () => {
   assert.deepEqual(
      mergeEmployeeFieldsIntoVoucherDetail({ key: 1, employee_code: "612024", department: "", name: "" }, { department: "Sistemas", name: "Ana" }),
      { key: 1, employee_code: "612024", department: "Sistemas", name: "Ana" }
   );
});
