const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

module.exports = app => {
    // SHOW sign up page
    app.get('/sign-up', function(req, res) {
        res.render('sign-up.hbs');
    });

    // CREATE new user
    app.post('/sign-up', (req, res)=>{
        const user = new User(req.body);
        user.save()
        .then((user)=>{
            let token = jwt.sign({ _id: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.SECRET, { expiresIn: "60 days" });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            res.redirect("/");
        })
        .catch((err)=>{
            console.log(err.message);
            return res.status(400).send({ err: err });
        });
    });

    // LOGOUT
    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        res.redirect('/');
    });

    // LOGIN FORM
    app.get('/login', function(req, res)  {
        res.render('sign-up.hbs');
    });

    // LOGIN
    app.post("/login", function(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({ username }, "username password")
        .then(user => {
            if (!user) {
                return res.status(401).send({ message: "Wrong Username or Password" });
            }
            // Check the password
            user.comparePassword(password, (err, isMatch) => {
                if (!isMatch) {
                    // Password does not match
                    return res.status(401).send({ message: "Wrong Username or password" });
                }
                // Create a token
                const token = jwt.sign({ _id: user._id, username: user.username }, secret, {
                expiresIn: "60 days"
            });
            // Set a cookie and redirect to root
            res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
            res.redirect("/");
            });
        })
        .catch(err => {
        console.log(err);
        });
    });
}
