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
import ServicesView from "../views/garage/ServicesView/Index";
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
import DeliveredVehicleContextProvider from "../context/DeliveredVehicleContext";
import VouchersView from "../views/cove/VouchersView/Index";
import VoucherContextProvider from "../context/VoucherContext";
import VoucherRequestersView from "../views/admin/VoucherRequestersView/Index";
import VoucherRequesterContextProvider from "../context/VoucherRequesterContext";
import VoucherDetailContextProvider from "../context/VoucherDetailContext";
import MechanicContextProvider from "../context/MechanicContext";
import MechanicsView from "../views/admin/MechanicsView/Index";

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
         path: ":stock_number?",
         element: (
            <VehicleContextProvider>
               <VehiclePlateContextProvider>
                  <ServiceContextProvider>
                     <DirectorContextProvider>
                        <AssignedVehicleContextProvider>
                           <DriverContextProvider>
                              <LoanedVehicleContextProvider>
                                 <DeliveredVehicleContextProvider>
                                    <ShowVehicleView />
                                 </DeliveredVehicleContextProvider>
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
            <RoleContextProvider>
               <UserContextProvider>
                  <UsersView />
               </UserContextProvider>
            </RoleContextProvider>
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
         path: "mecanicos",
         element: (
            <MechanicContextProvider>
               <MechanicsView />
            </MechanicContextProvider>
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
         path: "conductores",
         element: (
            <DriverContextProvider>
               <DirectorContextProvider>
                  <DriversView />
               </DirectorContextProvider>
            </DriverContextProvider>
         )
         // loader: loaderIndex
      },
      ,
      {
         path: "solicitadores-de-vales",
         element: (
            <UserContextProvider>
               <VoucherRequesterContextProvider>
                  <VoucherRequestersView />
               </VoucherRequesterContextProvider>
            </UserContextProvider>
         )
         // loader: loaderIndex
      },
      // TALLER
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
                  <UserContextProvider>
                     <VehicleContextProvider>
                        <ServiceContextProvider>
                           <ServicesView />
                        </ServiceContextProvider>
                     </VehicleContextProvider>
                  </UserContextProvider>
               ),
               children: [
                  {
                     path: ":status?",
                     element: (
                        <UserContextProvider>
                           <VehicleContextProvider>
                              <ServiceContextProvider>
                                 <ServicesView />
                              </ServiceContextProvider>
                           </VehicleContextProvider>
                        </UserContextProvider>
                     )
                  }
               ]
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
      // CoVe
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
      },
      // CONTROL DE VALES
      {
         path: "vales",
         children: [
            {
               index: true,
               path: ":status?",
               element: (
                  <VoucherContextProvider>
                     <VehicleContextProvider>
                        <VoucherRequesterContextProvider>
                           <VoucherDetailContextProvider>
                              <VouchersView />
                           </VoucherDetailContextProvider>
                        </VoucherRequesterContextProvider>
                     </VehicleContextProvider>
                  </VoucherContextProvider>
               )
               // loader: loaderIndexModelsView
            }
         ]
      }
   ]
};

export default MainRoutes;

// current:
// $2y$10$viiHMX5J1QtbCHQLIA6XPOr7SZgraYKun6qtOa1FP9gC4e4HkeZ1q
// $2y$10$S873LYFgjrMnIgWt19/2SOXLZbs.1FMHU790fPscvsqo9ghLj/XTy

// $2y$10$viiHMX5J1QtbCHQLIA6XPOr7SZgraYKun6qtOa1FP9gC4e4HkeZ1q  $2y$10$Y0eXlRHmdJZVAkDHpqbZM.bzrkqoCFADDgQDW/OS2Xtkq0h0LqoiS
