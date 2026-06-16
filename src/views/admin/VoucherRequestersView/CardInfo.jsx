import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { ModalComponent } from "../../../components/ModalComponent";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useEmployeeContext } from "../../../context/EmployeeContext"; // ajusta según tu contexto
import { formatDatetime } from "../../../utils/Formats";
import { useVoucherRequesterContext } from "../../../context/VoucherRequesterContext";

// ─── Utilidades ───────────────────────────────────────────────────────────────

function fmtDate(str) {
   if (!str) return null;
   return formatDatetime(str, false);
}

function calcTenure(hireDateStr) {
   if (!hireDateStr) return null;
   const hire = new Date(hireDateStr);
   const now = new Date();
   const months = (now.getFullYear() - hire.getFullYear()) * 12 + (now.getMonth() - hire.getMonth());
   const years = Math.floor(months / 12);
   const rem = months % 12;
   if (years === 0) return `${rem} mes${rem !== 1 ? "es" : ""} en servicio`;
   if (rem === 0) return `${years} año${years !== 1 ? "s" : ""} en servicio`;
   return `${years} año${years !== 1 ? "s" : ""} y ${rem} mes${rem !== 1 ? "es" : ""} en servicio`;
}

function buildInitials(name, plast, mlast) {
   const parts = [name, plast, mlast].filter(Boolean);
   return parts
      .slice(0, 2)
      .map((p) => p.trim()[0].toUpperCase())
      .join("");
}

function capitalize(str = "") {
   return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

const GENDER_MAP = { M: "Masculino", F: "Femenino", m: "Masculino", f: "Femenino" };

// ─── Primitivos ───────────────────────────────────────────────────────────────

function StatChip({ label, value, mono }) {
   if (value === null || value === undefined) return null;
   return (
      <Box
         sx={{
            bgcolor: "grey.50",
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            px: 1.5,
            py: 1.1
         }}
      >
         <Typography sx={{ fontSize: 10, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.4, mb: 0.25 }}>{label}</Typography>
         <Typography sx={{ fontSize: 13, fontWeight: 600, fontFamily: mono ? "monospace" : undefined, letterSpacing: mono ? 0.3 : undefined }}>{value}</Typography>
      </Box>
   );
}

function Group({ icon, title, iconBg, iconColor, children }) {
   return (
      <Box sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: "10px", overflow: "hidden", mb: 1.25 }}>
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               gap: 1,
               px: 1.5,
               py: 1,
               bgcolor: "grey.50",
               borderBottom: "0.5px solid",
               borderColor: "divider"
            }}
         >
            <Box
               sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  bgcolor: iconBg,
                  color: iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 14
               }}
            >
               {icon}
            </Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.2 }}>{title}</Typography>
         </Box>
         <Box sx={{ px: 1.5, py: 0.25 }}>{children}</Box>
      </Box>
   );
}

function Row({ icon, label, value, mono, valueColor, secondary, nullText }) {
   const empty = value === null || value === undefined || value === "";
   if (empty && !nullText) return null;
   return (
      <Box
         sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            py: 0.75,
            "&:not(:last-child)": { borderBottom: "0.5px solid", borderColor: "divider" }
         }}
      >
         {icon && <Box sx={{ fontSize: 14, color: "text.secondary", mt: "2px", flexShrink: 0 }}>{icon}</Box>}
         <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 10, color: "text.secondary", lineHeight: 1.2, mb: 0.2 }}>{label}</Typography>
            {empty ? (
               <Typography sx={{ fontSize: 12, color: "text.disabled", fontStyle: "italic" }}>{nullText}</Typography>
            ) : (
               <Typography
                  sx={{
                     fontSize: 12,
                     fontWeight: 600,
                     fontFamily: mono ? "monospace" : undefined,
                     letterSpacing: mono ? 0.3 : undefined,
                     wordBreak: "break-all",
                     color: valueColor || "text.primary"
                  }}
               >
                  {value}
               </Typography>
            )}
            {secondary && !empty && <Typography sx={{ fontSize: 10, color: "text.secondary", mt: 0.25 }}>{secondary}</Typography>}
         </Box>
      </Box>
   );
}

// ─── Header del empleado ──────────────────────────────────────────────────────
const HERO_BG = "#1D3461";
const AVATAR_BG = "#2B5291";

