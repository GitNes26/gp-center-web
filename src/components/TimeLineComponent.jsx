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
import { formatDatetime } from "./../utils/Formats";
import { Typography } from "@mui/material";

const TimeLineComponent = ({ items = [] }) => {
   console.log("🚀 ~ TimeLineComponent ~ items:", items);
   // date, action, km, user
   const element = {
      ALTA: { icon: <IconTemplate />, timelineDotVariant: "transparent", timelineDotColor: "#fff" },
      DISPONIBLE: { icon: <FastfoodIcon />, timelineDotVariant: "filled", timelineDotColor: "#128129" },
      ASIGNADO: { icon: <IconUserStar />, timelineDotVariant: "filled", timelineDotColor: "#083691" },
      PRESTADO: { icon: <IconSteeringWheel />, timelineDotVariant: "filled", timelineDotColor: "#99860A" },
      "EN SERVICIO": { icon: <IconTool />, timelineDotVariant: "outline", timelineDotColor: "#59575C" }
   };
   const elements = items.map((item, index) => (
      <>
         <TimelineItem key={`Key-TimelineItem-${index}`}>
            <TimelineOppositeContent sx={{ m: "auto 0", fontSize: 30 }} variant="h3" color="#1F2227" align="right">
               {item.action}
            </TimelineOppositeContent>
            <TimelineSeparator>
               <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
               <TimelineDot sx={{ backgroundColor: element[item.action].timelineDotColor }} variant={element[item.action].timelineDotVariant}>
                  {element[item.action].icon}
               </TimelineDot>
               <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "35px", px: 2, color: "#070E18" }}>
               <Typography variant="h3" component="span" sx={{ color: "#070E18" }}>
                  {item.user} <br />
                  <Typography>Km: {item.km}</Typography>
               </Typography>
               <Typography fontSize={14}>{formatDatetime(item.date)}</Typography>
            </TimelineContent>
         </TimelineItem>
      </>
   ));
   return <Timeline position="alternate">{elements}</Timeline>;
};

export default TimeLineComponent;
