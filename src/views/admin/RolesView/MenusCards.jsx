import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Card, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Title } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
   cardHeader: {},
   cardChildren: { border: "1px solid black" }
}));

const CardMenu = ({ title = "Servicios" }) => {
   const classes = useStyles();
   return (
      <Card sx={{ p: 0 }} className={classes.cardChildren}>
         <Grid xs={"auto"} sx={{ m: 0 }}>
            <Typography variant="h4">
               <FormControlLabel value={`read@${id}`} control={<Checkbox defaultChecked />} label={title} labelPlacement="left" sx={{ fontWeight: "bolder" }} />
            </Typography>
            <FormControlLabel value={`read@${id}`} control={<Checkbox checked={true} />} label="Ver" labelPlacement="bottom" />
            <FormControlLabel value={`create@${id}`} control={<Checkbox checked={true} />} label="Crear" labelPlacement="bottom" />
            <FormControlLabel value={`update@${id}`} control={<Checkbox checked={true} />} label="Editar" labelPlacement="bottom" />
            <FormControlLabel value={`delete@${id}`} control={<Checkbox checked={true} />} label="Eliminar" labelPlacement="bottom" />
         </Grid>
      </Card>
   );
};

const CardHeaderMenu = ({ title }) => {
   return (
      <Card sx={{ p: 1 }}>
         <Grid xs={12} sx={{ mb: 1 }}>
            <Typography variant="h3">
               {title.toUpperCase()}
               <Checkbox defaultChecked={true} />
            </Typography>
         </Grid>
         <Grid xs={12} sm={"auto"} sx={{ mb: 1 }}>
            <CardMenu />
         </Grid>
      </Card>
   );
};

const MenusCards = () => {
   return (
      <>
         <Typography variant="h2" color={"#1E2126"} mb={2} textAlign={"center"}>
            MENUS
            <Checkbox defaultChecked />
         </Typography>

         <Grid xs={12} md={6} sx={{ mb: 1 }}>
            <CardHeaderMenu title={"taller"} />
         </Grid>
      </>
   );
};
export default MenusCards;
