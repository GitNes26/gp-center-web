import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
   Avatar,
   Badge,
   Box,
   Button,
   ButtonBase,
   CardActions,
   Chip,
   ClickAwayListener,
   Divider,
   Grid,
   Paper,
   Popper,
   Stack,
   TextField,
   Typography,
   useMediaQuery
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "../../../../ui-component/cards/MainCard";
import Transitions from "../../../../ui-component/extended/Transitions";
import NotificationList from "./NotificationList";

// assets
import { IconBell } from "@tabler/icons";
import { formatDatetime } from "../../../../utils/Formats";
// import SSEListener from "../../../../components/SEEListener";

// notification status options
const status = [
   {
      value: "all",
      label: "All Notification"
   },
   {
      value: "new",
      label: "New"
   },
   {
      value: "unread",
      label: "Unread"
   },
   {
      value: "other",
      label: "Other"
   }
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = ({ channel }) => {
   const theme = useTheme();
   const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

   const [open, setOpen] = useState(false);
   const [value, setValue] = useState("");
   /**
    * anchorRef is used on different componets and specifying one type leads to other components throwing an error
    * */
   const anchorRef = useRef(null);

   const [messages, setMessages] = useState([]);
   const [isConnected, setIsConnected] = useState(false);
   const [error, setError] = useState(null);

   useEffect(() => {
      // Establecer la conexión SSE al canal
      const eventSource = new EventSource(`${import.meta.env.VITE_API}/sse/${channel}`);

      // Manejar cuando la conexión se abre
      eventSource.onopen = () => {
         console.log("Conexión abierta");
         setIsConnected(true); // Establecer como conectado
         setError(null); // Limpiar cualquier error anterior
      };

      // Manejar los mensajes recibidos
      eventSource.onmessage = (event) => {
         const data = JSON.parse(event.data);
         console.log("🚀 ~ useEffect ~ data:", data);

         setMessages(data.message); // Actualizar el mensaje
      };

      // Manejar errores de conexión
      // eventSource.onerror = (event) => {
      //   console.error('Error en la conexión SSE', event);
      // //   setError('Error en la conexión SSE. Intenta nuevamente.');
      // //   setIsConnected(false); // Establecer como desconectado
      // };

      // Limpiar la conexión cuando el componente se desmonte
      return () => {
         // console.log("aquiii cerrando")
         eventSource.close();
      };
   }, []);
   // useEffect(() => {
   //    let eventSource;

   //    const connect = () => {
   //       // Establecer la conexión SSE
   //       eventSource = new EventSource(`${import.meta.env.VITE_API}/sse/${channel}`);

   //       // Manejar cuando la conexión se abre
   //       eventSource.onopen = () => {
   //          console.log("Conexión abierta");
   //          setIsConnected(true); // Establecer como conectado
   //          setError(null); // Limpiar cualquier error anterior
   //       };

   //       // Manejar los mensajes recibidos
   //       eventSource.onmessage = (event) => {
   //          const data = JSON.parse(event.data);
   //          console.log("🚀 ~ useEffect ~ data:", data);

   //          setMessages(data.message); // Actualizar el mensaje
   //       };

   //       // Manejar errores de conexión
   //       eventSource.onerror = (event) => {
   //          console.log("🚀 ~ onerror ~ event:", event);
   //          console.error("Error en la conexión SSE. Intentando reconectar...");
   //          setError("Error en la conexión SSE. Intentando reconectar...");
   //          setIsConnected(false); // Establecer como desconectado

   //          // Cerrar la conexión actual antes de intentar reconectar
   //          if (eventSource) eventSource.close();

   //          // Intentar reconectar después de 5 segundos
   //          setTimeout(() => {
   //             console.log("Intentando reconectar...");
   //             connect();
   //          }, 5000);
   //       };
   //    };

   //    // Iniciar la conexión
   //    connect();

   //    // Limpiar al desmontar el componente
   //    return () => {
   //       if (eventSource) eventSource.close();
   //    };
   // }, [channel]); // Reconectar si el canal cambia

   //     return { isConnected, messages, error };
   //   };

   const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
   };

   const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
         return;
      }
      setOpen(false);
   };

   const prevOpen = useRef(open);
   useEffect(() => {
      if (prevOpen.current === true && open === false) {
         anchorRef.current.focus();
      }
      prevOpen.current = open;
   }, [open]);

   const handleChange = (event) => {
      if (event?.target.value) setValue(event?.target.value);
   };

   return (
      <>
         <Box
            sx={{
               ml: 2,
               mr: 3,
               [theme.breakpoints.down("md")]: {
                  mr: 2
               }
            }}
         >
            <Badge color="secondary" badgeContent={messages.length} max={999}>
               <ButtonBase sx={{ borderRadius: "12px" }}>
                  <Avatar
                     variant="rounded"
                     sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: "all .2s ease-in-out",
                        background: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                        '&[aria-controls="menu-list-grow"],&:hover': {
                           background: theme.palette.secondary.dark,
                           color: theme.palette.secondary.light
                        }
                     }}
                     ref={anchorRef}
                     aria-controls={open ? "menu-list-grow" : undefined}
                     aria-haspopup="true"
                     onClick={handleToggle}
                     color="inherit"
                  >
                     <IconBell stroke={1.5} size="1.3rem" />
                  </Avatar>
               </ButtonBase>
            </Badge>
         </Box>
         <Popper
            placement={matchesXs ? "bottom" : "bottom-end"}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            popperOptions={{
               modifiers: [
                  {
                     name: "offset",
                     options: {
                        offset: [matchesXs ? 5 : 0, 20]
                     }
                  }
               ]
            }}
         >
            {({ TransitionProps }) => (
               <Transitions position={matchesXs ? "top" : "top-right"} in={open} {...TransitionProps}>
                  <Paper>
                     <ClickAwayListener onClickAway={handleClose}>
                        <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                           <Grid container direction="column" spacing={2}>
                              <Grid item xs={12}>
                                 <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                    <Grid item>
                                       <Stack direction="row" spacing={2}>
                                          <Typography variant="subtitle1">{isConnected ? "conectado" : "sin conexion"}</Typography>
                                          <Chip
                                             size="small"
                                             label="01"
                                             sx={{
                                                color: theme.palette.background.default,
                                                bgcolor: theme.palette.warning.dark
                                             }}
                                          />
                                       </Stack>
                                    </Grid>
                                    <Grid item>
                                       <Typography component={Link} to="#" variant="subtitle2" color="primary">
                                          Mark as all read
                                       </Typography>
                                    </Grid>
                                 </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                 <PerfectScrollbar
                                    style={{
                                       height: "100%",
                                       maxHeight: "calc(100vh - 205px)",
                                       overflowX: "hidden"
                                    }}
                                 >
                                    <Grid container direction="column" spacing={2}>
                                       <Grid item xs={12}>
                                          <Box sx={{ px: 2, pt: 0.25 }}>
                                             <TextField
                                                id="outlined-select-currency-native"
                                                select
                                                fullWidth
                                                value={value}
                                                onChange={handleChange}
                                                SelectProps={{
                                                   native: true
                                                }}
                                             >
                                                {status.map((option) => (
                                                   <option key={option.value} value={option.value}>
                                                      {option.label}
                                                   </option>
                                                ))}
                                             </TextField>
                                          </Box>
                                       </Grid>
                                       <Grid item xs={12} p={0}>
                                          <Divider sx={{ my: 0 }} />
                                       </Grid>
                                    </Grid>
                                    <NotificationList />
                                    {messages.map((msg) => (
                                       <Box sx={{ backgroundColor: "cyan", py: 1, px: 2, borderBottom: 0.5, borderColor: "skyblue" }}>
                                          <Typography textAlign={"center"} justifyContent={"center"} fontWeight={"bold"}>
                                             {msg.title}
                                          </Typography>
                                          <Typography textAlign={"center"} justifyContent={"start"} variant="p" my={3}>
                                             {msg.message}
                                          </Typography>
                                          <Typography textAlign={"end"} justifyContent={"end"} fontStyle={"italic"} fontSize={11}>
                                             {formatDatetime(msg.created_at, true)}
                                          </Typography>
                                       </Box>
                                    ))}
                                    <Typography textAlign={"center"} justifyContent={"center"} color={"red"}>
                                       {error}
                                    </Typography>
                                 </PerfectScrollbar>
                              </Grid>
                           </Grid>
                           <Divider />
                           <CardActions sx={{ p: 1.25, justifyContent: "center" }}>
                              <Button size="small" disableElevation>
                                 View All
                              </Button>
                           </CardActions>
                        </MainCard>
                     </ClickAwayListener>
                  </Paper>
               </Transitions>
            )}
         </Popper>
      </>
   );
};

export default NotificationSection;
