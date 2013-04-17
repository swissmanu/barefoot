/** Class: Barefoot.Util
 * Contains helper functions for loading environment specific mixins.
 *
 * Please notice:
 * This utilities are only available inside of barefoot.
 */

/** Function: loadMixins
 * Since Barefoot is runnable on server and client, this function returns 
 * environment specific code read from the "server" and "client" folder and
 * returns the needed code fragments.
 *
 * Returns:
 *     A mixin to give a Backbone object barefoot capabilities.
 */
function loadMixins() {
	var specific;

	if(process.browser) {
		specific = require('./client');
	} else {
		specific = require('./server');
	}

	return specific;
}

module.exports = {
	loadMixins: loadMixins
};