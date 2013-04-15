var _ = require('underscore');

function startup(Router, startOptions) {
	if(!_.has(startOptions, 'app')) {
		throw new Error('Missing "app" property in "startOptions"! Please pass '
			+ 'a valid express app instance when starting the barefoot router '
			+ 'on the server.');
	} else {
		// Just inject everything from the startup options into the router.
		var concreteServerRouter = new Router(startOptions);
		concreteServerRouter.start();
	}
}

module.exports = startup;