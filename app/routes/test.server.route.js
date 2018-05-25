'use strict';
var express = require('express');
var testRouter = express.Router();
var  testController=require('../controllers/test.server.controller.js');

testRouter.get('/create',testController.create);

module.exports = testRouter;