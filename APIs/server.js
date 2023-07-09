const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const db = require('./models');
const migrations = require('./migrations');
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

// Parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cookieParser());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));


// Routes
require('./routes/app.routes')(app);
require('./routes/frontend.routes')(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/admin.routes')(app);


// Set port listening for requests
const PORT = process.env.SERVER_PORT;
server = app.listen(PORT, () => {
  console.log(`APIs is running on port ${PORT}.`);
});


// Connect to database
db.mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log('Successfully connect to MongoDB.');
  if(process.env.DB_INIT == 1) migrations.initial();
}).catch(err => {
  console.error('Connection error', err);
  process.exit();
});


// Initiate app
module.exports = app;