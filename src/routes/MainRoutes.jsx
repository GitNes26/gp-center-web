import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import UsersView, { loaderIndexUsersView } from "../views/admin/UsersView/UsersView";
import UserContextProvider from "../context/UserContext";
import { element } from "prop-types";
import DepartmentContextProvider from "../context/DepartmentContext";
import DepartmentsView from "../views/admin/DepartmentsView/DepartmentsView";
import BrandContextProvider from "../context/BrandContext";
import BrandsView from "../views/cove/BrandsView/BrandsView";
import ModelContextProvider from "../context/ModelContext";
import ModelsView, { loaderIndexModelsView } from "../views/cove/ModelsView/ModelsView";
import VehicleStatusContextProvider from "../context/VehicleStatusContext";
import VehicleStatussView from "../views/cove/VehicleStatusView/VehicleStatusView";
import VehicleContextProvider from "../context/VehicleContext";
import VehiclesView, { loaderIndexVehiclesView } from "../views/cove/VehiclesView/VehiclesView";
import ShowVehicleView from "../views/cove/ShowVehicleView/ShowVehicleView";
import VehiclePlateContextProvider from "../context/VehiclePlateContext";
import ServiceContextProvider from "../context/ServiceContext";
import ServicesView from "../views/garage/ServicesView/ServicesView";
import MenuContextProvider from "../context/MenuContext";
import DirectorsView from "../views/admin/DirectorsView/DirectorsView";
import DirectorContextProvider from "../context/DirectorContext";

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard/Default")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
   path: "/admin",
   element: (
      <MenuContextProvider>
         <MainLayout />
      </MenuContextProvider>
   ),
   children: [
      {
         index: true,
         element: (
            <VehicleContextProvider>
               <VehiclePlateContextProvider>
                  <ServiceContextProvider>
                     <ShowVehicleView />
                  </ServiceContextProvider>
               </VehiclePlateContextProvider>
            </VehicleContextProvider>
         )
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
         path: "administradores",
         element: (
            <UserContextProvider>
               <UsersView />
            </UserContextProvider>
         )
         // loader: loaderIndex
      },
      {
         path: "encargados-de-almacen",
         element: (
            <UserContextProvider>
               <UsersView />
            </UserContextProvider>
         )
         // loader: loaderIndex
      },
      {
         path: "directores",
         element: (
            <DirectorContextProvider>
               <DirectorsView />
            </DirectorContextProvider>
         )
         // loader: loaderIndex
      },
      {
         path: "taller",
         children: [
            {
               path: "almacen",
               element: (
                  <BrandContextProvider>
                     <BrandsView />
                  </BrandContextProvider>
               )
               // loader: loaderIndexUsersView
            },
            {
               path: "servicios",
               element: (
                  <ServiceContextProvider>
                     <ServicesView />
                  </ServiceContextProvider>
               ),
               loader: loaderIndexModelsView
            },
            {
               path: "requisiciones",
               element: (
                  <VehicleStatusContextProvider>
                     <VehicleStatussView />
                  </VehicleStatusContextProvider>
               )
               // loader: loaderIndexModelsView
            }
         ]
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
            }
         ]
      }
   ]
};

export default MainRoutes;
