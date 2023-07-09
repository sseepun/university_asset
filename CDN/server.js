const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();


const app = express();

// Enable helmet security
app.use(helmet());


// Give permission for fetch resource
const corsOptions = {
  origin: process.env.ALLOW_URLS.split(',').map(d => {
    return new RegExp(`${d.replace(/http:\/\/|https:\/\/|\//g, '')}$`);
  }),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));


// Routes
require('./routes/file.routes')(app);


// Set port listening for requests
const PORT = process.env.SERVER_PORT;
server = app.listen(PORT, () => {
  console.log(`CDN is running on port ${PORT}.`);
});


// Initiate app
module.exports = app;