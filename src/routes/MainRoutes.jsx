import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import UsersView, { loaderIndexUsersView } from "../views/admin/UsersView";
import UserContextProvider from "../context/UserContext";
import { element } from "prop-types";
import DepartmentContextProvider from "../context/DepartmentContext";
import DepartmentsView from "../views/admin/DepartmentsView";
import BrandContextProvider from "../context/BrandContext";
import BrandsView from "../views/cove/BrandsView";
import ModelContextProvider from "../context/ModelContext";
import ModelsView, { loaderIndexModelsView } from "../views/cove/ModelsView";
import VehicleStatusContextProvider from "../context/VehicleStatusContext";
import VehicleStatussView from "../views/cove/VehicleStatusView";
import VehicleContextProvider from "../context/VehicleContext";
import VehiclesView, { loaderIndexVehiclesView } from "../views/cove/VehiclesView";
import VehiclesRegisterView from "../views/cove/VehicleRegisterView";

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
         path: "usuarios",
         element: (
            <UserContextProvider>
               <UsersView />
            </UserContextProvider>
         ),
         loader: loaderIndexUsersView
      },
      {
         path: "departamentos",
         element: (
            <DepartmentContextProvider>
               <DepartmentsView />
            </DepartmentContextProvider>
         )
         // loader: loaderIndex
      },
      {
         path: "cove",
         children: [
            {
               path: "marcas",
               element: (
                  <BrandContextProvider>
                     <BrandsView />
                  </BrandContextProvider>
               )
               // loader: loaderIndexUsersView
            },
            {
               path: "modelos",
               element: (
                  <ModelContextProvider>
                     <ModelsView />
                  </ModelContextProvider>
               ),
               loader: loaderIndexModelsView
            },
            {
               path: "estatus-vehiculo",
               element: (
                  <VehicleStatusContextProvider>
                     <VehicleStatussView />
                  </VehicleStatusContextProvider>
               )
               // loader: loaderIndexModelsView
            },
            {
               path: "vehiculos",
               element: (
                  <VehicleContextProvider>
                     <VehiclesView />
                  </VehicleContextProvider>
               ),
               loader: loaderIndexVehiclesView
            },
            {
               path: "vehiculos/registrar",
               element: (
                  <VehicleContextProvider>
                     <VehiclesRegisterView />
                  </VehicleContextProvider>
               ),
               loader: loaderIndexVehiclesView,
               bgImage: true
            }
         ]
      }
   ]
};

export default MainRoutes;
