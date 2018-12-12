const Post = require('../models/post.js'),
    User = require('../models/user.js');

module.exports = app => {
    // INDEX
    app.get("/", (req, res) => {
        let currentUser = req.user;
        // console.log(req.cookies)
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
        res.render("posts-new.hbs");
    });

    // CREATE
    app.post('/posts', function(req, res) {
        // console.log(req)
        let post = new Post(req.body);
        post.author = req.user._id;

        post.save()
        .then((post)=>{
            return User.findById(req.user._id);
        })
        .then((user)=>{
            user.posts.unshift(post);
            user.save();
            res.redirect('/posts/' + post._id)
        })
        .catch((err)=>{
            console.log(err.message);
        });

    });

    // SHOW one Post
    app.get("/posts/:id", function(req, res) {
        Post.findById(req.params.postId)
        .populate('author', 'username')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User'
            }
        })
        .then((post)=>{
            // console.log(post);
            res.render('posts-show', {post: post});
        })
        .catch((err)=>{
            console.log(err.message);
        })
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