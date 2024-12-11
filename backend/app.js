import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import connectDB from './config/db.js';
import emergenciesRoutes from './routes/emergenciesRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import authentication from './authentication/authentication.js';

const app = express();
connectDB();

app.use(json());

app.use('/api/login', authentication);

app.use('/api/emergencies', emergenciesRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
