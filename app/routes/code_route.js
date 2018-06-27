'use strict';
var express = require('express');
var codeRouter = express.Router();
var codeController = require('../controllers/code_controller.js');

codeRouter.post('/', codeController.create_code);
codeRouter.get('/',codeController.get_all_code);



module.exports = codeRouter;