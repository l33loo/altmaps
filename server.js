"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const cookieSession = require('cookie-session')
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const bcrypt      = require('bcrypt');

// Seperated Routes for each Resource
const mapsRoutes = require("./routes/maps");
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["Slowly at first", "as if it hardly meant it", "the snow began to fall."],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// checks session and if valid sets req.userLoggedIn = true (or false if not logged in)
app.use((req, res, next) => {
  // console.log(`req.session.userId is ${req.session.userId}`);
  if(req.session.userId){
    req.loggedIn = true;
  } else {
    req.loggedIn = false;
  }
  next();
});

//This is Don's custom middleware
//After session is configured, but BEFORE routes:
//Check to see if there is a user_id in req.session
//If there is, set req.loggedIn and look up the user from the db
//Save user in a key on the request object, making it available
//to routes later on
// app.use((req, res, next) => {
//   req.loggedIn = Boolean(req.session.user_id);
//   if (req.loggedIn) {
//     process.knex('users').select().where('id', req.session.user_id)
//     .then(user => {
//       req.user = user[0];
//       next();
//     })
//     .catch(err => {
//       pino.error("USER WTF: ", err);
//       next();
//     });
//   }
// });

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/maps", mapsRoutes(knex));
app.use("/users", usersRoutes(knex));

// HOME
app.get("/", (req, res) => {
  res.redirect("/maps");
});

app.get("/login", (req, res) => {
  if(req.loggedIn){
    res.redirect("/");
  } else {
    res.render("login", {loggedIn: req.loggedIn, userId: req.session.userId});
  }
});

app.get("/register", (req, res) => {
  if(req.loggedIn){
    res.redirect("/");
  } else {
    res.render("register", {loggedIn: req.loggedIn, userId: req.session.userId});
  }
});


//works
function checkEmptyFields(req, res) {
  console.log(req.body.username);
  if (req.body.username === "" ||
      req.body.email === "" ||
      req.body.firstName === "" ||
      req.body.lastName === "" ||
      req.body.password === "") {
    return true;
  } else {
    return false;
  }
}

// Calls callback if username does not already exist in db.
function checkUsernameReg(req, res, callback) {
  knex
    .select()
    .from('users')
    .where('username', req.body.username)
    .then(user => {
      if (user.length === 0) {
        callback();
      } else {
        res.status(400).send("This username is already registered.");
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function checkEmailReg(req, res, cb) {
  knex
    .select()
    .from('users')
    .where('email', req.body.email)
    .then(user => {
      if (user.length === 0) {
        cb();
      } else {
        res.status(400).send("This email is already registered. Please log in instead.");
      }
    })
    .catch(err => {
      console.error(err);
  });
}

function insertUserInfoDb(req, cb) {
bcrypt.hash(req.body.password, 12)
  .then(hash => {
    knex("users").insert({
        username: req.body.username,
        email: req.body.email,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        password_hash: hash
    })
    .then(cb);
  })
  .catch(err => {
    console.error(err);
  });
}

function getUserIdFromEmail(req, res) {
  knex
    .select()
    .from('users')
    .where('email', req.body.email)
    .then(rows => {
      req.session.userId = rows[0].id;
      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
    });
}

app.post("/register", (req, res) => {
  if (checkEmptyFields(req)) {
    res.status(400).send("Please fill out all the fields.");
  } else {
    checkUsernameReg(req, res, function() {
      checkEmailReg(req, res, function() {
        insertUserInfoDb(req, function() {
          getUserIdFromEmail(req, res);
        });
      });
    });
  }
});

// logs in user by user_id, which is entered into the email field on client side.
app.post("/login", (req, res) => {
  if(req.body.email) {
    getUserIdFromEmail(req, res);
  } else {
    res.redirect("/");
  }
});

// remove session cookie and redirect to main page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
