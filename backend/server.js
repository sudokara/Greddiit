const express = require('express');
const dotenv = require('dotenv').config();
const app = express();


app.get('/', (req, res) => {
    res.status(200).send("<h1>Hello world</h1>");
});

app.listen(process.env.BACKEND_PORT, () => {
    console.log("Server started");
});