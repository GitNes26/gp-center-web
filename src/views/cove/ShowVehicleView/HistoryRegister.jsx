import DrawerComponent from "../../../components/DrawerComponent";
import TimeLineComponent from "../../../components/TimeLineComponent";

const HistoryRegister = ({ openDialog, setOpenDialog }) => {
   const content = <TimeLineComponent />;

   return <DrawerComponent title={"HISTORIAL DEL VEHÍCULO"} openDialog={openDialog} setOpenDialog={setOpenDialog} anchor={"left"} content={content} />;
};
export default HistoryRegister;
