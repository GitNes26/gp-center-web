import { Outlet } from "react-router-dom";

// project imports
import Customization from "../Customization";
// import AuthContextProvider from "../../context/AuthContext";

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => (
   <>
      <Outlet />
      <Customization />
   </>
);

export default MinimalLayout;
