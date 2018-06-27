'use strict';
const auth = require('../models/auth_model.js');
const util = require('../../common_lib/util');
var mongolass = require('../../common_lib/db.js');


module.exports = {
  getAuth:function(req,res){
    console.log("auth")
    if(util.checkparas(['username'],req.query)){
      auth.getAuth(req.query.username).then(function(result){
        if(result){
          res.status(200).json({
            'result': 'success',
            'value': result
          });
        }else{
          res.status(200).json(util.noauth);
        }
      })
    }else{
      res.status(200).json(util.paramserror);
    }
  }
}