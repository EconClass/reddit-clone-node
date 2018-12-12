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

//=================================CONTROLLERS=================================\\
const posts = require('./controllers/posts.js');
app.use(posts);

const comments = require('./controllers/comments.js');
app.use(comments);

// const auth = require('./controllers/auth.js');
// app.use(auth);
require('./controllers/auth.js')(app);
// auth(app);

//=================================LISTEN=================================\\
app.listen(port, () => {
    console.log("App listening on port " + port + "!");
});