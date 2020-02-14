const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect Database
connectDB();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

// Define Routes
//console.log('serverjs route');
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
const PORT = 5000;

app.listen(PORT, () => console.log('User Management Server started on port ${PORT}'));
