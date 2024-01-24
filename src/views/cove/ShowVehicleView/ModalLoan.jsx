import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Fragment, forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { ListItemButton } from "@mui/material";
import SearchInput from "../../../components/SearchInput";
import { useDirectorContext } from "../../../context/DirectorContext";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import { useVehicleContext } from "../../../context/VehicleContext";
import Toast from "../../../utils/Toast";
import { useLoanedVehicleContext } from "../../../context/LoanedVehicleContext";
import { formatDatetimeToSQL } from "../../../utils/Formats";
import { useGlobalContext } from "../../../context/GlobalContext";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalLoan = ({ open, setOpen }) => {
   // const [open, setOpen] = useState(false);
   const mySwal = withReactContent(Swal);
   const [search, setSearch] = useState("");
   const { setLoadingAction } = useGlobalContext();
   const { directors, getDirectors } = useDirectorContext();
   const { vehicle, showVehicle, dataList, setDataList } = useVehicleContext();
   const { /* assignedVehicle, setLoanedVehicle, */ createLoanedVehicle } = useLoanedVehicleContext();

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
                  // setLoanedVehicle({ user_id: id, vehicle_id: vehicle.id, date: formatDatetimeToSQL(new Date()) });
                  const assignedVehicle = { user_id: id, vehicle_id: vehicle.id, date: formatDatetimeToSQL(new Date()) };
                  // return console.log(assignedVehicle);
                  const axiosResponse = await createLoanedVehicle(assignedVehicle);
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
         if (value.length == 0) return setDataList(directors);
         const filter1 = directors.filter((d) => d.email.toUpperCase().includes(value.toUpperCase()));
         const filter2 = directors.filter((d) => d.department.toUpperCase().includes(value.toUpperCase()));
         const filter3 = directors.filter((d) => d.full_name.toUpperCase().includes(value.toUpperCase()));
         const result = [];
         result.push(...filter1);
         result.push(...filter2);
         result.push(...filter3);
         const data = [...new Set(result)];
         setDataList(data);
         // setDataList(directors.filter((d) => d.department.toUpperCase().includes(value.toUpperCase())));
      } catch (error) {
         console.log(error);
         Toast.Error(error);
         setLoading(false);
      }
   };

   useEffect(() => {
      // console.log("estoy en el modal", directors);
   }, [dataList]);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", directors);
      getDirectors();
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
                  ASIGNAR VEHÍCULO
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
                           return (
                              <ItemUser
                                 key={obj.id}
                                 id={obj.user_id}
                                 full_name={obj.full_name}
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

export default ModalLoan;
