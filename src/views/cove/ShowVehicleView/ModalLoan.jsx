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
import { ListItemButton, TextField } from "@mui/material";
import SearchInput from "../../../components/SearchInput";
import { useDriverContext } from "../../../context/DriverContext";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import { useVehicleContext } from "../../../context/VehicleContext";
import Toast from "../../../utils/Toast";
import { useLoanedVehicleContext } from "../../../context/LoanedVehicleContext";
import { formatDatetimeToSQL, searcher } from "../../../utils/Formats";
import { useGlobalContext } from "../../../context/GlobalContext";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalLoan = ({ open, setOpen }) => {
   // const [open, setOpen] = useState(false);
   const mySwal = withReactContent(Swal);
   const [search, setSearch] = useState("");
   const { setLoadingAction } = useGlobalContext();
   const { drivers, getDrivers } = useDriverContext();
   const { vehicle, showVehicle, dataList, setDataList } = useVehicleContext();
   const { /* loanedVehicle, setLoanedVehicle, */ createLoanedVehicle } = useLoanedVehicleContext();
   const [openReason, setOpenReason] = useState(false);
   const [showErrorReason, setShowErrorReason] = useState(false);
   const [showErrorKm, setShowErrorKm] = useState(false);
   const [formData, setFormData] = useState({
      vehicle_id: 0,
      assigned_vehicle_id: 0,
      requesting_user_id: 0,
      reason: "",
      initial_km: 0,
      loan_date: "",
      full_name: ""
   });

   const handleClose = () => {
      setOpen(false);
      setSearch("");
   };
   const handleCloseReason = () => {
      setOpenReason(false);
      setFormData({ ...formData, reason: "", initial_km: 0 });
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

   const handleClickDriver = (id, full_name) => {
      setOpenReason(true);
      setFormData({
         ...formData,
         vehicle_id: vehicle.id,
         assigned_vehicle_id: vehicle.ass_folio,
         reason: "",
         initial_km: 0,
         requesting_user_id: id,
         full_name: full_name,
         loan_date: formatDatetimeToSQL(new Date())
      });
   };
   const handleClickLoan = (e) => {
      try {
         e.preventDefault();
         if (formData.reason.length < 1) setShowErrorReason(true);
         if (formData.initial_km < 0) setShowErrorKm(true);
         if (showErrorReason) return;
         if (showErrorKm) return;

         setFormData({
            ...formData,
            loan_date: formatDatetimeToSQL(new Date())
         });

         mySwal
            .fire(QuestionAlertConfig(`Estas por prestar el vehículo con N° económico ${vehicle.stock_number} a ${formData.full_name}`, "PRESTAR", "CANCELAR", "info"))
            .then(async (result) => {
               if (result.isConfirmed) {
                  setLoadingAction(true);
                  // setLoanedVehicle({ user_id: id, vehicle_id: vehicle.id, date: formatDatetimeToSQL(new Date()) });

                  // return console.log(formData);
                  const axiosResponse = await createLoanedVehicle(formData);
                  await showVehicle(vehicle.id);
                  setOpenReason(false);
                  setOpen(false);
                  setLoadingAction(false);
                  Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
                  setSearch("");
                  setFormData({
                     vehicle_id: 0,
                     assigned_vehicle_id: 0,
                     requesting_user_id: 0,
                     reason: "",
                     initial_km: 0,
                     loan_date: "",
                     full_name: ""
                  });
               }
            });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleKeyUpSearchSuccess = async (e) => {
      try {
         setDataList(drivers);
         const value = e.target.value;
         if (value.length == 0) return setDataList(drivers);
         // const filter1 = await drivers.filter((d) => d.email.toUpperCase().includes(value.toUpperCase()));
         // const filter2 = await drivers.filter((d) => d.department.toUpperCase().includes(value.toUpperCase()));
         // const filter3 = await drivers.filter((d) => d.full_name.toUpperCase().includes(value.toUpperCase()));
         // const result = [];
         // result.push(...filter1);
         // result.push(...filter2);
         // result.push(...filter3);
         // const data = [...new Set(result)];
         const data = await searcher(drivers, value);

         setDataList(data);
         // setDataList(drivers.filter((d) => d.department.toUpperCase().includes(value.toUpperCase())));
      } catch (error) {
         console.log(error);
         Toast.Error(error);
         setLoading(false);
      }
   };

   useEffect(() => {
      // console.log("estoy en el modal", drivers);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", drivers);
      getDrivers();
   }, []);

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
                  PRESTAR VEHÍCULO
               </Typography>

               <SearchInput
                  idName="search"
                  search={search}
                  setSearch={setSearch}
                  placeholder={"Buscar driver"}
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
                                 handleClick={handleClickDriver}
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

         {/* FORMULARIO COMPLEMENTARIO */}
         <Dialog
            open={openReason}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            onClose={handleCloseReason}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backgroundColor: "transparent" }}
         >
            <DialogTitle>
               <Typography variant="h4" component={"p"} textAlign={"center"}>
                  RAZÓN DEL PRESTAMO Y KILOMETRAJE
               </Typography>
            </DialogTitle>
            <DialogContent sx={{ pb: 0 }}>
               <form onSubmit={handleClickLoan}>
                  <TextField
                     id="reason"
                     name="reason"
                     label="Razón *"
                     type="text"
                     value={formData.reason}
                     placeholder="Ingrese la razón del prestamo..."
                     onChange={(e) => {
                        setFormData({
                           ...formData,
                           reason: e.target.value
                        });
                        setShowErrorReason(false);
                        if (e.target.value.length < 1) setShowErrorReason(true);
                     }}
                     // InputProps={{ }}
                     multiline={true}
                     fullWidth
                     sx={{ mt: 1 }}
                  />
                  {showErrorReason && (
                     <Typography color={"red"} variant="subtitle2">
                        La razón es requerida.
                     </Typography>
                  )}
                  <TextField
                     id="initial_km"
                     name="initial_km"
                     label="Kilometraje *"
                     type="number"
                     value={formData.initial_km}
                     placeholder="Ingrese el km actual de la unidad..."
                     onChange={(e) => {
                        setFormData({
                           ...formData,
                           initial_km: e.target.value
                        });
                        setShowErrorKm(false);
                        if (Number(e.target.value) < 0) setShowErrorKm(true);
                     }}
                     InputProps={{ step: "01" }}
                     fullWidth
                     sx={{ mt: 3 }}
                  />
                  {showErrorKm && (
                     <Typography color={"red"} variant="subtitle2">
                        El Kilometraje es requerido.
                     </Typography>
                  )}
                  <Button type="submit">ACEPTAR</Button>
               </form>
            </DialogContent>
            <DialogActions sx={{ my: 0, pt: 0 }}>
               <Button onClick={handleCloseReason}>Cerrar</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

export default ModalLoan;
