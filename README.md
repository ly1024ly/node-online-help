##集控后台服务结构目录
3/29/2018 11:12:04 AM 

###目录

- project
	- app
		- controllers
		- models
		- routes
		- views
	- bin
	- node-modules
	- public
	- routes
	- config
	- common_lib
	- app.js
	- package.json


###目录功能介绍

本次设计依赖于express框架，以及mvc框架的设计，还有服务本身的业务而设计的。

1. app下有4个文件夹：

	- controllers, 表示控制层，这个模块里面的数据操作进行封装成方法，然后对外进行公开，
	- models, 表示数据层，作为这个模块的数据文件，定义这个模块内容的相关字段
	- routes, 表示路由，作为这个模块的路由文件。
	- views, 表示视图



2.config文件
	
	- 这里面保存的是该项目的配置文件，例如保存该项目要连接上mongodb数据库的配置信息



3.common_lib文件

	- 这边个文件下保存的是后台服务都会用的项目，例如现在的util.js文件
	- 这是一个独立的子项目

4.routes文件夹不使用


###注意事项

需要注意一些几点：

1.关于文件名称，采用 对象名+服务端+层级 的方式进行的命名，例如：test.server.controller.js，表示服务端的文档模块的控制层文件。

2.数据库名和表明不要重复，在mongolass驱动库中，一致会导致错误。

3.启动服务通过pm2来操作 

###简述添加服务流程

以添加用户为例：

1.在config/default.js中，添加链接mongodb数据库地址，并指明数据库名

2.在app/models/test.server.model.js中定义添加的表中的数据结构：
	exports.test = mongolass.model('test', {
	  username: { type: 'string', required: true },
	  password: { type: 'string', required: true }
	
	})
	exports.test.index({ username: 1 }, { unique: true }).exec()// 根据用户名找到用户，用户名全局唯一

3.在app/controllers/test.server.controller.js中定义操作数据库函数
	module.exports = {
	  // 注册一个用户
	  create: function(req, res, next) {
	    var user_info = {
	      username: req.query.username,
	      password:req.query.password
	
	    };
	    console.log(user_info);
	    Test.create(user_info).then(function(result) {
	      if (result) {
	        res.status(200).json(user_info);
	      } else {
	        res.status(404).json(user_info);
	      }
	    }).catch(next);
	  }
	};

4.在app/routes/test.server.route.js中添加http操作类型：
	var testRouter = express.Router();
	var  testController=require('../controllers/test.server.controller.js');
	testRouter.get('/create',testController.create);

5.在app/routes/index.js中添加路由：
	module.exports = function (app) {
	
	  app.use('/testRoute', require('./test.server.route'));
	
	  // 404 page
	  app.use(function (req, res) {
	    if (!res.headersSent) {
	      res.status(404).render('404')
	    }
	  });
	}
6.然后通过pm2启动服务，访问
	http://127.0.0.1:3000/testRoute/create?username=test&password=1233
就可以将数据保存到数据。


注意：在运行项目前，记得先启动mongo服务，并新建好相应的数据库。