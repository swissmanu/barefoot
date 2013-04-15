var Backbone = require('backbone');

function startup(Router, startOptions) {

	$(function() {
		// Ensure that Backbone is globally available when running on the
		// client. Otherwise, the history singleton would no be available.
		global.Backbone = Backbone;

		Backbone.history.start({
			pushState: true
			, silent: true
		});

		var concreteClientRouter = new Router(startOptions);
		concreteClientRouter.start();

		console.log('startup done');
	});

}

module.exports = startup;