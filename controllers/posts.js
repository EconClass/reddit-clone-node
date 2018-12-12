const Post = require('../models/post.js');

module.exports = app => {
    // INDEX
    app.get("/", (req, res) => {
        let currentUser = req.user;
        console.log(req.cookies)
        Post.find()
            .then( posts => {
                res.render("posts-index.hbs", { posts, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            });
    });

    //NEW
    app.get("/posts/new", function(req, res) {
        let currentUser = req.user;
        res.render("posts-new.hbs", { posts, currentUser });
    });

    // CREATE
    app.post('/posts', function(req, res) {
        if( req.user ) {
            let post = new Post(req.body);
            post.save ( (err, post) => {
                return res.redirect(`/`);
            });
        } else {
            return res.status(401); // UNAUTHORIZED
        };
    });

    // SHOW one Post
    app.get("/posts/:id", function(req, res) {
        let currentUser = req.user;
        Post.findById( req.params.id ).populate('comments').then(  post => {
            res.render("posts-show.hbs", { posts, currentUser });
        }).catch(err => {
            console.log(err.message);
        });
    });

    // SHOW posts with subreddit tags
    app.get("/n/:subreddit", function(req, res) {
        let currentUser = req.user;
        Post.find({subreddit: req.params.subreddit}).then( posts => {
            res.render('posts-index.hbs', { posts, currentUser })
        }).catch( err => {
            console.log( err );
        });
    });
};