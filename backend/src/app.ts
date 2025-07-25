import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth';
import eventRoutes from './routes/event';
import reservationRoutes from './routes/reservation';
import userRoutes from './routes/user';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/reservations', reservationRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app; 