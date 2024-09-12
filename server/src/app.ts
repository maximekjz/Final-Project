import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser'
import leagueRoutes from './routes/leagueRoutes'; // Adjusted path if necessary
import userRouter from './routes/userRouter';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import likeRoutes from './routes/likeRoutes'
import teamRoutes from './routes/teamRoutes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

// Configure CORS to allow requests from your client
app.use(cors({
  origin: 'http://localhost:5173', // Ensure this matches your client port
  credentials: true
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api', likeRoutes)

// League routes
app.use('/api/leagues', leagueRoutes);

// League routes
app.use('/api/teams', teamRoutes);

// User routes
app.use('/user', userRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});