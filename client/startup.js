var Backbone = require('backbone');

$(function() {
	return Backbone.history.start({
		pushState: true
		, silent: true
	});
});

$(function() {
	return $('a').on('click', function(e) {
		e.preventDefault();

		var route = $(e.target).attr('href');
		if(route.substr(0,1) === '/') {
			route = route.substr(1);
		}

		var result = Backbone.history.navigate(route, true);
		console.log('Navigate', route, result);

		return result;
	});
});


function startup(Router, startOptions) {
	var concreteClientRouter = new Router(startOptions);
	concreteClientRouter.start();
}

module.exports = startup;