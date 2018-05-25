'use strict';
const file = require('../models/file_model.js');
const util = require('../../common_lib/util');
const multer = require('multer');
let md5 = require('md5');


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
		if (util.checkparas(['username', 'title', 'secrecy_type', 'secrecy_model', 'manufacturer'], req.body)){
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
			file.modify_file(req.body.ID,req.body.status).then(function(result){
				if(result){
					res.status(200).json({
						'result':'success',
						'value':result
					});
				}else{
					res.status(200).json(util.servererror);
				}
			}).catch(function(err){
				console.log(err);
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
			console.log(req.body)
		if (util.checkparasArray(['ID'], req.body)){
			file.delete_file(req.body.ID).then(function(result){
				if(result){
					
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
		console.log(req.file)
		if(req.file&&req.body.ID){
			res.status(200).json({
				'result':'success',
				'value':req.file.originalname
			})
		}
	},
	//查找文件
	find_file: function(req,res){
		if(util.checkparas(['ID'], req.body)){
			file.find_file(req.body.ID).then(function(result){
				console.log(result)
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
	}

}
