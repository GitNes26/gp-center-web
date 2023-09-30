import DrawerTable from "../../../components/DrawerTable";

const PlatesRegisters = ({ openDialog, setOpenDialog }) => {
   const columns = [
      { id: "plates", label: "Placas", minWidth: 170, format: (value) => value.toUpperCase() },
      { id: "initial_date", label: "Fecha de Plaqueo", minWidth: 100, align: "right", format: (value) => formatDatetime(value, true) },
      { id: "due_date", label: "Fecha de Vencimiento", minWidth: 100, align: "right", format: (value) => formatDatetime(value, true) }
      // {
      //    id: "density",
      //    label: "Density",
      //    minWidth: 170,
      //    align: "right",
      //    format: (value) => value.toFixed(2)
      // }
   ];
   function createData(plates, initial_date, due_date) {
      return { plates, initial_date, due_date };
   }
   const rows = [
      createData("AAA-00-00", "2020-01-01", "2025-01-01"),
      createData("AAA-00-01", "2020-01-01", "2025-01-01"),
      createData("AAA-00-02", "2020-01-01", "2025-01-01"),
      createData("AAA-00-03", "2020-01-01", "2025-01-01")
   ];
   return <DrawerTable title={"REGISTRO DE PLAQUEO"} openDialog={openDialog} setOpenDialog={setOpenDialog} columns={columns} rows={rows} />;
};
export default PlatesRegisters;
