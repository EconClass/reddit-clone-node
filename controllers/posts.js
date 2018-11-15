const Post = require('../models/post.js');

module.exports = (app) => {
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
        const post = new Post(req.body);
        post.save ((err, post) => {
            return res.redirect(`/`);
        })
    });
};