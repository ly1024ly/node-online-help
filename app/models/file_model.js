'use strict';
var mongolass = require('../../common_lib/db.js');


module.exports = {
	/**
	 * 保存唯一编码
	 */
	create_number: function(data){
		return mongolass._db.collection('numbers').insert(data);
	},
	/**
	 * 获得唯一编码
	 */
	get_number: function(data){
		return mongolass._db.collection('numbers').find({}).sort({'timestamp': -1}).toArray();
	},
	/**
	 * 保存文件记录
	 */
	create_file: function(data){
		return mongolass._db.collection('fileinfos').insert(data);
	},
	/**
	 * 修改文件记录
	 */
	modify_file: function(ID,data){
		return mongolass._db.collection('fileinfos').update({'ID': ID},{'$set':{status:data}});
	},
	/**
	 * 删除文件记录
	 */
	delete_file: function(ID){
    return mongolass._db.collection('fileinfos').remove({'ID': ID}) 
	},
	/**
	 * 获得文件记录
	 */
	get_file: function(ID, username){
		return mongolass._db.collection('fileinfos').findOne({'username': username, 'ID': ID});
	},

  all_file: function(){
  	let files = function(resolve, reject) {
        mongolass._db.collection('fileinfos').find({}).toArray(function(err, docs)  {
            if (err) {
                reject(err);
            } else {
            	
                resolve(docs);
            }
        });
    }
  	return new Promise(files)
  },
  
  user_file: function(username){
  	var userfile = function(resolve, reject) {
        mongolass._db.collection('fileinfos').find({"username":username}).toArray(function(err, docs)  {
            if (err) {
                reject(err);
            } else {
            	 
                resolve(docs);
            }
        });
    }
  	return new Promise(userfile)
  },
  //根据id搜索某个手册
  find_file: function(ID){
    return mongolass._db.collection('fileinfos').findOne({'ID': ID});
  }
}