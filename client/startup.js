/** Mixin: Barefoot.Startup.Client
 * This startup mixin supplies a client specific startup function to get the
 * application up and running in the browser.
 */
var Backbone = require('backbone');

/** Function: startup
 * Ensures that Backbone is available globally on the client. It further starts
 * up the Backbone.history.
 *
 * Finally an instance of the passed Router object is created. The startOptions
 * object is used to create the Router.
 *
 * Parameters:
 *     (Barefoot.Router) Router - A <Barefoot.Router> object. Important: This is
 *                                is not an instance of the router, it is the 
 *                                "plain" object which can be used for running
 *                                "new Router(...)".
 *     (Object) startOptions - This object literal is passed to the router when
 *                             initalizing it.
 */
function startup(Router, startOptions) {
	/* global $ */
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
	});

}

module.exports = startup;