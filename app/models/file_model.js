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
  
    let file = mongolass._db.collection('collections').findOne({"ID":data.ID}).then(function(result){
      if(result){
        let update = mongolass._db.collection('collections').update({'ID':data.ID},{'$set':data}).then(function(res){
          console.log(res)
          if(res){
            return true
          }else{
            return false
          }
        }).catch(function(err){
          console.log(err)
        })
        console.log(update)
      }
    })
   
    //mongolass._db.collection('collections').insert(data)
		return mongolass._db.collection('fileinfos').insert(data);
	},
	/**
	 * 修改文件记录单个手册的上下线
	 */
	modify_file: function(ID,data,time){
    console.log(data)
		return mongolass._db.collection('fileinfos').update({'ID': ID},{'$set':{status:data,timestamp:time}}).then(function(result){
      if(result){
        mongolass._db.collection('collections').update({'ID': ID},{'$set':{status:data,timestamp:time}}).then(function(result2){

        }).catch(function(err){
          new Error(err)
        })
        return mongolass._db.collection('fileinfos').findOne({'ID':ID})
      }
    }).catch(function(err){
        console.log(err);
        res.status(200).json(util.servererror);
      });
    
	},
	/**
	 * 删除文件记录
	 */
	/*delete_file: function(ID){
    mongolass._db.collection('collections').update({'ID': ID},{'$set':{status:"下线"}}).then(function(result2){

    }).catch(function(err){
      new Error(err)
    })
    return mongolass._db.collection('fileinfos').remove({'ID': ID}) 
	},*/
  delete_file: function(data){
    let result;
    for(var i in data){
      let time = new Date();
      result = mongolass._db.collection('collections').remove({'ID': data[i].ID,'username': data[i].username},{'$set':{status:"下线",timestamp:time}})
      console.log(data[i])
      //result = mongolass._db.collection('fileinfos').remove({'ID': data[i].ID,'username':data[i].username})
    }
    return result
  },
	/**
	 * 获得文件记录
	 */
	get_file: function(ID, username){
		return mongolass._db.collection('fileinfos').findOne({'username': username, 'ID': ID});
	},

  all_file: function(){
  	let files = function(resolve, reject) {
        mongolass._db.collection('fileinfos').find({}).sort({'timestamp':-1}).toArray(function(err, docs)  {
            if (err) {
                reject(err);
            } else {
            	
                resolve(docs);
            }
        });
    }
  	return new Promise(files)
  },
  //获取发布的书册
  user_file: function(username){
  	var userfile = function(resolve, reject) {
        mongolass._db.collection('collections').find({"username":username}).toArray(function(err, docs)  {
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
  },
  //修改文件
  editor_file:function(ID,obj){
    return mongolass._db.collection('fileinfos').update({'ID':ID},{$set:obj})
  },
  //搜索
  search_file:function(str,type){
    let search = function(resolve,reject){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({type:-1}).toArray(function(err, docs)  {
          if (err) {
            reject(err);
          } else {
            resolve(docs);
          }
      });
    }
    return new Promise(search)
  },
  //批量上下线
  change_status: function(data){
    let arr =[];
    let time = new Date();
    for(let i in data){
      arr.push(data[i].ID)
    }
    console.log(data[0].status)
    let change = function(resolve,reject){
      mongolass._db.collection('fileinfos').updateMany({ID:{"$in":arr},username:data[0].username},{$set:{status:data[0].status,timestamp:time}}).then(function(val){
        if(val){
          mongolass._db.collection('collections').updateMany({ID:{"$in":arr}},{$set:{status:data[0].status,timestamp:time}})
          resolve(val)
        } else {
          reject(val)
        }
      })
    }
    return new Promise(change)
  },
  //通过分享码搜索手册
  searchbysharecode: function(code){
    return mongolass._db.collection('fileinfos').findOne({'sharecode':code})
  },
  //上传文件
  upload_file: function(file,ID){
    console.log(ID)
    return mongolass._db.collection('fileinfos').findOneAndUpdate({'ID':ID},{$set:{'file':file}})

  }
}