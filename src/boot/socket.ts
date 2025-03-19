import { boot } from 'quasar/wrappers';
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://192.168.2.7:3000", {
  autoConnect: false, // No conectar automáticamente, lo haremos manualmente
  query: {customId:crypto.randomUUID()}
}
);

export default boot(({ app }) => {
  socket.connect(); // Conectar al iniciar la app
  app.config.globalProperties.$socket = socket;
});

export { socket };
