//=================================INITIAL=================================\\
const express = require('express');
const app = express();
const exphbs = require('express-handlebars').create({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    defaultLayout: 'main',
    extname: 'hbs'
});
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
// const mongoose = require('mongoose');

//=================================MIDDLEWARE=================================\\
app.engine('hbs', exphbs.engine)
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


//=================================LISTEN=================================\\
app.listen(port, () => {
    console.log("App listening on port " + port + "!");
});