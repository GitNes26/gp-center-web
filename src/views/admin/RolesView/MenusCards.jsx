import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Card, CardContent, CardHeader, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Title } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
   cardHeader: { backgroundColor: "#525C6A" },
   titleHeader: { color: "whitesmoke" },

   cardChildren: { border: "2px solid black", backgroundColor: "#c2cddd" },
   titleChildren: { color: "#1E2126" }
}));

const CardMenu = ({ title = "Servicios", id = 0 }) => {
   const classes = useStyles();

   return (
      <Card sx={{ p: 0 }} className={classes.cardChildren}>
         <Grid xs={12} sx={{ m: 0 }}>
            <Typography variant="h3" textAlign={"center"} className={classes.titleChildren}>
               <FormControlLabel value={`read@${id}`} control={<Checkbox defaultChecked />} label={""} labelPlacement="left" sx={{ fontWeight: "bolder" }} />
               {title}
            </Typography>
         </Grid>

         <Grid container spacing={2} sx={{ backgroundColor: "white" }}>
            <Grid xs={"auto"} sx={{ m: 0 }}>
               <FormControlLabel value={`read@${id}`} control={<Checkbox defaultChecked={true} />} label="Ver" labelPlacement="bottom" />
            </Grid>
            <Grid xs={"auto"} sx={{ m: 0 }}>
               <FormControlLabel value={`create@${id}`} control={<Checkbox defaultChecked={true} />} label="Crear" labelPlacement="bottom" />
            </Grid>
            <Grid xs={"auto"} sx={{ m: 0 }}>
               <FormControlLabel value={`update@${id}`} control={<Checkbox defaultChecked={true} />} label="Editar" labelPlacement="bottom" />
            </Grid>
         </Grid>
      </Card>
   );
};

const CardHeaderMenu = ({ title }) => {
   const classes = useStyles();

   return (
      <Card sx={{ p: 1 }} className={classes.cardHeader}>
         <Typography variant="h3" textAlign={"center"} className={classes.titleHeader}>
            {title.toUpperCase()}
            <Checkbox defaultChecked={true} />
         </Typography>
         <Grid container spacing={2} sx={{ backgroundColor: "white" }}>
            <Grid xs={12} sx={{ mb: 1 }}>
               <CardMenu />
            </Grid>
            <Grid xs={12} sx={{ mb: 1 }}>
               <CardMenu />
            </Grid>
            <Grid xs={12} sx={{ mb: 1 }}>
               <CardMenu />
            </Grid>
         </Grid>
      </Card>
   );
};

const MenusCards = () => {
   const classes = useStyles();

   return (
      <>
         <Typography variant="h2" color={"#1E2126"} mb={2} textAlign={"center"}>
            MENUS
            <Checkbox defaultChecked />
         </Typography>
         <Grid container spacing={2}>
            <Grid xs={12} md={6} sx={{ mb: 1 }}>
               <CardHeaderMenu title={"Administración"} />
            </Grid>
            <Grid xs={12} md={6} sx={{ mb: 1 }}>
               <CardHeaderMenu title={"Taller"} />
            </Grid>
            <Grid xs={12} md={6} sx={{ mb: 1 }}>
               <CardHeaderMenu title={"CoVe"} />
            </Grid>
         </Grid>
      </>
   );
};
export default MenusCards;
