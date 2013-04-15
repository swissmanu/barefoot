var Backbone = require('backbone')
	, _ = require('underscore');

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