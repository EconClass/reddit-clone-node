//=================================INITIAL=================================\\
require('dotenv').config();
const cookieParser = require('cookie-parser'),
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



//=================================LISTEN=================================\\
app.listen(port, () => {
    console.log("App listening on port " + port + "!");
});