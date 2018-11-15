const Post = require('../models/post.js');

module.exports = (app) => {
    // INDEX
    app.get('/', function(req, res) {
        Post.find({}).then(posts => {
            res.render("posts-index.hbs", { posts });
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
        Post.findById( req.params.id ).then(  post => {
            res.render("posts-show.hbs", { post });
        }).catch(err => {
            console.log(err.message);
        });
    });
};