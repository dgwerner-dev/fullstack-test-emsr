import { Server as HTTPServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

interface SocketEvents {
  'reservation:created': (data: SocketEventData) => void;
  'reservation:cancelled': (data: SocketEventData) => void;
  'event:updated': (data: SocketEventData) => void;
}

interface SocketInstance extends SocketIOServer {
  emit: (event: keyof SocketEvents, data: SocketEventData) => boolean;
  on: (event: string, listener: (...args: unknown[]) => void) => SocketInstance;
  off: (
    event: string,
    listener?: (...args: unknown[]) => void
  ) => SocketInstance;
}

let io: SocketInstance | null = null;

export function initializeSocket(server: HTTPServer): SocketInstance {
  if (io) {
    return io;
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  }) as SocketInstance;

  io.on('connection', (socket: Socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });

    // Join room para um evento específico
    socket.on('join:event', (eventId: string) => {
      socket.join(`event:${eventId}`);
      console.log(`Cliente ${socket.id} entrou no evento ${eventId}`);
    });

    // Leave room de um evento específico
    socket.on('leave:event', (eventId: string) => {
      socket.leave(`event:${eventId}`);
      console.log(`Cliente ${socket.id} saiu do evento ${eventId}`);
    });
  });

  return io;
}

export function getIO(): SocketInstance {
  if (!io) {
    // Em ambiente de teste, retorna um mock simples
    if (process.env.NODE_ENV === 'test') {
      return {
        emit: () => true,
        on: () => ({}) as SocketInstance,
        off: () => ({}) as SocketInstance,
      } as SocketInstance;
    }
    throw new Error(
      'Socket.io não inicializado. Chame initializeSocket() primeiro.'
    );
  }
  return io;
}

export function emitToEvent(
  eventId: string,
  event: keyof SocketEvents,
  data: SocketEventData
): void {
  const socketIO = getIO();
  socketIO.to(`event:${eventId}`).emit(event, data);
}

export function emitToAll(
  event: keyof SocketEvents,
  data: SocketEventData
): void {
  const socketIO = getIO();
  socketIO.emit(event, data);
}
