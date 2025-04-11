const bodyParser = require('body-parser');
const express = require('express');
const db = require('./configs/database');
const app = express();
const port = 8095;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/uploads', express.static('uploads'));

const session = require('express-session');

app.use(session({
  secret: 'flipkart_clone_secret', // change to a secure secret
  resave: false,
  saveUninitialized: true,
}));


app.use((req, res, next) => {
    res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
    next();
});


app.use('/', require('./routers'));

app.listen(port, (err) => {
    if (!err) {
        console.log("Server Star on ");
        console.log("http://localhost:" + port);
        db();
    }
})