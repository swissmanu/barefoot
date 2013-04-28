/** Mixin: Barefoot.Startup.Server
 * This startup mixin supplies a server specific startup function to get the
 * application up and running on the node.js server backend.
 */
var _ = require('underscore')
	, Backbone = require('backbone')
	, path = require('path')
	, fs = require('fs')
	, browserify = require('browserify-middleware');

/** PrivateFunction: getServerOnlyFiles
 * Returns an array with absolute paths to the files contianed in the server
 * subfolder.
 *
 * Returns:
 *     (Array)
 */
function getServerOnlyFiles() {
	var files = fs.readdirSync(path.join(__dirname));

	_.each(files, function(file, i) {
		files[i] = path.join(__dirname, file);
	});

	return files;
}

/** Function: startup
 * On startup on the server, this function creates an <APIAdapter> if apiRoutes
 * are present in the startOptions. Further the actual <Barefoot.Router> is 
 * created an started using <Barefoot.Router.Server.start>.
 *
 * Before doing all this, startOptions is checked if an Express.JS app is
 * present (if not, an error gets thrown which will stop the start process).
 *
 * Parameters:
 *     (Barefoot.Router) Router - A <Barefoot.Router> object. Important: This is
 *                                is not an instance of the router, it is the 
 *                                "plain" object which can be used for running
 *                                "new Router(...)".
 *     (Object) startOptions - This object literal is passed to the router when
 *                             initalizing it.
 */
function startup(Router, APIAdapter, startOptions) {
	if(!_.has(startOptions, 'app')) {
		throw new Error('Missing "app" property in "startOptions"! Please ' +
			'pass a valid express app instance when starting the barefoot ' +
			'router on the server.');
	} else {
		if(_.has(startOptions, 'apiRoutes')) {
			// Create an API router and inject its sync function into Backbone.
			var apiAdapter = new APIAdapter(startOptions);
			if(!_.isUndefined(apiAdapter, 'sync')) {
				Backbone.sync = function() {
					return apiAdapter.sync.apply(apiAdapter, arguments);
				};
			}
		}

		startOptions.app.use(startOptions.mainJavaScriptFile.route, browserify(
			startOptions.mainJavaScriptFile.file, {
			ignore: startOptions.mainJavaScriptFile.exclude.concat(
					getServerOnlyFiles())
			//, debug: true
			//, gzip: true
			//, minify: true
		}));


		// Just inject everything from the startup options into the router.
		var concreteServerRouter = new Router(startOptions);
		concreteServerRouter.start();
	}
}

module.exports = startup;