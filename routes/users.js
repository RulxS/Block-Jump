var express = require('express');
var router = express.Router();

var env = require('dotenv').config();
const Client = require('pg').Client;
const client = new Client({
  connectionString: process.env.DATABASE_URL
});
client.connect(); //connect to database

var passport = require('passport');
var bcrypt = require('bcryptjs');

/* GET users listing. */

router.get('/home', loggedIn, function(req, res, next) {
  //res.send('respond with a resource');
  res.render('home'); //display user.hbs
});

router.get('/logout', function(req, res){
  req.logout(); //passport provide it
  res.redirect('../'); // Successful. redirect to localhost:3000/users
});

function loggedIn(req, res, next) {
  if (req.user) {
    next(); // req.user exists, go to the next function (right after loggedIn)
  } else {
    res.redirect('/users/login'); // user doesn't exists redirect to localhost:3000/users/login
  }
}

function notLoggedIn(req, res, next) {
  if (!req.user) {
    next();
  } else {
    res.redirect('/users/home');
  }
}
router.get('/login', notLoggedIn, function(req, res, next) {
  //res.send('respond with a resource');
  res.render('login'); //display user.hbs
});

router.get('/login', function(req, res){
    //success is set true in sign up page
    //req.flash('error') is mapped to 'message' from passport middleware
    res.render('login', {success:req.query.success, errorMessage: req.flash('error')});
});

router.post('/login',
  // This is where authentication happens - app.js
  // authentication locally (not using passport-google, passport-twitter, passport-github...)
  passport.authenticate('local', { failureRedirect: 'login', failureFlash:true }),
  function(req, res,next) {
    res.redirect('/users/home'); // Successful. redirect to localhost:3000/users/profile
});

router.get('/signup', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('signup'); //display user.hbs
});

// check if username has spaces, DB will whine about that
function validUsername(username) {
  var login = username.trim(); // remove spaces
  return login !== '' && login.search(/ /) < 0;
}

function createUser(req, res, next){

  var salt = bcrypt.genSaltSync(10);
  var pwd = bcrypt.hashSync(req.body.password, salt);

  client.query('INSERT INTO users (username, password) VALUES($1, $2)', [req.body.username, pwd], function(err, result) {
    if (err) {
      console.log("unable to query INSERT");
      return next(err); // throw error to error.hbs.
    }
    console.log("User creation is successful");
    res.redirect('/users/home?success=true');
  });
}

router.post('/signup', function(req, res, next) {
  // Reject users
  if (!validUsername(req.body.username)) {
    return res.render('signup');
  }

  client.query('SELECT * FROM users WHERE username=$1',[req.body.username], function(err,result){
    if (err) {
      console.log("sql error ");
      next(err); // throw error to error.hbs.
    }
    else if (result.rows.length > 0) {
      console.log("user exists");
      res.render('signup', { errorMessage: "true" });
    }
    else {
      console.log("no user with that name");
      createUser(req, res, next);
    }
  });
});

module.exports = router;
