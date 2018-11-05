const Post = require('../models/post.js');

module.exports = app => {
    // INDEX
    app.get('/', (req, res) => {
        Post.find({})
            .then(posts => {
                res.render("posts-index.hbs", { posts });
            })
            .catch(err => {
                console.log(err.message);
            });
    });

    //NEW
    app.get("/posts/new", (req, res) => {
        res.render("posts-new.hbs");
    });

    // CREATE
    app.post('/posts', (req, res) => {
    // INSTANTIATE INSTANCE OF POST MODEL
        const post = new Post(req.body);

        // SAVE INSTANCE OF POST MODEL TO DB
        post.save((err, post) => {
            // REDIRECT TO THE ROOT
            return res.redirect(`/`);
        })
    });
};