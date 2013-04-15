var Backbone = require('backbone');

function start() {
	return $(function() {
		return Backbone.history.start({
			pushState: true
			, silent: true
		});
	});
};

function render(view) {
	// Ensure that a view which was rendered into a specific DOM element before
	// gets properly removed. Also take care that all view specific events are
	// removed.
	if(_.has(renderedViews, view.el)) {
		var oldView = renderedViews[view.el];
		oldView.$el.empty();
		oldView.undelegateEvents();
	}
	
	// Render the view which should be displayed and return the result.
	// Keep track of the element which the view was rendered to.
	var renderedView = view.render();
	renderedViews[view.el] = view;

	return renderedView;
};

var _routeToRegExp = (function(original) {
	var _this = this;

	return function(route) {
		return original.call(_this, route.replace(/^\//, ''));
	};
})(Backbone.Router.prototype._routeToRegExp);


module.exports = {
	start: start
	, render: render
	, _routeToRegExp: _routeToRegExp
};