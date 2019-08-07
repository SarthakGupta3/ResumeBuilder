const express = require('express');
const multer = require('multer');

const isAdmin = require('../../middleware/isAdmin');


const adminControl = require('../../controller/user/admin');

const router = express.Router();

router.get('/add-template',isAdmin, (req,res,next) => {
    res.render('add-template');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.fieldname === 'template'){
            cb(null, 'templates');
        }
        if(file.fieldname === 'image'){
            cb(null, 'images');
        }
        
    },
    filename: (req, file, cb) => {
        if(file.fieldname === 'template'){
            cb(null,new Date().toISOString() + '-' + file.originalname);
        }
        if(file.fieldname === 'image'){
            cb(null,new Date().toISOString() + '-' + file.originalname);
        }
    }
})
router.post('/add-template', (multer({storage:storage}).fields([{name:'template'},{name:'image'}])),adminControl.addTemplate);

router.get('/remove-template', isAdmin, adminControl.removeTemplate);
module.exports = router;