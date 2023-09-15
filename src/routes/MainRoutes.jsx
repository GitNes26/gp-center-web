import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import SchoolView, { loaderIndexSchoolsView } from "../views/admin/SchoolsView";
import LevelsView from "../views/admin/LevelsView";
import SchoolContextProvider from "../context/SchoolContext";
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
               path: "escuelas",
               element: (
                  <SchoolContextProvider>
                     <SchoolView />
                  </SchoolContextProvider>
               ),
               loader: loaderIndexSchoolsView
            },
            {
               path: "niveles",
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
