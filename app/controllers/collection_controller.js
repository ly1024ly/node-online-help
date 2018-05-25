'use strict';
const collection = require('../models/collection_model.js');
const util = require('../../common_lib/util');


module.exports = {
	/**
	 * 保存收藏文件
	 */
	create_file: function(req, res) {
		console.log(req.body)
		if (util.checkparas(['username', 'ID'], req.body)) {
			console.log("okokokok")
			collection.create_file(req.body).then(function(result) {
				console.log(result)
				if (result) {
					res.status(200).json(util.normalsuccess);
				} else {
					res.status(200).json(util.saveerror);
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
				console.log("===================");
				console.log(result)
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
				console.log(result);
				console.log("----------------------------")
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
			res.status(200).json(util.paramserror);
		}
	}

}