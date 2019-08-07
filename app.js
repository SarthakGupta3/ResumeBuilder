const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const multer = require('multer');

const adminRoutes = require('./routes/user/admin');
const userRoutes = require('./routes/user/user');
const connection = require('./utils/database').connection;


const app = express();

app.set('view engine', 'ejs');


const store = new MongoDbStore({
    uri:'mongodb+srv://Sarthak:FPD7qmu91LeHl5L0@cluster0-llyzd.mongodb.net/main',
    collection:'sessions'
});


app.use(express.static('public'));
app.use('/images',express.static('images'));
// app.use('/templates', express.static('templates'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret:'secret', resave:false, saveUninitialized:false, store:store }));


app.use(userRoutes);
app.use('/admin',adminRoutes);

app.get('/', (req,res,next) => {
    res.render('index',{isLoggedIn:req.session.isLoggedIn});
})

connection(() => {
    app.listen(8080);
    console.log('Server Up and running');
});


