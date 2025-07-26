import cors from 'cors';
import express from 'express';
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import authRoutes from './routes/auth';
import eventRoutes from './routes/event';
import reservationRoutes from './routes/reservation';
import userRoutes from './routes/user';
import { setIO } from "./utils/socket";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });
app.set("io", io);
setIO(io);

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/reservations', reservationRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  });
}

export default app; 