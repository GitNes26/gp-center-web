import React, { useEffect, useState } from "react";

type Channel = {
   channel: any;
};

const SSEListener = ({ channel }: Channel) => {
   const [message, setMessage] = useState<string | null>(null);
   const [isConnected, setIsConnected] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      // Establecer la conexión SSE al canal
      const eventSource = new EventSource(`${import.meta.env.VITE_API}/sse/${channel}`);

      // Manejar cuando la conexión se abre
      eventSource.onopen = () => {
         console.log("Conexión abierta");
         setIsConnected(true); // Establecer como conectado
         setError(null); // Limpiar cualquier error anterior
      };

      // Manejar los mensajes recibidos
      eventSource.onmessage = (event) => {
         const data = JSON.parse(event.data);
         setMessage(data.message); // Actualizar el mensaje
      };

      // Manejar errores de conexión
      // eventSource.onerror = (event) => {
      //   console.error('Error en la conexión SSE', event);
      //   setError('Error en la conexión SSE. Intenta nuevamente.');
      //   setIsConnected(false); // Establecer como desconectado
      // };

      // Limpiar la conexión cuando el componente se desmonte
      return () => {
         eventSource.close();
      };
   }, [channel]);

   return (
      <div>
         <h2>Escuchando en el canal: {channel}</h2>

         {/* Mostrar estado de la conexión */}
         {isConnected ? <p>Conectado correctamente al canal {channel}</p> : <p>{error ? error : "Esperando conexión..."}</p>}

         <div>{message ? <p>Nuevo mensaje: {message}</p> : <p>Esperando mensaje...</p>}</div>
      </div>
   );
};

export default SSEListener;
