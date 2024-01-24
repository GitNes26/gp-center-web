import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Fragment, forwardRef, useEffect, useState } from "react";
import { ListItemButton } from "@mui/material";
import SearchInput from "../../../components/SearchInput";
import { useDirectorContext } from "../../../context/DirectorContext";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import { useVehicleContext } from "../../../context/VehicleContext";
import Toast from "../../../utils/Toast";
import { useAssignedVehicleContext } from "../../../context/AssignedVehicleContext";
import { formatDatetimeToSQL } from "../../../utils/Formats";
import { useGlobalContext } from "../../../context/GlobalContext";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalAsig = ({ open, setOpen }) => {
   // const [open, setOpen] = useState(false);
   const mySwal = withReactContent(Swal);
   const [search, setSearch] = useState("");
   const { setLoadingAction } = useGlobalContext();
   const { directors, getDirectors } = useDirectorContext();
   const { vehicle, showVehicle } = useVehicleContext();
   const { /* assignedVehicle, setAssignedVehicle, */ createAssignedVehicle } = useAssignedVehicleContext();

   const [dataList, setDataList] = useState([]);

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   function stringToColor(string) {
      let hash = 0;
      let i;

      /* eslint-disable no-bitwise */
      for (i = 0; i < string.length; i += 1) {
         hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = "#";

      for (i = 0; i < 3; i += 1) {
         const value = (hash >> (i * 8)) & 0xff;
         color += `00${value.toString(16)}`.slice(-2);
      }
      /* eslint-enable no-bitwise */

      return color;
   }

   function stringAvatar(name) {
      const letters = name.length < 3 ? "?" : `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`;

      return {
         sx: {
            bgcolor: stringToColor(name)
         },
         children: letters
      };
   }

   const ItemUser = ({ id, full_name = "", department, email, handleClick }) => {
      return (
         <>
            {/* <Divider variant="inset" component="li" /> */}
            <ListItemButton alignItems="flex-start" onClick={() => handleClick(id, full_name)}>
               <ListItemAvatar>
                  <Avatar {...stringAvatar(full_name)} />
               </ListItemAvatar>
               <ListItemText
                  primary={<Typography variant="h4">{full_name}</Typography>}
                  secondary={
                     <Fragment>
                        <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                           {department}
                        </Typography>
                        — {email}
                     </Fragment>
                  }
               />
            </ListItemButton>
            <Divider variant="inset" component="li" sx={{ marginLeft: "0px;" }} />
         </>
      );
   };

   const handleClickDirector = (id, full_name) => {
      // console.log("voy a asignarle el vehiculo ");
      // console.log("voy a asignarle el vehiculo ", vehicle_id, "a ", director_id);
      try {
         mySwal
            .fire(QuestionAlertConfig(`Estas por asignar el vehículo con N° económico ${vehicle.stock_number} a ${full_name}`, "ASIGNAR", "CANCELAR", "info"))
            .then(async (result) => {
               if (result.isConfirmed) {
                  setLoadingAction(true);
                  // setAssignedVehicle({ user_id: id, vehicle_id: vehicle.id, date: formatDatetimeToSQL(new Date()) });
                  const assignedVehicle = { user_id: id, vehicle_id: vehicle.id, date: formatDatetimeToSQL(new Date()) };
                  // return console.log(assignedVehicle);
                  const axiosResponse = await createAssignedVehicle(assignedVehicle);
                  await showVehicle(vehicle.id);
                  setOpen(false);
                  setLoadingAction(false);
                  Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
               }
            });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleKeyUpSearchSuccess = async (e) => {
      try {
         setDataList(directors);
         const value = e.target.value;
         if (value.length < 1) return;
         console.log(directors);
         let _data = [...dataList];
         // const filter1 = _data.filter((d) => d.email.toUpperCase().includes(value.toUpperCase()));
         _data = _data.filter((d) => d.department.toUpperCase().includes(value.toUpperCase()));
         // _data = [...new Set(_data)];
         console.log(_data);
         setDataList(_data);

         // if (e.key === "Enter" || e.keyCode === 13) {
         //    if (e.target.value.length == 0) return Toast.Info("Buscador vacio.");
         //    setClassesImgVehicle("zoom-out");
         //    setGrowOn(false);
         //    setLoadingAction(true);
         //    setTimeout(async () => {
         //       const searchBy = searchType == "number" ? "stock_number" : "plates";
         //       const res = await showVehicleBy(searchBy, search);
         //       console.log("res", res.result);
         //       setSearch("");
         //       setLoadingAction(false);
         //       if (!res.result) return Toast.Info(res.alert_title);
         //       setGrowOn(true);
         //       setClassesImgVehicle("zoom-in");
         //    }, 850);
         // }
      } catch (error) {
         console.log(error);
         Toast.Error(error);
         setLoading(false);
      }
   };

   useEffect(() => {
      getDirectors();
      // console.log(users);
   }, [dataList]);

   return (
      <div>
         {/* <Button variant="outlined" onClick={handleClickOpen}>
            Slide in alert dialog
         </Button> */}
         <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backgroundColor: "transparent" }}
         >
            <DialogTitle>
               <Typography variant="h3" component={"p"} textAlign={"center"}>
                  ASIGNAR VEHICULO
               </Typography>

               <SearchInput
                  idName="search"
                  search={search}
                  setSearch={setSearch}
                  placeholder={"Buscar director"}
                  titleTooltip={"Buscar por Departamento"}
                  handleKeyUpSearchSuccess={handleKeyUpSearchSuccess}
                  showOptions={false}
               />
            </DialogTitle>
            <DialogContent sx={{ maxHeight: "500px" }}>
               <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  <DialogContentText id="alert-dialog-slide-description" component={"div"}>
                     {dataList.length > 0 ? (
                        dataList.map((obj) => {
                           const full_name = `${obj.name} ${obj.paternal_last_name} ${obj.maternal_last_name}`;
                           return (
                              <ItemUser
                                 key={obj.id}
                                 id={obj.user_id}
                                 full_name={full_name}
                                 department={obj.department}
                                 email={obj.email}
                                 handleClick={handleClickDirector}
                              />
                           );
                        })
                     ) : (
                        <Typography>No se encontraron registros o coincidencias</Typography>
                     )}
                  </DialogContentText>
               </List>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Cerrar</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

export default ModalAsig;
