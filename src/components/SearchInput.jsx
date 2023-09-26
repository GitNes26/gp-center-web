import { Card, CardContent, FormControl, FormControlLabel, InputAdornment, Radio, RadioGroup, Tooltip } from "@mui/material";
import { IconSearch } from "@tabler/icons";

const [search, setSearch] = useState("");
const [searchType, setSearchType] = useState("number");

const handleChangeSearch = (value) => {
   setSearch(value);
};

const handleChangeSearchBy = (value) => {
   setSearchType(value);
   setSearch("");
   // setTypeInputSearch(value);
};

const handleKeyUpSearch = async (e) => {
   if (e.target.value.length == 0) return Toast.Info("Buscador vacio.");
   if (e.key === "Enter" || e.keyCode === 13) {
      // setClassesImgVehicle("zoom-out");
      setLoading(true);
      const searchBy = searchType == "number" ? "stock_number" : "plates";
      // const res = await showVehicleBy(searchBy, search);
      if (res.result.length == 0) Toast.Info(res.alert_title);
      setSearch("");
      setLoading(false);
      setTimeout(() => {
         // setClassesImgVehicle("zoom-in");
      }, 800);
   }
};

const SearchInput = ({ idName, backgroundColor, titleTooltip, positionTooltip, searchType, search, placeholder, searchTypeValue }) => {
   <Card sx={{ backgroundColor: backgroundColor || "transparent" }}>
      <CardContent>
         {/* <InputLabel id="search-label" sx={{ marginBottom: 2 }}>
                        Buscar Vehículo
                     </InputLabel> */}
         <Tooltip title={titleTooltip || "Presiona ENTER para comenzar la busqueda"} placement={positionTooltip || "top"}>
            <OutlineInputStyle
               id={idName || "search"}
               name={idName || "search"}
               type={searchType || "text"}
               fullWidth
               value={search || ""}
               onChange={(e) => handleChangeSearch(e.target.value)}
               onKeyUp={(e) => handleKeyUpSearch(e)}
               placeholder={placeholder || "Buscar vehículo"}
               startAdornment={
                  <InputAdornment position="start">
                     <IconSearch stroke={2.5} size="1.5rem" color={theme.palette.grey[500]} />
                  </InputAdornment>
               }
               aria-describedby={`${search}-helper-text`}
               inputProps={{ "aria-label": "weight" }}
               sx={{}}
            />
         </Tooltip>

         <FormControl fullWidth sx={{ color: "whitesmoke", alignItems: "center" }}>
            {/* <FormLabel id="searchType-label" sx={{ color: "whitesmoke" }}>
                           Buscar por
                        </FormLabel> */}
            <RadioGroup
               row
               aria-labelledby="searchType-label"
               id="searchType"
               name="searchType"
               value={searchTypeValue || "number"}
               onChange={(e) => handleChangeSearchBy(e.target.value)}
            >
               <FormControlLabel value={"number"} control={<Radio />} label="No. de Unidad" />
               <FormControlLabel value={"text"} control={<Radio />} label="Placas" />
            </RadioGroup>
         </FormControl>
      </CardContent>
   </Card>;
};

export default SearchInput;
