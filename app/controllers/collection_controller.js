'use strict';
const collection = require('../models/collection_model.js');
const file = require('../models/file_model.js');
const util = require('../../common_lib/util');
var mongolass = require('../../common_lib/db.js');
let UUID = require("uuid");
var fs = require("fs");

module.exports = {
	/**
	 * 保存收藏文件
	 */
	create_file: function(req, res) {
		if (util.checkparas(['username', 'ID'], req.body)) {
			collection.create_file(req.body).then(function(result) {
				if (result) {
					res.status(200).json(util.normalsuccess);
				} else {
					res.status(200).json(util.added);
				}
			}).catch(function(err) {
				
				res.status(200).json(util.servererror);
			});

		} else {
			res.status(200).json(util.paramserror);
		}
	},
	/**
	 * 查看收藏所有文件
	 */
	get_file_all: function(req, res) {
		if (util.checkparas(['username'], req.query)) {
			collection.get_file_all(req.query.username).then(function(result) {
				if (result) {
					res.status(200).json({
						'result': 'success',
						'value': result
					});
				} else {
					res.status(200).json(util.servererror);
				}
			}).catch(function(err) {
				console.log(err);
				res.status(200).json(util.servererror);
			});

		} else {
			console.log(req.query);
			res.status(200).json(util.paramserror);
		}
	},
	/**
	 * 删除收藏文件(批量删除)
	 */
	delete_file: function(req, res) {
		if (util.checkparas(['username', 'ID'], req.body)) {
			collection.delete_file(req.body.username, req.body.ID).then(function(result) {
				if (result) {
					mongolass._db.collection('collections').updateMany({'ID': req.body.ID},{'$set':{status:0,changetime:new Date}})
					mongolass._db.collection('fileinfos').remove({'username': req.body.username, 'ID': req.body.ID});
					res.status(200).json({
						'result': 'success',
						'value': result
					});
				} else {
					res.status(200).json(util.servererror);
				}
			}).catch(function(err) {
				console.log(err);
				res.status(200).json(util.servererror);
			});

		} else {
			res.status(200).json(util.paramserror);
		}
	},
	//排序
	sort_file: function(req,res){
		if(util.checkparas(['username','type'],req.query)){
			collection.sort_file(req.query.username,req.query.type).then(function(result){
				if(result){
					res.status(200).json({
						'result': 'success',
						'value': result
					});
				}else {
					res.status(200).json(util.servererror);
				}
			}).catch(function(err){
				res.status(200).json(util.servererror);
			})
		} else {
			res.status(200).json(util.paramserror);
		}
	},
	//取消关注
	modify_collection: function(req,res){
		if(util.checkparas(['username','ID'],req.query)){
			collection.modify_collection(req.query.username,req.query.ID).then(function(result){
				if(result){
					res.status(200).json({
						'result': 'success',
						'value': result
					});
				}else{
					res.status(200).json(util.operationfailed);
				}
			}).catch(function(err){
				res.status(200).json(util.servererror);
			})	
		}else{
			res.status(200).json(util.paramserror);
		}
	}

}