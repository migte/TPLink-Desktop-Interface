// By - migte
// Special thanks to Academind for server creation information

// dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// API routes
const colorRoute = require('./routes/color');
const deviceListRoute = require('./routes/deviceList');
const powerState = require('./routes/powerState');
const deviceSettings = require('./routes/deviceSettings');

// Have body parser turn our data into json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Take in requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Auhtorization"
    );
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json();
    }
    next();
});

// Link endpoints with routes
app.use('/color', colorRoute);
app.use('/devices', deviceListRoute);
app.use('/power', powerState);
app.use('/deviceSettings', deviceSettings);


module.exports = app;
