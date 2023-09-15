// material-ui
import { Link, Typography, Stack } from "@mui/material";

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
   <Stack direction="row" justifyContent="space-between">
      <Typography variant="subtitle2" component={Link} href="#" target="_blank" underline="hover">
         Desarrollo Nuevo - NP26
      </Typography>
      <Typography variant="subtitle2" component={Link} href="https://gomezpalacio.gob.mx/" target="_blank" underline="hover">
         &copy; Presidencia GP 2023
      </Typography>
   </Stack>
);

export default AuthFooter;
