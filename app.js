require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const emergenciesRoutes = require('./routes/emergenciesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authentication = require('./authentication/authentication');

const app = express();
connectDB();

app.use(express.json());

app.use('/api/login', authentication);

app.use('/api/emergencies', emergenciesRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
