import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, ButtonBase } from "@mui/material";

// project imports
import LogoSection from "../LogoSection";
import SearchSection from "./SearchSection";
import ProfileSection from "./ProfileSection";
import NotificationSection from "./NotificationSection";

// assets
import { IconMenu2 } from "@tabler/icons";
import logoDark from "../../../assets/images/logo-dark.png";
import { gpcBlue } from "../../../context/GlobalContext";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
   const theme = useTheme();

   return (
      <>
         {/* logo & toggler button */}
         <Box
            sx={{
               width: 228,
               display: "flex",
               [theme.breakpoints.down("md")]: {
                  width: "auto"
               }
            }}
         >
            <Box
               component="span"
               sx={{
                  display: { xs: "none", md: "block" },
                  width: "75%",
                  flexGrow: 1
               }}
            >
               <LogoSection />
            </Box>
            <ButtonBase sx={{ borderRadius: "12px", overflow: "hidden" }}>
               <Avatar
                  variant="rounded"
                  sx={{
                     ...theme.typography.commonAvatar,
                     ...theme.typography.mediumAvatar,
                     transition: "all .2s ease-in-out",
                     background: theme.palette.secondary.light,
                     color: theme.palette.secondary.dark,
                     "&:hover": {
                        background: theme.palette.secondary.dark,
                        color: theme.palette.secondary.light
                     }
                  }}
                  onClick={handleLeftDrawerToggle}
                  color="inherit"
               >
                  <IconMenu2 stroke={1.5} size="1.3rem" />
               </Avatar>
            </ButtonBase>
         </Box>

         {/* header search */}
         {/* <SearchSection /> */}
         <Box sx={{ mx: "auto", py: 0, m: 0, textAlign: "center", flexGrow: 1 }}>
            <img src={logoDark} alt="LogoGPCenter" style={{ maxHeight: "50px", minWidth: "150px", margin: 0, padding: 0 }} />
         </Box>

         {/* notification & profile */}
         <NotificationSection />
         <ProfileSection />
      </>
   );
};

Header.propTypes = {
   handleLeftDrawerToggle: PropTypes.func
};

export default Header;
