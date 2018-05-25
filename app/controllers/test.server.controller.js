'use strict';
const Test = require('../models/test.server.model.js').test

module.exports = {
  // 注册一个用户
  create: function(req, res, next) {
    var user_info = {
      username: req.query.username,
      password:req.query.password

    };
    console.log(user_info);
    Test.create(user_info).then(function(result) {
      if (result) {
        res.status(200).json(user_info);
      } else {
        res.status(404).json(user_info);
      }
    }).catch(next);
  }
};

