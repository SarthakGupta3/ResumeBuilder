const path = require('path');

const express = require('express');

const User = require('../../controller/user/user');
const isAuth = require('../../middleware/auth');

const router = express.Router();

router.get('/login', (req,res,next) => {
   res.render('login',{errorMessage:null});
})

router.get('/register',(req,res,next) => {
    res.render('register',{errorMessage:null});
})

router.post('/new-user', User.newUser);

router.post('/authoriseUser', User.login);

router.get('/templates',isAuth, User.templates);

router.post('/templates/save', User.save);

router.get('/templates/saved',isAuth, User.saved);

router.get('/templates/:temp', isAuth, User.Resume);

router.get('/saved/:load', isAuth, User.load);

router.get('/remove/:file', isAuth, User.Remove);

router.get('/logout', User.logout);

router.get('/reset-password', User.getReset);

router.post('/reset', User.postReset);


module.exports = router;
