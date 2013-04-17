/** Mixin: Barefoot.Router.Client
 * Client specific code for the <Barefoot.Router>. The complete view object
 * restoration when receiving prerendered UI's from the server is handled in the
 * <start> method.
 *
 * See also:
 * * <Barefoot.Router>
 * * <Barefoot.View.Shared>
 * * <Barefoot.View.Client>
 */
var Backbone = require('backbone')
	, _ = require('underscore');

/** Function: start
 * When the application is coming up, this method gets called from
 * Barefoot.Startup.Client.
 * It handles mainly the restoration of the view objects after receiving an 
 * already rendered UI from the server. This process consists of the following
 * steps:
 *
 * * If present, an instance of the main view is created and all events are 
 *   bound to the DOM elements.
 * * The Barefoot.Router.Client.render method gets replaced temporarly to avoid
 *   rerendering already available content to the DOM. The replacement method
 *   only ensures that the necessary events get bound to the DOM.
 *
 * See also:
 * * <render>
 */
function start() {
	var self = this
		, originalRender = this.render;

	// If defined, restore the main view:
	if(!_.isUndefined(this.mainView)) {
		var mainView = this.mainView();
		mainView.delegateEventsOnSubviews();
	}

	// Temporarly replace the normal render function to allow restoring the
	// necessary view object:
	this.render = function startupRenderer(view) {
		self.currentView = view;
		view.delegateEventsOnSubviews();

		// Important: restore the normal render function:
		self.render = originalRender;
	}

	// Get the current route and run its callback (which will call the replaced
	// render function most probably):
	var currentRoute = window.location.pathname;
	if(currentRoute.substr(0,1) === '/') {
		currentRoute = currentRoute.substr(1);
	}
	this[this.routes[currentRoute]]();
}

/** Function: render
 * Calls the <Barefoot.View.Shared.render> method of the passed <Barefoot.View>.
 * If another view was rendered before, <Barefoot.View.Client.close> gets called
 * to properly remove that view from the DOM before rendering the new view.
 *
 * Paramteres:
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
	start: start
	, render: render
};