"use client";

import React from "react";
// import { Car, Fuel, Gauge, Calendar, Weight, Cog, DollarSign, Award, Shield, Zap } from "lucide-react";
import { ModalComponent } from "../../../components/ModalComponent";
import { useGlobalContext } from "../../../context/GlobalContext";
import { IconAward, IconBold, IconCalendar, IconCar, IconCurrencyDollar, IconGasStation, IconGauge, IconShield, IconWeight } from "@tabler/icons";
import { useVehicleContext } from "../../../context/VehicleContext";
import { IconSettingsCog } from "@tabler/icons-react";

export default function VehicleCardInfo() {
   const { openCardInfo, setOpenCardInfo } = useGlobalContext();
   const { veichle } = useVehicleContext();
   console.log("🚀 ~ VehicleCardInfo ~ veichle:", veichle);

   return (
      <ModalComponent open={openCardInfo} setOpen={setOpenCardInfo}>
         <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
               <div className="bg-base-100 shadow-2xl rounded-3xl overflow-hidden">
                  <div className="relative h-80 sm:h-96">
                     <img src="/placeholder.svg?height=600&width=800" alt="Imagen del vehículo" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent"></div>
                     <h1 className="absolute bottom-4 left-6 text-4xl font-bold text-white drop-shadow-lg">Modelo XYZ 2023</h1>
                  </div>

                  <div className="p-6 sm:p-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InfoSection title="Especificaciones Generales" icon={<IconCar />}>
                           <InfoItem label="Marca" value="Marca Example" />
                           <InfoItem label="Modelo" value="XYZ" />
                           <InfoItem label="Año" value="2023" />
                           <InfoItem label="Tipo" value="Sedán de Lujo" />
                        </InfoSection>
                        <InfoSection title="Motor y Rendimiento" icon={<IconSettingsCog />}>
                           <InfoItem label="Motor" value="3.0L V6 Turbo" />
                           <InfoItem label="Potencia" value="350 HP @ 5,500 rpm" />
                           <InfoItem label="Torque" value="500 Nm @ 2,000-4,500 rpm" />
                           <InfoItem label="Transmisión" value="Automática 9 velocidades" />
                        </InfoSection>
                        <InfoSection title="Consumo y Emisiones" icon={<IconGasStation />}>
                           <InfoItem label="Consumo ciudad" value="10.5 L/100km" />
                           <InfoItem label="Consumo carretera" value="7.2 L/100km" />
                           <InfoItem label="Emisiones CO2" value="180 g/km" />
                           <InfoItem label="Norma de emisiones" value="Euro 6d" />
                        </InfoSection>
                        <InfoSection title="Dimensiones y Capacidades" icon={<IconWeight />}>
                           <InfoItem label="Largo" value="5,050 mm" />
                           <InfoItem label="Ancho" value="1,960 mm" />
                           <InfoItem label="Alto" value="1,470 mm" />
                           <InfoItem label="Peso" value="1,850 kg" />
                        </InfoSection>
                     </div>

                     <div className="divider my-10">Características Destacadas</div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard icon={<IconGauge />} title="Velocidad Máxima" value="280 km/h" />
                        <FeatureCard icon={<IconBold />} title="0-100 km/h" value="4.5 segundos" />
                        <FeatureCard icon={<IconCalendar />} title="Garantía" value="5 años o 100,000 km" />
                        <FeatureCard icon={<IconShield />} title="Seguridad" value="5 estrellas NCAP" />
                        <FeatureCard icon={<IconAward />} title="Premios" value="Coche del Año 2023" />
                        <FeatureCard icon={<IconCurrencyDollar />} title="Precio Base" value="$65,000" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </ModalComponent>
   );
}

function InfoSection({ title, children, icon }) {
   return (
      <div className="space-y-4">
         <h3 className="text-2xl font-semibold flex items-center gap-2 text-primary">
            {React.cloneElement(icon, { className: "w-6 h-6" })}
            {title}
         </h3>
         <div className="bg-base-200 rounded-xl p-4 space-y-2">{children}</div>
      </div>
   );
}

function InfoItem({ label, value }) {
   return (
      <div className="flex justify-between items-center">
         <span className="text-base-content/70">{label}</span>
         <span className="font-medium">{value}</span>
      </div>
   );
}

function FeatureCard({ icon, title, value }) {
   return (
      <div className="card bg-primary text-primary-content hover:bg-primary-focus transition-colors duration-300">
         <div className="card-body items-center text-center p-6">
            {React.cloneElement(icon, { className: "w-10 h-10 mb-2" })}
            <h3 className="card-title text-lg">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
         </div>
      </div>
   );
}
