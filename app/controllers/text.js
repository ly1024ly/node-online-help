'use strict';
var multer = require('multer');
var md5 = require('md5');
var request = require('request');
var fs = require('fs');
var mongolass = require('../../common_lib/db.js');
const files = require('../models/file_model.js');
const util = require('../../common_lib/util');
let UUID = require("uuid");


var storage = multer.diskStorage({
    destination: "/var/www/static/upload/helpdoc/",

    filename: function (req, file, cb) {
        let newname = UUID.v1();
        newname = newname + "." + file.originalname.split('.')[1];
        cb(null, newname);
    }                                                                                                                                                                                     
});


var upload = multer({
    storage: storage
});


module.exports = {
    upload_files: function (req, res, next) {
        let file = req.file;
        console.log(file,req.body)
        if (file && req.body.ID) {
            files.upload_file(file.filename,req.body.ID).then(function(result){
                if(result){
                    res.status(200).json({
                        'result':'success',
                        'value':result
                    });
                } else {
                    res.status(200).json(util.fileupload);
                }
           }).catch(err => {
                res.status(200).json(util.fileupload);
           })
        } else {
            res.status(200).json(util.paramserror);
        };
    }, 
    publishFile: function(req,res){
        files.publishFile(req.body.ID,req.body.title).then(function(result){
            if(result){
                let newname = UUID.v1();
                let file =fs.writeFile("/var/www/static/upload/helpdoc/" + newname +  req.body.title+".html",result,function(err){
                    if(err){
                        throw err
                    } else {
                        mongolass._db.collection('collections').update({ID:req.body.ID},{'$set':{pubhtml:newname +  req.body.title+".html"}}).then(result1 => {
                            if(result1){
                                mongolass._db.collection('fileinfos').update({ID:req.body.ID},{'$set':{pubhtml:newname +  req.body.title+".html"}}).then(result2 => {
                                    if(result2){
                                        res.status(200).json({
                                            'result':'success',
                                            'value':result
                                        });
                                    } else {
                                        res.status(200).json(util.publishfail);
                                    }
                                })
                            } else {
                                res.status(200).json(util.publishfail);
                            }
                        })
                    }
                });

                /*res.status(200).json({
                    'result':'success',
                    'value':result
                });*/
            } else {
                res.status(200).json(util.fileupload);

            }
        }).catch(err => {
            res.status(200).json(util.fileupload);
        })
    },
    upload:upload,
    
};