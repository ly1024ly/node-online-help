'use strict';
var multer = require('multer');
var md5 = require('md5');
var request = require('request');
var fs = require('fs');
const files = require('../models/file_model.js');
const util = require('../../common_lib/util');
var storage = multer.diskStorage({
    destination: '/var/www/static/upload',
    filename: function (req, file, cb) {
        console.log("hahhahah")
        cb(null, file.originalFilename);
    }                                                                                                                                                                                     
});
var upload = multer({
    storage: storage
});
module.exports = {
    upload_files: function (req, res, next) {
        let file = req.files.file;
        if (file && req.body.ID) {
           files.upload_file(file,req.body.ID).then(function(result){
             if(result.lastErrorObject.updatedExisting){
                res.status(200).json({
                    'result':'success',
                    'value':result
                });
             } else {
                res.status(200).json(util.fileupload);
             }
           })
        } else {
            res.status(200).json(util.paramserror);
        }
    },
   
    
};