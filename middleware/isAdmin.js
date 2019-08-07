const getDb = require('../utils/database').getDb;

module.exports = (req, res, next) => {
    if(req.session.isLoggedIn){
        let database = getDb();
        database.collection('User').find({email:req.session.user.email}).next().then(result => {
            if(!result.isAdmin){
               return res.send('You are not Authorised to view this');
            }
            next();
        }).catch(err => {
            console.log(err);
        });
    }else{
        res.redirect('/login');
    }

}