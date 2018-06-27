'use strict';
var mongolass = require('../../common_lib/db.js');
var deviceapi = mongolass.model('code', {
    sharecode: { type: 'string', require: true }
   
});
deviceapi.index({ sharecode: 1 }, { unique: true }).exec();

var changebook = function(val){
    if(val.status == "update"){
      console.log("update=="+val.sharecode)
      return mongolass._db.collection('code').update({'sharecode':val.sharecode},{'$set':{books:val.books}})
          
    }else if(val.status == "insert"){
      console.log("insert=="+val.sharecode)
      return mongolass._db.collection('code').insert(val)
    }
  }


module.exports = {
  create_code:function(arr){
    let a = [];
    arr.forEach(function(val){
      let result = changebook(val);
      a.push(result);
    });
    return Promise.all(a)
  },
  get_all_code: function(){
    return mongolass._db.collection('code').find().toArray();
  }
}