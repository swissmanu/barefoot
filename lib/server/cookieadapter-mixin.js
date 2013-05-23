/** Mixin: Barefoot.CookieAdapter.Server
 * This mixin contains client specific code for the <Barefoot.CookieAdapter>
 * component.
 *
 * The server implementation gets its data from the
 * <Barefoot.Router.Server.route> function. As soon as the route handler is
 * found, the current requests cookies are injected into the <CookieAdapter>.
 *
 * After processing the route, all present cookie information is written back
 * into the response object.
 *
 * See also:
 * * <Barefoot.Router.Server>
 * * <Barefoot.CookieAdapter>
 * * <Barefoot.CookieAdapter.Client>
 */
var _ = require('underscore')
	, debug = require('debug')('barefoot:server:cookieadapter');


/** Function: get
 * Returns a specific cookie value.
 *
 * Parameters:
 *     (String) key - The key of the cookie which should be returned.
 *
 * Returns:
 *     (String) the cookies value
 */
function get(key) {
	debug('getting `%s`', key);

	var value;
	if(this.cookies && _.has(this.cookies, key)) {
		value = this.cookies[key];
	}

	return value;
}

/** Function: set
 * Sets the value of a cookie with the specified key.
 *
 * Parameters:
 *     (String) key - The key of the cookie you'd like to set
 *     (String) value - The value you'd like to set for the specified key
 */
function set(key, value) {
	debug('setting `%s` to `%j`', key, value);

	if(_.isUndefined(this.cookies)) {
		this.cookies = {};
	}

	this.cookies[key] = value;
}

module.exports = {
	get: get
	, set: set
};