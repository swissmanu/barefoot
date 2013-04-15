var Backbone = require('backbone');

function start() {
	
}

function render(view) {
	console.log('render!');
	var renderedView = view.render();
	return renderedView;
}

var _routeToRegExp = (function(original) {
	var self = this;
	return function(route) {
		return original.call(self, route.replace(/^\//, ''));
	};
})(Backbone.Router.prototype._routeToRegExp);


module.exports = {
	start: start
	, render: render
	//, _routeToRegExp: _routeToRegExp
};