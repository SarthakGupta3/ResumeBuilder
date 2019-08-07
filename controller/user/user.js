const getDb = require('../../utils/database').getDb;
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const fs = require('fs');
const path = require('path');
const ObjectId = require('mongodb').ObjectId;
let database;

const transporter = nodemailer.createTransport(sendGridTransport({
    auth:{
        api_key:'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'
    }
}));

const newUser = (req,res,next) => {
    let email = req.body.email;
    let password = req.body.password;
    database = getDb();
    database.collection('User').find({email:email}).next().then((result) => {
        if(result){
            res.render('register', {errorMessage:'User already exists'})
        }
        else{
            database.collection('User').insertOne({email:email, password:password, saved:[]}).then(()=> {
                res.redirect('/login');
            }).catch(err => {
                console.log(err);
            })
        }
    }).catch(err => {
        console.log(err);
    });
}

const login = (req,res,next) => {
    let email = req.body.email;
    let password = req.body.password;
    database = getDb();
    database.collection('User').find({email:email, password:password}).next().then((result)=> {
        if(result){
            let user ={
                email:email,
                password:password
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            if(result.isAdmin){
                req.session.isAdmin = true;
            }
            res.redirect('/templates');
        }else{
            res.render('login', {errorMessage:'Invalid email or password'});
        }
            }).catch(err => {
            console.log(err);
        });
}

const logout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
}

const getReset = (req, res, next) =>{
    res.render('reset',{errorMessage:null});
}

const postReset = (req, res, next) => {
    email = req.body.email;
    let database = getDb();
    database.collection('User').find({email:email}).next().then(result => {
        if(!result){
            res.render('reset', {errorMessage:true});
        }
        else{
            transporter.sendMail({
                to:email,
                from: 'ResumeBuilder',
                subject:'Password reset',
                html:`<h4>Your password is "${result.password}"</h4>`
            });
            res.redirect('/login');
        }
    }).catch(err => {
        console.log(err);
    })
}  

const templates = (req, res, next) => {
    let database = getDb();
    database.collection('templates').find().toArray().then(result => {
        if(result){
            res.render('templates', {items:result, admin:req.session.isAdmin});
        }
        
    }).catch(err => {
        console.log(err);
    })
}


const save = (req, res, next) => {
    let database = getDb();
        if(req.session.template._id){
                 let storage = 'saved/' + (req.session.user.email + '-' + req.session.template._id) + '.html';
                try{
                    if(fs.existsSync(storage)){
                        fs.unlinkSync(storage, function(err){
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }catch(err){
                    console.log(err);
                }
               
                
                fs.writeFile(storage, req.body.data, function(err){
                    if(err){
                        return console.log(err);
                    }
                    let saveOne = {
                        title:req.session.template.title,
                        image:req.session.template.imagePath,
                        savePath:storage,
                        id:req.session.template._id.toString()
                    }
                    req.session.saved = [];
            database.collection('User').find({email:req.session.user.email}).next().then(
            (result) => {
                if(result){
                    for(let i=0;i<result.saved.length;i++)
                    {
                        if(result.saved[i].savePath === saveOne.savePath){
                            result.saved.splice(i,1);
                        }
                    }
                    req.session.saved = result.saved;
                    req.session.saved.push(saveOne);
                    database.collection('User').updateOne({email:req.session.user.email}, 
                        {$set:{saved:req.session.saved}});
                }
            }
            ).catch(err => {
                console.log(err);
            })
                })
                res.redirect('/templates');
            } 
}

const Resume = (req, res, next) => {
    let database = getDb();

        database.collection('templates').find({_id:ObjectId(req.query.id)}).next().then((result) => {
            if(result){
                res.sendFile(path.join(__dirname, '../', '../', 'templates', req.params.temp));
                req.session.template = result;
            }else{
                res.render('error');
            }
           
        }).catch(err => {
            console.log(err);
           
        })
    
   
};

const saved = (req, res, next) => {
    let database = getDb();
    database.collection('User').find({email:req.session.user.email}).next().then(result => {
        if(result){
            res.render('saved',{works:result.saved});
        }   
    }).catch(err => {
        console.log(err);
    });
    
}

const load = (req, res, next) => {
    if(req.params.load){
        let id = req.params.load.split('-')[1].split('.')[0];
        if(req.query.id === id){
            res.sendFile(path.join(__dirname, '../', '../', 'saved', req.params.load));
        }
        else{
            res.render('error');
        }
    }
    else{
        res.render('error');
    }
}

const Remove = (req, res, next) => {
    try{
        let storage = 'saved/' + req.params.file;
        if(fs.existsSync(storage)){
            fs.unlinkSync(storage, function(err){
                console.log(err);
            });
        let database = getDb();
        req.session.saved = [];
        database.collection('User').find({email:req.session.user.email}).next().then(result => {
            if(result){
                for(let i=0;i<result.saved.length;i++){
                    if(result.saved[i].savePath === storage){
                        result.saved.splice(i, 1);                    
                    }
                req.session.saved = result.saved;
                database.collection('User').updateOne({email:req.session.user.email},{
                    $set:{saved: req.session.saved}}).then(() => {
                        res.redirect('/templates/saved');
                    })
                }
            }
        }).catch(err => {
            console.log(err);
        })
        }else{
            res.send('<h1>Something went wrong</h1>');
        }
    }catch(err){
        if(err){
            console.log(err);
        }
    }

} 

exports.newUser = newUser;
exports.login = login;
exports.logout = logout;
exports.getReset = getReset;
exports.postReset = postReset;
exports.templates = templates;
exports.save = save;
exports.Resume = Resume;
exports.saved=saved;
exports.load = load;
exports.Remove =Remove;