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
import { useUserContext } from "../../../context/UserContext";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalAsig = ({ open, setOpen }) => {
   // const [open, setOpen] = useState(false);
   const { users, getUsers } = useUserContext();

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

   const ItemUser = ({ full_name = "", department, email }) => {
      return (
         <>
            {/* <Divider variant="inset" component="li" /> */}
            <ListItemButton alignItems="flex-start">
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

   useEffect(() => {
      getUsers();
      console.log(users);
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
               <SearchInput placeholder={"Buscar usuarios"} showOptions={false} />
            </DialogTitle>
            <DialogContent sx={{ maxHeight: "500px" }}>
               <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  <DialogContentText id="alert-dialog-slide-description" component={"div"}>
                     {users.map((obj) => {
                        const full_name = `${obj.name} ${obj.paternal_last_name} ${obj.maternal_last_name}`;
                        return <ItemUser key={obj.id} full_name={full_name} department={obj.department} email={obj.email} />;
                     })}
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
