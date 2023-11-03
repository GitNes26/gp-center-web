import dashboard from "./dashboard";
import catalogs from "./catalogs";

// assets
import * as tablerIcons from "@tabler/icons";
import { Axios } from "../../../../../context/AuthContext";

// ==============================|| MENU ITEMS ||============================== //

const auth = JSON.parse(localStorage.getItem("auth"));
const menuItems = {
   items: []
};
if (auth !== null) {
   const pages_read = auth.read;
   const { data } = await Axios.get(`/menus/MenusByRole/${pages_read}`);
   const menus = data.data.result;
   console.log("menus", menus);

   const HeaderMenus = menus.filter((menu) => menu.belongs_to == 0);
   // console.log("HeaderMenus", HeaderMenus);
   const items = [];
   HeaderMenus.map((hm) => {
      const item = {
         id: hm.id,
         title: hm.menu,
         type: hm.type,
         children: []
      };

      const childrenMenus = menus.filter((chm) => chm.belongs_to == hm.id);
      // console.log(childrenMenus);
      childrenMenus.map((iCh) => {
         const child = {
            id: iCh.id,
            title: iCh.menu,
            type: iCh.type,
            url: iCh.url,
            icon: tablerIcons[`${iCh.icon}`]
         };
         item.children.push(child);
      });

      items.push(item);
   });
   // console.log("items", items);
   menuItems.items = items;
}

// const menuItems = {
//    items: [
//       {
//          id: "dashboard",
//          title: "Dashboard",
//          type: "group",
//          children: [
//             // {
//             //    id: "default",
//             //    title: "Dashboard",
//             //    type: "item",
//             //    url: "/admin/",
//             //    icon: tablerIcons["IconDashboard"],
//             //    breadcrumbs: false
//             // },
//             {
//                id: "cove-vehicles-searching",
//                title: "Buscador",
//                type: "item",
//                url: "/admin/cove",
//                icon: tablerIcons["IconSearch"]
//             }
//          ]
//       },
//       // {
//       //    id: "admin",
//       //    title: "Administrativo",
//       //    caption: "Control de usuarios",
//       //    type: "group",
//       //    children: [
//       //       {
//       //          id: "admin-users",
//       //          title: "Usuarios",
//       //          type: "item",
//       //          url: "/admin/usuarios",
//       //          icon: tablerIcons["IconUsers"],
//       //          breadcrumbs: false
//       //       },
//       //       // {
//       //       //    id: "admin-roles",
//       //       //    title: "Roles",
//       //       //    type: "item",
//       //       //    url: "/admin/roles",
//       //       //    icon: tablerIcons["IconPaperBag"]
//       //       // },
//       //       {
//       //          id: "admin-departments",
//       //          title: "Departamentos",
//       //          type: "item",
//       //          url: "/admin/departamentos",
//       //          icon: tablerIcons["IconBuildingSkyscraper"],
//       //          breadcrumbs: false
//       //       }
//       //    ]
//       // },
//       // {
//       //    id: "garage",
//       //    title: "Taller",
//       //    caption: "Catálogos del Taller",
//       //    type: "group",
//       //    children: [
//       //       {
//       //          id: "garage-store",
//       //          title: "Almacen (Stock)",
//       //          type: "item",
//       //          url: "/admin/taller/almacen",
//       //          icon: tablerIcons["IconCar"]
//       //       },
//       //       {
//       //          id: "garage-services",
//       //          title: "Servicios",
//       //          type: "item",
//       //          url: "/admin/taller/servicios",
//       //          icon: tablerIcons["IconCar"]
//       //       },
//       //       {
//       //          id: "garage-request",
//       //          title: "Requisiones - PENDIENTE",
//       //          type: "item",
//       //          url: "/admin/taller/requisiciones",
//       //          icon: tablerIcons["IconCar"]
//       //       }
//       //    ]
//       // },
//       {
//          id: "cove",
//          title: "CoVe",
//          caption: "Catálogos de Control Vehicular",
//          type: "group",
//          children: [
//             {
//                id: "cove-brands",
//                title: "Marcas",
//                type: "item",
//                url: "/admin/cove/marcas",
//                icon: tablerIcons["IconBadgeTm"]
//             },
//             {
//                id: "cove-models",
//                title: "Modelos",
//                type: "item",
//                url: "/admin/cove/modelos",
//                icon: tablerIcons["IconBoxModel2"]
//             },
//             {
//                id: "cove-vehicle-status",
//                title: "Estatus de Vehículo",
//                type: "item",
//                url: "/admin/cove/estatus-vehiculo",
//                icon: tablerIcons["IconStatusChange"]
//             },
//             {
//                // id: "cove-vehicles",
//                // title: "Vehículos",
//                // type: "collapse",
//                // icon: tablerIcons["IconCar"],
//                // children: [
//                //    {
//                id: "cove-vehicles-list",
//                title: "Vehículos",
//                type: "item",
//                url: "/admin/cove/vehiculos",
//                icon: tablerIcons["IconCar"]
//                //    },
//                //    {
//                //       id: "cove-vehicles-searching",
//                //       title: "Busqueda",
//                //       type: "item",
//                //       url: "/admin/cove/vehiculos/busqueda",
//                //       icon: tablerIcons["IconSearch"],
//                //       bgGarage: true
//                //    }
//                // ]
//             }
//             // {
//             //    id: "cove-assigned-vehicle",
//             //    title: "Vehículos Asignados",
//             //    type: "item",
//             //    url: "/admin/cove/vehiculos-asignados",
//             //    icon: tablerIcons["IconCar"]
//             // },
//             // {
//             //    id: "cove-delivered-vehicle",
//             //    title: "Vehículos Entregados",
//             //    type: "item",
//             //    url: "/admin/cove/vehiculos-entregados",
//             //    icon: tablerIcons["IconCar"]
//             // },
//             // {
//             //    id: "cove-loaned-vehicle",
//             //    title: "Vehículos Prestados",
//             //    type: "item",
//             //    url: "/admin/cove/vehiculos-entregados",
//             //    icon: tablerIcons["IconCar"]
//             // }
//          ]
//       }
//    ]
//    // items: [dashboard, catalogs]
// };
console.log("menuItems", menuItems);

export default menuItems;
