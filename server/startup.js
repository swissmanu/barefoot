/** Mixin: Barefoot.Startup.Server
 * This startup mixin supplies a server specific startup function to get the
 * application up and running on the node.js server backend.
 */
var _ = require('underscore');

/** Function: startup
 * This function simply creates the <Barefoot.Router> prepared with the server
 * side mixins. Before creating an instance of it, startOptions is checked if 
 * an Express.JS app is present (if not, an error gets thrown).
 *
 * Parameters:
 *     (Barefoot.Router) Router - A <Barefoot.Router> object. Important: This is
 *                                is not an instance of the router, it is the 
 *                                "plain" object which can be used for running
 *                                "new Router(...)".
 *     (Object) startOptions - This object literal is passed to the router when
 *                             initalizing it.
 */
function startup(Router, APIAdapter, startOptions) {
	if(!_.has(startOptions, 'app')) {
		throw new Error('Missing "app" property in "startOptions"! Please ' +
			'pass a valid express app instance when starting the barefoot ' +
			'router on the server.');
	} else {
		// Just inject everything from the startup options into the router.


		new APIAdapter(startOptions);

		var concreteServerRouter = new Router(startOptions);
		concreteServerRouter.start();
	}
}

module.exports = startup;