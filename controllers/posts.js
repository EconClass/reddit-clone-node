const Post = require('../models/post.js'),
    User = require('../models/user.js');

module.exports = app => {
    // INDEX
    app.get("/", (req, res) => {
        let currentUser = req.user;
        console.log(currentUser)
        // Post.find()
        //     .then( posts => {
        //         res.render("posts-index.hbs", { posts, currentUser });
        //     })
        //     .catch(err => {
        //         console.log(err.message);
        //     });
    });

    //NEW
    app.get("/posts/new", function(req, res) {
        res.render("posts-new.hbs");
        console.log(req.user)
    });

    // CREATE
    app.post('/posts', function(req, res) {
        // console.log(req.cookies)
        if (req.user) {
            var post = new Post(req.body);
            post.author = req.user._id;

            post.save().then(post => {
                return User.find({_id: req.user._id});
            })
            .then(user => {
                user.posts.unshift(post);
                user.save();
                // REDIRECT TO THE NEW POST
                res.redirect("/posts/" + post._id);
            })
            .catch(err => {
                console.log(err.message);
            })

            post.save(function(err, post) {
                return res.redirect(`/`);
            });

        } else {
            return res.status(401); // UNAUTHORIZED
        }

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