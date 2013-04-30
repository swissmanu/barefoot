/** Mixin: Barefoot.Router.Server
 * This mixin contains any server side specific code for the <Barefoot.Router>.
 *
 * See also:
 * * <Barefoot.Router>
 */
var _ = require('underscore')
	, cheerio = require('cheerio')
	, CookieAdapter = require('../')().CookieAdapter;


/** Function: preInitialize
 * This function is called before any intialization or constructor of the 
 * <Barefoot.Router> is executed. It expects that the passed options object
 * contains the following elements:
 *
 * app - An Express.JS app
 * layoutTemplate - The minimal HTML skeleton to render the applictation into.
 *                  Example: "<html><head></head><body></body></html>"
 * startExpressApp - A callback function which initiates the actual startup of
 *                   the Express.JS app from above.
 * dataStore - An instance of <Barefoot.DataStore> (if the application needs
 *             one)
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
	this.dataStore = options.dataStore;
}

/** Function: route
 * This replacemente for the route function of Backbone.Router ensures that each
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
	var self = this;

	return self.app.get('/' + routeUri, function(req, res) {
		var callback = self[self.routes[routeUri]]
			, cookieAdapter = new CookieAdapter({ cookies: req.cookies });

		self.res = res;
		self.cookieAdapter = cookieAdapter;

		var routeResult = callback.apply(self, _.values(req.query));

		res.cookies = self.cookieAdapter.cookies;

		return routeResult;
	});
}

/** Function: render
 * This function initiates the rendering of the passed view. This is done by
 * loading the layout template into a cheerio DOM object.
 *
 * Afterwards the presence of a main view object is checked. If available, that
 * main view gets rendered into the DOM. In any case, the passed view gets 
 * rendered.
 *
 * As a final step the presence of an application wide <Barefoot.DataStore> is
 * checked. If present, its content gets serialized into a script DOM element so
 * the client can proberly deserialize its state afterwards. See
 * <Barefoot.Startup.Client.startup> for the deserialization code.
 *
 * The resulting HTML code is then sent to the client by using the Express.JS
 * response object, buffered from the route callback in the <route> function.
 *
 * Parameters:
 *     (Barefoot.View) view - The view which should be rendered
 *
 * Returns:
 *      
 *
 * See also:
 * * <route>
 */
function render(view) {
	var $ = cheerio.load(this.layoutTemplate);

	if(!_.isUndefined(this.mainView)) {
		var clonedMainView = _.clone(this.mainView());
		clonedMainView.$ = $;
		clonedMainView.$el = $(clonedMainView.el);
		clonedMainView.render();
	}

	view.$ = $;
	view.$el = $(view.el);
	view.render();

	if(!_.isUndefined(this.dataStore)) {
		var serializiedDataStore = JSON.stringify(this.dataStore.toJSON())
			, javaScriptElement =
				'<script>function deserializeDataStore(){' +
				'return ' + serializiedDataStore + ';}</script>';
		$('body').append(javaScriptElement);
	}

	return this.res.send($.html());
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
	, render: render
	, start: start
};