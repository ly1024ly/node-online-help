var fs = require("fs")
module.exports = function(app) {
	app.use('/testRoute', require('./test.server.route'));
	app.use('/file', require('./file_route'));
	app.use('/collection', require('./collection_route'));
	app.use('/code',require('./code_route'));
	app.use('/auth',require('./auth'));
	
	// 404 page
	app.use(function(req, res) {
		if (!res.headersSent) {
			res.status(404).render('404');
			res.status(413).render("413")
      //next()
		}
	});
}