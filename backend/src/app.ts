import cors from 'cors';
import express from 'express';
import http from 'http';
import authRoutes from './routes/auth';
import eventRoutes from './routes/event';
import reservationRoutes from './routes/reservation';
import userRoutes from './routes/user';
import { initializeSocket } from './utils/socket';

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);
app.set('io', io);

app.use(
  cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
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
