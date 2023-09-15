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
         id: "admin-school",
         title: "Escuelas",
         type: "item",
         url: "/admin/escuelas",
         icon: icons.IconBuildingSkyscraper,
         breadcrumbs: false
      },
      {
         id: "admin-levels",
         title: "Niveles",
         type: "item",
         url: "/admin/niveles",
         icon: icons.IconNumber
      },
      {
         id: "admin-perimeters",
         title: "Perímetros",
         type: "item",
         url: "/admin/perimetros",
         icon: icons.IconNumber
      }
   ]
};

export default admin;
