/** Mixin: Barefoot.Start.Server
 * This start mixin supplies a server specific start function to get the
 * application up and running on the node.js server backend.
 */
var _ = require('underscore')
	, Backbone = require('backbone')
	, path = require('path')
	, fs = require('fs')
	, browserify = require('browserify-middleware');

/** PrivateFunction: getServerOnlyFiles
 * Returns an array with absolute paths to the files contained in the server
 * sub folder.
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

/** PrivateFunction: prepareBrowserify
 * Adds the Browserify middleware the the given express.js app.
 *
 * Parameters:
 *     (Object) app - Express.JS app
 *     (Object) options - Set of options
 */
function prepareBrowserify(app, options) {
	if(!_.has(options, 'mainFile') || !_.has(options, 'url')) {
		throw new Error('Missing "mainFile" and "url" property.');
	}

	var mainFile = options.mainFile
		, url = options.url
		, exclude = options.exclude || []
		, browserifyOptions;

	exclude = exclude.concat(getServerOnlyFiles());
	browserifyOptions = { ignore: exclude };
	_.extend(browserifyOptions, _.omit(options, ['mainFile', 'exclude']));

	_.defaults(browserifyOptions, {
		debug: false
		, gzip: true
		, minify: true
	});

	app.get(url, browserify(mainFile, browserifyOptions));
}

/** Function: start
 * On start on the server, this function creates an <APIAdapter> if apiRoutes
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
 *                             initializing it.
 */
function start(Router, APIAdapter, startOptions) {
	if(!_.has(startOptions, 'app')) {
		throw new Error('Missing "app" property in "startOptions"! Please ' +
			'pass a valid express app instance when starting the barefoot ' +
			'router on the server.');
	}
	if(!_.has(startOptions, 'mainJavaScriptFile')) {
		throw new Error('Missing "mainJavaScriptFile" property in ' +
			'"startOptions"! Please describe how browserify should serve your' +
			' applications code.');
	}

	var app = startOptions.app
		, apiAdapter;

	if(_.has(startOptions, 'setupMiddlewares')) {
		startOptions.setupMiddlewares(app);
	}

	if(_.has(startOptions, 'setupApiAdapter')) {
		apiAdapter = new APIAdapter(startOptions);
		startOptions.setupApiAdapter(apiAdapter);

		if(!_.isUndefined(apiAdapter, 'sync')) {
			Backbone.sync = function() {
				return apiAdapter.sync.apply(apiAdapter, arguments);
			};
		}

		startOptions.apiAdapter = apiAdapter;
	}

	prepareBrowserify(app, startOptions.mainJavaScriptFile);

	// Just inject everything from the startup options into the router.
	var concreteServerRouter = new Router(startOptions);
	concreteServerRouter.start();
}

module.exports = start;