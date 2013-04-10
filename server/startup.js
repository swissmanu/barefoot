var _ = require('underscore')
	, Backbone = require('backbone')
	, express = require('express')
	, fs = require('fs')
	, browserify = require('browserify-middleware')
	, path = require('path');

function startup(Router) {
	var app = express();

	app.use('/javascripts/app.js', browserify(path.join(process.cwd(), 'barefoot_test.js'), {
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

/** PrivateFunction: getServerOnlyFiles
 * Returns an array with absolute paths to the files contianed in the server
 * subfolder.
 *
 * Returns:
 *     (Array)
 */
function getServerOnlyFiles() {
	var files = fs.readdirSync(__dirname);
	_.each(files, function(file, i) {
		files[i] = path.join(__dirname, file);
	});

	return files;
}

module.exports = startup;