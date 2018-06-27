'use strict';
const code = require('../models/code_model.js');
const util = require('../../common_lib/util');
var mongolass = require('../../common_lib/db.js');

module.exports = {

  create_code: function(req,res){
    if(util.checkparasArray(['sharecode','books'],req.body)){
      code.create_code(req.body).then(result => {
       
        if(result){
          res.status(200).json({
            'result': 'success',
            'value': result
          });
        } else {
          res.status(200).json(util.servererror);
        }
      }).catch( err => {
        res.status(200).json(util.servererror);
      })
    } else {
      res.status(200).json(util.paramserror);
    }
  },
  get_all_code: function(req,res){
    code.get_all_code().then(result => {
      if(result){
          res.status(200).json({
            'result': 'success',
            'value': result
          });
        } else {
          res.status(200).json(util.servererror);
        }
      }).catch(err => {

      })
  }
}