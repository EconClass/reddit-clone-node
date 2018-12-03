const Post = require('../models/post.js');
const express = require('express');
const app = express();
const Comment = require('../models/comment.js');

// CREATE comments
app.post('/posts/:postId', function(req, res) {
    let postId = req.params.postId;
    Post.findById( postId ).then( function(post) {
        let comment = new Comment(req.body);
        comment.save(function(err, comment) {
            return res.redirect(`/posts/${postId}`);
        }).catch( err => {
            console.log(err)
        });
    });
});

module.exports = app;