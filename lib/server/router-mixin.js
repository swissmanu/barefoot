/** Mixin: Barefoot.Router.Server
 * This mixin contains any server side specific code for the <Barefoot.Router>.
 *
 * See also:
 * * <Barefoot.Router>
 */
var _ = require('underscore')
	, cheerio = require('cheerio')
	, winston = require('winston')
	, Q = require('q')
	, CookieAdapter
	, DataStore;

/** Function: toString
 * String representation of this module.
 */
function toString() {
	return 'Router.Server';
}

/** Function: preInitialize
 * This function is called before any initialization or constructor of the
 * <Barefoot.Router> is executed. It expects that the passed options object
 * contains the following elements:
 *
 * app - An Express.JS app
 * layoutTemplate - The minimal HTML skeleton to render the application into.
 *                  Example: "<html><head></head><body></body></html>"
 * startExpressApp - A callback function which initiates the actual startup of
 *                   the Express.JS app from above.
 *
 * Each of these are copied into this router object directly to access them
 * later on.
 *
 * Parameters:
 *     (Object) options
 */
function preInitialize(options) {
	this.app = options.app;
	this.layoutTemplate = options.layoutTemplate;
	this.startExpressApp = options.startExpressApp;
	this.apiAdapter = options.apiAdapter;
	this.setupRequestContext = options.setupRequestContext;
}

/** Function: route
 * This replacements for the route function of Backbone.Router ensures that each
 * route defined in the router is added to the Express.JS app.
 *
 * The route function ensures that you have access to all cookies from the
 * request via the cookieAdapter property of this router.
 *
 * Parameters:
 *     (String) routeUri - URI
 *
 * Returns:
 *     The created Express.JS route
 *
 * See also:
 * * <Barefoot.CookieAdapter.Server>
 */
function route(routeUri) {
	var self = this
		, Barefoot = require('../')();

	// Lazy-Load the barefoot objects CookieAdapter and DataStore. Otherwise
	// we'd have some cyclic dependency problems.
	CookieAdapter = Barefoot.CookieAdapter;
	DataStore = Barefoot.DataStore;

	return self.app.get('/' + routeUri, function(req, res) {
		var callback = self[self.routes[routeUri]]
			, cookieAdapter = new CookieAdapter({ cookies: req.cookies })
			, dataStore = new DataStore();

		// Ensure that request-local stuff is available locally:
		self.req = req;
		self.res = res;
		self.cookieAdapter = cookieAdapter;
		self.dataStore = dataStore;

		// Ensure the request context is set up locally:
		if(!_.isUndefined(self.setupRequestContext)) {
			self.setupRequestContext.call(self);
		}

		// Ensure that the APIAdapter has access to the current request:
		if(!_.isUndefined(self.apiAdapter)) {
			self.apiAdapter.req = req;
		}

		// Execute the route:
		var routeResult = callback.apply(self, _.values(req.params));

		// Ensure cookies are placed inside the response:
		res.cookies = self.cookieAdapter.cookies;

		return routeResult;
	});
}

/** Function: navigate
 * Rewrites <Backbone.Router.navigate at http://backbonejs.org/#Router-navigate>
 * to replicate its functionality when rendering the application on the server.
 *
 * Basically the callback for the given routeUri is picked and called.
 *
 * Parameters:
 *     (String) routeUri - The URI of the route to navigate to
 *
 * Returns:
 *     (Object) the value which the route callbacks returns.
 */
function navigate(routeUri) {
	this.res.redirect(routeUri);
}

/** Function: render
 * This function initiates the rendering of the passed view. This is done by
 * loading the layout template into a cheerio DOM object.
 *
 * Afterwards the presence of a main view object is checked. If available, that
 * main view gets rendered into the DOM. In any case, the passed view gets
 * rendered.
 *
 * As a final step the presence of registered models in the application wide
 * <Barefoot.DataStore> is checked. If present, its content gets serialized into
 * a script DOM element so the client can properly deserialize its state
 * afterwards. See <Barefoot.Router.Client.start> for the deserialization code.
 *
 * The resulting HTML code is then sent to the client by using the Express.JS
 * response object, buffered from the route callback in the <route> function.
 *
 * Parameters:
 *     (Barefoot.View) view - The view which should be rendered
 *
 * See also:
 * * <route>
 */
function render(view) {
	var self = this
		, $;

	function initDOM() {
		$ = cheerio.load(self.layoutTemplate);
	}

	function renderMainView() {
		var promise;

		if(!_.isUndefined(self.mainView)) {
			var clonedMainView = _.clone(self.mainView());
			clonedMainView.$ = $;
			clonedMainView.$el = clonedMainView.selectDOMElement($);
			promise = clonedMainView.render();
		}

		return promise;
	}

	function renderView() {
		view.$ = $;
		view.$el = view.selectDOMElement($);

		return view.render();
	}

	function serializeDataStore() {
		if(!_.isUndefined(self.dataStore) &&
			_.keys(self.dataStore.registeredModels).length > 0) {
			var serializiedDataStore = JSON.stringify(self.dataStore.toJSON())
				, javaScriptElement =
					'<script>function deserializeDataStore(){' +
					'return ' + serializiedDataStore + ';}</script>';
			$('body').append(javaScriptElement);
		}
	}

	function writeHTTPResponse() {
		self.res.send($.html());
	}

	function writeHTTPError(err) {
		winston.log('error', 'Uncatched HTTP Error', {
			source: toString()
			, err: err.toString() || err
			, stack: err.stack || undefined
		});
		self.res.send(500);
	}

	Q.fcall(initDOM)
	.then(renderMainView)
	.then(renderView)
	.then(serializeDataStore)
	.done(writeHTTPResponse, writeHTTPError);
}

/** Function: start
 * Calls the passed starter function, buffered in <preInitialize>.
 */
function start() {
	this.startExpressApp(this.app);
}


module.exports = {
	preInitialize: preInitialize
	, route: route
	, navigate: navigate
	, render: render
	, start: start
};