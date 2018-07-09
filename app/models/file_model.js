'use strict';
var mongolass = require('../../common_lib/db.js');
var ejs = require("ejs");
let fs = require('fs');
let UUID = require("uuid");
var async = require('async');
var rename = function(ID){
  let name = "";
  
  let result = function(resolve,reject){
    mongolass._db.collection('collections').findOne({'ID':ID}).then(function(res){
      name = res.pubhtml;
      if(res){
        let newname = UUID.v1();
        let su = fs.renameSync("/var/www/static/upload/helpdoc/" + res.pubhtml.split("?")[0],"/var/www/static/upload/helpdoc/" + newname + ".html",function(err){
          if(err)console.log(err)
        })
        name = newname + ".html?ID=" + ID;
        resolve(name)
      }else{
        reject(false)
      }
    });
  }
  return new Promise(result)
}

var delfile = function(data){
  var p1 = function(callback){
    mongolass._db.collection('collections').remove({'ID': data.ID,'username': data.username},{'$set':{status:0,timestamp:new Date()}}).then(res => {
      if(res){
        try{
          //fs.unlinkSync("E:\\xampp\\htdocs\\"+data.pubhtml.split("?")[0])
          fs.unlinkSync("/var/www/static/upload/helpdoc/"+data.pubhtml.split("?")[0])
          callback(null,true)
        }catch(err){
          callback(err,false)
        }
      }else{
        callback(err,false)
      }
    }).catch(err => {
      callback(err,false)
    })
  }
  return p1
}
//批量上下线对文章重命名
var change = function(data){
  let newname = UUID.v1();
  var p2 = function(callback){
    mongolass._db.collection('fileinfos').updateOne({ID:data.ID,username:data.username},{$set:{status:data.status,pubhtml:newname+".html?ID="+data.ID,changetime:(new Date()).toISOString()}}).then(function(val){
      console.log("update fileinfos")
      if(val){
        mongolass._db.collection('collections').updateOne({ID:data.ID},{$set:{status:data.status,pubhtml:newname+".html?ID="+data.ID,changetime:(new Date()).toISOString()}}).then(val2 => {
          console.log("update collections")
          if(val2){
            fs.rename("/var/www/static/upload/helpdoc/" + data.pubhtml.split("?")[0],"/var/www/static/upload/helpdoc/" + newname+".html",function(err){
              if(err){
                console.log("err--------------------")
                callback(err,false)
                
              }else{
               
                callback(null,true)
              }
            })
          }else{
           
            callback(err,false)
          }
        }).catch(err => {
          
          callback(err,false)
        })
        
      } else {
        
        callback(err,false)
      }
    }).catch(err => {
     
      callback(err,false)
    })
  }
  return p2
}

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
    let file = mongolass._db.collection('collections').findOneAndReplace({'ID':data.ID,'username':data.username},{'$set':data}).then(function(result){
      if(result.lastErrorObject.updatedExisting){
        data["focus"] = false;
        let a = mongolass._db.collection('fileinfos').findOneAndReplace({'ID':data.ID,'username':data.username},{'$set':data})
        
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
    let re = rename(ID).then(function(res){
      if(res){
        return mongolass._db.collection('fileinfos').update({'ID': ID},{'$set':{status:data,pubhtml:res,changetime:(new Date()).toISOString()}}).then(function(result){
          console.log(result)
          if(result){
            mongolass._db.collection('collections').updateMany({'ID': ID},{'$set':{status:data,pubhtml:res,changetime:(new Date()).toISOString()}}).then(function(result2){
            }).catch(function(err){
              new Error(err)
            })
            return mongolass._db.collection('fileinfos').findOne({'ID':ID})
          }
        }).catch(function(err){
            res.status(200).json(util.servererror);
        });
      }else {
        return false
      }
    })
    return re
    
	},
  //批量删除
  delete_file: function(data){
    let delobj = [];
    for(var i in data){
      
      delobj.push(delfile(data[i]))
    }
    let delres = new Promise((resolve,reject) => {
      async.parallel(delobj,function(err,success){
        if(err){
          reject(err)
          
        }else{
          
          resolve(success)
        }
      });
    })

    return delres
    
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
      mongolass._db.collection('fileinfos').find({status:1}).sort({'timestamp':-1}).limit(10).skip(skip).toArray(function(err, docs)  {
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
 
  //搜索
  search_file:function(str,type,page){
    page = page -1;
    type = type ? type : "changetime";
    let search = function(resolve,reject){
      let skip = page*10;
      console.log(str,type,skip)
      if(type=="title"){
        mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':1},{'ID':{$regex:str,$options:'i'},'status':1},{'title':{$regex:str,$options:'i'},'status':1},{'brand':{$regex:str,$options:'i'},'status':1},{'product':{$regex:str,$options:'i'},'status':1},{'abstract':{$regex:str,$options:'i'},'status':1}]}).sort({'title':1}).limit(10).skip(skip).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });

    } else if(type=="brand"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':1},{'ID':{$regex:str,$options:'i'},'status':1},{'title':{$regex:str,$options:'i'},'status':1},{'brand':{$regex:str,$options:'i'},'status':1},{'product':{$regex:str,$options:'i'},'status':1},{'abstract':{$regex:str,$options:'i'},'status':1}]}).sort({'brand':1}).limit(10).skip(skip).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    } else if(type == "product"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':1},{'ID':{$regex:str,$options:'i'},'status':1},{'title':{$regex:str,$options:'i'},'status':1},{'brand':{$regex:str,$options:'i'},'status':1},{'product':{$regex:str,$options:'i'},'status':1},{'abstract':{$regex:str,$options:'i'},'status':1}]}).sort({'product':1}).limit(10).skip(skip).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    } else if(type == "ID"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':1},{'ID':{$regex:str,$options:'i'},'status':1},{'title':{$regex:str,$options:'i'},'status':1},{'brand':{$regex:str,$options:'i'},'status':1},{'product':{$regex:str,$options:'i'},'status':1},{'abstract':{$regex:str,$options:'i'},'status':1}]}).sort({'ID':1}).limit(10).skip(skip).toArray(function(err, docs)  {
            if (err) {
              reject(err);
            } else {
              resolve(docs)
              
            }
        });
    } else if(type == "changetime"){
      mongolass._db.collection('fileinfos').find({$or:[{'html':{$regex:str,$options:'i'},'status':1},{'ID':{$regex:str,$options:'i'},'status':1},{'title':{$regex:str,$options:'i'},'status':1},{'brand':{$regex:str,$options:'i'},'status':1},{'product':{$regex:str,$options:'i'},'status':1},{'abstract':{$regex:str,$options:'i'},'status':1}]}).sort({'changetime':-1}).limit(10).skip(skip).toArray(function(err, docs)  {
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
     
      arr.push(change(data[i]))
    }
    let delres = new Promise((resolve,reject) => {
      async.parallel(arr,function(err,success){
        console.log(err,success)
        if(err){
          reject(err)
          
        }else{
          
          resolve(true)
        }
      });
    })
    
    return delres
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
          secrecy_type:[result.secrecy_type],
          sharecode:[result.sharecode],
          mechinetype:[result.mechinetype!=='' ? result.mechinetype : '暂无详细内容']                       
        })
        
        resolve(html)
      });
    }
    return new Promise(data)
  },
  findbyid: function(ID){
    return mongolass._db.collection('fileinfos').findOne({'ID':ID,'status':1})
  }
}