// assets
import { IconBrandChrome, IconHelp, IconBuildingSkyscraper, IconNumber, IconAspectRatio, IconWheelchair, IconUsers, IconPaperBag } from "@tabler/icons";

// constant
const icons = { IconBrandChrome, IconHelp, IconBuildingSkyscraper, IconNumber, IconAspectRatio, IconWheelchair, IconUsers, IconPaperBag };

// ==============================|| PAGINAS DISPONIBLES PARA UN ADMIN ||============================== //

const catalogs = {
   id: "catalogs",
   title: "Catalogos",
   caption: "Gestion de catalogos",
   type: "group",
   children: [
      {
         id: "admin-users",
         title: "Usuarios",
         type: "item",
         url: "/admin/catalogos/usuarios",
         icon: icons.IconUsers,
         breadcrumbs: false
      },
      {
         id: "admin-roles",
         title: "Roles",
         type: "item",
         url: "/admin/catalogos/roles",
         icon: icons.IconPaperBag
      }
   ]
};

export default catalogs;
