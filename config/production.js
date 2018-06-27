'use strict';

let mongodburl = 'mongodb://' + process.env.username + ':' + process.env.password + '@mongodb:27017/onlinehelp';
//let mongodburl = 'mongodb://127.0.0.1:27017/onlinehelp'
module.exports = {
	mongodb: mongodburl
}