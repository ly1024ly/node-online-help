module.exports = function(app) {

	app.use('/testRoute', require('./test.server.route'));
	app.use('/file', require('./file_route'));
	app.use('/collection', require('./collection_route'));
	// 404 page
	app.use(function(req, res) {
		if (!res.headersSent) {
			res.status(404).render('404')
      //next()
		}
	});
}