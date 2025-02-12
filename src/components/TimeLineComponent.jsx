import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat";
import { IconSteeringWheel, IconTemplate, IconTool, IconUserStar } from "@tabler/icons-react";
import { formatDatetime, removeDuplicates } from "./../utils/Formats";
import { Tooltip, Typography } from "@mui/material";
import { IconCarSuv } from "@tabler/icons-react";

const TimeLineComponent = ({ items = [] }) => {
   // console.log("🚀 ~ TimeLineComponent ~ items:", items);
   // created_at, vehicle_status, km, username
   const element = {
      ALTA: { icon: <IconTemplate />, timelineDotVariant: "transparent", timelineDotColor: "#fff" },
      DISPONIBLE: { icon: <IconCarSuv />, timelineDotVariant: "filled", timelineDotColor: "#128129" },
      ASIGNADO: { icon: <IconUserStar />, timelineDotVariant: "filled", timelineDotColor: "#083691" },
      PRESTADO: { icon: <IconSteeringWheel />, timelineDotVariant: "filled", timelineDotColor: "#99860A" },
      "EN SERVICIO": { icon: <IconTool />, timelineDotVariant: "filled", timelineDotColor: "#59575C" },
      "POR APROBAR SERVICIO": { icon: <IconTool />, timelineDotVariant: "filled", timelineDotColor: "#6648ad" },
      "SERVICIO APROBADO": { icon: <IconTool />, timelineDotVariant: "filled", timelineDotColor: "#2db49d" }
   };
   const elements = items.map((item, index) => (
      <TimelineItem key={`Key-TimelineItem-${index}`}>
         <TimelineOppositeContent sx={{ m: "auto 0", fontSize: 25 }} variant="h3" color="#1F2227" align="right">
            {item.vehicle_status}
            <Typography fontSize={11}>Por: {item.sys_user}</Typography>
            <Tooltip title={item.comments}>
               <Typography fontSize={11} color={"primary.main"} fontWeight={"bolder"} sx={{ cursor: "pointer" }}>
                  Comentarios
               </Typography>
            </Tooltip>
         </TimelineOppositeContent>
         <TimelineSeparator>
            <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
            <TimelineDot sx={{ backgroundColor: element[item.vehicle_status].timelineDotColor }} variant={element[item.vehicle_status].timelineDotVariant}>
               <Tooltip title={item.vehicle_status_description}>{element[item.vehicle_status].icon}</Tooltip>
            </TimelineDot>
            <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
         </TimelineSeparator>
         <TimelineContent sx={{ py: "35px", px: 2, color: "#070E18" }}>
            <Typography variant="h3" component="span" sx={{ color: "#070E18" }}>
               {item.active_user} <br />
               <Typography>Km: {item.km}</Typography>
            </Typography>
            <Typography fontSize={14}>{formatDatetime(item.created_at)}</Typography>
         </TimelineContent>
      </TimelineItem>
   ));
   return (
      <Timeline position="alternate" key={"TimeLine"}>
         {elements}
      </Timeline>
   );
};

export default TimeLineComponent;
