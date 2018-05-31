'use strict';
var express = require('express');
var fileRouter = express.Router();
var fileController = require('../controllers/file_controller.js');
var textController = require('../controllers/text.js');
var multipart = require('connect-multiparty');

var multipartMiddleware = multipart();

fileRouter.get('/number', fileController.get_number);
fileRouter.post('/mypublish', fileController.userfile);
fileRouter.post('/find_file',fileController.find_file);
fileRouter.post('/editor_file',fileController.editor_file);
fileRouter.get('/search_by_sharecode',fileController.searchbysharecode);
fileRouter.post('/', fileController.create_file);
fileRouter.put('/', fileController.modify_file);
fileRouter.put('/change_status',fileController.change_status);
fileRouter.delete('/', fileController.delete_file);
fileRouter.get('/allfiles', fileController.all_file);
fileRouter.get('/search_file',fileController.search_file);
fileRouter.post('/upload_file', multipartMiddleware, textController.upload_files);


module.exports = fileRouter;