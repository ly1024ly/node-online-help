'use strict';

let mongodburl = 'mongodb://' + process.env.username + ':' + process.env.password + '@mongodb:' + process.env.mongodbport + '/onlinehelp';
//let mongodburl = 'mongodb://127.0.0.1:27017/onlinehelp'
module.exports = {
	mongodb: mongodburl
}