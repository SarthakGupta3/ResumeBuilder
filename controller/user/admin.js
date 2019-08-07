const getDb = require('../../utils/database').getDb;
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');

const addTemplate = (req,res,next) => {
const fileInfo = {
    title:req.body.title,
    templatePath: req.files.template[0].path,
    imagePath:req.files.image[0].path,
    description:req.body.description
}
  let database = getDb();
  database.collection('templates').insertOne(fileInfo).then(() => {
          res.redirect('/admin/add-template');  
      }
  ).catch(err => {
      console.log(err);
  });
}

const removeTemplate = (req, res, next) => {
    let database = getDb();
    database.collection('templates').find({_id:ObjectId(req.query.id)}).next().then(
        result => {
            if(result){
                let templatePath = result.templatePath;    
                if(fs.existsSync(templatePath)){
                    fs.unlinkSync(templatePath, function(err){
                        console.log(err);
                    })
                }    
                let imagePath = result.imagePath;    
                if(fs.existsSync(imagePath)){
                    fs.unlinkSync(imagePath, function(err){
                        console.log(err);
                    })
                } 
                database.collection('templates').deleteOne({_id:ObjectId(req.query.id)}).then(result => {
                    console.log('deleted');
                    res.redirect('/templates');
                }).catch(err => {
                    console.log(err);
                })     
            }
        }
    )
    .catch(err => {
        console.log(err);
    })
}   

exports.addTemplate = addTemplate;
exports.removeTemplate = removeTemplate;