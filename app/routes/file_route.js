'use strict';
var express = require('express');
var fileRouter = express.Router();
var fileController = require('../controllers/file_controller.js');

fileRouter.get('/number', fileController.get_number);
fileRouter.post('/mycollect', fileController.userfile);
fileRouter.post('/find_file',fileController.find_file);

fileRouter.post('/', fileController.create_file);
fileRouter.put('/', fileController.modify_file);
fileRouter.delete('/', fileController.delete_file);
fileRouter.get('/allfiles', fileController.all_file);
fileRouter.post('/upload_file', fileController.upload_file);


module.exports = fileRouter;