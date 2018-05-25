'use strict';
var express = require('express');
var collectionRouter = express.Router();
var collectionController = require('../controllers/collection_controller.js');


collectionRouter.post('/', collectionController.create_file);
collectionRouter.get('/', collectionController.get_file_all);
collectionRouter.delete('/', collectionController.delete_file);



module.exports = collectionRouter;