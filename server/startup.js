var _ = require('underscore')
	, Backbone = require('backbone')
	, fs = require('fs')
	, browserify = require('browserify-middleware')
	, path = require('path');

function startup(Router, startOptions) {
	if(!_.has(startOptions, 'app')) {
		throw new Error('Missing "app" property in "startOptions"! Please pass '
			+ 'a valid express app instance when starting the barefoot router '
			+ 'on the server.');
	} else {
		var concreteRouter = new Router({
			app: startOptions.app
		});
		concreteRouter.listen();	
	}
}

module.exports = startup;