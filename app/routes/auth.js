'use strict';
var express = require('express');
var authRouter = express.Router();
var authController = require("../controllers/auth_controller.js");

authRouter.get("/",authController.getAuth);

module.exports = authRouter;