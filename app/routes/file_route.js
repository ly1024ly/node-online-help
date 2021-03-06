'use strict';
var express = require('express');
var fileRouter = express.Router();
var fileController = require('../controllers/file_controller.js');
var textController = require('../controllers/text.js');

fileRouter.get('/number', fileController.get_number);
fileRouter.post('/mypublish', fileController.userfile);
fileRouter.post('/find_file',fileController.find_file);
fileRouter.post('/editor_file',fileController.editor_file);
fileRouter.get('/search_by_sharecode',fileController.searchbysharecode);
fileRouter.get('/find_by_id',fileController.findbyid);
fileRouter.post('/', fileController.create_file);
fileRouter.put('/', fileController.modify_file);
fileRouter.put('/change_status',fileController.change_status);
fileRouter.delete('/', fileController.delete_file);
fileRouter.get('/allfiles', fileController.all_file);
fileRouter.get('/search_file',fileController.search_file);
fileRouter.post('/upload_file', textController.upload.single("file"), textController.upload_files);
fileRouter.post("/publish_file",textController.upload.single("html"), textController.publishFile);

module.exports = fileRouter;