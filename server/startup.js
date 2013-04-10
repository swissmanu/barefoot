var _ = require('underscore')
	, Backbone = require('backbone')
	, express = require('express')
	, fs = require('fs')
	, browserify = require('browserify-middleware')
	, path = require('path');

function startup(Router) {
	var app = express();

	/*
	app.get('/javascripts/app.js', function(req, res) {

		var bundle = browserify([
				path.join(process.cwd(), 'backbonetest.js')
				//, path.join(process.cwd(), 'barefoot', 'client')
				//, path.join(process.cwd(), 'barefoot', 'shared')
			]);
		bundle.ignore(path.join(process.cwd(), 'barefoot', 'server'));

		debugger;

		bundle.bundle({}, function(err, src) {
			console.dir(err);
			if(!err) {
				res.set('content-type', 'text/javascript');
				res.send(src);
			}
		});
	});
*/

	app.use('/javascripts/app.js', browserify(path.join(process.cwd(), 'backbonetest.js'), {
		ignore: getServerOnlyFiles()
		//, debug: true
		//, gzip: true
		//, minify: true
	}));


	var concreteRouter = new Router({
		app: app
	});
	concreteRouter.listen();

}

function getServerOnlyFiles() {
	var files = fs.readdirSync(__dirname);
	_.each(files, function(file, i) {
		files[i] = path.join(__dirname, file);
	});

	return files;
}

module.exports = startup;