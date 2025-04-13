const express = require('express');
const bodyParser = require('body-parser');
const db = require('./configs/database');
const app = express();
const port = 8095;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/uploads', express.static('uploads'));
const cookieParse = require('cookie-parser');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('./middlewares/passportLocal');
const { clientRedirect } = require('./middlewares/redirectPage');

app.use(session({
  secret: 'flipkart_clone_secret', // change to a secure secret
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParse());
app.use(passport.userLocalData);

app.use(passport.cartLocal);

app.use(clientRedirect);
app.use('/', require('./routers'));

app.listen(port, (err) => {
    if (!err) {
        console.log("Server Star on ");
        console.log("http://localhost:" + port);
        db();
    }
})