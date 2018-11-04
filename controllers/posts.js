module.exports = app => {
    // NEW
    app.get('/posts/new', (req, res) => {
        res.render('posts-new')
    })
    // CREATE
    app.post('/posts', (req, res) => {
        console.log(req.body);
    });
};