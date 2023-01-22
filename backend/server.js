/// Imports
const express = require('express');
const dotenv = require('dotenv').config();
///

// Initialisations
const app = express();


// Homepage
app.get('/', (req, res) => {
    res.status(200).send("<h1>Hello world</h1>");
});


// Start server on specified port
app.listen(process.env.BACKEND_PORT, () => {
    console.log("Server started");
});