// assets
import { IconBrandChrome, IconHelp, IconBuildingSkyscraper, IconNumber, IconAspectRatio, IconWheelchair } from "@tabler/icons";

// constant
const icons = { IconBrandChrome, IconHelp, IconBuildingSkyscraper, IconNumber, IconAspectRatio, IconWheelchair };

// ==============================|| PAGINAS DISPONIBLES PARA UN ADMIN ||============================== //

const catalogs = {
   id: "catalogs",
   title: "Catalogos",
   caption: "Gestion de catalogos",
   type: "group",
   children: [
      {
         id: "admin-school",
         title: "Escuelas",
         type: "item",
         url: "/admin/catalogos/escuelas",
         icon: icons.IconBuildingSkyscraper,
         breadcrumbs: false
      },
      {
         id: "admin-levels",
         title: "Niveles",
         type: "item",
         url: "/admin/catalogos/niveles",
         icon: icons.IconNumber
      }
   ]
};

export default catalogs;
