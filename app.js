const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

const config = require('./config');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = config.ENV === 'prod';

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: config.SESSION.SECRET,
    cookie: { maxAge: config.SESSION.MAX_AGE },
    resave: false,
    saveUninitialized: false
}));

if(!isProduction) {
    app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect(encodeURI(config.MONGO.URI));
mongoose.set('debug', config.MONGO.DEBUG);

require('./models/user');
require('./config/passport');

app.use(require('./routes'));

//Error handlers & middlewares
if(!isProduction) {
    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

app.listen(config.PORT, () => console.log(`Server running on http://localhost:${config.PORT}/`));
