import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import cors from 'cors';
import emergenciesRoutes from './routes/emergenciesRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import authentication from './authentication/authentication.js';

const app = express();

app.use(json());
app.use(cors());

app.use('/api/login', authentication);

app.use('/api/emergencies', emergenciesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reports', reportsRoutes);



export default app;