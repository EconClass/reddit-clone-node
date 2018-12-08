const Post = require('../models/post.js');
const express = require('express');
const app = express();
const Comment = require('../models/comment.js');

// CREATE comments
app.post('/posts/:postId/comments', function ( req, res ) {
    const comment = new Comment(req.body);
    comment.save()
        .then(comment => {
            return Post.findById(req.params.postId);
        }).then( post => {
            post.comments.unshift(comment);
        }).then( post => {
            res.redirect('/');
        })
        .catch( err => {
            console.log(err);
        });
});

module.exports = app;