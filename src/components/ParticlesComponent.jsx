import { Particles } from "particles.js";
import particlesConfig from "../assets/plugins/particles-js/particlesjs.json";

const ParticlesComponent = () => {
   useEffect(() => {
      // Configuración de Particles.js
      console.log("particlesConfig", particlesConfig);
      Particles.init(particlesConfig);
   }, []);

   return <div className="bg-login">{/* Aquí puedes agregar cualquier otro contenido */}</div>;
};

export default ParticlesComponent;
