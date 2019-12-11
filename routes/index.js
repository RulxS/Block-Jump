var express = require('express');
var router = express.Router();

var env = require('dotenv').config();
const Client = require('pg').Client;
const client = new Client({
  connectionString: process.env.DATABASE_URL
});
client.connect(); //connect to database

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/howtoplay', function(req, res, next) {
  res.render('howtoplay');
});

router.get('/credits', function(req, res, next) {
  res.render('credits');
});

router.get('/records', function(req, response, next) {
  // client object enables issuing SQL queries
  client.query('SELECT * FROM gameusers', function(err, result){
    if (err) {next(err);}
    response.render('records',result);
  });
});




module.exports = router;
