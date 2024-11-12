import DrawerComponent from "../../../components/DrawerComponent";
import TimeLineComponent from "../../../components/TimeLineComponent";

const HistoryRegister = ({ openDialog, setOpenDialog }) => {
   const data = [
      { date: "2024-03-20 09:02:33", action: "PRESTADO", km: "10.00", user: "IntiML" },
      { date: "2024-03-01 12:44:45", action: "ASIGNADO", km: "0.00", user: "RocioRP" },
      { date: "2023-10-31 00:00:00", action: "ALTA", km: "0.00", user: "" }
   ];

   const content = <TimeLineComponent items={data} />;

   return <DrawerComponent title={"HISTORIAL DEL VEHÍCULO"} openDialog={openDialog} setOpenDialog={setOpenDialog} anchor={"left"} content={content} />;
};
export default HistoryRegister;
