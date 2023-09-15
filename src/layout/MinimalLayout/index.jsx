import { Outlet } from "react-router-dom";

// project imports
import Customization from "../Customization";
import UserContextProvider from "../../context/UserContext";

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => (
   <>
      <Outlet />
      <Customization />
   </>
);

export default MinimalLayout;
