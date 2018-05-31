'use strict';
var mongolass = require('../../common_lib/db.js');


module.exports = {
	/**
	 * 保存收藏文件
	 */
	create_file: function(data){	
		return mongolass._db.collection('collections').insert(data)
		
	},
	/**
	 * 查看收藏所有文件记录
	 */
	get_file_all: function(username){
		let files = function(resolve, reject) {
			mongolass._db.collection('collections').find({'username': username}).sort({'timestamp':1}).toArray(function(err, docs)  {
	        if (err) {
	            reject(err);
	        } else {
	        	
	            resolve(docs);
	        }
	    });
		}
  	return new Promise(files)
  },
	/**
	 * 删除收藏文件记录
	 */
	delete_file: function(username, ID){
		//let files = function(resolve, reject){
		return mongolass._db.collection('collections').remove({'username': username, 'ID': ID})
		// 		if(err){
		// 			reject(err);
		// 		} else {
		// 			resolve(docs)
		// 		}
		// 	});
		// }
		// return new Promise(files)
	}


}