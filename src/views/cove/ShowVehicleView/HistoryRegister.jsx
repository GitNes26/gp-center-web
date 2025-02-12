import DrawerComponent from "../../../components/DrawerComponent";
import TimeLineComponent from "../../../components/TimeLineComponent";
import { useVehicleContext } from "../../../context/VehicleContext";
import { removeDuplicates } from "../../../utils/Formats";

const HistoryRegister = ({ openDialog, setOpenDialog, stockNumber }) => {
   const { history } = useVehicleContext();
   // history.push({ created_at: "2023-10-31 00:00:00", vehicle_status: "ALTA", km: "0.00", username: "" });
   // console.log("🚀 ~ HistoryRegister ~ history:", history);
   const data = removeDuplicates(history);
   // const data = [
   //    { created_at: "2024-03-20 09:02:33", vehicle_status: "PRESTADO", km: "10.00", username: "IntiML" },
   //    { created_at: "2024-03-01 12:44:45", vehicle_status: "ASIGNADO", km: "0.00", username: "RocioRP" },
   //    { created_at: "2023-10-31 00:00:00", vehicle_status: "ALTA", km: "0.00", username: "" }
   // ];

   const content = <TimeLineComponent items={data} />;

   return (
      <DrawerComponent title={`HISTORIAL DEL VEHÍCULO N°${stockNumber}`} openDialog={openDialog} setOpenDialog={setOpenDialog} anchor={"left"} content={content} />
   );
};
export default HistoryRegister;
