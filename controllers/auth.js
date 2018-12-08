const express = require('express');
const app = express();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

// SHOW sign up page
app.get('/sign-up', function(req, res) {
    res.render('sign-up.hbs');
});

// CREATE new user
app.post('/sign-up', function(req, res) {
    let user = new User(req.body)
    user.save().then(user => {
        let token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        return res.status(400).send({ err: err });
    });
});

// LOGIN FORM
app.get('/login', function(req, res)  {
    res.render('sign-up.hbs');
});

// LOGIN
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    // Find this user name
    User.findOne({ username }, "username password")
      .then(user => {
        if (!user) {
          // User not found
          return res.status(401).send({ message: "Wrong Username or Password" });
        }
        // Check the password
        user.comparePassword(password, (err, isMatch) => {
          if (!isMatch) {
            // Password does not match
            return res.status(401).send({ message: "Wrong Username or password" });
          }
          // Create a token
          const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
            expiresIn: "60 days"
          });
          // Set a cookie and redirect to root
          res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
          res.redirect("/");
        });
      })
      .catch(err => {
        console.log(err);
      });
  });

// LOGOUT
app.get('/logout', function(req, res) {
    res.clearCookie('nToken');
    res.redirect('/');
});

module.exports = app;