const express = require('express');
const app = express();
const User = require('../models/user.js');

// SHOW sign up page
app.get('/sign-up', function(req, res) {
    res.render('sign-up.hbs');
})

// CREATE new user
app.post('/sign-up', function(req, res){
    let user = new User(req.body)
    user.save().then(user => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    });
});

module.exports = app;