function EmployeeHero({ e, tenure }) {
   const HOST = import.meta.env.VITE_HOST;
   const initials = buildInitials(e.name, e.plast_name, e.mlast_name);
   const fullName = capitalize(e.full_name || [e.name, e.plast_name, e.mlast_name].filter(Boolean).join(" "));
   const posName = capitalize(e.position_name || "");
   const deptName = capitalize(e.department_name || "");

   return (
      <Box sx={{ bgcolor: HERO_BG, px: 2.5, pt: 2.25, pb: 2, display: "flex", alignItems: "flex-start", gap: 2, flexWrap: "wrap" }}>
         {/* Avatar */}
         {e.avatar ? (
            <Box
               component="img"
               src={`${HOST}/${e.avatar}`}
               alt={fullName}
               sx={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.2)", flexShrink: 0 }}
            />
         ) : (
            <Box
               sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: AVATAR_BG,
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#B5D4F4",
                  letterSpacing: 1,
                  flexShrink: 0
               }}
            >
               {initials}
            </Box>
         )}

         {/* Identidad */}
         <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", mb: 0.5 }}>
               Ficha de empleado · #{e.employee_id}
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1.15, mb: 0.35 }}>{fullName}</Typography>
            <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.65)", mb: 0.75 }}>
               {posName}
               {deptName ? ` · ${deptName}` : ""}
            </Typography>

            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
               {/* Activo */}
               <Box
                  sx={{
                     display: "inline-flex",
                     alignItems: "center",
                     gap: 0.5,
                     px: 1.25,
                     py: 0.35,
                     borderRadius: "100px",
                     bgcolor: "rgba(102,238,153,0.15)",
                     color: "#9FE1CB",
                     fontSize: 10,
                     fontWeight: 500
                  }}
               >
                  <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#66ee99", flexShrink: 0 }} />
                  {e.employee_active ? "Activo" : "Inactivo"}
               </Box>

               {/* Código */}
               {e.employee_code && (
                  <Box
                     sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        px: 1.25,
                        py: 0.35,
                        borderRadius: "100px",
                        bgcolor: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: 10,
                        fontWeight: 500,
                        fontFamily: "monospace",
                        letterSpacing: 1
                     }}
                  >
                     {e.employee_code}
                  </Box>
               )}

               {/* Organización */}
               {e.organization_name && (
                  <Box
                     sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1.25,
                        py: 0.35,
                        borderRadius: "100px",
                        bgcolor: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 10,
                        fontWeight: 500
                     }}
                  >
                     {e.organization_name}
                  </Box>
               )}
            </Box>
         </Box>

         {/* Ingreso y antigüedad */}
         <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            <Typography sx={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 0.25 }}>
               Ingreso
            </Typography>
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{fmtDate(e.hire_date) || "—"}</Typography>
            {tenure && <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.4)", mt: 0.25 }}>{tenure}</Typography>}
         </Box>
      </Box>
   );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function EmployeeCardInfo() {
   const { openCardInfo, setOpenCardInfo } = useGlobalContext();
   // const { employee: e } = useEmployeeContext(); // ajusta tu contexto
   const { voucherRequester: e } = useVoucherRequesterContext(); // ajusta tu contexto

   const tenure = useMemo(() => calcTenure(e?.hire_date), [e?.hire_date]);

   if (!e) return null;

   return (
      <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo}>
         {/* ── Hero ── */}
         <Box sx={{ mx: -3, mt: -3, mb: 2 }}>
            <EmployeeHero e={e} tenure={tenure} />
         </Box>

         {/* ── Stats rápidas ── */}
         <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 0.9, mb: 2 }}>
            <StatChip label="Usuario" value={e.username} mono />
            <StatChip label="Género" value={GENDER_MAP[e.gender] || e.gender} />
            <StatChip label="ID" value={`#${e.user_id}`} mono />
         </Box>

         {/* ── Grid 2 columnas ── */}
         <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 1.25 }}>
            {/* ── Col izquierda ── */}
            <Box>
               <Group icon="🪪" title="Datos personales" iconBg="#E6F1FB" iconColor="#185FA5">
                  <Row icon="🆔" label="RFC" value={e.rfc} mono />
                  <Row icon="🆔" label="CURP" value={e.curp} mono />
                  <Row icon="📞" label="Teléfono" value={e.phone} nullText="No registrado" />
                  <Row icon="✉️" label="Correo electrónico" value={e.email} valueColor="#185FA5" />
               </Group>

               <Group icon="🔐" title="Acceso al sistema" iconBg="#EEEDFE" iconColor="#534AB7">
                  <Row icon="👤" label="Nombre de usuario" value={e.username} mono />
                  <Row icon="✓" label="Estado de cuenta" value={e.active ? "Activa" : "Inactiva"} valueColor={e.active ? "success.dark" : "error.dark"} />
               </Group>
            </Box>

            {/* ── Col derecha ── */}
            <Box>
               <Group icon="💼" title="Puesto y departamento" iconBg="#E1F5EE" iconColor="#0F6E56">
                  <Row icon="🏷" label="Puesto" value={capitalize(e.position_name)} />
                  <Row icon="📅" label="Inicio en puesto" value={fmtDate(e.position_start)} />
                  <Row icon="📅" label="Fin en puesto" value={fmtDate(e.position_end)} nullText="Vigente" />
                  <Row icon="🏢" label="Departamento" value={capitalize(e.department_name)} />
                  <Row icon="🏛" label="Organización" value={capitalize(e.organization_name)} />
                  {e.administration_name && <Row icon="📋" label="Administración" value={capitalize(e.administration_name)} />}
               </Group>

               <Group icon="🔍" title="Identificadores internos" iconBg="#F1EFE8" iconColor="#5F5E5A">
                  <Row icon="#" label="UUID puesto" value={e.position_uuid} mono />
                  <Row icon="#" label="UUID departamento" value={e.department_uuid} mono />
               </Group>
            </Box>
         </Box>
      </ModalComponent>
   );
}
