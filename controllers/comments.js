const Post = require('../models/post.js');
const Comment = require('../models/comment.js');

module.exports = app => {
    // CREATE comments
    app.post('/posts/:postId/comments', function ( req, res ) {
        const comment = new Comment(req.body);
        comment.save()
            .then(comment => {
                return Post.findById(req.params.postId);
            }).then( post => {
                post.comments.unshift(comment);
                return post.save();
            }).then( post => {
                res.redirect(`/posts/${req.params.postId}`);
            })
            .catch( err => {
                console.log(err);
            });
    });
};