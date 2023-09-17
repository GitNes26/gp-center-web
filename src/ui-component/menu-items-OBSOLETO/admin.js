// assets
import { IconBrandChrome, IconHelp, IconBuildingSkyscraper, IconNumber } from "@tabler/icons";

// constant
const icons = { IconBrandChrome, IconHelp, IconBuildingSkyscraper, IconNumber };

// ==============================|| PAGINAS DISPONIBLES PARA UN ADMIN ||============================== //

const admin = {
   id: "admin",
   title: "Catalogos",
   caption: "Gestion de catalogos",
   type: "group",
   children: [
      {
         id: "admin-users",
         title: "Escuelas",
         type: "item",
         url: "/admin/usuarios",
         icon: icons.IconBuildingSkyscraper,
         breadcrumbs: false
      },
      {
         id: "admin-roles",
         title: "Roles",
         type: "item",
         url: "/admin/roles",
         icon: icons.IconNumber
      },
   ]
};

export default admin;
