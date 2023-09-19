import dashboard from "./dashboard";
import catalogs from "./catalogs";

// assets
import * as tablerIcons from "@tabler/icons";

// constant
// const icons = { IconDashboard, IconFileDollar };

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
   items: [
      {
         id: "dashboard",
         title: "Dashboard",
         type: "group",
         children: [
            {
               id: "default",
               title: "Dashboard",
               type: "item",
               url: "/admin/",
               icon: tablerIcons["IconDashboard"],
               breadcrumbs: false
            },
            {
               id: "request",
               title: "Solicitud de Beca",
               type: "item",
               url: "/admin/solicitud-beca",
               icon: tablerIcons["IconFileDollar"],
               breadcrumbs: false
            }
         ]
      },
      {
         id: "admin",
         title: "Administrativo",
         caption: "Control de usuarios",
         type: "group",
         children: [
            {
               id: "admin-users",
               title: "Usuarios",
               type: "item",
               url: "/admin/usuarios",
               icon: tablerIcons["IconUsers"],
               breadcrumbs: false
            },
            {
               id: "admin-roles",
               title: "Roles",
               type: "item",
               url: "/admin/roles",
               icon: tablerIcons["IconPaperBag"]
            }
         ]
      },
      {
         id: "catalogs",
         title: "Catálogos",
         caption: "Gestion de catálogos",
         type: "group",
         children: [
            {
               id: "admin-brands",
               title: "Marcas",
               type: "item",
               url: "/admin/catalogos/brands",
               icon: tablerIcons["IconHelp"],
               breadcrumbs: false
            },
            {
               id: "admin-models",
               title: "Modelos",
               type: "item",
               url: "/admin/catalogos/modelos",
               icon: tablerIcons["IconHelp"]
            },
            {
               id: "admin-models",
               title: "Modelos",
               type: "item",
               url: "/admin/catalogos/modelos",
               icon: tablerIcons["IconHelp"]
            }
         ]
      }
   ]
   // items: [dashboard, catalogs]
};

export default menuItems;
