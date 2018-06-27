'use strict';
var mongolass = require('../../common_lib/db.js');


module.exports = {
	/**
	 * 保存收藏文件
	 */
	create_file: function(data){	
		let res = mongolass._db.collection('collections').findOne({'ID':data.ID,'username':data.username}).then(function(result){
			if(result){
				return mongolass._db.collection('collections').update({'ID': data.ID,'username':data.username},{'$set':{focus:true}})
			} else {
				delete data._id;
				return mongolass._db.collection('collections').insert(data)
			}
		})
		
		return res    
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
	},
	//排序
	sort_file: function(username,type){
		console.log(typeof(type))
		type = type
		let files = function(resolve, reject) {
			var a = {type:-1}
			mongolass._db.collection('collections').find({'username': username,'focus':true}).sort({[type]:-1}).toArray(function(err, docs)  {
	        if (err) {
	            reject(err);
	        } else {
	        	
	            resolve(docs);
	        }
	    });
		}
  	return new Promise(files)
	},
	//删除收藏
	modify_collection: function(username,ID){
		return mongolass._db.collection('collections').update({'ID': ID,'username':username},{'$set':{focus:false}})
	}


}