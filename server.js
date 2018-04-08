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

function checkEmptyFields(info) {
  console.log(typeof info.username);
  if (info.username === "" ||
      info.email === "" ||
      info.firstName === "" ||
      info.lastName === "" ||
      info.password === "") {
    return true;
  } else {
    return false;
  }
}

  function checkUsernameReg(username) {
    console.log("checkUsernameReg");
    knex
      .select()
      .from('users')
      .where('username', username)
      .then(user => {
        console.log('user: ' + user);
        console.log(user[0]);
        return Boolean(user[0]);
      })
      .catch(err => {
        console.error(err);
    });
  }

  function checkEmailReg(email) {
    console.log("checkEmailReg");
    knex
      .select()
      .from('users')
      .where('email', email)
      .then(user => {
        return Boolean(user[0]);
      })
      .catch(err => {
        console.error(err);
    });
  }

function successReg(info) {
  console.log("successReg");
      bcrypt.hash(info.password, 12)
      .then(hash => {
        knex('users')
        .insert({
          username: info.username,
          email: info.email,
          first_name: info.firstName,
          last_name: info.lastName,
          password_hash: hash
        });
      })
      .catch(err => {
          console.error(err);
        });
}





// function getUserNrFromEmail(givenEmail) {
//   const usersArr = Object.getOwnPropertyNames(usersDb);
//   return usersArr.find(function(user) {
//     if (givenEmail === usersDb[user].email) {
//       return user;
//     }
//   });
// }

app.post("/register", (req, res) => {
  if (checkEmptyFields(req.body)) {
    console.log(checkEmptyFields(req.body));
      res.status(400).send("Please fill out all the fields.");
    } else if (checkUsernameReg(req.body.username)) {
      res.status(400).send("This username is already registered.");
    } else if (checkEmailReg(req.body.email)) {
      res.status(400).send("This email is already registered. Please log in instead.");
    } else {
      successReg(req.body);
      req.session.userId = req.body.email;
      res.redirect("/maps");
    }
  // Display error messages directly on page with jQUERY (app.js):
  // 1. email/username already registered
  // 2. Invalid email/username
  // 3. Invalid password
});

// logs in user by user_id, which is entered into the email field on client side.
app.post("/login", (req, res) => {
  if(req.body.email){
    req.session.userId = req.body.email;
    console.log(`Logged in user ${req.body.email}`);
  }
  res.redirect("/");
});

// remove session cookie and redirect to main page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
