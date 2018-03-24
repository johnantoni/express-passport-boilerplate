'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const compression = require('compression')
const MongoStore = require('connect-mongo')(session);
const helmet = require('helmet')
require('dotenv').config();
const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '50mb'}));
app.use(helmet())
app.use(compression({level: 9}))
app.use(morgan(`API Request (port ${port}): :method :url :status :response-time ms - :res[content-length]`));
morganBody(app);

// setup mongoose
var mongooseOptions = {
  reconnectInterval: 500, // Reconnect every 500ms
  reconnectTries: 30, // max number of retries
  keepAlive: true, // keep alive for long running connections
  poolSize: 10, // Maintain up to 10 socket connections
  bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
};

mongoose.Promise = global.Promise; // clear mongo's promise depreciation warning : https://github.com/Automattic/mongoose/issues/4291
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/boilerplate', mongooseOptions)

var sessionOptions = {
  secret: process.env.SESSION_SECRET,
  rolling: true, // https://stackoverflow.com/questions/20387554/how-to-keep-alive-an-nodejs-passport-session
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    // domain: 'localhost:8080',
    // path: '/',
    // domain: 'localhost',
    maxAge: 1000 * 60 * 24 // 24 hours
  }
}

app.use(cookieParser(sessionOptions.secret)); // read cookies (needed for auth)
app.use(session(sessionOptions));

const Users = require('./models/users');
const passport = require('passport');

passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

// cors setup
var corsWhitelist = (process.env.CORS).split(",")
console.log("CORS Whitelist:\n", corsWhitelist)
var corsOptions = {
  origin: function (origin, callback) {
    if (corsWhitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// enable cors pre-flight across the board
app.options('*', cors(corsOptions))

// apply authenticationRequired to all /v1/* routes
app.use('/v1/*', require('./requireLogin'))

// make media directory public
app.use('/media', express.static(path.join(__dirname, 'media')))

// remeber the webpack proxy section to bind these to the client-side

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  var DIST_DIR = path.join(__dirname, "/client/build")
  app.use(express.static(DIST_DIR));
  app.get("*", function (req, res) {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
} else {
  // return server.html if cannot find file (this must be at the end)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/server.html'));
  });
}

app.listen(port);
console.log(`Server listening on ${port}`);
