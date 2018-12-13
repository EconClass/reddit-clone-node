const Post = require('../models/post.js');
const Comment = require('../models/comment.js');

module.exports = app => {
    // CREATE comments
    app.post("/posts/:postId", function(req, res) {
        // FIND THE PARENT POST
        Post.findById(req.params.postId).exec(function(err, post) {
        // UNSHIFT A NEW COMMENT
        post.comments.unshift(req.body);
        // SAVE THE PARENT
        post.save();
    
        // REDIRECT BACK TO THE PARENT POST#SHOW PAGE TO SEE OUR NEW COMMENT IS CREATE
        return res.redirect(`/posts/` + post._id);
        });
    });
};