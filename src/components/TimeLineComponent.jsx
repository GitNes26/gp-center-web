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
import Typography from "@mui/material/Typography";

const TimeLineComponent = () => {
   const elements = (
      <>
         <TimelineItem>
            <TimelineOppositeContent sx={{ m: "auto 0", fontSize: 30 }} variant="h3" color="#1F2227" align="right">
               9:30 am
            </TimelineOppositeContent>
            <TimelineSeparator>
               <TimelineConnector />
               <TimelineDot>
                  <FastfoodIcon />
               </TimelineDot>
               <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "35px", px: 2, color: "#070E18" }}>
               <Typography variant="h2" component="span" sx={{ color: "#070E18" }}>
                  Eat
               </Typography>
               <Typography>Because you need strength</Typography>
            </TimelineContent>
         </TimelineItem>
         <TimelineItem>
            <TimelineOppositeContent sx={{ m: "auto 0", fontSize: 30 }} variant="h3" color="#1F2227">
               10:00 am
            </TimelineOppositeContent>
            <TimelineSeparator>
               <TimelineConnector />
               <TimelineDot color="primary">
                  <LaptopMacIcon />
               </TimelineDot>
               <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "35px", px: 2, color: "#070E18" }}>
               <Typography variant="h2" component="span" sx={{ color: "#070E18" }}>
                  Code
               </Typography>
               <Typography>Because it&apos;s awesome!</Typography>
            </TimelineContent>
         </TimelineItem>
         <TimelineItem>
            <TimelineSeparator>
               <TimelineConnector />
               <TimelineDot color="primary" variant="outlined">
                  <HotelIcon />
               </TimelineDot>
               <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "25px", px: 2, color: "#070E18" }}>
               <Typography variant="h2" component="span" sx={{ color: "#070E18" }}>
                  Sleep
               </Typography>
               <Typography>Because you need rest</Typography>
            </TimelineContent>
         </TimelineItem>
         <TimelineItem>
            <TimelineSeparator>
               <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
               <TimelineDot color="secondary">
                  <RepeatIcon />
               </TimelineDot>
               <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2, color: "#070E18" }}>
               <Typography variant="h2" component="span" sx={{ color: "#070E18" }}>
                  Repeat
               </Typography>
               <Typography>Because this is the life you love!</Typography>
            </TimelineContent>
         </TimelineItem>
      </>
   );
   return (
      <Timeline position="alternate">
         {elements}
         {elements}
         {elements}
      </Timeline>
   );
};

export default TimeLineComponent;
