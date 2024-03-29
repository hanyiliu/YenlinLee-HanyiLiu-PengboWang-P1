const express = require('express');
var expressSession = require('express-session');
const bodyParser = require('body-parser');
// const connect = require("./connect.js");
const startLogin = require("./login/start");
const startRegister = require("./register/start");
const startLike = require("./like/start");
const checkLike = require("./like/like.js");
const path = require('path');
const fs = require('fs');


/*
CREATE DATABASE ON SQL FIRST:
------------------------
CREATE DATABASE IF NOT EXISTS website;
USE website;
CREATE TABLE users ( 
	username varchar(20),
	password varchar(20),
    liked varchar(4)
);
-------------------

*/
//connect.connect();

const app = express();

app.use(express.urlencoded({ extended: false })); //Sets parser as express
app.use(bodyParser.json()); //JSON READER
//SESSION STUFF (to keep user logged in)
app.use(expressSession({ secret: 'shhhh dont tell anyone :)', saveUninitialized: true, resave: false }));


//app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs'); //Sets ejs as views

app.use('/', startLogin); //Uses start.js of login
app.use('/', startRegister); //Uses start.js of register
app.use('/', startLike); //Uses start.js of like

//MAIN PAGE
app.get('/', function(req, res) {

    if (req.session.user) {
        console.log("yes");

        fs.copyFile('public/status/in/status.html', 'public/status.html', (err) => {
            if (err) throw err;
            console.log('Rename complete!');
        });


    } else {
        fs.copyFile('public/status/out/status.html', 'public/status.html', (err) => {
            if (err) throw err;
            console.log('Rename complete!');
        });

    }
    res.render('home'); //Render home.ejs
});

//END MAIN PAGE

//LOGIN STUFF
app.get('/login', function(req, res) {
    res.render('login'); //Render index.ejs

});

app.get('/register', function(req, res) {
    res.render('register'); //Render index.ejs
});




app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect("/");
});

//END LOGIN STUFF


//SPORT PAGES

const checkLogin = function(req, callback) {
    if (req.session.user) {
        fs.copyFile('public/likeButton/in/like.css', 'public/like.css', (err) => {
            if (err) throw err;
            console.log('Rename complete!');
        });
        callback(false);
    } else {
        fs.copyFile('public/likeButton/out/like.css', 'public/like.css', (err) => {
            if (err) throw err;
            console.log('Rename complete!');
        });

        callback(true);
    }
}
app.get('/badminton', function(req, res) {


    if (checkLogin(req, function(result) {
            if (result) {
                res.redirect("/login");
            } else {
                res.render('sports/badminton'); //Render badminton.ejs
            }
        }));




});

app.get('/basketball', function(req, res) {
    if (checkLogin(req, function(result) {
            if (result) {
                res.redirect("/login");
            } else {
                res.render('sports/basketball'); //Render basketball.ejs
            }
        }));

});

app.get('/football', function(req, res) {
    if (checkLogin(req, function(result) {
            if (result) {
                res.redirect("/login");
            } else {
                res.render('sports/football'); //Render football.ejs
            }
        }));
});

app.get('/tennis', function(req, res) {
    if (checkLogin(req, function(result) {
            if (result) {
                res.redirect("/login");
            } else {
                res.render('sports/tennis'); //Render tennis.ejs
            }
        }));
});
//END SPORT PAGES

app.listen(3001, () => { //Start server
    console.log('Server is running on port 3001...');
});

module.exports = app;