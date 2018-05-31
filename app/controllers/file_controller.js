'use strict';
const file = require('../models/file_model.js');
const util = require('../../common_lib/util');
const multer = require('multer');
let md5 = require('md5');
let fs = require('fs');
var mongolass = require('../../common_lib/db.js');


var storage = multer.diskStorage({
    destination: '/var/www/static/upload',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }                                                                                                                                                                                     
});

var upload = multer({
    storage: storage
});

module.exports = {
	/**
	 * 获得唯一编码 
	 */
	get_number: function(req, res){
		var data = {'ID': 1, 'timestamp': new Date()};
		var res_data = {'ID': 1, 'timestamp': new Date()};
		file.get_number(data).then(function(result){
			if(result.length){
				res_data.ID = result[0].ID + 1;
				res_data.timestamp = new Date();
				return file.create_number(res_data);
			}else{
				res_data = data;
				return file.create_number(data);
			}
		}).then(function(result){
			if(result){
				res.status(200).json({'result': 'success', 'value': res_data});
			}else{
				res.status(200).json(util.servererror);
			}
		}).catch(function(err){
			console.log(err);
			res.status(200).json(util.servererror);
		});
	},
	/**
	 * 创建文件记录
	 */
	create_file: function(req, res){
		if (util.checkparas(['ID','username', 'title', 'secrecy_type', 'manufacturer'], req.body)){
			file.create_file(req.body).then(function(result){
				if(result){
					res.status(200).json(util.normalsuccess);
				}else{
					res.status(200).json(util.saveerror);
				}
			}).catch(function(err){
				res.status(200).json(util.servererror);
			});
		}else{
			res.header("Access-Control-Allow-Origin", "*");
			res.status(200).json(util.paramserror);
		}
	},

	/**
	 * 修改文件记录
	 */
	modify_file: function(req, res){
		if (util.checkparas(['ID','status'], req.body)){
			let data = new Date();
			file.modify_file(req.body.ID,req.body.status,data).then(function(result){
				if(result){
					res.status(200).json({
						'result':'success',
						'value':result
					});
				}else{
					res.status(200).json(util.servererror);
				}
			}).catch(function(err){
				res.status(200).json(util.servererror);
			});

		}else{
			res.status(200).json(util.normalsuccess);
		}
	},
	/**
	 * 删除文件记录
	 */
	delete_file: function(req, res){
		if (util.checkparasArray(['ID','username'], req.body)){
			file.delete_file(req.body).then(function(result){
				if(result){
					for(var i in req.body){
						mongolass._db.collection('fileinfos').remove({'ID': req.body[i].ID,'username':req.body[i].username})
					}
					res.status(200).json(util.normalsuccess);
				}else{

				}
			}).catch(function(err){
				res.status(200).json(util.servererror);
			});

		}else{
			res.status(200).json(util.paramserror);
		}
	},
	/**
	 * 获得文件记录
	 */
	all_file: function(req, res){
		if (req.query){
			file.all_file().then(function(result){
				if(result){
					util.normalsuccess.value = result;
					res.status(200).json(util.normalsuccess);
				}else{
					res.status(200).json(util.servererror);
				}

			}).catch(function(err){
				res.status(200).json(util.servererror);
			});
		}else{
			res.status(200).json(util.paramserror);
		}
	},
	//获得用户添加的手册
	userfile: function(req, res){
		if (util.checkparas(['username'], req.body)){
			file.user_file(req.body.username).then(function(result){
				if(result){
					util.normalsuccess.value = result;
					res.status(200).json(util.normalsuccess)
				}else{
					res.status(200).json(util.servererror);
				}
			}).catch(function(err){
				res.status(200).json(util.servererror);
			})
		} else {
			res.status(200).json(util.paramserror);
		}
	},
	//上传文件
	upload_file: function(req,res,next){
		if(req.file&&req.body.ID){
			res.status(200).json({
				'result':'success',
				'value':req.file.originalname
			})
		}
	},
	//修改文件
	editor_file: function(req,res){
		if(util.checkparas(['ID'],req.body)&&util.checkparas(['username', 'title', 'secrecy_type', 'secrecy_model', 'manufacturer'],req.body.obj)){
			file.editor_file(req.body.ID,req.body.obj).then(result => {
				if(result){
					mongolass._db.collection('collections').update({'ID':req.body.ID},{$set:req.body.obj})
					res.status(200).json({
						'result':'success',
						'value':result
					});
				} else {
					res.status(200).json(util.servererror);
				}
			})
		} else {
			res.status(200).json(util.paramserror);
		}
	},
	//查找文件
	find_file: function(req,res){
		if(util.checkparas(['ID'], req.body)){
			file.find_file(req.body.ID).then(function(result){
				if(result){
					res.status(200).json({
						'result':'success',
						'value':result
					});
				}else{
					res.status(200).json(util.servererror);
				}
			})
		} else {
			res.status(200).json(util.paramserror);
		}
	},
	//按照品牌，手册，手册号，摘要搜索
	search_file: function(req,res){
		if(util.checkparas(['str','type'],req.query)){
			file.search_file(req.query.str,req.query.type).then(function(result){
				if(result){
					res.status(200).json({
						'result':'success',
						'value':result
					});
				}else{
					res.status(200).json(util.servererror);
				}
			})
		} else {
			res.status(200).json(util.paramserror);
		}
	},
	//批量上下线
	change_status: function(req,res){
		if(util.checkparasArray(['ID','status'],req.body)){
			file.change_status(req.body).then(function(result){
				if(result){
					res.status(200).json({
						'result':'success',
						'value':result
					});
				}else{
					res.status(200).json(util.servererror);
				}
			}).catch(function(err){
				res.status(200).json(util.servererror);
			})
		} else {
			res.status(200).json(util.paramserror);
		}
	},
	//通过分享码搜索手册
	searchbysharecode: function(req,res){
		if(util.checkparas(['sharecode'],req.query)){
			file.searchbysharecode(req.query.sharecode).then(function(result){
				if(result){
					res.status(200).json({
						'result':'success',
						'value':result
					});
				} else {
					res.status(200).json(util.nodata);
				}
			}).catch(function(err){
				res.status(200).json(util.servererror);
			})
		} else {
			res.status(200).json(util.paramserror);
		}
	}

  

}
