const Post = require('../models/post.js');
const express = require('express');
const app = express();


// INDEX
app.get('/', function(req, res) {
    Post.find({}).then(posts => {
        res.render("posts-index.hbs", { posts });
        console.log(req.cookies);
    }).catch(err => {
        console.log(err.message);
    });
});

//NEW
app.get("/posts/new", function(req, res) {
    res.render("posts-new.hbs");
});

// CREATE
app.post('/posts', function(req, res) {
    const post = new Post(req.body);
    post.save ( (err, post) => {
        return res.redirect(`/`);
    })
});

// SHOW one Post
app.get("/posts/:id", function(req, res) {
    Post.findById( req.params.id ).populate('comments').then(  post => {
        res.render("posts-show.hbs", { post });
    }).catch(err => {
        console.log(err.message);
    });
});

// SHOW posts with subreddit tags
app.get("/n/:subreddit", function(req, res) {
    Post.find({subreddit: req.params.subreddit}).then( posts => {
        res.render('posts-index.hbs', { posts })
    }).catch( err => {
        console.log( err );
    });
});

module.exports = app;