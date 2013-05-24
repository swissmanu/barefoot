/** Mixin: Barefoot.Router.Client
 * Client specific code for the <Barefoot.Router>. The complete view object
 * restoration when receiving pre-rendered UI's from the server is handled in the
 * <start> method.
 *
 * See also:
 * * <Barefoot.Router>
 * * <Barefoot.View.Client>
 */
var _ = require('underscore')
	, CookieAdapter
	, DataStore;

/** Function: preInitialize
 * Ensure that the setupRequestContext function is saved into the router for
 * later use.
 *
 * Parameters:
 *     (Object) options - Option object literal
 */
function preInitialize(options) {
	this.setupRequestContext = options.setupRequestContext;
}

/** Function: start
 * When the application is coming up, this method gets called from
 * Barefoot.Startup.Client.
 *
 * It handles mainly the restoration of the view objects after receiving an
 * already rendered UI from the server. This process consists of the following
 * steps:
 *
 * * If present, an instance of the main view is created and all events are
 *   bound to the DOM elements.
 * * The Barefoot.Router.Client.render method gets replaced temporarily to avoid
 *   re-rendering already available content to the DOM. The replacement method
 *   only ensures that the necessary events get bound to the DOM.
 *
 * Another important step is the deserialization of the <DataStore> if the
 * backend serialized a it into the DOM before. The particular global function
 * is called and the result injected into the clients own <DataStore>. For the
 * serialization code see <Barefoot.Router.Server.render>.
 *
 * See also:
 * * <render>
 */
function start() {
	/* global window,Backbone */
	var Barefoot = require('../')()
		, self = this
		, originalRender = this.render
		, originalNavigate = this.navigate;

	// Lazy-Load the barefoot objects CookieAdapter and DataStore. Otherwise
	// we'd have some cyclic dependency problems.
	CookieAdapter = Barefoot.CookieAdapter;
	DataStore = Barefoot.DataStore;

	self.cookieAdapter = new CookieAdapter();
	self.dataStore = new DataStore();

	// Ensure the request context is set up for the client router:
	if(!_.isUndefined(self.setupRequestContext)) {
		self.setupRequestContext.call(self);
	}

	// If present, deserialize the DataStore:
	if(!_.isUndefined(window.deserializeDataStore)) {
		var deserializedDataStore = window.deserializeDataStore();
		self.dataStore.parse(deserializedDataStore);
	}

	// If defined, restore the main view:
	if(!_.isUndefined(this.mainView)) {
		var mainView = this.mainView();
		mainView.delegateEventsOnSubviews();
	}

	// Temporarily replace the normal render function to allow restoring the
	// necessary view object. In case any router function calls navigate, that
	// one gets replaced to.
	this.navigate = function startupNavigate() { };
	this.render = function startupRenderer(view) {
		self.currentView = view;
		view.delegateEventsOnSubviews();

		// Important: restore the normal render and navigate function:
		self.render = originalRender;
		self.navigate = originalNavigate;
	};

	// Get the current route and run its callback (which will call the replaced
	// render function most probably):
	var currentRoute = window.location.pathname;
	Backbone.history.loadUrl(currentRoute);
}

/** Function: render
 * Calls the <Barefoot.View.Shared.render> method of the passed <Barefoot.View>.
 * If another view was rendered before, <Barefoot.View.Client.close> gets called
 * to properly remove that view from the DOM before rendering the new view.
 *
 * Parameters:
 *     (Barefoot.View) view - <Barefoot.View> to render into the DOM.
 *
 * See also:
 * * <Barefoot.View.Client.close>
 * * <Barefoot.View.Shared.render>
 */
function render(view) {
	if(!_.isUndefined(this.currentView)) {
		this.currentView.close();
	}

	this.currentView = view;
	view.render();
}

module.exports = {
	preInitialize: preInitialize
	, start: start
	, render: render
};