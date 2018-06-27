'use strict';
var mongolass = require('../../common_lib/db.js');
var ejs = require("ejs");
let fs = require('fs');

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
    /*let file = mongolass._db.collection('collections').findOne({"ID":data.ID,'username':data.username}).then(function(result){
      if(result){
        let update = mongolass._db.collection('collections').update({'ID':data.ID,'username':data.username},{'$set':data}).then(function(res){
          if(res){
            return true
          }else{
            return false
          }
        }).catch(function(err){
          console.log(err)
        })
        console.log(update);
        console.log("--------------------------------")
      }
    })*/
    let file = mongolass._db.collection('collections').findOneAndReplace({'ID':data.ID,'username':data.username},{'$set':data}).then(function(result){
      if(result.lastErrorObject.updatedExisting){
        data["focus"] = false;
        mongolass._db.collection('fileinfos').findOneAndReplace({'ID':data.ID,'username':data.username},{'$set':data})
        return true
      } else {
        return false
      }
    });
    let addresult = file.then(function(res){
      if(res){
        return true
      } else {
        mongolass._db.collection('fileinfos').insert(data)
        return mongolass._db.collection('collections').insert(data)
      }
    })
    return addresult
	},
	/**
	 * 修改文件记录单个手册的上下线
	 */
	modify_file: function(ID,data){
		return mongolass._db.collection('fileinfos').update({'ID': ID},{'$set':{status:data,changetime:(new Date()).toISOString()}}).then(function(result){
      if(result){
        mongolass._db.collection('collections').updateMany({'ID': ID},{'$set':{status:data,changetime:(new Date()).toISOString()}}).then(function(result2){

        }).catch(function(err){
          new Error(err)
        })
        return mongolass._db.collection('fileinfos').findOne({'ID':ID})
      }
    }).catch(function(err){
        res.status(200).json(util.servererror);
      });
    
	},
  delete_file: function(data){
    let result;
    for(var i in data){
      let time = new Date();
      result = mongolass._db.collection('collections').remove({'ID': data[i].ID,'username': data[i].username},{'$set':{status:"下线",timestamp:new Date()}})
      
    }
    return result
  },
	/**
	 * 获得文件记录
	 */
	get_file: function(ID, username){
		return mongolass._db.collection('fileinfos').findOne({'username': username, 'ID': ID});
	},

  all_file: function(page){
    page = page - 1;
    let files = function(resolve, reject) {
      let skip = page*10;
      mongolass._db.collection('fileinfos').find({status:'上线'}).sort({'timestamp':-1}).limit(10).skip(skip).toArray(function(err, docs)  {
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
        mongolass._db.collection('collections').find({"username":username,'origname':username}).toArray(function(err, docs)  {
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
  find_file: function(ID,username){
    return mongolass._db.collection('collections').findOne({'ID': ID,'username':username});
  },
  //修改文件
  editor_file:function(ID,obj){
    return mongolass._db.collection('fileinfos').update({'ID':ID},{$set:obj})
  },
  /*//搜索
  search_file:function(str,type){
    let search = function(resolve,reject){
      if(type=="title"){
        mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({'title':-1}).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });

    } else if(type=="brand"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({'brand':-1}).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    } else if(type == "product"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({'product':-1}).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    } else if(type == "ID"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({'ID':1}).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    } else if(type == "timestamp"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({'timestamp':-1}).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    }
  }
    return new Promise(search)

  },*/
  //搜索
  search_file:function(str,type,page){
    page = page -1;
    type = type ? type : "changetime";
    let search = function(resolve,reject){
      let skip = page*10;
      console.log(str,type,skip)
      if(type=="title"){
        mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({'title':1}).limit(10).skip(skip).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });

    } else if(type=="brand"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({'brand':1}).limit(10).skip(skip).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    } else if(type == "product"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({'product':1}).limit(10).skip(skip).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    } else if(type == "ID"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({'ID':1}).limit(10).skip(skip).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    } else if(type == "changetime"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':"上线"},{'ID':{$regex:str,$options:'i'},'status':"上线"},{'title':{$regex:str,$options:'i'},'status':"上线"},{'brand':{$regex:str,$options:'i'},'status':"上线"},{'product':{$regex:str,$options:'i'},'status':"上线"},{'abstract':{$regex:str,$options:'i'},'status':"上线"}]}).sort({'changetime':-1}).limit(10).skip(skip).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    }
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
    let change = function(resolve,reject){
      mongolass._db.collection('fileinfos').updateMany({ID:{"$in":arr},username:data[0].username},{$set:{status:data[0].status,changetime:(new Date()).toISOString()}}).then(function(val){
        if(val){
          mongolass._db.collection('collections').updateMany({ID:{"$in":arr}},{$set:{status:data[0].status,changetime:(new Date()).toISOString()}})
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
    let upload = mongolass._db.collection('collections').findOneAndUpdate({'ID':ID},{$set:{'file':file}}).then(function(result){
      if(result.lastErrorObject.updatedExisting){
        mongolass._db.collection('fileinfos').findOneAndUpdate({'ID':ID},{$set:{'file':file}})
        return true
      } else {
        return false
      }
    }).catch(function(err){
      throw err
    })
    return upload

  },
  publishFile:function(ID,title){
    let data = function(resolve,reject){
      mongolass._db.collection('collections').findOne({'ID':ID}).then(function(result){
        let str = fs.readFileSync("./app/models/template.ejs","utf-8");     
        var html=ejs.render(str,{  
          title:[result.title], 
          html:[result.html!=="" ? result.html : "暂无详细内容"],
          product:[result.product],
          brand:[result.brand],
          manufacturer:[result.manufacturer],
          link:[result.link!==''?result.link:"暂无链接"],
          abstract:[result.abstract],
          orifile:[result.file],
          file:[result.file!=="" ? result.filename : "无附件"],
          tag:[result.tag],
          mechinetype:[result.mechinetype!=='' ? result.mechinetype : '暂无详细内容']                       
        })
        
        resolve(html)
      });
    }
    return new Promise(data)
  },
  findbyid: function(ID){
    return mongolass._db.collection('fileinfos').findOne({'ID':ID})
  }
}