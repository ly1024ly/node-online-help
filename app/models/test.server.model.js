'use strict';
var mongolass = require('../../common_lib/db.js');


exports.test = mongolass.model('test', {
  username: { type: 'string', required: true },
  password: { type: 'string', required: true }

})
exports.test.index({ username: 1 }, { unique: true }).exec()// 根据用户名找到用户，用户名全局唯一