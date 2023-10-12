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
import { Fragment, forwardRef, useState } from "react";
import { ListItemButton } from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ModalAsig = () => {
   const [open, setOpen] = useState(false);

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
      return {
         sx: {
            bgcolor: stringToColor(name)
         },
         children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
      };
   }

   return (
      <div>
         <Button variant="outlined" onClick={handleClickOpen}>
            Slide in alert dialog
         </Button>
         <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
            <DialogTitle>{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-slide-description">
                  <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                     <ListItemButton>
                        <ListItem alignItems="flex-start">
                           <ListItemAvatar>
                              <Avatar {...stringAvatar("Kent Dodds")} />
                           </ListItemAvatar>
                           <ListItemText
                              primary="Brunch this weekend?"
                              secondary={
                                 <Fragment>
                                    <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                                       Ali Connors
                                    </Typography>
                                    {" — I'll be in your neighborhood doing errands this…"}
                                 </Fragment>
                              }
                           />
                        </ListItem>
                     </ListItemButton>

                     <Divider variant="inset" component="li" />
                     
                     <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                           <Avatar {...stringAvatar("Jed Watson")} />
                        </ListItemAvatar>
                        <ListItemText
                           primary="Summer BBQ"
                           secondary={
                              <Fragment>
                                 <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                                    to Scott, Alex, Jennifer
                                 </Typography>
                                 {" — Wish I could come, but I'm out of town this…"}
                              </Fragment>
                           }
                        />
                     </ListItem>
                     <Divider variant="inset" component="li" />
                     <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                           <Avatar {...stringAvatar("Tim Neutkens")} />
                        </ListItemAvatar>
                        <ListItemText
                           primary="Oui Oui"
                           secondary={
                              <Fragment>
                                 <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                                    Sandra Adams
                                 </Typography>
                                 {" — Do you have Paris recommendations? Have you ever…"}
                              </Fragment>
                           }
                        />
                     </ListItem>
                  </List>
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Disagree</Button>
               <Button onClick={handleClose}>Agree</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

export default ModalAsig;
