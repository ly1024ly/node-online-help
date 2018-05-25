'use strict';
var multer = require('multer');
var md5 = require('md5');
var request = require('request');
var fs = require('fs');
const deviceinfo = require('../models/devicesetting_model.js');
const util = require('../../common_lib/util');
var storage = multer.diskStorage({
    destination: '/var/www/static/upload',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }                                                                                                                                                                                     
});
var upload = multer({
    storage: storage
});
module.exports = {
    upload_file: function (req, res, next) {
        if (req.file && req.body.uuid) {
            console.log(req.file.originalname);
            //
            var md5str = fs.readFileSync(req.file.path);
            let rpc_cmd = {
                "ID": 'OPCUA_REQ_ORDER',
                'order': 'DNC_NCFILE_DOWNLOAD', 'protocol': 'HTTP',
                'url': encodeURI('http://nccloud.weihong.com.cn/upload/' + req.file.originalname),
                'filename': req.file.originalname,
                'md5': md5(md5str),
                'RequestTimeStamp':new Date().toISOString()
            };
            let opts = {
                'method': 'POST',
                'uri': 'http://nccloud.weihong.com.cn/opcuaapi/opcua_controllers/getfun',
                'json': true,
                'body': {
                    id: req.body.uuid,
                    value: JSON.stringify(rpc_cmd)
                }
            };
            request(opts, function (err, resp, body) {
                if (err) {
                    console.log(err);
                    res.status(200).json(util.operationfailed);
                } else {
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        if (resp.body.result == 'success') {
                            console.log(resp.body.value);
                            res.status(200).json(util.normalsuccess);
                        } else {
                            res.status(200).json(util.operationfailed);
                        }
                        console.log(resp.body);
                    } else {
                        console.log(resp.statusCode)
                        res.status(200).json(util.operationfailed);
                    }
                }
            });
        } else {
            console.log('------------------')
            res.status(200).json(util.operationfailed);
        }
    },
    loadfile: function (req, res, next) {
        if (req.body.filename && req.body.uuid) {
            //
            let rpc_cmd = {
                "ID": 'OPCUA_REQ_ORDER',
                'order': 'DNC_NCFILE_LOADFILE',
                'filename': req.body.filename,
                'RequestTimeStamp':new Date().toISOString()
            };
            let opts = {
                'method': 'POST',
                'uri': 'http://nccloud.weihong.com.cn/opcuaapi/opcua_controllers/getfun',
                'json': true,
                'body': {
                    id: req.body.uuid,
                    value: JSON.stringify(rpc_cmd)
                }
            };
            request(opts, function (err, resp, body) {
                if (err) {
                    console.log(err);
                    res.status(200).json(util.operationfailed);
                } else {
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        if (resp.body.result == 'success') {
                            console.log(resp.body.value);
                            res.status(200).json(util.normalsuccess);
                        } else {
                            res.status(200).json(util.operationfailed);
                        }
                        console.log(resp.body);
                    } else {
                        console.log(resp.statusCode)
                        res.status(200).json(util.operationfailed);
                    }
                }
            });
        } else {
            console.log('------------------')
            res.status(200).json(util.operationfailed);
        }
    },
    upload: upload,
    checkauthority:function(req,res,next){
        const username=req.session.user.username;
        const uuid=req.body.uuid;
        deviceinfo.find_operator(uuid).then(function(result){
            if(result && (result.operator == username)){
                next()
            }else{
                res.status(201).json(util.noauthority);
            };
        }).catch(function(error){
            console.log(error);
            res.status(201).json(util.servererror);
        })
    }
    
};