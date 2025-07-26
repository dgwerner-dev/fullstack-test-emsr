import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function setIO(ioInstance: SocketIOServer) {
  io = ioInstance;
}

export function getIO(): SocketIOServer {
  if (!io) {
    // Em ambiente de teste, retorna um mock simples
    if (process.env.NODE_ENV === 'test') {
      return {
        emit: () => {},
        on: () => {},
        off: () => {}
      } as any;
    }
    throw new Error("Socket.io não inicializado");
  }
  return io;
} 