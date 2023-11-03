import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { AppBar, Box, Button, CssBaseline, Toolbar, useMediaQuery } from "@mui/material";

// project imports
import Breadcrumbs from "../../ui-component/extended/Breadcrumbs";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Customization from "../Customization";
import navigation from "./Sidebar/MenuList/menu-items";
import { drawerWidth } from "../../config/store/constant";
import { SET_MENU } from "../../config/store/actions";

// assets
import { IconChevronRight } from "@tabler/icons";
import { Axios, useAuthContext } from "../../context/AuthContext";
import { useGlobalContext } from "../../context/GlobalContext";
import { useMenuContext } from "../../context/MenuContext";
import { useEffect, useState } from "react";
import { useRedirectTo } from "../../hooks/useRedirectTo";
// import AuthContextProvider, { useAuthContext } from "../../context/AuthContextFirebase";

// styles
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
   ...theme.typography.mainContent,
   borderBottomLeftRadius: 0,
   borderBottomRightRadius: 0,
   transition: theme.transitions.create(
      "margin",
      open
         ? {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen
           }
         : {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
           }
   ),
   [theme.breakpoints.up("md")]: {
      marginLeft: open ? 0 : -(drawerWidth - 20),
      width: `calc(100% - ${drawerWidth}px)`
   },
   [theme.breakpoints.down("md")]: {
      marginLeft: "20px",
      width: `calc(100% - ${drawerWidth}px)`,
      padding: "16px"
   },
   [theme.breakpoints.down("sm")]: {
      marginLeft: "10px",
      width: `calc(100% - ${drawerWidth}px)`,
      padding: "16px",
      marginRight: "10px"
   }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
   const theme = useTheme();
   const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
   // Handle left drawer
   const leftDrawerOpened = useSelector((state) => state.customization.opened);
   const dispatch = useDispatch();
   const handleLeftDrawerToggle = () => {
      dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
   };

   const { auth } = useAuthContext();
   // useRedirectTo(auth, "/login", false);

   const { cursorLoading } = useGlobalContext();
   const { getIdByUrl } = useMenuContext();
   const [permissionRead, setPermissionRead] = useState(false);
   // const [currentPath, setCurrentPath] = useState(location.hash.split("#").reverse()[0]);
   // let permissionRead = false;
   console.log("el main");

   useEffect(() => {
      const init = async () => {
         if (auth === null) return;
         console.log("auth.read", auth.read);
         // #region VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
         const currentPath = location.hash.split("#").reverse()[0];
         let permission = false;
         let validatePermissions = false;
         if (auth.read !== "todas") validatePermissions = true;
         if (currentPath === "/admin") validatePermissions = false;

         if (validatePermissions) {
            console.log("a validar", currentPath);
            const dataPost = { url: currentPath };
            const ajaxResponse = await getIdByUrl(dataPost);
            // setPermissionRead(false);
            if (ajaxResponse.result !== null) {
               const pagesRead = auth.read.split(",");
               console.log(ajaxResponse.result.id);
               const idPage = ajaxResponse.result.id.toString();
               console.log("que pasa?");
               console.log(pagesRead);
               // permissionRead = pagesRead.includes(idPage) ? true : false;
               permission = pagesRead.includes(idPage) ? true : false;
               // setPermissionRead(pagesRead.includes(idPage) ? true : false);
            }
         } else {
            console.log("no necesita validacion");
            // permissionRead = true;
            permission = true;
            // setPermissionRead(true);
         }
         console.log("el permission", permission);
         if (permission) setPermissionRead(permission);
         console.log("el permissionRead", permissionRead);

         // #endregion VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
      };
      init();
   }, [permissionRead]);

   return (
      auth && (
         <>
            {permissionRead ? (
               <>
                  <Box sx={{ display: "flex" }}>
                     <CssBaseline />
                     {/* header */}
                     <AppBar
                        enableColorOnDark
                        position="fixed"
                        color="inherit"
                        elevation={5}
                        sx={{
                           bgcolor: theme.palette.background.default,
                           transition: leftDrawerOpened ? theme.transitions.create("width") : "none"
                        }}
                     >
                        <Toolbar>
                           <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                        </Toolbar>
                     </AppBar>

                     {/* drawer */}
                     <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

                     {/* main content */}
                     <Main theme={theme} open={leftDrawerOpened} className={cursorLoading && "cursor-loading"}>
                        {/* breadcrumb */}
                        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
                        <Outlet />
                     </Main>
                     <Customization />
                  </Box>
               </>
            ) : (
               <p>Sin permiso</p>
               // <Navigate to={"/login"} />
            )}
         </>
      )
   );
   // return auth && permissionRead ? (
   //    <Box sx={{ display: "flex" }}>
   //       <CssBaseline />
   //       {/* header */}
   //       <AppBar
   //          enableColorOnDark
   //          position="fixed"
   //          color="inherit"
   //          elevation={5}
   //          sx={{
   //             bgcolor: theme.palette.background.default,
   //             transition: leftDrawerOpened ? theme.transitions.create("width") : "none"
   //          }}
   //       >
   //          <Toolbar>
   //             <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
   //          </Toolbar>
   //       </AppBar>

   //       {/* drawer */}
   //       <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

   //       {/* main content */}
   //       <Main theme={theme} open={leftDrawerOpened} className={cursorLoading && "cursor-loading"}>
   //          {/* breadcrumb */}
   //          <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
   //          <Outlet />
   //       </Main>
   //       <Customization />
   //    </Box>
   // ) : (
   //    <Navigate to={"/login"} />
   // );
};

export default MainLayout;
