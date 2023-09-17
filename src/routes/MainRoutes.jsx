import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import UserView, { loaderIndexUsersView } from "../views/admin/UsersView";
import LevelsView from "../views/admin/LevelsView";
import UserContextProvider from "../context/UserContext";
import LevelContextProvider from "../context/LevelContext";
import RequestBecaView, { loaderIndexRequestBecasView } from "../views/admin/RequestBecaView";
import { element } from "prop-types";
import RequestBecaContextProvider from "../context/RequestBecaContext";
import StudentContextProvider from "../context/StudentContext";

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard/Default")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
   path: "/admin",
   element: <MainLayout />,
   children: [
      {
         index: true,
         element: <DashboardDefault />
      },
      {
         path: "dashboard",
         element: <DashboardDefault />
      },
      {
         path: "solicitud-beca",
         element: (
            <RequestBecaContextProvider>
               <StudentContextProvider>
                  <RequestBecaView />
               </StudentContextProvider>
            </RequestBecaContextProvider>
         ),
         loader: loaderIndexRequestBecasView
      },
      {
         path: "catalogos",
         children: [
            {
               path: "usuarios",
               element: (
                  <UserContextProvider>
                     <UserView />
                  </UserContextProvider>
               ),
               loader: loaderIndexUsersView
            },
            {
               path: "roles",
               element: (
                  <LevelContextProvider>
                     <LevelsView />
                  </LevelContextProvider>
               )
               // loader: loaderIndex
            }
         ]
      }
   ]
};

export default MainRoutes;
