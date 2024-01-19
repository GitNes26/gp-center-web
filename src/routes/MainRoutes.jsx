import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import UsersView, { loaderIndexUsersView } from "../views/admin/UsersView/UsersView";
import UserContextProvider from "../context/UserContext";
import { element } from "prop-types";
import DepartmentContextProvider from "../context/DepartmentContext";
import BrandContextProvider from "../context/BrandContext";
import BrandsView from "../views/cove/BrandsView/BrandsView";
import ModelContextProvider from "../context/ModelContext";
import ModelsView, { loaderIndexModelsView } from "../views/cove/ModelsView/ModelsView";
import VehicleStatusContextProvider from "../context/VehicleStatusContext";
import VehicleStatussView from "../views/cove/VehicleStatusView/VehicleStatusView";
import VehicleContextProvider from "../context/VehicleContext";
import VehiclePlateContextProvider from "../context/VehiclePlateContext";
import ServiceContextProvider from "../context/ServiceContext";
import ServicesView from "../views/garage/ServicesView/ServicesView";
import MenuContextProvider from "../context/MenuContext";
import DirectorContextProvider from "../context/DirectorContext";
import AdministratorsView, { loaderIndexAdministratorsView } from "../views/admin/AdministratorsView/Index";
import AdministratorContextProvider from "../context/AdministratorContext";
import DepartmentsView from "../views/admin/DepartmentsView/Index";
import RoleContextProvider from "../context/RoleContext";
import ShowVehicleView from "../views/cove/ShowVehicleView/Index";
import AssignedVehicleContextProvider from "../context/AssignedVehicleContext";
import VehiclesView from "../views/cove/VehiclesView/Index";
import DirectorsView from "../views/admin/DirectorsView/Index";

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
                     <DirectorContextProvider>
                        <AssignedVehicleContextProvider>
                           <ShowVehicleView />
                        </AssignedVehicleContextProvider>
                     </DirectorContextProvider>
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
         path: "administradores",
         element: (
            <AdministratorContextProvider>
               <AdministratorsView />
            </AdministratorContextProvider>
         ),
         loader: loaderIndexAdministratorsView
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
               <DepartmentContextProvider>
                  <DirectorsView />
               </DepartmentContextProvider>
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
                     <BrandContextProvider>
                        <ModelContextProvider>
                           <VehicleStatusContextProvider>
                              <VehiclesView />
                           </VehicleStatusContextProvider>
                        </ModelContextProvider>
                     </BrandContextProvider>
                  </VehicleContextProvider>
               )
               // loader: loaderIndexVehiclesView
            }
         ]
      }
   ]
};

export default MainRoutes;
