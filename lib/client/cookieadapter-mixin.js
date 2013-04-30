/** Mixin: Barefoot.CookieAdapter.Client
 * This mixin contains client specific code for the <Barefoot.CookieAdapter>
 * component.
 *
 * Thie client <CookieAdapter> reads and writes the cookies directly from the
 * browsers memory.
 *
 * See also:
 * * <Barefoot.CookieAdapter>
 * * <Barefoot.CookieAdapter.Server>
 */
var Cookies = require('cookie-component');

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
	return Cookies.get(key);
}

/** Function: set
 * Sets the value of a cookie with the specified key.
 *
 * Parameters:
 *     (String) key - The key of the cookie you'd like to set
 *     (String) value - The value you'd like to set for the specified key
 */
function set(key, value) {
	Cookies.set(key, value);
}

module.exports = {
	get: get
	, set: set
};