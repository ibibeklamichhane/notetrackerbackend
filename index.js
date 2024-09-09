const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: true, // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'], // Add 'auth-token' here
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// available routes
app.get('/', (req, res) => res.status(200).json({message: 'Hello World'}));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
