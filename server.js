//=================================INITIAL=================================\\
require('dotenv').config();
const cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    express = require('express'),
    app = express(),
    path = require('path'),
    exphbs = require('express-handlebars').create({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    defaultLayout: 'main',
    extname: 'hbs'
    }),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 3000,
    expressValidator = require('express-validator');


//=================================MIDDLEWARE=================================\\

// Cookie Parser
app.use(cookieParser());

// Handlebars
app.engine('hbs', exphbs.engine)
app.set('view engine', 'hbs');

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express Validator
app.use(expressValidator()); // Add after body parser initialization!

// Method Override
app.use(methodOverride('_method'));

// Set db
require('./data/reddit-db.js');

// Controllers
require('./controllers/posts.js')(app);

require('./controllers/comments.js')(app);

require('./controllers/auth.js')(app);

//=================================CUSTOM_MIDDLEWARE=================================\\

// Authentication
const checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
        req.user = null;
    } else {
        let token = req.cookies.nToken;
        let decodedToken = jwt.decode(token, { complete: true }) || {};
        req.user = decodedToken.payload;
    }  
    next();
};
app.use(checkAuth);

// Authorization
const displayAuth = (req,res,next)=>{
    const adminPath = ['/admin'];
    const insecurePath = ['/','/sign-up','/login'];
    let _ = require('underscore');
    if (req.user || _.contains(insecurePath, req.path)){
        console.log("authenticated");
        if (req.user && !req.user.isAdmin && _.contains(adminPath, req.path)){
            console.log("UNAUTHORIZED");
            return res.send('UNAUTHORIZED').status(403);
        }else{
            return next();
        }
    }else{
        console.log("UNAUTHENTICATED");
        return res.status(401).send('UNAUTHENTICATED');
    }
    next();
}
app.use(displayAuth);

//=================================LISTEN=================================\\
app.listen(port, () => {
    console.log("App listening on port " + port + "!");
});

module.exports = app;