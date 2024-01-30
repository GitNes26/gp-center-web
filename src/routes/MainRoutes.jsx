import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import UsersView, { loaderIndexUsersView } from "../views/admin/UsersView/Index";
import UserContextProvider from "../context/UserContext";
import { element } from "prop-types";
import DepartmentContextProvider from "../context/DepartmentContext";
import BrandContextProvider from "../context/BrandContext";
import ModelContextProvider from "../context/ModelContext";
import VehicleStatusContextProvider from "../context/VehicleStatusContext";
import VehicleStatusView from "../views/cove/VehicleStatusView/Index";
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
import DriversView from "../views/admin/DriversView/Index";
import DriverContextProvider from "../context/DriverContext";
import LoanedVehicleContextProvider from "../context/LoanedVehicleContext";
import MenusView from "../views/admin/MenusView/Index";
import RolesView from "../views/admin/RolesView/Index";
import ModelsView from "../views/cove/ModelsView/Index";
import BrandsView from "../views/cove/BrandsView/Index";

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
                           <DriverContextProvider>
                              <LoanedVehicleContextProvider>
                                 <ShowVehicleView />
                              </LoanedVehicleContextProvider>
                           </DriverContextProvider>
                        </AssignedVehicleContextProvider>
                     </DirectorContextProvider>
                  </ServiceContextProvider>
               </VehiclePlateContextProvider>
            </VehicleContextProvider>
         )
      },
      {
         path: "menus",
         element: (
            <MenuContextProvider>
               <MenusView />
            </MenuContextProvider>
         )
         // loader: loaderIndex
      },
      {
         path: "roles-y-permisos",
         element: (
            <RoleContextProvider>
               <MenuContextProvider>
                  <RolesView />
               </MenuContextProvider>
            </RoleContextProvider>
         )
         // loader: loaderIndex
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
         path: "conductores",
         element: (
            <DriverContextProvider>
               <DirectorContextProvider>
                  <DepartmentContextProvider>
                     <DriversView />
                  </DepartmentContextProvider>
               </DirectorContextProvider>
            </DriverContextProvider>
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
               )
               // loader: loaderIndexModelsView
            },
            {
               path: "requisiciones",
               element: (
                  <VehicleStatusContextProvider>
                     <VehicleStatusView />
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
                     <BrandContextProvider>
                        <ModelsView />
                     </BrandContextProvider>
                  </ModelContextProvider>
               )
               // loader: loaderIndexModelsView
            },
            {
               path: "estatus-vehiculo",
               element: (
                  <VehicleStatusContextProvider>
                     <VehicleStatusView />
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
