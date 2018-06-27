'use strict';
var mongolass = require('../../common_lib/db.js');

module.exports = {
  getAuth:function(username){
    return mongolass._db.collection('authTable').findOne({'user':username})
  }
}