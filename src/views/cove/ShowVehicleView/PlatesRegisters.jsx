import DrawerTable from "../../../components/DrawerTable";
import { formatDatetime } from "../../../utils/Formats";
import { useVehiclePlateContext } from "../../../context/VehiclePlateContext";
import { IconCircleCheckFilled } from "@tabler/icons-react";

const PlatesRegisters = ({ openDialog, setOpenDialog }) => {
   const { vehiclePlates, setVehiclePlates } = useVehiclePlateContext();

   const platesCurrent = (expired) => (expired ? "-" : <IconCircleCheckFilled style={{ color: "green" }} />);

   const columns = [
      { id: "plates", label: "Placas", minWidth: 100, format: (value) => value.toUpperCase() },
      { id: "initial_date", label: "Fecha de Plaqueo", minWidth: 100, align: "center", format: (value) => formatDatetime(value, false) },
      { id: "due_date", label: "Fecha de Vencimiento", minWidth: 100, align: "center", format: (value) => formatDatetime(value, false) },
      { id: "expired", label: "Vigente", minWidth: 50, align: "center", format: (value) => platesCurrent(value) }
      // {
      //    id: "density",
      //    label: "Density",
      //    minWidth: 170,
      //    align: "right",
      //    format: (value) => value.toFixed(2)
      // }
   ];
   function createData(id, plates, initial_date, due_date, expired) {
      return { id, plates, initial_date, due_date, expired };
   }
   // const rows = [
   //    createData(1, "AAA-00-00", "2020-01-01", "2025-01-01"),
   //    createData(2, "AAA-00-01", "2020-01-01", "2025-01-01"),
   //    createData(3, "AAA-00-02", "2020-01-01", "2025-01-01"),
   //    createData(4, "AAA-00-03", "2020-01-01", "2025-01-01")
   // ];
   return <DrawerTable title={"REGISTRO DE PLAQUEO"} openDialog={openDialog} setOpenDialog={setOpenDialog} columns={columns} rows={vehiclePlates} />;
};
export default PlatesRegisters;
