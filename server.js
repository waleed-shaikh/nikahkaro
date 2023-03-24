const express = require('express');
const session = require('express-session');
const mongoose = require("mongoose");
const MongoDBStore = require('connect-mongo');
const userRoute = require("./routes/userRoute");
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require("passport");
const flash = require('connect-flash');
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const port = 5000;

// Session Storage MongoDb Connection
const sessionStorage = MongoDBStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: 'nikahkaro',
    collectionName: 'mySessions',
    autoRemove: 'native'
    //ttl: 14 * 24 * 60 * 60
  });
  
// Middleware
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));
const hour = 3600000
app.use(session({
    key: 'auth_sid',
    secret: 'secret',
    path: '/',
    cookie: {
        maxAge: 60000*60*24,
    },
    resave: false,
    saveUninitialized: false,
    store: sessionStorage,
}));
app.use(passport.initialize());
app.use(passport.authenticate('session'));
app.use(passport.session());
app.use(flash());
//------------------- END OF MIDDLEWARE ------------------

// Routes
app.use("/api/users", userRoute);
//------------------- END OF Routes ------------------


// Starting Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})