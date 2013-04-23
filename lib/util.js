/** Class: Barefoot.Util
 * Contains helper functions for loading environment specific mixins.
 *
 * These utilities are only available inside of barefoot.
 */

/** Function: loadMixins
 * Since Barefoot is runnable on server and client, this function returns 
 * environment specific code read from the "server" and "client" folder and
 * returns the needed code fragments.
 *
 * Returns:
 *     A mixin to give a Backbone object barefoot capabilities.
 */
function loadMixins(environment) {
	var currentEnvironment = environment || getEnvironment()
		, mixin = loadMixinsForEnvironment(environment);

	return mixin;
}

/** Function: getEnvironment
 * Returns a string representing the current environment.
 *
 * Returns:
 *     (String) "client" or "server"
 */
function getEnvironment() {
	var environment = 'server';
	if(process.browser) { environment = 'client'; }

	return environment;
}

/** Function: loadMixinsForEnvironment
 * Loads mixins for a specific environment
 *
 * Parameters:
 *     (String) environment - "client" or "server"
 *
 * Returns:
 *     (Object) mixin
 */
function loadMixinsForEnvironment(environment) {
	var mixin;

	if(environment == 'client') {
		mixin = require('./client');
	} else {
		mixin = require('./server');
	}

	return mixin;
}

module.exports = {
	loadMixins: loadMixins
	, getEnvironment: getEnvironment
};